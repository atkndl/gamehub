import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Scissors, ShieldAlert, CheckCircle2, Flame, Heart, Sparkles, Eye } from 'lucide-react';
import { liarsAudio } from '../../utils/liarsBarAudio';

export const WIRE_DEFINITIONS = [
  { id: 0, colorName: 'Kırmızı', hex: '#ef4444', glow: '#f87171' },
  { id: 1, colorName: 'Mavi', hex: '#3b82f6', glow: '#60a5fa' },
  { id: 2, colorName: 'Sarı', hex: '#eab308', glow: '#fde047' },
  { id: 3, colorName: 'Yeşil', hex: '#10b981', glow: '#34d399' },
  { id: 4, colorName: 'Mor', hex: '#a855f7', glow: '#c084fc' },
  { id: 5, colorName: 'Beyaz', hex: '#f8fafc', glow: '#ffffff' }
];

export default function BombDefusalModal({
  penalizedPlayer,
  isMyPenalty = false,
  onCutWire = null,
  wireCutResult = null // { wireId, wireColor, isExplosion, playerName }
}) {
  const canvasRef = useRef(null);
  const [hoveredWire, setHoveredWire] = useState(null);
  const [cutAnimWireId, setCutAnimWireId] = useState(null);
  const [screenShake, setScreenShake] = useState(false);
  const [whiteFlash, setWhiteFlash] = useState(false);
  const [redStrobe, setRedStrobe] = useState(false);
  const [crackedGlass, setCrackedGlass] = useState(false);

  // Heartbeat sound loop during bomb defusal
  useEffect(() => {
    liarsAudio.startHeartbeatLoop(isMyPenalty ? 110 : 80);
    return () => {
      liarsAudio.stopHeartbeatLoop();
    };
  }, [isMyPenalty]);

  // Handle wire cut result animations and particle effects
  useEffect(() => {
    if (!wireCutResult) return;

    setCutAnimWireId(wireCutResult.wireId);

    if (wireCutResult.isExplosion) {
      // Trigger Catastrophic Explosion Sequence!
      liarsAudio.playExplosion();
      setWhiteFlash(true);
      setScreenShake(true);
      setRedStrobe(true);
      setCrackedGlass(true);

      spawnExplosionParticles();

      setTimeout(() => setWhiteFlash(false), 300);
      setTimeout(() => setScreenShake(false), 3800);
    } else {
      // Trigger Safe Wire Snip!
      liarsAudio.playWireSnip();
      setTimeout(() => {
        liarsAudio.playSafeSigh();
      }, 200);

      spawnSparks(wireCutResult.wireId);
    }
  }, [wireCutResult]);

  /**
   * Canvas particle system: Electrical spark shower
   */
  const spawnSparks = (wireId) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    const wireX = (width / 7) * (wireId + 1);
    const wireY = height * 0.52;

    const particles = [];
    for (let i = 0; i < 45; i++) {
      const angle = (Math.random() * Math.PI) - Math.PI / 2; // Upward spray
      const speed = Math.random() * 8 + 3;
      particles.push({
        x: wireX,
        y: wireY,
        vx: Math.cos(angle) * speed * (Math.random() > 0.5 ? 1 : -1),
        vy: -Math.abs(Math.sin(angle) * speed) - 2,
        size: Math.random() * 2.5 + 1,
        color: Math.random() > 0.4 ? '#f59e0b' : '#fef08a',
        life: 1.0,
        decay: Math.random() * 0.04 + 0.02
      });
    }

    let animId;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      let alive = false;
      particles.forEach(p => {
        if (p.life > 0) {
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vy += 0.25; // Gravity
          p.life -= p.decay;

          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      if (alive) {
        animId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    render();
  };

  /**
   * Canvas particle system: Catastrophic Fireball Explosion
   */
  const spawnExplosionParticles = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const fireParticles = [];
    const smokeParticles = [];

    // Fire particles
    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      fireParticles.push({
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 16 + 8,
        color: ['#ef4444', '#f97316', '#eab308', '#ffffff'][Math.floor(Math.random() * 4)],
        life: 1.0,
        decay: Math.random() * 0.03 + 0.015
      });
    }

    // Smoke particles
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 5 + 1;
      smokeParticles.push({
        x: centerX + (Math.random() - 0.5) * 40,
        y: centerY + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1, // drift upward
        size: Math.random() * 28 + 14,
        color: ['#1c1917', '#292524', '#44403c'][Math.floor(Math.random() * 3)],
        life: 1.0,
        decay: Math.random() * 0.015 + 0.008
      });
    }

    let animId;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      let alive = false;

      // Draw smoke
      smokeParticles.forEach(p => {
        if (p.life > 0) {
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.size += 0.4;
          p.life -= p.decay;

          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.life * 0.6);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Draw fire
      fireParticles.forEach(p => {
        if (p.life > 0) {
          alive = true;
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.96; // drag
          p.vy *= 0.96;
          p.size *= 0.97;
          p.life -= p.decay;

          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      if (alive) {
        animId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    render();
  };

  const wires = penalizedPlayer?.wires || WIRE_DEFINITIONS.map(w => ({ id: w.id, color: w.id, cut: false }));
  const uncutCount = wires.filter(w => !w.cut).length;
  const isCutDisabled = !isMyPenalty || Boolean(wireCutResult);

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-hidden ${
      screenShake ? 'animate-camera-shake' : ''
    }`}>
      {/* Blinding White Flash */}
      {whiteFlash && (
        <div className="fixed inset-0 z-60 bg-white transition-opacity duration-150 pointer-events-none" />
      )}

      {/* Full-Screen Danger Red Flashing Filter */}
      {redStrobe && (
        <div className="fixed inset-0 z-56 bg-red-600/35 mix-blend-color-burn pointer-events-none animate-pulse" />
      )}

      {/* Explosion Elimination Callout Banner */}
      {wireCutResult?.isExplosion && (
        <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-70 flex flex-col items-center justify-center p-6 sm:p-8 bg-red-950/95 border-4 border-red-600 rounded-3xl shadow-2xl shadow-red-950 text-center animate-bounce-subtle pointer-events-none max-w-lg mx-auto">
          <div className="text-6xl mb-2 animate-bounce">💥</div>
          <h2 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-widest uppercase mb-1 drop-shadow-md">
            BOMBA İNFİLAK ETTİ!
          </h2>
          <p className="font-heading font-black text-lg sm:text-xl text-amber-400">
            {penalizedPlayer?.name} ELENDİ! 💀
          </p>
          <span className="text-xs text-red-200 mt-2 font-mono">
            {isMyPenalty ? 'Masadan elendiniz...' : 'Kalan oyuncularla oyun devam edecek...'}
          </span>
        </div>
      )}

      {/* Cracked Glass Vignette on Explosion */}
      {crackedGlass && (
        <div className="fixed inset-0 z-55 pointer-events-none opacity-80 mix-blend-screen bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.95)_100%)]">
          <svg viewBox="0 0 800 600" className="w-full h-full stroke-white/40 fill-none" strokeWidth="1.5">
            <path d="M400,300 L120,40 M400,300 L700,80 M400,300 L760,480 M400,300 L180,560 M400,300 L30,280 M400,300 L560,540 M400,300 L680,220" />
            <polygon points="380,290 420,290 410,320 390,320" fill="white" fillOpacity="0.7" />
          </svg>
        </div>
      )}

      {/* Canvas for dynamic particles */}
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="absolute inset-0 w-full h-full pointer-events-none z-40"
      />

      {/* Main Bomb Defusal Console */}
      <div className="w-full max-w-2xl bg-gradient-to-b from-stone-900 via-neutral-950 to-black rounded-3xl border-2 border-stone-700/80 shadow-2xl shadow-red-950/40 p-5 sm:p-8 flex flex-col items-center relative overflow-hidden z-20">
        {/* Caution Hazard Top Stripes */}
        <div className="absolute top-0 inset-x-0 h-3 bg-[repeating-linear-gradient(45deg,#eab308,#eab308_12px,#1c1917_12px,#1c1917_24px)] opacity-80" />

        {/* Status Callout Header */}
        <div className="w-full flex items-center justify-between mb-4 mt-1 border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-red-500/20 text-red-500 border border-red-500/30 shadow-xs">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-black text-base sm:text-lg text-white tracking-wide">
                  SAATLİ BOMBA CEZASI
                </span>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-700">
                  C4 Tipi
                </span>
              </div>
              <p className="text-xs text-stone-400">
                {isMyPenalty ? (
                  <span className="text-red-400 font-bold">⚠️ DİKKAT: Sıra sizde! Hayatta kalmak için bir kablo kesin.</span>
                ) : (
                  <span className="text-amber-400 font-bold flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> Canlı İzleme: {penalizedPlayer?.name} kablo seçiyor...
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Survival Odds Counter */}
          <div className="flex flex-col items-end shrink-0">
            <span className="text-[11px] font-bold text-stone-400 uppercase">Hayatta Kalma Şansı</span>
            <span className="font-mono font-black text-sm text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-800">
              {uncutCount > 1 ? `${uncutCount - 1} / ${uncutCount}` : '0 / 1'} ({uncutCount > 0 ? Math.round(((uncutCount - 1) / uncutCount) * 100) : 0}%)
            </span>
          </div>
        </div>

        {/* Digital Heartbeat & LED Display */}
        <div className="w-full bg-stone-950 rounded-2xl border border-stone-800 p-3 mb-6 flex items-center justify-between gap-4 font-mono shadow-inner">
          <div className="flex items-center gap-2 text-red-500">
            <Heart className="w-5 h-5 animate-ping text-red-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-stone-300">Nabız:</span>
            <span className="text-sm font-black text-red-400 tracking-widest animate-pulse">
              {isMyPenalty ? '118 BPM' : '82 BPM'}
            </span>
          </div>

          {/* LED Status Banner */}
          {wireCutResult ? (
            wireCutResult.isExplosion ? (
              <div className="px-3 py-1 rounded-xl bg-red-900/90 text-red-200 border border-red-500 font-black text-xs flex items-center gap-1.5 animate-bounce">
                <Flame className="w-4 h-4 text-red-400" />
                <span>İNFAZ! BOMBA PATLADI!</span>
              </div>
            ) : (
              <div className="px-3 py-1 rounded-xl bg-emerald-900/90 text-emerald-200 border border-emerald-500 font-black text-xs flex items-center gap-1.5 animate-pop">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>GÜVENLİ! KURTULDUNUZ!</span>
              </div>
            )
          ) : (
            <div className="text-xs text-amber-500 font-bold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              <span>GİZLİ 1 PATLAYICI KABLO AKTİF</span>
            </div>
          )}
        </div>

        {/* Bomb C4 Visual Box with 6 Curving Wires */}
        <div className="w-full bg-gradient-to-b from-stone-800 to-stone-900 rounded-3xl border-4 border-stone-950 p-6 shadow-2xl relative">
          {/* Metal Casing Screws */}
          <div className="absolute top-2.5 left-2.5 w-3 h-3 rounded-full bg-stone-500 border border-stone-950 flex items-center justify-center text-[8px] text-stone-950">+</div>
          <div className="absolute top-2.5 right-2.5 w-3 h-3 rounded-full bg-stone-500 border border-stone-950 flex items-center justify-center text-[8px] text-stone-950">+</div>
          <div className="absolute bottom-2.5 left-2.5 w-3 h-3 rounded-full bg-stone-500 border border-stone-950 flex items-center justify-center text-[8px] text-stone-950">+</div>
          <div className="absolute bottom-2.5 right-2.5 w-3 h-3 rounded-full bg-stone-500 border border-stone-950 flex items-center justify-center text-[8px] text-stone-950">+</div>

          {/* Top Terminals Bar */}
          <div className="grid grid-cols-6 gap-2 mb-2">
            {WIRE_DEFINITIONS.map(def => (
              <div key={def.id} className="flex flex-col items-center">
                <div className="w-5 h-5 rounded-md bg-amber-600 border border-amber-900 shadow-xs flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-amber-300" />
                </div>
                <span className="text-[10px] font-black text-stone-400 font-mono mt-0.5">#{def.id + 1}</span>
              </div>
            ))}
          </div>

          {/* Interactive Curving Wires Grid */}
          <div className="grid grid-cols-6 gap-3 sm:gap-4 my-2">
            {WIRE_DEFINITIONS.map((def) => {
              const wireState = wires.find(w => w.id === def.id);
              const isCut = wireState ? wireState.cut : false;
              const isHovered = hoveredWire === def.id;

              return (
                <div
                  key={def.id}
                  onMouseEnter={() => !isCut && setHoveredWire(def.id)}
                  onMouseLeave={() => setHoveredWire(null)}
                  onClick={() => {
                    if (!isCut && !isCutDisabled && onCutWire) {
                      onCutWire(def.id);
                    }
                  }}
                  className={`h-40 sm:h-48 rounded-2xl flex flex-col items-center justify-between p-2 relative transition-all duration-200 ${
                    isCut
                      ? 'opacity-40 cursor-not-allowed'
                      : !isCutDisabled
                      ? 'cursor-pointer hover:scale-105 active:scale-95'
                      : 'cursor-default'
                  }`}
                >
                  {/* Curving Procedural Wire SVG */}
                  <svg viewBox="0 0 40 160" className="w-full h-full overflow-visible">
                    <defs>
                      <filter id={`glow-${def.id}`} x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={def.hex} floodOpacity="0.8" />
                      </filter>
                    </defs>

                    {isCut ? (
                      // Severed Wire with Charred Ends
                      <g>
                        {/* Top Half */}
                        <path
                          d="M20,0 C20,25 10,45 14,65"
                          fill="none"
                          stroke={def.hex}
                          strokeWidth="5"
                          strokeLinecap="round"
                        />
                        {/* Charred Tip */}
                        <circle cx="14" cy="65" r="3.5" fill="#1c1917" stroke="#444" strokeWidth="1" />

                        {/* Bottom Half */}
                        <path
                          d="M26,95 C30,115 20,135 20,160"
                          fill="none"
                          stroke={def.hex}
                          strokeWidth="5"
                          strokeLinecap="round"
                        />
                        {/* Charred Tip */}
                        <circle cx="26" cy="95" r="3.5" fill="#1c1917" stroke="#444" strokeWidth="1" />
                      </g>
                    ) : (
                      // Intact Tensioned Wire
                      <g>
                        {/* Glowing shadow when hovered */}
                        {isHovered && (
                          <path
                            d="M20,0 C12,40 28,120 20,160"
                            fill="none"
                            stroke={def.glow}
                            strokeWidth="8"
                            opacity="0.6"
                            filter={`url(#glow-${def.id})`}
                          />
                        )}
                        <path
                          d="M20,0 C12,40 28,120 20,160"
                          fill="none"
                          stroke={def.hex}
                          strokeWidth="5.5"
                          strokeLinecap="round"
                          className={isHovered ? 'animate-pulse' : ''}
                        />
                        {/* Texture Core */}
                        <path
                          d="M20,0 C12,40 28,120 20,160"
                          fill="none"
                          stroke="#ffffff"
                          strokeWidth="1.2"
                          opacity="0.4"
                        />
                      </g>
                    )}
                  </svg>

                  {/* Cut Pliers Cursor overlay on hover */}
                  {!isCut && isHovered && !isCutDisabled && (
                    <div className="absolute inset-0 flex items-center justify-center animate-bounce-subtle pointer-events-none">
                      <div className="p-2 rounded-full bg-red-600 text-white shadow-lg shadow-red-600/50">
                        <Scissors className="w-5 h-5 -rotate-45" />
                      </div>
                    </div>
                  )}

                  {/* Bottom Wire Tag */}
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md mt-1 font-mono ${
                    isCut ? 'bg-stone-800 text-stone-500 line-through' : 'bg-stone-900 text-white border border-stone-700'
                  }`}>
                    {def.colorName}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Bottom Terminals Bar */}
          <div className="grid grid-cols-6 gap-2 mt-2">
            {WIRE_DEFINITIONS.map(def => (
              <div key={def.id} className="flex items-center justify-center">
                <div className="w-5 h-5 rounded-md bg-amber-600 border border-amber-900 shadow-xs flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-amber-300" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Prompt */}
        <div className="mt-5 text-center">
          {isMyPenalty ? (
            !wireCutResult ? (
              <p className="text-xs sm:text-sm text-stone-300 font-bold animate-pulse flex items-center justify-center gap-2">
                <Scissors className="w-4 h-4 text-amber-400" />
                <span>Penseyi kullanmak ve teli kesmek için bir kabloya tıklayın!</span>
              </p>
            ) : null
          ) : (
            <p className="text-xs text-stone-400 font-medium">
              Kritik an! Diğer oyuncular nefeslerini tuttu, izliyor...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
