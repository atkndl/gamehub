import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { evaluateWordleGuess, isWordleCorrect, toTurkishLower } from './wordleLogic.js';
import { SnakeSession, SNAKE_CLASSES } from './snakeLogic.js';
import { SurvivalSession } from './survivalLogic.js';
import { LiarsBarSession } from './liarsBarLogic.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load words
const wordsPath = path.join(__dirname, 'words.json');
const targetWordsPath = path.join(__dirname, 'target_words.json');
const tdkWordsPath = path.join(__dirname, 'tdk_words_5.json');

let allWordsList = [];
let allWordsSet = new Set();
let targetWordsList = [];
let allTdkWordsList = [];

try {
  allWordsList = JSON.parse(fs.readFileSync(wordsPath, 'utf-8'));
  allWordsSet = new Set(allWordsList.map(w => toTurkishLower(w)));
} catch (e) {
  console.error('Error loading words.json:', e);
}

try {
  targetWordsList = JSON.parse(fs.readFileSync(targetWordsPath, 'utf-8'));
} catch (e) {
  console.warn('target_words.json not found, using allWordsList');
}

try {
  const tdkObj = JSON.parse(fs.readFileSync(tdkWordsPath, 'utf-8'));
  allTdkWordsList = Object.keys(tdkObj);
} catch (e) {
  console.warn('tdk_words_5.json not found');
}

if (!targetWordsList.length) {
  targetWordsList = allTdkWordsList.length ? allTdkWordsList : allWordsList;
}

if (!allTdkWordsList.length) {
  allTdkWordsList = targetWordsList;
}

console.log(`[RoomManager] Loaded ${allWordsSet.size} valid guess words, ${targetWordsList.length} standard TDK target words, and ${allTdkWordsList.length} total TDK words.`);

export function getWordStats() {
  return {
    validCount: allWordsSet.size,
    targetCount: targetWordsList.length,
    tdkTotal: allTdkWordsList.length
  };
}

export function isValidWord(word) {
  if (!word || word.length !== 5) return false;
  return allWordsSet.has(toTurkishLower(word));
}

export function pickRandomWords(count, pool = 'common') {
  // Always select strictly from official TDK dictionary
  const source = (pool === 'all' && allTdkWordsList.length > 0) ? allTdkWordsList : targetWordsList;
  const picked = [];
  const used = new Set();

  let attempts = 0;
  while (picked.length < count && attempts < 1000) {
    attempts++;
    const idx = Math.floor(Math.random() * source.length);
    const word = source[idx];
    if (!used.has(word)) {
      used.add(word);
      picked.push(word);
    }
  }

  // Fallback if needed
  while (picked.length < count) {
    const idx = Math.floor(Math.random() * source.length);
    picked.push(source[idx]);
  }

  return picked;
}

/**
 * Pick unique disjoint random words that are not in excludeSet.
 * Mutates excludeSet by adding picked words so subsequent calls remain disjoint.
 */
export function pickDisjointWords(count, pool = 'common', excludeSet = new Set()) {
  const source = (pool === 'all' && allTdkWordsList.length > 0) ? allTdkWordsList : targetWordsList;
  const picked = [];
  let attempts = 0;
  const maxAttempts = count * 200;

  while (picked.length < count && attempts < maxAttempts) {
    attempts++;
    const idx = Math.floor(Math.random() * source.length);
    const word = source[idx];
    if (!excludeSet.has(word)) {
      excludeSet.add(word);
      picked.push(word);
    }
  }

  // Fallback in case random attempts miss
  if (picked.length < count) {
    for (const w of source) {
      if (!excludeSet.has(w)) {
        excludeSet.add(w);
        picked.push(w);
        if (picked.length >= count) break;
      }
    }
  }

  return picked;
}

// In-memory store for active rooms
const rooms = new Map();
// Socket ID to room code mapping
const socketToRoom = new Map();

