import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.join(__dirname, '..', 'public', 'assets', 'survival');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. M9 Pistol (Glock/M9 style with polymer grip, metallic slide, trigger guard)
const m9Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 110" width="160" height="110">
  <defs>
    <linearGradient id="m9-slide" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#475569" />
      <stop offset="50%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
    <linearGradient id="m9-barrel" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#64748b" />
      <stop offset="100%" stop-color="#334155" />
    </linearGradient>
    <linearGradient id="m9-grip" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
  </defs>
  <!-- Barrel tip -->
  <rect x="145" y="27" width="10" height="10" rx="1" fill="url(#m9-barrel)" stroke="#0f172a" stroke-width="1.5" />
  <!-- Main Slide -->
  <path d="M 22 24 L 145 24 L 145 42 L 20 42 L 20 28 Z" fill="url(#m9-slide)" stroke="#0f172a" stroke-width="2" />
  <!-- Slide Serrations (Rear) -->
  <line x1="28" y1="26" x2="28" y2="38" stroke="#64748b" stroke-width="2" />
  <line x1="33" y1="26" x2="33" y2="38" stroke="#64748b" stroke-width="2" />
  <line x1="38" y1="26" x2="38" y2="38" stroke="#64748b" stroke-width="2" />
  <!-- Ejection Port -->
  <rect x="75" y="25" width="22" height="7" fill="#0f172a" />
  <!-- Sights -->
  <rect x="23" y="19" width="5" height="5" fill="#e2e8f0" stroke="#0f172a" stroke-width="1" />
  <rect x="138" y="20" width="4" height="4" fill="#38bdf8" />
  <!-- Frame & Receiver -->
  <path d="M 22 42 L 135 42 L 132 52 L 72 52 L 68 62 L 52 62 L 54 48 L 22 48 Z" fill="#1e293b" stroke="#0f172a" stroke-width="2" />
  <!-- Trigger Guard -->
  <path d="M 72 52 C 72 70, 48 70, 48 52" fill="none" stroke="#475569" stroke-width="3" stroke-linecap="round" />
  <!-- Trigger -->
  <path d="M 60 54 Q 63 60, 56 63" fill="none" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round" />
  <!-- Grip / Handle -->
  <path d="M 32 48 L 54 48 L 44 98 L 20 95 Z" fill="url(#m9-grip)" stroke="#0f172a" stroke-width="2" />
  <!-- Grip Texture Lines -->
  <line x1="33" y1="58" x2="47" y2="58" stroke="#334155" stroke-width="2" />
  <line x1="31" y1="68" x2="45" y2="68" stroke="#334155" stroke-width="2" />
  <line x1="29" y1="78" x2="43" y2="78" stroke="#334155" stroke-width="2" />
  <line x1="27" y1="88" x2="41" y2="88" stroke="#334155" stroke-width="2" />
  <!-- Magazine Baseplate -->
  <rect x="18" y="94" width="28" height="6" rx="2" fill="#334155" stroke="#0f172a" stroke-width="1.5" />
