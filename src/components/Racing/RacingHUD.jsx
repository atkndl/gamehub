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
  Timer
} from 'lucide-react';

export default function RacingHUD({
  state,
  myPlayer,
  onLeave,
  onPitService
}) {
  const [nitroPumpAnim, setNitroPumpAnim] = useState(false);
  const [tireChangeAnim, setTireChangeAnim] = useState(false);
  const [repairAnim, setRepairAnim] = useState(false);

  // Trigger animations on pit service
  const triggerNitroPump = () => {
    setNitroPumpAnim(true);
    setTimeout(() => setNitroPumpAnim(false), 500);
    onPitService('nitro');
  };

  const triggerTireChange = () => {
    setTireChangeAnim(true);
    setTimeout(() => setTireChangeAnim(false), 800);
    onPitService('tires');
  };

  const triggerRepair = () => {
    setRepairAnim(true);
    setTimeout(() => setRepairAnim(false), 800);
    onPitService('repair');
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

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-5 select-none font-sans z-20">
      {/* TOP HEADER BAR */}
      <div className="flex items-start justify-between w-full">
        {/* Top Left: Exit & Race Status Badges */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            type="button"
            onClick={onLeave}
            className="p-2.5 rounded-2xl bg-slate-900/85 hover:bg-slate-800 border border-slate-700/80 text-white backdrop-blur-md shadow-lg transition active:scale-95 cursor-pointer flex items-center gap-2 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Lobiye Dön</span>
          </button>

          {/* Position Badge */}
          <div className="px-4 py-2 rounded-2xl bg-slate-900/90 border border-amber-500/50 backdrop-blur-md shadow-xl flex items-center gap-2.5">
            <Trophy className="w-4 h-4 text-amber-400" />
            <div className="flex items-baseline gap-1">
              <span className="font-heading font-black text-xl text-amber-400 leading-none">
                P{rank}
              </span>
              <span className="text-[11px] font-bold text-slate-400">/ {totalRacers}</span>
            </div>
          </div>

          {/* Lap or Time Badge */}
          <div className="px-4 py-2 rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-lg flex items-center gap-2">
            {state?.config?.mode === 'time' ? (
              <>
                <Timer className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-xs font-bold text-slate-300">KALAN SÜRE:</span>
                <span className="font-mono font-black text-emerald-400 text-sm">
                  {formatSeconds(state?.timeLeft)}
                </span>
              </>
            ) : (
              <>
                <Flag className="w-4 h-4 text-sky-400" />
                <span className="text-xs font-bold text-slate-300">TUR:</span>
                <span className="font-mono font-black text-sky-400 text-sm">
                  {currentLap} / {totalLaps}
                </span>
              </>
            )}
          </div>

          {/* Surface Indicator */}
          {myPlayer.onSurface === 'grass' ? (
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400 text-amber-300 text-xs font-bold backdrop-blur-md shadow-md animate-pulse flex items-center gap-1.5">
              <span>🌾</span>
              <span>ÇİMDESİN (YAVAŞLAMA)</span>
            </div>
          ) : myPlayer.inPit ? (
            <div className="px-3.5 py-1.5 rounded-xl bg-amber-500 border border-amber-300 text-slate-950 text-xs font-black backdrop-blur-md shadow-lg animate-bounce-subtle flex items-center gap-1.5">
              <span>⚡</span>
              <span>PİT ALANINDASIN</span>
            </div>
          ) : null}
        </div>

        {/* Top Right: Lap Times & Mini-map */}
        <div className="flex items-start gap-3 pointer-events-auto">
          {/* Lap Times Card */}
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

          {/* Tactical Circuit Minimap */}
          <div className="w-36 h-28 rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-2xl p-2 relative overflow-hidden flex items-center justify-center">
            {/* SVG Mini Circuit Track */}
            <svg viewBox="0 0 3800 2600" className="w-full h-full opacity-80">
              {/* Circuit Outer Path */}
              <polyline
                points="1700,2150 2500,2150 3000,2050 3350,1750 3350,1250 3050,850 2600,700 2000,650 1400,650 900,800 650,1100 500,1450 550,1800 800,2100 1200,2150 1700,2150"
                fill="none"
                stroke="#64748b"
                strokeWidth="180"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Pit Lane Path */}
              <path
                d="M 1100,2150 L 1180,2330 L 2280,2330 L 2350,2150"
                fill="none"
                stroke="#eab308"
                strokeWidth="90"
                strokeLinecap="round"
              />
              {/* Start / Finish line dot */}
              <circle cx="1700" cy="2150" r="70" fill="#ffffff" />

              {/* Opponent dots */}
              {state?.players?.map(p => {
                const isSelf = p.id === myPlayer.id;
                return (
                  <circle
                    key={p.id}
                    cx={p.x}
                    cy={p.y}
                    r={isSelf ? 110 : 85}
                    fill={isSelf ? '#38bdf8' : (p.carModel?.color || '#ef4444')}
                    stroke="#ffffff"
                    strokeWidth={isSelf ? 25 : 12}
                  />
                );
              })}
            </svg>
            <span className="absolute bottom-1 right-2 text-[8px] font-mono text-slate-500 font-bold">
              HARİTA
            </span>
          </div>
        </div>
      </div>

      {/* CENTER: INTERACTIVE PIT STOP SERVICE OVERLAY (When in Pit Bay) */}
      {myPlayer.inPit && (
        <div className="self-center my-auto p-5 sm:p-6 rounded-3xl bg-slate-950/95 border-2 border-amber-400 shadow-2xl shadow-amber-500/20 backdrop-blur-xl pointer-events-auto flex flex-col items-center gap-4 animate-bounce-subtle max-w-lg w-full">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-xl shadow-lg">
              ⚡
            </div>
            <div>
              <h3 className="font-heading font-black text-lg sm:text-xl text-white tracking-wide">
                PİT SERVİS ALANI
              </h3>
              <p className="text-xs text-amber-300 font-medium">
                Parçaları ve depoyu tazelemek için kısayollara bas!
              </p>
            </div>
          </div>

          {/* 3 Interactive Pit Services */}
          <div className="grid grid-cols-3 gap-3 w-full">
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

      {/* BOTTOM SECTION: TELEMETRY SKELETON (Sol Altta) & SPEEDOMETER */}
      <div className="flex items-end justify-between w-full">
        {/* SOL ALT: ARABANIN İSKELETİ & TELEMETRİSİ */}
        <div className="p-3.5 rounded-3xl bg-slate-950/90 border-2 border-slate-700/80 backdrop-blur-md shadow-2xl flex items-center gap-4 pointer-events-auto">
          {/* Top-down Car Wireframe Telemetry */}
          <div className="relative w-28 h-40 flex items-center justify-center">
            {/* Chassis Outline Blueprint */}
            <div className="absolute inset-x-5 inset-y-4 rounded-3xl border-2 border-slate-600/80 bg-slate-900/60 flex flex-col justify-between items-center p-1.5 shadow-inner">
              {/* Front Wing Status */}
              <div
                className="w-full h-2 rounded-t-lg transition-colors"
                style={{ backgroundColor: damage.front > 50 ? '#10b981' : (damage.front > 20 ? '#f59e0b' : '#ef4444') }}
                title={`Ön Tampon: %${damage.front}`}
              />
              {/* Engine Block */}
              <div className="flex flex-col items-center">
                <Wrench className="w-3.5 h-3.5 text-slate-400 mb-0.5" />
                <span className="text-[9px] font-mono font-black text-slate-300">
                  {damage.engine}%
                </span>
              </div>
              {/* Rear Wing Status */}
              <div
                className="w-full h-2 rounded-b-lg transition-colors"
                style={{ backgroundColor: damage.rear > 50 ? '#10b981' : (damage.rear > 20 ? '#f59e0b' : '#ef4444') }}
                title={`Arka Spoyler: %${damage.rear}`}
              />
            </div>

            {/* 4 Tires on 4 Corners */}
            {/* Front-Left (FL) */}
            <div
              className="absolute top-2 left-0 w-4 h-7 rounded-md border-2 border-slate-900 transition-colors shadow-md flex items-center justify-center"
              style={{ backgroundColor: getTireColor(tires.fl) }}
              title={`Ön Sol Lastik: %${tires.fl}`}
            >
              <span className="text-[7px] font-mono font-black text-slate-950">FL</span>
            </div>

            {/* Front-Right (FR) */}
            <div
              className="absolute top-2 right-0 w-4 h-7 rounded-md border-2 border-slate-900 transition-colors shadow-md flex items-center justify-center"
              style={{ backgroundColor: getTireColor(tires.fr) }}
              title={`Ön Sağ Lastik: %${tires.fr}`}
            >
              <span className="text-[7px] font-mono font-black text-slate-950">FR</span>
            </div>

            {/* Rear-Left (RL) */}
            <div
              className="absolute bottom-2 left-0 w-4 h-7 rounded-md border-2 border-slate-900 transition-colors shadow-md flex items-center justify-center"
              style={{ backgroundColor: getTireColor(tires.rl) }}
              title={`Arka Sol Lastik: %${tires.rl}`}
            >
              <span className="text-[7px] font-mono font-black text-slate-950">RL</span>
            </div>

            {/* Rear-Right (RR) */}
            <div
              className="absolute bottom-2 right-0 w-4 h-7 rounded-md border-2 border-slate-900 transition-colors shadow-md flex items-center justify-center"
              style={{ backgroundColor: getTireColor(tires.rr) }}
              title={`Arka Sağ Lastik: %${tires.rr}`}
            >
              <span className="text-[7px] font-mono font-black text-slate-950">RR</span>
            </div>
          </div>

          {/* Telemetry Stats & Health Bars */}
          <div className="flex flex-col gap-2 w-32 sm:w-36 text-left">
            {/* Nitro Fluid Pressure Tube */}
            <div>
              <div className="flex justify-between items-center text-[10px] font-bold text-sky-400 mb-1">
                <span className="flex items-center gap-1">
                  <Flame className="w-3 h-3 text-sky-400 fill-sky-400" />
                  NİTRO (NOS)
                </span>
                <span className="font-mono font-black text-white">{Math.round(nitro)}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden border border-sky-500/40">
                <div
                  className={`h-full bg-gradient-to-r from-sky-500 to-cyan-300 transition-all ${
                    myPlayer.isNitroActive ? 'animate-pulse' : ''
                  }`}
                  style={{ width: `${nitro}%` }}
                />
              </div>
            </div>

            {/* Average Tire Condition */}
            <div>
              <div className="flex justify-between items-center text-[10px] font-bold text-amber-400 mb-1">
                <span className="flex items-center gap-1">
                  <Disc className="w-3 h-3 text-amber-400" />
                  LASTİK SAĞLIĞI
                </span>
                <span className="font-mono font-black text-white">
                  {Math.round((tires.fl + tires.fr + tires.rl + tires.rr) / 4)}%
                </span>
              </div>
              <div className="grid grid-cols-4 gap-1 text-[8px] font-mono text-center font-bold">
                <span style={{ color: getTireColor(tires.fl) }}>%{tires.fl}</span>
                <span style={{ color: getTireColor(tires.fr) }}>%{tires.fr}</span>
                <span style={{ color: getTireColor(tires.rl) }}>%{tires.rl}</span>
                <span style={{ color: getTireColor(tires.rr) }}>%{tires.rr}</span>
              </div>
            </div>

            {/* Chassis Damage Condition */}
            <div>
              <div className="flex justify-between items-center text-[10px] font-bold text-emerald-400 mb-1">
                <span className="flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3 text-emerald-400" />
                  KAPORTA / GÖVDE
                </span>
                <span className="font-mono font-black text-white">
                  {Math.round((damage.front + damage.engine + damage.rear) / 3)}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 transition-all"
                  style={{ width: `${(damage.front + damage.engine + damage.rear) / 3}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM RIGHT: SPEEDOMETER, TACHOMETER & DRIFT INDICATOR */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          {/* Active Drift Flame Multiplier */}
          {myPlayer.isDrifting && (
            <div className="px-4 py-1.5 rounded-2xl bg-amber-500 text-slate-950 font-heading font-black text-xs tracking-wider shadow-xl shadow-amber-500/40 animate-pulse flex items-center gap-1.5">
              <span>🔥</span>
              <span>DRIFT! YANLIYOR</span>
            </div>
          )}

          {/* Digital Speedometer & Gear */}
          <div className="px-5 py-3 rounded-3xl bg-slate-950/90 border-2 border-slate-700/80 backdrop-blur-md shadow-2xl flex items-baseline gap-3">
            {/* Gear Badge */}
            <div className="w-10 h-10 rounded-2xl bg-slate-800 border border-slate-600 flex items-center justify-center font-heading font-black text-xl text-amber-400 shadow-inner">
              {getGear(speed)}
            </div>

            {/* Speed Number */}
            <div className="flex flex-col items-end">
              <div className="font-heading font-black text-3xl sm:text-4xl text-white font-mono leading-none tracking-tight">
                {speed}
              </div>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider">KM / S</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
