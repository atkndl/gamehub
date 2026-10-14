import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { useGame } from '../../context/GameContext';
import { toTurkishUpper } from '../../utils/turkish';
import { Trophy, RotateCcw, Home, Sparkles, Award, Clock, Target, CheckCircle2, LogOut } from 'lucide-react';
import TDKWordCard from './TDKWordCard';

export default function GameOverModal({ data }) {
  const { player, rematch, returnToLobby, leaveRoom } = useGame();

  useEffect(() => {
    // Blast celebratory confetti on game over
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.55 }
      });
      const t1 = setTimeout(() => {
        confetti({ particleCount: 70, angle: 60, spread: 60, origin: { x: 0, y: 0.6 } });
        confetti({ particleCount: 70, angle: 120, spread: 60, origin: { x: 1, y: 0.6 } });
      }, 350);
      return () => clearTimeout(t1);
    } catch (e) {}
  }, []);

  if (!data) return null;

  const isHost = player?.isHost;
  const room = data.room;
  const isSpeedMode = data.mode === 'speed' || room?.wordleSession?.mode === 'speed';
  const words = data.words || room?.wordleSession?.words || [];
  const wordDetails = data.wordDetails || room?.wordleSession?.wordDetails || {};
  const totalWordsCount = words.length || 5;

  // Use pre-sorted authoritative leaderboard from socket, or fallback
  const leaderboard = data.leaderboard && data.leaderboard.length > 0
    ? data.leaderboard
    : Object.values(data.playerProgress || {}).sort((a, b) => {
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
      }).map((p, idx) => ({
        rank: idx + 1,
        playerId: p.playerId,
        name: p.name,
        avatar: p.avatar,
        solvedWordsCount: p.solvedWordsCount,
        wordCount: totalWordsCount,
        finishTime: p.finishTime,
        totalScore: p.totalScore || 0,
        isWinner: idx === 0
      }));

  const winner = leaderboard[0];
  const second = leaderboard[1];
  const third = leaderboard[2];

  const formatDuration = (ms) => {
    if (!ms || ms === Infinity) return '-';
    const secs = Math.round(ms / 1000);
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m}dk ${s}sn` : `${s}sn`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-5 sm:p-7 text-center my-auto max-h-[95vh] overflow-y-auto">
        {/* Top celebratory pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mx-auto mb-2 border border-amber-200/80 shadow-xs">
          <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
          <span>Oyun Bitti • Liderlik Tablosu</span>
        </div>

        {/* Winner Callout */}
        <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
          {leaderboard.length === 1 ? `Tebrikler, ${winner?.name}!` : `🏆 Şampiyon: ${winner?.name}!`}
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          {isSpeedMode
            ? 'En çok doğru kelimeyi en kısa sürede bilerek 1. oldu!'
            : 'En yüksek puanı toplayarak zirveye yerleşti!'}
        </p>

        {/* Podium visualization (if 2 or more players) */}
        {leaderboard.length >= 2 && (
          <div className="flex justify-center items-end gap-2 my-5 pt-4 px-2">
            {/* 2nd place */}
            {second && (
              <div className="flex-1 flex flex-col items-center">
                <span className="text-2xl mb-1">{second.avatar}</span>
                <span className="font-bold text-xs text-slate-700 truncate max-w-[85px]">
                  {second.name}
                </span>
                <span className="text-[10px] text-slate-500 font-bold mb-1">
                  {second.solvedWordsCount} / {totalWordsCount} Doğru
                </span>
                <div className="w-full bg-slate-200 h-18 sm:h-20 rounded-t-2xl flex items-center justify-center font-heading font-black text-slate-600 text-base sm:text-lg border-t-4 border-slate-400 shadow-xs">
                  🥈 2.
                </div>
              </div>
            )}

            {/* 1st place (winner) */}
            {winner && (
              <div className="flex-1 flex flex-col items-center">
                <span className="text-3xl sm:text-4xl mb-1 animate-bounce">{winner.avatar}</span>
                <span className="font-black text-xs sm:text-sm text-slate-900 truncate max-w-[105px]">
                  {winner.name}
                </span>
                <span className="text-[11px] text-amber-600 font-black mb-1">
                  {winner.solvedWordsCount} / {totalWordsCount} DOĞRU
                </span>
                <div className="w-full bg-gradient-to-t from-amber-400 to-amber-300 h-26 sm:h-28 rounded-t-2xl flex items-center justify-center font-heading font-black text-white text-xl sm:text-2xl shadow-md border-t-4 border-amber-500">
                  🥇 1.
                </div>
              </div>
            )}

            {/* 3rd place */}
            {third && (
              <div className="flex-1 flex flex-col items-center">
                <span className="text-2xl mb-1">{third.avatar}</span>
                <span className="font-bold text-xs text-slate-700 truncate max-w-[85px]">
                  {third.name}
                </span>
                <span className="text-[10px] text-slate-500 font-bold mb-1">
                  {third.solvedWordsCount} / {totalWordsCount} Doğru
                </span>
                <div className="w-full bg-amber-100/90 h-14 sm:h-16 rounded-t-2xl flex items-center justify-center font-heading font-black text-amber-700 text-sm sm:text-base border-t-4 border-amber-500 shadow-xs">
                  🥉 3.
                </div>
              </div>
            )}
          </div>
        )}

        {/* Full Leaderboard Table (Tüm Sıralama) */}
        <div className="mb-4 text-left">
          <div className="flex items-center justify-between mb-1.5 px-1">
            <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500" />
              Tüm Oyuncular Sıralaması
            </span>
            <span className="text-[11px] text-slate-400">
              {leaderboard.length} Oyuncu
            </span>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200/80 overflow-hidden divide-y divide-slate-100">
            {leaderboard.map((item) => {
              const isSelf = item.playerId === player?.id;
              return (
                <div
                  key={item.playerId}
                  className={`p-3 flex items-center justify-between transition-colors ${
                    isSelf ? 'bg-emerald-50/70 font-semibold' : 'hover:bg-slate-100/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-heading font-black text-xs shrink-0 ${
                        item.rank === 1
                          ? 'bg-amber-400 text-white'
                          : item.rank === 2
                          ? 'bg-slate-300 text-slate-800'
                          : item.rank === 3
                          ? 'bg-amber-700/60 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {item.rank}
                    </span>
                    <span className="text-xl select-none shrink-0">{item.avatar}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {item.name}
                        </span>
                        {isSelf && (
                          <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-md bg-emerald-500 text-white">
                            Sen
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        {item.finishTime ? `Süre: ${formatDuration(item.finishTime)}` : 'Yarış Tamamlandı'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 text-right">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-lg">
                      {item.solvedWordsCount} / {totalWordsCount} Doğru
                    </span>
                    {!isSpeedMode && (
                      <span className="font-heading font-black text-xs sm:text-sm text-slate-800">
                        {item.totalScore} P
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Words Revealed & TDK Educational Cards */}
        {words.length > 0 && (
          <TDKWordCard words={words} wordDetails={wordDetails} />
        )}

        {/* Action Controls for Host and Players */}
        <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5 justify-center items-center">
          {isHost ? (
            <>
              <button
                onClick={rematch}
                className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-heading font-black text-sm tracking-wide shadow-md shadow-emerald-500/25 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Tekrar Oyna
              </button>

              <button
                onClick={returnToLobby}
                className="w-full sm:flex-1 py-3 px-5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                Odayı Lobiye Döndür
              </button>
            </>
          ) : (
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500 font-medium">
                👑 Oda sahibi yeni maç başlatabilir veya odayı lobiye döndürebilir...
              </span>
              <button
                onClick={leaveRoom}
                className="px-4 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-bold transition border border-rose-200 flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                Odadan Ayrıl
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
