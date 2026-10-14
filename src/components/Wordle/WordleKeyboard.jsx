import React from 'react';
import { Delete } from 'lucide-react';
import { toTurkishUpper } from '../../utils/turkish';

const KEYBOARD_ROWS = [
  ['E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'Ğ', 'Ü'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ş', 'İ'],
  ['ENTER', 'Z', 'C', 'V', 'B', 'N', 'M', 'Ö', 'Ç', 'BACKSPACE']
];

export default function WordleKeyboard({
  keyStatuses = {}, // map of letter -> 'correct' | 'present' | 'absent'
  onKeyPress,
  disabled = false
}) {
  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-1.5 px-1 sm:px-2 select-none">
      {KEYBOARD_ROWS.map((row, rIdx) => (
        <div key={rIdx} className="flex justify-center gap-1 sm:gap-1.5 w-full">
          {row.map((key) => {
            const isSpecial = key === 'ENTER' || key === 'BACKSPACE';
            const status = keyStatuses[key];

            let bgClass = 'bg-slate-200 text-slate-800 hover:bg-slate-300';
            if (status === 'correct') {
              bgClass = 'bg-emerald-600 text-white hover:bg-emerald-700';
            } else if (status === 'present') {
              bgClass = 'bg-amber-500 text-white hover:bg-amber-600';
            } else if (status === 'absent') {
              bgClass = 'bg-slate-700 text-slate-300 hover:bg-slate-800';
            }

            return (
              <button
                key={key}
                type="button"
                disabled={disabled}
                onClick={() => onKeyPress(key)}
                className={`h-12 sm:h-13 rounded-lg font-heading font-black text-xs sm:text-sm flex items-center justify-center transition-all active:scale-95 shadow-xs ${
                  isSpecial ? 'px-2.5 sm:px-4 text-[11px] sm:text-xs font-bold' : 'flex-1 max-w-[42px]'
                } ${bgClass} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {key === 'BACKSPACE' ? (
                  <Delete className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
