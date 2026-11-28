/**
 * Survival (2D Battle Royale & Deathmatch Engine)
 * GameHub 2.0 - Inspired by survev.io & PUBG 2D
 * Massive 4200x4200 Open World Arena with Containers, Buildings, Trees, Rocks, Explosive Barrels & Ponds
 */

export const MAP_SIZE = 4200; // Expanded to a massive 4200 x 4200 px open world!

export const WEAPONS = {
  fists: {
    id: 'fists',
    name: 'Yumruk',
    icon: '👊',
    damage: 24,
    fireDelay: 250, // ms
    bulletSpeed: 0,
    range: 50,
    magSize: Infinity,
    reloadTime: 0,
    isMelee: true,
    bulletCount: 1,
    spread: 0,
    ammoType: null,
    length: 12
  },
  m9: {
    id: 'm9',
    name: 'M9 Tabanca',
    icon: '🔫',
    damage: 16, // Hafif tabanca hasarı
    fireDelay: 150, // Seri yarı-otomatik
    bulletSpeed: 21,
    range: 560, // Kısa menzil
    magSize: 15,
    reloadTime: 2800, // 2.8 saniye şarjör doldurma
    isMelee: false,
    bulletCount: 1,
    spread: 0.07,
    ammoType: '9mm',
    color: '#fbbf24',
    length: 22
  },
  m870: {
    id: 'm870',
    name: 'M870 Pompalı',
    icon: '💥',
    damage: 14, // 8 saçma * 14 = 112 yakın mesafe ölümcül burst!
    fireDelay: 850, // Yavaş pompa kurma
    bulletSpeed: 20,
    range: 420, // En kısa menzil, geniş saçılma
    magSize: 5,
    reloadTime: 3200, // 3.2 saniye
    isMelee: false,
    bulletCount: 8,
    spread: 0.28,
    ammoType: '12g',
    color: '#f97316',
    length: 34
  },
  ak47: {
    id: 'ak47',
    name: 'AK-47',
    icon: '⚡',
    damage: 34, // Ağır 7.62 vuruş gücü (Zırhsıza 3 vuruşta ölüm!)
    fireDelay: 140, // Güçlü ama kontrollü seri atış
    bulletSpeed: 27,
    range: 1150, // Orta-uzun menzil
    magSize: 30,
    reloadTime: 3000, // 3.0 saniye
    isMelee: false,
    bulletCount: 1,
    spread: 0.085,
    ammoType: '762',
    color: '#ef4444',
    length: 38
  },
  m4a1: {
    id: 'm4a1',
    name: 'M4A1',
    icon: '🎯',
    damage: 23, // Dengeli 5.56 hasarı
    fireDelay: 95, // Hızlı seri atış
    bulletSpeed: 31, // Çok hızlı mermi
    range: 1250, // Uzun menzil
    magSize: 30,
    reloadTime: 2800, // 2.8 saniye
    isMelee: false,
    bulletCount: 1,
    spread: 0.035, // Lazer gibi nokta isabet
    ammoType: '556',
    color: '#3b82f6',
    length: 36
  },
  mosin: {
    id: 'mosin',
    name: 'Mosin Keskin Nişancı',
    icon: '🔭',
    damage: 95, // Devasa tek atış hasarı (Neredeyse tekte indiren bolt-action)
    fireDelay: 1400, // Yavaş kurma
    bulletSpeed: 52, // Işık hızında mermi
    range: 2800, // Ekranın tamamını ve dürbün mesafesini kapsayan maksimum menzil
    magSize: 5,
    reloadTime: 3400, // 3.4 saniye
    isMelee: false,
    bulletCount: 1,
    spread: 0.003, // Kusursuz keskin nişancı isabeti
    ammoType: '762',
    color: '#a855f7',
    length: 46
  },
  mp5: {
    id: 'mp5',
    name: 'MP5 Hafif Makineli',
    icon: '🔥',
    damage: 14, // Düşük tek mermi hasarı
    fireDelay: 75, // Çok seri otomatik (saniyede 13 mermi!)
    bulletSpeed: 23,
    range: 680, // Kısa-orta menzil
    magSize: 30,
    reloadTime: 2900, // 2.9 saniye
    isMelee: false,
    bulletCount: 1,
    spread: 0.12,
    ammoType: '9mm',
    color: '#10b981',
    length: 28
  },
  grenade: {
    id: 'grenade',
    name: 'El Bombası',
    icon: '💣',
    damage: 135,
    fireDelay: 800,
    bulletSpeed: 0,
    range: 650,
    magSize: Infinity,
    reloadTime: 0,
    isMelee: false,
    isGrenade: true,
    bulletCount: 1,
    spread: 0,
    ammoType: 'grenade',
    length: 14
  }
};

export const SCOPES = {
  '1x': { id: '1x', name: '1x Görüş', zoom: 1.65, fov: 900 },
  '2x': { id: '2x', name: '2x Dürbün', zoom: 1.35, fov: 1350 },
  '4x': { id: '4x', name: '4x Dürbün', zoom: 1.05, fov: 1950 },
  '8x': { id: '8x', name: '8x Dürbün', zoom: 0.80, fov: 2900 }
};

export const ARMORS = {
  1: { level: 1, name: 'Seviye 1 Yelek', reduction: 0.25, maxVest: 50, bonusVest: 50, icon: '🦺' },
  2: { level: 2, name: 'Seviye 2 Yelek', reduction: 0.35, maxVest: 75, bonusVest: 75, icon: '🦺' },
  3: { level: 3, name: 'Seviye 3 Yelek (Nadir)', reduction: 0.45, maxVest: 100, bonusVest: 100, icon: '🛡️' }
};

export const HELMETS = {
  1: { level: 1, name: 'Seviye 1 Kask', bonusHp: 20, reduction: 0.15, icon: '🪖' },
  2: { level: 2, name: 'Seviye 2 Kask', bonusHp: 35, reduction: 0.25, icon: '🪖' },
  3: { level: 3, name: 'Seviye 3 Kask (Nadir)', bonusHp: 50, reduction: 0.35, icon: '⛑️' }
};

function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Slide-and-push circle out of rectangle obstacle so player NEVER gets stuck!
 */
function resolveCircleRectCollision(p, rx, ry, rw, rh) {
  const nearestX = Math.max(rx, Math.min(p.x, rx + rw));
  const nearestY = Math.max(ry, Math.min(p.y, ry + rh));
  const distX = p.x - nearestX;
  const distY = p.y - nearestY;
  const distSq = distX * distX + distY * distY;

  if (distSq < p.radius * p.radius) {
    const dist = Math.sqrt(distSq);
    if (dist > 0.001) {
      const overlap = p.radius - dist;
      p.x += (distX / dist) * overlap;
      p.y += (distY / dist) * overlap;
    } else {
      // Circle center inside rect: push along shortest edge
      const leftDist = Math.abs(p.x - rx);
      const rightDist = Math.abs(p.x - (rx + rw));
      const topDist = Math.abs(p.y - ry);
      const bottomDist = Math.abs(p.y - (ry + rh));
      const minD = Math.min(leftDist, rightDist, topDist, bottomDist);
      if (minD === leftDist) p.x = rx - p.radius - 0.5;
      else if (minD === rightDist) p.x = rx + rw + p.radius + 0.5;
      else if (minD === topDist) p.y = ry - p.radius - 0.5;
      else p.y = ry + rh + p.radius + 0.5;
    }
    return true;
  }
  return false;
}

/**
 * Circle to circle pushout
 */
function resolveCircleCircleCollision(p, cx, cy, cRadius) {
  const dx = p.x - cx;
  const dy = p.y - cy;
  const minDist = p.radius + cRadius;
  const distSq = dx * dx + dy * dy;

  if (distSq < minDist * minDist) {
    const dist = Math.sqrt(distSq) || 0.001;
    const overlap = minDist - dist;
    p.x += (dx / dist) * overlap;
    p.y += (dy / dist) * overlap;
    return true;
  }
  return false;
}

