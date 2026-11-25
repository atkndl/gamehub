import React from 'react';
import { useGame } from '../../context/GameContext';
import { Play, Zap, Target, BookOpen, Clock, Hash, Check, Flame, AlertCircle } from 'lucide-react';

export default function WordleConfigModal({ isOpen, onClose }) {
  const { room, player, updateWordleConfig, startWordle } = useGame();

  if (!isOpen || !room) return null;

  const isHost = player?.isHost;
  const config = room.wordleConfig || {
    wordCount: 5,
    mode: 'speed',
    scoringType: 'speed',
    wordPool: 'common',
    isTroubleMode: false
  };

  const isTroubleMode = Boolean(config.isTroubleMode);
  const playerCount = room.players?.length || 1;
  const canStartTrouble = playerCount >= 2;

  const handleChange = (key, val) => {
    if (!isHost) return;
    updateWordleConfig({ [key]: val });
  };

  const handleToggleTrouble = () => {
    if (!isHost) return;
    const nextVal = !isTroubleMode;
    updateWordleConfig({
      isTroubleMode: nextVal,
      wordCount: nextVal ? 5 : config.wordCount
    });
  };

  const handleStart = async () => {
    if (!isHost) return;
    if (isTroubleMode && !canStartTrouble) return;
    try {
      await startWordle();
      onClose();
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-heading font-black text-xl shadow-xs">
              W
            </div>
            <div>
              <h2 className="font-heading font-black text-lg text-slate-900 leading-tight">
                Wordle Oyun Ayarları
              </h2>
              <p className="text-xs text-slate-500">
                {isHost ? 'Oyun kurallarını belirle ve başlat' : 'Oda sahibinin belirlediği kurallar'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Trouble Mode Toggle Card */}
          <div
            onClick={isHost ? handleToggleTrouble : undefined}
            className={`p-4 rounded-3xl border-2 transition-all relative overflow-hidden ${
              isTroubleMode
                ? 'border-purple-500 bg-gradient-to-br from-purple-50 via-pink-50/50 to-white shadow-md shadow-purple-500/10'
                : 'border-slate-200 bg-slate-50/60 hover:border-slate-300'
            } ${isHost ? 'cursor-pointer' : 'cursor-default'}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 transition ${
                    isTroubleMode
                      ? 'bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-md shadow-purple-500/25'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  🔥
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-heading font-black text-sm text-slate-900">
                      Trouble (Meydan Okuma) Modu
                    </h3>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                        isTroubleMode
                          ? 'bg-purple-100 text-purple-700 border border-purple-200'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isTroubleMode ? 'Aktif 😈' : 'Kapalı'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Rakipler birbirlerinin 5 kelimesini seçer! Her oyuncuya özel 20 kelimelik benzersiz havuz gelir.
                  </p>
                </div>
              </div>

              {/* Toggle switch */}
              {isHost && (
                <div
                  className={`w-12 h-6 rounded-full transition-colors relative shrink-0 p-0.5 ${
                    isTroubleMode ? 'bg-purple-600' : 'bg-slate-300'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                      isTroubleMode ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </div>
              )}
            </div>

            {isTroubleMode && !canStartTrouble && (
              <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center gap-2 text-xs font-bold text-amber-800">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>Trouble Modu için odada en az 2 oyuncu olmalıdır (Şu an: {playerCount}).</span>
              </div>
            )}
          </div>

          {/* 1. Kelime Sayısı */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                <Hash className="w-3.5 h-3.5 text-emerald-600" />
                Kaç Kelimeden Oluşacak?
              </label>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                {isTroubleMode ? '5 Kelime (Trouble Sabit)' : `${config.wordCount} Kelime`}
              </span>
            </div>
            {isTroubleMode ? (
              <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 text-xs text-purple-900 font-medium">
                🔒 <strong>Trouble Modunda</strong> her oyuncu rakibine 20 kelimelik havuzdan <strong>5 kelime</strong> seçer.
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2">
                {[1, 3, 5, 10].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    disabled={!isHost}
                    onClick={() => handleChange('wordCount', cnt)}
                    className={`py-2.5 rounded-xl font-heading font-bold text-sm transition-all border ${
                      config.wordCount === cnt
                        ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/25 scale-[1.02]'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
                    } ${!isHost ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    {cnt} Kelime
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* 2. Oyun Modu */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5 mb-2.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Oyun Modu Seçimi
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Hız Modu */}
              <button
                type="button"
                disabled={!isHost}
                onClick={() => handleChange('mode', 'speed')}
                className={`p-3.5 rounded-2xl text-left border-2 transition-all relative ${
                  config.mode === 'speed'
                    ? 'border-amber-500 bg-amber-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                } ${!isHost ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">⚡</span>
                    <span className="font-heading font-black text-sm text-slate-900">1. Hız Modu</span>
                  </div>
                  {config.mode === 'speed' && (
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bilen hemen sonraki kelimeye geçer. En çok doğru kelime bilen, eşitlikte ise en hızlı bitiren kazanır.
                </p>
              </button>

              {/* Puan Modu */}
              <button
                type="button"
                disabled={!isHost}
                onClick={() => handleChange('mode', 'score')}
                className={`p-3.5 rounded-2xl text-left border-2 transition-all relative ${
                  config.mode === 'score'
                    ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                } ${!isHost ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎯</span>
                    <span className="font-heading font-black text-sm text-slate-900">2. Puan Modu</span>
                  </div>
                  {config.mode === 'score' && (
                    <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bilenler bekleme modunda bekler. Herkes <strong className="text-slate-900">aynı anda</strong> sonraki kelimeye geçer. Puan toplanır.
                </p>
              </button>
            </div>
          </div>

          {/* Puan Modu Alt Seçeneği: Puanlama Türü */}
          {config.mode === 'score' && (
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 animate-fade-in space-y-2.5">
              <label className="text-xs font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-emerald-700" />
                Puan Modu Kriteri: Kim Daha Yüksek Puan Alsın?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={!isHost}
                  onClick={() => handleChange('scoringType', 'speed')}
                  className={`p-2.5 rounded-xl text-left text-xs font-bold border transition ${
                    config.scoringType === 'speed'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-emerald-200 hover:bg-emerald-100/50'
                  } ${!isHost ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>En Kısa Sürede Bilen</span>
                  </div>
                  <p className={`text-[11px] font-normal ${config.scoringType === 'speed' ? 'text-emerald-100' : 'text-slate-500'}`}>
                    Hızlı çözenlere saniye başına ekstra puan bonusu.
                  </p>
                </button>

                <button
                  type="button"
                  disabled={!isHost}
                  onClick={() => handleChange('scoringType', 'guesses')}
                  className={`p-2.5 rounded-xl text-left text-xs font-bold border transition ${
                    config.scoringType === 'guesses'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                      : 'bg-white text-slate-700 border-emerald-200 hover:bg-emerald-100/50'
                  } ${!isHost ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Target className="w-3.5 h-3.5" />
                    <span>En Az Denemede Bilen</span>
                  </div>
                  <p className={`text-[11px] font-normal ${config.scoringType === 'guesses' ? 'text-emerald-100' : 'text-slate-500'}`}>
                    1. veya 2. denemede bulan daha çok puan alır.
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* 3. Kelime Havuzu */}
          <div>
            <label className="text-xs font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5 mb-2">
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              Kelime Havuzu (TDK Resmi Sözlük)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={!isHost}
                onClick={() => handleChange('wordPool', 'common')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                  config.wordPool === 'common'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                } ${!isHost ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <span>⭐ Standart TDK (Önerilen)</span>
              </button>

              <button
                type="button"
                disabled={!isHost}
                onClick={() => handleChange('wordPool', 'all')}
                className={`py-2 px-3 rounded-xl text-xs font-bold border transition flex items-center justify-center gap-1.5 ${
                  config.wordPool === 'all'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                } ${!isHost ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <span>🏛️ Tüm TDK Sözlüğü</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-200/60 transition"
          >
            Kapat
          </button>

          {isHost ? (
            <button
              type="button"
              disabled={isTroubleMode && !canStartTrouble}
              onClick={handleStart}
              className={`py-2.5 px-6 rounded-xl font-heading font-black text-sm tracking-wide shadow-md active:scale-95 transition flex items-center gap-2 ${
                isTroubleMode && !canStartTrouble
                  ? 'bg-slate-350 text-slate-500 cursor-not-allowed opacity-60'
                  : isTroubleMode
                  ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white shadow-purple-500/25 cursor-pointer animate-pulse'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-emerald-500/25 cursor-pointer'
              }`}
            >
              {isTroubleMode ? (
                <>
                  <Flame className="w-4 h-4 fill-current" />
                  <span>
                    {canStartTrouble
                      ? 'Trouble Modunu Başlat (5 Kelime)'
                      : `En Az 2 Oyuncu Gerekli (${playerCount}/2)`}
                  </span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>Oyunu Başlat ({config.wordCount} Kelime)</span>
                </>
              )}
            </button>
          ) : (
            <div className="text-xs font-bold text-slate-400 py-2">
              👑 Oda sahibi oyunu başlatacak...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
