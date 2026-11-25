import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useGame } from '../../context/GameContext';
import { toTurkishUpper } from '../../utils/turkish';
import { sound } from '../../utils/sounds';
import {
  Flame,
  RotateCcw,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  Users,
  Send,
  HelpCircle,
  MessageCircle,
  X
} from 'lucide-react';
import LiveChat from '../Common/LiveChat';

export default function TroubleSelectionScreen() {
  const {
    room,
    player,
    troubleRefreshPool,
    troubleConfirmSelection,
    showToast
  } = useGame();

  const troubleSession = room?.troubleSession;
  const myId = player?.id;

  // Assignment details
  const myAssignment = troubleSession?.assignments?.[myId];
  const targetName = myAssignment?.targetName || 'Rakibiniz';
  const targetAvatar = myAssignment?.targetAvatar || '🎯';
  const sourceName = myAssignment?.sourceName || 'Rakibiniz';
  const sourceAvatar = myAssignment?.sourceAvatar || '🔥';

  // Words pool for this player
  const pool = useMemo(() => {
    return troubleSession?.pools?.[myId] || [];
  }, [troubleSession?.pools, myId]);

  // Selected words state
  const [selectedWords, setSelectedWords] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Check if I already confirmed
  const isConfirmed = Boolean(troubleSession?.confirmedPlayers?.[myId]);

  // Total and confirmed count
  const totalPlayers = room?.players?.length || 2;
  const confirmedCount = Object.keys(troubleSession?.confirmedPlayers || {}).length;

  // Toggle word selection
  const handleToggleWord = (word) => {
    if (isConfirmed) return;

    sound.playKey();
    if (selectedWords.includes(word)) {
      setSelectedWords(prev => prev.filter(w => w !== word));
    } else {
      if (selectedWords.length >= 5) {
        sound.playError();
        showToast('En fazla 5 kelime seçebilirsiniz! Başka birini çıkarmalısınız.');
        return;
      }
      setSelectedWords(prev => [...prev, word]);
    }
  };

  // Refresh unselected words
  const handleRefresh = async () => {
    if (isConfirmed || isRefreshing) return;

    sound.playKey();
    setIsRefreshing(true);
    try {
      const res = await troubleRefreshPool(selectedWords);
      if (res && res.success) {
        showToast(`${20 - selectedWords.length} yeni kelime havuza eklendi! ✨`);
      }
    } catch (e) {
      showToast('Yenileme sırasında hata oluştu');
    } finally {
      setTimeout(() => setIsRefreshing(false), 400);
    }
  };

  // Confirm selection
  const handleConfirm = async () => {
    if (isConfirmed || isSubmitting) return;

    if (selectedWords.length !== 5) {
      sound.playError();
      showToast('Lütfen tam olarak 5 kelime seçin!');
      return;
    }

    setIsSubmitting(true);
    sound.playWordSolved();
    try {
      const res = await troubleConfirmSelection(selectedWords);
      if (res && res.success) {
        showToast('5 kelimeniz onaylandı! 😈');
      }
    } catch (e) {
      showToast('Onaylanırken hata oluştu');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-3 sm:p-6 bg-slate-900 text-slate-100 min-h-[calc(100vh-64px)] overflow-x-hidden relative">
      {/* Top Floating Chat Drawer Toggle */}
      <div className="absolute top-4 left-4 z-30">
        {isChatOpen ? (
          <div className="w-72 sm:w-80 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => setIsChatOpen(false)}
              className="absolute top-2.5 right-2.5 z-20 p-1 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 cursor-pointer transition shadow-xs"
              title="Kapat"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <LiveChat title="Oda Sohbeti" />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white shadow-md transition active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sohbet</span>
          </button>
        )}
      </div>

      <div className="w-full max-w-2xl flex flex-col items-center space-y-4 pt-10 sm:pt-4">
        {/* Main Mode Badge Header */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-rose-500/20 border border-purple-500/40 text-purple-300 text-xs font-black uppercase tracking-wider shadow-lg backdrop-blur-md">
          <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
          <span>Trouble Modu • Kelime Seçim Aşaması</span>
        </div>

        {/* Prompt Banner as requested by user */}
        <div className="w-full rounded-3xl p-4 sm:p-5 bg-gradient-to-br from-purple-950/80 via-slate-900/90 to-slate-950 border border-purple-500/40 shadow-2xl backdrop-blur-md text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-purple-500/10 blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-32 h-32 rounded-full bg-rose-500/10 blur-2xl pointer-events-none" />

          {/* Heading Notification */}
          <div className="space-y-2 relative z-10">
            <div className="flex items-center justify-center gap-2 text-base sm:text-lg font-heading font-black text-white">
              <span>Şu anda</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300">
                <span className="text-xl">{targetAvatar}</span>
                <span>{targetName}</span>
              </span>
              <span>için kelime seçiyorsunuz! 😈</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-slate-300">
              <span className="text-slate-400">Sizin kelimelerinizi</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-rose-500/20 border border-rose-400/30 text-rose-300 font-bold">
                <span>{sourceAvatar}</span>
                <span>{sourceName}</span>
              </span>
              <span className="text-slate-400">seçecek.</span>
            </div>
          </div>

          {/* Real-time Players Confirmation Progress */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 flex-wrap gap-2">
            <span className="font-bold flex items-center gap-1.5 text-slate-300">
              <Users className="w-3.5 h-3.5 text-purple-400" />
              Hazır Oyuncular:
              <strong className="text-emerald-400 font-mono">{confirmedCount} / {totalPlayers}</strong>
            </span>

            <div className="flex items-center gap-2">
              {room?.players?.map((p) => {
                const ready = Boolean(troubleSession?.confirmedPlayers?.[p.id]);
                return (
                  <span
                    key={p.id}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border transition ${
                      ready
                        ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                    title={ready ? `${p.name} onayladı` : `${p.name} kelime seçiyor...`}
                  >
                    <span>{p.avatar}</span>
                    <span className="hidden sm:inline truncate max-w-[80px]">{p.name}</span>
                    {ready ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Clock className="w-2.5 h-2.5 text-amber-400 animate-spin" />
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* 5-Slot Selection Ribbon */}
        <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-lg flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Seçtiğin 5 Kelime ({selectedWords.length}/5)
            </span>
            <span className="text-[11px] text-slate-400">
              {selectedWords.length === 5
                ? '✅ 5 kelime tamamlandı, onaylayabilirsiniz'
                : `${5 - selectedWords.length} kelime daha seçmelisin`}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {[0, 1, 2, 3, 4].map((idx) => {
              const word = selectedWords[idx];
              return (
                <div
                  key={idx}
                  onClick={() => word && handleToggleWord(word)}
                  className={`h-11 rounded-xl font-heading font-black text-xs sm:text-sm tracking-wider flex items-center justify-center transition-all relative ${
                    word
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20 border border-purple-400/50 cursor-pointer hover:scale-105 active:scale-95'
                      : 'border-2 border-dashed border-slate-700 bg-slate-800/40 text-slate-600'
                  }`}
                  title={word ? `${toTurkishUpper(word)} (Çıkarmak için tıkla)` : 'Boş Slot'}
                >
                  {word ? (
                    <>
                      <span>{toTurkishUpper(word)}</span>
                      {!isConfirmed && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] flex items-center justify-center shadow-xs">
                          ✕
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-slate-600 font-normal text-xs">+ {idx + 1}</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Controls: Refresh & Confirm */}
        <div className="w-full flex items-center justify-between gap-3 flex-wrap">
          <button
            type="button"
            disabled={isConfirmed || isRefreshing}
            onClick={handleRefresh}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all shadow-md ${
              isConfirmed
                ? 'opacity-40 cursor-not-allowed bg-slate-800 border-slate-700 text-slate-500'
                : 'bg-slate-800 hover:bg-slate-750 active:scale-95 border-slate-700 text-slate-200 cursor-pointer hover:border-slate-600'
            }`}
            title="Seçmediğiniz kelimeler değişir, seçtikleriniz korunur"
          >
            <RotateCcw className={`w-4 h-4 text-purple-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Seçilmeyenleri Yenile ({20 - selectedWords.length} Yeni Kelime)</span>
          </button>

          <button
            type="button"
            disabled={isConfirmed || selectedWords.length !== 5 || isSubmitting}
            onClick={handleConfirm}
            className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-2.5 px-6 rounded-xl font-heading font-black text-sm tracking-wide shadow-lg transition-all ${
              isConfirmed
                ? 'bg-emerald-600 text-white opacity-90 cursor-default'
                : selectedWords.length === 5
                ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 hover:from-purple-600 hover:to-rose-600 text-white shadow-purple-500/25 active:scale-95 cursor-pointer animate-pulse'
                : 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed opacity-60'
            }`}
          >
            {isConfirmed ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span>Kelimeleriniz Onaylandı! ({confirmedCount}/{totalPlayers} Hazır)</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 fill-current" />
                <span>5 Kelimeyi Onayla & Gönder ({selectedWords.length}/5)</span>
              </>
            )}
          </button>
        </div>

        {/* Word Pool Grid (20 Chips) */}
        <div className="w-full bg-slate-900/90 border border-slate-800/90 rounded-3xl p-4 sm:p-5 shadow-xl">
          <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
            <span className="font-bold text-slate-300 flex items-center gap-1.5 uppercase tracking-wider">
              📚 20 Kelimelik Havuzun (Diğer oyuncularda bu kelimeler yoktur)
            </span>
            <span className="text-[11px] text-purple-400">
              Seçmek veya kaldırmak için tıkla
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
            {pool.map((word) => {
              const isSelected = selectedWords.includes(word);
              return (
                <button
                  key={word}
                  type="button"
                  disabled={isConfirmed}
                  onClick={() => handleToggleWord(word)}
                  className={`py-3 px-2 rounded-2xl font-heading font-black text-xs sm:text-sm tracking-widest border transition-all flex items-center justify-between group ${
                    isConfirmed
                      ? isSelected
                        ? 'bg-emerald-600/30 border-emerald-500/60 text-emerald-200'
                        : 'bg-slate-850/60 border-slate-800 text-slate-600'
                      : isSelected
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 border-purple-400 text-white shadow-lg shadow-purple-500/25 scale-[1.03] cursor-pointer'
                      : 'bg-slate-800/80 hover:bg-slate-750 border-slate-700/80 text-slate-200 hover:border-purple-500/50 cursor-pointer active:scale-95'
                  }`}
                >
                  <span className="pl-1 truncate">{toTurkishUpper(word)}</span>
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ml-1 transition ${
                      isSelected
                        ? 'bg-white text-purple-700 font-bold'
                        : 'bg-slate-700 text-transparent group-hover:text-slate-400'
                    }`}
                  >
                    ✓
                  </span>
                </button>
              );
            })}
          </div>

          {isConfirmed && (
            <div className="mt-4 p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center animate-fade-in">
              <span className="text-emerald-300 font-heading font-black text-xs sm:text-sm flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Seçiminiz başarıyla kilitlendi! Diğer rakiplerin kelimelerini seçmesi bekleniyor...
              </span>
              <p className="text-[11px] text-slate-400 mt-1">
                Tüm oyuncular onayladığında oyun otomatik olarak başlayacaktır.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