export class SurvivalSession {
  constructor(roomCode, playersList, config = {}) {
    this.roomCode = roomCode;
    this.mode = config.mode || 'battle_royale';
    this.matchDuration = config.matchDuration || 180;
    this.startTime = Date.now();
    this.endTime = this.mode === 'deathmatch' ? this.startTime + this.matchDuration * 1000 : null;
    this.isGameOver = false;
    this.leaderboard = [];

    this.mapSize = MAP_SIZE;

    // Red Zone (Alan Modu)
    this.zone = {
      x: MAP_SIZE / 2,
      y: MAP_SIZE / 2,
      currentRadius: MAP_SIZE * 0.62,
      targetRadius: MAP_SIZE * 0.62,
      phase: 0,
      nextPhaseTime: Date.now() + 20000,
      damagePerSecond: 3
    };

    // Environmental Objects
    this.obstacles = []; // Rectangles (walls, buildings, crates, containers)
    this.circularObstacles = []; // Circles (rocks, trees, barrels)
    this.bushes = [];
    this.ponds = [];
    this.loot = [];
    this.bullets = [];
    this.thrownGrenades = []; // Active flying/cooking grenades
    this.explosions = [];

    // Moving Atmospheric Fog & Stealth Clouds
    this.clouds = [
      { id: 1, x: 800, y: 1200, radius: 250, vx: 0.35, vy: 0.12, opacity: 0.88 },
      { id: 2, x: 1900, y: 600, radius: 290, vx: 0.42, vy: 0.15, opacity: 0.92 },
      { id: 3, x: 3100, y: 1400, radius: 270, vx: 0.38, vy: 0.10, opacity: 0.85 },
      { id: 4, x: 1200, y: 2600, radius: 310, vx: 0.45, vy: 0.18, opacity: 0.90 },
      { id: 5, x: 2600, y: 2400, radius: 280, vx: 0.36, vy: 0.14, opacity: 0.87 },
      { id: 6, x: 3500, y: 3200, radius: 300, vx: 0.40, vy: 0.12, opacity: 0.91 },
      { id: 7, x: 600, y: 3400, radius: 260, vx: 0.33, vy: 0.16, opacity: 0.86 },
      { id: 8, x: 2200, y: 3600, radius: 290, vx: 0.44, vy: 0.11, opacity: 0.89 },
      { id: 9, x: 1500, y: 1800, radius: 270, vx: 0.39, vy: 0.13, opacity: 0.88 },
      { id: 10, x: 2800, y: 900, radius: 320, vx: 0.41, vy: 0.15, opacity: 0.93 },
      { id: 11, x: 500, y: 600, radius: 280, vx: 0.37, vy: 0.12, opacity: 0.87 },
      { id: 12, x: 3700, y: 1900, radius: 300, vx: 0.43, vy: 0.14, opacity: 0.90 }
    ];

    // Build rich diverse world map
    this.initMap();

    // Players setup
    this.players = {};
    const playerArray = Array.from(playersList);

    playerArray.forEach((p, idx) => {
      const spawn = this.getSpawnPosition(idx, playerArray.length);
      this.players[p.id] = {
        id: p.id,
        name: p.name || `Oyuncu ${idx + 1}`,
        avatar: p.avatar || '🎖️',
        x: spawn.x,
        y: spawn.y,
        radius: 20,
        angle: 0,
        hp: 100,
        maxHp: 100,
        vest: 0,
        vestLevel: 0,
        helmetLevel: 0,
        boost: 0,
        weapons: {
          primary: null,
          secondary: null,
          melee: { ...WEAPONS.fists }
        },
        activeSlot: 'melee',
        grenades: 2, // Starts with 2 tactical frag grenades!
        scope: '1x',
        ammo: {
          '9mm': 0,
          '12g': 0,
          '762': 0,
          '556': 0
        },
        heals: {
          bandage: 0,
          medkit: 0,
          soda: 0
        },
        kills: 0,
        damageDealt: 0,
        isAlive: true,
        lastShootTime: 0,
        lastMeleePunchHand: 1,
        isPunching: false,
        invulnerableUntil: Date.now() + 3000,
        respawnAt: null,
        movement: { x: 0, y: 0 },
        isShooting: false,
        healingItem: null,
        healingUntil: 0,
        inCloud: false
      };
    });
  }

  getSpawnPosition(idx, total) {
    const S = MAP_SIZE;
    // 8 distinct non-overlapping geographic sectors across 4200x4200 map
    const sectors = [
      { name: 'Kuzeybatı', minX: 550, maxX: 1450, minY: 550, maxY: 1450 },
      { name: 'Kuzey',     minX: 1800, maxX: 2400, minY: 550, maxY: 1100 },
      { name: 'Kuzeydoğu', minX: 2750, maxX: 3650, minY: 550, maxY: 1450 },
      { name: 'Doğu',      minX: 3100, maxX: 3650, minY: 1800, maxY: 2400 },
      { name: 'Güneydoğu', minX: 2750, maxX: 3650, minY: 2750, maxY: 3650 },
      { name: 'Güney',     minX: 1800, maxX: 2400, minY: 3100, maxY: 3650 },
      { name: 'Güneybatı', minX: 550, maxX: 1450, minY: 2750, maxY: 3650 },
      { name: 'Batı',      minX: 550, maxX: 1100, minY: 1800, maxY: 2400 }
    ];

    if (!this.shuffledSectors) {
      this.shuffledSectors = [...sectors].sort(() => Math.random() - 0.5);
    }

    const assignedSector = this.shuffledSectors[idx % this.shuffledSectors.length];

    // Try up to 60 candidates inside this player's assigned sector
    for (let attempt = 0; attempt < 60; attempt++) {
      const candX = assignedSector.minX + Math.random() * (assignedSector.maxX - assignedSector.minX);
      const candY = assignedSector.minY + Math.random() * (assignedSector.maxY - assignedSector.minY);

      // Check distance to ALL other already-spawned players (MINIMUM 750px distance - NEVER DIPDIPE!)
      let tooClose = false;
      if (this.players) {
        for (const existingPlayer of Object.values(this.players)) {
          if (existingPlayer && existingPlayer.x && existingPlayer.y) {
            if (distance(candX, candY, existingPlayer.x, existingPlayer.y) < 750) {
              tooClose = true;
              break;
            }
          }
        }
      }
      if (tooClose) continue;

      // Check collision with obstacles (houses, walls, containers, crates)
      let collides = false;
      const safeBuffer = 50;
      if (Array.isArray(this.obstacles)) {
        for (const ob of this.obstacles) {
          if (
            candX >= ob.x - safeBuffer &&
            candX <= ob.x + ob.w + safeBuffer &&
            candY >= ob.y - safeBuffer &&
            candY <= ob.y + ob.h + safeBuffer
          ) {
            collides = true;
            break;
          }
        }
      }
      if (collides) continue;

      // Check circular obstacles (trees, rocks, barrels)
      if (Array.isArray(this.circularObstacles)) {
        for (const cob of this.circularObstacles) {
          if (distance(candX, candY, cob.x, cob.y) < cob.radius + safeBuffer) {
            collides = true;
            break;
          }
        }
      }
      if (collides) continue;

      // Check water ponds (don't spawn in water)
      if (Array.isArray(this.ponds)) {
        for (const pond of this.ponds) {
          if (distance(candX, candY, pond.x, pond.y) < pond.radius + 35) {
            collides = true;
            break;
          }
        }
      }
      if (collides) continue;

      return { x: candX, y: candY };
    }

    // High quality sector centers that are open clearings
    return {
      x: (assignedSector.minX + assignedSector.maxX) / 2 + (Math.random() * 80 - 40),
      y: (assignedSector.minY + assignedSector.maxY) / 2 + (Math.random() * 80 - 40)
    };
  }

