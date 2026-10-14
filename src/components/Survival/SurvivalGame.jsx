import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useGame } from '../../context/GameContext';
import SurvivalCanvas from './SurvivalCanvas';
import SurvivalHUD from './SurvivalHUD';
import SurvivalMobileControls from './SurvivalMobileControls';
import SurvivalGameOverModal from './SurvivalGameOverModal';
import LiveChat from '../Common/LiveChat';
import { MessageCircle, X } from 'lucide-react';

export default function SurvivalGame() {
  const {
    room,
    player,
    survivalState,
    survivalGameOverData,
    sendSurvivalInput,
    returnToLobby
  } = useGame();

  const [killfeed, setKillfeed] = useState([]);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Local movement vector state
  const keysDownRef = useRef({ w: false, a: false, s: false, d: false });
  const aimAngleRef = useRef(0);
  const isShootingRef = useRef(false);

  // Send player input update to server with optional immediate action
  const sendInputWithAction = useCallback((actionData = null) => {
    const keys = keysDownRef.current;
    let mx = 0;
    let my = 0;
    if (keys.w) my -= 1;
    if (keys.s) my += 1;
    if (keys.a) mx -= 1;
    if (keys.d) mx += 1;

    const payload = {
      movement: { x: mx, y: my },
      angle: aimAngleRef.current,
      isShooting: isShootingRef.current
    };

    if (actionData) {
      Object.assign(payload, actionData);
    }

    sendSurvivalInput(payload);
  }, [sendSurvivalInput]);

  const syncInput = useCallback(() => {
    sendInputWithAction(null);
  }, [sendInputWithAction]);

  // Keyboard navigation - strictly layout agnostic using e.code + e.key
  const handleKeyDown = useCallback((e) => {
    // Ignore if typing in chat
    if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;

    const code = e.code || '';
    const key = (e.key || '').toLowerCase();

    // Check WASD and Arrow Keys
    const isW = code === 'KeyW' || code === 'ArrowUp' || key === 'w' || key === 'arrowup';
    const isS = code === 'KeyS' || code === 'ArrowDown' || key === 's' || key === 'arrowdown';
    const isA = code === 'KeyA' || code === 'ArrowLeft' || key === 'a' || key === 'arrowleft';
    const isD = code === 'KeyD' || code === 'ArrowRight' || key === 'd' || key === 'arrowright';

    if (isW || isS || isA || isD) {
      e.preventDefault();
      if (isW) keysDownRef.current.w = true;
      if (isS) keysDownRef.current.s = true;
      if (isA) keysDownRef.current.a = true;
      if (isD) keysDownRef.current.d = true;
      syncInput();
      return;
    }

    // Number keys 1, 2, 3 for weapon slots
    if (code === 'Digit1' || code === 'Numpad1' || key === '1') {
      e.preventDefault();
      sendInputWithAction({ action: 'switch_slot', slot: 'primary' });
    } else if (code === 'Digit2' || code === 'Numpad2' || key === '2') {
      e.preventDefault();
      sendInputWithAction({ action: 'switch_slot', slot: 'secondary' });
    } else if (code === 'Digit3' || code === 'Numpad3' || key === '3') {
      e.preventDefault();
      sendInputWithAction({ action: 'switch_slot', slot: 'melee' });
    } else if (code === 'KeyR' || key === 'r') {
      e.preventDefault();
      sendInputWithAction({ action: 'reload' });
    } else if (code === 'KeyF' || code === 'KeyE' || key === 'f' || key === 'e') {
      e.preventDefault();
      sendInputWithAction({ action: 'pickup' });
    } else if (code === 'Digit7' || code === 'Numpad7' || key === '7') {
      e.preventDefault();
      sendInputWithAction({ action: 'use_heal', healType: 'bandage' });
    } else if (code === 'Digit8' || code === 'Numpad8' || key === '8') {
      e.preventDefault();
      sendInputWithAction({ action: 'use_heal', healType: 'medkit' });
    } else if (code === 'Digit9' || code === 'Numpad9' || key === '9') {
      e.preventDefault();
      sendInputWithAction({ action: 'use_heal', healType: 'soda' });
    }
  }, [sendInputWithAction, syncInput]);

  const handleKeyUp = useCallback((e) => {
    if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;

    const code = e.code || '';
    const key = (e.key || '').toLowerCase();

    const isW = code === 'KeyW' || code === 'ArrowUp' || key === 'w' || key === 'arrowup';
    const isS = code === 'KeyS' || code === 'ArrowDown' || key === 's' || key === 'arrowdown';
    const isA = code === 'KeyA' || code === 'ArrowLeft' || key === 'a' || key === 'arrowleft';
    const isD = code === 'KeyD' || code === 'ArrowRight' || key === 'd' || key === 'arrowright';

    if (isW || isS || isA || isD) {
      if (isW) keysDownRef.current.w = false;
      if (isS) keysDownRef.current.s = false;
      if (isA) keysDownRef.current.a = false;
      if (isD) keysDownRef.current.d = false;
      syncInput();
    }
  }, [syncInput]);

  // Window listeners for keyboard and blur
  useEffect(() => {
    const handleBlur = () => {
      keysDownRef.current = { w: false, a: false, s: false, d: false };
      isShootingRef.current = false;
      syncInput();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [handleKeyDown, handleKeyUp, syncInput]);

  // Regular input sync loop (20 times per second)
  useEffect(() => {
    const interval = setInterval(syncInput, 50);
    return () => clearInterval(interval);
  }, [syncInput]);

  // Mouse aim handler
  const handleAim = useCallback((angle) => {
    aimAngleRef.current = angle;
  }, []);

  const handleShoot = useCallback(() => {
    isShootingRef.current = true;
    syncInput();
  }, [syncInput]);

  const handleStopShoot = useCallback(() => {
    isShootingRef.current = false;
    syncInput();
  }, [syncInput]);

  // Mobile controls
  const handleMobileMoveChange = useCallback(({ x, y }) => {
    sendSurvivalInput({
      movement: { x, y },
      angle: aimAngleRef.current,
      isShooting: isShootingRef.current
    });
  }, [sendSurvivalInput]);

  const handleMobileAimChange = useCallback((angle) => {
    aimAngleRef.current = angle;
    sendSurvivalInput({
      angle
    });
  }, [sendSurvivalInput]);

  // Actions from HUD
  const handleSwitchSlot = useCallback((slot) => {
    sendInputWithAction({ action: 'switch_slot', slot });
  }, [sendInputWithAction]);

  const handleReload = useCallback(() => {
    sendInputWithAction({ action: 'reload' });
  }, [sendInputWithAction]);

  const handleUseHeal = useCallback((healType) => {
    sendInputWithAction({ action: 'use_heal', healType });
  }, [sendInputWithAction]);

  const handlePickup = useCallback(() => {
    sendInputWithAction({ action: 'pickup' });
  }, [sendInputWithAction]);

  if (!room) return null;

  const myPlayer = survivalState?.players?.find(p => p.id === player?.id);

  return (
    <div className="relative w-full h-[calc(100vh-64px)] overflow-hidden select-none bg-slate-950">
      {/* 2D Canvas Engine */}
      <SurvivalCanvas
        state={survivalState}
        myPlayerId={player?.id}
        onAim={handleAim}
        onShoot={handleShoot}
        onStopShoot={handleStopShoot}
      />

      {/* Modern HUD Display */}
      <SurvivalHUD
        state={survivalState}
        myPlayer={myPlayer}
        onSwitchSlot={handleSwitchSlot}
        onReload={handleReload}
        onUseHeal={handleUseHeal}
        onPickup={handlePickup}
        onLeave={returnToLobby}
        killfeed={killfeed}
      />

      {/* Mobile Controls for Touch Devices */}
      <SurvivalMobileControls
        onMoveChange={handleMobileMoveChange}
        onAimChange={handleMobileAimChange}
        onShoot={handleShoot}
        onStopShoot={handleStopShoot}
        onReload={handleReload}
        onPickup={handlePickup}
      />

      {/* Floating Live Chat Drawer (Non-intrusive) */}
      <div className="absolute top-16 left-3 sm:left-5 z-30 pointer-events-auto">
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
            <LiveChat />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsChatOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/85 hover:bg-slate-800 border border-slate-700/80 text-xs font-bold text-white backdrop-blur-md shadow-md transition active:scale-95 cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sohbet</span>
          </button>
        )}
      </div>

      {/* Game Over Modal */}
      {survivalGameOverData && (
        <SurvivalGameOverModal data={survivalGameOverData} />
      )}
    </div>
  );
}
