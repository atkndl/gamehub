import React from 'react';
import { CheckCircle2, XCircle, Sparkles } from 'lucide-react';

/**
 * Classic, Instantly Recognizable Playing Cards for Liar's Bar
 * (King/Papaz ♠, Queen/Kız ♥, Ace/As ♠, Joker ★)
 * 100% Procedural SVG & CSS 3D - Zero External Assets!
 */

export function CardBackIllustration() {
  return (
    <svg viewBox="0 0 160 230" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="backBgGrad" cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="60%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </radialGradient>
        <pattern id="cardPattern" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <path d="M 0,0 L 16,0 M 0,0 L 0,16" stroke="#d97706" strokeWidth="0.8" fill="none" opacity="0.4" />
          <polygon points="8,4 12,8 8,12 4,8" fill="#f59e0b" opacity="0.35" />
        </pattern>
      </defs>

      {/* Card Base */}
      <rect x="0" y="0" width="160" height="230" rx="12" fill="url(#backBgGrad)" />

      {/* Outer White / Gold Margin */}
      <rect x="5" y="5" width="150" height="220" rx="8" fill="none" stroke="#f8fafc" strokeWidth="2.5" opacity="0.9" />
      <rect x="9" y="9" width="142" height="212" rx="6" fill="none" stroke="#d97706" strokeWidth="1.2" opacity="0.8" />

      {/* Pattern Field */}
      <rect x="12" y="12" width="136" height="206" rx="4" fill="url(#cardPattern)" />

      {/* Center Medallion */}
      <circle cx="80" cy="115" r="30" fill="#0f172a" stroke="#fbbf24" strokeWidth="2" />
      <circle cx="80" cy="115" r="26" fill="none" stroke="#d97706" strokeWidth="1" strokeDasharray="3,2" />

      {/* Center Spades & Crown Logo */}
      <path d="M80,98 C80,98 94,114 94,122 C94,128 88,132 80,132 C72,132 66,128 66,122 C66,114 80,98 80,98 Z" fill="#fbbf24" />
      <path d="M80,128 L76,138 L84,138 Z" fill="#fbbf24" />
      <polygon points="72,108 76,102 80,106 84,102 88,108 72,108" fill="#ef4444" />
    </svg>
  );
}

/**
 * Classic King of Spades (Papaz ♠)
 */
