import React, { useState } from 'react';
import { BookOpen, Sparkles, Quote, Library, CheckCircle2, XCircle, Clock, ChevronDown, ChevronUp, ExternalLink, HelpCircle } from 'lucide-react';
import { toTurkishUpper, toTurkishLower } from '../../utils/turkish';

export default function PlayerWordsTables({
  leaderboard = [],
  playerWords = {},
  playerProgress = {},
  wordDetails = {},
  troubleAssignments = null,
  isTrouble = false,
  currentPlayerId = null,
  totalWordsCount = 5
}) {
  // Track which words have their expanded meanings open: { [`${playerId}-${wordIndex}`]: boolean }
  const [expandedRows, setExpandedRows] = useState({});
  // Selected word for full inspect modal (optional quick view)
  const [inspectWord, setInspectWord] = useState(null);

  const toggleRow = (key) => {
    setExpandedRows(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!leaderboard || leaderboard.length === 0) return null;

  // Determine grid columns dynamically based on player count
  const playerCount = leaderboard.length;
  let gridColsClass = 'grid-cols-1';
  if (playerCount === 2) {
    gridColsClass = 'grid-cols-1 md:grid-cols-2';
  } else if (playerCount === 3) {
    gridColsClass = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';
  } else if (playerCount >= 4) {
    gridColsClass = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  }

  return (
    <div className="w-full text-left my-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5 px-1 pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 shadow-2xs">
            <BookOpen className="w-4 h-4" />
          </span>
          <div>
            <h3 className="font-heading font-black text-sm sm:text-base text-slate-900 tracking-tight flex items-center gap-2">
              <span>Oyuncu Kelimeleri ve TDK Anlamları</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {playerCount} Oyuncu Tablosu
              </span>
            </h3>
            <p className="text-[11px] text-slate-500">
              {isTrouble
                ? 'Trouble modu: Rakiplerin birbirine seçtiği 5 kelime ve resmi TDK sözlük karşılıkları'
                : 'Oyunda sorulan kelimeler, yarışmacıların durumları ve resmi TDK sözlük tanımları'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200/70">
            <Sparkles className="w-3 h-3 text-emerald-600" />
            Resmi TDK GTS Verisi
          </span>
        </div>
      </div>

      {/* Multi-Player Tables Grid */}
      <div className={`grid ${gridColsClass} gap-4 xl:gap-5 items-start`}>
        {leaderboard.map((item, pIdx) => {
          const playerId = item.playerId;
          const isSelf = playerId === currentPlayerId;
          const progress = playerProgress[playerId] || {};
          const assignedWords = playerWords[playerId] || [];
          const wordsToShow = assignedWords.length > 0
            ? assignedWords
            : (item.words || []);

          // Trouble mode assignment (who chose words for this player)
          const troubleSource = troubleAssignments?.[playerId];
          const solvedCount = progress.solvedWordsCount ?? item.solvedWordsCount ?? 0;
          const totalCount = wordsToShow.length || totalWordsCount;

          return (
            <div
              key={playerId || pIdx}
              className={`bg-white rounded-2xl sm:rounded-3xl border transition-all duration-200 flex flex-col overflow-hidden shadow-xs ${
                isSelf
                  ? 'border-emerald-300 ring-2 ring-emerald-500/20 shadow-md'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              {/* Player Column Header */}
              <div
                className={`p-3.5 sm:p-4 border-b flex items-center justify-between gap-2 ${
                  isSelf
                    ? 'bg-gradient-to-r from-emerald-50/90 to-teal-50/80 border-emerald-200/80'
                    : 'bg-slate-50/90 border-slate-200/80'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative shrink-0">
                    <span className="text-2xl sm:text-3xl select-none block">
                      {item.avatar || '👤'}
                    </span>
                    <span
                      className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center font-heading font-black text-[10px] border-2 border-white shadow-2xs ${
                        item.rank === 1
                          ? 'bg-amber-400 text-white'
                          : item.rank === 2
                          ? 'bg-slate-300 text-slate-800'
                          : item.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {item.rank}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-heading font-black text-xs sm:text-sm text-slate-900 truncate">
                        {item.name}
                      </span>
                      {isSelf && (
                        <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-md bg-emerald-600 text-white shadow-2xs">
                          Sen
                        </span>
                      )}
                    </div>

                    {isTrouble && troubleSource && (
                      <span className="text-[10px] text-purple-700 font-bold block truncate mt-0.5">
                        🎯 Seçen: {troubleSource.sourceName}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end shrink-0 gap-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-black px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200 shadow-2xs">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    {solvedCount} / {totalCount}
                  </span>
                  {item.totalScore !== undefined && item.totalScore > 0 && (
                    <span className="text-[10px] font-heading font-bold text-slate-500">
                      {item.totalScore} Puan
                    </span>
                  )}
                </div>
              </div>

              {/* Table of words */}
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100/75 border-b border-slate-200/80 text-[10px] font-heading font-black uppercase tracking-wider text-slate-500">
                      <th className="py-2.5 px-3 w-8 text-center">#</th>
                      <th className="py-2.5 px-3">Kelime</th>
                      <th className="py-2.5 px-2.5 text-center w-24">Durum</th>
                      <th className="py-2.5 px-3">TDK Anlamı</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {wordsToShow.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-6 text-center text-slate-400 text-xs italic">
                          Kelime kaydı bulunamadı.
                        </td>
                      </tr>
                    ) : (
                      wordsToShow.map((rawWord, wIdx) => {
                        const cleanWord = toTurkishLower(rawWord || '');
                        const details = wordDetails[cleanWord] || {
                          word: cleanWord,
                          origin: null,
                          meanings: [{ anlam: 'TDK sözlüğünde temel madde başı', tur: 'kelime', ornekler: [] }],
                          source: 'TDK Sözlük'
                        };

                        const meanings = details.meanings && details.meanings.length > 0
                          ? details.meanings
                          : [{ anlam: 'Tanım bulunamadı', tur: null, ornekler: [] }];
                        const firstMeaning = meanings[0];

                        // Determine solved status
                        // 1. check wordHistory if available
                        const historyItem = progress.wordHistory?.find(
                          h => h.wordIndex === wIdx || toTurkishLower(h.word || '') === cleanWord
                        );

                        let isSolved = false;
                        let isFailed = false;
                        let guessCount = null;

                        if (historyItem) {
                          isSolved = Boolean(historyItem.isSolved);
                          isFailed = Boolean(historyItem.isFailed);
                          guessCount = historyItem.guessCount;
                        } else {
                          // Fallback based on solvedWordsCount
                          if (wIdx < solvedCount) {
                            isSolved = true;
                          } else if (progress.isGameFinished && wIdx >= solvedCount) {
                            isFailed = true;
                          }
                        }

                        const rowKey = `${playerId}-${wIdx}`;
                        const isExpanded = Boolean(expandedRows[rowKey]);
                        const hasExtraMeanings = meanings.length > 1;
                        const hasExamples = meanings.some(m => Array.isArray(m.ornekler) && m.ornekler.length > 0);

                        return (
                          <React.Fragment key={rowKey}>
                            <tr
                              className={`transition-colors hover:bg-slate-50/80 ${
                                isSolved
                                  ? 'bg-white'
                                  : isFailed
                                  ? 'bg-rose-50/20'
                                  : 'bg-white'
                              }`}
                            >
                              {/* # Index */}
                              <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-400 text-[11px] align-top pt-3">
                                {wIdx + 1}
                              </td>

                              {/* Word Name & Category */}
                              <td className="py-2.5 px-3 align-top min-w-[105px]">
                                <div className="flex flex-col">
                                  <span className="font-heading font-black text-sm text-slate-900 tracking-wide">
                                    {toTurkishUpper(rawWord)}
                                  </span>

                                  <div className="flex items-center gap-1 flex-wrap mt-0.5">
                                    {firstMeaning?.tur && (
                                      <span className="text-[9px] font-bold uppercase text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">
                                        {firstMeaning.tur}
                                      </span>
                                    )}
                                    {details.origin && (
                                      <span className="text-[9px] text-amber-700 italic font-medium">
                                        {details.origin}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Solved Status */}
                              <td className="py-2.5 px-2.5 text-center align-top pt-2.5">
                                {isSolved ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100/90 text-emerald-800 text-[10px] font-black border border-emerald-300 shadow-2xs whitespace-nowrap">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    {guessCount ? `${guessCount}/6` : 'Bilindi'}
                                  </span>
                                ) : isFailed ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-black border border-rose-300 shadow-2xs whitespace-nowrap">
                                    <XCircle className="w-3 h-3 text-rose-600" />
                                    Bilemedi
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold border border-slate-200 whitespace-nowrap">
                                    <Clock className="w-2.5 h-2.5 text-slate-400" />
                                    Açılmadı
                                  </span>
                                )}
                              </td>

                              {/* TDK Meaning */}
                              <td className="py-2.5 px-3 align-top min-w-[160px]">
                                <div className="space-y-1">
                                  <p className="text-slate-700 text-xs font-normal leading-relaxed">
                                    {firstMeaning?.anlam || 'Tanım bulunamadı'}
                                  </p>

                                  {/* Expand / Collapse toggle for extra definitions & examples */}
                                  {(hasExtraMeanings || hasExamples) && (
                                    <button
                                      type="button"
                                      onClick={() => toggleRow(rowKey)}
                                      className="inline-flex items-center gap-1 text-[10px] font-bold text-teal-700 hover:text-teal-900 transition mt-1 pt-0.5 hover:underline cursor-pointer"
                                    >
                                      {isExpanded ? (
                                        <>
                                          <ChevronUp className="w-3 h-3" />
                                          <span>Detayları Gizle</span>
                                        </>
                                      ) : (
                                        <>
                                          <ChevronDown className="w-3 h-3" />
                                          <span>
                                            {hasExtraMeanings ? `+${meanings.length - 1} Anlam` : ''}
                                            {hasExtraMeanings && hasExamples ? ' • ' : ''}
                                            {hasExamples ? 'Örnek Cümleler' : ''}
                                          </span>
                                        </>
                                      )}
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>

                            {/* Expanded extra meanings & literary examples */}
                            {isExpanded && (
                              <tr className="bg-slate-50/90 border-b border-slate-200/80">
                                <td colSpan={4} className="p-3 pl-8 text-left animate-fade-in">
                                  <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-2xs space-y-2.5">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                                      <span className="text-[10px] font-heading font-black uppercase text-slate-500 tracking-wider flex items-center gap-1">
                                        <Library className="w-3 h-3 text-teal-600" />
                                        {toTurkishUpper(rawWord)} • Tüm TDK Tanımları ve Örnekler
                                      </span>
                                    </div>

                                    <div className="space-y-2">
                                      {meanings.map((m, mIdx) => (
                                        <div key={mIdx} className="text-xs">
                                          <div className="flex items-baseline gap-1.5">
                                            <span className="text-[10px] font-black font-mono text-slate-400">
                                              {mIdx + 1}.
                                            </span>
                                            {m.tur && (
                                              <span className="text-[9px] font-bold uppercase text-emerald-800 bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200/50">
                                                {m.tur}
                                              </span>
                                            )}
                                            <span className="text-slate-800 font-medium leading-relaxed">
                                              {m.anlam}
                                            </span>
                                          </div>

                                          {/* Literary quotes */}
                                          {Array.isArray(m.ornekler) && m.ornekler.length > 0 && (
                                            <div className="mt-1 pl-4 space-y-1">
                                              {m.ornekler.map((ex, exIdx) => (
                                                <div
                                                  key={exIdx}
                                                  className="text-[11px] text-slate-600 italic bg-slate-50/80 p-1.5 rounded-lg border border-slate-100 flex items-start gap-1.5"
                                                >
                                                  <Quote className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                                                  <div className="min-w-0">
                                                    <span>"{ex.ornek}"</span>
                                                    {ex.yazar && (
                                                      <span className="text-[10px] text-slate-400 font-semibold block not-italic mt-0.5">
                                                        — {ex.yazar}
                                                      </span>
                                                    )}
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
