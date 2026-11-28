import React, { useState, useEffect } from 'react';
import {
  Gauge,
  Flame,
  Wrench,
  RotateCcw,
  Flag,
  Trophy,
  ArrowLeft,
  Zap,
  Disc,
  ShieldAlert,
  Sparkles,
  Timer,
  CheckCircle2
} from 'lucide-react';

export default function RacingHUD({
  state,
  myPlayer,
  onLeave,
  onPitService
}) {
  const [activeService, setActiveService] = useState(null); // { type: 'nitro' | 'tires' | 'repair', progress: 0 }
  const [nitroPumpAnim, setNitroPumpAnim] = useState(false);
  const [tireChangeAnim, setTireChangeAnim] = useState(false);
  const [repairAnim, setRepairAnim] = useState(false);

  // Active progress animation loop for pit stop actions
  useEffect(() => {
    if (!activeService) return;
    const interval = setInterval(() => {
      setActiveService(prev => {
        if (!prev) return null;
        const nextProgress = prev.progress + (prev.type === 'nitro' ? 18 : prev.type === 'tires' ? 12 : 10);
        if (nextProgress >= 100) {
          // Finished!
          onPitService(prev.type);
          return null;
        }
        return { ...prev, progress: nextProgress };
      });
    }, 100);

    return () => clearInterval(interval);
  }, [activeService, onPitService]);

  // Trigger animations on pit service
  const triggerNitroPump = () => {
    setNitroPumpAnim(true);
    setActiveService({ type: 'nitro', progress: 15 });
    setTimeout(() => setNitroPumpAnim(false), 800);
  };

  const triggerTireChange = () => {
    setTireChangeAnim(true);
    setActiveService({ type: 'tires', progress: 10 });
    setTimeout(() => setTireChangeAnim(false), 1200);
  };

  const triggerRepair = () => {
    setRepairAnim(true);
    setActiveService({ type: 'repair', progress: 10 });
    setTimeout(() => setRepairAnim(false), 1400);
  };

  if (!myPlayer) return null;

  const currentLap = myPlayer.currentLap || 1;
  const totalLaps = state?.config?.laps || 3;
  const rank = myPlayer.liveRank || myPlayer.rank || 1;
  const totalRacers = state?.players?.length || 1;
  const speed = myPlayer.speed || 0;
  const nitro = myPlayer.nitro || 0;
  const tires = myPlayer.tires || { fl: 100, fr: 100, rl: 100, rr: 100 };
  const damage = myPlayer.damage || { front: 100, rear: 100, engine: 100, body: 100 };

  // Calculate Gear based on speed
  const getGear = (spd) => {
    if (spd < 5) return 'N';
    if (spd < 65) return '1';
    if (spd < 130) return '2';
    if (spd < 205) return '3';
    if (spd < 280) return '4';
    if (spd < 350) return '5';
    return '6';
  };

  const formatSeconds = (secs) => {
    if (secs == null || isNaN(secs)) return '--:--';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 10);
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}.${ms}`;
  };

  const getTireColor = (pct) => {
    if (pct >= 70) return '#10b981'; // Green
    if (pct >= 40) return '#f59e0b'; // Amber
    if (pct > 0) return '#ef4444';   // Red
    return '#450a0a';                // Blown / Black
  };

  const isTimeMode = state?.config?.mode === 'time';
  const timeLeft = state?.timeLeft ?? 120;
  const isTimeWarning = isTimeMode && timeLeft <= 30;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-5 select-none font-sans z-20">
      {/* TOP HEADER BAR: Sleek broadcast / arcade style */}
      <div className="flex items-start justify-between w-full">
        {/* Top Left: Exit & Rank */}
        <div className="flex items-center gap-2.5 pointer-events-auto">
          <button
            type="button"
            onClick={onLeave}
            className="p-2 sm:p-2.5 rounded-2xl bg-slate-900/85 hover:bg-slate-800 border border-slate-700/80 text-white backdrop-blur-md shadow-lg transition active:scale-95 cursor-pointer flex items-center gap-2 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Lobiye Dön</span>
          </button>

          {/* Position Badge */}
          <div className="px-3.5 sm:px-4 py-2 rounded-2xl bg-slate-900/90 border border-amber-500/50 backdrop-blur-md shadow-xl flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <div className="flex items-baseline gap-1">
              <span className="font-heading font-black text-xl text-amber-400 leading-none">
                P{rank}
              </span>
              <span className="text-[11px] font-bold text-slate-400">/ {totalRacers}</span>
            </div>
          </div>
        </div>

        {/* TOP CENTER: BOLD PROMINENT RACE STATUS BANNER (TUR VEYA SÜRE) */}
        <div className="pointer-events-auto flex flex-col items-center">
          <div className={`px-5 py-2.5 rounded-2xl backdrop-blur-xl border-2 shadow-2xl flex items-center gap-3 transition-all ${
            isTimeWarning
              ? 'bg-red-950/90 border-red-500 animate-pulse text-red-200'
              : 'bg-slate-900/90 border-slate-700/90 text-white'
          }`}>
            {isTimeMode ? (
              <>
                <Timer className={`w-5 h-5 ${isTimeWarning ? 'text-red-400 animate-spin' : 'text-amber-400 animate-pulse'}`} />
                <div className="text-left">
                  <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 block leading-tight">
                    {isTimeWarning ? '⚠️ KRİTİK SÜRE' : 'KALAN YARIŞ SÜRESİ'}
                  </span>
                  <span className={`font-mono font-black text-lg sm:text-2xl tracking-wider leading-none ${
                    isTimeWarning ? 'text-red-400' : 'text-amber-400'
                  }`}>
                    {formatSeconds(timeLeft)}
                  </span>
                </div>
              </>
            ) : (
              <>
                <Flag className="w-5 h-5 text-sky-400" />
                <div className="text-left">
                  <span className="text-[10px] font-black tracking-widest uppercase text-slate-400 block leading-tight">
                    YARIŞ TURU
                  </span>
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-mono font-black text-lg sm:text-2xl text-sky-400 leading-none">
                      TUR {currentLap}
                    </span>
                    <span className="text-xs font-bold text-slate-400">/ {totalLaps}</span>
                  </div>
                </div>
              </>
            )}

            {/* Segmented Lap progress / mini dots */}
            {!isTimeMode && (
              <div className="flex items-center gap-1 pl-2 border-l border-slate-700">
                {Array.from({ length: totalLaps }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      i + 1 < currentLap
                        ? 'bg-emerald-400 shadow-xs'
                        : i + 1 === currentLap
                        ? 'bg-sky-400 ring-2 ring-sky-300 animate-pulse'
                        : 'bg-slate-700'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Surface Alerts (Çim & Pit) */}
          {myPlayer.onSurface === 'grass' ? (
            <div className="mt-1.5 px-3 py-1 rounded-xl bg-amber-500/25 border border-amber-400 text-amber-300 text-xs font-bold backdrop-blur-md shadow-md animate-pulse flex items-center gap-1.5">
              <span>🌾</span>
              <span>ÇİMDESİN (YAVAŞLAMA & ÇEKİŞ DÜŞTÜ)</span>
            </div>
          ) : myPlayer.inPit ? (
            <div className="mt-1.5 px-3.5 py-1 rounded-xl bg-amber-500 border border-amber-300 text-slate-950 text-xs font-black backdrop-blur-md shadow-lg animate-bounce-subtle flex items-center gap-1.5">
              <span>⚡</span>
              <span>GARACINDASIN: PİT SERVİSİ AKTİF</span>
            </div>
          ) : null}
        </div>

        {/* Top Right: Lap Times Card */}
        <div className="flex items-start gap-3 pointer-events-auto">
          <div className="px-3.5 py-2 rounded-2xl bg-slate-900/85 border border-slate-700/80 backdrop-blur-md text-right shadow-lg flex flex-col gap-0.5">
            <div className="text-[10px] font-bold text-slate-400 flex items-center justify-end gap-1">
              <span>BU TUR:</span>
              <span className="font-mono font-black text-white text-xs">
                {formatSeconds(myPlayer.currentLapTime)}
              </span>
            </div>
            <div className="text-[10px] font-bold text-emerald-400 flex items-center justify-end gap-1">
              <span>EN İYİ:</span>
              <span className="font-mono font-black text-emerald-300 text-xs">
                {myPlayer.bestLapTime ? formatSeconds(myPlayer.bestLapTime) : '--:--'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* CENTER: ACTIVE PIT STOP PROGRESS OVERLAY (Visible during repair / refill) */}
      {activeService && (
        <div className="self-center my-auto px-6 py-4 rounded-3xl bg-slate-950/95 border-2 border-amber-400/80 shadow-2xl backdrop-blur-xl animate-scale-up pointer-events-auto flex flex-col items-center gap-2.5 max-w-sm w-full">
          <div className="flex items-center gap-2">
            {activeService.type === 'nitro' ? (
              <Flame className="w-6 h-6 text-sky-400 animate-bounce" />
            ) : activeService.type === 'tires' ? (
              <Disc className="w-6 h-6 text-amber-400 animate-spin" />
            ) : (
              <Wrench className="w-6 h-6 text-emerald-400 animate-bounce" />
            )}
            <span className="font-heading font-black text-sm text-white">
              {activeService.type === 'nitro'
                ? '⚡ NİTRO TÜPÜ DOLDURULUYOR...'
                : activeService.type === 'tires'
                ? '🔩 4 LASTİK DEĞİŞTİRİLİYOR...'
                : '🛠️ GÖVDE VE MOTOR ONARILIYOR...'}
            </span>
          </div>

          {/* Animated Progress Bar */}
          <div className="w-full bg-slate-800 rounded-full h-4 p-0.5 overflow-hidden border border-slate-700">
            <div
              className={`h-full rounded-full transition-all duration-150 ${
                activeService.type === 'nitro'
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-400'
                  : activeService.type === 'tires'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-400'
              }`}
              style={{ width: `${activeService.progress}%` }}
            />
          </div>

          <span className="font-mono font-black text-xs text-slate-300">
            %{activeService.progress} Tamamlandı
          </span>
        </div>
      )}

      {/* PIT STOP INTERACTIVE PANEL (When car is inside their designated pit box) */}
      {myPlayer.inPit && !activeService && (
        <div className="self-center my-auto p-4 rounded-3xl bg-slate-950/95 border-2 border-amber-400 shadow-2xl backdrop-blur-xl pointer-events-auto animate-scale-up max-w-lg w-full flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="text-xl">🔧</span>
              <div>
                <h3 className="font-heading font-black text-sm text-white leading-tight">
                  TAKIM GARAJI & PİT SERVİSİ
                </h3>
                <p className="text-[11px] text-amber-400 font-medium">
                  Aracın hazır durduruldu. İstediğin parçayı yenile!
                </p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">
              Hazır ✓
            </span>
          </div>

          {/* 3 Service Buttons with shortcuts */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* 1. Nitro Refill */}
            <button
              type="button"
              onClick={triggerNitroPump}
              className={`p-3 rounded-2xl border transition-all flex flex-col items-center text-center cursor-pointer relative overflow-hidden ${
                nitro >= 100
                  ? 'bg-emerald-950/80 border-emerald-500/70 text-emerald-300'
                  : 'bg-slate-900 hover:bg-slate-800 border-sky-500/70 text-sky-200 active:scale-95'
              } ${nitroPumpAnim ? 'ring-4 ring-sky-400 scale-105' : ''}`}
            >
              <Flame className={`w-6 h-6 mb-1 ${nitro >= 100 ? 'text-emerald-400' : 'text-sky-400'} ${nitroPumpAnim ? 'animate-bounce' : ''}`} />
              <div className="text-[11px] font-bold">Nitro Doldur</div>
              <div className="font-mono font-black text-xs mt-0.5">
                {Math.round(nitro)}%
              </div>
              <div className="mt-2 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono font-bold text-sky-400">
                [Shift]
              </div>
            </button>

            {/* 2. Tire Replacement */}
            <button
              type="button"
              onClick={triggerTireChange}
              className={`p-3 rounded-2xl border transition-all flex flex-col items-center text-center cursor-pointer relative overflow-hidden ${
                tireChangeAnim ? 'ring-4 ring-amber-400 scale-105' : ''
              } bg-slate-900 hover:bg-slate-800 border-amber-500/70 text-amber-200 active:scale-95`}
            >
              <Disc className={`w-6 h-6 mb-1 text-amber-400 ${tireChangeAnim ? 'animate-spin' : ''}`} />
              <div className="text-[11px] font-bold">Yeni Lastik</div>
              <div className="font-mono font-black text-xs mt-0.5 text-amber-300">
                4x Değiş
              </div>
              <div className="mt-2 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono font-bold text-amber-400">
                [T]
              </div>
            </button>

            {/* 3. Damage Repair */}
            <button
              type="button"
              onClick={triggerRepair}
              className={`p-3 rounded-2xl border transition-all flex flex-col items-center text-center cursor-pointer relative overflow-hidden ${
                repairAnim ? 'ring-4 ring-emerald-400 scale-105' : ''
              } bg-slate-900 hover:bg-slate-800 border-emerald-500/70 text-emerald-200 active:scale-95`}
            >
              <Wrench className={`w-6 h-6 mb-1 text-emerald-400 ${repairAnim ? 'animate-bounce' : ''}`} />
              <div className="text-[11px] font-bold">Hasar Onar</div>
              <div className="font-mono font-black text-xs mt-0.5 text-emerald-300">
                Gövde & Motor
              </div>
              <div className="mt-2 px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono font-bold text-emerald-400">
                [R]
              </div>
            </button>
          </div>

          {/* Exit Pit Button */}
          <button
            type="button"
            onClick={() => onPitService('exit_pit')}
            className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-600 hover:to-emerald-600 text-slate-950 font-heading font-black text-xs tracking-wider shadow-lg active:scale-95 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>🏁 PİTTEN ÇIK & YARIŞA DÖN [Space / Gaz]</span>
          </button>
        </div>
      )}

      {/* BOTTOM SECTION: TELEMETRY SKELETON (SOL ALTTA) & SPEEDOMETER */}
      <div className="flex items-end justify-between w-full">
        {/* SOL ALT: ARABANIN İSKELETİ & TELEMETRİ PANELİ */}
        <div className="p-3.5 sm:p-4 rounded-3xl bg-slate-950/95 border-2 border-slate-700/80 backdrop-blur-xl shadow-2xl flex items-center gap-4 pointer-events-auto">
          {/* Top-down Car Wireframe Telemetry */}
          <div className="relative w-32 h-44 flex items-center justify-center">
            {/* Chassis Blueprint Outline */}
            <div className="absolute inset-x-6 inset-y-5 rounded-3xl border-2 border-slate-600/80 bg-slate-900/80 flex flex-col justify-between items-center p-1.5 shadow-inner">
              {/* Front Wing Status */}
              <div
                className="w-full h-2.5 rounded-t-lg transition-colors flex items-center justify-center"
                style={{ backgroundColor: damage.front > 50 ? '#10b981' : (damage.front > 20 ? '#f59e0b' : '#ef4444') }}
                title={`Ön Tampon: %${damage.front}`}
              >
                <span className="text-[7px] font-mono font-black text-slate-950">ÖN</span>
              </div>

              {/* Engine Block */}
              <div className="flex flex-col items-center">
                <Wrench className={`w-4 h-4 mb-0.5 ${damage.engine < 50 ? 'text-red-400 animate-bounce' : 'text-slate-400'}`} />
                <span className="text-[9px] font-mono font-black text-slate-200">
                  {damage.engine}%
                </span>
                <span className="text-[7px] font-bold text-slate-500">MOTOR</span>
              </div>

              {/* Rear Wing Status */}
              <div
                className="w-full h-2.5 rounded-b-lg transition-colors flex items-center justify-center"
                style={{ backgroundColor: damage.rear > 50 ? '#10b981' : (damage.rear > 20 ? '#f59e0b' : '#ef4444') }}
                title={`Arka Spoyler: %${damage.rear}`}
              >
                <span className="text-[7px] font-mono font-black text-slate-950">ARKA</span>
              </div>
            </div>

            {/* 4 Tires on 4 Corners */}
            {/* Front-Left (FL) */}
            <div
              className="absolute top-2 left-0 w-5 h-8 rounded-md border-2 border-slate-900 transition-colors shadow-md flex flex-col items-center justify-center"
              style={{ backgroundColor: getTireColor(tires.fl) }}
              title={`Ön Sol Lastik: %${tires.fl}`}
            >
              <span className="text-[7px] font-mono font-black text-slate-950">FL</span>
              <span className="text-[6px] font-mono font-bold text-slate-950 leading-none">{tires.fl}%</span>
            </div>

            {/* Front-Right (FR) */}
            <div
              className="absolute top-2 right-0 w-5 h-8 rounded-md border-2 border-slate-900 transition-colors shadow-md flex flex-col items-center justify-center"
              style={{ backgroundColor: getTireColor(tires.fr) }}
              title={`Ön Sağ Lastik: %${tires.fr}`}
            >
              <span className="text-[7px] font-mono font-black text-slate-950">FR</span>
              <span className="text-[6px] font-mono font-bold text-slate-950 leading-none">{tires.fr}%</span>
            </div>

            {/* Rear-Left (RL) */}
            <div
              className="absolute bottom-2 left-0 w-5 h-8 rounded-md border-2 border-slate-900 transition-colors shadow-md flex flex-col items-center justify-center"
              style={{ backgroundColor: getTireColor(tires.rl) }}
              title={`Arka Sol Lastik: %${tires.rl}`}
            >
              <span className="text-[7px] font-mono font-black text-slate-950">RL</span>
              <span className="text-[6px] font-mono font-bold text-slate-950 leading-none">{tires.rl}%</span>
            </div>

            {/* Rear-Right (RR) */}
            <div
              className="absolute bottom-2 right-0 w-5 h-8 rounded-md border-2 border-slate-900 transition-colors shadow-md flex flex-col items-center justify-center"
              style={{ backgroundColor: getTireColor(tires.rr) }}
              title={`Arka Sağ Lastik: %${tires.rr}`}
            >
              <span className="text-[7px] font-mono font-black text-slate-950">RR</span>
              <span className="text-[6px] font-mono font-bold text-slate-950 leading-none">{tires.rr}%</span>
            </div>
          </div>

          {/* Telemetry Stats Column: Nitro Canister & Condition */}
          <div className="flex flex-col justify-between h-36 py-1">
            {/* Nitro Fluid Cylinder */}
            <div>
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                <span className="flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-cyan-400" />
                  NİTRO (NOS)
                </span>
                <span className="font-mono font-black text-cyan-300">{Math.round(nitro)}%</span>
              </div>
              <div className="w-28 bg-slate-900 border border-slate-700 rounded-full h-3.5 p-0.5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-100 shadow-sm shadow-cyan-500/50"
                  style={{ width: `${nitro}%` }}
                />
              </div>
            </div>

            {/* Damage Status Badges */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                <span>GÖVDE:</span>
                <span className={`font-mono font-black ${damage.front > 50 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {damage.front}%
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                <span>LASTİK ORT:</span>
                <span className="font-mono font-black text-amber-400">
                  {Math.round((tires.fl + tires.fr + tires.rl + tires.rr) / 4)}%
                </span>
              </div>
            </div>

            {/* Pit Alert if broken */}
            {(damage.front < 40 || damage.engine < 40 || tires.rl < 30) && (
              <div className="px-2 py-0.5 rounded-lg bg-red-500/20 border border-red-500 text-red-400 text-[9px] font-black animate-pulse flex items-center gap-1">
                <ShieldAlert className="w-3 h-3" />
                <span>PİTE GİR! HASAR VAR</span>
              </div>
            )}
          </div>
        </div>

        {/* SAĞ ALT: DIGITAL SPEEDOMETER & GEAR & DRIFT MULTIPLIER */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          {/* Drift Multiplier Banner */}
          {myPlayer.isDrifting && (
            <div className="px-4 py-1.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-white font-heading font-black text-sm tracking-wider shadow-xl shadow-orange-500/40 animate-bounce flex items-center gap-2">
              <Sparkles className="w-4 h-4 fill-current" />
              <span>DRIFT! x1.5</span>
            </div>
          )}

          {/* Speedometer Cluster */}
          <div className="p-4 rounded-3xl bg-slate-950/95 border-2 border-slate-700/80 backdrop-blur-xl shadow-2xl flex items-center gap-4">
            {/* Gear Indicator */}
            <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-700 flex flex-col items-center justify-center shadow-inner">
              <span className="text-[9px] font-bold text-slate-500 tracking-wider">VİTES</span>
              <span className="font-heading font-black text-2xl text-amber-400 leading-none">
                {getGear(speed)}
              </span>
            </div>

            {/* Speed Digits */}
            <div className="text-right">
              <div className="font-mono font-black text-3xl sm:text-4xl text-white tracking-wider leading-none">
                {Math.round(speed)}
              </div>
              <div className="text-[10px] font-bold text-slate-400 tracking-widest mt-1">
                KM / SAAT
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