  initMap() {
    const S = MAP_SIZE;

    // 1. Boundary Perimeter Walls
    const borderThick = 40;
    this.obstacles.push(
      { id: 'wall_top', type: 'wall', x: 0, y: -borderThick, w: S, h: borderThick, hp: Infinity },
      { id: 'wall_bottom', type: 'wall', x: 0, y: S, w: S, h: borderThick, hp: Infinity },
      { id: 'wall_left', type: 'wall', x: -borderThick, y: 0, w: borderThick, h: S, hp: Infinity },
      { id: 'wall_right', type: 'wall', x: S, y: 0, w: borderThick, h: S, hp: Infinity }
    );

    // 2. Concrete Bunker Compounds & Brick Houses with Doorways
    const buildHouseWithDoor = (id, x, y, size = 220) => {
      const wallT = 16;
      const doorW = 56;
      // Top wall
      this.obstacles.push({ id: `${id}_top`, type: 'stone', x, y, w: size, h: wallT, hp: Infinity });
      // Left wall
      this.obstacles.push({ id: `${id}_left`, type: 'stone', x, y, w: wallT, h: size, hp: Infinity });
      // Right wall
      this.obstacles.push({ id: `${id}_right`, type: 'stone', x: x + size - wallT, y, w: wallT, h: size, hp: Infinity });
      // Bottom wall split by doorway
      const remainingW = (size - doorW) / 2;
      this.obstacles.push({ id: `${id}_bot1`, type: 'stone', x, y: y + size - wallT, w: remainingW, h: wallT, hp: Infinity });
      this.obstacles.push({ id: `${id}_bot2`, type: 'stone', x: x + remainingW + doorW, y: y + size - wallT, w: remainingW, h: wallT, hp: Infinity });

      // Inside house crate loot
      this.obstacles.push({
        id: `${id}_crate`,
        type: 'crate',
        x: x + size / 2 - 25,
        y: y + size / 2 - 25,
        w: 50,
        h: 50,
        hp: 60,
        maxHp: 60
      });
    };

    // Place 6 distinct military/residential compounds across the map
    buildHouseWithDoor('house_nw', 800, 800, 240);
    buildHouseWithDoor('house_ne', 3100, 800, 240);
    buildHouseWithDoor('house_sw', 800, 3100, 240);
    buildHouseWithDoor('house_se', 3100, 3100, 240);
    buildHouseWithDoor('house_mid_north', 2000, 950, 260);
    buildHouseWithDoor('house_mid_south', 2000, 3000, 260);

    // Center Bunker (Large Fortified Outpost)
    const cX = S / 2;
    const cY = S / 2;
    this.obstacles.push(
      { id: 'bunker_nw', type: 'stone', x: cX - 180, y: cY - 180, w: 90, h: 90, hp: Infinity },
      { id: 'bunker_ne', type: 'stone', x: cX + 90, y: cY - 180, w: 90, h: 90, hp: Infinity },
      { id: 'bunker_sw', type: 'stone', x: cX - 180, y: cY + 90, w: 90, h: 90, hp: Infinity },
      { id: 'bunker_se', type: 'stone', x: cX + 90, y: cY + 90, w: 90, h: 90, hp: Infinity }
    );

    // 3. Shipping Containers (Konteyner Parkı)
    const containerColors = ['#2563eb', '#dc2626', '#d97706', '#16a34a', '#475569'];
    const containerSpawns = [
      // Cluster 1 (West Yard)
      { x: 1400, y: 1500, w: 120, h: 54 },
      { x: 1400, y: 1600, w: 120, h: 54 },
      { x: 1560, y: 1450, w: 54, h: 120 },
      { x: 1560, y: 1620, w: 54, h: 120 },
      // Cluster 2 (East Yard)
      { x: 2650, y: 1500, w: 120, h: 54 },
      { x: 2650, y: 1600, w: 120, h: 54 },
      { x: 2500, y: 1450, w: 54, h: 120 },
      { x: 2500, y: 1620, w: 54, h: 120 },
      // Cluster 3 (South Port)
      { x: 1800, y: 2400, w: 120, h: 54 },
      { x: 1980, y: 2400, w: 120, h: 54 },
      { x: 2160, y: 2400, w: 120, h: 54 },
      { x: 2340, y: 2400, w: 120, h: 54 }
    ];

    containerSpawns.forEach((ct, idx) => {
      this.obstacles.push({
        id: `container_${idx}`,
        type: 'container',
        color: containerColors[idx % containerColors.length],
        x: ct.x,
        y: ct.y,
        w: ct.w,
        h: ct.h,
        hp: Infinity
      });
    });

    // 4. Circular Obstacles: Trees (Trunk & Foliage) & Rocks & Explosive Barrels
    // A. Trees
    for (let i = 0; i < 65; i++) {
      const tx = 250 + Math.floor(Math.random() * (S - 500));
      const ty = 250 + Math.floor(Math.random() * (S - 500));
      this.circularObstacles.push({
        id: `tree_${i}`,
        type: 'tree',
        x: tx,
        y: ty,
        radius: 18, // Solid trunk
        canopyRadius: 58 + Math.floor(Math.random() * 16),
        hp: Infinity
      });
    }

    // B. Natural Stone Rocks
    for (let i = 0; i < 40; i++) {
      const rx = 300 + Math.floor(Math.random() * (S - 600));
      const ry = 300 + Math.floor(Math.random() * (S - 600));
      this.circularObstacles.push({
        id: `rock_${i}`,
        type: 'rock',
        x: rx,
        y: ry,
        radius: 32 + Math.floor(Math.random() * 22),
        hp: Infinity
      });
    }

    // C. Explosive Red Barrels (Patlayıcı Kırmızı Variller!)
    for (let i = 0; i < 28; i++) {
      const ex = 400 + Math.floor(Math.random() * (S - 800));
      const ey = 400 + Math.floor(Math.random() * (S - 800));
      this.circularObstacles.push({
        id: `barrel_${i}`,
        type: 'barrel',
        x: ex,
        y: ey,
        radius: 19,
        hp: 40,
        maxHp: 40
      });
    }

    // 5. Breakable Crates (Over 80 crates scattered)
    for (let i = 0; i < 85; i++) {
      const cx = 250 + Math.floor(Math.random() * (S - 500));
      const cy = 250 + Math.floor(Math.random() * (S - 500));
      this.obstacles.push({
        id: `crate_${i}`,
        type: 'crate',
        x: cx,
        y: cy,
        w: 52,
        h: 52,
        hp: 55,
        maxHp: 55
      });
    }

    // 6. Water Ponds (Göletler)
    this.ponds.push(
      { x: 1200, y: 2200, radius: 140 },
      { x: 3000, y: 2100, radius: 160 },
      { x: 2100, y: 1700, radius: 120 }
    );

    // 7. Bushes (Çalılar - 70+ Camouflage Bushes)
    for (let i = 0; i < 75; i++) {
      const bx = 200 + Math.floor(Math.random() * (S - 400));
      const by = 200 + Math.floor(Math.random() * (S - 400));
      this.bushes.push({
        id: `bush_${i}`,
        x: bx,
        y: by,
        radius: 48 + Math.floor(Math.random() * 22)
      });
    }

    // 8. Ground Loot Spawns (50+ weapons, scopes, armors, meds)
    const weaponKeys = ['ak47', 'm4a1', 'm870', 'mp5', 'mosin', 'm9'];
    for (let i = 0; i < 50; i++) {
      const lx = 300 + Math.floor(Math.random() * (S - 600));
      const ly = 300 + Math.floor(Math.random() * (S - 600));
      const wKey = weaponKeys[Math.floor(Math.random() * weaponKeys.length)];
      this.spawnLoot({
        x: lx,
        y: ly,
        type: 'weapon',
        itemKey: wKey,
        name: WEAPONS[wKey].name,
        icon: WEAPONS[wKey].icon
      });
    }

    // Scopes (2x, 4x, 8x - 8x is extremely rare)
    ['2x', '2x', '2x', '2x', '2x', '2x', '4x', '4x', '4x', '8x'].forEach(scopeKey => {
      this.spawnLoot({
        x: 400 + Math.floor(Math.random() * (S - 800)),
        y: 400 + Math.floor(Math.random() * (S - 800)),
        type: 'scope',
        itemKey: scopeKey,
        name: SCOPES[scopeKey].name,
        icon: '🔭'
      });
    });

    // Grenades (18 Tactical Frag Grenade loot drops)
    for (let i = 0; i < 18; i++) {
      const gx = 350 + Math.floor(Math.random() * (S - 700));
      const gy = 350 + Math.floor(Math.random() * (S - 700));
      this.spawnLoot({
        x: gx,
        y: gy,
        type: 'grenade',
        count: 2,
        name: 'El Bombası (x2)',
        icon: '💣'
      });
    }

    // Armors, Helmets, Meds
    for (let i = 0; i < 45; i++) {
      const lx = 350 + Math.floor(Math.random() * (S - 700));
      const ly = 350 + Math.floor(Math.random() * (S - 700));
      const roll = Math.random();
      if (roll < 0.28) {
        // Vest (65% Lvl 1, 25% Lvl 2, 10% Lvl 3)
        const vRoll = Math.random();
        const lvl = vRoll < 0.65 ? 1 : (vRoll < 0.90 ? 2 : 3);
        this.spawnLoot({ x: lx, y: ly, type: 'vest', level: lvl, name: ARMORS[lvl].name, icon: ARMORS[lvl].icon, maxVest: ARMORS[lvl].maxVest, bonusVest: ARMORS[lvl].bonusVest });
      } else if (roll < 0.52) {
        // Helmet (65% Lvl 1, 25% Lvl 2, 10% Lvl 3)
        const hRoll = Math.random();
        const lvl = hRoll < 0.65 ? 1 : (hRoll < 0.90 ? 2 : 3);
        this.spawnLoot({ x: lx, y: ly, type: 'helmet', level: lvl, name: HELMETS[lvl].name, icon: HELMETS[lvl].icon, bonusHp: HELMETS[lvl].bonusHp });
      } else if (roll < 0.75) {
        this.spawnLoot({ x: lx, y: ly, type: 'heal', itemKey: 'soda', name: 'Enerji İçeceği', icon: '🥤' });
      } else {
        this.spawnLoot({ x: lx, y: ly, type: 'heal', itemKey: 'medkit', name: 'İlk Yardım Çantası', icon: '🩹' });
      }
    }
  }