</svg>`;

// 2. M870 Tactical Shotgun (Pump action shotgun, heat shield, wood/black synthetic stock, orange shell hints)
const m870Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 90" width="200" height="90">
  <defs>
    <linearGradient id="m870-metal" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#475569" />
      <stop offset="60%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#090d16" />
    </linearGradient>
    <linearGradient id="m870-pump" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ea580c" />
      <stop offset="100%" stop-color="#9a3412" />
    </linearGradient>
  </defs>
  <!-- Long Barrel -->
  <rect x="55" y="32" width="138" height="8" rx="1" fill="url(#m870-metal)" stroke="#090d16" stroke-width="1.5" />
  <!-- Magazine Tube below barrel -->
  <rect x="65" y="41" width="118" height="6" rx="1" fill="#334155" stroke="#0f172a" stroke-width="1" />
  <!-- Barrel Clamp -->
  <rect x="175" y="31" width="5" height="17" rx="1" fill="#64748b" />
  <!-- Front Bead Sight -->
  <circle cx="190" cy="30" r="2" fill="#fbbf24" />
  <!-- Pump Fore-end Ribbed Grip -->
  <rect x="105" y="38" width="45" height="12" rx="3" fill="url(#m870-pump)" stroke="#7c2d12" stroke-width="1.5" />
  <line x1="115" y1="38" x2="115" y2="50" stroke="#431407" stroke-width="1.5" />
  <line x1="123" y1="38" x2="123" y2="50" stroke="#431407" stroke-width="1.5" />
  <line x1="131" y1="38" x2="131" y2="50" stroke="#431407" stroke-width="1.5" />
  <line x1="139" y1="38" x2="139" y2="50" stroke="#431407" stroke-width="1.5" />
  <!-- Receiver Body -->
  <path d="M 50 30 L 85 30 L 85 48 L 50 48 Z" fill="url(#m870-metal)" stroke="#090d16" stroke-width="2" />
  <!-- Ejection port with 12G red shell visible -->
  <rect x="62" y="33" width="16" height="7" fill="#0f172a" />
  <rect x="64" y="34" width="11" height="5" rx="1" fill="#dc2626" />
  <rect x="75" y="34" width="2" height="5" fill="#eab308" />
  <!-- Trigger Guard & Trigger -->
  <path d="M 52 48 C 52 60, 40 60, 40 48" fill="none" stroke="#475569" stroke-width="2.5" />
  <path d="M 47 50 Q 48 55, 43 56" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" />
  <!-- Stock & Grip -->
  <path d="M 50 48 L 42 66 L 33 66 L 38 48 L 10 52 L 5 72 L 18 78 L 38 72 L 48 48 Z" fill="#1e293b" stroke="#090d16" stroke-width="2" />
  <!-- Rubber recoil pad -->
  <path d="M 5 72 L 18 78 L 16 83 L 3 77 Z" fill="#020617" />
</svg>`;

// 3. AK-47 Assault Rifle (Curved banana mag, wooden stock & handguard, gas tube)
const ak47Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 90" width="220" height="90">
  <defs>
    <linearGradient id="ak-wood" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#b45309" />
      <stop offset="50%" stop-color="#78350f" />
      <stop offset="100%" stop-color="#451a03" />
    </linearGradient>
    <linearGradient id="ak-metal" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#475569" />
      <stop offset="60%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#090d16" />
    </linearGradient>
  </defs>
  <!-- Wooden Buttstock -->
  <path d="M 6 52 L 35 40 L 52 40 L 50 56 L 28 68 L 6 65 Z" fill="url(#ak-wood)" stroke="#270f03" stroke-width="2" />
  <rect x="5" y="52" width="4" height="13" fill="#1e293b" />
  <!-- Pistol Grip -->
  <path d="M 55 52 L 68 52 L 62 76 L 50 74 Z" fill="url(#ak-wood)" stroke="#270f03" stroke-width="1.8" />
  <!-- Trigger Guard & Trigger -->
  <path d="M 69 52 C 69 64, 80 64, 80 52" fill="none" stroke="#475569" stroke-width="2" />
  <path d="M 75 54 Q 77 58, 72 60" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" />
  <!-- Receiver (Steel) -->
  <path d="M 50 36 L 115 36 L 115 50 L 50 50 Z" fill="url(#ak-metal)" stroke="#090d16" stroke-width="2" />
  <rect x="68" y="38" width="18" height="6" fill="#090d16" />
  <!-- Curved 7.62 Banana Magazine -->
  <path d="M 85 48 C 88 66, 104 76, 115 80 L 123 74 C 114 68, 100 58, 97 48 Z" fill="#1e293b" stroke="#ef4444" stroke-width="1.5" />
  <!-- Wooden Handguard -->
  <rect x="120" y="36" width="38" height="13" rx="2" fill="url(#ak-wood)" stroke="#270f03" stroke-width="2" />
  <line x1="126" y1="42" x2="152" y2="42" stroke="#270f03" stroke-width="2" />
  <!-- Gas Tube & Barrel -->
  <rect x="115" y="34" width="70" height="5" fill="#334155" stroke="#090d16" stroke-width="1" />
  <rect x="158" y="39" width="48" height="5" fill="url(#ak-metal)" stroke="#090d16" stroke-width="1.2" />
  <!-- Gas Block & Front Sight Post -->
  <path d="M 178 32 L 184 32 L 183 44 L 178 44 Z" fill="#1e293b" stroke="#090d16" stroke-width="1" />
  <path d="M 198 28 L 204 28 L 202 44 L 198 44 Z" fill="#1e293b" stroke="#090d16" stroke-width="1" />
  <circle cx="201" cy="28" r="1.5" fill="#ef4444" />
  <!-- Slanted Muzzle Brake -->
  <path d="M 206 39 L 214 38 L 212 44 L 206 44 Z" fill="#475569" stroke="#090d16" stroke-width="1" />
