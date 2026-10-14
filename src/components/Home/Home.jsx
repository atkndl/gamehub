import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { AVATARS } from '../../utils/turkish';
import { Sparkles, Play, LogIn, Users, Flame, Award, Gamepad2 } from 'lucide-react';

export default function Home() {
  const { createRoom, joinRoom, error, setError } = useGame();
  const [activeTab, setActiveTab] = useState(() => window.__initialRoomCode ? 'join' : 'create'); // 'create' | 'join'

  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('🦁');
  const [roomCode, setRoomCode] = useState(() => window.__initialRoomCode || '');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Lütfen bir takma ad girin.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await createRoom(name.trim(), selectedAvatar);
    } catch (err) {
      // Handled by context
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Lütfen bir takma ad girin.');
      return;
    }
    if (!roomCode.trim()) {
      setError('Lütfen 5 haneli oda kodunu girin.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await joinRoom(roomCode.trim(), name.trim(), selectedAvatar);
    } catch (err) {
      // Handled by context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
      {/* Hero Header */}
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4 border border-emerald-200/60 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
          Çok Oyunculu Kelime & Parti Deneyimi
        </div>
        <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-tight">
          Birlikte Oyna, <br />
          <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
            Kelimeyi İlk Sen Bul!
          </span>
        </h1>
        <p className="mt-3 text-base sm:text-lg text-slate-600">
          Odanı kur, arkadaşlarına kodunu ilet ve 5 harfli Türkçe Wordle heyecanına anında ortak ol!
        </p>
      </div>

      {/* Main Action Box */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-200/80 overflow-hidden transition-all">
        {/* Tab switchers */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200/70 m-3 rounded-2xl">
          <button
            type="button"
            onClick={() => { setActiveTab('create'); setError(null); }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'create'
                ? 'bg-white text-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Play className="w-4 h-4" />
            Oda Kur
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('join'); setError(null); }}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'join'
                ? 'bg-white text-emerald-600 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Odaya Katıl
          </button>
        </div>

        {/* Error alert */}
        {error && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-shake">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={activeTab === 'create' ? handleCreate : handleJoin} className="p-6 pt-4 space-y-5">
          {/* Room Code input (if join) */}
          {activeTab === 'join' && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                5 Haneli Oda Kodu
              </label>
              <input
                type="text"
                maxLength={6}
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                placeholder="Örn: KALE7"
                className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-hidden font-mono text-center text-xl font-bold tracking-widest uppercase transition bg-slate-50/50 focus:bg-white text-slate-900"
                required
              />
            </div>
          )}

          {/* Nickname input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Oyuncu Adın
            </label>
            <input
              type="text"
              maxLength={15}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Adını yaz..."
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 focus:border-emerald-500 focus:outline-hidden text-base font-semibold transition bg-slate-50/50 focus:bg-white text-slate-900"
              required
            />
          </div>

          {/* Avatar selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Avatar Seçimi
            </label>
            <div className="grid grid-cols-8 gap-1.5 p-2 bg-slate-50 rounded-2xl border border-slate-200/80">
              {AVATARS.map((av) => (
                <button
                  key={av}
                  type="button"
                  onClick={() => setSelectedAvatar(av)}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-transform active:scale-90 ${
                    selectedAvatar === av
                      ? 'bg-emerald-500 shadow-md shadow-emerald-500/30 scale-110 ring-2 ring-emerald-500/20'
                      : 'hover:bg-slate-200/60'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-heading font-black text-lg tracking-wide shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {loading ? (
              <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : activeTab === 'create' ? (
              <>
                <Play className="w-5 h-5 fill-current" />
                Oda Kur ve Başla
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Odaya Katıl
              </>
            )}
          </button>
        </form>
      </div>

      {/* Feature Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 w-full max-w-3xl">
        <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 text-lg">
            ⚡
          </div>
          <div>
            <h2 className="font-heading font-bold text-sm text-slate-800">Hız Modu</h2>
            <p className="text-xs text-slate-500 mt-0.5">Bilen beklemeden sonraki kelimeye geçer. En hızlı bitiren kazanır!</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-lg">
            🎯
          </div>
          <div>
            <h2 className="font-heading font-bold text-sm text-slate-800">Puan Modu</h2>
            <p className="text-xs text-slate-500 mt-0.5">Herkes her kelimede aynı anda yarışır. Süre veya deneme sayısına göre puan topla!</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-xs flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0 text-lg">
            📚
          </div>
          <div>
            <h2 className="font-heading font-bold text-sm text-slate-800">13.000+ Kelime</h2>
            <p className="text-xs text-slate-500 mt-0.5">Zengin Türkçe kelime dağarcığı ve canlı rakip tahmin ızgarası.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
