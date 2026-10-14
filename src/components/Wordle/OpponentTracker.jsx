import React from 'react';
import { useGame } from '../../context/GameContext';
import { Trophy, Zap, Target, CheckCircle2, Clock } from 'lucide-react';

export default function OpponentTracker({ session, playerProgress = {} }) {
  const { player } = useGame();

  if (!session) return null;

  const isSpeedMode = session.mode === 'speed';
  const playersList = Object.values(playerProgress);

  // Sorting rule requested by user:
  // 1. Most solved words count (b.solvedWordsCount - a.solvedWordsCount)
  // 2. If equal, further word progress (b.currentWordIndex - a.currentWordIndex)
  // 3. If finished, fastest finish time ((a.finishTime || Infinity) - (b.finishTime || Infinity))
  const sortedPlayers = [...playersList].sort((a, b) => {
    if (isSpeedMode) {
      if (b.solvedWordsCount !== a.solvedWordsCount) {
        return b.solvedWordsCount - a.solvedWordsCount;
      }
      if (a.isGameFinished && b.isGameFinished) {
        const timeA = a.finishTime !== null ? a.finishTime : Infinity;
        const timeB = b.finishTime !== null ? b.finishTime : Infinity;
        return timeA - timeB;
      }
      if (b.currentWordIndex !== a.currentWordIndex) {
        return b.currentWordIndex - a.currentWordIndex;
      }
      return (a.finishTime || Infinity) - (b.finishTime || Infinity);
    } else {
      return (b.totalScore || 0) - (a.totalScore || 0);
    }
  });

  const formatDuration = (ms) => {
    if (!ms || ms === Infinity) return '';
    const secs = Math.round(ms / 1000);
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m}dk ${s}sn` : `${s}sn`;
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col gap-3">
      {/* Tracker Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          {isSpeedMode ? (
            <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold">
              ⚡
            </div>
          ) : (
            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
              🎯
            </div>
          )}
          <div>
            <span className="font-heading font-black text-xs uppercase tracking-wider text-slate-800 block">
              {isSpeedMode ? 'Canlı Yarış Sıralaması' : 'Anlık Puan Tablosu'}
            </span>
            {isSpeedMode && (
              <span className="text-[10px] text-slate-400 font-medium">
                (Önce doğru sayısı, eşitlikte hız)
              </span>
            )}
          </div>
        </div>
        <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
          {playersList.length} Oyuncu
        </span>
      </div>

      {/* Players Progress List */}
      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {sortedPlayers.map((p, idx) => {
          const isSelf = p.playerId === player?.id;
          const wordProgressPercent = Math.min(
            100,
            Math.round(((p.currentWordIndex + (p.isCurrentWordSolved ? 1 : 0)) / session.wordCount) * 100)
          );

          return (
            <div
              key={p.playerId}
              className={`p-3.5 rounded-2xl border transition-all ${
                isSelf
                  ? 'bg-emerald-50/50 border-emerald-300 shadow-xs ring-1 ring-emerald-400/20'
                  : 'bg-slate-50/80 border-slate-200/80'
              }`}
            >
              {/* Player Top row */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="font-heading font-black text-xs text-slate-400 w-4">
                    {idx + 1}.
                  </span>
                  <span className="text-2xl select-none shrink-0">{p.avatar}</span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-heading font-bold text-xs text-slate-900 truncate">
                        {p.name}
                      </span>
                      {isSelf && (
                        <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-md bg-emerald-500 text-white">
                          Sen
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 mt-0.5">
                      {isSpeedMode ? (
                        <>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-md">
                            {p.solvedWordsCount} Doğru
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {p.isGameFinished
                              ? `• Bitti (${formatDuration(p.finishTime)})`
                              : `• Kelime ${p.currentWordIndex + 1}/${session.wordCount}`}
                          </span>
                        </>
                      ) : (
                        <span className="text-[10px] text-slate-500 font-medium">
                          {p.isCurrentWordSolved
                            ? `✓ ${p.guesses?.length || 1}. denemede bildi`
                            : p.isCurrentWordFailed
                            ? 'Bilemedi'
                            : `Deneme: ${p.guesses?.length || 0}/6`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Badge */}
                <div className="text-right shrink-0">
                  {isSpeedMode ? (
                    <div className="flex flex-col items-end">
                      <span className="font-heading font-black text-xs text-slate-800">
                        {p.solvedWordsCount} / {session.wordCount}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {p.isGameFinished ? 'Tamamlandı' : 'Yarışıyor'}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <span className="font-heading font-black text-sm text-emerald-600 block">
                        {p.totalScore || 0} P
                      </span>
                      {p.roundPoints && p.roundPoints.length > 0 && (
                        <span className="text-[10px] font-bold text-emerald-500">
                          +{p.roundPoints[p.roundPoints.length - 1] || 0}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Progress bar in speed mode */}
              {isSpeedMode && (
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full transition-all duration-500 ${
                      p.isGameFinished ? 'bg-amber-400' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${p.isGameFinished ? 100 : wordProgressPercent}%` }}
                  />
                </div>
              )}

              {/* Mini Guesses: Alt alta satırlar halinde net 5'li kutular */}
              {p.guesses && p.guesses.length > 0 && (
                <div className="pt-2 border-t border-slate-200/60 mt-1">
                  <span className="text-[10px] font-semibold text-slate-400 block mb-1.5">
                    Mevcut Kelime Tahminleri ({p.guesses.length}/6):
                  </span>
                  <div className="flex flex-col gap-1 bg-white p-2 rounded-xl border border-slate-200/70 shadow-2xs">
                    {p.guesses.map((g, gIdx) => (
                      <div key={gIdx} className="flex items-center gap-2">
                        <span className="text-[9px] font-mono font-bold text-slate-400 w-3 text-right">
                          {gIdx + 1}.
                        </span>
                        <div className="flex gap-1">
                          {g.result?.map((st, cIdx) => (
                            <div
                              key={cIdx}
                              className={`w-4 h-4 rounded-xs transition-all ${
                                st === 'correct'
                                  ? 'bg-emerald-500 shadow-2xs'
                                  : st === 'present'
                                  ? 'bg-amber-400 shadow-2xs'
                                  : 'bg-slate-400'
                              }`}
                              title={
                                st === 'correct'
                                  ? 'Harf ve yeri doğru'
                                  : st === 'present'
                                  ? 'Harf var, yeri yanlış'
                                  : 'Harf yok'
                              }
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
