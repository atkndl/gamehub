import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { AVATARS } from '../../utils/turkish';
import { socket } from '../../socket';
import {
  Gamepad2,
  Play,
  LogIn,
  Users,
  Sparkles,
  Link as LinkIcon,
  Flame,
  ArrowRight,
  Radio,
  Clock,
  ShieldAlert
} from 'lucide-react';

const GAME_INFO = {
  liars_bar: {
    title: "Liar's Bar (Blöf)",
    badge: 'YENİ',
    badgeColor: 'bg-rose-100 text-rose-700 border-rose-200',
    icon: '🍸',
    desc: 'K-Q-A blöfleri, itirazlar ve 6 kablolu C4 patlama gerilimi.',
    gradient: 'from-purple-50 to-white',
    border: 'border-purple-200 hover:border-purple-400'
  },
  survival: {
    title: 'Survival 2D (Battle Royale)',
    badge: 'POPÜLER',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: '🎖️',
    desc: 'Dürbünler, seken mermiler, daralan kırmızı alan ve hayatta kalma mücadelesi.',
    gradient: 'from-amber-50 to-white',
    border: 'border-amber-200 hover:border-amber-400'
  },
  wordle: {
    title: 'Wordle & Trouble',
    badge: 'KLASİK',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: '🟩',
    desc: '5 harfli Türkçe kelimeler ve rakiplerin birbirine kelime seçtiği Trouble modu.',
    gradient: 'from-emerald-50 to-white',
    border: 'border-emerald-200 hover:border-emerald-400'
  },
  snake: {
    title: 'Yılan Arenası',
    badge: 'AKSİYON',
    badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-200',
    icon: '🐍',
    desc: '4 farklı yılan sınıfı, buz dondurma, ateş topları ve can sistemi.',
    gradient: 'from-cyan-50 to-white',
    border: 'border-cyan-200 hover:border-cyan-400'
  }
};

function getInitialInviteCode() {
  try {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('oda') || params.get('room') || window.__initialRoomCode || '';
    return code.trim().toUpperCase();
  } catch {
    return '';
  }
}

