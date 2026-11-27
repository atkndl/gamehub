import React from 'react';
import { CheckCircle2, XCircle, Sparkles, Flame } from 'lucide-react';

/**
 * Procedural SVG Cards for Liar's Bar (King, Queen, Ace, Joker, Back)
 * Features 3D CSS transform flips, neo-noir gold/neon styling, zero external assets!
 */

export function CardBackIllustration() {
  return (
    <svg viewBox="0 0 160 230" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="backBg" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#1e182e" />
          <stop offset="60%" stopColor="#0d0915" />
          <stop offset="100%" stopColor="#050308" />
        </radialGradient>
        <linearGradient id="goldLattice" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffd700" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#b8860b" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#ffd700" stopOpacity="0.8" />
        </linearGradient>
        <pattern id="lattice" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M 0,0 L 16,0 M 0,0 L 0,16" stroke="url(#goldLattice)" strokeWidth="0.75" fill="none" />
          <circle cx="8" cy="8" r="1.5" fill="#f59e0b" fillOpacity="0.6" />
        </pattern>
      </defs>

      {/* Outer Card Base */}
      <rect x="0" y="0" width="160" height="230" rx="14" fill="url(#backBg)" />
      
      {/* Golden Frame Border */}
      <rect x="5" y="5" width="150" height="220" rx="10" fill="none" stroke="#d97706" strokeWidth="1.5" strokeOpacity="0.7" />
      <rect x="8" y="8" width="144" height="214" rx="8" fill="none" stroke="#f59e0b" strokeWidth="0.8" strokeOpacity="0.4" />

      {/* Lattice Fill */}
      <rect x="10" y="10" width="140" height="210" rx="6" fill="url(#lattice)" />

      {/* Center Medallion */}
      <circle cx="80" cy="115" r="28" fill="#110d1a" stroke="#fbbf24" strokeWidth="2" />
      <circle cx="80" cy="115" r="24" fill="none" stroke="#d97706" strokeWidth="1" strokeDasharray="3,2" />

      {/* Center Skull Motif */}
      <g transform="translate(68, 102) scale(0.75)">
        <path d="M16 2 C8 2 2 8 2 16 C2 21 5 25 9 28 L9 32 L23 32 L23 28 C27 25 30 21 30 16 C30 8 24 2 16 2 Z" fill="#fbbf24" opacity="0.9" />
        {/* Eye sockets */}
        <circle cx="10" cy="15" r="3.5" fill="#110d1a" />
        <circle cx="22" cy="15" r="3.5" fill="#110d1a" />
        {/* Nose */}
        <polygon points="16,19 14,24 18,24" fill="#110d1a" />
        {/* Teeth */}
        <rect x="11" y="27" width="2" height="4" fill="#110d1a" />
        <rect x="15" y="27" width="2" height="4" fill="#110d1a" />
        <rect x="19" y="27" width="2" height="4" fill="#110d1a" />
      </g>
    </svg>
  );
}

export function KingIllustration() {
  return (
    <svg viewBox="0 0 160 230" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="kingBg" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#2a140e" />
          <stop offset="70%" stopColor="#150805" />
          <stop offset="100%" stopColor="#080201" />
        </radialGradient>
        <linearGradient id="kingGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="160" height="230" rx="14" fill="url(#kingBg)" />
      <rect x="4" y="4" width="152" height="222" rx="10" fill="none" stroke="url(#kingGold)" strokeWidth="1.5" />
      <rect x="7" y="7" width="146" height="216" rx="8" fill="none" stroke="#78350f" strokeWidth="0.8" />

      {/* Top Left Rank */}
      <text x="14" y="26" fill="url(#kingGold)" fontSize="20" fontWeight="900" fontFamily="sans-serif">K</text>
      <text x="14" y="38" fill="#eab308" fontSize="11" opacity="0.8">👑</text>

      {/* Bottom Right Rank */}
      <g transform="rotate(180, 80, 115)">
        <text x="14" y="26" fill="url(#kingGold)" fontSize="20" fontWeight="900" fontFamily="sans-serif">K</text>
        <text x="14" y="38" fill="#eab308" fontSize="11" opacity="0.8">👑</text>
      </g>

      {/* Central King Crowned Skull Illustration */}
      <g transform="translate(38, 55)">
        {/* Crown */}
        <polygon points="12,18 20,4 42,16 64,4 72,18 72,28 12,28" fill="url(#kingGold)" stroke="#78350f" strokeWidth="1" />
        <circle cx="20" cy="4" r="3" fill="#ef4444" />
        <circle cx="42" cy="16" r="3.5" fill="#3b82f6" />
        <circle cx="64" cy="4" r="3" fill="#ef4444" />
        <rect x="18" y="24" width="48" height="3" fill="#b45309" />

        {/* Skull Head */}
        <path d="M18,30 C18,22 66,22 66,30 C66,45 68,60 58,74 L58,84 L26,84 L26,74 C16,60 18,45 18,30 Z" fill="#fef3c7" stroke="#78350f" strokeWidth="1.5" />

        {/* Eye Sockets */}
        <ellipse cx="32" cy="48" rx="7" ry="9" fill="#1c1917" />
        <ellipse cx="52" cy="48" rx="7" ry="9" fill="#1c1917" />
        <circle cx="33" cy="47" r="2" fill="#ef4444" opacity="0.9" />
        <circle cx="53" cy="47" r="2" fill="#ef4444" opacity="0.9" />

        {/* Nose */}
        <polygon points="42,56 38,68 46,68" fill="#1c1917" />

        {/* Jaw & Teeth */}
        <rect x="30" y="74" width="4" height="7" fill="#1c1917" />
        <rect x="37" y="74" width="4" height="7" fill="#1c1917" />
        <rect x="44" y="74" width="4" height="7" fill="#1c1917" />
        <rect x="51" y="74" width="4" height="7" fill="#1c1917" />

        {/* Golden Royal Collar / Beard */}
        <path d="M10,88 L74,88 L64,104 L20,104 Z" fill="url(#kingGold)" stroke="#78350f" strokeWidth="1" />
      </g>

      {/* Title */}
      <text x="80" y="196" fill="#fef08a" fontSize="12" fontWeight="900" textAnchor="middle" letterSpacing="3">PAPAZ</text>
    </svg>
  );
}

export function QueenIllustration() {
  return (
    <svg viewBox="0 0 160 230" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="queenBg" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#2e081e" />
          <stop offset="70%" stopColor="#15030d" />
          <stop offset="100%" stopColor="#050104" />
        </radialGradient>
        <linearGradient id="queenGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fbcfe8" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#be185d" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="160" height="230" rx="14" fill="url(#queenBg)" />
      <rect x="4" y="4" width="152" height="222" rx="10" fill="none" stroke="#ec4899" strokeWidth="1.5" />
      <rect x="7" y="7" width="146" height="216" rx="8" fill="none" stroke="#831843" strokeWidth="0.8" />

      {/* Top Left Rank */}
      <text x="14" y="26" fill="#fbcfe8" fontSize="20" fontWeight="900" fontFamily="sans-serif">Q</text>
      <text x="14" y="38" fill="#f472b6" fontSize="11" opacity="0.8">🌹</text>

      {/* Bottom Right Rank */}
      <g transform="rotate(180, 80, 115)">
        <text x="14" y="26" fill="#fbcfe8" fontSize="20" fontWeight="900" fontFamily="sans-serif">Q</text>
        <text x="14" y="38" fill="#f472b6" fontSize="11" opacity="0.8">🌹</text>
      </g>

      {/* Central Queen Illustration */}
      <g transform="translate(38, 55)">
        {/* Tiara Crown */}
        <path d="M18,22 L26,8 L36,18 L42,4 L48,18 L58,8 L66,22 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
        <circle cx="42" cy="4" r="3" fill="#ec4899" />
        <circle cx="26" cy="8" r="2.5" fill="#f43f5e" />
        <circle cx="58" cy="8" r="2.5" fill="#f43f5e" />

        {/* Masked Face / Skull */}
        <path d="M22,26 C22,26 62,26 62,26 C62,45 60,65 52,76 L32,76 C24,65 22,45 22,26 Z" fill="#fdf2f8" stroke="#be185d" strokeWidth="1.2" />

        {/* Masquerade Mask */}
        <path d="M20,38 C28,34 38,40 42,44 C46,40 56,34 64,38 C66,50 56,56 42,52 C28,56 18,50 20,38 Z" fill="#831843" stroke="#f472b6" strokeWidth="1" />
        <ellipse cx="30" cy="44" rx="4" ry="3" fill="#0f050d" />
        <ellipse cx="54" cy="44" rx="4" ry="3" fill="#0f050d" />
        <circle cx="31" cy="44" r="1.5" fill="#ec4899" />
        <circle cx="53" cy="44" r="1.5" fill="#ec4899" />

        {/* Lips */}
        <path d="M36,65 Q42,62 48,65 Q42,70 36,65 Z" fill="#e11d48" />

        {/* Dark Rose Collar */}
        <circle cx="42" cy="94" r="12" fill="#be185d" stroke="#f472b6" strokeWidth="1.2" />
        <path d="M38,90 Q42,86 46,90 Q42,98 38,90 Z" fill="#fda4af" />
      </g>

      {/* Title */}
      <text x="80" y="196" fill="#fbcfe8" fontSize="12" fontWeight="900" textAnchor="middle" letterSpacing="3">KIZ</text>
    </svg>
  );
}

export function AceIllustration() {
  return (
    <svg viewBox="0 0 160 230" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="aceBg" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#0c1f2d" />
          <stop offset="70%" stopColor="#050e15" />
          <stop offset="100%" stopColor="#020508" />
        </radialGradient>
        <linearGradient id="aceGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#bae6fd" />
          <stop offset="50%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="160" height="230" rx="14" fill="url(#aceBg)" />
      <rect x="4" y="4" width="152" height="222" rx="10" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
      <rect x="7" y="7" width="146" height="216" rx="8" fill="none" stroke="#0369a1" strokeWidth="0.8" />

      {/* Top Left Rank */}
      <text x="14" y="26" fill="#bae6fd" fontSize="20" fontWeight="900" fontFamily="sans-serif">A</text>
      <text x="14" y="38" fill="#38bdf8" fontSize="11" opacity="0.8">♠</text>

      {/* Bottom Right Rank */}
      <g transform="rotate(180, 80, 115)">
        <text x="14" y="26" fill="#bae6fd" fontSize="20" fontWeight="900" fontFamily="sans-serif">A</text>
        <text x="14" y="38" fill="#38bdf8" fontSize="11" opacity="0.8">♠</text>
      </g>

      {/* Central Grand Ace Emblem */}
      <g transform="translate(42, 60)">
        {/* Radiating Rays */}
        <circle cx="38" cy="45" r="34" fill="none" stroke="#38bdf8" strokeWidth="0.6" strokeDasharray="3,3" opacity="0.6" />
        
        {/* Large Ornate Spade */}
        <path d="M38,10 C38,10 58,34 58,48 C58,60 48,68 38,68 C28,68 18,60 18,48 C18,34 38,10 38,10 Z" fill="url(#aceGold)" stroke="#e0f2fe" strokeWidth="1.5" />
        <path d="M38,60 L32,78 L44,78 Z" fill="url(#aceGold)" stroke="#e0f2fe" strokeWidth="1.2" />

        {/* Inner Filigree Eye */}
        <circle cx="38" cy="48" r="8" fill="#082f49" stroke="#bae6fd" strokeWidth="1.5" />
        <circle cx="38" cy="48" r="3.5" fill="#f0f9ff" />
      </g>

      {/* Title */}
      <text x="80" y="196" fill="#bae6fd" fontSize="12" fontWeight="900" textAnchor="middle" letterSpacing="3">AS</text>
    </svg>
  );
}

export function JokerIllustration() {
  return (
    <svg viewBox="0 0 160 230" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="jokerBg" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#2b103e" />
          <stop offset="70%" stopColor="#150522" />
          <stop offset="100%" stopColor="#08010d" />
        </radialGradient>
        <linearGradient id="jokerNeon" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f0abfc" />
          <stop offset="50%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="160" height="230" rx="14" fill="url(#jokerBg)" />
      <rect x="4" y="4" width="152" height="222" rx="10" fill="none" stroke="#c084fc" strokeWidth="1.5" />
      <rect x="7" y="7" width="146" height="216" rx="8" fill="none" stroke="#6b21a8" strokeWidth="0.8" />

      {/* Top Left Rank */}
      <text x="14" y="24" fill="#f0abfc" fontSize="14" fontWeight="900" fontFamily="sans-serif">★</text>
      <text x="14" y="38" fill="#fbbf24" fontSize="11" opacity="0.9">🃏</text>

      {/* Bottom Right Rank */}
      <g transform="rotate(180, 80, 115)">
        <text x="14" y="24" fill="#f0abfc" fontSize="14" fontWeight="900" fontFamily="sans-serif">★</text>
        <text x="14" y="38" fill="#fbbf24" fontSize="11" opacity="0.9">🃏</text>
      </g>

      {/* Central Smiling Jester Skull Illustration */}
      <g transform="translate(36, 50)">
        {/* Jester Hat Left Horn */}
        <path d="M22,30 C12,18 0,16 -2,32 C-4,42 12,40 18,34" fill="#a855f7" stroke="#fbbf24" strokeWidth="1.2" />
        <circle cx="-2" cy="32" r="3.5" fill="#fbbf24" />

        {/* Jester Hat Center Horn */}
        <path d="M34,22 C36,4 48,0 52,12 C54,20 44,22 42,24" fill="#fbbf24" stroke="#c084fc" strokeWidth="1.2" />
        <circle cx="52" cy="12" r="3.5" fill="#f43f5e" />

        {/* Jester Hat Right Horn */}
        <path d="M58,30 C72,16 88,18 88,34 C88,44 74,40 68,34" fill="#f43f5e" stroke="#fbbf24" strokeWidth="1.2" />
        <circle cx="88" cy="34" r="3.5" fill="#fbbf24" />

        {/* Skull Head */}
        <path d="M20,32 C20,22 66,22 66,32 C66,54 68,68 56,76 L56,86 L30,86 L30,76 C18,68 20,54 20,32 Z" fill="#faf5ff" stroke="#581c87" strokeWidth="1.5" />

        {/* Diamond Eyes */}
        <polygon points="34,44 40,52 34,60 28,52" fill="#7e22ce" stroke="#f0abfc" strokeWidth="1" />
        <polygon points="52,44 58,52 52,60 46,52" fill="#7e22ce" stroke="#f0abfc" strokeWidth="1" />
        <circle cx="34" cy="52" r="2" fill="#facc15" />
        <circle cx="52" cy="52" r="2" fill="#facc15" />

        {/* Twisted Smiling Mouth */}
        <path d="M24,68 Q43,84 62,68 Q43,76 24,68 Z" fill="#1e1b4b" stroke="#f43f5e" strokeWidth="1.2" />
        {/* Teeth */}
        <line x1="30" y1="71" x2="30" y2="76" stroke="#faf5ff" strokeWidth="1.5" />
        <line x1="36" y1="73" x2="36" y2="78" stroke="#faf5ff" strokeWidth="1.5" />
        <line x1="43" y1="74" x2="43" y2="79" stroke="#faf5ff" strokeWidth="1.5" />
        <line x1="50" y1="73" x2="50" y2="78" stroke="#faf5ff" strokeWidth="1.5" />
        <line x1="56" y1="71" x2="56" y2="76" stroke="#faf5ff" strokeWidth="1.5" />

        {/* Jester Ruffled Collar */}
        <polygon points="16,88 28,102 36,90 44,104 52,90 60,102 72,88" fill="#c084fc" stroke="#fbbf24" strokeWidth="1" />
      </g>

      {/* Title */}
      <text x="80" y="196" fill="#f0abfc" fontSize="12" fontWeight="900" textAnchor="middle" letterSpacing="3">JOKER</text>
    </svg>
  );
}

export default function LiarsBarCard({
  card,
  isFaceDown = false,
  isSelected = false,
  onClick = null,
  isFlipping = false,
  revealResult = null, // { isValid: true | false }
  className = '',
  disabled = false,
  size = 'md' // 'sm' | 'md' | 'lg'
}) {
  const sizeClasses = {
    sm: 'w-16 h-24 sm:w-20 sm:h-28',
    md: 'w-24 h-36 sm:w-28 sm:h-40 md:w-32 md:h-44',
    lg: 'w-32 h-44 sm:w-36 sm:h-52 md:w-40 md:h-56'
  }[size] || 'w-28 h-40';

  const renderFront = () => {
    switch (card?.type) {
      case 'K':
        return <KingIllustration />;
      case 'Q':
        return <QueenIllustration />;
      case 'A':
        return <AceIllustration />;
      case 'JOKER':
        return <JokerIllustration />;
      default:
        return <CardBackIllustration />;
    }
  };

  return (
    <div
      onClick={!disabled && onClick ? onClick : undefined}
      style={{ perspective: '1000px' }}
      className={`relative inline-block transition-transform duration-200 select-none ${sizeClasses} ${
        !disabled && onClick ? 'cursor-pointer' : 'cursor-default'
      } ${
        isSelected ? '-translate-y-4 shadow-xl shadow-amber-500/40 ring-2 ring-amber-400 rounded-2xl' : 'hover:-translate-y-1'
      } ${className}`}
    >
      {/* 3D Card Container */}
      <div
        className={`w-full h-full relative transition-transform duration-700 rounded-2xl shadow-lg shadow-black/60`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFaceDown ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
      >
        {/* Front Face (Illustrated card) */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {renderFront()}

          {/* Reveal Result Badges */}
          {revealResult && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs flex items-center justify-center animate-fade-in">
              {revealResult.isValid ? (
                <div className="p-2 rounded-2xl bg-emerald-950/90 border-2 border-emerald-400 text-emerald-300 flex flex-col items-center shadow-lg shadow-emerald-500/50 animate-pop">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                  <span className="text-[10px] font-black uppercase mt-1 tracking-wider">DOĞRU</span>
                </div>
              ) : (
                <div className="p-2 rounded-2xl bg-rose-950/90 border-2 border-rose-500 text-rose-300 flex flex-col items-center shadow-lg shadow-rose-500/50 animate-pop">
                  <Flame className="w-8 h-8 text-rose-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase mt-1 tracking-wider">BLÖF!</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Back Face (Geometric gold foil back) */}
        <div
          className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <CardBackIllustration />
        </div>
      </div>
    </div>
  );
}
