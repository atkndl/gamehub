import React, { useEffect, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import SnakeCanvas from './SnakeCanvas';
import SnakeGameOverModal from './SnakeGameOverModal';
import LiveChat from '../Common/LiveChat';
import { Heart, Trophy, Zap, Shield, Flame, Snowflake, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ArrowLeft as ExitIcon } from 'lucide-react';
import { SNAKE_CLASSES } from './SnakeClassModal';

export default function SnakeGame() {
  const {
    room,
    player,
    snakeState,
    snakeGameOverData,
    sendSnakeInput,
    returnToLobby
  } = useGame();

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    const key = e.key;
    if (['ArrowUp', 'KeyW', 'w', 'W'].includes(key)) {
      e.preventDefault();
      sendSnakeInput('UP');
    } else if (['ArrowDown', 'KeyS', 's', 'S'].includes(key)) {
      e.preventDefault();
      sendSnakeInput('DOWN');
    } else if (['ArrowLeft', 'KeyA', 'a', 'A'].includes(key)) {
      e.preventDefault();
      sendSnakeInput('LEFT');
    } else if (['ArrowRight', 'KeyD', 'd', 'D'].includes(key)) {
      e.preventDefault();
      sendSnakeInput('RIGHT');
    }
  }, [sendSnakeInput]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!room) return null;

  // Find current player in snake state
  const myPlayerState = snakeState?.players?.find(p => p.id === player?.id);
  const myClassKey = myPlayerState?.snakeClass || player?.snakeClass || 'speed';
  const myClassInfo = SNAKE_CLASSES[myClassKey] || SNAKE_CLASSES.speed;

  const lives = myPlayerState ? myPlayerState.lives : 3;
  const isAlive = myPlayerState ? myPlayerState.isAlive : true;
  const score = myPlayerState ? myPlayerState.score : 0;
  const length = myPlayerState?.body?.length || myClassInfo.initialLength;

  return (
    <div className="relative flex-1 flex flex-col items-center justify-start px-3 py-4 sm:p-6 select-none bg-slate-900 text-slate-100 min-h-[calc(100vh-64px)] overflow-x-hidden">
      {/* Top HUD Bar */}
      <div className="w-full max-w-[620px] mb-3 flex items-center justify-between gap-2 flex-wrap">
        {/* Lives Display */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Can:
          </span>
          {[1, 2, 3].map((heartIndex) => (
            <Heart
              key={heartIndex}
              className={`w-4 h-4 transition-all ${
                heartIndex <= lives
                  ? 'text-red-500 fill-red-500 animate-pulse'
                  : 'text-slate-600 fill-slate-800 opacity-40'
              }`}
            />
          ))}
          {!isAlive && (
            <span className="text-[10px] font-bold text-red-400 uppercase ml-1">
              (Elendin)
            </span>
          )}
        </div>

        {/* Player Class & Score */}
        <div className="flex items-center gap-2">
          {/* Class Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 text-xs font-bold text-slate-200">
            <span>{myClassInfo.icon}</span>
            <span>{myClassInfo.title}</span>
          </div>

          {/* Score Badge */}
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs font-black text-emerald-400">
            <Trophy className="w-3.5 h-3.5" />
            <span>{score} P</span>
          </div>

          {/* Length */}
          <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-2xl bg-slate-800/90 border border-slate-700/80 text-xs font-bold text-slate-300">
            <span>Boy: {length}</span>
          </div>
        </div>
      </div>

      {/* Main Arena Canvas */}
      <div className="relative w-full max-w-[620px] flex flex-col items-center">
        <SnakeCanvas state={snakeState} myPlayerId={player?.id} />

        {/* Virtual D-Pad for Mobile Controls */}
        <div className="mt-4 sm:hidden w-full max-w-[280px] grid grid-cols-3 gap-2">
          <div />
          <button
            type="button"
            onClick={() => sendSnakeInput('UP')}
            className="w-14 h-14 rounded-2xl bg-slate-800 active:bg-slate-700 border border-slate-700 flex items-center justify-center text-white text-xl shadow-md active:scale-90 transition mx-auto cursor-pointer"
          >
            <ArrowUp className="w-6 h-6" />
          </button>
          <div />

          <button
            type="button"
            onClick={() => sendSnakeInput('LEFT')}
            className="w-14 h-14 rounded-2xl bg-slate-800 active:bg-slate-700 border border-slate-700 flex items-center justify-center text-white text-xl shadow-md active:scale-90 transition mx-auto cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={() => sendSnakeInput('DOWN')}
            className="w-14 h-14 rounded-2xl bg-slate-800 active:bg-slate-700 border border-slate-700 flex items-center justify-center text-white text-xl shadow-md active:scale-90 transition mx-auto cursor-pointer"
          >
            <ArrowDown className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={() => sendSnakeInput('RIGHT')}
            className="w-14 h-14 rounded-2xl bg-slate-800 active:bg-slate-700 border border-slate-700 flex items-center justify-center text-white text-xl shadow-md active:scale-90 transition mx-auto cursor-pointer"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

        {/* Desktop Controls Helper Hint */}
        <div className="hidden sm:flex items-center justify-center gap-4 mt-3 text-xs text-slate-400 font-medium">
          <span>Yön Tuşları veya <span className="font-mono font-bold text-slate-300">W, A, S, D</span> ile yönlendir</span>
          <span>•</span>
          <span>Ödülleri toplayarak büyü</span>
          <span>•</span>
          <span>Rakiplerini tuzağa düşür</span>
        </div>
      </div>

      {/* Floating Live Chat */}
      <LiveChat />

      {/* Game Over Modal */}
      {snakeGameOverData && <SnakeGameOverModal data={snakeGameOverData} />}
    </div>
  );
}
