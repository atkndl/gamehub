import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import LiarsBarCard, { CardBackIllustration } from './LiarsBarCard';
import BombDefusalModal from './BombDefusalModal';
import { liarsAudio } from '../../utils/liarsBarAudio';
import confetti from 'canvas-confetti';
import {
  Play,
  RotateCcw,
  Home,
  Skull,
  Clock,
  Zap,
  Sparkles
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
    leaveRoom,
    showToast
  } = useGame();

  const [selectedCardIds, setSelectedCardIds] = useState([]);
  const [wireCutResult, setWireCutResult] = useState(null);
  const [flyingCards, setFlyingCards] = useState(null); // { count: number, from: 'self' | 'opponent', key: number }
  const [showGameOverModal, setShowGameOverModal] = useState(false);

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

  // Smooth delayed Game Over Modal (waits for explosion to fully subside)
  useEffect(() => {
    if (state?.status === 'game_over' && state?.winner) {
      const timer = setTimeout(() => {
        setShowGameOverModal(true);
        liarsAudio.playWinFanfare();
        try {
          confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
        } catch (e) {}
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      setShowGameOverModal(false);
    }
  }, [state?.status, state?.winner]);

  // Clear selections when round changes or turn advances
  useEffect(() => {
    setSelectedCardIds([]);
  }, [state?.currentTurnPlayerId, state?.roundNumber]);

  // Listen for opponents playing cards to trigger card fly animation
  useEffect(() => {
    if (state?.lastPlay && state.lastPlay.playerId !== player?.id) {
      setFlyingCards({
        count: state.lastPlay.cardCount,
        from: 'opponent',
        key: state.lastPlay.timestamp
      });
      const timer = setTimeout(() => setFlyingCards(null), 600);
      return () => clearTimeout(timer);
    }
  }, [state?.lastPlay?.timestamp, player?.id]);

  // Find self player object from server state
  const selfPlayer = state?.players?.find(p => p.id === player?.id);
  const myHand = selfPlayer?.hand || [];
  const opponents = state?.players?.filter(p => p.id !== player?.id) || [];

  // Table target labels & styling
  const targetLabels = {
    K: { name: 'PAPAZ', suit: '♠', icon: '👑', color: 'text-amber-400', border: 'border-amber-500' },
    Q: { name: 'KIZ', suit: '♥', icon: '🌹', color: 'text-rose-400', border: 'border-rose-500' },
    A: { name: 'AS', suit: '♠', icon: '♠', color: 'text-sky-400', border: 'border-sky-500' }
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
      // Trigger card flight animation from hand to table!
      setFlyingCards({
        count: selectedCardIds.length,
        from: 'self',
        key: Date.now()
      });
      liarsAudio.playCardSlide();
      setTimeout(() => setFlyingCards(null), 600);

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
    <div className="h-screen max-h-screen w-full bg-radial from-stone-900 via-neutral-950 to-black text-white flex flex-col justify-between relative overflow-hidden select-none font-sans p-2 sm:p-3">
      {/* Neo-noir ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-red-950/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[600px] h-[250px] bg-amber-950/15 rounded-full blur-[120px] pointer-events-none" />

      {/* TOP HEADER: Clean Brand + Room info + Exit */}
      <header className="flex items-center justify-between border-b border-stone-800/80 bg-stone-950/80 backdrop-blur-md rounded-2xl p-2 sm:px-4 z-30 shrink-0">
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

        {/* Right Exit Button */}
        <div>
          <button
            onClick={() => {
              if (isHost) {
                returnToLobby();
              } else {
                leaveRoom();
              }
            }}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-red-950/60 hover:bg-red-900/70 text-red-300 text-xs font-bold transition flex items-center gap-1.5 border border-red-800/80 cursor-pointer shadow-xs"
            title={isHost ? "Lobiye Dön" : "Odadan Ayrıl"}
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">{isHost ? "Lobiye Dön" : "Ayrıl"}</span>
          </button>
        </div>
      </header>

      {/* MAIN POKER TABLE ARENA (Compact 100vh Layout) */}
      <div className="flex-1 flex flex-col items-center justify-between py-1 relative max-w-5xl mx-auto w-full min-h-0 overflow-hidden">
        {/* Opponents Row */}
        <div className="w-full flex items-center justify-around gap-2 z-20 shrink-0">
          {opponents.map(opp => {
            const isTurn = state?.currentTurnPlayerId === opp.id;
            const isAlive = opp.isAlive;

            return (
              <div
                key={opp.id}
                className={`py-1.5 px-3 rounded-2xl border transition-all duration-300 flex items-center gap-2.5 backdrop-blur-md ${
                  !isAlive
                    ? 'bg-black/60 border-stone-800 opacity-40'
                    : isTurn
                    ? 'bg-amber-950/50 border-amber-500 shadow-lg shadow-amber-500/25 scale-105'
                    : 'bg-stone-900/80 border-stone-700/80'
                }`}
              >
                <div className="relative">
                  <span className="text-2xl sm:text-3xl select-none block">
                    {isAlive ? opp.avatar : '💀'}
                  </span>
                  {isTurn && isAlive && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 animate-ping" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-1">
                    <span className="font-heading font-black text-xs text-stone-100 truncate max-w-[80px]">
                      {opp.name}
                    </span>
                    {!isAlive && (
                      <span className="text-[8px] font-black uppercase px-1 rounded-sm bg-red-950 text-red-400 border border-red-800">
                        ÖLDÜ
                      </span>
                    )}
                  </div>

                  {isAlive && (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[9px] text-stone-400 font-bold">
                        {opp.cardCount} Kart
                      </span>
                      <div className="flex gap-0.5">
                        {Array.from({ length: Math.min(opp.cardCount, 5) }).map((_, i) => (
                          <div key={i} className="w-2 h-3 rounded-xs bg-amber-700 border border-amber-500/50 shadow-2xs" />
                        ))}
                      </div>
                    </div>
                  )}

                  {isAlive && (
                    <div className="flex items-center gap-1 mt-0.5 text-[9px] text-stone-400">
                      <span>💣</span>
                      <div className="flex gap-0.5">
                        {opp.wires?.map(w => (
                          <div
                            key={w.id}
                            className={`w-1.5 h-1.5 rounded-full ${
                              w.cut ? 'bg-stone-700' : 'bg-red-500'
                            }`}
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

        {/* TABLE SECTION: MASANIN HEMEN SOLUNDA KOZ KARTI + ORTADA POKER MASASI */}
        <div className="w-full max-w-4xl flex items-center justify-center gap-2 sm:gap-4 my-1 flex-1 min-h-0 relative">
          {/* MASANIN HEMEN SOLUNDA KART ŞEKLİNDE GÜNCEL KOZ */}
          <div className="flex flex-col items-center justify-center shrink-0 z-20 bg-stone-950/90 p-2 sm:p-2.5 rounded-2xl border-2 border-amber-500/80 shadow-2xl shadow-amber-950/50 backdrop-blur-md animate-fade-in">
            <div className="text-[9px] sm:text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-heading tracking-wider mb-1.5 animate-pulse text-center whitespace-nowrap">
              MASA KOZU
            </div>
            <div className="w-16 h-23 sm:w-20 sm:h-29 md:w-22 md:h-32 rounded-xl overflow-hidden shadow-xl border border-amber-400/90 transform hover:scale-105 transition-all">
              <LiarsBarCard card={{ type: state?.tableTarget || 'K' }} size="md" className="w-full h-full" />
            </div>
            <div className={`mt-1.5 font-heading font-black text-xs sm:text-sm tracking-wider text-center ${currentTargetInfo.color}`}>
              {currentTargetInfo.name} {currentTargetInfo.suit}
            </div>
            <span className="text-[9px] text-stone-400 text-center leading-tight mt-0.5 max-w-[85px] hidden sm:block">
              Hedef veya blöf
            </span>
          </div>

          {/* Center Table (Dark Oval Velvet with Brass Rim) */}
          <div className="w-full max-w-2xl flex-1 h-full max-h-[300px] sm:max-h-[330px] bg-gradient-to-b from-stone-900 via-neutral-900 to-black rounded-[45px] sm:rounded-[70px] border-6 sm:border-8 border-stone-800/90 shadow-2xl shadow-black relative flex flex-col items-center justify-center p-3 overflow-hidden">
            {/* Felt Inner Texture */}
            <div className="absolute inset-3 rounded-[35px] sm:rounded-[55px] bg-[radial-gradient(ellipse_at_center,_#162a17_0%,_#0b150c_60%,_#030604_100%)] border-2 border-emerald-950 shadow-inner pointer-events-none" />

            {/* Center Table Target Seal */}
            <div className="relative z-10 flex flex-col items-center mb-1 text-center">
              <div className={`px-3 py-1 rounded-full bg-black/80 border ${currentTargetInfo.border} shadow-md flex items-center gap-1.5`}>
                <span className="text-sm">{currentTargetInfo.icon}</span>
                <span className={`font-heading font-black text-xs sm:text-sm tracking-wider ${currentTargetInfo.color}`}>
                  {currentTargetInfo.name} {currentTargetInfo.suit} MASASI
                </span>
                <span className="text-sm">{currentTargetInfo.icon}</span>
              </div>
              <span className="text-[9px] text-emerald-400/80 font-bold mt-0.5">
                Jokerler her kart yerine geçer
              </span>
            </div>

            {/* CARDS ON THE TABLE OR REVEAL */}
            <div className="relative z-10 flex items-center justify-center gap-2 min-h-[110px] sm:min-h-[130px] w-full px-2">
              {state?.status === 'revealing' && state?.lastReveal ? (
                // REVEAL ANIMATION (Slow-motion flipped cards)
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

                  <div className={`mt-2 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-heading font-black tracking-wide text-center border shadow-xl animate-bounce ${
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
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                    {Array.from({ length: state.lastPlay.cardCount }).map((_, idx) => (
                      <div
                        key={idx}
                        className="w-16 h-24 sm:w-20 sm:h-28 rounded-xl overflow-hidden shadow-2xl shadow-black border border-amber-600/70 animate-pop"
                        style={{ transform: `rotate(${(idx - (state.lastPlay.cardCount - 1) / 2) * 8}deg)` }}
                      >
                        <CardBackIllustration />
                      </div>
                    ))}
                  </div>

                  <div className="mt-2 px-3 py-1 rounded-xl bg-black/80 text-stone-200 text-xs font-bold border border-stone-700/80 shadow-md flex items-center gap-1.5">
                    <span className="text-amber-400 font-black">{state.lastPlay.playerName}</span>
                    <span>{state.lastPlay.cardCount} adet {currentTargetInfo.name} attı</span>
                  </div>
                </div>
              ) : (
                <div className="text-center text-stone-600 font-heading font-bold text-xs italic">
                  Masa temiz. İlk kartları sürün!
                </div>
              )}
            </div>

            {/* FLYING CARDS ANIMATION LAYER (Smooth slide from hand to table!) */}
            {flyingCards && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-30">
                <div className="flex gap-2 animate-throw-cards">
                  {Array.from({ length: flyingCards.count }).map((_, idx) => (
                    <div
                      key={idx}
                      className="w-16 h-24 sm:w-20 sm:h-28 rounded-xl overflow-hidden shadow-2xl border-2 border-amber-400"
                      style={{ transform: `rotate(${(idx - 1) * 6}deg)` }}
                    >
                      <CardBackIllustration />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Turn Status Message Banner */}
        <div className="w-full max-w-lg my-1 text-center z-20 shrink-0">
          {isMyTurn ? (
            <div className="py-1.5 px-4 rounded-xl bg-amber-500/20 text-amber-300 font-heading font-black text-xs sm:text-sm border border-amber-500/40 shadow-md animate-pulse flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>SIRA SİZDE! 1-3 kart seçip masaya sürün veya "YALANCI!" deyin!</span>
            </div>
          ) : (
            <div className="py-1 px-4 rounded-xl bg-stone-900/70 text-stone-400 text-xs font-bold border border-stone-800 flex items-center justify-center gap-2">
              <Clock className="w-3.5 h-3.5 text-stone-500 animate-spin" />
              <span>
                Sıra <strong className="text-white">{state?.players?.find(p => p.id === state?.currentTurnPlayerId)?.name}</strong>'da...
              </span>
            </div>
          )}
        </div>

        {/* Self Player Hand and Action Controls Area */}
        <div className="w-full flex flex-col items-center z-20 shrink-0">
          {/* Own Cards in Hand */}
          <div className="flex items-end justify-center gap-1.5 sm:gap-3 mb-2 flex-wrap">
            {myHand.length === 0 ? (
              <div className="text-xs text-stone-500 italic p-2">
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
                className={`flex-1 py-2.5 sm:py-3 px-4 rounded-2xl font-heading font-black text-xs sm:text-sm tracking-wider uppercase transition shadow-lg flex items-center justify-center gap-2 ${
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
                  className={`py-2.5 sm:py-3 px-5 sm:px-6 rounded-2xl font-heading font-black text-xs sm:text-sm tracking-widest uppercase transition shadow-lg flex items-center justify-center gap-2 border ${
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

      {/* Game Over Modal (Smoothly delayed until explosion subsides) */}
      {showGameOverModal && state?.winner && (
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
    </div>
  );
}