export function KingIllustration() {
  return (
    <svg viewBox="0 0 160 230" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cardPaper" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f8f6f0" />
        </linearGradient>
        <linearGradient id="kingGold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      {/* Ivory Paper Base */}
      <rect x="0" y="0" width="160" height="230" rx="12" fill="url(#cardPaper)" stroke="#cbd5e1" strokeWidth="1" />
      <rect x="5" y="5" width="150" height="220" rx="8" fill="none" stroke="#1e293b" strokeWidth="1.2" opacity="0.8" />

      {/* TOP-LEFT INDEX */}
      <g transform="translate(10, 14)">
        <text x="0" y="16" fill="#0f172a" fontSize="22" fontWeight="900" fontFamily="serif">K</text>
        <path d="M6,22 C6,22 13,32 13,37 C13,41 9.5,43 6,43 C2.5,43 -1,41 -1,37 C-1,32 6,22 6,22 Z" fill="#0f172a" />
        <path d="M6,40 L4,46 L8,46 Z" fill="#0f172a" />
      </g>

      {/* BOTTOM-RIGHT INDEX (180deg) */}
      <g transform="rotate(180, 80, 115) translate(10, 14)">
        <text x="0" y="16" fill="#0f172a" fontSize="22" fontWeight="900" fontFamily="serif">K</text>
        <path d="M6,22 C6,22 13,32 13,37 C13,41 9.5,43 6,43 C2.5,43 -1,41 -1,37 C-1,32 6,22 6,22 Z" fill="#0f172a" />
        <path d="M6,40 L4,46 L8,46 Z" fill="#0f172a" />
      </g>

      {/* INNER FRAME */}
      <rect x="28" y="24" width="104" height="182" rx="4" fill="#fafaf9" stroke="#94a3b8" strokeWidth="1" />

      {/* CENTER CLASSIC KING FIGURE */}
      <g transform="translate(42, 38)">
        {/* Ornate Gold Crown */}
        <polygon points="12,18 20,4 38,14 56,4 64,18 64,26 12,26" fill="url(#kingGold)" stroke="#78350f" strokeWidth="1.2" />
        <circle cx="20" cy="4" r="2.5" fill="#ef4444" />
        <circle cx="38" cy="14" r="3" fill="#3b82f6" />
        <circle cx="56" cy="4" r="2.5" fill="#ef4444" />
        <rect x="16" y="22" width="44" height="3" fill="#991b1b" />

        {/* King Face */}
        <ellipse cx="38" cy="38" rx="16" ry="14" fill="#ffedd5" stroke="#78350f" strokeWidth="1" />
        {/* Eyes */}
        <circle cx="32" cy="36" r="2" fill="#0f172a" />
        <circle cx="44" cy="36" r="2" fill="#0f172a" />
        {/* Eyebrows */}
        <path d="M29,32 Q32,30 35,32" stroke="#451a03" strokeWidth="1.5" fill="none" />
        <path d="M41,32 Q44,30 47,32" stroke="#451a03" strokeWidth="1.5" fill="none" />
        {/* Nose */}
        <path d="M38,36 L36,41 L40,41" stroke="#b45309" strokeWidth="1" fill="none" />
        {/* Classic King Moustache & Beard */}
        <path d="M26,43 Q38,40 50,43 Q38,58 26,43 Z" fill="#78350f" stroke="#451a03" strokeWidth="1" />

        {/* Royal Robes (Red, Gold & Ermine) */}
        <path d="M14,54 L62,54 L68,110 L8,110 Z" fill="#b91c1c" stroke="#7f1d1d" strokeWidth="1.2" />
        {/* Gold Brocade Robe Trim */}
        <path d="M30,54 L46,54 L48,110 L28,110 Z" fill="url(#kingGold)" stroke="#92400e" strokeWidth="1" />
        {/* Ermine Collar (White with black tails) */}
        <polygon points="10,54 28,68 48,68 66,54 58,50 18,50" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
        <circle cx="28" cy="62" r="1.5" fill="#0f172a" />
        <circle cx="38" cy="64" r="1.5" fill="#0f172a" />
        <circle cx="48" cy="62" r="1.5" fill="#0f172a" />

        {/* Golden Sword of State in Hand */}
        <g transform="translate(56, 42) rotate(18)">
          <rect x="0" y="8" width="4" height="42" fill="#94a3b8" stroke="#475569" strokeWidth="0.8" />
          <polygon points="2,0 0,8 4,8" fill="#cbd5e1" />
          <rect x="-4" y="8" width="12" height="3" fill="#f59e0b" stroke="#78350f" strokeWidth="0.8" />
          <circle cx="2" cy="54" r="3" fill="#f59e0b" />
        </g>
      </g>

      {/* Prominent Bottom Name Label */}
      <rect x="36" y="174" width="88" height="20" rx="5" fill="#0f172a" />
      <text x="80" y="188" fill="#fbbf24" fontSize="12" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="2">
        PAPAZ ♠
      </text>
    </svg>
  );
}

/**
 * Classic Queen of Hearts (Kız / Dam ♥)
 */
