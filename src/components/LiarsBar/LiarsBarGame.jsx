import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import LiarsBarCard, { CardBackIllustration } from './LiarsBarCard';
import BombDefusalModal from './BombDefusalModal';
import { liarsAudio } from '../../utils/liarsBarAudio';
import LiveChat from '../Common/LiveChat';
import confetti from 'canvas-confetti';
import {
  Flame,
  ShieldAlert,
  Play,
  RotateCcw,
  Home,
  MessageCircle,
  Skull,
  Crown,
  Eye,
  CheckCircle2,
  Clock,
  Zap,
  Info
} from 'lucide-react';

export default function LiarsBarGame() {
  const {
    room,
    player,
    liarsBarState,
    playLiarsCards,
    challengeLiars,
    cutLiarsWire,
    rematchLiars,
    returnToLobby,
    chatMessages,
    showToast
  } = useGame();

  const [selectedCardIds, setSelectedCardIds] = useState([]);
  const [wireCutResult, setWireCutResult] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [lastMoveAnnouncement, setLastMoveAnnouncement] = useState('');

  const isHost = player?.isHost;
  const state = liarsBarState;
  const isMyTurn = Boolean(state?.isMyTurn && state?.status === 'waiting_play');

  // Trigger sounds on turn or state changes
  useEffect(() => {
    if (state?.status === 'waiting_play') {
      liarsAudio.playCardSlide();
    }
  }, [state?.roundNumber, state?.status]);

  // Play sound when it becomes user's turn
  useEffect(() => {
    if (isMyTurn) {
      liarsAudio.playCardSelect();
    }
  }, [isMyTurn]);

  // Handle reveal sound effect
  useEffect(() => {
    if (state?.status === 'revealing' && state?.lastReveal) {
      liarsAudio.playLiarCall();
      setTimeout(() => {
        liarsAudio.playCardFlip();
      }, 500);
    }
  }, [state?.status, state?.lastReveal]);

  // Confetti on game over win
  useEffect(() => {
    if (state?.status === 'game_over' && state?.winner) {
      liarsAudio.playWinFanfare();
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch (e) {}
    }
  }, [state?.status, state?.winner]);

  // Clear selections when round changes or turn advances
  useEffect(() => {
    setSelectedCardIds([]);
  }, [state?.currentTurnPlayerId, state?.roundNumber]);

  // Find self player object from server state
  const selfPlayer = state?.players?.find(p => p.id === player?.id);
  const myHand = selfPlayer?.hand || [];
  const opponents = state?.players?.filter(p => p.id !== player?.id) || [];

  // Table target labels
  const targetLabels = {
    K: { name: 'PAPAZ', icon: '👑', color: 'text-amber-400', border: 'border-amber-500' },
    Q: { name: 'KIZ', icon: '🌹', color: 'text-pink-400', border: 'border-pink-500' },
    A: { name: 'AS', icon: '♠️', color: 'text-sky-400', border: 'border-sky-500' }
  };
  const currentTargetInfo = targetLabels[state?.tableTarget || 'K'] || targetLabels.K;

  const toggleCardSelection = (cardId) => {
    if (!isMyTurn) return;

    liarsAudio.playCardSelect();
    if (selectedCardIds.includes(cardId)) {
      setSelectedCardIds(prev => prev.filter(id => id !== cardId));
    } else {
      if (selectedCardIds.length >= 3) {
        showToast('En fazla 3 kart seçebilirsiniz!');
        return;
      }
      setSelectedCardIds(prev => [...prev, cardId]);
    }
  };

  const handlePlayCards = async () => {
    if (!isMyTurn) return;
    if (selectedCardIds.length < 1 || selectedCardIds.length > 3) {
      showToast('Lütfen 1 ila 3 kart seçin.');
      return;
    }

    try {
      liarsAudio.playCardSlide();
      await playLiarsCards(selectedCardIds);
      setSelectedCardIds([]);
    } catch (e) {
      showToast(e.message || 'Kart oynanamadı.');
    }
  };

  const handleChallenge = async () => {
    if (!isMyTurn) return;
    try {
      liarsAudio.playLiarCall();
      await challengeLiars();
    } catch (e) {
      showToast(e.message || 'İtiraz edilemedi.');
    }
  };

  const handleCutWire = async (wireId) => {
    try {
      const res = await cutLiarsWire(wireId);
      if (res?.result) {
        setWireCutResult(res.result);
      }
    } catch (e) {
      showToast(e.message || 'Kablo kesilemedi.');
    }
  };

  // Reset wire cut state when exiting bomb phase
  useEffect(() => {
    if (state?.status !== 'bomb_defusal') {
      setWireCutResult(null);
    }
  }, [state?.status]);

  const penalizedPlayerObj = state?.players?.find(p => p.id === state?.penalizedPlayerId);
  const isMyPenalty = Boolean(state?.penalizedPlayerId === player?.id);

  return (
    <div className="min-h-screen bg-radial from-stone-900 via-neutral-950 to-black text-white flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* Neo-noir background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-red-950/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-950/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Bar: Room Code & Game Status */}
      <header className="p-3 sm:p-4 flex items-center justify-between border-b border-stone-800/80 bg-stone-950/70 backdrop-blur-md z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 via-amber-600 to-amber-400 flex items-center justify-center font-black text-white text-base shadow-lg shadow-red-900/40">
            🍸
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-sm sm:text-base text-amber-400 tracking-wider">
                LIAR'S BAR
              </span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-950/80 text-red-400 border border-red-800">
                BLÖF MASASI
              </span>
            </div>
            <span className="text-[11px] text-stone-400 font-mono">
              Oda: <strong className="text-white">{room?.code}</strong> • Tur: #{state?.roundNumber || 1}
            </span>
          </div>
        </div>

        {/* Center Target Indicator Badge in Header for Quick glance */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-stone-900/90 border border-stone-700 shadow-md">
          <span className="text-xs text-stone-400 font-bold">Masa Teması:</span>
          <span className={`text-xs font-heading font-black flex items-center gap-1 ${currentTargetInfo.color}`}>
            <span>{currentTargetInfo.icon}</span>
            <span>{currentTargetInfo.name} ({state?.tableTarget})</span>
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 text-xs font-bold transition flex items-center gap-1.5 border border-stone-700 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Sohbet</span>
            {chatMessages?.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </button>

          <button
            onClick={returnToLobby}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-red-950/60 hover:bg-red-900/70 text-red-300 text-xs font-bold transition flex items-center gap-1.5 border border-red-800/80 cursor-pointer"
            title="Lobiye Dön"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Lobi</span>
          </button>
        </div>
      </header>

      {/* Main Poker Table Arena Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-6 relative max-w-6xl mx-auto w-full">
        {/* Opponents Row (Top and Sides) */}
        <div className="w-full flex items-center justify-around gap-2 mb-4 z-20 flex-wrap">
          {opponents.map(opp => {
            const isTurn = state?.currentTurnPlayerId === opp.id;
            const isAlive = opp.isAlive;
            const remainingWires = opp.wires?.filter(w => !w.cut).length || 6;

            return (
              <div
                key={opp.id}
                className={`p-3 rounded-2xl border transition-all duration-300 flex items-center gap-3 backdrop-blur-md ${
                  !isAlive
                    ? 'bg-black/60 border-stone-800 opacity-40'
                    : isTurn
                    ? 'bg-amber-950/40 border-amber-500 shadow-xl shadow-amber-500/20 scale-105'
                    : 'bg-stone-900/80 border-stone-700/80'
                }`}
              >
                {/* Opponent Avatar with Alive / Skull Status */}
                <div className="relative">
                  <span className="text-3xl sm:text-4xl select-none block">
                    {isAlive ? opp.avatar : '💀'}
                  </span>
                  {isTurn && isAlive && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 animate-ping" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading font-black text-xs sm:text-sm text-stone-100 truncate max-w-[90px]">
                      {opp.name}
                    </span>
                    {!isAlive && (
                      <span className="text-[9px] font-black uppercase px-1 rounded-sm bg-red-950 text-red-400 border border-red-800">
                        ELENDİ
                      </span>
                    )}
                  </div>

                  {/* Opponent Card Count (Face-down mini cards) */}
                  {isAlive && (
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] text-stone-400 font-bold">
                        {opp.cardCount} Kart
                      </span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: Math.min(opp.cardCount, 5) }).map((_, i) => (
                          <div key={i} className="w-2.5 h-3.5 rounded-xs bg-amber-700/80 border border-amber-500/40 shadow-2xs" />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bomb wire indicators */}
                  {isAlive && (
                    <div className="flex items-center gap-1 mt-1 text-[10px] text-stone-400">
                      <span>💣</span>
                      <div className="flex gap-1">
                        {opp.wires?.map(w => (
                          <div
                            key={w.id}
                            className={`w-1.5 h-1.5 rounded-full ${
                              w.cut ? 'bg-stone-700' : 'bg-red-500 shadow-xs'
                            }`}
                            title={w.cut ? 'Kesildi' : 'Aktif'}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Center Table (Dark Oval Velvet with Brass Rim) */}
        <div className="w-full max-w-3xl aspect-16/9 bg-gradient-to-b from-stone-900 via-neutral-900 to-black rounded-[60px] sm:rounded-[100px] border-8 border-stone-800/90 shadow-2xl shadow-black relative flex flex-col items-center justify-center p-4 overflow-hidden">
          {/* Green/Noir Felt Inner Texture */}
          <div className="absolute inset-4 rounded-[45px] sm:rounded-[80px] bg-[radial-gradient(ellipse_at_center,_#1b2d1c_0%,_#0d170e_55%,_#050805_100%)] border-2 border-emerald-950 shadow-inner pointer-events-none" />

          {/* Center Table Target Emblem */}
          <div className="relative z-10 flex flex-col items-center mb-3 text-center">
            <div className={`px-4 py-1.5 rounded-full bg-black/70 border-2 ${currentTargetInfo.border} shadow-lg shadow-black/80 flex items-center gap-2 animate-pulse`}>
              <span className="text-lg">{currentTargetInfo.icon}</span>
              <span className={`font-heading font-black text-xs sm:text-sm tracking-widest ${currentTargetInfo.color}`}>
                {currentTargetInfo.name} MASASI ({state?.tableTarget})
              </span>
              <span className="text-lg">{currentTargetInfo.icon}</span>
            </div>
            <span className="text-[10px] text-emerald-400/80 font-bold mt-1">
              Jokerler her kartın yerine geçer
            </span>
          </div>

          {/* Cards on the Table Pile or Reveal */}
          <div className="relative z-10 flex items-center justify-center gap-2 min-h-[140px] sm:min-h-[170px] w-full px-4">
            {state?.status === 'revealing' && state?.lastReveal ? (
              // REVEAL ANIMATION PHASE (Flipped Cards)
              <div className="flex flex-col items-center animate-fade-in w-full">
                <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                  {state.lastReveal.cards.map((c, idx) => {
                    const isValid = c.type === state.tableTarget || c.type === 'JOKER';
                    return (
                      <div key={idx} className="animate-pop" style={{ animationDelay: `${idx * 150}ms` }}>
                        <LiarsBarCard
                          card={c}
                          isFaceDown={false}
                          revealResult={{ isValid }}
                          size="md"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Dramatic Reveal Callout */}
                <div className={`mt-3 px-4 py-2 rounded-2xl text-xs sm:text-sm font-heading font-black tracking-wide text-center border shadow-xl animate-bounce ${
                  state.lastReveal.isBluff
                    ? 'bg-red-950/90 text-red-200 border-red-500 shadow-red-950/60'
                    : 'bg-emerald-950/90 text-emerald-200 border-emerald-500 shadow-emerald-950/60'
                }`}>
                  {state.lastReveal.message}
                </div>
              </div>
            ) : state?.lastPlay ? (
              // CARDS FACE DOWN IN THE MIDDLE
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center gap-2 sm:gap-3">
                  {Array.from({ length: state.lastPlay.cardCount }).map((_, idx) => (
                    <div
                      key={idx}
                      className="w-20 h-28 sm:w-24 sm:h-34 rounded-xl overflow-hidden shadow-2xl shadow-black border border-amber-600/60 animate-pop"
                      style={{ transform: `rotate(${(idx - 1) * 6}deg)` }}
                    >
                      <CardBackIllustration />
                    </div>
                  ))}
                </div>

                <div className="mt-2.5 px-3 py-1 rounded-xl bg-black/80 text-stone-200 text-xs font-bold border border-stone-700/80 shadow-md flex items-center gap-1.5">
                  <span className="text-amber-400 font-black">{state.lastPlay.playerName}</span>
                  <span>{state.lastPlay.cardCount} adet {currentTargetInfo.name} attı</span>
                </div>
              </div>
            ) : (
              // Table Empty
              <div className="text-center text-stone-600 font-heading font-bold text-xs sm:text-sm italic">
                Masa temiz. İlk kartları oynayın!
              </div>
            )}
          </div>
        </div>

        {/* Turn Status Message Banner */}
        <div className="w-full max-w-xl my-3 text-center z-20">
          {isMyTurn ? (
            <div className="py-2 px-4 rounded-2xl bg-amber-500/20 text-amber-300 font-heading font-black text-xs sm:text-sm border border-amber-500/40 shadow-lg shadow-amber-500/10 animate-pulse flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>SIRA SİZDE! 1-3 kart seçip masaya sürün veya "YALANCI!" deyin!</span>
            </div>
          ) : (
            <div className="py-1.5 px-4 rounded-xl bg-stone-900/70 text-stone-400 text-xs font-bold border border-stone-800 flex items-center justify-center gap-2">
              <Clock className="w-3.5 h-3.5 text-stone-500 animate-spin" />
              <span>
                Sıra <strong className="text-white">{state?.players?.find(p => p.id === state?.currentTurnPlayerId)?.name}</strong>'da...
              </span>
            </div>
          )}
        </div>

        {/* Self Player Hand and Action Controls Area */}
        <div className="w-full flex flex-col items-center z-20 pb-2">
          {/* Own Cards in Hand */}
          <div className="flex items-end justify-center gap-2 sm:gap-3.5 mb-3 flex-wrap">
            {myHand.length === 0 ? (
              <div className="text-xs text-stone-500 italic p-3">
                {selfPlayer?.isAlive === false ? '💀 Elendiniz. Maçı canlı izliyorsunuz.' : 'Elinizde kart kalmadı.'}
              </div>
            ) : (
              myHand.map((card) => {
                const isSelected = selectedCardIds.includes(card.id);
                return (
                  <div key={card.id}>
                    <LiarsBarCard
                      card={card}
                      isFaceDown={false}
                      isSelected={isSelected}
                      onClick={() => toggleCardSelection(card.id)}
                      disabled={!isMyTurn}
                      size="md"
                    />
                  </div>
                );
              })
            )}
          </div>

          {/* Action Buttons: Play Cards & Call Liar */}
          {selfPlayer?.isAlive && (
            <div className="flex items-center gap-3 w-full max-w-md justify-center">
              {/* PLAY CARDS BUTTON */}
              <button
                type="button"
                onClick={handlePlayCards}
                disabled={!isMyTurn || selectedCardIds.length === 0}
                className={`flex-1 py-3 px-5 rounded-2xl font-heading font-black text-xs sm:text-sm tracking-wider uppercase transition shadow-lg flex items-center justify-center gap-2 ${
                  isMyTurn && selectedCardIds.length > 0
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black shadow-amber-500/25 active:scale-95 cursor-pointer'
                    : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700/60'
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>
                  {selectedCardIds.length > 0
                    ? `${selectedCardIds.length} Kart Sür (${currentTargetInfo.name})`
                    : 'Kart Seçin'}
                </span>
              </button>

              {/* CALL LIAR ("YALANCI!") BUTTON */}
              {state?.lastPlay && (
                <button
                  type="button"
                  onClick={handleChallenge}
                  disabled={!isMyTurn}
                  className={`py-3 px-6 rounded-2xl font-heading font-black text-xs sm:text-sm tracking-widest uppercase transition shadow-lg flex items-center justify-center gap-2 border ${
                    isMyTurn
                      ? 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white border-red-500 shadow-red-600/40 animate-pulse active:scale-95 cursor-pointer'
                      : 'bg-stone-800/80 text-stone-500 border-stone-700/60 cursor-not-allowed'
                  }`}
                >
                  <Skull className="w-4 h-4 text-white" />
                  <span>YALANCI!</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bomb Defusal Modal (Triggered on penalty) */}
      {state?.status === 'bomb_defusal' && penalizedPlayerObj && (
        <BombDefusalModal
          penalizedPlayer={penalizedPlayerObj}
          isMyPenalty={isMyPenalty}
          onCutWire={handleCutWire}
          wireCutResult={wireCutResult}
        />
      )}

      {/* Game Over Modal */}
      {state?.status === 'game_over' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md bg-stone-900 rounded-3xl border-2 border-amber-500/80 shadow-2xl p-6 text-center text-white">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 mx-auto flex items-center justify-center text-3xl mb-3 border border-amber-500/40">
              👑
            </div>

            <h2 className="font-heading font-black text-2xl text-amber-400 mb-1">
              ŞAMPİYON: {state.winner?.name}!
            </h2>
            <p className="text-xs text-stone-400 mb-6">
              Masada hayatta kalmayı başaran tek oyuncu olarak Liar's Bar'ın galibi oldu!
            </p>

            <div className="flex flex-col gap-2.5">
              {isHost && (
                <button
                  onClick={rematchLiars}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-heading font-black text-sm tracking-wide shadow-md active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  Tekrar Oyna
                </button>
              )}

              <button
                onClick={returnToLobby}
                className="w-full py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-sm transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                Lobiye Dön
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Chat Drawer */}
      <LiveChat
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        messages={chatMessages}
      />
    </div>
  );
}