</svg>`;

// 4. M4A1 Tactical Carbine (Picatinny rails, collapsible stock, holographic/ACOG sight, flash hider)
const m4a1Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 90" width="220" height="90">
  <defs>
    <linearGradient id="m4-dark" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="50%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#090d16" />
    </linearGradient>
    <linearGradient id="m4-blue" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#1d4ed8" />
    </linearGradient>
  </defs>
  <!-- Collapsible Crane Stock & Buffer Tube -->
  <rect x="25" y="41" width="30" height="6" fill="#475569" />
  <path d="M 8 36 L 28 36 L 25 54 L 14 62 L 8 62 Z" fill="url(#m4-dark)" stroke="#090d16" stroke-width="2" />
  <!-- Modern Pistol Grip -->
  <path d="M 55 49 L 68 49 L 63 76 L 50 74 Z" fill="url(#m4-dark)" stroke="#090d16" stroke-width="1.8" />
  <!-- Lower & Upper Receiver -->
  <path d="M 50 36 L 110 36 L 110 49 L 50 49 Z" fill="url(#m4-dark)" stroke="#090d16" stroke-width="2" />
  <!-- Trigger Guard & Trigger -->
  <path d="M 68 49 C 68 60, 78 60, 78 49" fill="none" stroke="#475569" stroke-width="2" />
  <path d="M 74 51 Q 76 55, 71 57" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" />
  <!-- STANAG 5.56 Magazine (Metal ribbed) -->
  <path d="M 86 48 L 98 48 L 93 78 L 82 78 Z" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5" />
  <line x1="85" y1="60" x2="95" y2="60" stroke="#3b82f6" stroke-width="1" />
  <!-- Quad Rail Handguard -->
  <rect x="110" y="37" width="55" height="11" fill="#1e293b" stroke="#3b82f6" stroke-width="1.5" />
  <!-- Rail slots -->
  <line x1="116" y1="40" x2="116" y2="45" stroke="#64748b" stroke-width="2" />
  <line x1="124" y1="40" x2="124" y2="45" stroke="#64748b" stroke-width="2" />
  <line x1="132" y1="40" x2="132" y2="45" stroke="#64748b" stroke-width="2" />
  <line x1="140" y1="40" x2="140" y2="45" stroke="#64748b" stroke-width="2" />
  <line x1="148" y1="40" x2="148" y2="45" stroke="#64748b" stroke-width="2" />
  <line x1="156" y1="40" x2="156" y2="45" stroke="#64748b" stroke-width="2" />
  <!-- Tactical Optic Sight (Red Dot / Holo) -->
  <rect x="72" y="27" width="28" height="9" rx="2" fill="#0f172a" stroke="#3b82f6" stroke-width="1.5" />
  <circle cx="86" cy="31" r="3" fill="#ef4444" />
  <!-- Barrel & Gas Block Front Sight -->
  <rect x="165" y="40" width="38" height="5" fill="#475569" stroke="#090d16" stroke-width="1" />
  <path d="M 172 32 L 178 32 L 176 45 L 172 45 Z" fill="#1e293b" stroke="#090d16" stroke-width="1" />
  <!-- Birdcage Flash Hider -->
  <rect x="203" y="39" width="10" height="7" rx="1" fill="#64748b" stroke="#090d16" stroke-width="1" />
</svg>`;

