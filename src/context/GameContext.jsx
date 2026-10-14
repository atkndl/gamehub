import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { socket } from '../socket';
import { sound } from '../utils/sounds';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [room, setRoom] = useState(null);
  const [player, setPlayer] = useState(null);
  const [error, setError] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [opponentProgress, setOpponentProgress] = useState({});
  const [roundSummaryData, setRoundSummaryData] = useState(null);
  const [gameOverData, setGameOverData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // Show auto-dismissing toast
  const showToast = useCallback((msg, duration = 3000) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => prev === msg ? null : prev);
    }, duration);
  }, []);

  const toggleSound = useCallback(() => {
    const newState = sound.toggleSound();
    setSoundEnabled(newState);
  }, []);

  // Socket event listeners
  useEffect(() => {
    function handleRoomUpdated(updatedRoom) {
      console.log('[Socket] room_updated:', updatedRoom);
      setRoom(updatedRoom);
      if (updatedRoom && socket.id) {
        const me = updatedRoom.players.find(p => p.id === socket.id);
        if (me) setPlayer(me);
      }
      if (updatedRoom && updatedRoom.gameState === 'lobby') {
        setRoundSummaryData(null);
        setGameOverData(null);
      }
    }

    function handleGameStarted(startedRoom) {
      console.log('[Socket] game_started:', startedRoom);
      setRoom(startedRoom);
      setRoundSummaryData(null);
      setGameOverData(null);
      if (startedRoom.wordleSession) {
        setOpponentProgress(startedRoom.wordleSession.playerProgress || {});
      }
      sound.playWordSolved();
      showToast('Oyun Başladı! Başarılar! 🚀');
    }

    function handleOpponentUpdated({ playerProgress, room: updatedRoom }) {
      if (playerProgress) {
        setOpponentProgress(playerProgress);
      }
      if (updatedRoom) {
        setRoom(updatedRoom);
      }
    }

    function handleRoundSummary({ summary, room: updatedRoom }) {
      console.log('[Socket] round_summary:', summary);
      setRoundSummaryData(summary);
      if (updatedRoom) setRoom(updatedRoom);
      sound.playWordSolved();
    }

    function handleNextRoundStarted({ room: updatedRoom, roundIndex }) {
      console.log('[Socket] next_round_started:', roundIndex);
      setRoundSummaryData(null);
      if (updatedRoom) {
        setRoom(updatedRoom);
        if (updatedRoom.wordleSession) {
          setOpponentProgress(updatedRoom.wordleSession.playerProgress || {});
        }
      }
      showToast(`Yeni Kelime Başladı! (Kelime ${roundIndex + 1}) 🎯`);
    }

    function handleGameOver(data) {
      console.log('[Socket] game_over:', data);
      setGameOverData(data);
      if (data.room) setRoom(data.room);
      sound.playGameWin();
      showToast('Oyun Bitti! Sıralama ve Sonuçlar Açıklandı 🏆', 4000);
    }

    function handleLobbyReturned(updatedRoom) {
      console.log('[Socket] lobby_returned:', updatedRoom);
      setGameOverData(null);
      setRoundSummaryData(null);
      setOpponentProgress({});
      setRoom(updatedRoom);
      showToast('Oda lobiye döndü 🏠');
    }

    function handleChatReceived(chatItem) {
      setChatMessages(prev => [...prev.slice(-30), chatItem]);
      if (chatItem.senderId !== socket.id) {
        sound.playKey();
      }
    }

    socket.on('room_updated', handleRoomUpdated);
    socket.on('game_started', handleGameStarted);
    socket.on('opponent_updated', handleOpponentUpdated);
    socket.on('round_summary', handleRoundSummary);
    socket.on('next_round_started', handleNextRoundStarted);
    socket.on('game_over', handleGameOver);
    socket.on('lobby_returned', handleLobbyReturned);
    socket.on('chat_received', handleChatReceived);

    return () => {
      socket.off('room_updated', handleRoomUpdated);
      socket.off('game_started', handleGameStarted);
      socket.off('opponent_updated', handleOpponentUpdated);
      socket.off('round_summary', handleRoundSummary);
      socket.off('next_round_started', handleNextRoundStarted);
      socket.off('game_over', handleGameOver);
      socket.off('lobby_returned', handleLobbyReturned);
      socket.off('chat_received', handleChatReceived);
    };
  }, [showToast]);

  // Actions
  const createRoom = useCallback((playerName, avatar) => {
    return new Promise((resolve, reject) => {
      socket.emit('create_room', { playerName, avatar }, (res) => {
        if (res.success) {
          setRoom(res.room);
          const me = res.room.players.find(p => p.id === socket.id);
          setPlayer(me);
          setError(null);
          resolve(res.room);
        } else {
          setError(res.error);
          reject(new Error(res.error));
        }
      });
    });
  }, []);

  const joinRoom = useCallback((roomCode, playerName, avatar) => {
    return new Promise((resolve, reject) => {
      socket.emit('join_room', { roomCode, playerName, avatar }, (res) => {
        if (res.success) {
          setRoom(res.room);
          const me = res.room.players.find(p => p.id === socket.id);
          setPlayer(me);
          setError(null);
          resolve(res.room);
        } else {
          setError(res.error);
          reject(new Error(res.error));
        }
      });
    });
  }, []);

  const leaveRoom = useCallback(() => {
    socket.emit('leave_room');
    setRoom(null);
    setPlayer(null);
    setChatMessages([]);
    setRoundSummaryData(null);
    setGameOverData(null);
    setOpponentProgress({});
  }, []);

  const updateProfile = useCallback((updates) => {
    socket.emit('update_player', updates);
  }, []);

  const updateWordleConfig = useCallback((config) => {
    socket.emit('update_wordle_config', config);
  }, []);

  const startWordle = useCallback(() => {
    return new Promise((resolve, reject) => {
      socket.emit('start_wordle', (res) => {
        if (res && res.success) {
          resolve(true);
        } else {
          showToast(res ? res.error : 'Oyun başlatılamadı');
          reject(new Error(res?.error));
        }
      });
    });
  }, [showToast]);

  const submitGuess = useCallback((guess) => {
    return new Promise((resolve) => {
      socket.emit('wordle_guess', { guess }, (res) => {
        resolve(res);
      });
    });
  }, []);

  const sendChat = useCallback((message, emoji) => {
    socket.emit('send_chat', { message, emoji });
  }, []);

  const rematch = useCallback(() => {
    socket.emit('rematch', (res) => {
      if (!res.success) showToast(res.error);
    });
  }, [showToast]);

  const returnToLobby = useCallback(() => {
    socket.emit('return_to_lobby', (res) => {
      if (!res.success) showToast(res.error);
    });
  }, [showToast]);

  return (
    <GameContext.Provider
      value={{
        socket,
        room,
        player,
        error,
        setError,
        chatMessages,
        soundEnabled,
        toggleSound,
        opponentProgress,
        roundSummaryData,
        gameOverData,
        toastMessage,
        showToast,
        createRoom,
        joinRoom,
        leaveRoom,
        updateProfile,
        updateWordleConfig,
        startWordle,
        submitGuess,
        sendChat,
        rematch,
        returnToLobby
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
