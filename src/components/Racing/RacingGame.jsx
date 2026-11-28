import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useGame } from '../../context/GameContext';
import RacingCanvas from './RacingCanvas';
import RacingHUD from './RacingHUD';
import RacingGameOverModal from './RacingGameOverModal';
import LiveChat from '../Common/LiveChat';
import { MessageCircle, X, Volume2, VolumeX, LogOut } from 'lucide-react';

export default function RacingGame() {
  const {
    room,
    player,
    racingState,
    racingGameOverData,
    sendRacingInput,
    returnToLobby,
    leaveRoom
  } = useGame();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Audio Context Ref for procedural sound effects
  const audioCtxRef = useRef(null);
  const engineGainRef = useRef(null);
  const engineOscRef = useRef(null);
  const skidGainRef = useRef(null);
  const skidSourceRef = useRef(null);

  // Local inputs state
  const inputsRef = useRef({
    gas: false,
    brake: false,
    left: false,
    right: false,
    handbrake: false,
    nitro: false
  });

  const lastSentInputs = useRef({ ...inputsRef.current });

  // Web Audio initialization
  useEffect(() => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Engine sound (oscillator + waveshaper + lowpass)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(45, ctx.currentTime);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      engineOscRef.current = osc;
      engineGainRef.current = gain;

      // Skid sound (white noise buffer + bandpass filter)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const skidFilter = ctx.createBiquadFilter();
      skidFilter.type = 'bandpass';
      skidFilter.frequency.setValueAtTime(1100, ctx.currentTime);
      skidFilter.Q.setValueAtTime(3, ctx.currentTime);

      const skidGain = ctx.createGain();
      skidGain.gain.setValueAtTime(0.0001, ctx.currentTime);

      whiteNoise.connect(skidFilter);
      skidFilter.connect(skidGain);
      skidGain.connect(ctx.destination);
      whiteNoise.start();

      skidSourceRef.current = whiteNoise;
      skidGainRef.current = skidGain;
    } catch (e) {
      console.warn('Web Audio not allowed or failed:', e);
    }

    return () => {
      try {
        if (engineOscRef.current) engineOscRef.current.stop();
        if (skidSourceRef.current) skidSourceRef.current.stop();
        if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
          audioCtxRef.current.close();
        }
      } catch (e) {}
    };
  }, []);

  // Helper to safely resolve myPlayer from racingState (which is an array of players)
  const getMyPlayer = useCallback(() => {
    if (!racingState?.players || !player?.id) return null;
    if (Array.isArray(racingState.players)) {
      return racingState.players.find(p => p.id === player.id) || null;
    }
    return racingState.players[player.id] || null;
  }, [racingState, player?.id]);

  // Update procedural engine and tire screech audio based on current car speed & drift
  useEffect(() => {
    if (!soundEnabled || !audioCtxRef.current || audioCtxRef.current.state === 'suspended') return;
    const ctx = audioCtxRef.current;
    const myPlayer = getMyPlayer();
    if (!myPlayer) return;

    const speed = Math.hypot(myPlayer.vx || 0, myPlayer.vy || 0);
    const speedRatio = Math.min(1.0, speed / 16);

    // Dynamic Engine Pitch & Volume
    if (engineOscRef.current && engineGainRef.current) {
      const targetFreq = 42 + speedRatio * 160 + (inputsRef.current.gas ? 25 : 0) + (myPlayer.isNitroActive ? 55 : 0);
      engineOscRef.current.frequency.setTargetAtTime(targetFreq, ctx.currentTime, 0.08);

      const targetGain = 0.04 + speedRatio * 0.08 + (inputsRef.current.gas ? 0.04 : 0);
      engineGainRef.current.gain.setTargetAtTime(targetGain, ctx.currentTime, 0.08);
    }

    // Dynamic Drift / Skid Tire screech
    if (skidGainRef.current) {
      const isScreeching = myPlayer.isDrifting || (inputsRef.current.handbrake && speed > 2);
      const targetSkidGain = isScreeching ? 0.09 : 0.0001;
      skidGainRef.current.gain.setTargetAtTime(targetSkidGain, ctx.currentTime, 0.05);
    }
  }, [racingState, player?.id, soundEnabled]);

  // Send inputs helper
  const sendInputUpdate = useCallback((customPayload = null) => {
    const current = inputsRef.current;
    const payload = customPayload || { inputs: { ...current } };
    sendRacingInput(payload);
    lastSentInputs.current = { ...current };
  }, [sendRacingInput]);

  // Direct Pit Service action
  const handlePitService = useCallback((serviceType) => {
    sendRacingInput({
      action: 'pit_service',
      serviceType
    });

    // Sound feedback for pit tools
    if (soundEnabled && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = serviceType === 'nitro' ? 'triangle' : 'square';
      osc.frequency.setValueAtTime(serviceType === 'nitro' ? 650 : 380, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }
  }, [sendRacingInput, soundEnabled]);

  // Keyboard handler - strictly layout agnostic using e.code + e.key
  const handleKeyDown = useCallback((e) => {
    // Ignore input if typing in chat
    if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;

    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    const code = e.code || '';
    const key = (e.key || '').toLowerCase();

    const isW = code === 'KeyW' || code === 'ArrowUp' || key === 'w' || key === 'arrowup';
    const isS = code === 'KeyS' || code === 'ArrowDown' || key === 's' || key === 'arrowdown';
    const isA = code === 'KeyA' || code === 'ArrowLeft' || key === 'a' || key === 'arrowleft';
    const isD = code === 'KeyD' || code === 'ArrowRight' || key === 'd' || key === 'arrowright';
    const isSpace = code === 'Space' || key === ' ';
    const isShift = code === 'ShiftLeft' || code === 'ShiftRight' || key === 'shift';

    const myPlayer = getMyPlayer();
    const inPit = myPlayer?.inPit;

    if (isW) {
      e.preventDefault();
      inputsRef.current.gas = true;
      sendInputUpdate();
      return;
    }

    if (isS) {
      e.preventDefault();
      inputsRef.current.brake = true;
      sendInputUpdate();
      return;
    }

    if (isA) {
      e.preventDefault();
      inputsRef.current.left = true;
      sendInputUpdate();
      return;
    }

    if (isD) {
      e.preventDefault();
      inputsRef.current.right = true;
      sendInputUpdate();
      return;
    }

    if (isSpace) {
      e.preventDefault();
      if (inPit) {
        // Exit pit
        handlePitService('exit_pit');
      } else {
        inputsRef.current.handbrake = true;
        sendInputUpdate();
      }
      return;
    }

    if (isShift) {
      e.preventDefault();
      if (inPit) {
        // Refill nitro
        handlePitService('nitro');
      } else {
        inputsRef.current.nitro = true;
        sendInputUpdate();
      }
      return;
    }

    // Pit stop shortcuts
    if (inPit) {
      if (code === 'KeyT' || key === 't') {
        e.preventDefault();
        handlePitService('tires');
      } else if (code === 'KeyR' || key === 'r') {
        e.preventDefault();
        handlePitService('repair');
      } else if (code === 'KeyE' || key === 'e' || code === 'KeyF' || key === 'f') {
        e.preventDefault();
        handlePitService('exit_pit');
      }
    }
  }, [sendInputUpdate, handlePitService, racingState, player?.id]);

  const handleKeyUp = useCallback((e) => {
    if (['INPUT', 'TEXTAREA'].includes(e.target?.tagName)) return;

    const code = e.code || '';
    const key = (e.key || '').toLowerCase();

    const isW = code === 'KeyW' || code === 'ArrowUp' || key === 'w' || key === 'arrowup';
    const isS = code === 'KeyS' || code === 'ArrowDown' || key === 's' || key === 'arrowdown';
    const isA = code === 'KeyA' || code === 'ArrowLeft' || key === 'a' || key === 'arrowleft';
    const isD = code === 'KeyD' || code === 'ArrowRight' || key === 'd' || key === 'arrowright';
    const isSpace = code === 'Space' || key === ' ';
    const isShift = code === 'ShiftLeft' || code === 'ShiftRight' || key === 'shift';

    let changed = false;

    if (isW && inputsRef.current.gas) {
      inputsRef.current.gas = false;
      changed = true;
    }
    if (isS && inputsRef.current.brake) {
      inputsRef.current.brake = false;
      changed = true;
    }
    if (isA && inputsRef.current.left) {
      inputsRef.current.left = false;
      changed = true;
    }
    if (isD && inputsRef.current.right) {
      inputsRef.current.right = false;
      changed = true;
    }
    if (isSpace && inputsRef.current.handbrake) {
      inputsRef.current.handbrake = false;
      changed = true;
    }
    if (isShift && inputsRef.current.nitro) {
      inputsRef.current.nitro = false;
      changed = true;
    }

    if (changed) {
      sendInputUpdate();
    }
  }, [sendInputUpdate]);

  // Window listeners for keyboard
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  // Periodic input heartbeat (keeps server in sync every 40ms)
  useEffect(() => {
    const interval = setInterval(() => {
      sendInputUpdate();
    }, 40);
    return () => clearInterval(interval);
  }, [sendInputUpdate]);

  const myPlayer = getMyPlayer();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 select-none">
      {/* 2D HTML5 Canvas Engine */}
      <RacingCanvas state={racingState} myPlayerId={player?.id} />

      {/* Modern High-End Telemetry HUD */}
      <RacingHUD
        state={racingState}
        myPlayer={myPlayer}
        onLeave={() => {
          if (window.confirm('Yarıştan ayrılmak istediğinize emin misiniz?')) {
            returnToLobby();
          }
        }}
        onPitService={handlePitService}
      />

      {/* Floating Controls: Audio toggle & Live Chat toggle */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={() => setSoundEnabled(prev => !prev)}
          className="w-10 h-10 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/80 transition cursor-pointer shadow-lg"
          title={soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
        >
          {soundEnabled ? <Volume2 className="w-5 h-5 text-amber-400" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
        </button>

        <button
          onClick={() => setIsChatOpen(prev => !prev)}
          className="relative w-10 h-10 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-black/80 transition cursor-pointer shadow-lg"
          title="Sohbet"
        >
          <MessageCircle className="w-5 h-5 text-sky-400" />
        </button>
      </div>

      {/* Live Chat Slide-out Drawer */}
      {isChatOpen && (
        <div className="fixed right-4 bottom-20 z-40 w-80 sm:w-96 h-[460px] bg-slate-900/95 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-scale-up">
          <div className="flex items-center justify-between px-4 py-3 bg-white/10 border-b border-white/10">
            <span className="font-heading font-black text-sm text-white flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-sky-400" />
              Pist Telsizi & Sohbet
            </span>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-hidden p-2">
            <LiveChat />
          </div>
        </div>
      )}

      {/* Game Over / Podium Celebration Modal */}
      {(racingGameOverData || room?.gameState === 'game_over') && (
        <RacingGameOverModal data={racingGameOverData} />
      )}
    </div>
  );
}
