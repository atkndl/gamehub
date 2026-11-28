import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { X, Flag, Timer, Zap, Check, Shield, Flame, Gauge } from 'lucide-react';

const CAR_PRESETS = [
  {
    id: 'red',
    name: 'Kırmızı Roket',
    colorHex: '#ef4444',
    sprite: '/assets/racing/Cars/car_red_1.png',
    topSpeed: '235 km/h',
    accel: 'Yüksek',
    handling: 'Dengeli',
    drift: 'Kuvvetli'
  },
  {
    id: 'blue',
    name: 'Mavi Fırtına',
    colorHex: '#3b82f6',
    sprite: '/assets/racing/Cars/car_blue_1.png',
    topSpeed: '240 km/h',
    accel: 'Çok Yüksek',
    handling: 'Hassas',
    drift: 'Akıcı'
  },
  {
    id: 'green',
    name: 'Yeşil Canavar',
    colorHex: '#10b981',
    sprite: '/assets/racing/Cars/car_green_1.png',
    topSpeed: '230 km/h',
    accel: 'Dengeli',
    handling: 'Mükemmel',
    drift: 'Stabil'
  },
  {
    id: 'yellow',
    name: 'Sarı Şimşek',
    colorHex: '#f59e0b',
    sprite: '/assets/racing/Cars/car_yellow_1.png',
    topSpeed: '245 km/h',
    accel: 'Maksimum',
    handling: 'Agresif',
    drift: 'Kaygan'
  },
  {
    id: 'black',
    name: 'Gece Hayaleti',
    colorHex: '#1e293b',
    sprite: '/assets/racing/Cars/car_black_1.png',
    topSpeed: '238 km/h',
    accel: 'Yüksek',
    handling: 'Ağır & Net',
    drift: 'Kontrollü'
  }
];

