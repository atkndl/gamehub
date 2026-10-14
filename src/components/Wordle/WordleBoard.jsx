import React from 'react';
import { toTurkishUpper } from '../../utils/turkish';

export default function WordleBoard({
  guesses = [], // Array of { guess: string, result: string[] }
  currentGuess = '', // Currently typed word (up to 5 chars)
  isShaking = false,
  revealIndex = -1 // If currently animating flip
}) {
  const rows = [];

  // Completed guesses
  for (let r = 0; r < guesses.length; r++) {
    rows.push({
      type: 'completed',
      word: guesses[r].guess,
      result: guesses[r].result
    });
  }

  // Current row (if game still has turns left < 6)
  if (rows.length < 6) {
    rows.push({
      type: 'current',
      word: currentGuess,
      result: null
    });
  }

  // Remaining empty rows
  while (rows.length < 6) {
    rows.push({
      type: 'empty',
      word: '',
      result: null
    });
  }

  return (
    <div className="flex flex-col items-center justify-center gap-1.5 sm:gap-2 my-auto select-none">
      {rows.map((row, rIdx) => {
        const isCurrentRow = row.type === 'current';
        const letters = row.word ? toTurkishUpper(row.word).split('') : [];

        return (
          <div
            key={rIdx}
            className={`grid grid-cols-5 gap-1.5 sm:gap-2 ${
              isCurrentRow && isShaking ? 'animate-shake' : ''
            }`}
          >
            {Array.from({ length: 5 }).map((_, cIdx) => {
              const char = letters[cIdx] || '';
              const status = row.result ? row.result[cIdx] : null;

              // Cell styles
              let bgClass = 'bg-white border-slate-200 text-slate-800';
              let animClass = '';
              let style = {};

              if (row.type === 'current' && char) {
                bgClass = 'bg-white border-slate-700 text-slate-900 shadow-xs';
                animClass = 'animate-pop';
              } else if (row.type === 'completed') {
                if (status === 'correct') {
                  bgClass = 'bg-emerald-600 border-emerald-600 text-white shadow-xs';
                } else if (status === 'present') {
                  bgClass = 'bg-amber-500 border-amber-500 text-white shadow-xs';
                } else {
                  bgClass = 'bg-slate-700 border-slate-700 text-white';
                }

                animClass = 'animate-flip';
                style = { animationDelay: `${cIdx * 100}ms` };
              }

              return (
                <div
                  key={cIdx}
                  style={style}
                  className={`w-12 h-12 sm:w-14 sm:h-14 md:w-15 md:h-15 rounded-xl border-2 flex items-center justify-center font-heading font-black text-xl sm:text-2xl md:text-3xl transition-transform ${bgClass} ${animClass}`}
                >
                  {char}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
