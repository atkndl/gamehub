import React, { useState, useEffect, useRef } from 'react';
import { Heart, Shield, Zap, Crosshair, ArrowLeft, RotateCcw, Package, AlertTriangle, Radio } from 'lucide-react';
import { SCOPES, HELMETS, ARMORS } from '../../../server/survivalLogic';

const AMMO_CONFIG = {
  '9mm': { label: '9mm', short: '9mm', color: '#fbbf24', icon: '🟡' },
  '12g': { label: '12G Pompalı', short: '12 Gauge', color: '#f97316', icon: '🟠' },
  '762': { label: '7.62mm', short: '7.62mm', color: '#ef4444', icon: '🔴' },
  '556': { label: '5.56mm', short: '5.56mm', color: '#3b82f6', icon: '🔵' }
};

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
  const [pickupAlert, setPickupAlert] = useState(null);
  const prevInventoryRef = useRef(null);

  // Monitor inventory changes to display transient pickup alerts
  useEffect(() => {
    if (!myPlayer) return;

    if (prevInventoryRef.current) {
      const prev = prevInventoryRef.current;
      const curHeals = myPlayer.heals || {};
      const prevHeals = prev.heals || {};

      if ((curHeals.medkit || 0) > (prevHeals.medkit || 0)) {
        setPickupAlert('+1 🧰 İlk Yardım Çantası Alındı [Tuş: 5]');
      } else if ((curHeals.soda || 0) > (prevHeals.soda || 0)) {
        setPickupAlert('+1 🥤 Enerji İçeceği Alındı [Tuş: 6]');
      } else if ((curHeals.bandage || 0) > (prevHeals.bandage || 0)) {
        setPickupAlert('+1 🩹 Sargı Bezi Alındı [Tuş: 4]');
      } else if (myPlayer.weapons?.primary?.name !== prev.weapons?.primary?.name) {
        setPickupAlert(`+1 ${myPlayer.weapons?.primary?.icon || '🔫'} ${myPlayer.weapons?.primary?.name} Kuşanıldı!`);
      } else if (myPlayer.weapons?.secondary?.name !== prev.weapons?.secondary?.name && myPlayer.weapons?.secondary) {
        setPickupAlert(`+1 ${myPlayer.weapons?.secondary?.icon || '🔫'} ${myPlayer.weapons?.secondary?.name} Kuşanıldı!`);
      }
    }

    prevInventoryRef.current = {
      heals: { ...myPlayer.heals },
      weapons: { ...myPlayer.weapons }
    };
  }, [myPlayer]);

  useEffect(() => {
    if (pickupAlert) {
      const timer = setTimeout(() => setPickupAlert(null), 2400);
      return () => clearTimeout(timer);
    }
  }, [pickupAlert]);

  if (!myPlayer) return null;

  const activeWeapon = myPlayer.weapons[myPlayer.activeSlot];
  const hpPct = Math.max(0, Math.min(100, (myPlayer.hp / myPlayer.maxHp) * 100));
  const vestPct = Math.max(0, Math.min(100, myPlayer.vest));
  const boostPct = Math.max(0, Math.min(100, myPlayer.boost));

  const isAlive = myPlayer.isAlive;
  const aliveCount = state?.players?.filter(p => p.isAlive)?.length || 0;
  const totalCount = state?.players?.length || 1;

  // Format time (m:ss)
  const formatTime = (secs) => {
    if (secs == null) return '';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Safe zone status
  const z = state?.zone;
  const isOutsideZone = Boolean(
    state?.mode === 'battle_royale' &&
    z &&
    Math.hypot(myPlayer.x - z.x, myPlayer.y - z.y) > z.currentRadius
  );
  const isZoneShrinking = Boolean(z?.isShrinking);
  const zoneTimeUntilNext = z?.timeUntilNext || 0;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3 sm:p-5 select-none font-sans z-20">
      {/* TOP BAR */}
      <div className="flex items-start justify-between w-full">
        {/* Top Left: Exit & Match Info */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            type="button"
            onClick={onLeave}
            className="p-2.5 rounded-2xl bg-slate-900/85 hover:bg-slate-800 border border-slate-700/80 text-white backdrop-blur-md shadow-lg transition active:scale-95 cursor-pointer flex items-center gap-2 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Lobiye Dön</span>
          </button>

          {/* Mode Badge */}
          <div className="px-3.5 py-2 rounded-2xl bg-slate-900/85 border border-slate-700/80 backdrop-blur-md text-xs font-bold text-slate-200 flex items-center gap-2 shadow-lg">
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

        {/* TOP CENTER: Safe Zone Countdown & Danger Alerts */}
        {state?.mode === 'battle_royale' && z && (
          <div className="flex flex-col items-center gap-1">
            {isOutsideZone ? (
              <div className="px-5 py-2 rounded-2xl bg-red-600/95 border-2 border-red-400 text-white font-black text-xs sm:text-sm tracking-wide shadow-2xl shadow-red-600/50 flex items-center gap-2 animate-bounce-subtle">
                <AlertTriangle className="w-4 h-4 text-white animate-pulse" />
                <span>🚨 GAZ ALANINDASINIZ! GÜVENLİ BÖLGEYE KOŞUN!</span>
              </div>
            ) : isZoneShrinking ? (
              <div className="px-5 py-2 rounded-2xl bg-amber-500/95 border-2 border-amber-300 text-slate-950 font-black text-xs sm:text-sm tracking-wide shadow-2xl shadow-amber-500/40 flex items-center gap-2 animate-pulse">
                <AlertTriangle className="w-4 h-4 text-slate-950 fill-current" />
                <span>⚠️ TEHLİKE: ALAN DARALIYOR! ({zoneTimeUntilNext}s)</span>
              </div>
            ) : (
              <div className="px-4 py-1.5 rounded-2xl bg-slate-900/85 border border-slate-700/80 backdrop-blur-md shadow-lg flex items-center gap-2 text-xs font-bold text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ALAN DARALMASINA:</span>
                <span className="font-mono text-emerald-400 font-black text-sm">{formatTime(zoneTimeUntilNext)}</span>
              </div>
            )}
          </div>
        )}

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

      {/* HEALING PROGRESS CHANNEL NOTIFICATION */}
      {isAlive && myPlayer.healingItem && (
        <div className="self-center px-6 py-3.5 rounded-2xl bg-emerald-950/95 border-2 border-emerald-500/80 backdrop-blur-md text-center shadow-2xl animate-fade-in pointer-events-none">
          <div className="flex items-center justify-center gap-2 text-emerald-400 font-heading font-black text-sm mb-1.5">
            <span className="text-lg">
              {myPlayer.healingItem === 'bandage' ? '🩹' : myPlayer.healingItem === 'medkit' ? '🧰' : '🥤'}
            </span>
            <span>
              {myPlayer.healingItem === 'bandage'
                ? 'Sargı Bezi Sarılıyor...'
                : myPlayer.healingItem === 'medkit'
                ? 'İlk Yardım Çantası Kullanılıyor...'
                : 'Enerji İçeceği İçiliyor...'}
            </span>
          </div>
          <div className="w-56 h-2.5 rounded-full bg-slate-900 border border-emerald-500/40 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 animate-pulse rounded-full w-full" />
          </div>
        </div>
      )}

      {/* RECENT LOOT PICKUP TOAST NOTIFICATION */}
      {pickupAlert && (
        <div className="self-center mb-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-amber-400/80 text-amber-300 font-bold text-xs backdrop-blur-md shadow-xl animate-bounce-subtle pointer-events-none flex items-center gap-2">
          <Package className="w-4 h-4 text-amber-400" />
          <span>{pickupAlert}</span>
        </div>
      )}

      {/* BOTTOM CONTROL & STATUS BAR */}
      <div className="flex items-end justify-between w-full gap-4">
        {/* Bottom Left: Vitals (HP, Armor, Boost & Equipment) */}
        <div className="flex flex-col gap-2 pointer-events-auto">
          {/* Status Badges Stack (Scope, Helmet, Vest, Wet - Stacking Vertically) */}
          <div className="flex flex-col gap-1.5 w-60 sm:w-68">
            {/* Scope Badge (Equipped or Soft Empty) */}
            {myPlayer.scope && myPlayer.scope !== '1x' ? (
              <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-indigo-950/90 border border-indigo-500/50 text-xs font-bold text-indigo-300 backdrop-blur-md shadow-md">
                <div className="flex items-center gap-1.5">
                  <Crosshair className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Dürbün:</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-indigo-900/90 text-white font-mono font-bold text-[10px] border border-indigo-400/40">
                  {SCOPES[myPlayer.scope]?.name || myPlayer.scope}
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-700/50 text-xs font-medium text-slate-500 backdrop-blur-xs">
                <div className="flex items-center gap-1.5 opacity-60">
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>Dürbün:</span>
                </div>
                <span className="italic text-[10px] text-slate-500">Boş (1x Standart)</span>
              </div>
            )}

            {/* Helmet Badge (Equipped or Soft Empty) */}
            {myPlayer.helmetLevel > 0 && HELMETS[myPlayer.helmetLevel] ? (
              <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-emerald-950/90 border border-emerald-500/50 text-xs font-bold text-emerald-300 backdrop-blur-md shadow-md">
                <div className="flex items-center gap-1.5">
                  <span>{HELMETS[myPlayer.helmetLevel].icon || '🪖'}</span>
                  <span>{HELMETS[myPlayer.helmetLevel].name}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-emerald-900/90 text-white font-mono font-black text-[10px] border border-emerald-400/40">
                  +{HELMETS[myPlayer.helmetLevel].bonusHp} Max HP
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-700/50 text-xs font-medium text-slate-500 backdrop-blur-xs">
                <div className="flex items-center gap-1.5 opacity-60">
                  <span>🪖</span>
                  <span>Kask:</span>
                </div>
                <span className="italic text-[10px] text-slate-500">Boş (0 HP)</span>
              </div>
            )}

            {/* Vest Badge (Equipped or Soft Empty) */}
            {myPlayer.vestLevel > 0 && ARMORS[myPlayer.vestLevel] ? (
              <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-sky-950/90 border border-sky-500/50 text-xs font-bold text-sky-300 backdrop-blur-md shadow-md">
                <div className="flex items-center gap-1.5">
                  <span>{ARMORS[myPlayer.vestLevel].icon || '🦺'}</span>
                  <span>{ARMORS[myPlayer.vestLevel].name}</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-sky-900/90 text-white font-mono font-black text-[10px] border border-sky-400/40">
                  +{ARMORS[myPlayer.vestLevel].maxVest} Zırh
                </span>
              </div>
            ) : (
              <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-700/50 text-xs font-medium text-slate-500 backdrop-blur-xs">
                <div className="flex items-center gap-1.5 opacity-60">
                  <span>🦺</span>
                  <span>Yelek:</span>
                </div>
                <span className="italic text-[10px] text-slate-500">Boş (0 Zırh)</span>
              </div>
            )}

            {/* Wet Status Badge */}
            {myPlayer.isWet && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-950/90 border border-sky-400/60 text-xs font-bold text-sky-300 backdrop-blur-md shadow-md animate-pulse">
                <span>💧</span>
                <span>{myPlayer.inWater ? 'Suda Yüzüyor' : 'Islandın (Yavaşlama)'}</span>
              </div>
            )}
          </div>

          <div className={`w-64 sm:w-72 p-3.5 rounded-3xl backdrop-blur-md shadow-2xl flex flex-col gap-2.5 transition-all ${
            myPlayer.hp <= 45
              ? 'bg-red-950/95 border-2 border-red-500 shadow-red-500/40 ring-4 ring-red-500/20 animate-pulse'
              : 'bg-slate-900/90 border border-slate-700/80'
          }`}>
            {/* Health Bar (Total HP with Helmet Bonus) */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="flex items-center gap-1 text-red-400">
                  <Heart className="w-3.5 h-3.5 fill-red-400" />
                  SAĞLIK
                  {myPlayer.helmetLevel > 0 && HELMETS[myPlayer.helmetLevel] && (
                    <span className="text-[10px] text-emerald-400 font-mono font-black ml-1 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-500/40">
                      (+{HELMETS[myPlayer.helmetLevel].bonusHp} Kask)
                    </span>
                  )}
                </span>
                <span className="text-white font-mono font-black">
                  {Math.round(myPlayer.hp)} / {Math.round(myPlayer.maxHp || 100)} HP
                </span>
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
                  <span className="text-sky-300 font-mono font-bold">{Math.round(myPlayer.vest)} P</span>
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
                <span className="text-amber-300 font-mono font-bold">{Math.round(myPlayer.boost)}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-amber-400 transition-all duration-150 rounded-full"
                  style={{ width: `${boostPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM CENTER: Dedicated Inventory Hotbar (Heals & Boosts) */}
        <div className="flex flex-col items-center gap-1.5 pointer-events-auto">
          {/* LOW HP CRITICAL ALERT BANNER - Haritayı engellemeden direkt iyileşme envanterinin üzerinde! */}
          {isAlive && myPlayer.hp <= 45 && !myPlayer.healingItem && (
            <div className="mb-1 px-4 py-2.5 rounded-2xl bg-red-950/95 border-2 border-red-500 text-white backdrop-blur-md shadow-2xl shadow-red-500/40 flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-red-600/90 flex items-center justify-center text-white shrink-0 shadow-lg shadow-red-500/50">
                <Heart className="w-4 h-4 text-white fill-white animate-ping" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-red-300 font-heading font-black text-xs tracking-wide flex items-center gap-1.5">
                  <span>⚠️ KRİTİK SAĞLIK!</span>
                  <span className="text-white font-mono bg-red-800/80 px-1.5 py-0.5 rounded text-[10px]">
                    {Math.round(myPlayer.hp)} / {Math.round(myPlayer.maxHp || 100)} HP
                  </span>
                </span>
                <div className="text-[11px] text-amber-200 font-bold mt-0.5 flex items-center gap-2 flex-wrap">
                  {(myPlayer.heals?.medkit || 0) > 0 ? (
                    <button
                      type="button"
                      onClick={() => onUseHeal('medkit')}
                      className="px-2 py-0.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-black text-[10px] shadow transition active:scale-95 cursor-pointer flex items-center gap-1"
                    >
                      <span>🧰 [5] İlk Yardım Bas</span>
                    </button>
                  ) : null}
                  {(myPlayer.heals?.bandage || 0) > 0 ? (
                    <button
                      type="button"
                      onClick={() => onUseHeal('bandage')}
                      className="px-2 py-0.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-black text-[10px] shadow transition active:scale-95 cursor-pointer flex items-center gap-1"
                    >
                      <span>🩹 [4] Sargı Bezi Sar</span>
                    </button>
                  ) : null}
                  {(myPlayer.heals?.soda || 0) > 0 ? (
                    <button
                      type="button"
                      onClick={() => onUseHeal('soda')}
                      className="px-2 py-0.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-black text-[10px] shadow transition active:scale-95 cursor-pointer flex items-center gap-1"
                    >
                      <span>🥤 [6] Enerji</span>
                    </button>
                  ) : null}
                  {!(myPlayer.heals?.medkit > 0 || myPlayer.heals?.bandage > 0 || myPlayer.heals?.soda > 0) && (
                    <span className="text-red-300 font-medium text-[10px]">Can eşyası yok, kutu kır veya ganimet bul!</span>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
            <Package className="w-3 h-3 text-emerald-400" />
            <span>İlk Yardım & İyileşme Envanteri</span>
          </div>

          <div className={`flex items-center gap-2 p-1.5 rounded-2xl backdrop-blur-md shadow-2xl transition-all ${
            myPlayer.hp <= 45 && ((myPlayer.heals?.medkit || 0) > 0 || (myPlayer.heals?.bandage || 0) > 0)
              ? 'bg-slate-900/95 border-2 border-emerald-400 shadow-emerald-500/30 ring-2 ring-emerald-400/40 animate-pulse'
              : 'bg-slate-900/90 border border-slate-700/80'
          }`}>
            {/* Bandage Slot */}
            <button
              type="button"
              onClick={() => onUseHeal('bandage')}
              className={`px-3 py-2 rounded-xl flex items-center gap-2 border transition-all cursor-pointer ${
                (myPlayer.heals?.bandage || 0) > 0
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200 hover:bg-emerald-900/80 shadow-md shadow-emerald-500/20 active:scale-95'
                  : 'bg-slate-800/50 border-slate-700/60 text-slate-500 opacity-60'
              }`}
              title="Sargı Bezi [Tuş: 4]"
            >
              <span className="text-lg">🩹</span>
              <div className="flex flex-col text-left">
                <div className="text-[10px] font-bold leading-none">Sargı Bezi</div>
                <div className="text-xs font-mono font-black text-white">x{myPlayer.heals?.bandage || 0}</div>
              </div>
              <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono font-bold text-amber-400 border border-slate-700">
                [4]
              </span>
            </button>

            {/* Medkit Slot */}
            <button
              type="button"
              onClick={() => onUseHeal('medkit')}
              className={`px-3 py-2 rounded-xl flex items-center gap-2 border transition-all cursor-pointer ${
                (myPlayer.heals?.medkit || 0) > 0
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200 hover:bg-emerald-900/80 shadow-md shadow-emerald-500/20 active:scale-95'
                  : 'bg-slate-800/50 border-slate-700/60 text-slate-500 opacity-60'
              }`}
              title="İlk Yardım Çantası [Tuş: 5]"
            >
              <span className="text-lg">🧰</span>
              <div className="flex flex-col text-left">
                <div className="text-[10px] font-bold leading-none">İlk Yardım</div>
                <div className="text-xs font-mono font-black text-white">x{myPlayer.heals?.medkit || 0}</div>
              </div>
              <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono font-bold text-amber-400 border border-slate-700">
                [5]
              </span>
            </button>

            {/* Soda / Energy Drink Slot */}
            <button
              type="button"
              onClick={() => onUseHeal('soda')}
              className={`px-3 py-2 rounded-xl flex items-center gap-2 border transition-all cursor-pointer ${
                (myPlayer.heals?.soda || 0) > 0
                  ? 'bg-emerald-950/80 border-emerald-500/60 text-emerald-200 hover:bg-emerald-900/80 shadow-md shadow-emerald-500/20 active:scale-95'
                  : 'bg-slate-800/50 border-slate-700/60 text-slate-500 opacity-60'
              }`}
              title="Enerji İçeceği [Tuş: 6]"
            >
              <span className="text-lg">🥤</span>
              <div className="flex flex-col text-left">
                <div className="text-[10px] font-bold leading-none">Enerji</div>
                <div className="text-xs font-mono font-black text-white">x{myPlayer.heals?.soda || 0}</div>
              </div>
              <span className="px-1.5 py-0.5 rounded-md bg-slate-800 text-[10px] font-mono font-bold text-amber-400 border border-slate-700">
                [6]
              </span>
            </button>
          </div>
        </div>

        {/* BOTTOM RIGHT: High Visibility Weapons Arsenal & Ammo */}
        <div className="flex flex-col items-end gap-2 pointer-events-auto">
          {/* Pickup Hint button - Yanındaki ganimeti ve tuşları gösterir */}
          {(() => {
            const nearby = state?.loot?.find(item => Math.hypot(myPlayer.x - item.x, myPlayer.y - item.y) <= 80);
            return (
              <button
                type="button"
                onClick={onPickup}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-bold backdrop-blur-md shadow-lg transition active:scale-95 cursor-pointer ${
                  nearby
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 ring-2 ring-amber-400/40 animate-pulse'
                    : 'bg-slate-900/85 hover:bg-slate-800 border-slate-700/80 text-slate-300'
                }`}
              >
                <Package className={`w-4 h-4 ${nearby ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>
                  {nearby ? (
                    <>
                      <span className="font-mono font-black text-white mr-1">[F / E]</span>
                      <span>Al: {nearby.name || nearby.itemKey || nearby.type}</span>
                    </>
                  ) : (
                    <span>[F / E] Yerden Al</span>
                  )}
                </span>
              </button>
            );
          })()}

          {/* Large Active Weapon & Ammo Arsenal Box */}
          <div className="flex items-center gap-2">
            {/* Slot 1: Primary Weapon */}
            <button
              type="button"
              onClick={() => onSwitchSlot('primary')}
              className={`p-3 rounded-2xl border backdrop-blur-md transition cursor-pointer text-left min-w-[145px] sm:min-w-[165px] relative overflow-hidden ${
                myPlayer.activeSlot === 'primary'
                  ? 'bg-slate-900/95 border-2 border-amber-400 shadow-xl shadow-amber-500/20 ring-2 ring-amber-400/30'
                  : 'bg-slate-900/80 border-slate-700/80 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                <span>[1] BİRİNCİL</span>
                <span className="text-base">{myPlayer.weapons?.primary?.icon || '🔫'}</span>
              </div>
              <div className="font-heading font-black text-sm sm:text-base text-white truncate">
                {myPlayer.weapons?.primary?.name || 'Boş Slot'}
              </div>

              {myPlayer.weapons?.primary && !myPlayer.weapons.primary.isMelee ? (
                <div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black font-mono text-amber-400 leading-none">
                      {myPlayer.weapons.primary.ammo}
                    </span>
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      / {myPlayer.ammo?.[myPlayer.weapons.primary.ammoType] || 0}
                    </span>
                  </div>
                  {/* Mermi Tipi Bilgisi */}
                  <div className="mt-1.5 pt-1 border-t border-slate-800 flex items-center justify-between text-[10px]">
                    <span className="font-bold text-slate-400 flex items-center gap-1">
                      <span>{AMMO_CONFIG[myPlayer.weapons.primary.ammoType]?.icon || '📦'}</span>
                      <span>Mermi:</span>
                    </span>
                    <span
                      className="px-1.5 py-0.2 rounded font-mono font-black text-[10px]"
                      style={{
                        backgroundColor: `${AMMO_CONFIG[myPlayer.weapons.primary.ammoType]?.color || '#f59e0b'}25`,
                        color: AMMO_CONFIG[myPlayer.weapons.primary.ammoType]?.color || '#f59e0b',
                        border: `1px solid ${AMMO_CONFIG[myPlayer.weapons.primary.ammoType]?.color || '#f59e0b'}50`
                      }}
                    >
                      {AMMO_CONFIG[myPlayer.weapons.primary.ammoType]?.label || myPlayer.weapons.primary.ammoType}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-slate-500 mt-1">Yerden Silah Al [F/E]</div>
              )}

              {/* Reloading Overlay */}
              {myPlayer.weapons?.primary?.isReloading && (
                <div className="absolute inset-0 bg-amber-950/90 flex items-center justify-center gap-1.5 text-xs font-bold text-amber-300 animate-pulse">
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>Dolduruluyor...</span>
                </div>
              )}
            </button>

            {/* Slot 2: Secondary Weapon */}
            <button
              type="button"
              onClick={() => onSwitchSlot('secondary')}
              className={`p-3 rounded-2xl border backdrop-blur-md transition cursor-pointer text-left min-w-[145px] sm:min-w-[165px] relative overflow-hidden ${
                myPlayer.activeSlot === 'secondary'
                  ? 'bg-slate-900/95 border-2 border-amber-400 shadow-xl shadow-amber-500/20 ring-2 ring-amber-400/30'
                  : 'bg-slate-900/80 border-slate-700/80 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1">
                <span>[2] İKİNCİL</span>
                <span className="text-base">{myPlayer.weapons?.secondary?.icon || '—'}</span>
              </div>
              <div className="font-heading font-black text-sm sm:text-base text-white truncate">
                {myPlayer.weapons?.secondary?.name || (
                  <span className="text-slate-500 font-normal text-xs">Boş Slot</span>
                )}
              </div>

              {myPlayer.weapons?.secondary && !myPlayer.weapons.secondary.isMelee ? (
                <div>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black font-mono text-amber-400 leading-none">
                      {myPlayer.weapons.secondary.ammo}
                    </span>
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      / {myPlayer.ammo?.[myPlayer.weapons.secondary.ammoType] || 0}
                    </span>
                  </div>
                  {/* Mermi Tipi Bilgisi */}
                  <div className="mt-1.5 pt-1 border-t border-slate-800 flex items-center justify-between text-[10px]">
                    <span className="font-bold text-slate-400 flex items-center gap-1">
                      <span>{AMMO_CONFIG[myPlayer.weapons.secondary.ammoType]?.icon || '📦'}</span>
                      <span>Mermi:</span>
                    </span>
                    <span
                      className="px-1.5 py-0.2 rounded font-mono font-black text-[10px]"
                      style={{
                        backgroundColor: `${AMMO_CONFIG[myPlayer.weapons.secondary.ammoType]?.color || '#f59e0b'}25`,
                        color: AMMO_CONFIG[myPlayer.weapons.secondary.ammoType]?.color || '#f59e0b',
                        border: `1px solid ${AMMO_CONFIG[myPlayer.weapons.secondary.ammoType]?.color || '#f59e0b'}50`
                      }}
                    >
                      {AMMO_CONFIG[myPlayer.weapons.secondary.ammoType]?.label || myPlayer.weapons.secondary.ammoType}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-[11px] text-slate-500 mt-1">İkinci Silah [F/E]</div>
              )}

              {/* Reloading Overlay */}
              {myPlayer.weapons?.secondary?.isReloading && (
                <div className="absolute inset-0 bg-amber-950/90 flex items-center justify-center gap-1.5 text-xs font-bold text-amber-300 animate-pulse">
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                  <span>Dolduruluyor...</span>
                </div>
              )}
            </button>

            {/* Slot 3: Melee / Fists */}
            <button
              type="button"
              onClick={() => onSwitchSlot('melee')}
              className={`p-3 rounded-2xl border backdrop-blur-md transition cursor-pointer text-left min-w-[70px] ${
                myPlayer.activeSlot === 'melee'
                  ? 'bg-amber-600/30 border-2 border-amber-400 shadow-xl shadow-amber-500/20'
                  : 'bg-slate-900/80 border-slate-700/80 hover:border-slate-600'
              }`}
            >
              <div className="text-[10px] font-bold text-slate-400 mb-1">[3] YUMRUK</div>
              <div className="font-heading font-black text-xl text-white flex items-center justify-center py-0.5">
                <span>👊</span>
              </div>
            </button>

            {/* Quick Reload Button */}
            {activeWeapon && !activeWeapon.isMelee && (
              <button
                type="button"
                onClick={onReload}
                className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-700 hover:bg-slate-800 text-white font-bold text-xs shadow-lg transition active:scale-95 cursor-pointer flex flex-col items-center justify-center"
                title="Şarjör Değiştir [Tuş: R]"
              >
                <RotateCcw className={`w-5 h-5 ${activeWeapon.isReloading ? 'animate-spin text-amber-400' : 'text-slate-300'}`} />
                <span className="text-[10px] text-amber-400 font-mono font-black mt-1">R</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
