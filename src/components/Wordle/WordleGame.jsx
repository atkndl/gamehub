import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import WordleBoard from './WordleBoard';
import WordleKeyboard from './WordleKeyboard';
import OpponentTracker from './OpponentTracker';
import RoundSummaryModal from './RoundSummaryModal';
import GameOverModal from './GameOverModal';
import LiveChat from '../Common/LiveChat';
import { sound } from '../../utils/sounds';
import { toTurkishUpper, toTurkishLower } from '../../utils/turkish';
import { Zap, Target, HelpCircle, AlertCircle, CheckCircle2, Clock, MessageCircle, Users } from 'lucide-react';

export default function WordleGame() {
  const {
    room,
    player,
    opponentProgress,
    roundSummaryData,
    gameOverData,
    submitGuess,
    showToast,
    chatMessages
  } = useGame();

  const session = room?.wordleSession;
  const isSpeedMode = session?.mode === 'speed';

  // Get self progress
  const myProgress = session && player ? opponentProgress[player.id] : null;
  const currentWordIndex = isSpeedMode
    ? (myProgress?.currentWordIndex || 0)
    : (session?.roundIndex || 0);

  // Local state for typed word
  const [currentGuess, setCurrentGuess] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [localGuesses, setLocalGuesses] = useState([]); // [{ guess, result }]
  const [submitting, setSubmitting] = useState(false);
  const [wordFeedback, setWordFeedback] = useState(null); // 'Harika!' or target word reveal
  const [activeTab, setActiveTab] = useState('board'); // For mobile: 'board' | 'opponents' | 'chat'
  const [sidebarTab, setSidebarTab] = useState('opponents'); // For desktop: 'opponents' | 'chat'
  const [unreadChat, setUnreadChat] = useState(0);
  const prevChatCountRef = React.useRef(chatMessages.length);

  useEffect(() => {
    if (chatMessages.length > prevChatCountRef.current) {
      if ((window.innerWidth < 1024 && activeTab !== 'chat') || (window.innerWidth >= 1024 && sidebarTab !== 'chat')) {
        setUnreadChat(prev => prev + (chatMessages.length - prevChatCountRef.current));
      }
    }
    prevChatCountRef.current = chatMessages.length;
  }, [chatMessages.length, activeTab, sidebarTab]);

  // Reset local guesses when word changes
  useEffect(() => {
    if (myProgress?.guesses) {
      setLocalGuesses(myProgress.guesses);
    } else {
      setLocalGuesses([]);
    }
    setCurrentGuess('');
    setWordFeedback(null);
  }, [currentWordIndex, myProgress?.guesses?.length === 0]);

  // Compute key statuses for keyboard
  const keyStatuses = useMemo(() => {
    const statuses = {};
    localGuesses.forEach(({ guess, result }) => {
      const letters = toTurkishUpper(guess).split('');
      letters.forEach((letter, idx) => {
        const current = statuses[letter];
        const res = result[idx];

        if (res === 'correct') {
          statuses[letter] = 'correct';
        } else if (res === 'present' && current !== 'correct') {
          statuses[letter] = 'present';
        } else if (res === 'absent' && current !== 'correct' && current !== 'present') {
          statuses[letter] = 'absent';
        }
      });
    });
    return statuses;
  }, [localGuesses]);

  // Trigger shake animation
  const triggerShake = useCallback((msg) => {
    sound.playError();
    setIsShaking(true);
    if (msg) showToast(msg);
    setTimeout(() => setIsShaking(false), 500);
  }, [showToast]);

  // Handle guess submission
  const handleSubmitGuess = useCallback(async () => {
    if (submitting) return;

    if (currentGuess.length !== 5) {
      triggerShake('Kelime 5 harfli olmalıdır!');
      return;
    }

    setSubmitting(true);
    try {
      const response = await submitGuess(currentGuess);
      if (!response.success) {
        triggerShake(response.error || 'Kelime bulunamadı!');
        setSubmitting(false);
        return;
      }

      // Add to local guesses
      const newGuesses = [
        ...localGuesses,
        { guess: currentGuess, result: response.result }
      ];
      setLocalGuesses(newGuesses);
      setCurrentGuess('');

      // Play sound for tiles
      response.result.forEach((status, idx) => {
        sound.playTileReveal(status, idx);
      });

      if (response.isCorrect) {
        setTimeout(() => {
          sound.playWordSolved();
          setWordFeedback('Tebrikler! Doğru bildin! 🎉');
        }, 500);
      } else if (response.isFailed) {
        setTimeout(() => {
          sound.playError();
          setWordFeedback(`Maalesef! Doğru kelime: ${toTurkishUpper(response.targetWord || '')}`);
        }, 500);
      }
    } catch (err) {
      triggerShake('Bağlantı hatası oluştu');
    } finally {
      setSubmitting(false);
    }
  }, [currentGuess, localGuesses, submitting, submitGuess, triggerShake]);

  // Handle key press
  const handleKeyPress = useCallback((key) => {
    if (submitting) return;

    // If already solved or failed for this word, ignore
    if (myProgress?.isCurrentWordSolved || myProgress?.isCurrentWordFailed || myProgress?.isGameFinished) {
      return;
    }

    if (key === 'ENTER') {
      handleSubmitGuess();
      return;
    }

    if (key === 'BACKSPACE' || key === 'SIL') {
      sound.playKey();
      setCurrentGuess(prev => prev.slice(0, -1));
      return;
    }

    // Letter key
    if (currentGuess.length < 5) {
      sound.playKey();
      setCurrentGuess(prev => prev + key);
    }
  }, [currentGuess.length, submitting, myProgress, handleSubmitGuess]);

  // Physical keyboard listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if typing in input/textarea
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        handleKeyPress('ENTER');
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleKeyPress('BACKSPACE');
      } else {
        const char = e.key;
        // Turkish character mapping
        const trChar = toTurkishUpper(char);
        const validChars = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ';
        if (validChars.includes(trChar) && trChar.length === 1) {
          e.preventDefault();
          handleKeyPress(trChar);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  if (!session) return null;

  const isWordFinished = myProgress?.isCurrentWordSolved || myProgress?.isCurrentWordFailed;
  const isAllWordsFinished = myProgress?.isGameFinished;

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 py-4 flex flex-col min-h-[calc(100vh-5rem)]">
      {/* Game Header Bar */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-slate-200/80 shadow-xs mb-3 flex items-center justify-between">
        {/* Left: Mode and Word Index */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div
            className={`px-2.5 py-1 rounded-xl text-xs font-heading font-black flex items-center gap-1.5 ${
              isSpeedMode
                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            }`}
          >
            {isSpeedMode ? <Zap className="w-3.5 h-3.5 fill-current" /> : <Target className="w-3.5 h-3.5" />}
            <span>{isSpeedMode ? 'Hız Modu (Yarış)' : 'Puan Modu'}</span>
          </div>

          <div className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-xl">
            Kelime: <span className="text-emerald-600 font-black">{currentWordIndex + 1}</span> / {session.wordCount}
          </div>
        </div>

        {/* Right: Score or Mobile Tab Switcher */}
        <div className="flex items-center gap-2">
          {/* Score badge in score mode */}
          {!isSpeedMode && (
            <div className="text-xs font-bold text-slate-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl flex items-center gap-1.5">
              <span>Puanın:</span>
              <span className="font-heading font-black text-emerald-600 text-sm">
                {myProgress?.totalScore || 0}
              </span>
            </div>
          )}

          {/* Mobile view toggle */}
          <div className="flex lg:hidden bg-slate-100 p-0.5 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('board')}
              className={`px-2.5 py-1 rounded-lg transition ${
                activeTab === 'board' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Tahta
            </button>
            <button
              onClick={() => setActiveTab('opponents')}
              className={`px-2.5 py-1 rounded-lg transition ${
                activeTab === 'opponents' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              Rakipler
            </button>
            <button
              onClick={() => {
                setActiveTab('chat');
                setUnreadChat(0);
              }}
              className={`px-2.5 py-1 rounded-lg transition relative flex items-center gap-1 ${
                activeTab === 'chat' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
              }`}
            >
              <span>Sohbet</span>
              {unreadChat > 0 && activeTab !== 'chat' && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Play Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 items-start">
        {/* Left 2 Cols on Desktop: Wordle Board + Keyboard */}
        <div
          className={`lg:col-span-2 flex flex-col justify-between items-center py-2 sm:py-4 gap-4 ${
            activeTab !== 'board' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {/* Status Alert Banner */}
          {wordFeedback && (
            <div className="w-full max-w-sm text-center py-2 px-4 rounded-xl font-heading font-black text-xs sm:text-sm shadow-xs transition-all animate-pop bg-emerald-100 text-emerald-800 border border-emerald-300">
              {wordFeedback}
            </div>
          )}

          {/* In Score Mode: Waiting for other players alert */}
          {!isSpeedMode && isWordFinished && !roundSummaryData && !gameOverData && (
            <div className="w-full max-w-md p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center justify-center gap-2 animate-pulse text-center shadow-xs">
              <Clock className="w-4 h-4 animate-spin text-amber-600" />
              <span>Kelime tamamlandı! Diğer oyuncular bekleniyor...</span>
            </div>
          )}

          {/* In Speed Mode: Finished all words */}
          {isSpeedMode && isAllWordsFinished && !gameOverData && (
            <div className="w-full max-w-md p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center justify-center gap-2 text-center shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Tebrikler! Tüm kelimeleri tamamladınız. Diğer yarışmacılar bekleniyor...</span>
            </div>
          )}

          {/* Wordle Board Grid */}
          <WordleBoard
            guesses={localGuesses}
            currentGuess={currentGuess}
            isShaking={isShaking}
          />

          {/* Virtual Keyboard */}
          <WordleKeyboard
            keyStatuses={keyStatuses}
            onKeyPress={handleKeyPress}
            disabled={isWordFinished || isAllWordsFinished || submitting}
          />
        </div>

        {/* Right Col: Desktop Side Panel (Opponents & Live Chat) / Mobile views */}
        <div className={`space-y-3 ${activeTab === 'board' ? 'hidden lg:block' : 'block'}`}>
          {/* Desktop tab selector */}
          <div className="hidden lg:grid grid-cols-2 p-1 bg-slate-200/80 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setSidebarTab('opponents')}
              className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                sidebarTab === 'opponents'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>Canlı Yarış</span>
            </button>
            <button
              onClick={() => {
                setSidebarTab('chat');
                setUnreadChat(0);
              }}
              className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 relative cursor-pointer ${
                sidebarTab === 'chat'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>Canlı Sohbet</span>
              {unreadChat > 0 && sidebarTab !== 'chat' && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
              )}
            </button>
          </div>

          {/* Render based on desktop tab and mobile tab */}
          <div className="space-y-4">
            {/* On mobile: based on activeTab. On desktop: based on sidebarTab */}
            <div className={`${activeTab === 'opponents' ? 'block' : activeTab === 'chat' ? 'hidden' : 'hidden'} lg:${sidebarTab === 'opponents' ? 'block' : 'hidden'}`}>
              <OpponentTracker
                session={session}
                playerProgress={opponentProgress}
              />
            </div>

            <div className={`${activeTab === 'chat' ? 'block' : activeTab === 'opponents' ? 'hidden' : 'hidden'} lg:${sidebarTab === 'chat' ? 'block' : 'hidden'}`}>
              <LiveChat title="Oyun İçi Canlı Sohbet" />
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {roundSummaryData && (
        <RoundSummaryModal summary={roundSummaryData} />
      )}

      {gameOverData && (
        <GameOverModal data={gameOverData} />
      )}
    </div>
  );
}