export default function Home() {
  const { createRoom, joinRoom, error, setError } = useGame();
  const inviteCode = getInitialInviteCode();

  const [activeTab, setActiveTab] = useState(() => inviteCode ? 'join' : 'create');
  const [activeRooms, setActiveRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  const [name, setName] = useState(() => {
    try {
      return localStorage.getItem('gamehub_player_name') || '';
    } catch {
      return '';
    }
  });

  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    try {
      return localStorage.getItem('gamehub_player_avatar') || '🦁';
    } catch {
      return '🦁';
    }
  });

  const [roomCode, setRoomCode] = useState(() => inviteCode);
  const [loading, setLoading] = useState(false);
  const autoJoinAttempted = useRef(false);

  // Auto-join if user clicked an invite link and already has a saved name
  useEffect(() => {
    const code = getInitialInviteCode();
    const savedName = localStorage.getItem('gamehub_player_name');
    const savedAvatar = localStorage.getItem('gamehub_player_avatar') || '🦁';

    if (code && savedName && !autoJoinAttempted.current) {
      autoJoinAttempted.current = true;
      setLoading(true);
      setError(null);

      joinRoom(code, savedName.trim(), savedAvatar)
        .then(() => {
          try {
            window.history.replaceState({}, document.title, window.location.pathname);
          } catch (e) {}
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [joinRoom, setError]);

  // Fetch active public rooms & listen for realtime updates
  useEffect(() => {
    let mounted = true;

    const fetchRooms = () => {
      fetch('/api/rooms')
        .then(res => res.json())
        .then(data => {
          if (mounted && data?.success) {
            setActiveRooms(data.rooms || []);
          }
        })
        .catch(() => {})
        .finally(() => {
          if (mounted) setLoadingRooms(false);
        });
    };

    fetchRooms();
    const interval = setInterval(fetchRooms, 8000);

    const handleRoomsUpdated = (rooms) => {
      if (mounted && Array.isArray(rooms)) {
        setActiveRooms(rooms);
        setLoadingRooms(false);
      }
    };

    socket.on('rooms_list_updated', handleRoomsUpdated);

    return () => {
      mounted = false;
      clearInterval(interval);
      socket.off('rooms_list_updated', handleRoomsUpdated);
    };
  }, []);

  const saveProfile = (playerName, playerAvatar) => {
    try {
      localStorage.setItem('gamehub_player_name', playerName);
      localStorage.setItem('gamehub_player_avatar', playerAvatar);
    } catch (e) {}
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Lütfen bir takma ad girin.');
      return;
    }
    saveProfile(trimmed, selectedAvatar);
    setLoading(true);
    setError(null);
    try {
      await createRoom(trimmed, selectedAvatar);
    } catch (err) {
      // Handled by context
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e, overrideCode) => {
    if (e) e.preventDefault();
    const trimmed = name.trim();
    const targetCode = (overrideCode || roomCode || inviteCode).trim().toUpperCase();

    if (!trimmed) {
      setError('Lütfen önce bir takma ad girin.');
      return;
    }
    if (!targetCode) {
      setError('Lütfen 5 haneli oda kodunu girin.');
      return;
    }

    saveProfile(trimmed, selectedAvatar);
    setLoading(true);
    setError(null);
    try {
      await joinRoom(targetCode, trimmed, selectedAvatar);
      try {
        window.history.replaceState({}, document.title, window.location.pathname);
      } catch (e) {}
    } catch (err) {
      // Handled by context
    } finally {
      setLoading(false);
    }
  };

  const handleQuickJoinRoom = (code) => {
    setRoomCode(code);
    setActiveTab('join');
    if (name.trim()) {
      handleJoin(null, code);
    } else {
      setError('Odaya hızlıca katılmak için lütfen yukarıdan oyuncu adınızı yazın.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center px-4 py-8 sm:py-12 relative overflow-hidden">
      {/* Soft ambient background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-100/40 via-teal-50/20 to-transparent blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-5xl z-10 flex flex-col items-center">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 border border-emerald-200/60 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-4 shadow-xs">
            <Gamepad2 className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>Çok Oyunculu Web Oyun Platformu</span>
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-slate-900 tracking-tight leading-tight">
            Game<span className="text-emerald-500">Hub</span>
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-lg mx-auto">
            Arkadaşlarınla anında oda kur veya aktif açık odalara tek tıkla katıl!
          </p>
        </div>

        {/* Action Panel & Active Rooms Grid */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          {/* Left Column: Room Creation & Join Form (5 cols on lg) */}
          <div className="lg:col-span-5 w-full bg-white rounded-3xl shadow-xl shadow-slate-200/70 border border-slate-200/80 p-5 sm:p-6 relative overflow-hidden">
            {/* Invite Banner */}
            {inviteCode && (
              <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center gap-3 text-emerald-800">
                <LinkIcon className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-xs">
                  <span className="font-black font-mono bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200 mr-1">
                    {inviteCode}
                  </span>
                  odasına davet edildiniz!
                </div>
              </div>
            )}

            {/* Tab switchers */}
            <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl border border-slate-200/70 mb-5">
              <button
                type="button"
                onClick={() => { setActiveTab('create'); setError(null); }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'create'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Play className="w-4 h-4" />
                Oda Kur
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('join'); setError(null); }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'join'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-4 h-4" />
                Koduyla Katıl
              </button>
            </div>

            {/* Error banner */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-shake">
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={activeTab === 'create' ? handleCreate : handleJoin} className="space-y-4">
              {/* Nickname input */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Oyuncu Adın
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Bir takma ad yaz..."
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:border-emerald-500 focus:outline-hidden text-sm sm:text-base font-semibold text-slate-900 placeholder-slate-400 transition"
                  required
                />
              </div>

              {/* Avatar Selector */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Avatarın
                </label>
                <div className="grid grid-cols-8 gap-1.5 p-2 bg-slate-50 rounded-2xl border border-slate-200/80">
                  {AVATARS.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setSelectedAvatar(av)}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-base transition-all active:scale-90 cursor-pointer ${
                        selectedAvatar === av
                          ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 scale-110 ring-2 ring-emerald-500/20'
                          : 'hover:bg-slate-200/60'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Room Code input (if join tab) */}
              {activeTab === 'join' && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    5 Haneli Oda Kodu
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    placeholder="Örn: KALE7"
                    className="w-full px-4 py-3 rounded-2xl border-2 border-slate-200 bg-slate-50/60 focus:bg-white focus:border-emerald-500 focus:outline-hidden font-mono text-center text-lg font-black tracking-widest uppercase text-emerald-600 transition"
                    required
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-heading font-black text-base tracking-wide shadow-lg shadow-emerald-500/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2 text-sm">
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>İşleniyor...</span>
                  </span>
                ) : activeTab === 'create' ? (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    Oda Oluştur
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    Odaya Gir
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Right Column: Live Active Rooms & Quick Join (7 cols on lg) */}
          <div className="lg:col-span-7 w-full flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600 animate-pulse" />
                <h2 className="font-heading font-black text-lg text-slate-900">
                  Canlı Açık Odalar
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono font-bold border border-slate-200">
                  {activeRooms.length}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 hidden sm:block">
                Boş kalan veya pasif odalar otomatik silinir
              </span>
            </div>

            {loadingRooms ? (
              <div className="p-8 rounded-3xl bg-white border border-slate-200/80 text-center text-slate-500 text-sm animate-pulse shadow-xs">
                Aktif odalar aranıyor...
              </div>
            ) : activeRooms.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl mb-3">
                  🛋️
                </div>
                <div className="text-sm font-bold text-slate-800">Şu anda açık oda bulunmuyor</div>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Hemen soldan bir oda kurup arkadaşlarına davet kodunu göndererek ilk oyunu başlatabilirsin!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {activeRooms.map((r) => {
                  const game = GAME_INFO[r.selectedGame] || GAME_INFO.wordle;
                  const isJoinable = r.gameState === 'lobby';

                  return (
                    <div
                      key={r.code}
                      className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-md transition shadow-xs flex flex-col justify-between group"
                    >
                      <div>
                        {/* Top info row */}
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xl">{game.icon}</span>
                          <span
                            className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-full border ${
                              isJoinable
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                : 'bg-amber-50 border-amber-200 text-amber-700'
                            }`}
                          >
                            {isJoinable ? 'LOBİ (KATILINABİLİR)' : 'OYUNDA'}
                          </span>
                        </div>

                        {/* Room code & game title */}
                        <div className="font-heading font-black text-base text-slate-900 flex items-center gap-2">
                          <span>{r.hostAvatar} {r.hostName}'in Odası</span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5 font-medium">
                          Oyun: <span className="text-slate-800 font-bold">{game.title}</span>
                        </div>
                      </div>

                      {/* Bottom action row */}
                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Users className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-mono font-bold text-slate-700">
                            {r.playerCount} / {r.maxPlayers}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleQuickJoinRoom(r.code)}
                          disabled={!isJoinable}
                          className={`px-3 py-1.5 rounded-xl font-heading font-black text-xs transition flex items-center gap-1 cursor-pointer active:scale-95 ${
                            isJoinable
                              ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          <span>{isJoinable ? 'Hemen Katıl' : 'Dolu/Oyunda'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Game Showcase Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-2">
              {Object.entries(GAME_INFO).map(([key, info]) => (
                <div
                  key={key}
                  className={`p-3 rounded-2xl bg-gradient-to-b ${info.gradient} border ${info.border} shadow-xs transition flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xl">{info.icon}</span>
                      <span className={`text-[9px] font-mono font-black px-1.5 py-0.2 rounded-full border ${info.badgeColor}`}>
                        {info.badge}
                      </span>
                    </div>
                    <div className="font-heading font-black text-xs text-slate-900 leading-tight">
                      {info.title}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {info.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
