import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  createRoom,
  joinRoom,
  leaveRoom,
  getRoom,
  getRoomBySocket,
  updatePlayer,
  updateWordleConfig,
  startWordleGame,
  handleWordleGuess,
  advanceScoreModeRound,
  restartGame,
  returnToLobby,
  getWordStats,
  calculateLeaderboard,
  selectGame,
  selectSnakeClass,
  startSnakeGame,
  handleSnakeInput,
  restartSnakeGame
} from './roomManager.js';
import { SNAKE_CLASSES } from './snakeLogic.js';
import {
  getWordDetails,
  getWordsDetailsMap,
  getTDKStats
} from './tdkService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: Date.now() });
});

app.get('/api/words/stats', (req, res) => {
  res.json(getWordStats());
});

app.get('/api/tdk/stats', (req, res) => {
  res.json({ success: true, ...getTDKStats() });
});

app.get('/api/tdk/:word', async (req, res) => {
  try {
    const details = await getWordDetails(req.params.word);
    res.json({ success: true, data: details });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve frontend in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Round advance timeouts
const activeTimers = new Map();

/**
 * Helper to broadcast authoritative game over event with rich TDK definitions
 */
async function emitGameOver(room, leaderboard, mode) {
  room.gameState = 'game_over';
  const words = room.wordleSession?.words || [];
  const wordDetails = await getWordsDetailsMap(words);
  console.log(`[Game Over Broadcast] Room ${room.code}, Mode: ${mode}, Words:`, words);
  io.to(room.code).emit('game_over', {
    room,
    leaderboard,
    playerProgress: room.wordleSession?.playerProgress || {},
    words,
    wordDetails,
    mode
  });
}

app.get('/api/snake/classes', (req, res) => {
  res.json({ success: true, classes: SNAKE_CLASSES });
});

// Snake Active Game Loops
const snakeGameLoops = new Map();

function stopSnakeLoop(roomCode) {
  if (snakeGameLoops.has(roomCode)) {
    clearInterval(snakeGameLoops.get(roomCode));
    snakeGameLoops.delete(roomCode);
    console.log(`[Snake Loop Stopped] Room ${roomCode}`);
  }
}

function startSnakeLoop(room) {
  stopSnakeLoop(room.code);
  console.log(`[Snake Loop Started] Room ${room.code} with ${room.players.length} players`);

  const loopId = setInterval(() => {
    if (!room.snakeSession || room.gameState !== 'playing') {
      stopSnakeLoop(room.code);
      return;
    }

    const tickResult = room.snakeSession.tick(Date.now());

    // Broadcast current arena state
    io.to(room.code).emit('snake_state', tickResult.state);

    // Broadcast in-game events (kills, food eaten, etc.)
    if (tickResult.events && tickResult.events.length > 0) {
      io.to(room.code).emit('snake_events', tickResult.events);
    }

    // Check if match ended
    if (tickResult.gameOver) {
      stopSnakeLoop(room.code);
      room.gameState = 'game_over';
      console.log(`[Snake Match Ended] Room ${room.code}`);
      io.to(room.code).emit('snake_game_over', {
        room,
        leaderboard: tickResult.leaderboard
      });
    }
  }, 45); // ~22 ticks per second

  snakeGameLoops.set(room.code, loopId);
}

io.on('connection', (socket) => {
  console.log(`[Socket] Connected: ${socket.id}`);

  // Create room
  socket.on('create_room', ({ playerName, avatar }, callback) => {
    try {
      const room = createRoom(socket.id, playerName, avatar);
      socket.join(room.code);
      console.log(`[Room Created] Code: ${room.code} by ${playerName}`);
      if (typeof callback === 'function') callback({ success: true, room });
      io.to(room.code).emit('room_updated', room);
    } catch (err) {
      console.error('Error creating room:', err);
      if (typeof callback === 'function') callback({ success: false, error: 'Oda oluşturulamadı.' });
    }
  });

  // Join room
  socket.on('join_room', ({ roomCode, playerName, avatar }, callback) => {
    try {
      const result = joinRoom(socket.id, roomCode, playerName, avatar);
      if (result.error) {
        if (typeof callback === 'function') callback({ success: false, error: result.error });
        return;
      }
      const room = result.room;
      socket.join(room.code);
      console.log(`[Room Joined] Code: ${room.code} by ${playerName}`);
      if (typeof callback === 'function') callback({ success: true, room });
      io.to(room.code).emit('room_updated', room);
    } catch (err) {
      console.error('Error joining room:', err);
      if (typeof callback === 'function') callback({ success: false, error: 'Odaya katılırken hata oluştu.' });
    }
  });

  // Update player profile/ready
  socket.on('update_player', (updates, callback) => {
    const result = updatePlayer(socket.id, updates);
    if (result && result.room) {
      io.to(result.room.code).emit('room_updated', result.room);
      if (typeof callback === 'function') callback({ success: true });
    }
  });

  // Update Wordle config
  socket.on('update_wordle_config', (config) => {
    const room = updateWordleConfig(socket.id, config);
    if (room) {
      io.to(room.code).emit('room_updated', room);
    }
  });

  // Start Wordle Game
  socket.on('start_wordle', (callback) => {
    const result = startWordleGame(socket.id);
    if (result.error) {
      if (typeof callback === 'function') callback({ success: false, error: result.error });
      return;
    }
    const room = result.room;
    console.log(`[Wordle Started] Room ${room.code}`);
    io.to(room.code).emit('game_started', room);
    if (typeof callback === 'function') callback({ success: true });
  });

  // Wordle Guess
  socket.on('wordle_guess', async ({ guess }, callback) => {
    try {
      const result = handleWordleGuess(socket.id, guess);
      if (result.error) {
        if (typeof callback === 'function') callback({ success: false, error: result.error, invalidWord: result.invalidWord });
        return;
      }

      const room = result.room;

      // Send guess result back to the player
      if (typeof callback === 'function') {
        callback({
          success: true,
          result: result.result,
          isCorrect: result.isCorrect,
          isFailed: result.isFailed,
          pointsEarned: result.pointsEarned,
          targetWord: result.targetWord,
          currentWordIndex: result.currentWordIndex,
          isGameFinished: result.isGameFinished,
          isWaitingOthers: result.isWaitingOthers
        });
      }

      // Broadcast opponent progress update to other players in room
      io.to(room.code).emit('opponent_updated', {
        playerProgress: room.wordleSession.playerProgress,
        room
      });

      // Handle Speed Mode Game Over
      if (room.wordleSession.mode === 'speed' && result.gameOver) {
        console.log(`[Speed Mode Game Over] Room ${room.code}`);
        const leaderboard = result.leaderboard || calculateLeaderboard(room);
        await emitGameOver(room, leaderboard, 'speed');
      }

      // Handle Score Mode Round Finished (all players completed current word)
      if (room.wordleSession.mode === 'score' && result.roundFinishedAll) {
        const session = room.wordleSession;
        const currentTargetWord = session.words[session.roundIndex];
        const currentWordTdk = await getWordDetails(currentTargetWord);

        // Rank players for this round
        const roundRankings = Object.values(session.playerProgress).map(p => ({
          playerId: p.playerId,
          name: p.name,
          avatar: p.avatar,
          isSolved: p.isCurrentWordSolved,
          guessesCount: p.guesses.length,
          roundPoints: p.roundPoints[session.roundIndex] || 0,
          totalScore: p.totalScore
        })).sort((a, b) => b.roundPoints - a.roundPoints);

        const summary = {
          roundIndex: session.roundIndex,
          wordCount: session.wordCount,
          targetWord: currentTargetWord,
          wordDetail: currentWordTdk,
          rankings: roundRankings,
          isFinalRound: session.roundIndex + 1 >= session.wordCount,
          nextRoundIn: 5 // seconds countdown
        };

        session.roundSummary = summary;
        room.gameState = 'round_summary';

        io.to(room.code).emit('round_summary', {
          summary,
          room
        });

        // Clear existing timer if any
        if (activeTimers.has(room.code)) {
          clearTimeout(activeTimers.get(room.code));
        }

        // Schedule next round after 5 seconds
        const timerId = setTimeout(async () => {
          activeTimers.delete(room.code);
          const advanceResult = advanceScoreModeRound(room.code);
          if (!advanceResult) return;

          if (advanceResult.gameOver) {
            const leaderboard = advanceResult.leaderboard || calculateLeaderboard(advanceResult.room);
            await emitGameOver(advanceResult.room, leaderboard, 'score');
          } else if (advanceResult.nextRound) {
            io.to(room.code).emit('next_round_started', {
              room: advanceResult.room,
              roundIndex: advanceResult.roundIndex
            });
          }
        }, 5500);

        activeTimers.set(room.code, timerId);
      }
    } catch (err) {
      console.error('Error handling wordle guess:', err);
      if (typeof callback === 'function') callback({ success: false, error: 'Tahmin işlenirken hata oluştu.' });
    }
  });

  // Chat / Emoji reaction
  socket.on('send_chat', ({ message, emoji }) => {
    const room = getRoomBySocket(socket.id);
    if (!room) return;

    const player = room.players.find(p => p.id === socket.id);
    const chatItem = {
      id: Math.random().toString(36).substring(2, 9),
      senderId: socket.id,
      senderName: player ? player.name : 'Oyuncu',
      avatar: player ? player.avatar : '💬',
      message: message ? message.slice(0, 100) : '',
      emoji: emoji || null,
      time: Date.now()
    };

    room.chat.push(chatItem);
    if (room.chat.length > 50) room.chat.shift();

    io.to(room.code).emit('chat_received', chatItem);
  });

  // Rematch (Wordle)
  socket.on('rematch', (callback) => {
    const result = restartGame(socket.id);
    if (result.error) {
      if (typeof callback === 'function') callback({ success: false, error: result.error });
      return;
    }
    io.to(result.room.code).emit('game_started', result.room);
    if (typeof callback === 'function') callback({ success: true });
  });

  // Select Game (Wordle / Snake)
  socket.on('select_game', ({ gameId }, callback) => {
    const room = selectGame(socket.id, gameId);
    if (!room) {
      if (typeof callback === 'function') callback({ success: false });
      return;
    }
    console.log(`[Game Selected] Room ${room.code} switched to ${gameId}`);
    io.to(room.code).emit('room_updated', room);
    if (typeof callback === 'function') callback({ success: true, room });
  });

  // Select Snake Class
  socket.on('select_snake_class', ({ snakeClass }, callback) => {
    const res = selectSnakeClass(socket.id, snakeClass);
    if (!res) {
      if (typeof callback === 'function') callback({ success: false });
      return;
    }
    io.to(res.room.code).emit('room_updated', res.room);
    if (typeof callback === 'function') callback({ success: true, player: res.player });
  });

  // Start Snake Game
  socket.on('start_snake', (callback) => {
    const result = startSnakeGame(socket.id);
    if (result.error) {
      if (typeof callback === 'function') callback({ success: false, error: result.error });
      return;
    }
    const room = result.room;
    console.log(`[Snake Started] Room ${room.code}`);
    io.to(room.code).emit('game_started', room);
    startSnakeLoop(room);
    if (typeof callback === 'function') callback({ success: true });
  });

  // Snake Direction Input
  socket.on('snake_input', ({ dir }) => {
    handleSnakeInput(socket.id, dir);
  });

  // Snake Rematch
  socket.on('snake_rematch', (callback) => {
    const result = restartSnakeGame(socket.id);
    if (result.error) {
      if (typeof callback === 'function') callback({ success: false, error: result.error });
      return;
    }
    const room = result.room;
    console.log(`[Snake Rematch Started] Room ${room.code}`);
    io.to(room.code).emit('game_started', room);
    startSnakeLoop(room);
    if (typeof callback === 'function') callback({ success: true });
  });

  // Return to Lobby
  socket.on('return_to_lobby', (callback) => {
    const room = getRoomBySocket(socket.id);
    if (room) stopSnakeLoop(room.code);
    const result = returnToLobby(socket.id);
    if (result.error) {
      if (typeof callback === 'function') callback({ success: false, error: result.error });
      return;
    }
    io.to(result.room.code).emit('lobby_returned', result.room);
    if (typeof callback === 'function') callback({ success: true });
  });

  const checkGameCompletion = async (room) => {
    if (room && room.gameState === 'playing' && room.wordleSession?.mode === 'speed') {
      const connectedIds = new Set(room.players.map(p => p.id));
      const activeProgresses = Object.values(room.wordleSession.playerProgress).filter(p => connectedIds.has(p.playerId));
      const allFinished = activeProgresses.length > 0 && activeProgresses.every(p => p.isGameFinished);
      if (allFinished) {
        const leaderboard = calculateLeaderboard(room);
        await emitGameOver(room, leaderboard, 'speed');
      }
    }
  };

  // Leave Room
  socket.on('leave_room', () => {
    const result = leaveRoom(socket.id);
    if (result && result.room) {
      socket.leave(result.room.code);
      if (result.room.players.length === 0) {
        stopSnakeLoop(result.room.code);
      }
      checkGameCompletion(result.room);
      io.to(result.room.code).emit('room_updated', result.room);
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`[Socket] Disconnected: ${socket.id}`);
    const result = leaveRoom(socket.id);
    if (result && result.room) {
      if (result.room.players.length === 0) {
        stopSnakeLoop(result.room.code);
      }
      checkGameCompletion(result.room);
      io.to(result.room.code).emit('room_updated', result.room);
    }
  });
});

// For client side routing in production
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('GameHub API Server Running.');
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 GameHub server running on http://localhost:${PORT}`);
});