// 5. Mosin-Nagant Sniper Rifle (Long vintage wood stock, bolt handle, sniper scope with crosshair)
const mosinSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 85" width="240" height="85">
  <defs>
    <linearGradient id="mosin-wood" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#451a03" />
      <stop offset="40%" stop-color="#78350f" />
      <stop offset="100%" stop-color="#92400e" />
    </linearGradient>
    <linearGradient id="mosin-scope" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#6b21a8" />
      <stop offset="50%" stop-color="#3b0764" />
      <stop offset="100%" stop-color="#0f172a" />
    </linearGradient>
  </defs>
  <!-- Full-length Wooden Stock -->
  <path d="M 6 52 L 28 42 L 56 42 L 68 46 L 195 44 L 195 48 L 78 52 L 58 64 L 38 64 L 6 62 Z" fill="url(#mosin-wood)" stroke="#1c0a02" stroke-width="2" />
  <rect x="5" y="52" width="4" height="10" fill="#1e293b" />
  <!-- Steel Barrel -->
  <rect x="120" y="39" width="108" height="4.5" fill="#334155" stroke="#090d16" stroke-width="1" />
  <!-- Barrel Rings -->
  <rect x="150" y="38" width="3" height="7" fill="#64748b" />
  <rect x="185" y="38" width="3" height="7" fill="#64748b" />
  <!-- Front Hooded Sight -->
  <circle cx="224" cy="38" r="3" fill="none" stroke="#a855f7" stroke-width="1.5" />
  <line x1="224" y1="38" x2="224" y2="43.5" stroke="#a855f7" stroke-width="1.5" />
  <!-- Receiver & Bolt Handle -->
  <rect x="68" y="37" width="52" height="9" fill="#1e293b" stroke="#090d16" stroke-width="1.5" />
  <circle cx="82" cy="35" r="3" fill="#e2e8f0" stroke="#090d16" stroke-width="1" />
  <line x1="82" y1="35" x2="82" y2="42" stroke="#e2e8f0" stroke-width="2" />
  <!-- Magazine Box & Trigger Guard -->
  <rect x="76" y="46" width="16" height="8" rx="1" fill="#0f172a" stroke="#a855f7" stroke-width="1.2" />
  <path d="M 68 46 C 68 55, 76 55, 76 46" fill="none" stroke="#475569" stroke-width="2" />
  <path d="M 72 48 Q 74 52, 70 53" fill="none" stroke="#f59e0b" stroke-width="1.8" stroke-linecap="round" />
  <!-- PU High-Power Sniper Scope Mounted on Top -->
  <rect x="64" y="24" width="60" height="9" rx="3" fill="url(#mosin-scope)" stroke="#a855f7" stroke-width="1.5" />
  <rect x="60" y="22" width="7" height="13" rx="1" fill="#581c87" stroke="#090d16" stroke-width="1" />
  <rect x="120" y="22" width="7" height="13" rx="1" fill="#581c87" stroke="#090d16" stroke-width="1" />
  <!-- Scope Mount Brackets -->
  <rect x="74" y="33" width="5" height="5" fill="#334155" />
  <rect x="108" y="33" width="5" height="5" fill="#334155" />
  <circle cx="123" cy="28.5" r="2.5" fill="#c084fc" />
</svg>`;

// 6. MP5 Submachine Gun (Compact curved 9mm mag, classic handguard, retractable stock)
const mp5Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 190 90" width="190" height="90">
  <defs>
    <linearGradient id="mp5-body" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="50%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#090d16" />
    </linearGradient>
    <linearGradient id="mp5-green" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#047857" />
    </linearGradient>
  </defs>
  <!-- Retractable Wire Stock -->
  <line x1="12" y1="40" x2="48" y2="40" stroke="#64748b" stroke-width="3" />
  <rect x="8" y="34" width="5" height="16" rx="2" fill="#0f172a" />
  <!-- Lower Receiver & Ergonomic Grip -->
  <path d="M 48 48 L 60 48 L 54 74 L 42 72 Z" fill="url(#mp5-body)" stroke="#090d16" stroke-width="1.8" />
  <!-- Trigger Guard & Red-accent Trigger -->
  <path d="M 60 48 C 60 59, 70 59, 70 48" fill="none" stroke="#475569" stroke-width="2" />
  <path d="M 65 50 Q 67 54, 62 56" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" />
  <!-- Upper Receiver -->
  <rect x="48" y="34" width="70" height="15" fill="url(#mp5-body)" stroke="#090d16" stroke-width="2" />
  <!-- Curved 9mm Magazine -->
  <path d="M 75 48 C 76 60, 84 72, 92 78 L 99 74 C 92 68, 86 58, 84 48 Z" fill="#0f172a" stroke="#10b981" stroke-width="1.5" />
  <!-- MP5 Ribbed Tropical Foregrip -->
  <path d="M 118 36 L 148 36 L 145 52 L 118 48 Z" fill="#020617" stroke="#10b981" stroke-width="1.5" />
  <!-- Diopter Rear Drum Sight & Hooded Front Sight -->
  <circle cx="56" cy="30" r="3.5" fill="#334155" stroke="#090d16" stroke-width="1" />
  <circle cx="160" cy="30" r="4" fill="none" stroke="#10b981" stroke-width="1.5" />
  <rect x="145" y="38" width="22" height="5" fill="#475569" stroke="#090d16" stroke-width="1" />
  <!-- 3-Lug Barrel tip -->
  <rect x="167" y="38" width="6" height="5" fill="#0f172a" stroke="#10b981" stroke-width="1" />
</svg>`;