function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function createRoom(socketId, playerName, avatar) {
  let roomCode = generateRoomCode();
  while (rooms.has(roomCode)) {
    roomCode = generateRoomCode();
  }

  const hostPlayer = {
    id: socketId,
    name: playerName || 'Oyuncu 1',
    avatar: avatar || '🦁',
    isHost: true,
    ready: true,
    score: 0,
    connected: true,
    snakeClass: 'speed'
  };

  const room = {
    code: roomCode,
    hostId: socketId,
    createdAt: Date.now(),
    selectedGame: 'wordle',
    gameState: 'lobby', // 'lobby' | 'playing' | 'round_summary' | 'game_over'
    players: [hostPlayer],
    chat: [],
    wordleConfig: {
      wordCount: 5,
      mode: 'speed', // 'speed' | 'score'
      scoringType: 'speed', // 'speed' | 'guesses'
      wordPool: 'common', // 'common' | 'all'
      isTroubleMode: false
    },
    wordleSession: null,
    troubleSession: null,
    snakeConfig: {
      hazardFrequency: 'normal'
    },
    snakeSession: null,
    survivalConfig: {
      mode: 'battle_royale', // 'battle_royale' (Alan Modu) | 'deathmatch' (Maç Modu)
      matchDuration: 180 // 3 minutes
    },
    survivalSession: null,
    liarsBarConfig: {},
    liarsBarSession: null
  };

  rooms.set(roomCode, room);
  socketToRoom.set(socketId, roomCode);

  return room;
}

export function joinRoom(socketId, roomCode, playerName, avatar) {
  const cleanCode = roomCode ? roomCode.trim().toUpperCase() : '';
  const room = rooms.get(cleanCode);

  if (!room) {
    return { error: 'Oda bulunamadı! Lütfen kodu kontrol edin.' };
  }

  if (room.gameState !== 'lobby') {
    return { error: 'Bu odada şu anda bir oyun oynanıyor. Lütfen tur bitimini bekleyin veya yeni oda kurun.' };
  }

  if (room.players.length >= 12) {
    return { error: 'Oda dolu (Maksimum 12 oyuncu)!' };
  }

  // Check if player already in room
  let existing = room.players.find(p => p.id === socketId);
  if (!existing) {
    existing = {
      id: socketId,
      name: playerName || `Oyuncu ${room.players.length + 1}`,
      avatar: avatar || '🦊',
      isHost: false,
      ready: false,
      score: 0,
      connected: true,
      snakeClass: 'speed'
    };
    room.players.push(existing);
  } else {
    existing.connected = true;
    existing.name = playerName || existing.name;
    existing.avatar = avatar || existing.avatar;
  }

  socketToRoom.set(socketId, cleanCode);
  return { room };
}

export function getRoom(roomCode) {
  if (!roomCode) return null;
  return rooms.get(roomCode.trim().toUpperCase()) || null;
}

export function touchRoomActivity(roomCode) {
  const room = rooms.get(roomCode?.trim()?.toUpperCase());
  if (room) {
    room.lastActiveAt = Date.now();
  }
}

/**
 * Get active joinable rooms with online player count, selected game, etc.
 * Also automatically purges abandoned / empty / timed out rooms (>15 minutes inactive or 0 players)
 */
export function getActiveRoomsList() {
  const now = Date.now();
  const maxInactiveMs = 15 * 60 * 1000; // 15 mins
  const activeList = [];

  for (const [code, r] of rooms.entries()) {
    // Purge if 0 players or no connected players
    const connectedPlayers = (r.players || []).filter(p => p.connected !== false);
    const lastActive = r.lastActiveAt || r.createdAt || now;

    if (connectedPlayers.length === 0 || (now - lastActive > maxInactiveMs)) {
      rooms.delete(code);
      continue;
    }

    activeList.push({
      code: r.code,
      hostName: r.players[0]?.name || 'Oda Sahibi',
      hostAvatar: r.players[0]?.avatar || '👑',
      playerCount: connectedPlayers.length,
      maxPlayers: 12,
      selectedGame: r.selectedGame || 'wordle',
      gameState: r.gameState, // 'lobby' | 'playing'
      createdAt: r.createdAt
    });
  }

  // Sort by newest and joinable (lobby first)
  activeList.sort((a, b) => {
    if (a.gameState === 'lobby' && b.gameState !== 'lobby') return -1;
    if (a.gameState !== 'lobby' && b.gameState === 'lobby') return 1;
    return b.createdAt - a.createdAt;
  });

  return activeList;
}

