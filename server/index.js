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
  getWordStats
} from './roomManager.js';

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

// Serve frontend in production
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Round advance timeouts
const activeTimers = new Map();

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
  socket.on('wordle_guess', ({ guess }, callback) => {
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
        io.to(room.code).emit('game_over', {
          room,
          playerProgress: room.wordleSession.playerProgress,
          words: room.wordleSession.words
        });
      }

      // Handle Score Mode Round Finished (all players completed current word)
      if (room.wordleSession.mode === 'score' && result.roundFinishedAll) {
        const session = room.wordleSession;
        const currentTargetWord = session.words[session.roundIndex];

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
        const timerId = setTimeout(() => {
          activeTimers.delete(room.code);
          const advanceResult = advanceScoreModeRound(room.code);
          if (!advanceResult) return;

          if (advanceResult.gameOver) {
            io.to(room.code).emit('game_over', {
              room: advanceResult.room,
              playerProgress: advanceResult.room.wordleSession.playerProgress,
              words: advanceResult.room.wordleSession.words
            });
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

  // Rematch
  socket.on('rematch', (callback) => {
    const result = restartGame(socket.id);
    if (result.error) {
      if (typeof callback === 'function') callback({ success: false, error: result.error });
      return;
    }
    io.to(result.room.code).emit('game_started', result.room);
    if (typeof callback === 'function') callback({ success: true });
  });

  // Return to Lobby
  socket.on('return_to_lobby', (callback) => {
    const result = returnToLobby(socket.id);
    if (result.error) {
      if (typeof callback === 'function') callback({ success: false, error: result.error });
      return;
    }
    io.to(result.room.code).emit('room_updated', result.room);
    if (typeof callback === 'function') callback({ success: true });
  });

  // Leave Room
  socket.on('leave_room', () => {
    const result = leaveRoom(socket.id);
    if (result && result.room) {
      socket.leave(result.room.code);
      io.to(result.room.code).emit('room_updated', result.room);
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    console.log(`[Socket] Disconnected: ${socket.id}`);
    const result = leaveRoom(socket.id);
    if (result && result.room) {
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
