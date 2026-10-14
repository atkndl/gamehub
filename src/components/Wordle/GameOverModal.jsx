import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext';
import { toTurkishUpper } from '../../utils/turkish';
import { Trophy, RotateCcw, Home, Sparkles, Award } from 'lucide-react';

export default function GameOverModal({ data }) {
  const { player, rematch, returnToLobby } = useGame();

  useEffect(() => {
    // Blast celebratory confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      const timeout = setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 }
        });
      }, 400);
      return () => clearTimeout(timeout);
    } catch (e) {}
  }, []);

  if (!data) return null;

  const isHost = player?.isHost;
  const room = data.room;
  const isSpeedMode = room?.wordleSession?.mode === 'speed';
  const playerProgress = data.playerProgress || {};
  const words = data.words || [];

  const playersList = Object.values(playerProgress);

  // Sort players for podium
  const rankedPlayers = [...playersList].sort((a, b) => {
    if (isSpeedMode) {
      if (b.solvedWordsCount !== a.solvedWordsCount) {
        return b.solvedWordsCount - a.solvedWordsCount;
      }
      const timeA = a.finishTime !== null ? a.finishTime : Infinity;
      const timeB = b.finishTime !== null ? b.finishTime : Infinity;
      if (timeA !== timeB) return timeA - timeB;
      return (b.totalScore || 0) - (a.totalScore || 0);
    } else {
      return (b.totalScore || 0) - (a.totalScore || 0);
    }
  });

  const winner = rankedPlayers[0];
  const second = rankedPlayers[1];
  const third = rankedPlayers[2];

  const formatDuration = (ms) => {
    if (!ms || ms === Infinity) return '';
    const secs = Math.round(ms / 1000);
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m}dk ${s}sn` : `${s}sn`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-6 sm:p-8 text-center max-h-[92vh] overflow-y-auto">
        {/* Title */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider mx-auto mb-3">
          <Sparkles className="w-4 h-4 text-amber-600 animate-spin" />
          Oyun Bitti!
        </div>

        <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900">
          Tebrikler, {winner?.name}! 🏆
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {isSpeedMode
            ? 'En çok kelimeyi en kısa sürede bilerek şampiyon oldu!'
            : 'En yüksek puanı toplayarak zirveye oturdu!'}
        </p>

        {/* Podium visualization */}
        <div className="flex justify-center items-end gap-2 my-6 pt-6 px-4">
          {/* 2nd place */}
          {second && (
            <div className="flex-1 flex flex-col items-center">
              <span className="text-2xl mb-1">{second.avatar}</span>
              <span className="font-bold text-xs text-slate-700 truncate max-w-[80px]">
                {second.name}
              </span>
              <span className="text-[10px] text-slate-500 font-bold mb-1">
                {isSpeedMode
                  ? `${second.solvedWordsCount}/${words.length} Doğru ${second.finishTime ? `• ${formatDuration(second.finishTime)}` : ''}`
                  : `${second.totalScore} P`}
              </span>
              <div className="w-full bg-slate-200 h-20 rounded-t-2xl flex items-center justify-center font-heading font-black text-slate-500 text-lg border-t-4 border-slate-400">
                🥈 2.
              </div>
            </div>
          )}

          {/* 1st place (winner) */}
          {winner && (
            <div className="flex-1 flex flex-col items-center">
              <span className="text-3xl mb-1 animate-bounce">{winner.avatar}</span>
              <span className="font-black text-xs sm:text-sm text-slate-900 truncate max-w-[100px]">
                {winner.name}
              </span>
              <span className="text-[11px] text-amber-600 font-black mb-1">
                {isSpeedMode
                  ? `${winner.solvedWordsCount}/${words.length} DOĞRU ${winner.finishTime ? `• ${formatDuration(winner.finishTime)}` : ''}`
                  : `${winner.totalScore} PUAN`}
              </span>
              <div className="w-full bg-gradient-to-t from-amber-400 to-amber-300 h-28 rounded-t-2xl flex items-center justify-center font-heading font-black text-white text-2xl shadow-md border-t-4 border-amber-500">
                🥇 1.
              </div>
            </div>
          )}

          {/* 3rd place */}
          {third && (
            <div className="flex-1 flex flex-col items-center">
              <span className="text-2xl mb-1">{third.avatar}</span>
              <span className="font-bold text-xs text-slate-700 truncate max-w-[80px]">
                {third.name}
              </span>
              <span className="text-[10px] text-slate-500 font-bold mb-1">
                {isSpeedMode
                  ? `${third.solvedWordsCount}/${words.length} Doğru ${third.finishTime ? `• ${formatDuration(third.finishTime)}` : ''}`
                  : `${third.totalScore} P`}
              </span>
              <div className="w-full bg-amber-100 h-16 rounded-t-2xl flex items-center justify-center font-heading font-black text-amber-700 text-base border-t-4 border-amber-600">
                🥉 3.
              </div>
            </div>
          )}
        </div>

        {/* Words Revealed list */}
        {words.length > 0 && (
          <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Bu Maçın Gizli Kelimeleri:
            </span>
            <div className="flex flex-wrap gap-2">
              {words.map((w, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-xl bg-white border border-slate-200 font-heading font-bold text-xs text-slate-800 shadow-2xs"
                >
                  {toTurkishUpper(w)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2 border-t border-slate-100">
          {isHost ? (
            <button
              onClick={rematch}
              className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-heading font-black text-sm tracking-wide shadow-md shadow-emerald-500/25 active:scale-95 transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Tekrar Oyna
            </button>
          ) : (
            <div className="text-xs text-slate-400 py-2">
              👑 Oda sahibi yeni maç başlatabilir
            </div>
          )}

          {isHost ? (
            <button
              onClick={returnToLobby}
              className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading font-bold text-sm transition flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Lobiye Dön
            </button>
          ) : (
            <button
              onClick={returnToLobby}
              className="py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading font-bold text-sm transition flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Lobiye Dön
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