export function getRoomBySocket(socketId) {
  const roomCode = socketToRoom.get(socketId);
  if (!roomCode) return null;
  return rooms.get(roomCode) || null;
}

export function leaveRoom(socketId) {
  const roomCode = socketToRoom.get(socketId);
  if (!roomCode) return null;

  const room = rooms.get(roomCode);
  socketToRoom.delete(socketId);

  if (!room) return null;

  room.players = room.players.filter(p => p.id !== socketId);

  if (room.players.length === 0) {
    // Delete empty room
    rooms.delete(roomCode);
    return { roomDeleted: true, roomCode };
  }

  // If host left, transfer host
  if (room.hostId === socketId) {
    room.hostId = room.players[0].id;
    room.players[0].isHost = true;
    room.players[0].ready = true;
  }

  return { room, playerLeftId: socketId };
}

export function updatePlayer(socketId, updates) {
  const room = getRoomBySocket(socketId);
  if (!room) return null;

  const player = room.players.find(p => p.id === socketId);
  if (!player) return null;

  if (updates.name) player.name = updates.name.slice(0, 16);
  if (updates.avatar) player.avatar = updates.avatar;
  if (typeof updates.ready === 'boolean') player.ready = updates.ready;
  if (updates.snakeClass && SNAKE_CLASSES[updates.snakeClass]) {
    player.snakeClass = updates.snakeClass;
  }

  return { room, player };
}

export function updateWordleConfig(socketId, newConfig) {
  const room = getRoomBySocket(socketId);
  if (!room || room.hostId !== socketId) return null;

  if (room.gameState !== 'lobby') return null;

  room.wordleConfig = {
    ...room.wordleConfig,
    ...newConfig
  };

  return room;
}

export function startWordleGame(socketId) {
  const room = getRoomBySocket(socketId);
  if (!room || room.hostId !== socketId) return { error: 'Sadece oda sahibi oyunu başlatabilir.' };

  const config = room.wordleConfig;

  // Trouble Mode Check
  if (config.isTroubleMode) {
    if (room.players.length < 2) {
      return { error: 'Trouble (Meydan Okuma) Modu en az 2 oyuncu gerektirir!' };
    }

    const N = room.players.length;
    const assignments = {};
    room.players.forEach((p, i) => {
      const targetP = room.players[(i + 1) % N];
      const sourceP = room.players[(i - 1 + N) % N];
      assignments[p.id] = {
        targetId: targetP.id,
        targetName: targetP.name,
        targetAvatar: targetP.avatar,
        sourceId: sourceP.id,
        sourceName: sourceP.name,
        sourceAvatar: sourceP.avatar
      };
    });

    const usedWordsSet = new Set();
    const pools = {};
    room.players.forEach(p => {
      pools[p.id] = pickDisjointWords(20, config.wordPool, usedWordsSet);
    });

    room.gameState = 'trouble_selection';
    room.troubleSession = {
      assignments,
      pools,
      selectedWords: {}, // { [playerId]: [5 words] }
      confirmedPlayers: {}, // { [playerId]: true }
      usedWordsSet,
      config: { ...config }
    };

    console.log(`[Trouble Selection Started] Room ${room.code}, Players: ${N}`);
    return { room, troubleSelection: true };
  }

  const wordCount = [1, 3, 5, 10].includes(Number(config.wordCount)) ? Number(config.wordCount) : 5;
  const targetWords = pickRandomWords(wordCount, config.wordPool);

  console.log(`[Wordle Start] Room: ${room.code}, Count: ${wordCount}, Mode: ${config.mode}, Words:`, targetWords);

  const playerProgress = {};
  room.players.forEach(p => {
    p.score = 0;
    playerProgress[p.id] = {
      playerId: p.id,
      name: p.name,
      avatar: p.avatar,
      currentWordIndex: 0,
      guesses: [], // current word guesses: [{ guess, result }]
      wordHistory: [], // [{ wordIndex, word, isSolved, isFailed, guessCount, points }]
      solvedWordsCount: 0,
      isCurrentWordSolved: false,
      isCurrentWordFailed: false,
      isGameFinished: false,
      finishRank: null,
      finishTime: null,
      roundPoints: [],
      totalScore: 0,
      lastGuessTime: Date.now()
    };
  });

  room.gameState = 'playing';
  room.troubleSession = null;
  room.wordleSession = {
    words: targetWords,
    wordCount,
    mode: config.mode, // 'speed' | 'score'
    scoringType: config.scoringType, // 'speed' | 'guesses'
    startTime: Date.now(),
    roundIndex: 0, // Used in score mode
    roundStartTime: Date.now(),
    playerProgress,
    finishedCount: 0,
    roundSummary: null
  };

  return { room };
}

