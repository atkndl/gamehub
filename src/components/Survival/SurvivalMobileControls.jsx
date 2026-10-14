import React, { useRef } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Crosshair, RotateCcw, Package } from 'lucide-react';

export default function SurvivalMobileControls({
  onMoveChange,
  onAimChange,
  onShoot,
  onStopShoot,
  onReload,
  onPickup
}) {
  const moveTouchRef = useRef(null);

  const handleDirButton = (x, y) => {
    onMoveChange({ x, y });
  };

  const handleStopMove = () => {
    onMoveChange({ x: 0, y: 0 });
  };

  return (
    <div className="sm:hidden absolute inset-0 pointer-events-none z-30 flex flex-col justify-end p-4 pb-20">
      <div className="flex items-end justify-between w-full pointer-events-auto">
        {/* Left D-Pad for Movement */}
        <div className="grid grid-cols-3 gap-1.5 w-36 h-36">
          <div />
          <button
            type="button"
            onTouchStart={() => handleDirButton(0, -1)}
            onTouchEnd={handleStopMove}
            onMouseDown={() => handleDirButton(0, -1)}
            onMouseUp={handleStopMove}
            className="w-11 h-11 rounded-xl bg-slate-900/80 active:bg-blue-600 border border-slate-700/80 flex items-center justify-center text-white shadow-lg active:scale-90 transition mx-auto cursor-pointer"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          <div />

          <button
            type="button"
            onTouchStart={() => handleDirButton(-1, 0)}
            onTouchEnd={handleStopMove}
            onMouseDown={() => handleDirButton(-1, 0)}
            onMouseUp={handleStopMove}
            className="w-11 h-11 rounded-xl bg-slate-900/80 active:bg-blue-600 border border-slate-700/80 flex items-center justify-center text-white shadow-lg active:scale-90 transition mx-auto cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="w-11 h-11 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-center text-[10px] text-slate-500 font-bold mx-auto">
            HRP
          </div>
          <button
            type="button"
            onTouchStart={() => handleDirButton(1, 0)}
            onTouchEnd={handleStopMove}
            onMouseDown={() => handleDirButton(1, 0)}
            onMouseUp={handleStopMove}
            className="w-11 h-11 rounded-xl bg-slate-900/80 active:bg-blue-600 border border-slate-700/80 flex items-center justify-center text-white shadow-lg active:scale-90 transition mx-auto cursor-pointer"
          >
            <ArrowRight className="w-5 h-5" />
          </button>

          <div />
          <button
            type="button"
            onTouchStart={() => handleDirButton(0, 1)}
            onTouchEnd={handleStopMove}
            onMouseDown={() => handleDirButton(0, 1)}
            onMouseUp={handleStopMove}
            className="w-11 h-11 rounded-xl bg-slate-900/80 active:bg-blue-600 border border-slate-700/80 flex items-center justify-center text-white shadow-lg active:scale-90 transition mx-auto cursor-pointer"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          <div />
        </div>

        {/* Right Fire & Action Controls */}
        <div className="flex flex-col items-end gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPickup}
              className="w-11 h-11 rounded-full bg-slate-900/90 border border-amber-500/50 text-amber-400 flex items-center justify-center shadow-lg active:scale-90 transition cursor-pointer"
              title="Yerden Al"
            >
              <Package className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={onReload}
              className="w-11 h-11 rounded-full bg-slate-900/90 border border-slate-700 text-white flex items-center justify-center shadow-lg active:scale-90 transition cursor-pointer"
              title="Şarjör Değiştir"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {/* Big Fire Button */}
          <button
            type="button"
            onTouchStart={onShoot}
            onTouchEnd={onStopShoot}
            onMouseDown={onShoot}
            onMouseUp={onStopShoot}
            className="w-20 h-20 rounded-full bg-red-600/90 active:bg-red-500 border-4 border-red-400 text-white flex items-center justify-center shadow-2xl active:scale-90 transition cursor-pointer select-none"
          >
            <Crosshair className="w-9 h-9" />
          </button>
        </div>
      </div>
    </div>
  );
}