// 7. Tactical Helmet Level 1, 2, 3
const helmetL1Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <linearGradient id="helm-l1" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#475569" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
  </defs>
  <!-- Outer Dome -->
  <path d="M 15 55 C 15 25, 85 25, 85 55 L 85 64 L 75 66 L 70 58 L 30 58 L 25 66 L 15 64 Z" fill="url(#helm-l1)" stroke="#0f172a" stroke-width="3" />
  <!-- Rim highlight -->
  <path d="M 18 55 C 22 30, 78 30, 82 55" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2" />
  <!-- Chinstrap -->
  <path d="M 28 62 Q 50 82, 72 62" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" />
  <!-- Level 1 Badge -->
  <circle cx="50" cy="45" r="9" fill="#10b981" />
  <text x="50" y="49" font-family="monospace" font-size="11" font-weight="900" fill="#ffffff" text-anchor="middle">L1</text>
</svg>`;

const helmetL2Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <linearGradient id="helm-l2" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
  </defs>
  <!-- Kevlar PASGT Shell -->
  <path d="M 14 54 C 14 20, 86 20, 86 54 L 88 66 L 74 68 L 70 56 L 30 56 L 26 68 L 12 66 Z" fill="url(#helm-l2)" stroke="#3b82f6" stroke-width="3" />
  <!-- Night Vision Mount Plate -->
  <rect x="42" y="32" width="16" height="12" rx="2" fill="#334155" stroke="#3b82f6" stroke-width="1.5" />
  <!-- Side Accessory Rail -->
  <line x1="20" y1="52" x2="35" y2="52" stroke="#64748b" stroke-width="3" />
  <line x1="65" y1="52" x2="80" y2="52" stroke="#64748b" stroke-width="3" />
  <!-- Chinstrap -->
  <path d="M 26 64 Q 50 86, 74 64" fill="none" stroke="#3b82f6" stroke-width="3" stroke-linecap="round" />
  <!-- Level 2 Badge -->
  <circle cx="50" cy="45" r="9" fill="#3b82f6" />
  <text x="50" y="49" font-family="monospace" font-size="11" font-weight="900" fill="#ffffff" text-anchor="middle">L2</text>
</svg>`;

const helmetL3Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <linearGradient id="helm-l3" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#3b0764" />
      <stop offset="50%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <linearGradient id="visor-glass" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.9" />
      <stop offset="50%" stop-color="#a855f7" stop-opacity="0.7" />
      <stop offset="100%" stop-color="#38bdf8" stop-opacity="0.9" />
    </linearGradient>
  </defs>
  <!-- Spetsnaz / Altyn Titanium Heavy Shell -->
  <path d="M 12 50 C 12 16, 88 16, 88 50 L 88 74 L 76 78 L 24 78 L 12 74 Z" fill="url(#helm-l3)" stroke="#a855f7" stroke-width="3.5" />
  <!-- Full Bulletproof Face Shield Visor (Glass Slit) -->
  <path d="M 20 48 L 80 48 L 78 68 L 22 68 Z" fill="url(#visor-glass)" stroke="#e2e8f0" stroke-width="2" />
  <!-- Visor Reflection Sheen -->
  <line x1="26" y1="52" x2="48" y2="64" stroke="rgba(255,255,255,0.7)" stroke-width="2" stroke-linecap="round" />
  <!-- Visor Heavy Hinges -->
  <circle cx="16" cy="52" r="4" fill="#a855f7" stroke="#000" stroke-width="1.5" />
  <circle cx="84" cy="52" r="4" fill="#a855f7" stroke="#000" stroke-width="1.5" />
  <!-- Level 3 Badge -->
  <circle cx="50" cy="30" r="9" fill="#a855f7" stroke="#ffffff" stroke-width="1.5" />
  <text x="50" y="34" font-family="monospace" font-size="11" font-weight="900" fill="#ffffff" text-anchor="middle">L3</text>