/**
 * Handle Trouble Mode pool refresh for unselected words
 */
export function handleTroubleRefreshPool(socketId, keptWords = []) {
  const room = getRoomBySocket(socketId);
  if (!room || room.gameState !== 'trouble_selection' || !room.troubleSession) {
    return { error: 'Aktif bir Trouble kelime seçimi bulunamadı.' };
  }

  const session = room.troubleSession;
  const currentPool = session.pools[socketId] || [];

  // Filter kept words to those actually in player's current pool (max 5)
  const validKept = (Array.isArray(keptWords) ? keptWords : [])
    .filter(w => currentPool.includes(w))
    .slice(0, 5);

  const countNeeded = Math.max(0, 20 - validKept.length);
  const newWords = pickDisjointWords(countNeeded, session.config?.wordPool || 'common', session.usedWordsSet);
  const newPool = [...validKept, ...newWords];

  session.pools[socketId] = newPool;

  return { success: true, pool: newPool, keptWords: validKept, room };
}

/**
 * Handle Trouble Mode player 5-word confirmation
 */
export function handleTroubleConfirmSelection(socketId, selectedWords = []) {
  const room = getRoomBySocket(socketId);
  if (!room || room.gameState !== 'trouble_selection' || !room.troubleSession) {
    return { error: 'Aktif bir Trouble seçimi bulunamadı.' };
  }

  if (!Array.isArray(selectedWords) || selectedWords.length !== 5) {
    return { error: 'Tam olarak 5 kelime seçmelisiniz.' };
  }

  const session = room.troubleSession;
  const pool = session.pools[socketId] || [];
  const normalizedPool = pool.map(w => toTurkishLower(w));
  const normalizedSelected = selectedWords.map(w => toTurkishLower(w));

  const allInPool = normalizedSelected.every(w => normalizedPool.includes(w));
  if (!allInPool) {
    return { error: 'Seçilen kelimeler havuzunuzda bulunamadı.' };
  }

  session.selectedWords[socketId] = normalizedSelected;
  session.confirmedPlayers[socketId] = true;

  const totalPlayers = room.players.length;
  const confirmedCount = Object.keys(session.confirmedPlayers).length;
  const allConfirmed = room.players.every(p => session.confirmedPlayers[p.id]);

  if (!allConfirmed) {
    return {
      success: true,
      allConfirmed: false,
      confirmedCount,
      totalPlayers,
      confirmedPlayers: session.confirmedPlayers,
      room
    };
  }

  // All players confirmed! Assign words in a ring:
  // Player P receives words chosen for them by their sourceId
  const playerWords = {};
  room.players.forEach(p => {
    const sourceId = session.assignments[p.id].sourceId;
    playerWords[p.id] = session.selectedWords[sourceId] || [];
  });

  const config = session.config;
  const playerProgress = {};
  room.players.forEach(p => {
    p.score = 0;
    playerProgress[p.id] = {
      playerId: p.id,
      name: p.name,
      avatar: p.avatar,
      currentWordIndex: 0,
      guesses: [],
      wordHistory: [],
      solvedWordsCount: 0,
      isCurrentWordSolved: false,
      isCurrentWordFailed: false,
      isGameFinished: false,
      finishRank: null,
      finishTime: null,
      roundPoints: [],
      totalScore: 0,
      lastGuessTime: Date.now()
    };
  });

  room.gameState = 'playing';
  room.wordleSession = {
    words: playerWords[room.hostId] || [], // fallback
    playerWords,
    wordCount: 5,
    mode: config.mode, // 'speed' | 'score'
    scoringType: config.scoringType, // 'speed' | 'guesses'
    isTroubleMode: true,
    troubleAssignments: session.assignments,
    startTime: Date.now(),
    roundIndex: 0,
    roundStartTime: Date.now(),
    playerProgress,
    finishedCount: 0,
    roundSummary: null
  };

  console.log(`[Trouble Match Started] Room: ${room.code}, playerWords:`, playerWords);

  return {
    success: true,
    allConfirmed: true,
    confirmedCount: totalPlayers,
    totalPlayers,
    room
  };
}

