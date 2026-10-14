import React, { useState } from 'react';
import { BookOpen, Sparkles, Quote, Library, ChevronRight } from 'lucide-react';
import { toTurkishUpper } from '../../utils/turkish';

export default function TDKWordCard({ words = [], wordDetails = {} }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!words || words.length === 0) return null;

  const currentWord = words[selectedIndex] || words[0];
  const cleanWord = currentWord.toLocaleLowerCase('tr-TR');
  const details = wordDetails[cleanWord] || {
    word: cleanWord,
    origin: null,
    meanings: [{ anlam: 'TDK sözlüğünde temel madde başı', tur: 'kelime', ornekler: [] }],
    source: 'TDK Sözlük'
  };

  const meanings = details.meanings && details.meanings.length > 0
    ? details.meanings
    : [{ anlam: 'Tanım hazırlanıyor...', tur: null, ornekler: [] }];

  return (
    <div className="w-full bg-gradient-to-b from-slate-50 to-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden text-left mb-6">
      {/* Header bar */}
      <div className="px-5 py-3.5 bg-slate-100/80 border-b border-slate-200/70 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600">
            <Library className="w-4 h-4" />
          </span>
          <span className="text-xs font-heading font-black tracking-wider uppercase text-slate-700">
            TDK Kelime Bilgi Kartı
          </span>
        </div>
        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded-full flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-500" />
          Resmi Sözlük Tanımları
        </span>
      </div>

      {/* Word navigation tabs (if more than 1 word) */}
      {words.length > 1 && (
        <div className="px-4 py-2 bg-slate-50/60 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {words.map((w, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-heading font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <span className="text-[10px] opacity-70">{idx + 1}.</span>
                <span>{toTurkishUpper(w)}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Active Word Main Card */}
      <div className="p-5">
        {/* Title & Origin row */}
        <div className="flex items-baseline justify-between flex-wrap gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <h3 className="font-heading font-black text-2xl tracking-wide text-slate-900">
              {toTurkishUpper(details.word || currentWord)}
            </h3>
            {details.origin && (
              <span className="px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200/70 text-xs font-medium italic">
                📖 {details.origin}
              </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400 font-mono">
            {selectedIndex + 1} / {words.length} Kelime
          </span>
        </div>

        {/* Meanings List */}
        <div className="mt-4 space-y-3 max-h-64 overflow-y-auto pr-1">
          {meanings.map((m, mIdx) => (
            <div
              key={mIdx}
              className="p-3.5 rounded-2xl bg-white border border-slate-100 shadow-2xs hover:border-slate-200 transition"
            >
              <div className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 font-heading font-black text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                  {mIdx + 1}
                </span>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {m.tur && (
                      <span className="px-2 py-0.2 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-bold uppercase tracking-wider">
                        {m.tur}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-800 text-xs sm:text-sm font-medium leading-relaxed">
                    {m.anlam}
                  </p>

                  {/* Examples (if any) */}
                  {Array.isArray(m.ornekler) && m.ornekler.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1.5">
                      {m.ornekler.map((ex, exIdx) => (
                        <div
                          key={exIdx}
                          className="flex items-start gap-1.5 text-xs text-slate-500 italic bg-slate-50/70 p-2 rounded-xl border border-slate-100"
                        >
                          <Quote className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <div className="min-w-0">
                            <span>"{ex.ornek}"</span>
                            {ex.yazar && (
                              <span className="block not-italic font-bold text-slate-700 text-[11px] mt-0.5">
                                — {ex.yazar}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Compounds if any */}
        {Array.isArray(details.birlesikler) && details.birlesikler.length > 0 && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Birleşik Sözler / Deyimler:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {details.birlesikler.slice(0, 8).map((b, bIdx) => (
                <span
                  key={bIdx}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
