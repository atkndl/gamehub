import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { evaluateWordleGuess, isWordleCorrect, toTurkishLower } from './wordleLogic.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load words
const wordsPath = path.join(__dirname, 'words.json');
const targetWordsPath = path.join(__dirname, 'target_words.json');

let allWordsList = [];
let allWordsSet = new Set();
let targetWordsList = [];

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
  targetWordsList = allWordsList;
}

if (!targetWordsList.length) {
  targetWordsList = allWordsList;
}

console.log(`[RoomManager] Loaded ${allWordsSet.size} valid guess words and ${targetWordsList.length} target words.`);

export function getWordStats() {
  return {
    validCount: allWordsSet.size,
    targetCount: targetWordsList.length
  };
}

export function isValidWord(word) {
  if (!word || word.length !== 5) return false;
  return allWordsSet.has(toTurkishLower(word));
}

export function pickRandomWords(count, pool = 'common') {
  const source = (pool === 'all' || targetWordsList.length === 0) ? allWordsList : targetWordsList;
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
    connected: true
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
      wordPool: 'common' // 'common' | 'all'
    },
    wordleSession: null
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
      connected: true
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
  const targetWord = session.words[wordIndex];

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
    if (allFinished) {
      gameOver = true;
      room.gameState = 'game_over';

      // Ranking rule:
      // 1. Most solved words count (b.solvedWordsCount - a.solvedWordsCount)
      // 2. If equal, fastest completion time ((a.finishTime || Infinity) - (b.finishTime || Infinity))
      // 3. If equal, highest score (b.totalScore - a.totalScore)
      const sorted = [...activeProgresses].sort((a, b) => {
        if (b.solvedWordsCount !== a.solvedWordsCount) {
          return b.solvedWordsCount - a.solvedWordsCount;
        }
        const timeA = a.finishTime !== null ? a.finishTime : Infinity;
        const timeB = b.finishTime !== null ? b.finishTime : Infinity;
        if (timeA !== timeB) {
          return timeA - timeB;
        }
        return (b.totalScore || 0) - (a.totalScore || 0);
      });

      sorted.forEach((p, idx) => {
        p.finishRank = idx + 1;
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
    return { gameOver: true, room };
  }
}

export function restartGame(socketId) {
  const room = getRoomBySocket(socketId);
  if (!room || room.hostId !== socketId) return { error: 'Sadece oda sahibi oyunu yeniden başlatabilir.' };

  return startWordleGame(socketId);
}

export function returnToLobby(socketId) {
  const room = getRoomBySocket(socketId);
  if (!room || room.hostId !== socketId) return { error: 'Sadece oda sahibi lobiye dönebilir.' };

  room.gameState = 'lobby';
  room.wordleSession = null;
  room.players.forEach(p => {
    p.score = 0;
  });

  return { room };
}