/**
 * Handle a guess in Wordle
 */
export function handleWordleGuess(socketId, guessWord) {
  const room = getRoomBySocket(socketId);
  if (!room || room.gameState !== 'playing' || !room.wordleSession) {
    return { error: 'Aktif bir oyun bulunamadı.' };
  }

  const session = room.wordleSession;
  const progress = session.playerProgress[socketId];
  if (!progress) {
    return { error: 'Oyuncu bulunamadı.' };
  }

  if (progress.isGameFinished) {
    return { error: 'Tüm kelimeleri zaten tamamladınız!' };
  }

  if (session.mode === 'score' && (progress.isCurrentWordSolved || progress.isCurrentWordFailed)) {
    return { error: 'Bu kelimeyi tamamladınız, diğer oyuncular bekleniyor.' };
  }

  const cleanGuess = toTurkishLower(guessWord || '');
  if (cleanGuess.length !== 5) {
    return { error: 'Kelime 5 harfli olmalıdır.' };
  }

  if (!isValidWord(cleanGuess)) {
    return { error: 'Kelime listesinde bulunamadı!', invalidWord: true };
  }

  // Which word is this player currently on?
  const wordIndex = session.mode === 'speed' ? progress.currentWordIndex : session.roundIndex;
  const targetWord = (session.playerWords && session.playerWords[socketId])
    ? session.playerWords[socketId][wordIndex]
    : session.words[wordIndex];

  // Evaluate guess
  const result = evaluateWordleGuess(targetWord, cleanGuess);
  const isCorrect = isWordleCorrect(result);

  progress.guesses.push({
    guess: cleanGuess,
    result,
    time: Date.now()
  });

  const guessNumber = progress.guesses.length;
  const isFailed = !isCorrect && guessNumber >= 6;

  let pointsEarned = 0;
  let wordFinished = isCorrect || isFailed;

  if (wordFinished) {
    const elapsedSeconds = Math.max(1, Math.round((Date.now() - (session.mode === 'speed' ? progress.lastGuessTime : session.roundStartTime)) / 1000));

    if (isCorrect) {
      progress.solvedWordsCount++;
      progress.isCurrentWordSolved = true;

      // Calculate score
      if (session.mode === 'score') {
        if (session.scoringType === 'speed') {
          // Speed based points: 1000 base, -15 per second, minimum 300
          pointsEarned = Math.max(300, 1000 - (elapsedSeconds * 15));
        } else {
          // Guess count based points: 1:1000, 2:850, 3:700, 4:550, 5:400, 6:250
          const ptsMap = { 1: 1000, 2: 850, 3: 700, 4: 550, 5: 400, 6: 250 };
          pointsEarned = ptsMap[guessNumber] || 250;
        }
      } else {
        // Speed mode points
        pointsEarned = 500 + Math.max(50, 500 - (guessNumber * 60));
      }
    } else {
      progress.isCurrentWordFailed = true;
      pointsEarned = 0;
    }

    if (!progress.wordHistory) progress.wordHistory = [];
    progress.wordHistory.push({
      wordIndex,
      word: targetWord,
      isSolved: isCorrect,
      isFailed: isFailed,
      guessCount: guessNumber,
      points: pointsEarned
    });

    progress.roundPoints.push(pointsEarned);
    progress.totalScore += pointsEarned;
    const playerObj = room.players.find(p => p.id === socketId);
    if (playerObj) playerObj.score = progress.totalScore;
  }

  // Prepare opponent view (masked - only tile colors, not letters)
  const opponentProgressData = {
    playerId: socketId,
    currentWordIndex: progress.currentWordIndex,
    solvedWordsCount: progress.solvedWordsCount,
    guessesCount: progress.guesses.length,
    latestResult: result, // colors only
    isSolved: progress.isCurrentWordSolved,
    isFailed: progress.isCurrentWordFailed,
    isGameFinished: progress.isGameFinished,
    totalScore: progress.totalScore
  };

  // Speed Mode advancement
  if (session.mode === 'speed') {
    if (wordFinished) {
      // Advance to next word immediately
      if (progress.currentWordIndex + 1 < session.wordCount) {
        progress.currentWordIndex++;
        progress.guesses = [];
        progress.isCurrentWordSolved = false;
        progress.isCurrentWordFailed = false;
        progress.lastGuessTime = Date.now();
      } else {
        // Player finished all words in speed mode!
        progress.isGameFinished = true;
        session.finishedCount++;
        progress.finishTime = Date.now() - session.startTime;
      }
    }

    // Check if all connected active players finished
    const connectedPlayerIds = new Set(room.players.map(p => p.id));
    const activeProgresses = Object.values(session.playerProgress).filter(p => connectedPlayerIds.has(p.playerId));
    const allFinished = activeProgresses.length > 0 && activeProgresses.every(p => p.isGameFinished);

    let gameOver = false;
    let leaderboard = [];
    if (allFinished) {
      gameOver = true;
      room.gameState = 'game_over';
      leaderboard = calculateLeaderboard(room);

      leaderboard.forEach((item) => {
        const p = session.playerProgress[item.playerId];
        if (p) p.finishRank = item.rank;
      });
    }

    return {
      success: true,
      result,
      isCorrect,
      isFailed,
      pointsEarned,
      currentWordIndex: progress.currentWordIndex,
      isGameFinished: progress.isGameFinished,
      targetWord: isFailed ? targetWord : (isCorrect ? targetWord : null),
      opponentProgressData,
      gameOver,
      leaderboard,
      room
    };
  }

  // Score Mode handling (round-by-round)
  if (session.mode === 'score') {
    // Check if all players have completed the current round word
    const allRoundFinished = Object.values(session.playerProgress).every(
      p => p.isCurrentWordSolved || p.isCurrentWordFailed
    );

    return {
      success: true,
      result,
      isCorrect,
      isFailed,
      pointsEarned,
      isWaitingOthers: wordFinished && !allRoundFinished,
      roundFinishedAll: allRoundFinished,
      targetWord: wordFinished ? targetWord : null,
      opponentProgressData,
      room
    };
  }

  return { success: true, result, isCorrect, opponentProgressData, room };
}