</svg>`;

// 8. Body Armor Vest Level 1, 2, 3
const vestL1Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <path d="M 28 20 L 40 20 L 45 32 L 55 32 L 60 20 L 72 20 L 78 40 L 74 78 L 26 78 L 22 40 Z" fill="#334155" stroke="#10b981" stroke-width="2.5" />
  <rect x="36" y="44" width="28" height="24" rx="3" fill="#1e293b" stroke="#10b981" stroke-width="1.5" />
  <text x="50" y="60" font-family="monospace" font-size="12" font-weight="900" fill="#10b981" text-anchor="middle">L1</text>
</svg>`;

const vestL2Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <path d="M 26 18 L 40 18 L 44 30 L 56 30 L 60 18 L 74 18 L 82 38 L 76 82 L 24 82 L 18 38 Z" fill="#1e293b" stroke="#3b82f6" stroke-width="3" />
  <!-- MOLLE pouches & Ceramic Plate Insert -->
  <rect x="32" y="38" width="36" height="30" rx="3" fill="#0f172a" stroke="#3b82f6" stroke-width="2" />
  <line x1="32" y1="48" x2="68" y2="48" stroke="#3b82f6" stroke-width="1.5" />
  <line x1="32" y1="58" x2="68" y2="58" stroke="#3b82f6" stroke-width="1.5" />
  <text x="50" y="76" font-family="monospace" font-size="11" font-weight="900" fill="#3b82f6" text-anchor="middle">L2 ARMOR</text>
</svg>`;

const vestL3Svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <path d="M 24 16 L 40 16 L 43 28 L 57 28 L 60 16 L 76 16 L 86 36 L 80 86 L 20 86 L 14 36 Z" fill="#0f172a" stroke="#a855f7" stroke-width="3.5" />
  <!-- Heavy Duty Ballistic Collar & Shoulder Pauldrons -->
  <rect x="12" y="32" width="14" height="18" rx="2" fill="#581c87" stroke="#a855f7" stroke-width="1.5" />
  <rect x="74" y="32" width="14" height="18" rx="2" fill="#581c87" stroke="#a855f7" stroke-width="1.5" />
  <!-- High Density Steel-Ceramic Plate -->
  <rect x="30" y="36" width="40" height="36" rx="4" fill="#1e1b4b" stroke="#a855f7" stroke-width="2" />
  <circle cx="50" cy="54" r="10" fill="#a855f7" />
  <text x="50" y="58" font-family="monospace" font-size="11" font-weight="900" fill="#ffffff" text-anchor="middle">L3</text>
</svg>`;

// 9. Medkit (Tactical First Aid Trauma Case)
const medkitSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <linearGradient id="med-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#15803d" />
      <stop offset="100%" stop-color="#166534" />
    </linearGradient>
  </defs>
  <!-- Hard Case Handle -->
  <path d="M 38 24 L 38 16 Q 38 12, 44 12 L 56 12 Q 62 12, 62 16 L 62 24" fill="none" stroke="#0f172a" stroke-width="4" stroke-linecap="round" />
  <!-- Box Body -->
  <rect x="14" y="24" width="72" height="60" rx="8" fill="url(#med-grad)" stroke="#0f172a" stroke-width="3" />
  <!-- Latches -->
  <rect x="26" y="22" width="8" height="6" rx="1" fill="#e2e8f0" />
  <rect x="66" y="22" width="8" height="6" rx="1" fill="#e2e8f0" />
  <!-- Big Red Cross in White Circle -->
  <circle cx="50" cy="54" r="19" fill="#ffffff" stroke="#0f172a" stroke-width="2" />
  <rect x="45" y="42" width="10" height="24" rx="2" fill="#dc2626" />
  <rect x="38" y="49" width="24" height="10" rx="2" fill="#dc2626" />
</svg>`;

// 10. Bandage Roll
const bandageSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <linearGradient id="band-grad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#cbd5e1" />
    </linearGradient>
  </defs>
  <!-- Roll Cylinder -->
  <ellipse cx="44" cy="50" rx="28" ry="32" fill="url(#band-grad)" stroke="#475569" stroke-width="3" />
  <ellipse cx="44" cy="50" rx="18" ry="22" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2" />
  <ellipse cx="44" cy="50" rx="8" ry="10" fill="#334155" />
  <!-- Unrolling Strip -->
  <path d="M 54 22 C 70 20, 84 35, 86 52 L 86 68 C 80 55, 68 45, 52 45 Z" fill="#f8fafc" stroke="#475569" stroke-width="2.5" />
  <!-- Red Cross Clip -->
  <circle cx="78" cy="58" r="8" fill="#ffffff" stroke="#dc2626" stroke-width="1.5" />
  <rect x="76" y="53" width="4" height="10" fill="#dc2626" />
  <rect x="73" y="56" width="10" height="4" fill="#dc2626" />
</svg>`;