export function QueenIllustration() {
  return (
    <svg viewBox="0 0 160 230" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="queenPaper" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#fff1f2" />
        </linearGradient>
        <linearGradient id="queenGold" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="50%" stopColor="#fef08a" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      {/* Ivory/Rose Paper Base */}
      <rect x="0" y="0" width="160" height="230" rx="12" fill="url(#queenPaper)" stroke="#fecdd3" strokeWidth="1" />
      <rect x="5" y="5" width="150" height="220" rx="8" fill="none" stroke="#be123c" strokeWidth="1.2" opacity="0.8" />

      {/* TOP-LEFT INDEX */}
      <g transform="translate(10, 14)">
        <text x="0" y="16" fill="#e11d48" fontSize="22" fontWeight="900" fontFamily="serif">Q</text>
        <path d="M6,26 C6,26 1,21 1,17 C1,14.5 3,12.5 5.5,12.5 C7,12.5 8.5,13.5 9,14.8 C9.5,13.5 11,12.5 12.5,12.5 C15,12.5 17,14.5 17,17 C17,21 12,26 12,26 L6,32 Z" transform="scale(0.85) translate(-1, 8)" fill="#e11d48" />
      </g>

      {/* BOTTOM-RIGHT INDEX (180deg) */}
      <g transform="rotate(180, 80, 115) translate(10, 14)">
        <text x="0" y="16" fill="#e11d48" fontSize="22" fontWeight="900" fontFamily="serif">Q</text>
        <path d="M6,26 C6,26 1,21 1,17 C1,14.5 3,12.5 5.5,12.5 C7,12.5 8.5,13.5 9,14.8 C9.5,13.5 11,12.5 12.5,12.5 C15,12.5 17,14.5 17,17 C17,21 12,26 12,26 L6,32 Z" transform="scale(0.85) translate(-1, 8)" fill="#e11d48" />
      </g>

      {/* INNER FRAME */}
      <rect x="28" y="24" width="104" height="182" rx="4" fill="#fff5f5" stroke="#fda4af" strokeWidth="1" />

      {/* CENTER QUEEN FIGURE */}
      <g transform="translate(42, 38)">
        {/* Golden Queen Tiara */}
        <polygon points="16,20 22,6 32,16 38,4 44,16 54,6 60,20 16,20" fill="url(#queenGold)" stroke="#b45309" strokeWidth="1" />
        <circle cx="38" cy="4" r="3" fill="#e11d48" />
        <circle cx="22" cy="6" r="2" fill="#3b82f6" />
        <circle cx="54" cy="6" r="2" fill="#3b82f6" />

        {/* Queen Face & Golden Hair */}
        <path d="M20,24 C20,18 56,18 56,24 C58,34 56,48 50,56 L26,56 C20,48 18,34 20,24 Z" fill="#fed7aa" stroke="#c2410c" strokeWidth="1" />
        <path d="M18,22 Q26,38 20,54" stroke="#d97706" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M58,22 Q50,38 56,54" stroke="#d97706" strokeWidth="3" fill="none" strokeLinecap="round" />

        {/* Queen Eyes & Red Lips */}
        <ellipse cx="30" cy="34" rx="2.5" ry="1.8" fill="#1e293b" />
        <ellipse cx="46" cy="34" rx="2.5" ry="1.8" fill="#1e293b" />
        <path d="M34,44 Q38,48 42,44 Q38,42 34,44 Z" fill="#be123c" />

        {/* Royal Court Gown (Crimson & Gold Lace) */}
        <path d="M16,56 L60,56 L68,110 L8,110 Z" fill="#be123c" stroke="#881337" strokeWidth="1.2" />
        <path d="M30,56 L46,56 L48,110 L28,110 Z" fill="#f43f5e" stroke="#e11d48" strokeWidth="1" />
        {/* Gold Trim & Pearl Necklace */}
        <path d="M26,56 Q38,66 50,56" stroke="#fbbf24" strokeWidth="2" fill="none" />
        <circle cx="38" cy="63" r="2.5" fill="#fef08a" stroke="#d97706" strokeWidth="0.8" />

        {/* Holding Red Rose in Hand */}
        <g transform="translate(52, 65)">
          <path d="M4,10 Q2,24 6,36" stroke="#15803d" strokeWidth="2" fill="none" />
          <path d="M3,20 Q-4,18 2,14" fill="#22c55e" />
          {/* Rose blossom */}
          <circle cx="4" cy="8" r="7" fill="#e11d48" />
          <path d="M2,5 Q4,1 6,5 Q8,8 4,11 Q0,8 2,5 Z" fill="#fda4af" />
        </g>
      </g>

      {/* Prominent Bottom Name Label */}
      <rect x="36" y="174" width="88" height="20" rx="5" fill="#881337" />
      <text x="80" y="188" fill="#fecdd3" fontSize="12" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="2">
        KIZ ♥
      </text>
    </svg>
  );
}

/**
 * Classic Ace of Spades (As ♠)
 */