/**
 * Calculate sorted leaderboard for room
 */
export function calculateLeaderboard(room) {
  if (!room || !room.wordleSession) return [];

  const session = room.wordleSession;
  const isSpeed = session.mode === 'speed';
  const connectedPlayerIds = new Set(room.players.map(p => p.id));
  const activeProgresses = Object.values(session.playerProgress).filter(p => connectedPlayerIds.has(p.playerId));

  const sorted = [...activeProgresses].sort((a, b) => {
    if (isSpeed) {
      if (b.solvedWordsCount !== a.solvedWordsCount) {
        return b.solvedWordsCount - a.solvedWordsCount;
      }
      const timeA = a.finishTime !== null ? a.finishTime : Infinity;
      const timeB = b.finishTime !== null ? b.finishTime : Infinity;
      if (timeA !== timeB) {
        return timeA - timeB;
      }
      return (b.totalScore || 0) - (a.totalScore || 0);
    } else {
      if ((b.totalScore || 0) !== (a.totalScore || 0)) {
        return (b.totalScore || 0) - (a.totalScore || 0);
      }
      return b.solvedWordsCount - a.solvedWordsCount;
    }
  });

  return sorted.map((p, idx) => ({
    rank: idx + 1,
    playerId: p.playerId,
    name: p.name,
    avatar: p.avatar,
    solvedWordsCount: p.solvedWordsCount,
    wordCount: session.wordCount,
    finishTime: p.finishTime,
    totalScore: p.totalScore || 0,
    roundPoints: p.roundPoints || [],
    isWinner: idx === 0
  }));
}

/**
 * In score mode, advance to next round after round summary
 */
