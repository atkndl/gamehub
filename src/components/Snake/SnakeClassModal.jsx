import React from 'react';
import { useGame } from '../../context/GameContext';
import { Zap, Shield, Flame, Snowflake, Check, Sparkles } from 'lucide-react';

export const SNAKE_CLASSES = {
  speed: {
    id: 'speed',
    name: 'Yıldırım',
    title: 'Hızlı Yılan',
    icon: '⚡',
    LucideIcon: Zap,
    color: '#eab308',
    gradient: 'from-amber-400 to-yellow-500',
    border: 'border-yellow-400',
    bgLight: 'bg-yellow-50',
    text: 'text-amber-800',
    desc: 'Diğer yılanlardan %20 daha hızlı hareket eder. Hızlı manevralar için idealdir.',
    perk: '+%20 Hareket Hızı',
    initialLength: 4
  },
  long: {
    id: 'long',
    name: 'Titan',
    title: 'Uzun Yılan',
    icon: '🐍',
    LucideIcon: Shield,
    color: '#10b981',
    gradient: 'from-emerald-400 to-teal-500',
    border: 'border-emerald-400',
    bgLight: 'bg-emerald-50',
    text: 'text-emerald-800',
    desc: 'Oyuna diğerlerinin 2 katı uzunluğunda (8 boğum) başlar. Rakipleri kıstırmada uzmandır.',
    perk: '2 Kat Başlangıç Boyu (8 Boğum)',
    initialLength: 8
  },
  fire: {
    id: 'fire',
    name: 'Ejderha',
    title: 'Ateş Yılanı',
    icon: '🔥',
    LucideIcon: Flame,
    color: '#ef4444',
    gradient: 'from-red-500 to-orange-500',
    border: 'border-red-400',
    bgLight: 'bg-red-50',
    text: 'text-red-800',
    desc: 'Oyun alanında beliren ölümcül ateş ve lav alanlarından zarar görmeden rahatça geçer.',
    perk: 'Ateş & Lav Dokunulmazlığı',
    initialLength: 4
  },
  ice: {
    id: 'ice',
    name: 'Buzul',
    title: 'Buz Yılanı',
    icon: '❄️',
    LucideIcon: Snowflake,
    color: '#06b6d4',
    gradient: 'from-cyan-400 to-blue-500',
    border: 'border-cyan-400',
    bgLight: 'bg-cyan-50',
    text: 'text-cyan-800',
    desc: 'Oyun alanında beliren buz fırtınası alanlarından donmadan ve ölmeden rahatça geçer.',
    perk: 'Buz & Donma Dokunulmazlığı',
    initialLength: 4
  }
};

export default function SnakeClassModal({ isOpen, onClose }) {
  const { player, selectSnakeClass, showToast } = useGame();

  if (!isOpen) return null;

  const currentClass = player?.snakeClass || 'speed';

  const handleSelect = async (classKey) => {
    try {
      await selectSnakeClass(classKey);
      showToast(`${SNAKE_CLASSES[classKey].title} seçildi! ${SNAKE_CLASSES[classKey].icon}`);
      if (onClose) onClose();
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-500 text-white flex items-center justify-center font-heading font-black text-xl shadow-xs">
              🐍
            </div>
            <div>
              <h2 className="font-heading font-black text-lg text-slate-900 leading-tight">
                Yılan Karakterini Seç
              </h2>
              <p className="text-xs text-slate-500">
                Her karakterin kendine has özel yeteneği vardır
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Classes Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(SNAKE_CLASSES).map(([key, cls]) => {
            const isSelected = currentClass === key;
            const Icon = cls.LucideIcon;

            return (
              <div
                key={key}
                onClick={() => handleSelect(key)}
                className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? `${cls.border} ${cls.bgLight} shadow-md scale-[1.01]`
                    : 'border-slate-200/80 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold">
                    <Check className="w-3 h-3 text-emerald-400" />
                    Seçili
                  </div>
                )}

                <div>
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${cls.gradient} text-white flex items-center justify-center text-xl shadow-xs`}
                    >
                      {cls.icon}
                    </div>
                    <div>
                      <h3 className="font-heading font-black text-base text-slate-900 leading-tight">
                        {cls.title}
                      </h3>
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        {cls.name}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    {cls.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between">
                  <span className={`text-[11px] font-bold ${cls.text} flex items-center gap-1`}>
                    <Sparkles className="w-3.5 h-3.5" />
                    {cls.perk}
                  </span>
                  <button
                    type="button"
                    className={`px-3 py-1.5 rounded-xl font-heading font-bold text-xs transition ${
                      isSelected
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isSelected ? 'Kullanılıyor' : 'Seç'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            ❤️ Her oyuncu 3 can ile başlar, sona kalan kazanır!
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-xs transition cursor-pointer"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
}