export function AceIllustration() {
  return (
    <svg viewBox="0 0 160 230" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="acePaper" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f8fafc" />
        </linearGradient>
      </defs>

      {/* Crisp White Paper Base */}
      <rect x="0" y="0" width="160" height="230" rx="12" fill="url(#acePaper)" stroke="#cbd5e1" strokeWidth="1" />
      <rect x="5" y="5" width="150" height="220" rx="8" fill="none" stroke="#0f172a" strokeWidth="1.2" opacity="0.85" />

      {/* TOP-LEFT INDEX */}
      <g transform="translate(10, 14)">
        <text x="0" y="16" fill="#0f172a" fontSize="22" fontWeight="900" fontFamily="serif">A</text>
        <path d="M6,22 C6,22 13,32 13,37 C13,41 9.5,43 6,43 C2.5,43 -1,41 -1,37 C-1,32 6,22 6,22 Z" fill="#0f172a" />
        <path d="M6,40 L4,46 L8,46 Z" fill="#0f172a" />
      </g>

      {/* BOTTOM-RIGHT INDEX (180deg) */}
      <g transform="rotate(180, 80, 115) translate(10, 14)">
        <text x="0" y="16" fill="#0f172a" fontSize="22" fontWeight="900" fontFamily="serif">A</text>
        <path d="M6,22 C6,22 13,32 13,37 C13,41 9.5,43 6,43 C2.5,43 -1,41 -1,37 C-1,32 6,22 6,22 Z" fill="#0f172a" />
        <path d="M6,40 L4,46 L8,46 Z" fill="#0f172a" />
      </g>

      {/* INNER FRAME */}
      <rect x="28" y="24" width="104" height="182" rx="4" fill="#fafafa" stroke="#94a3b8" strokeWidth="1" />

      {/* GIANT ICONIC ORNATE ACE OF SPADES */}
      <g transform="translate(80, 105)">
        {/* Subtle Radiating Rays */}
        <circle cx="0" cy="0" r="42" fill="none" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3,3" />

        {/* Large Ornate Spade */}
        <path d="M0,-42 C0,-42 34,-6 34,16 C34,34 18,44 0,44 C-18,44 -34,34 -34,16 C-34,-6 0,-42 0,-42 Z" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
        <path d="M0,36 L-9,56 L9,56 Z" fill="#0f172a" stroke="#334155" strokeWidth="1.2" />

        {/* Inner Filigree / Engraving Detail */}
        <circle cx="0" cy="14" r="10" fill="#1e293b" stroke="#f8fafc" strokeWidth="1.2" />
        <path d="M-6,14 L6,14 M0,8 L0,20" stroke="#f8fafc" strokeWidth="1" />
      </g>

      {/* Prominent Bottom Name Label */}
      <rect x="36" y="174" width="88" height="20" rx="5" fill="#0f172a" />
      <text x="80" y="188" fill="#f8fafc" fontSize="12" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="2">
        AS ♠
      </text>
    </svg>
  );
}

/**
 * Classic Colorful Court Jester (JOKER ★)
 */
