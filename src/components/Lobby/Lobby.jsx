import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import WordleConfigModal from './WordleConfigModal';
import SnakeClassModal, { SNAKE_CLASSES } from '../Snake/SnakeClassModal';
import SurvivalConfigModal from '../Survival/SurvivalConfigModal';
import RacingConfigModal from '../Racing/RacingConfigModal';
import LiveChat from '../Common/LiveChat';
import { Copy, Check, Share2, Play, Users, Crown, Settings2, CheckCircle2, Sparkles, Zap, Flame, Snowflake, Shield } from 'lucide-react';

export default function Lobby() {
  const { room, player, showToast, updateProfile, updateWordleConfig, startWordle, startSnake, startSurvival, startLiarsBar, startRacing, selectGame } = useGame();
  const [copied, setCopied] = useState(false);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [snakeClassModalOpen, setSnakeClassModalOpen] = useState(false);
  const [survivalModalOpen, setSurvivalModalOpen] = useState(false);
  const [racingModalOpen, setRacingModalOpen] = useState(false);

  if (!room) return null;

  const isHost = player?.isHost;
  const wordleConfig = room.wordleConfig || {
    wordCount: 5,
    mode: 'speed',
    scoringType: 'speed',
    wordPool: 'common',
    isTroubleMode: false
  };

  const handleToggleTrouble = () => {
    if (!isHost) return;
    const nextVal = !wordleConfig.isTroubleMode;
    updateWordleConfig({
      isTroubleMode: nextVal,
      wordCount: nextVal ? 5 : (wordleConfig.wordCount || 5)
    });
    if (nextVal) {
      showToast('🔥 Trouble Modu Aktif! Rakipler birbirine 5 kelime seçecek 😈');
    } else {
      showToast('Klasik Wordle Aktif (Sistem rastgele kelimeler seçecek)');
    }
  };
  const survivalConfig = room.survivalConfig || {
    mode: 'battle_royale',
    matchDuration: 180
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(room.code);
    setCopied(true);
    showToast(`Oda kodu (${room.code}) kopyalandı! 📋`);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareLink = () => {
    const url = `${window.location.origin}?oda=${room.code}`;
    navigator.clipboard.writeText(url);
    showToast('Davet bağlantısı kopyalandı! 🔗');
  };

  const handleToggleReady = () => {
    if (isHost) return;
    updateProfile({ ready: !player.ready });
  };

  const handleStart = async () => {
    if (!isHost) return;
    try {
      await startWordle();
    } catch (e) {}
  };

  const handleStartLiarsBar = async () => {
    if (!isHost) return;
    if (room.players.length < 2) {
      showToast("Liar's Bar oyunu en az 2 oyuncu gerektirir! Lütfen arkadaşınızı davet edin 👥");
      return;
    }
    try {
      await startLiarsBar();
    } catch (e) {
      showToast(e.message || "Liar's Bar başlatılamadı.");
    }
  };

  const handleStartRacing = async () => {
    if (!isHost) return;
    try {
      await startRacing();
    } catch (e) {
      showToast(e.message || "Yarış başlatılamadı.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
      {/* Top Header Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-heading font-black text-lg shadow-xs shrink-0">
            GH
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Oda</span>
              <span className="font-mono text-xl sm:text-2xl font-black text-slate-900 tracking-wider">
                {room.code}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition active:scale-95 cursor-pointer"
                title="Kodu Kopyala"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <p className="text-xs text-slate-500">{room.players.length} Oyuncu Lobide</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShareLink}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition active:scale-95 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            Davet Linki
          </button>
        </div>
      </div>

      {/* Main Grid: Clean Game Grid on Left, Players & Chat on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Minimal Game Grid (2 Cols on lg) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="font-heading font-black text-lg text-slate-900">
              Oyunlar
            </h2>
            <span className="text-xs text-slate-400">
              Seçili Oyun: <strong className="text-slate-700 uppercase">{room.selectedGame === 'survival' ? 'Survival' : room.selectedGame === 'snake' ? 'Yılan Arenası' : 'Wordle'}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Card 1: Wordle */}
            <div
              className={`bg-white rounded-2xl p-5 border-2 transition-all flex flex-col justify-between ${
                room.selectedGame === 'wordle'
                  ? 'border-emerald-500/90 shadow-md shadow-emerald-500/10'
                  : 'border-slate-200 hover:border-slate-300 opacity-90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex gap-1 items-center font-heading font-black text-xs text-white">
                    <span className="w-7 h-7 rounded-md bg-emerald-500 flex items-center justify-center">W</span>
                    <span className="w-7 h-7 rounded-md bg-amber-400 flex items-center justify-center">O</span>
                    <span className="w-7 h-7 rounded-md bg-slate-700 flex items-center justify-center">R</span>
                    <span className="w-7 h-7 rounded-md bg-emerald-500 flex items-center justify-center">D</span>
                  </div>
                  {room.selectedGame === 'wordle' ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Aktif Oyun
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                      Sözlük Oyunu
                    </span>
                  )}
                </div>

                <h3 className="font-heading font-black text-base text-slate-900 mb-0.5">
                  Türkçe Wordle
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  5 Harf • 6 Deneme • TDK Resmi Sözlük
                </p>

                {/* Trouble Modu Quick Toggle Switch directly on the Lobby Card */}
                <div
                  onClick={isHost ? handleToggleTrouble : undefined}
                  className={`p-3 rounded-2xl border transition-all flex items-center justify-between mb-3 ${
                    wordleConfig.isTroubleMode
                      ? 'bg-gradient-to-r from-purple-50 via-pink-50 to-purple-50 border-purple-400 text-purple-950 shadow-xs'
                      : 'bg-slate-50 border-slate-200/90 text-slate-700 hover:border-slate-300'
                  } ${isHost ? 'cursor-pointer' : 'cursor-default'}`}
                  title={isHost ? 'Trouble Modunu Aç/Kapat' : 'Sadece oda sahibi değiştirebilir'}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">🔥</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-heading font-black text-xs text-slate-900">
                          Trouble (Meydan Okuma) Modu
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${
                          wordleConfig.isTroubleMode ? 'bg-purple-200 text-purple-800' : 'bg-slate-200 text-slate-600'
                        }`}>
                          Opsiyonel
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block">
                        {wordleConfig.isTroubleMode
                          ? 'Aktif • Rakipler 20 kelimelik havuzdan seçecek 😈'
                          : 'Kapalı • Klasik Wordle oynanır (Açmak için tıkla)'}
                      </span>
                    </div>
                  </div>

                  {isHost && (
                    <div className="flex items-center gap-1.5 shrink-0 ml-2">
                      <div
                        className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                          wordleConfig.isTroubleMode ? 'bg-purple-600' : 'bg-slate-300'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                            wordleConfig.isTroubleMode ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Settings Pill */}
                <div className={`p-2.5 rounded-xl border text-xs font-semibold mb-4 flex items-center justify-between ${
                  wordleConfig.isTroubleMode
                    ? 'bg-purple-50/60 border-purple-200/70 text-purple-900'
                    : 'bg-slate-50 border-slate-100 text-slate-700'
                }`}>
                  {wordleConfig.isTroubleMode ? (
                    <>
                      <span className="font-bold flex items-center gap-1 text-purple-800">
                        <span>😈</span> 5 Kelime (Seçmeli)
                      </span>
                      <span className="text-purple-300">•</span>
                      <span>{wordleConfig.mode === 'speed' ? '⚡ Hız Modu' : '🎯 Puan Modu'}</span>
                      <span className="text-purple-300">•</span>
                      <span className="text-purple-700 font-bold">20 Havuz Çipi</span>
                    </>
                  ) : (
                    <>
                      <span>{wordleConfig.wordCount || 5} Kelime</span>
                      <span className="text-slate-300">•</span>
                      <span>{wordleConfig.mode === 'speed' ? '⚡ Hız' : '🎯 Puan'}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500">{wordleConfig.wordPool === 'common' ? 'Standart' : 'Geniş'}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div>
                {isHost ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfigModalOpen(true)}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                      title="Wordle Ayarlarını Düzenle"
                    >
                      <Settings2 className="w-4 h-4" />
                    </button>
                    {room.selectedGame === 'wordle' ? (
                      <button
                        onClick={handleStart}
                        className={`flex-1 py-2.5 px-4 rounded-xl font-heading font-bold text-xs tracking-wide shadow-xs active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer text-white ${
                          wordleConfig.isTroubleMode
                            ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 shadow-purple-500/25 animate-pulse'
                            : 'bg-emerald-500 hover:bg-emerald-600'
                        }`}
                      >
                        {wordleConfig.isTroubleMode ? (
                          <>
                            <Flame className="w-3.5 h-3.5 fill-current text-rose-300" />
                            Trouble ile Başlat (5 Kelime)
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-current" />
                            Wordle Başlat ({wordleConfig.wordCount || 5} Kelime)
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => selectGame('wordle')}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-heading font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        Wordle'ı Seç
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setConfigModalOpen(true)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    Kuralları Gör
                  </button>
                )}
              </div>
            </div>

            {/* Card 2: Snake Arena */}
            <div
              className={`bg-white rounded-2xl p-5 border-2 transition-all flex flex-col justify-between ${
                room.selectedGame === 'snake'
                  ? 'border-amber-500/90 shadow-md shadow-amber-500/10'
                  : 'border-slate-200 hover:border-slate-300 opacity-90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-red-500 text-white flex items-center justify-center text-xl shadow-xs">
                    🐍
                  </div>
                  {room.selectedGame === 'snake' ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      Aktif Oyun
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      YENİ!
                    </span>
                  )}
                </div>

                <h3 className="font-heading font-black text-base text-slate-900 mb-0.5">
                  Yılan Arenası
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  4 Karakter • Ateş & Buz • 3 Can
                </p>

                {/* Character Picker Pill */}
                <button
                  type="button"
                  onClick={() => setSnakeClassModalOpen(true)}
                  className="w-full p-2.5 rounded-xl bg-amber-50/80 hover:bg-amber-100/80 border border-amber-200/80 text-xs text-amber-900 font-bold mb-4 flex items-center justify-between transition cursor-pointer"
                  title="Yılan Karakterini Değiştir"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{SNAKE_CLASSES[player?.snakeClass || 'speed']?.icon}</span>
                    <span>{SNAKE_CLASSES[player?.snakeClass || 'speed']?.title}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-amber-700 underline">
                    Değiştir ➔
                  </span>
                </button>
              </div>

              {/* Action Buttons */}
              <div>
                {isHost ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSnakeClassModalOpen(true)}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                      title="Karakterini Seç"
                    >
                      <Sparkles className="w-4 h-4 text-amber-500" />
                    </button>
                    {room.selectedGame === 'snake' ? (
                      <button
                        onClick={startSnake}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-heading font-bold text-xs tracking-wide shadow-xs active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Arenayı Başlat
                      </button>
                    ) : (
                      <button
                        onClick={() => selectGame('snake')}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-700 font-heading font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        Arenayı Seç
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setSnakeClassModalOpen(true)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Karakterini Seç ({SNAKE_CLASSES[player?.snakeClass || 'speed']?.name})</span>
                  </button>
                )}
              </div>
            </div>

            {/* Card 3: Survival */}
            <div
              className={`bg-white rounded-2xl p-5 border-2 transition-all flex flex-col justify-between ${
                room.selectedGame === 'survival'
                  ? 'border-blue-500/90 shadow-md shadow-blue-500/10'
                  : 'border-slate-200 hover:border-slate-300 opacity-90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl shadow-xs">
                    🎖️
                  </div>
                  {room.selectedGame === 'survival' ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      Aktif Oyun
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      YENİ!
                    </span>
                  )}
                </div>

                <h3 className="font-heading font-black text-base text-slate-900 mb-0.5">
                  Survival (2D Savaş)
                </h3>
                <p className="text-xs text-slate-500 mb-3">
                  Alan & Maç Modu • Dürbün • Siper & Loot
                </p>

                {/* Settings Pill */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 font-semibold mb-4 flex items-center justify-between">
                  <span>{survivalConfig.mode === 'battle_royale' ? '🔥 Alan Modu' : '⚔️ Maç Modu'}</span>
                  <span className="text-slate-300">•</span>
                  <span>{survivalConfig.mode === 'deathmatch' ? `${Math.round(survivalConfig.matchDuration / 60)} Dk` : 'Kızıl Gaz'}</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">2x-8x Dürbün</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div>
                {isHost ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSurvivalModalOpen(true)}
                      className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                      title="Survival Ayarlarını Düzenle"
                    >
                      <Settings2 className="w-4 h-4" />
                    </button>
                    {room.selectedGame === 'survival' ? (
                      <button
                        onClick={startSurvival}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-heading font-bold text-xs tracking-wide shadow-xs active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Survival Başlat
                      </button>
                    ) : (
                      <button
                        onClick={() => selectGame('survival')}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-heading font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        Survival'ı Seç
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setSurvivalModalOpen(true)}
                    className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    Kuralları Gör
                  </button>
                )}
              </div>
            </div>

            {/* Card 4: Liar's Bar (Blöf) */}
            <div
              className={`bg-white rounded-2xl p-5 border-2 transition-all flex flex-col justify-between ${
                room.selectedGame === 'liars_bar'
                  ? 'border-amber-500/90 shadow-md shadow-amber-500/15 ring-2 ring-amber-500/10'
                  : 'border-slate-200 hover:border-slate-300 opacity-90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-rose-600 to-amber-400 text-white flex items-center justify-center text-xl shadow-xs">
                    🍸
                  </div>
                  {room.selectedGame === 'liars_bar' ? (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      Aktif Oyun
                    </span>
                  ) : (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300">
                      YENİ! POPÜLER 🔥
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="font-heading font-black text-base text-slate-900">
                    Liar's Bar (Blöf)
                  </h3>
                  <span className="text-xs">💀</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  2–4 Oyuncu • K-Q-A & Joker • 6 Kablolu Bomba
                </p>

                {/* Settings Pill */}
                <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 font-semibold mb-4 flex items-center justify-between">
                  <span>🃏 20 Kart Deste</span>
                  <span className="text-stone-300">•</span>
                  <span>💣 C4 Rus Ruleti</span>
                  <span className="text-stone-300">•</span>
                  <span className="text-amber-700 font-bold">5 Kart Elde</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div>
                {isHost ? (
                  <div className="flex gap-2">
                    {room.selectedGame === 'liars_bar' ? (
                      <button
                        onClick={handleStartLiarsBar}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-heading font-black text-xs tracking-wide shadow-md shadow-amber-500/25 active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Liar's Bar Başlat (2–4 Kişi)
                      </button>
                    ) : (
                      <button
                        onClick={() => selectGame('liars_bar')}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-amber-50 text-slate-700 hover:text-amber-800 font-heading font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        Liar's Bar'ı Seç
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="w-full py-2.5 px-3 rounded-xl bg-slate-50 text-slate-500 font-medium text-xs text-center border border-slate-200">
                    👑 Oda sahibi Liar's Bar oyununu başlatabilir
                  </div>
                )}
              </div>
            </div>

            {/* Game Card: Racing & Drift */}
            <div
              className={`bg-white rounded-2xl p-5 border-2 transition flex flex-col justify-between shadow-xs ${
                room.selectedGame === 'racing'
                  ? 'border-red-500 ring-4 ring-red-500/10'
                  : 'border-slate-200 hover:border-slate-300 opacity-90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 via-amber-500 to-yellow-400 text-white flex items-center justify-center text-xl shadow-xs">
                    🏎️
                  </div>
                  {room.selectedGame === 'racing' ? (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-red-100 text-red-900 border border-red-300 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-red-600" />
                      Aktif Oyun
                    </span>
                  ) : (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                      YENİ! YARIŞ & DRİFT 🔥
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 mb-0.5">
                  <h3 className="font-heading font-black text-base text-slate-900">
                    2D Yarış & Drift (Grand Prix)
                  </h3>
                  <span className="text-xs">🏁</span>
                </div>
                <p className="text-xs text-slate-500 mb-3">
                  Pist & Çim Fizikleri • El Freni ile Drift • Pit Stop & Hasar
                </p>

                {/* Settings Pill */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 font-semibold mb-4 flex items-center justify-between">
                  <span>
                    {room.racingConfig?.mode === 'time'
                      ? `⏱️ ${room.racingConfig?.timeLimit / 60} Dk Süre`
                      : `🏁 ${room.racingConfig?.laps || 3} Tur`}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span>🔧 Pit Servisi</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-red-600 font-bold">Space: El Freni</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setRacingModalOpen(true)}
                    className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading font-bold text-xs transition flex items-center justify-center gap-1 cursor-pointer shrink-0"
                    title="Araç & Yarış Ayarları"
                  >
                    <Settings2 className="w-3.5 h-3.5" />
                    <span>Garaj</span>
                  </button>

                  {isHost ? (
                    room.selectedGame === 'racing' ? (
                      <button
                        onClick={handleStartRacing}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-heading font-black text-xs tracking-wide shadow-md shadow-red-500/25 active:scale-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Yarışı Başlat
                      </button>
                    ) : (
                      <button
                        onClick={() => selectGame('racing')}
                        className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 font-heading font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        Yarışı Seç
                      </button>
                    )
                  ) : (
                    <div className="flex-1 py-2.5 px-3 rounded-xl bg-slate-50 text-slate-500 font-medium text-xs text-center border border-slate-200">
                      👑 Oda sahibi başlatabilir
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Players & Chat */}
        <div className="space-y-4">
          {/* Players List */}
          <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-heading font-black text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-emerald-500" />
                Oyuncular ({room.players.length})
              </h3>
              {!isHost && (
                <button
                  onClick={handleToggleReady}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition cursor-pointer ${
                    player?.ready
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {player?.ready ? 'Hazırım ✓' : 'Hazır Ol'}
                </button>
              )}
            </div>

            <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
              {room.players.map((p) => (
                <div
                  key={p.id}
                  className={`p-2 rounded-xl flex items-center justify-between text-xs border ${
                    p.id === player?.id
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : 'bg-slate-50/70 border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xl select-none">{p.avatar}</span>
                    <span className="font-bold text-slate-800 truncate">{p.name}</span>
                    {p.id === player?.id && (
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-100 px-1 py-0.2 rounded-sm">
                        Sen
                      </span>
                    )}
                    {room.selectedGame === 'snake' && (
                      <span
                        className="text-xs px-1.5 py-0.2 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-semibold"
                        title={SNAKE_CLASSES[p.snakeClass || 'speed']?.title}
                      >
                        {SNAKE_CLASSES[p.snakeClass || 'speed']?.icon}
                      </span>
                    )}
                  </div>

                  <div>
                    {p.isHost ? (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-md">
                        <Crown className="w-3 h-3 text-amber-600" />
                        Host
                      </span>
                    ) : p.ready ? (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3" />
                        Hazır
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Bekliyor</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Chat */}
          <LiveChat title="Lobi Sohbeti" />
        </div>
      </div>

      {/* Wordle Config Modal */}
      <WordleConfigModal
        isOpen={configModalOpen}
        onClose={() => setConfigModalOpen(false)}
      />

      {/* Snake Class Selector Modal */}
      <SnakeClassModal
        isOpen={snakeClassModalOpen}
        onClose={() => setSnakeClassModalOpen(false)}
      />

      {/* Survival Config Modal */}
      <SurvivalConfigModal
        isOpen={survivalModalOpen}
        onClose={() => setSurvivalModalOpen(false)}
      />

      {/* Racing Config Modal */}
      <RacingConfigModal
        isOpen={racingModalOpen}
        onClose={() => setRacingModalOpen(false)}
      />
    </div>
  );
}