export function advanceScoreModeRound(roomCode) {
  const room = rooms.get(roomCode);
  if (!room || !room.wordleSession) return null;

  const session = room.wordleSession;
  if (session.mode !== 'score') return null;

  if (session.roundIndex + 1 < session.wordCount) {
    session.roundIndex++;
    session.roundStartTime = Date.now();
    session.roundSummary = null;
    room.gameState = 'playing';

    // Reset each player's round state
    Object.values(session.playerProgress).forEach(p => {
      p.currentWordIndex = session.roundIndex;
      p.guesses = [];
      p.isCurrentWordSolved = false;
      p.isCurrentWordFailed = false;
    });

    return { nextRound: true, roundIndex: session.roundIndex, room };
  } else {
    // Game over!
    room.gameState = 'game_over';
    const leaderboard = calculateLeaderboard(room);
    return { gameOver: true, room, leaderboard };
  }
}

export function restartGame(socketId) {
  let room = getRoomBySocket(socketId);
  if (!room) {
    for (const r of rooms.values()) {
      if (r.hostId === socketId || r.players.some(p => p.id === socketId)) {
        room = r;
        break;
      }
    }
  }
  if (!room) return { error: 'Oda bulunamadı.' };

  const player = room.players.find(p => p.id === socketId);
  const isHost = (room.hostId === socketId) || (player && player.isHost) || (room.players.length > 0 && room.players[0].id === socketId) || (room.players.length <= 1);
  if (!isHost) return { error: 'Sadece oda sahibi oyunu yeniden başlatabilir.' };

  room.hostId = socketId;
  if (player) player.isHost = true;

  return startWordleGame(socketId);
}

export function returnToLobby(socketId) {
  let room = getRoomBySocket(socketId);
  if (!room) {
    for (const r of rooms.values()) {
      if (r.hostId === socketId || r.players.some(p => p.id === socketId)) {
        room = r;
        break;
      }
    }
  }
  if (!room) return { error: 'Oda bulunamadı.' };

  const player = room.players.find(p => p.id === socketId);
  const isHost = (room.hostId === socketId) || (player && player.isHost) || (room.players.length > 0 && room.players[0].id === socketId) || (room.players.length <= 1);
  if (!isHost) return { error: 'Sadece oda sahibi lobiye dönebilir.' };

  // Re-sync hostId and isHost to current socket
  room.hostId = socketId;
  if (player) player.isHost = true;

  room.gameState = 'lobby';
  room.wordleSession = null;
  room.troubleSession = null;
  room.snakeSession = null;
  room.survivalSession = null;
  room.liarsBarSession = null;
  room.players.forEach(p => {
    p.score = 0;
  });

  return { room };
}

export function selectGame(socketId, gameId) {
  const room = getRoomBySocket(socketId);
  if (!room || room.hostId !== socketId) return null;
  if (room.gameState !== 'lobby') return null;
  if (!['wordle', 'snake', 'survival', 'liars_bar'].includes(gameId)) return null;

  room.selectedGame = gameId;
  return room;
}

export function selectSnakeClass(socketId, snakeClass) {
  const room = getRoomBySocket(socketId);
  if (!room) return null;
  const player = room.players.find(p => p.id === socketId);
  if (!player) return null;
  if (!SNAKE_CLASSES[snakeClass]) return null;

  player.snakeClass = snakeClass;
  return { room, player };
}

export function startSnakeGame(socketId) {
  const room = getRoomBySocket(socketId);
  if (!room || room.hostId !== socketId) return { error: 'Sadece oda sahibi oyunu başlatabilir.' };

  room.selectedGame = 'snake';
  room.gameState = 'playing';
  room.snakeSession = new SnakeSession(room.code, room.players, room.snakeConfig || {});
  return { room, snakeSession: room.snakeSession };
}

export function handleSnakeInput(socketId, dir) {
  const room = getRoomBySocket(socketId);
  if (!room || room.gameState !== 'playing' || !room.snakeSession) return;
  room.snakeSession.setPlayerDirection(socketId, dir);
}

export function restartSnakeGame(socketId) {
  const room = getRoomBySocket(socketId);
  if (!room || room.hostId !== socketId) return { error: 'Sadece oda sahibi oyunu yeniden başlatabilir.' };
  return startSnakeGame(socketId);
}