export function JokerIllustration() {
  return (
    <svg viewBox="0 0 160 230" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="jokerPaper" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#faf5ff" />
        </linearGradient>
      </defs>

      {/* Light Violet Paper Base */}
      <rect x="0" y="0" width="160" height="230" rx="12" fill="url(#jokerPaper)" stroke="#d8b4fe" strokeWidth="1" />
      <rect x="5" y="5" width="150" height="220" rx="8" fill="none" stroke="#7e22ce" strokeWidth="1.2" opacity="0.8" />

      {/* TOP-LEFT INDEX */}
      <g transform="translate(8, 14)">
        <text x="0" y="14" fill="#7e22ce" fontSize="13" fontWeight="900" fontFamily="sans-serif">★</text>
        <text x="0" y="27" fill="#7e22ce" fontSize="10" fontWeight="900" fontFamily="sans-serif">J</text>
        <text x="0" y="38" fill="#7e22ce" fontSize="10" fontWeight="900" fontFamily="sans-serif">O</text>
        <text x="0" y="49" fill="#7e22ce" fontSize="10" fontWeight="900" fontFamily="sans-serif">K</text>
      </g>

      {/* BOTTOM-RIGHT INDEX (180deg) */}
      <g transform="rotate(180, 80, 115) translate(8, 14)">
        <text x="0" y="14" fill="#7e22ce" fontSize="13" fontWeight="900" fontFamily="sans-serif">★</text>
        <text x="0" y="27" fill="#7e22ce" fontSize="10" fontWeight="900" fontFamily="sans-serif">J</text>
        <text x="0" y="38" fill="#7e22ce" fontSize="10" fontWeight="900" fontFamily="sans-serif">O</text>
        <text x="0" y="49" fill="#7e22ce" fontSize="10" fontWeight="900" fontFamily="sans-serif">K</text>
      </g>

      {/* INNER FRAME */}
      <rect x="26" y="24" width="108" height="182" rx="4" fill="#faf5ff" stroke="#c084fc" strokeWidth="1" />

      {/* CENTER COLORFUL JESTER FIGURE */}
      <g transform="translate(42, 36)">
        {/* Jester Hat Left Horn (Purple & Gold Bell) */}
        <path d="M22,30 C10,14 -4,14 -4,30 C-4,40 10,38 18,34" fill="#7e22ce" stroke="#581c87" strokeWidth="1" />
        <circle cx="-4" cy="30" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />

        {/* Jester Hat Center Horn (Red & Gold Bell) */}
        <path d="M34,22 C36,4 48,-2 52,10 C54,18 44,20 40,24" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
        <circle cx="52" cy="10" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />

        {/* Jester Hat Right Horn (Yellow & Gold Bell) */}
        <path d="M58,30 C72,14 86,16 86,32 C86,42 72,38 66,34" fill="#eab308" stroke="#a16207" strokeWidth="1" />
        <circle cx="86" cy="32" r="3.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.8" />

        {/* Jester Smiling Face */}
        <ellipse cx="41" cy="46" rx="16" ry="15" fill="#fed7aa" stroke="#c2410c" strokeWidth="1" />
        {/* Smiling Eyes */}
        <path d="M31,43 Q35,39 39,43" stroke="#1e1b4b" strokeWidth="2" fill="none" />
        <path d="M43,43 Q47,39 51,43" stroke="#1e1b4b" strokeWidth="2" fill="none" />
        {/* Red Cheeks */}
        <circle cx="29" cy="49" r="3" fill="#f87171" opacity="0.6" />
        <circle cx="53" cy="49" r="3" fill="#f87171" opacity="0.6" />
        {/* Mischievous Smile */}
        <path d="M31,52 Q41,64 51,52 Q41,56 31,52 Z" fill="#991b1b" stroke="#7f1d1d" strokeWidth="1" />

        {/* Classic Checkered Jester Ruffle Collar */}
        <polygon points="12,68 24,84 32,70 41,86 50,70 58,84 70,68 41,64" fill="#a855f7" stroke="#6b21a8" strokeWidth="1" />
        <polygon points="20,68 28,78 36,68 46,78 54,68" fill="#facc15" />
        <circle cx="24" cy="84" r="2.5" fill="#facc15" />
        <circle cx="41" cy="86" r="2.5" fill="#facc15" />
        <circle cx="58" cy="84" r="2.5" fill="#facc15" />

        {/* Two Mini Cards Held in Hand */}
        <g transform="translate(18, 92) rotate(-15)">
          <rect x="0" y="0" width="16" height="24" rx="2" fill="#ffffff" stroke="#0f172a" strokeWidth="0.8" />
          <path d="M8,8 C8,8 12,13 12,15 C12,17 10,18 8,18 C6,18 4,17 4,15 C4,13 8,8 8,8 Z" fill="#0f172a" />
        </g>
        <g transform="translate(48, 88) rotate(15)">
          <rect x="0" y="0" width="16" height="24" rx="2" fill="#ffffff" stroke="#dc2626" strokeWidth="0.8" />
          <circle cx="8" cy="12" r="3" fill="#dc2626" />
        </g>
      </g>

      {/* Prominent Bottom Name Label */}
      <rect x="36" y="174" width="88" height="20" rx="5" fill="#581c87" />
      <text x="80" y="188" fill="#facc15" fontSize="12" fontWeight="900" fontFamily="sans-serif" textAnchor="middle" letterSpacing="2">
        JOKER ★
      </text>
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
    sm: 'w-14 h-20 sm:w-16 sm:h-23',
    md: 'w-18 h-26 sm:w-22 sm:h-32',
    lg: 'w-24 h-34 sm:w-28 sm:h-40'
  }[size] || 'w-18 h-26 sm:w-22 sm:h-32';

  const renderFace = () => {
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
        return <KingIllustration />;
    }
  };

  return (
    <div
      onClick={!disabled && onClick ? onClick : undefined}
      className={`relative ${sizeClasses} select-none transition-all duration-300 ease-out perspective-1000 ${
        onClick && !disabled ? 'cursor-pointer hover:-translate-y-2' : ''
      } ${isSelected ? '-translate-y-4 ring-3 ring-amber-400 shadow-xl shadow-amber-400/40 rounded-xl' : ''} ${className}`}
    >
      <div
        className={`w-full h-full rounded-xl transition-transform duration-500 transform-style-3d ${
          isFaceDown ? 'rotate-y-180' : 'rotate-y-0'
        } ${isFlipping ? 'animate-flip' : ''}`}
      >
        {/* Front Face */}
        <div className="absolute inset-0 w-full h-full rounded-xl backface-hidden shadow-lg shadow-black/40 overflow-hidden">
          {renderFace()}

          {/* Reveal Result Glow Overlay */}
          {revealResult && (
            <div
              className={`absolute inset-0 rounded-xl flex items-center justify-center backdrop-blur-2xs transition-all animate-fade-in ${
                revealResult.isValid
                  ? 'bg-emerald-500/25 ring-4 ring-emerald-500 shadow-xl shadow-emerald-500/50'
                  : 'bg-red-600/35 ring-4 ring-red-600 shadow-xl shadow-red-600/60 animate-pulse'
              }`}
            >
              <div className="p-2 rounded-full bg-black/80 text-white shadow-lg">
                {revealResult.isValid ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-500" />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 w-full h-full rounded-xl backface-hidden rotate-y-180 shadow-lg shadow-black/40 overflow-hidden">
          <CardBackIllustration />
        </div>
      </div>
    </div>
  );
}
