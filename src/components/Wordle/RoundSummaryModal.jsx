import React, { useState, useEffect } from 'react';
import { toTurkishUpper } from '../../utils/turkish';
import { Award, Clock, ArrowRight } from 'lucide-react';

export default function RoundSummaryModal({ summary }) {
  if (!summary) return null;

  const [secondsLeft, setSecondsLeft] = useState(summary.nextRoundIn || 5);

  useEffect(() => {
    setSecondsLeft(summary.nextRoundIn || 5);
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 1 ? prev - 1 : 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [summary]);

  const targetWordUpper = toTurkishUpper(summary.targetWord || '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-6 text-center animate-scale-up">
        {/* Top badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mx-auto mb-3">
          <Award className="w-3.5 h-3.5" />
          {summary.roundIndex + 1}. Kelime Tamamlandı
        </div>

        <h2 className="font-heading font-black text-xl text-slate-800 mb-1">
          Doğru Kelime:
        </h2>

        {/* Revealed Word Blocks */}
        <div className="flex justify-center gap-1.5 my-3">
          {targetWordUpper.split('').map((ch, idx) => (
            <div
              key={idx}
              className="w-11 h-11 rounded-xl bg-emerald-600 text-white font-heading font-black text-2xl flex items-center justify-center shadow-md shadow-emerald-600/30 animate-pop"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {ch}
            </div>
          ))}
        </div>

        {/* TDK Meaning Preview */}
        {summary.wordDetail && summary.wordDetail.meanings?.[0] && (
          <div className="my-2.5 p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200/70 text-left">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                🏛️ TDK Anlamı:
              </span>
              {summary.wordDetail.origin && (
                <span className="text-[10px] text-amber-800 bg-amber-100/70 px-1.5 py-0.2 rounded font-medium italic">
                  {summary.wordDetail.origin}
                </span>
              )}
              {summary.wordDetail.meanings[0].tur && (
                <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded font-semibold">
                  {summary.wordDetail.meanings[0].tur}
                </span>
              )}
            </div>
            <p className="text-xs font-medium text-slate-800 leading-relaxed">
              {summary.wordDetail.meanings[0].anlam}
            </p>
          </div>
        )}

        {/* Round Leaderboard */}
        <div className="my-4 space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 text-left">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Bu Turun Puanları:
          </span>

          {summary.rankings?.map((p, idx) => (
            <div
              key={p.playerId}
              className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-100 text-xs shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-400 w-4">
                  {idx + 1}.
                </span>
                <span className="text-base">{p.avatar}</span>
                <span className="font-bold text-slate-800 truncate max-w-[120px]">
                  {p.name}
                </span>
              </div>

              <div className="text-right">
                <span className="font-heading font-black text-emerald-600 block">
                  +{p.roundPoints} P
                </span>
                <span className="text-[10px] text-slate-400">
                  {p.isSolved ? `${p.guessesCount}. deneme` : 'Bilemedi'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Next Round Countdown Progress */}
        <div className="mt-2 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <span className="flex items-center gap-1.5 font-bold text-emerald-700">
            <Clock className="w-3.5 h-3.5 animate-spin" />
            {summary.isFinalRound ? 'Sonuçlar Hesaplanıyor...' : 'Sonraki Kelime Başlıyor:'}
          </span>
          <span className="font-mono font-black text-emerald-600 text-sm">
            {secondsLeft}s
          </span>
        </div>

        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-emerald-500 transition-all duration-1000 ease-linear"
            style={{ width: `${(secondsLeft / (summary.nextRoundIn || 5)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