// 11. Energy Drink Soda Can
const sodaSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <linearGradient id="soda-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#0284c7" />
      <stop offset="40%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#0369a1" />
    </linearGradient>
  </defs>
  <!-- Can Rim Top -->
  <ellipse cx="50" cy="18" rx="22" ry="7" fill="#cbd5e1" stroke="#334155" stroke-width="2" />
  <ellipse cx="50" cy="17" rx="14" ry="4" fill="#94a3b8" />
  <!-- Pull Tab -->
  <ellipse cx="50" cy="17" rx="6" ry="2" fill="#e2e8f0" stroke="#0f172a" stroke-width="1" />
  <!-- Can Body -->
  <path d="M 28 18 L 28 80 C 28 86, 72 86, 72 80 L 72 18 Z" fill="url(#soda-grad)" stroke="#334155" stroke-width="2.5" />
  <!-- Can Base -->
  <ellipse cx="50" cy="80" rx="22" ry="6" fill="#cbd5e1" stroke="#334155" stroke-width="2" />
  <!-- Energy Lightning Bolt Icon -->
  <polygon points="53,30 40,48 48,48 44,68 62,45 53,45" fill="#facc15" stroke="#ca8a04" stroke-width="1.5" />
  <text x="50" y="74" font-family="monospace" font-size="9" font-weight="900" fill="#ffffff" text-anchor="middle">BOOST</text>
</svg>`;

// 12. Tactical Scope (2x, 4x, 8x, 15x)
function makeScopeSvg(label, color) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <radialGradient id="lens-${label}">
      <stop offset="0%" stop-color="#0284c7" stop-opacity="0.9" />
      <stop offset="70%" stop-color="#0369a1" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#082f49" stop-opacity="1" />
    </radialGradient>
  </defs>
  <!-- Outer Scope Bell Ring -->
  <circle cx="50" cy="50" r="42" fill="#0f172a" stroke="${color}" stroke-width="4" />
  <circle cx="50" cy="50" r="36" fill="url(#lens-${label})" stroke="#334155" stroke-width="2" />
  <!-- Tactical Reticle Crosshairs -->
  <line x1="50" y1="16" x2="50" y2="84" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" />
  <line x1="16" y1="50" x2="84" y2="50" stroke="rgba(255,255,255,0.7)" stroke-width="1.5" />
  <circle cx="50" cy="50" r="14" fill="none" stroke="${color}" stroke-width="1.5" stroke-dasharray="3,3" />
  <circle cx="50" cy="50" r="2.5" fill="#ef4444" />
  <!-- Scope Magnification Label -->
  <rect x="36" y="66" width="28" height="14" rx="3" fill="rgba(15, 23, 42, 0.9)" stroke="${color}" stroke-width="1" />
  <text x="50" y="77" font-family="monospace" font-size="11" font-weight="900" fill="${color}" text-anchor="middle">${label}</text>
</svg>`;
}

const assets = {
  'm9.svg': m9Svg,
  'm870.svg': m870Svg,
  'ak47.svg': ak47Svg,
  'm4a1.svg': m4a1Svg,
  'mosin.svg': mosinSvg,
  'mp5.svg': mp5Svg,
  'helmet1.svg': helmetL1Svg,
  'helmet2.svg': helmetL2Svg,
  'helmet3.svg': helmetL3Svg,
  'vest1.svg': vestL1Svg,
  'vest2.svg': vestL2Svg,
  'vest3.svg': vestL3Svg,
  'medkit.svg': medkitSvg,
  'bandage.svg': bandageSvg,
  'soda.svg': sodaSvg,
  'scope2x.svg': makeScopeSvg('2x', '#38bdf8'),
  'scope4x.svg': makeScopeSvg('4x', '#818cf8'),
  'scope8x.svg': makeScopeSvg('8x', '#a855f7'),
  'scope15x.svg': makeScopeSvg('15x', '#f43f5e')
};

for (const [filename, content] of Object.entries(assets)) {
  fs.writeFileSync(path.join(outDir, filename), content.trim());
}

console.log(`Generated ${Object.keys(assets).length} high-fidelity procedural game assets in ${outDir}`);