export default function RacingConfigModal({ isOpen, onClose }) {
  const { room, player, updateRacingConfig, selectCarColor, showToast } = useGame();
  const isHost = player?.isHost;

  const currentConfig = room?.racingConfig || {
    mode: 'laps',
    laps: 3,
    timeLimit: 120
  };

  const [mode, setMode] = useState(currentConfig.mode || 'laps');
  const [laps, setLaps] = useState(currentConfig.laps || 3);
  const [timeLimit, setTimeLimit] = useState(currentConfig.timeLimit || 120);
  const [selectedColor, setSelectedColor] = useState(player?.carColor || 'red');

  if (!isOpen) return null;

  const handleSelectCar = (colorId) => {
    setSelectedColor(colorId);
    selectCarColor(colorId);
  };

  const handleSave = () => {
    if (isHost) {
      updateRacingConfig({
        mode,
        laps,
        timeLimit
      });
      showToast('🏁 Yarış ayarları güncellendi!');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col p-6 text-slate-800 animate-scale-up max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🏎️</span>
            <div>
              <h2 className="font-heading font-black text-xl text-slate-900 leading-tight">
                Yarış & Garaj Ayarları
              </h2>
              <p className="text-xs text-slate-500">2D Pist, Drift & Pit Stop Mücadelesi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Car Selection Section (Available to everyone) */}
        <div className="mb-5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Aracını ve Rengini Seç:
          </label>
          <div className="grid grid-cols-5 gap-2">
            {CAR_PRESETS.map((car) => {
              const isSelected = selectedColor === car.id;
              return (
                <button
                  key={car.id}
                  type="button"
                  onClick={() => handleSelectCar(car.id)}
                  className={`p-2 rounded-2xl border-2 transition flex flex-col items-center justify-center gap-1.5 cursor-pointer relative ${
                    isSelected
                      ? 'border-red-500 bg-red-50/60 shadow-xs ring-2 ring-red-400/20'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="w-10 h-14 flex items-center justify-center">
                    <img
                      src={car.sprite}
                      alt={car.name}
                      className="max-h-12 w-auto object-contain filter drop-shadow-md"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 truncate w-full text-center">
                    {car.name.split(' ')[0]}
                  </span>
                  {isSelected && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center text-[10px] shadow-xs">
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Race Mode Selector (Host configurable) */}
        <div className="mb-5">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
            Yarış Formatı:
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* Laps Mode */}
            <button
              type="button"
              disabled={!isHost}
              onClick={() => setMode('laps')}
              className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col justify-between cursor-pointer ${
                mode === 'laps'
                  ? 'border-red-500 bg-red-50/70 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Flag className="w-5 h-5 text-red-600" />
                {mode === 'laps' && (
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                )}
              </div>
              <div>
                <span className="font-heading font-black text-sm text-slate-900 block">
                  Tur Yarışı
                </span>
                <span className="text-[11px] text-slate-500 leading-relaxed block mt-0.5">
                  İlk belirlenen tur sayısını tamamlayan dama bayrağını görür!
                </span>
              </div>
            </button>

            {/* Time Mode */}
            <button
              type="button"
              disabled={!isHost}
              onClick={() => setMode('time')}
              className={`p-3.5 rounded-2xl border-2 text-left transition flex flex-col justify-between cursor-pointer ${
                mode === 'time'
                  ? 'border-amber-500 bg-amber-50/70 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <Timer className="w-5 h-5 text-amber-600" />
                {mode === 'time' && (
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                )}
              </div>
              <div>
                <span className="font-heading font-black text-sm text-slate-900 block">
                  Zamana Karşı
                </span>
                <span className="text-[11px] text-slate-500 leading-relaxed block mt-0.5">
                  Süre bittiğinde en çok tur atan ve en hızlı olan kazanır!
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mode Specific Settings: Laps or Time */}
        {mode === 'laps' ? (
          <div className="mb-5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Tur Sayısı:
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[3, 5, 10].map((l) => (
                <button
                  key={l}
                  type="button"
                  disabled={!isHost}
                  onClick={() => setLaps(l)}
                  className={`py-3 px-3 rounded-2xl border-2 font-heading font-black text-xs transition cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                    laps === l
                      ? 'border-red-500 bg-red-500 text-white shadow-md shadow-red-500/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-sm">{l} Tur</span>
                  <span className={`text-[10px] font-normal ${laps === l ? 'text-red-100' : 'text-slate-400'}`}>
                    {l === 3 ? 'Hızlı Sprint' : l === 5 ? 'Standart GP' : 'Dayanıklılık'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mb-5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Yarış Süresi:
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { sec: 60, label: '1 Dakika' },
                { sec: 120, label: '2 Dakika' },
                { sec: 180, label: '3 Dakika' }
              ].map((t) => (
                <button
                  key={t.sec}
                  type="button"
                  disabled={!isHost}
                  onClick={() => setTimeLimit(t.sec)}
                  className={`py-3 px-3 rounded-2xl border-2 font-heading font-black text-xs transition cursor-pointer flex flex-col items-center justify-center gap-0.5 ${
                    timeLimit === t.sec
                      ? 'border-amber-500 bg-amber-500 text-white shadow-md shadow-amber-500/20'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="text-sm">{t.label}</span>
                  <span className={`text-[10px] font-normal ${timeLimit === t.sec ? 'text-amber-100' : 'text-slate-400'}`}>
                    {t.sec} saniye
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Feature Highlights Pill */}
        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 mb-5 text-[11px] text-slate-600 space-y-1">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            <span>Kontroller & Mekanikler:</span>
          </div>
          <p>• <b>W / S / A / D</b> veya <b>Yön Tuşları</b> ile Gaz, Fren ve Dönüş</p>
          <p>• <b>Space (El Freni)</b>: Virajlarda kayarak el freniyle drift yapın</p>
          <p>• <b>Shift (Nitro)</b>: Ani hızlanma için nitrosu ateşleyin</p>
          <p>• <b>Pit Stop Alanı</b>: Pite girince <b>[Shift]</b> ile Nitro bas, <b>[T]</b> ile Lastik değiştir, <b>[R]</b> ile Hasar onar, <b>[Space]</b> ile piste fırla!</p>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-heading font-bold text-xs transition cursor-pointer"
          >
            Kapat
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-heading font-black text-xs shadow-md shadow-red-500/25 active:scale-95 transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
}