  spawnLoot(item) {
    this.loot.push({
      id: Math.random().toString(36).substring(2, 9),
      ...item
    });
  }

  destroyCrate(crate) {
    if (!crate) return;
    this.dropCrateLoot(crate);
    const idx = this.obstacles.indexOf(crate);
    if (idx !== -1) {
      this.obstacles.splice(idx, 1);
    }
  }

  destroyBarrel(barrel, events) {
    if (!barrel) return;
    const idx = this.circularObstacles.indexOf(barrel);
    if (idx !== -1) {
      this.circularObstacles.splice(idx, 1);
    }
    this.triggerBarrelExplosion(barrel, events);
  }

  dropCrateLoot(crate) {
    const drops = [];
    const roll = Math.random();
    if (roll < 0.45) {
      const wKeys = ['m870', 'ak47', 'm4a1', 'mp5', 'mosin'];
      const picked = wKeys[Math.floor(Math.random() * wKeys.length)];
      drops.push({ type: 'weapon', itemKey: picked, name: WEAPONS[picked].name, icon: WEAPONS[picked].icon });
      drops.push({ type: 'ammo', itemKey: WEAPONS[picked].ammoType, count: 40, name: `${WEAPONS[picked].ammoType.toUpperCase()} Mermi`, icon: '📦' });
    } else if (roll < 0.7) {
      const scopeRoll = Math.random();
      const s = scopeRoll < 0.65 ? '2x' : (scopeRoll < 0.94 ? '4x' : '8x');
      drops.push({ type: 'scope', itemKey: s, name: SCOPES[s].name, icon: '🔭' });
    } else if (roll < 0.85) {
      const isHelmet = Math.random() < 0.5;
      const lvlRoll = Math.random();
      const lvl = lvlRoll < 0.60 ? 1 : (lvlRoll < 0.88 ? 2 : 3);
      if (isHelmet) {
        drops.push({ type: 'helmet', level: lvl, name: HELMETS[lvl].name, icon: HELMETS[lvl].icon, bonusHp: HELMETS[lvl].bonusHp });
      } else {
        drops.push({ type: 'vest', level: lvl, name: ARMORS[lvl].name, icon: ARMORS[lvl].icon, maxVest: ARMORS[lvl].maxVest, bonusVest: ARMORS[lvl].bonusVest });
      }
    } else if (roll < 0.93) {
      drops.push({ type: 'grenade', count: 2, name: 'El Bombası (x2)', icon: '💣' });
    } else {
      drops.push({ type: 'heal', itemKey: 'medkit', name: 'İlk Yardım', icon: '🩹' });
      drops.push({ type: 'heal', itemKey: 'soda', name: 'Enerji İçeceği', icon: '🥤' });
    }

    drops.forEach((d, i) => {
      this.spawnLoot({
        x: crate.x + 26 + (i * 26 - 13),
        y: crate.y + 26 + (i * 12),
        ...d
      });
    });
  }

  triggerBarrelExplosion(barrel, events) {
    // Area of effect damage
    const aoeRadius = 160;
    const maxDamage = 85;

    // Damage nearby players
    for (const p of Object.values(this.players)) {
      if (!p.isAlive) continue;
      const d = distance(barrel.x, barrel.y, p.x, p.y);
      if (d < aoeRadius) {
        const falloff = 1 - (d / aoeRadius);
        const dmg = Math.round(maxDamage * falloff);
        this.damagePlayer(p, dmg, null, 'explosion', events);
      }
    }

    // Damage nearby crates
    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const ob = this.obstacles[i];
      if (ob.type === 'crate') {
        const d = distance(barrel.x, barrel.y, ob.x + ob.w / 2, ob.y + ob.h / 2);
        if (d < aoeRadius) {
          ob.hp -= 80;
          if (ob.hp <= 0) {
            this.destroyCrate(ob);
          }
        }
      }
    }