export function updateSurvivalConfig(socketId, config) {
  const room = getRoomBySocket(socketId);
  if (!room || room.hostId !== socketId) return null;
  room.survivalConfig = { ...room.survivalConfig, ...config };
  return room;
}

export function verifyHost(socketId) {
  let room = getRoomBySocket(socketId);
  if (!room) {
    for (const r of rooms.values()) {
      if (r.hostId === socketId || (r.players && r.players.some(p => p.id === socketId))) {
        room = r;
        break;
      }
    }
  }
  if (!room) return { error: 'Oda bulunamadı.' };

  const player = room.players.find(p => p.id === socketId);
  const isHost = (room.hostId === socketId) ||
                 (player && player.isHost) ||
                 (room.players.length > 0 && room.players[0].id === socketId) ||
                 (room.players.length <= 1);

  if (!isHost) {
    return { error: 'Sadece oda sahibi bu işlemi yapabilir.' };
  }

  // Synchronize host tracking to avoid any mismatch
  room.hostId = socketId;
  if (player) player.isHost = true;
  room.players.forEach(p => {
    if (p.id !== socketId && p.isHost) p.isHost = false;
  });

  return { room, player };
}

export function startSurvivalGame(socketId) {
  const check = verifyHost(socketId);
  if (check.error) return check;
  const room = check.room;

  room.selectedGame = 'survival';
  room.gameState = 'playing';
  room.survivalSession = new SurvivalSession(room.code, room.players, room.survivalConfig || {});
  return { room, survivalSession: room.survivalSession };
}

export function handleSurvivalInput(socketId, data) {
  const room = getRoomBySocket(socketId);
  if (!room || room.gameState !== 'playing' || !room.survivalSession) return;
  room.survivalSession.handlePlayerInput(socketId, data);
}

export function restartSurvivalGame(socketId) {
  const check = verifyHost(socketId);
  if (check.error) return check;
  return startSurvivalGame(socketId);
}

// ==================== LIAR'S BAR (BLÖF) ====================

export function startLiarsBarGame(socketId) {
  const check = verifyHost(socketId);
  if (check.error) return check;
  const room = check.room;
  if (room.players.length < 2) return { error: "Liar's Bar oyunu en az 2 oyuncu gerektirir!" };

  room.selectedGame = 'liars_bar';
  room.gameState = 'playing';
  room.liarsBarSession = new LiarsBarSession(room.code, room.players, room.liarsBarConfig || {});
  return { room, liarsBarSession: room.liarsBarSession };
}

export function restartLiarsBarGame(socketId) {
  const check = verifyHost(socketId);
  if (check.error) return check;
  return startLiarsBarGame(socketId);
}

export function handleLiarsBarPlay(socketId, cardIds) {
  const room = getRoomBySocket(socketId);
  if (!room || room.gameState !== 'playing' || !room.liarsBarSession) return { error: 'Oyun aktif değil.' };
  return room.liarsBarSession.playCards(socketId, cardIds);
}

export function handleLiarsBarChallenge(socketId) {
  const room = getRoomBySocket(socketId);
  if (!room || room.gameState !== 'playing' || !room.liarsBarSession) return { error: 'Oyun aktif değil.' };
  return room.liarsBarSession.challenge(socketId);
}

export function handleLiarsBarProceedToBomb(socketId) {
  const room = getRoomBySocket(socketId);
  if (!room || room.gameState !== 'playing' || !room.liarsBarSession) return { error: 'Oyun aktif değil.' };
  return room.liarsBarSession.proceedToBomb();
}

export function handleLiarsBarCutWire(socketId, wireId) {
  const room = getRoomBySocket(socketId);
  if (!room || room.gameState !== 'playing' || !room.liarsBarSession) return { error: 'Oyun aktif değil.' };
  return room.liarsBarSession.cutWire(socketId, wireId);
}

export function handleLiarsBarProceedAfterBomb(socketId) {
  const room = getRoomBySocket(socketId);
  if (!room || room.gameState !== 'playing' || !room.liarsBarSession) return { error: 'Oyun aktif değil.' };
  return room.liarsBarSession.proceedAfterBomb();
}

