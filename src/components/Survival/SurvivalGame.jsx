import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useGame } from '../../context/GameContext';
import SurvivalCanvas from './SurvivalCanvas';
import SurvivalHUD from './SurvivalHUD';
import SurvivalMobileControls from './SurvivalMobileControls';
import SurvivalGameOverModal from './SurvivalGameOverModal';
import LiveChat from '../Common/LiveChat';

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

  // Local movement vector state
  const keysDownRef = useRef({ w: false, a: false, s: false, d: false });
  const aimAngleRef = useRef(0);
  const isShootingRef = useRef(false);

  // Send player input update to server
  const syncInput = useCallback(() => {
    const keys = keysDownRef.current;
    let mx = 0;
    let my = 0;
    if (keys.w) my -= 1;
    if (keys.s) my += 1;
    if (keys.a) mx -= 1;
    if (keys.d) mx += 1;

    sendSurvivalInput({
      movement: { x: mx, y: my },
      angle: aimAngleRef.current,
      isShooting: isShootingRef.current
    });
  }, [sendSurvivalInput]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e) => {
    // Ignore if typing in chat
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

    const key = e.key.toLowerCase();

    if (['w', 'arrowup'].includes(key)) keysDownRef.current.w = true;
    if (['s', 'arrowdown'].includes(key)) keysDownRef.current.s = true;
    if (['a', 'arrowleft'].includes(key)) keysDownRef.current.a = true;
    if (['d', 'arrowright'].includes(key)) keysDownRef.current.d = true;

    if (key === '1') {
      sendSurvivalInput({ action: 'switch_slot', slot: 'primary' });
    } else if (key === '2') {
      sendSurvivalInput({ action: 'switch_slot', slot: 'secondary' });
    } else if (key === '3') {
      sendSurvivalInput({ action: 'switch_slot', slot: 'melee' });
    } else if (key === 'r') {
      sendSurvivalInput({ action: 'reload' });
    } else if (key === 'f' || key === 'e') {
      sendSurvivalInput({ action: 'pickup' });
    } else if (key === '7') {
      sendSurvivalInput({ action: 'use_heal', healType: 'bandage' });
    } else if (key === '8') {
      sendSurvivalInput({ action: 'use_heal', healType: 'medkit' });
    } else if (key === '9') {
      sendSurvivalInput({ action: 'use_heal', healType: 'soda' });
    }

    syncInput();
  }, [syncInput, sendSurvivalInput]);

  const handleKeyUp = useCallback((e) => {
    if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

    const key = e.key.toLowerCase();
    if (['w', 'arrowup'].includes(key)) keysDownRef.current.w = false;
    if (['s', 'arrowdown'].includes(key)) keysDownRef.current.s = false;
    if (['a', 'arrowleft'].includes(key)) keysDownRef.current.a = false;
    if (['d', 'arrowright'].includes(key)) keysDownRef.current.d = false;

    syncInput();
  }, [syncInput]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Regular input sync loop
  useEffect(() => {
    const interval = setInterval(syncInput, 50); // 20 times per second
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
    sendSurvivalInput({ action: 'switch_slot', slot });
  }, [sendSurvivalInput]);

  const handleReload = useCallback(() => {
    sendSurvivalInput({ action: 'reload' });
  }, [sendSurvivalInput]);

  const handleUseHeal = useCallback((healType) => {
    sendSurvivalInput({ action: 'use_heal', healType });
  }, [sendSurvivalInput]);

  const handlePickup = useCallback(() => {
    sendSurvivalInput({ action: 'pickup' });
  }, [sendSurvivalInput]);

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

      {/* Live Chat Panel */}
      <LiveChat />

      {/* Game Over Modal */}
      {survivalGameOverData && (
        <SurvivalGameOverModal data={survivalGameOverData} />
      )}
    </div>
  );
}
