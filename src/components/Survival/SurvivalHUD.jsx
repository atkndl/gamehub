import React from 'react';
import { Heart, Shield, Zap, Crosshair, ArrowLeft, RotateCcw, Package } from 'lucide-react';
import { SCOPES } from '../../../server/survivalLogic';

export default function SurvivalHUD({
  state,
  myPlayer,
  onSwitchSlot,
  onReload,
  onUseHeal,
  onPickup,
  onLeave,
  killfeed = []
}) {
  if (!myPlayer) return null;

  const activeWeapon = myPlayer.weapons[myPlayer.activeSlot];
  const hpPct = Math.max(0, Math.min(100, (myPlayer.hp / myPlayer.maxHp) * 100));
  const vestPct = Math.max(0, Math.min(100, myPlayer.vest));
  const boostPct = Math.max(0, Math.min(100, myPlayer.boost));

  const isAlive = myPlayer.isAlive;
  const aliveCount = state?.players?.filter(p => p.isAlive)?.length || 0;
  const totalCount = state?.players?.length || 1;

  // Format time remaining for deathmatch
  const formatTime = (secs) => {
    if (secs == null) return '';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-5 select-none font-sans z-20">
      {/* TOP BAR */}
      <div className="flex items-start justify-between w-full">
        {/* Top Left: Exit & Match Info */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onLeave}
            className="pointer-events-auto p-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-white backdrop-blur-md shadow-lg transition active:scale-95 cursor-pointer flex items-center gap-2 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Lobiye Dön</span>
          </button>

          {/* Mode Badge */}
          <div className="px-3.5 py-2 rounded-2xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-md text-xs font-bold text-slate-200 flex items-center gap-2 shadow-lg">
            {state?.mode === 'battle_royale' ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>ALAN MODU</span>
                <span className="text-slate-400">•</span>
                <span className="text-emerald-400 font-black">{aliveCount} / {totalCount} Hayatta</span>
              </>
            ) : (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span>MAÇ MODU</span>
                <span className="text-slate-400">•</span>
                <span className="text-amber-400 font-mono font-black text-sm">{formatTime(state?.timeLeft)}</span>
                <span className="text-slate-400">•</span>
                <span className="text-white font-black">{myPlayer.kills} Leş</span>
              </>
            )}
          </div>
        </div>

        {/* Top Right: Killfeed Notifications */}
        <div className="flex flex-col items-end gap-1.5 max-w-xs overflow-hidden">
          {killfeed.slice(-4).map((k, idx) => (
            <div
              key={idx}
              className="px-3 py-1 rounded-xl bg-slate-900/85 border border-slate-700/70 text-[11px] font-bold text-slate-200 backdrop-blur-xs shadow-md animate-fade-in flex items-center gap-1.5"
            >
              <span className="text-red-400">{k.killerName || 'Biri'}</span>
              <span className="text-slate-400 text-[10px]">avladı</span>
              <span className="text-amber-400">{k.victimName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CENTER DEATH NOTIFICATION (If dead in deathmatch or spectator) */}
      {!isAlive && (
        <div className="self-center px-6 py-3 rounded-2xl bg-red-950/90 border border-red-500/60 backdrop-blur-md text-center shadow-2xl animate-bounce-subtle">
          <span className="text-red-400 font-heading font-black text-lg block">
            ELENDİN!
          </span>
          <span className="text-xs text-slate-300 font-medium">
            {state?.mode === 'deathmatch' ? '3 saniye içinde yeniden doğuyorsun...' : 'İzleyici modundasın. Sona kalanı izle!'}
          </span>
        </div>
      )}

      {/* BOTTOM CONTROL & STATUS BAR */}
      <div className="flex items-end justify-between w-full gap-4">
        {/* Bottom Left: Vitals (HP, Armor, Boost & Scope) */}
        <div className="flex flex-col gap-2 pointer-events-auto">
          {/* Scope Badge */}
          <div className="self-start flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/85 border border-indigo-500/40 text-xs font-bold text-indigo-300 backdrop-blur-md shadow-md">
            <Crosshair className="w-3.5 h-3.5 text-indigo-400" />
            <span>{SCOPES[myPlayer.scope]?.name || '1x Görüş'}</span>
            <span className="text-[10px] text-indigo-400/80 font-normal ml-0.5">
              ({myPlayer.scope === '8x' ? 'Maksimum Geniş Görüş' : myPlayer.scope === '4x' ? 'Geniş Görüş' : myPlayer.scope === '2x' ? 'Orta Görüş' : 'Standart'})
            </span>
          </div>

          <div className="w-64 sm:w-72 p-3 rounded-2xl bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-2xl flex flex-col gap-2">
            {/* Health Bar */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="flex items-center gap-1 text-red-400">
                  <Heart className="w-3.5 h-3.5 fill-red-400" />
                  SAĞLIK
                </span>
                <span className="text-white font-mono">{Math.round(myPlayer.hp)} / 100</span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden border border-slate-700/80">
                <div
                  className={`h-full transition-all duration-150 rounded-full ${
                    hpPct > 50 ? 'bg-emerald-500' : hpPct > 25 ? 'bg-amber-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${hpPct}%` }}
                />
              </div>
            </div>

            {/* Armor / Vest Bar */}
            {myPlayer.vestLevel > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-bold">
                  <span className="flex items-center gap-1 text-sky-400">
                    <Shield className="w-3 h-3" />
                    YELEK (Seviye {myPlayer.vestLevel})
                  </span>
                  <span className="text-sky-300 font-mono">{Math.round(myPlayer.vest)} P</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-sky-400 transition-all duration-150 rounded-full"
                    style={{ width: `${vestPct}%` }}
                  />
                </div>
              </div>
            )}

            {/* Adrenaline / Boost Bar */}
            <div className="space-y-0.5">
              <div className="flex justify-between items-center text-[10px] font-bold">
                <span className="flex items-center gap-1 text-amber-400">
                  <Zap className="w-3 h-3 fill-amber-400" />
                  ADRENALİN (Hız & İyileşme)
                </span>
                <span className="text-amber-300 font-mono">{Math.round(myPlayer.boost)}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all duration-150 rounded-full"
                  style={{ width: `${boostPct}%` }}
                />
              </div>
            </div>

            {/* Quick Heals Pill */}
            <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between gap-1 text-[11px] font-bold">
              <button
                type="button"
                onClick={() => onUseHeal('bandage')}
                className="flex-1 py-1 px-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 flex items-center justify-center gap-1 transition cursor-pointer"
                title="Sargı Bezi [7]"
              >
                <span>🩹</span>
                <span>{myPlayer.heals?.bandage || 0}</span>
              </button>
              <button
                type="button"
                onClick={() => onUseHeal('medkit')}
                className="flex-1 py-1 px-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 flex items-center justify-center gap-1 transition cursor-pointer"
                title="İlk Yardım Çantası [8]"
              >
                <span>🧰</span>
                <span>{myPlayer.heals?.medkit || 0}</span>
              </button>
              <button
                type="button"
                onClick={() => onUseHeal('soda')}
                className="flex-1 py-1 px-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-300 flex items-center justify-center gap-1 transition cursor-pointer"
                title="Enerji İçeceği [9]"
              >
                <span>🥤</span>
                <span>{myPlayer.heals?.soda || 0}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Center: Keyboard Controls Ribbon (Desktop) */}
        <div className="hidden lg:flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-slate-900/80 border border-slate-700/80 backdrop-blur-md text-[11px] font-bold text-slate-300 shadow-xl pointer-events-auto">
          <span><span className="font-mono text-amber-400 font-black">W, A, S, D</span> Hareket</span>
          <span className="text-slate-600">•</span>
          <span><span className="font-mono text-sky-400 font-black">Mouse</span> Nişan & Ateş</span>
          <span className="text-slate-600">•</span>
          <span><span className="font-mono text-emerald-400 font-black">1, 2, 3</span> Silah</span>
          <span className="text-slate-600">•</span>
          <span><span className="font-mono text-purple-400 font-black">R</span> Şarjör</span>
          <span className="text-slate-600">•</span>
          <span><span className="font-mono text-yellow-400 font-black">F / E</span> Al</span>
          <span className="text-slate-600">•</span>
          <span><span className="font-mono text-red-400 font-black">7, 8, 9</span> İyileş</span>
        </div>

        {/* Bottom Right: Weapons & Ammo Arsenal */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          {/* Pickup Hint button */}
          <button
            type="button"
            onClick={onPickup}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/85 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-amber-300 backdrop-blur-md shadow-md transition active:scale-95 cursor-pointer"
          >
            <Package className="w-3.5 h-3.5" />
            <span>[F] Yerden Al</span>
          </button>

          {/* Weapon Slots Row */}
          <div className="flex items-center gap-2">
            {/* Slot 1: Primary */}
            <button
              type="button"
              onClick={() => onSwitchSlot('primary')}
              className={`p-2.5 sm:p-3 rounded-2xl border backdrop-blur-md transition cursor-pointer text-left min-w-[90px] sm:min-w-[110px] ${
                myPlayer.activeSlot === 'primary'
                  ? 'bg-blue-600/30 border-blue-500 shadow-lg shadow-blue-500/20'
                  : 'bg-slate-900/80 border-slate-700/80 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-0.5">
                <span>[1] BİRİNCİL</span>
                <span>{myPlayer.weapons?.primary?.icon || '🔫'}</span>
              </div>
              <div className="font-heading font-black text-xs sm:text-sm text-white truncate">
                {myPlayer.weapons?.primary?.name || 'Boş'}
              </div>
              {myPlayer.weapons?.primary && !myPlayer.weapons.primary.isMelee && (
                <div className="text-[11px] font-mono font-bold text-blue-400 mt-0.5">
                  {myPlayer.weapons.primary.ammo} / {myPlayer.ammo?.[myPlayer.weapons.primary.ammoType] || 0}
                </div>
              )}
            </button>

            {/* Slot 2: Secondary */}
            <button
              type="button"
              onClick={() => onSwitchSlot('secondary')}
              className={`p-2.5 sm:p-3 rounded-2xl border backdrop-blur-md transition cursor-pointer text-left min-w-[90px] sm:min-w-[120px] ${
                myPlayer.activeSlot === 'secondary'
                  ? 'bg-blue-600/30 border-blue-500 shadow-lg shadow-blue-500/20'
                  : 'bg-slate-900/80 border-slate-700/80 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-0.5">
                <span>[2] İKİNCİL</span>
                <span>{myPlayer.weapons?.secondary?.icon || '—'}</span>
              </div>
              <div className="font-heading font-black text-xs sm:text-sm text-white truncate">
                {myPlayer.weapons?.secondary?.name || (
                  <span className="text-slate-400 font-normal text-[11px]">Boş (Loot bul)</span>
                )}
              </div>
              {myPlayer.weapons?.secondary && !myPlayer.weapons.secondary.isMelee && (
                <div className="text-[11px] font-mono font-bold text-blue-400 mt-0.5">
                  {myPlayer.weapons.secondary.ammo} / {myPlayer.ammo?.[myPlayer.weapons.secondary.ammoType] || 0}
                </div>
              )}
            </button>

            {/* Slot 3: Melee / Fists */}
            <button
              type="button"
              onClick={() => onSwitchSlot('melee')}
              className={`p-2.5 sm:p-3 rounded-2xl border backdrop-blur-md transition cursor-pointer text-left min-w-[70px] ${
                myPlayer.activeSlot === 'melee'
                  ? 'bg-amber-600/30 border-amber-500 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900/80 border-slate-700/80 hover:border-slate-600'
              }`}
            >
              <div className="text-[10px] font-bold text-slate-400 mb-0.5">
                [3] YUMRUK
              </div>
              <div className="font-heading font-black text-xs sm:text-sm text-white flex items-center gap-1">
                <span>👊</span>
              </div>
            </button>

            {/* Reload Button */}
            {activeWeapon && !activeWeapon.isMelee && (
              <button
                type="button"
                onClick={onReload}
                className="p-3 rounded-2xl bg-slate-900/90 border border-slate-700 hover:bg-slate-800 text-white font-bold text-xs shadow-lg transition active:scale-95 cursor-pointer flex flex-col items-center justify-center"
                title="Şarjör Değiştir [R]"
              >
                <RotateCcw className={`w-4 h-4 ${activeWeapon.isReloading ? 'animate-spin text-amber-400' : ''}`} />
                <span className="text-[9px] text-slate-400 mt-0.5">R</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