    events.push({
      type: 'explosion',
      x: barrel.x,
      y: barrel.y,
      radius: aoeRadius
    });
  }

  handlePlayerInput(playerId, data) {
    const p = this.players[playerId];
    if (!p || !p.isAlive) return;

    if (data.movement) {
      const mx = Math.max(-1, Math.min(1, data.movement.x || 0));
      const my = Math.max(-1, Math.min(1, data.movement.y || 0));
      const len = Math.sqrt(mx * mx + my * my);
      if (len > 0) {
        p.movement = { x: mx / len, y: my / len };
      } else {
        p.movement = { x: 0, y: 0 };
      }
    }

    if (typeof data.angle === 'number') {
      p.angle = data.angle;
    }

    if (typeof data.isShooting === 'boolean') {
      p.isShooting = data.isShooting;
    }

    if (data.action === 'reload') {
      this.reloadPlayerWeapon(p);
    } else if (data.action === 'switch_slot') {
      if (['primary', 'secondary', 'melee', 'grenade'].includes(data.slot)) {
        if (data.slot === 'secondary' && !p.weapons.secondary) {
          // If secondary is empty, don't switch to it
          return;
        }
        if (data.slot === 'grenade' && (p.grenades || 0) <= 0) {
          return;
        }
        p.activeSlot = data.slot;
      }
    } else if (data.action === 'throw_grenade') {
      if ((p.grenades || 0) > 0) {
        p.grenades -= 1;
        const fuseTime = Math.max(200, Math.min(3000, Number(data.fuseRemaining) || 3000));
        this.thrownGrenades.push({
          id: Math.random().toString(36).substring(2, 9),
          shooterId: p.id,
          x: p.x,
          y: p.y,
          vx: Math.max(-32, Math.min(32, Number(data.vx) || 0)),
          vy: Math.max(-32, Math.min(32, Number(data.vy) || 0)),
          fuseEndTime: Date.now() + fuseTime,
          radius: 230,
          damage: 135
        });
        if (p.grenades <= 0 && p.activeSlot === 'grenade') {
          p.activeSlot = p.weapons.primary ? 'primary' : 'melee';
        }
      }
    } else if (data.action === 'grenade_cook_explode') {
      // Grenade cooked for 3 seconds in hand: explodes right on the player!
      if ((p.grenades || 0) > 0) {
        p.grenades -= 1;
        this.explodeGrenadeAt(p.x, p.y, p.id, 230, 135, []);
        if (p.grenades <= 0 && p.activeSlot === 'grenade') {
          p.activeSlot = p.weapons.primary ? 'primary' : 'melee';
        }
      }
    } else if (data.action === 'use_heal') {
      this.useHealingItem(p, data.healType);
    } else if (data.action === 'pickup') {
      this.pickupNearestLoot(p);
    }
  }

  reloadPlayerWeapon(p) {
    const active = p.weapons[p.activeSlot];
    if (!active || active.isMelee || active.isReloading) return;
    if (active.ammo >= active.magSize) return;

    const availableAmmo = p.ammo[active.ammoType] || 0;
    if (availableAmmo <= 0) return;

    active.isReloading = true;
    active.reloadEndTime = Date.now() + active.reloadTime;
  }

  useHealingItem(p, type) {
    if (p.healingItem) return;
    if (type === 'bandage') {
      if (p.hp >= 75 || p.heals.bandage <= 0) return;
      p.healingItem = 'bandage';
      p.healingTotal = 2000;
      p.healingUntil = Date.now() + 2000;
    } else if (type === 'medkit') {
      if (p.hp >= 100 || p.heals.medkit <= 0) return;
      p.healingItem = 'medkit';
      p.healingTotal = 4500;
      p.healingUntil = Date.now() + 4500;
    } else if (type === 'soda') {
      if (p.boost >= 100 || p.heals.soda <= 0) return;
      p.healingItem = 'soda';
      p.healingTotal = 2000;
      p.healingUntil = Date.now() + 2000;
    }
  }

  recalculatePlayerMaxHp(p) {
    const baseHp = 100;
    const helmetBonus = (p.helmetLevel && HELMETS[p.helmetLevel]) ? HELMETS[p.helmetLevel].bonusHp : 0;
    const prevMax = p.maxHp || 100;
    const newMax = baseHp + helmetBonus;
    p.maxHp = newMax;
    // When maxHp increases from helmet, give the player the HP difference immediately!
    if (newMax > prevMax) {
      p.hp = Math.min(newMax, p.hp + (newMax - prevMax));
    } else if (p.hp > newMax) {
      p.hp = newMax;
    }
  }

  pickupNearestLoot(p) {
    // Find closest loot within 80px
    let closestItem = null;
    let closestDist = 80;
    let closestIndex = -1;

    for (let i = 0; i < this.loot.length; i++) {
      const item = this.loot[i];
      const d = distance(p.x, p.y, item.x, item.y);
      if (d <= closestDist) {
        closestDist = d;
        closestItem = item;
        closestIndex = i;
      }
    }

    if (!closestItem || closestIndex === -1) return;

    let dropItem = null;

    if (closestItem.type === 'weapon') {
      const wObj = { ...WEAPONS[closestItem.itemKey], ammo: closestItem.ammo ?? WEAPONS[closestItem.itemKey].magSize, isReloading: false };
      if (!p.weapons.primary) {
        p.weapons.primary = wObj;
        p.activeSlot = 'primary';
      } else if (!p.weapons.secondary) {
        p.weapons.secondary = wObj;
        p.activeSlot = 'secondary';
      } else {
        // Both gun slots full: replace currently active slot (or primary if melee)
        const targetSlot = p.activeSlot === 'secondary' ? 'secondary' : 'primary';
        const oldW = p.weapons[targetSlot];
        if (oldW && !oldW.isMelee) {
          dropItem = {
            type: 'weapon',
            itemKey: oldW.id,
            name: oldW.name,
            icon: oldW.icon,
            ammo: oldW.ammo
          };
        }
        p.weapons[targetSlot] = wObj;
      }
    } else if (closestItem.type === 'scope') {
      // If player already has a scope (other than default 1x), drop it back to the ground!
      if (p.scope && p.scope !== '1x') {
        dropItem = {
          type: 'scope',
          itemKey: p.scope,
          name: SCOPES[p.scope]?.name || `${p.scope} Dürbün`,
          icon: '🔭'
        };
      }
      p.scope = closestItem.itemKey;
    } else if (closestItem.type === 'vest') {
      // If player already has a vest, drop old vest with its remaining shield!
      if (p.vestLevel > 0) {
        dropItem = {
          type: 'vest',
          level: p.vestLevel,
          name: ARMORS[p.vestLevel].name,
          icon: ARMORS[p.vestLevel].icon,
          maxVest: ARMORS[p.vestLevel].maxVest,
          currentVest: p.vest
        };
      }
      p.vestLevel = closestItem.level;
      p.vest = closestItem.currentVest !== undefined ? closestItem.currentVest : ARMORS[closestItem.level].maxVest;
    } else if (closestItem.type === 'helmet') {
      // If player already has a helmet, drop old helmet!
      const oldLvl = p.helmetLevel || 0;
      if (oldLvl > 0) {
        dropItem = {
          type: 'helmet',
          level: oldLvl,
          name: HELMETS[oldLvl].name,
          icon: HELMETS[oldLvl].icon,
          bonusHp: HELMETS[oldLvl].bonusHp
        };
      }
      p.helmetLevel = closestItem.level;
      this.recalculatePlayerMaxHp(p);
    } else if (closestItem.type === 'heal') {
      if ((p.heals[closestItem.itemKey] || 0) < 5) {
        p.heals[closestItem.itemKey] = (p.heals[closestItem.itemKey] || 0) + 1;
      } else {
        return; // Full, don't consume
      }
    } else if (closestItem.type === 'ammo') {
      p.ammo[closestItem.itemKey] = (p.ammo[closestItem.itemKey] || 0) + (closestItem.count || 30);
    } else if (closestItem.type === 'grenade') {
      p.grenades = Math.min(6, (p.grenades || 0) + (closestItem.count || 2));
    }

    // Remove picked item from world
    this.loot.splice(closestIndex, 1);

    // If an equipped item was replaced, drop it right where the player is standing!
    if (dropItem) {
      this.spawnLoot({
        x: p.x + (Math.random() * 24 - 12),
        y: p.y + (Math.random() * 24 - 12),
        ...dropItem
      });
    }
  }

  updateZone(now) {
    if (this.mode !== 'battle_royale') return;

    if (now >= this.zone.nextPhaseTime) {
      this.zone.phase++;
      const minRadius = 120;
      const reduction = Math.max(minRadius, this.zone.currentRadius * 0.65);
      this.zone.targetRadius = reduction;

      const maxDrift = (this.zone.currentRadius - reduction) * 0.45;
      const driftAngle = Math.random() * Math.PI * 2;
      this.zone.x = Math.max(500, Math.min(MAP_SIZE - 500, this.zone.x + Math.cos(driftAngle) * maxDrift));
      this.zone.y = Math.max(500, Math.min(MAP_SIZE - 500, this.zone.y + Math.sin(driftAngle) * maxDrift));

      this.zone.nextPhaseTime = now + 25000;
      this.zone.damagePerSecond = 3 + this.zone.phase * 1.5;
    }

    if (this.zone.currentRadius > this.zone.targetRadius) {
      this.zone.currentRadius = Math.max(this.zone.targetRadius, this.zone.currentRadius - 0.9);
    }
  }

  tick(now = Date.now()) {
    if (this.isGameOver) {
      return { gameOver: true, leaderboard: this.leaderboard, state: this.getState() };
    }

    const events = [];

    // 1. Update Safe Zone
    this.updateZone(now);

    // 2. Process Players Movement & State
    for (const p of Object.values(this.players)) {
      if (!p.isAlive) {
        if (this.mode === 'deathmatch' && p.respawnAt && now >= p.respawnAt) {
          const spawn = this.getSpawnPosition(Math.floor(Math.random() * 8), 8);
          p.x = spawn.x;
          p.y = spawn.y;
          p.hp = 100;
          p.vest = 0;
          p.vestLevel = 0;
          p.isAlive = true;
          p.respawnAt = null;
          p.invulnerableUntil = now + 2500;
          p.weapons = {
            primary: null,
            secondary: null,
            melee: { ...WEAPONS.fists }
          };
          p.activeSlot = 'melee';
        }
        continue;
      }

      // Check if player is wading in a water pond (slight slowdown & lingering wetness)
      let inWater = false;
      for (const pond of this.ponds) {
        if (distance(p.x, p.y, pond.x, pond.y) < pond.radius) {
          inWater = true;
          break;
        }
      }

      if (inWater) {
        p.wetUntil = now + 4000; // Lingering wetness for 4 seconds after exiting water
      }
      const isWet = inWater || Boolean(p.wetUntil && now < p.wetUntil);
      p.inWater = inWater;
      p.isWet = isWet;

      // Deep water: 45% slow (0.55); Lingering wetness: 25% slow (0.75)
      let speedMultiplier = inWater ? 0.55 : (isWet ? 0.75 : 1.0);
      if (p.boost > 0) {
        speedMultiplier += (p.boost / 100) * 0.3; // up to +30% boost speed
        p.boost = Math.max(0, p.boost - 0.08);
        if (p.hp < p.maxHp) {
          p.hp = Math.min(p.maxHp, p.hp + 0.06);
        }
      }

      // Base agile speed (6.8 pixels per tick)
      const moveSpeed = 6.8 * speedMultiplier;
      p.x += p.movement.x * moveSpeed;
      p.y += p.movement.y * moveSpeed;

      // Keep within map boundaries
      p.x = Math.max(p.radius, Math.min(MAP_SIZE - p.radius, p.x));
      p.y = Math.max(p.radius, Math.min(MAP_SIZE - p.radius, p.y));

      // Resolve Rectangular Obstacles (Walls, Containers, Crates, Buildings)
      for (const ob of this.obstacles) {
        if (ob.type === 'crate') {
          // Crates shrink physically as they take damage!
          const hpRatio = Math.max(0.15, Math.min(1, (ob.hp / (ob.maxHp || 60))));
          const scale = 0.55 + 0.45 * hpRatio;
          const curW = ob.w * scale;
          const curH = ob.h * scale;
          const curX = ob.x + (ob.w - curW) / 2;
          const curY = ob.y + (ob.h - curH) / 2;
          resolveCircleRectCollision(p, curX, curY, curW, curH);
        } else {
          resolveCircleRectCollision(p, ob.x, ob.y, ob.w, ob.h);
        }
      }

      // Resolve Circular Obstacles (Trees, Rocks, Barrels)
      for (const cob of this.circularObstacles) {
        resolveCircleCircleCollision(p, cob.x, cob.y, cob.radius);
      }

      // Weapon reload completion
      const active = p.weapons[p.activeSlot];
      if (active && active.isReloading && now >= active.reloadEndTime) {
        const need = active.magSize - active.ammo;
        const avail = p.ammo[active.ammoType] || 0;
        const load = Math.min(need, avail);
        active.ammo += load;
        p.ammo[active.ammoType] -= load;
        active.isReloading = false;
      }

      // Healing progress
      if (p.healingItem && now >= p.healingUntil) {
        if (p.healingItem === 'bandage') {
          p.hp = Math.min(75, p.hp + 15);
          p.heals.bandage--;
        } else if (p.healingItem === 'medkit') {
          p.hp = 100;
          p.heals.medkit--;
        } else if (p.healingItem === 'soda') {
          p.boost = Math.min(100, p.boost + 50);
          p.heals.soda--;
        }
        p.healingItem = null;
      }

      // Safe Zone Damage (Alan Modu)
      if (this.mode === 'battle_royale') {
        const distFromCenter = distance(p.x, p.y, this.zone.x, this.zone.y);
        if (distFromCenter > this.zone.currentRadius) {
          const dmg = (this.zone.damagePerSecond / 25);
          p.hp -= dmg;
          if (p.hp <= 0) {
            p.hp = 0;
            this.eliminatePlayer(p, null, 'gas', events);
          }
        }
      }

      // Weapon Firing
      if (p.isShooting && active && !active.isReloading) {
        if (active.isMelee) {
          // Punch
          if (now - p.lastShootTime >= active.fireDelay) {
            p.lastShootTime = now;
            p.isPunching = true;
            p.lastMeleePunchHand *= -1;

            const punchDist = p.radius + active.range;
            const punchX = p.x + Math.cos(p.angle) * punchDist;
            const punchY = p.y + Math.sin(p.angle) * punchDist;

            // Punch other players
            for (const victim of Object.values(this.players)) {
              if (victim.id === p.id || !victim.isAlive) continue;
              if (now < victim.invulnerableUntil) continue;
              if (distance(punchX, punchY, victim.x, victim.y) <= victim.radius + 18) {
                this.damagePlayer(victim, active.damage, p, 'fists', events);
              }
            }

            // Punch crates
            for (let cIdx = this.obstacles.length - 1; cIdx >= 0; cIdx--) {
              const ob = this.obstacles[cIdx];
              if (ob.type === 'crate') {
                if (circleRectCollisionFast(punchX, punchY, 18, ob.x, ob.y, ob.w, ob.h)) {
                  ob.hp -= active.damage;
                  if (ob.hp <= 0) {
                    this.destroyCrate(ob);
                  }
                }
              }
            }

            // Punch barrels (triggers explosion!)
            for (let bIdx = this.circularObstacles.length - 1; bIdx >= 0; bIdx--) {
              const cob = this.circularObstacles[bIdx];
              if (cob.type === 'barrel') {
                if (distance(punchX, punchY, cob.x, cob.y) <= cob.radius + 18) {
                  cob.hp -= active.damage;
                  if (cob.hp <= 0) {
                    this.destroyBarrel(cob, events);
                  }
                }
              }
            }

            events.push({ type: 'punch', playerId: p.id });
          }
        } else if (active.ammo > 0) {
          // Gunshot
          if (now - p.lastShootTime >= active.fireDelay) {
            p.lastShootTime = now;
            active.ammo--;

            for (let b = 0; b < active.bulletCount; b++) {
              const spreadAngle = (Math.random() - 0.5) * active.spread;
              const finalAngle = p.angle + spreadAngle;
              const spawnOffset = p.radius + active.length;
              this.bullets.push({
                id: Math.random().toString(36).substring(2, 9),
                shooterId: p.id,
                x: p.x + Math.cos(p.angle) * spawnOffset,
                y: p.y + Math.sin(p.angle) * spawnOffset,
                vx: Math.cos(finalAngle) * active.bulletSpeed,
                vy: Math.sin(finalAngle) * active.bulletSpeed,
                damage: active.damage,
                rangeLeft: active.range,
                weaponId: active.id,
                color: active.color || '#fbbf24'
              });
            }

            events.push({ type: 'gunshot', weaponId: active.id, playerId: p.id });

            if (active.ammo <= 0) {
              this.reloadPlayerWeapon(p);
            }
          }
        } else {
          this.reloadPlayerWeapon(p);
        }
      }
    }

    // 3. Move & Resolve Bullets
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.x += b.vx;
      b.y += b.vy;
      const stepDist = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
      b.rangeLeft -= stepDist;

      let destroyed = false;

      if (b.x < 0 || b.x > MAP_SIZE || b.y < 0 || b.y > MAP_SIZE || b.rangeLeft <= 0) {
        destroyed = true;
      }

      // Check bullet hit on rectangular obstacles
      if (!destroyed) {
        for (const ob of this.obstacles) {
          if (b.x >= ob.x && b.x <= ob.x + ob.w && b.y >= ob.y && b.y <= ob.y + ob.h) {
            if (ob.type === 'container') {
              // Metal shipping container ricochet physics!
              b.ricochetCount = (b.ricochetCount || 0) + 1;
              b.hasRicocheted = true;

              if (b.ricochetCount > 3) {
                destroyed = true;
              } else {
                // Determine which face was hit based on previous position before tick step
                const prevX = b.x - b.vx;
                const prevY = b.y - b.vy;

                if (prevX <= ob.x) {
                  // Hit left face
                  b.vx = -Math.abs(b.vx);
                  b.x = ob.x - 2;
                } else if (prevX >= ob.x + ob.w) {
                  // Hit right face
                  b.vx = Math.abs(b.vx);
                  b.x = ob.x + ob.w + 2;
                } else if (prevY <= ob.y) {
                  // Hit top face
                  b.vy = -Math.abs(b.vy);
                  b.y = ob.y - 2;
                } else {
                  // Hit bottom face
                  b.vy = Math.abs(b.vy);
                  b.y = ob.y + ob.h + 2;
                }

                // Add slight acoustic deflection for authentic metal ricochet
                const deflection = (Math.random() - 0.5) * 0.12;
                const spd = Math.sqrt(b.vx * b.vx + b.vy * b.vy) * 0.94;
                const angle = Math.atan2(b.vy, b.vx) + deflection;
                b.vx = Math.cos(angle) * spd;
                b.vy = Math.sin(angle) * spd;

                events.push({
                  type: 'ricochet',
                  x: b.x,
                  y: b.y,
                  weaponId: b.weaponId
                });
              }
              break;
            } else {
              destroyed = true;
              if (ob.type === 'crate') {
                ob.hp -= b.damage;
                if (ob.hp <= 0) {
                  this.destroyCrate(ob);
                }
              }
              break;
            }
          }
        }
      }

      // Check bullet hit on circular obstacles (Trees, Rocks, Barrels)
      if (!destroyed) {
        for (const cob of this.circularObstacles) {
          if (distance(b.x, b.y, cob.x, cob.y) <= cob.radius) {
            destroyed = true;
            if (cob.type === 'barrel') {
              cob.hp -= b.damage;
              if (cob.hp <= 0) {
                this.destroyBarrel(cob, events);
              }
            }
            break;
          }
        }
      }

      // Check bullet hit on players (if bullet ricocheted, it can hit the shooter themselves!)
      if (!destroyed) {
        for (const victim of Object.values(this.players)) {
          if (!b.hasRicocheted && victim.id === b.shooterId) continue;
          if (!victim.isAlive) continue;
          if (now < victim.invulnerableUntil) continue;

          if (distance(b.x, b.y, victim.x, victim.y) <= victim.radius) {
            destroyed = true;
            const shooter = this.players[b.shooterId];
            this.damagePlayer(victim, b.damage, shooter, b.weaponId, events);
            break;
          }
        }
      }

      if (destroyed) {
        this.bullets.splice(i, 1);
      }
    }

    // 3b. Update Drifting Fog Clouds & Stealth
    for (const c of this.clouds) {
      c.x += c.vx;
      c.y += c.vy;
      if (c.x > MAP_SIZE + 350) c.x = -350;
      if (c.y > MAP_SIZE + 350) c.y = -350;
      if (c.x < -350) c.x = MAP_SIZE + 350;
      if (c.y < -350) c.y = MAP_SIZE + 350;
    }

    // Determine if each alive player is concealed inside a drifting cloud
    for (const p of Object.values(this.players)) {
      p.inCloud = p.isAlive && this.clouds.some(c => distance(p.x, p.y, c.x, c.y) <= c.radius * 0.95);
    }

    // 3c. Update Thrown Grenades (Flying / Bouncing / Fuse Detonation)
    for (let i = this.thrownGrenades.length - 1; i >= 0; i--) {
      const g = this.thrownGrenades[i];
      g.x += g.vx;
      g.y += g.vy;
      g.vx *= 0.94; // air & ground friction
      g.vy *= 0.94;

      // Bounce off map boundaries
      if (g.x < 25 || g.x > MAP_SIZE - 25) g.vx *= -0.7;
      if (g.y < 25 || g.y > MAP_SIZE - 25) g.vy *= -0.7;
      g.x = Math.max(25, Math.min(MAP_SIZE - 25, g.x));
      g.y = Math.max(25, Math.min(MAP_SIZE - 25, g.y));

      // Bounce off obstacles (containers, walls)
      for (const ob of this.obstacles) {
        if (circleRectCollisionFast(g.x, g.y, 8, ob.x, ob.y, ob.w, ob.h)) {
          g.vx *= -0.6;
          g.vy *= -0.6;
          break;
        }
      }

      // Detonation check: when fuse timer hits 0
      if (now >= g.fuseEndTime) {
        this.explodeGrenadeAt(g.x, g.y, g.shooterId, g.radius || 230, g.damage || 135, events);
        this.thrownGrenades.splice(i, 1);
      }
    }

    // Clean broken obstacles & exploded barrels
    this.obstacles = this.obstacles.filter(ob => ob.hp > 0);
    this.circularObstacles = this.circularObstacles.filter(cob => cob.hp > 0);

    // 4. Check End Game Conditions
    if (this.mode === 'battle_royale') {
      const allList = Object.values(this.players);
      const aliveList = allList.filter(p => p.isAlive);
      if (allList.length > 1 && aliveList.length <= 1) {
        this.isGameOver = true;
        this.leaderboard = this.buildLeaderboard();
      } else if (allList.length === 1 && aliveList.length === 0) {
        this.isGameOver = true;
        this.leaderboard = this.buildLeaderboard();
      }
    } else if (this.mode === 'deathmatch') {
      if (this.endTime && now >= this.endTime) {
        this.isGameOver = true;
        this.leaderboard = this.buildLeaderboard();
      }
    }

    return {
      gameOver: this.isGameOver,
      leaderboard: this.leaderboard,
      state: this.getState(),
      events
    };
  }

  explodeGrenadeAt(x, y, shooterId, radius = 230, maxDamage = 135, events = []) {
    events.push({
      type: 'explosion',
      x,
      y,
      radius,
      isGrenade: true
    });

    const shooter = this.players[shooterId];

    // Damage all players within explosion radius with distance falloff
    for (const victim of Object.values(this.players)) {
      if (!victim.isAlive) continue;
      const d = distance(x, y, victim.x, victim.y);
      if (d <= radius) {
        const falloff = 1 - (d / radius);
        const dmg = Math.round(maxDamage * Math.max(0.18, falloff));
        this.damagePlayer(victim, dmg, shooter, 'grenade', events);
      }
    }

    // Damage breakable wooden crates within blast radius
    for (const ob of this.obstacles) {
      if (ob.type === 'crate') {
        const cx = ob.x + ob.w / 2;
        const cy = ob.y + ob.h / 2;
        if (distance(x, y, cx, cy) <= radius) {
          ob.hp -= 70;
          if (ob.hp <= 0) {
            this.destroyCrate(ob);
          }
        }
      }
    }

    // Detonate explosive red barrels within blast radius (chain explosions!)
    for (const cob of this.circularObstacles) {
      if (cob.type === 'barrel') {
        if (distance(x, y, cob.x, cob.y) <= radius) {
          cob.hp = 0;
          this.destroyBarrel(cob, events);
        }
      }
    }
  }

  damagePlayer(victim, rawDmg, shooter, weaponId, events) {
    let finalDmg = rawDmg;

    // Helmet damage reduction
    if (victim.helmetLevel > 0 && HELMETS[victim.helmetLevel]) {
      finalDmg *= (1 - HELMETS[victim.helmetLevel].reduction);
    }

    // Vest armor damage absorption
    if (victim.vestLevel > 0 && victim.vest > 0 && ARMORS[victim.vestLevel]) {
      const red = ARMORS[victim.vestLevel].reduction;
      const absorbed = rawDmg * red;
      victim.vest = Math.max(0, victim.vest - absorbed);
      finalDmg -= absorbed;
    }

    victim.hp -= finalDmg;

    if (shooter) {
      shooter.damageDealt = (shooter.damageDealt || 0) + Math.round(finalDmg);
    }

    events.push({
      type: 'hit',
      victimId: victim.id,
      damage: Math.round(finalDmg),
      x: victim.x,
      y: victim.y
    });

    if (victim.hp <= 0) {
      victim.hp = 0;
      this.eliminatePlayer(victim, shooter, weaponId, events);
    }
  }

  eliminatePlayer(victim, killer, weaponId, events) {
    victim.isAlive = false;

    if (killer && killer.id !== victim.id) {
      killer.kills += 1;
    }

    if (victim.weapons.primary && !victim.weapons.primary.isMelee) {
      this.spawnLoot({
        x: victim.x + (Math.random() * 30 - 15),
        y: victim.y + (Math.random() * 30 - 15),
        type: 'weapon',
        itemKey: victim.weapons.primary.id,
        name: victim.weapons.primary.name,
        icon: victim.weapons.primary.icon,
        ammo: victim.weapons.primary.ammo
      });
    }

    if (victim.weapons.secondary && !victim.weapons.secondary.isMelee) {
      this.spawnLoot({
        x: victim.x + (Math.random() * 30 - 15),
        y: victim.y + (Math.random() * 30 - 15),
        type: 'weapon',
        itemKey: victim.weapons.secondary.id,
        name: victim.weapons.secondary.name,
        icon: victim.weapons.secondary.icon,
        ammo: victim.weapons.secondary.ammo
      });
    }

    if (victim.vestLevel > 0 && ARMORS[victim.vestLevel]) {
      this.spawnLoot({
        x: victim.x + (Math.random() * 30 - 15),
        y: victim.y + (Math.random() * 30 - 15),
        type: 'vest',
        level: victim.vestLevel,
        name: ARMORS[victim.vestLevel].name,
        icon: ARMORS[victim.vestLevel].icon,
        maxVest: ARMORS[victim.vestLevel].maxVest,
        currentVest: victim.vest
      });
    }

    if (victim.helmetLevel > 0 && HELMETS[victim.helmetLevel]) {
      this.spawnLoot({
        x: victim.x + (Math.random() * 30 - 15),
        y: victim.y + (Math.random() * 30 - 15),
        type: 'helmet',
        level: victim.helmetLevel,
        name: HELMETS[victim.helmetLevel].name,
        icon: HELMETS[victim.helmetLevel].icon,
        bonusHp: HELMETS[victim.helmetLevel].bonusHp
      });
    }

    if (victim.scope && victim.scope !== '1x') {
      this.spawnLoot({
        x: victim.x,
        y: victim.y,
        type: 'scope',
        itemKey: victim.scope,
        name: SCOPES[victim.scope].name,
        icon: '🔭'
      });
    }

    if (this.mode === 'deathmatch') {
      victim.respawnAt = Date.now() + 3000;
    }

    events.push({
      type: 'kill',
      victimId: victim.id,
      victimName: victim.name,
      killerId: killer ? killer.id : null,
      killerName: killer ? killer.name : (weaponId === 'gas' ? 'Kızıl Gaz Alanı' : (weaponId === 'explosion' ? 'Patlama' : 'Bilinmeyen')),
      weaponId
    });
  }

  buildLeaderboard() {
    const list = Object.values(this.players).map(p => ({
      playerId: p.id,
      name: p.name,
      avatar: p.avatar,
      kills: p.kills,
      damageDealt: p.damageDealt || 0,
      isAlive: p.isAlive,
      scope: p.scope
    }));

    if (this.mode === 'deathmatch') {
      list.sort((a, b) => b.kills !== a.kills ? b.kills - a.kills : b.damageDealt - a.damageDealt);
    } else {
      list.sort((a, b) => {
        if (a.isAlive !== b.isAlive) return a.isAlive ? -1 : 1;
        if (b.kills !== a.kills) return b.kills - a.kills;
        return b.damageDealt - a.damageDealt;
      });
    }

    return list.map((item, idx) => ({
      ...item,
      rank: idx + 1,
      isWinner: idx === 0
    }));
  }

  getState() {
    const now = Date.now();
    const isShrinking = this.zone ? this.zone.currentRadius > this.zone.targetRadius : false;
    const timeUntilNext = this.zone?.nextPhaseTime ? Math.max(0, Math.ceil((this.zone.nextPhaseTime - now) / 1000)) : 0;

    return {
      mode: this.mode,
      mapSize: this.mapSize,
      zone: this.zone ? {
        ...this.zone,
        isShrinking,
        timeUntilNext
      } : null,
      timeLeft: this.endTime ? Math.max(0, Math.ceil((this.endTime - now) / 1000)) : null,
      obstacles: this.obstacles,
      circularObstacles: this.circularObstacles,
      bushes: this.bushes,
      ponds: this.ponds,
      loot: this.loot,
      bullets: this.bullets,
      clouds: this.clouds,
      thrownGrenades: this.thrownGrenades,
      players: Object.values(this.players).map(p => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        x: p.x,
        y: p.y,
        radius: p.radius,
        angle: p.angle,
        hp: p.hp,
        maxHp: p.maxHp,
        vest: p.vest,
        vestLevel: p.vestLevel,
        helmetLevel: p.helmetLevel,
        boost: p.boost,
        scope: p.scope,
        activeSlot: p.activeSlot,
        weapons: p.weapons,
        grenades: p.grenades || 0,
        ammo: p.ammo,
        heals: p.heals,
        kills: p.kills,
        damageDealt: p.damageDealt,
        isAlive: p.isAlive,
        isPunching: p.isPunching,
        lastMeleePunchHand: p.lastMeleePunchHand,
        isInvulnerable: Date.now() < p.invulnerableUntil,
        isRespawning: Boolean(p.respawnAt),
        healingItem: p.healingItem,
        healingUntil: p.healingUntil,
        healingTotal: p.healingTotal || 0,
        isWet: Boolean(p.isWet),
        inWater: Boolean(p.inWater),
        inCloud: Boolean(p.inCloud)
      })),
      isGameOver: this.isGameOver
    };
  }
}

function circleRectCollisionFast(cx, cy, radius, rx, ry, rw, rh) {
  const testX = Math.max(rx, Math.min(cx, rx + rw));
  const testY = Math.max(ry, Math.min(cy, ry + rh));
  const distX = cx - testX;
  const distY = cy - testY;
  return (distX * distX + distY * distY) < (radius * radius);
}
