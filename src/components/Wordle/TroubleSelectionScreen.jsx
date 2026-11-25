import React, { useState, useMemo } from 'react';
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
  MessageCircle,
  X,
  Target,
  ShieldCheck
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

  // Words pool for this player (20 words)
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
    <div className="flex-1 flex flex-col items-center justify-start p-3 sm:p-6 bg-slate-50 text-slate-800 min-h-[calc(100vh-64px)] overflow-x-hidden relative">
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 shadow-sm transition active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sohbet</span>
          </button>
        )}
      </div>

      <div className="w-full max-w-2xl flex flex-col items-center space-y-4 pt-10 sm:pt-4">
        {/* Main Mode Badge Header */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-black uppercase tracking-wider shadow-xs">
          <Flame className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>Trouble Modu • Kelime Seçim Aşaması</span>
        </div>

        {/* Prompt Banner - Wordle Clean White Theme */}
        <div className="w-full rounded-3xl p-5 sm:p-6 bg-white border border-slate-200/90 shadow-xl shadow-slate-200/60 text-center relative overflow-hidden">
          {/* Heading Notification */}
          <div className="space-y-2 relative z-10">
            <div className="flex items-center justify-center gap-2 text-base sm:text-lg font-heading font-black text-slate-800 flex-wrap">
              <span>Şu anda</span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-2xs">
                <span className="text-xl">{targetAvatar}</span>
                <span>{targetName}</span>
              </span>
              <span>için kelime seçiyorsunuz!</span>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold text-slate-500 flex-wrap">
              <span>Sizin kelimelerinizi</span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 font-bold">
                <span>{sourceAvatar}</span>
                <span>{sourceName}</span>
              </span>
              <span>seçecek.</span>
            </div>
          </div>

          {/* Real-time Players Confirmation Progress */}
          <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 flex-wrap gap-2">
            <span className="font-bold flex items-center gap-1.5 text-slate-700">
              <Users className="w-4 h-4 text-emerald-600" />
              Hazır Oyuncular:
              <strong className="text-emerald-600 font-mono text-sm ml-1">{confirmedCount} / {totalPlayers}</strong>
            </span>

            <div className="flex items-center gap-2">
              {room?.players?.map((p) => {
                const ready = Boolean(troubleSession?.confirmedPlayers?.[p.id]);
                return (
                  <span
                    key={p.id}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border transition ${
                      ready
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : 'bg-slate-100 border-slate-200 text-slate-500'
                    }`}
                    title={ready ? `${p.name} onayladı` : `${p.name} kelime seçiyor...`}
                  >
                    <span>{p.avatar}</span>
                    <span className="hidden sm:inline truncate max-w-[90px]">{p.name}</span>
                    {ready ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Clock className="w-3 h-3 text-amber-500 animate-spin" />
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* 5-Slot Selection Ribbon (Wordle Styling) */}
        <div className="w-full bg-white border border-slate-200/90 rounded-2xl p-4 shadow-md shadow-slate-100 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Seçtiğin 5 Kelime ({selectedWords.length}/5)
            </span>
            <span className="text-[11px] font-medium text-slate-500">
              {selectedWords.length === 5
                ? '✅ 5 kelime tamamlandı, onaylayabilirsiniz'
                : `${5 - selectedWords.length} kelime daha seçmelisin`}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {[0, 1, 2, 3, 4].map((idx) => {
              const word = selectedWords[idx];
              return (
                <div
                  key={idx}
                  onClick={() => word && handleToggleWord(word)}
                  className={`h-12 rounded-xl font-heading font-black text-xs sm:text-base tracking-wider flex items-center justify-center transition-all relative ${
                    word
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 border border-emerald-500 cursor-pointer hover:bg-emerald-700 hover:scale-105 active:scale-95'
                      : 'border-2 border-dashed border-slate-200 bg-slate-50/60 text-slate-400'
                  }`}
                  title={word ? `${toTurkishUpper(word)} (Çıkarmak için tıkla)` : 'Boş Slot'}
                >
                  {word ? (
                    <>
                      <span>{toTurkishUpper(word)}</span>
                      {!isConfirmed && (
                        <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                          ✕
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-slate-400 font-medium text-xs">+ {idx + 1}</span>
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
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold transition-all shadow-xs ${
              isConfirmed
                ? 'opacity-40 cursor-not-allowed bg-slate-100 border-slate-200 text-slate-400'
                : 'bg-white hover:bg-slate-50 active:scale-95 border-slate-300 text-slate-700 cursor-pointer hover:border-slate-400'
            }`}
            title="Seçmediğiniz kelimeler değişir, seçtikleriniz korunur"
          >
            <RotateCcw className={`w-4 h-4 text-emerald-600 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Seçilmeyenleri Yenile ({20 - selectedWords.length} Yeni Kelime)</span>
          </button>

          <button
            type="button"
            disabled={isConfirmed || selectedWords.length !== 5 || isSubmitting}
            onClick={handleConfirm}
            className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-heading font-black text-sm tracking-wide shadow-md transition-all ${
              isConfirmed
                ? 'bg-slate-200 text-slate-600 cursor-default'
                : selectedWords.length === 5
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30 active:scale-95 cursor-pointer animate-pulse'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            {isConfirmed ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-slate-800">Kelimeleriniz Onaylandı! ({confirmedCount}/{totalPlayers} Hazır)</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 fill-current" />
                <span>5 Kelimeyi Onayla & Gönder ({selectedWords.length}/5)</span>
              </>
            )}
          </button>
        </div>

        {/* Word Pool Grid (20 Chips in Wordle Clean Styling) */}
        <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between mb-4 text-xs text-slate-500">
            <span className="font-bold text-slate-700 flex items-center gap-1.5 uppercase tracking-wider">
              📚 20 Kelimelik Havuzun (Diğer oyuncularda bu kelimeler yoktur)
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold">
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
                  className={`py-3 px-3 rounded-2xl font-heading font-black text-xs sm:text-sm tracking-widest border transition-all flex items-center justify-between group ${
                    isConfirmed
                      ? isSelected
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                        : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60'
                      : isSelected
                      ? 'bg-emerald-600 border-emerald-700 text-white shadow-md shadow-emerald-600/25 scale-[1.02] cursor-pointer'
                      : 'bg-slate-50 hover:bg-slate-100/90 border-slate-200 text-slate-700 hover:border-emerald-400 cursor-pointer active:scale-95'
                  }`}
                >
                  <span className="pl-1 truncate">{toTurkishUpper(word)}</span>
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] shrink-0 ml-1 transition ${
                      isSelected
                        ? 'bg-white text-emerald-700 font-bold'
                        : 'bg-slate-200 text-transparent group-hover:text-slate-400'
                    }`}
                  >
                    ✓
                  </span>
                </button>
              );
            })}
          </div>

          {isConfirmed && (
            <div className="mt-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center animate-fade-in">
              <span className="text-emerald-800 font-heading font-black text-xs sm:text-sm flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Seçiminiz başarıyla kilitlendi! Diğer rakiplerin kelimelerini seçmesi bekleniyor...
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                Tüm oyuncular onayladığında oyun otomatik olarak başlayacaktır.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
