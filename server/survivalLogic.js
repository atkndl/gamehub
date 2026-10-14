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
    range: 48,
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
    damage: 20,
    fireDelay: 160,
    bulletSpeed: 20,
    range: 750,
    magSize: 15,
    reloadTime: 1300,
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
    damage: 16, // 5 pellets * 16 = 80 max damage
    fireDelay: 700,
    bulletSpeed: 18,
    range: 520,
    magSize: 5,
    reloadTime: 2000,
    isMelee: false,
    bulletCount: 5,
    spread: 0.20,
    ammoType: '12g',
    color: '#f97316',
    length: 34
  },
  ak47: {
    id: 'ak47',
    name: 'AK-47',
    icon: '⚡',
    damage: 26,
    fireDelay: 125, // rapid auto
    bulletSpeed: 23,
    range: 980,
    magSize: 30,
    reloadTime: 1800,
    isMelee: false,
    bulletCount: 1,
    spread: 0.10,
    ammoType: '762',
    color: '#ef4444',
    length: 38
  },
  m4a1: {
    id: 'm4a1',
    name: 'M4A1',
    icon: '🎯',
    damage: 22,
    fireDelay: 100, // very fast
    bulletSpeed: 24,
    range: 1000,
    magSize: 30,
    reloadTime: 1700,
    isMelee: false,
    bulletCount: 1,
    spread: 0.06,
    ammoType: '556',
    color: '#3b82f6',
    length: 36
  },
  mosin: {
    id: 'mosin',
    name: 'Mosin Keskin Nişancı',
    icon: '🔭',
    damage: 82, // devastating sniper
    fireDelay: 1000,
    bulletSpeed: 34,
    range: 1600,
    magSize: 5,
    reloadTime: 2200,
    isMelee: false,
    bulletCount: 1,
    spread: 0.015,
    ammoType: '762',
    color: '#8b5cf6',
    length: 46
  },
  mp5: {
    id: 'mp5',
    name: 'MP5 Hafif Makineli',
    icon: '🔥',
    damage: 17,
    fireDelay: 90,
    bulletSpeed: 21,
    range: 780,
    magSize: 30,
    reloadTime: 1400,
    isMelee: false,
    bulletCount: 1,
    spread: 0.11,
    ammoType: '9mm',
    color: '#10b981',
    length: 28
  }
};

export const SCOPES = {
  '1x': { id: '1x', name: '1x Görüş', zoom: 1.0, fov: 900 },
  '2x': { id: '2x', name: '2x Dürbün', zoom: 0.75, fov: 1350 },
  '4x': { id: '4x', name: '4x Dürbün', zoom: 0.52, fov: 1950 },
  '8x': { id: '8x', name: '8x Dürbün', zoom: 0.35, fov: 2900 }
};

export const ARMORS = {
  1: { level: 1, name: 'Seviye 1 Yelek', reduction: 0.25, maxVest: 50 },
  2: { level: 2, name: 'Seviye 2 Yelek', reduction: 0.40, maxVest: 75 },
  3: { level: 3, name: 'Seviye 3 Yelek', reduction: 0.55, maxVest: 100 }
};

export const HELMETS = {
  1: { level: 1, name: 'Seviye 1 Kask', reduction: 0.15 },
  2: { level: 2, name: 'Seviye 2 Kask', reduction: 0.25 },
  3: { level: 3, name: 'Seviye 3 Kask', reduction: 0.40 }
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
    this.explosions = [];

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
          primary: { ...WEAPONS.m9, ammo: WEAPONS.m9.magSize, isReloading: false },
          secondary: null,
          melee: { ...WEAPONS.fists }
        },
        activeSlot: 'primary',
        scope: '1x',
        ammo: {
          '9mm': 90,
          '12g': 20,
          '762': 90,
          '556': 90
        },
        heals: {
          bandage: 4,
          medkit: 1,
          soda: 2
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
        healingUntil: 0
      };
    });
  }

  getSpawnPosition(idx, total) {
    const center = MAP_SIZE / 2;
    const spawnRadius = 1100;
    const angle = (idx / Math.max(1, total)) * Math.PI * 2 + Math.PI * 0.25;
    return {
      x: center + Math.cos(angle) * spawnRadius,
      y: center + Math.sin(angle) * spawnRadius
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

    // Scopes (2x, 4x, 8x)
    ['2x', '2x', '2x', '4x', '4x', '4x', '8x', '8x'].forEach(scopeKey => {
      this.spawnLoot({
        x: 400 + Math.floor(Math.random() * (S - 800)),
        y: 400 + Math.floor(Math.random() * (S - 800)),
        type: 'scope',
        itemKey: scopeKey,
        name: SCOPES[scopeKey].name,
        icon: '🔭'
      });
    });

    // Armors, Helmets, Meds
    for (let i = 0; i < 45; i++) {
      const lx = 350 + Math.floor(Math.random() * (S - 700));
      const ly = 350 + Math.floor(Math.random() * (S - 700));
      const roll = Math.random();
      if (roll < 0.3) {
        const lvl = Math.random() < 0.6 ? 1 : (Math.random() < 0.75 ? 2 : 3);
        this.spawnLoot({ x: lx, y: ly, type: 'vest', level: lvl, name: ARMORS[lvl].name, icon: '🦺' });
      } else if (roll < 0.5) {
        const lvl = Math.random() < 0.7 ? 1 : 2;
        this.spawnLoot({ x: lx, y: ly, type: 'helmet', level: lvl, name: HELMETS[lvl].name, icon: '🪖' });
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

  dropCrateLoot(crate) {
    const drops = [];
    const roll = Math.random();
    if (roll < 0.45) {
      const wKeys = ['m870', 'ak47', 'm4a1', 'mp5', 'mosin'];
      const picked = wKeys[Math.floor(Math.random() * wKeys.length)];
      drops.push({ type: 'weapon', itemKey: picked, name: WEAPONS[picked].name, icon: WEAPONS[picked].icon });
      drops.push({ type: 'ammo', itemKey: WEAPONS[picked].ammoType, count: 40, name: `${WEAPONS[picked].ammoType.toUpperCase()} Mermi`, icon: '📦' });
    } else if (roll < 0.7) {
      const scopes = ['2x', '4x', '8x'];
      const s = scopes[Math.floor(Math.random() * scopes.length)];
      drops.push({ type: 'scope', itemKey: s, name: SCOPES[s].name, icon: '🔭' });
    } else if (roll < 0.85) {
      const lvl = Math.random() < 0.6 ? 2 : 3;
      drops.push({ type: 'vest', level: lvl, name: ARMORS[lvl].name, icon: '🦺' });
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
    for (const ob of this.obstacles) {
      if (ob.type === 'crate') {
        const d = distance(barrel.x, barrel.y, ob.x + ob.w / 2, ob.y + ob.h / 2);
        if (d < aoeRadius) {
          ob.hp -= 80;
          if (ob.hp <= 0) {
            this.dropCrateLoot(ob);
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
      if (['primary', 'secondary', 'melee'].includes(data.slot)) {
        if (data.slot === 'secondary' && !p.weapons.secondary) {
          // If secondary is empty, don't switch to it
          return;
        }
        p.activeSlot = data.slot;
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
      p.healingUntil = Date.now() + 2000;
    } else if (type === 'medkit') {
      if (p.hp >= 100 || p.heals.medkit <= 0) return;
      p.healingItem = 'medkit';
      p.healingUntil = Date.now() + 4500;
    } else if (type === 'soda') {
      if (p.boost >= 100 || p.heals.soda <= 0) return;
      p.healingItem = 'soda';
      p.healingUntil = Date.now() + 2000;
    }
  }

  pickupNearestLoot(p) {
    for (let i = 0; i < this.loot.length; i++) {
      const item = this.loot[i];
      if (distance(p.x, p.y, item.x, item.y) <= 80) {
        if (item.type === 'weapon') {
          const wObj = { ...WEAPONS[item.itemKey], ammo: WEAPONS[item.itemKey].magSize, isReloading: false };
          if (!p.weapons.secondary) {
            p.weapons.secondary = wObj;
            p.activeSlot = 'secondary';
          } else {
            p.weapons[p.activeSlot === 'melee' ? 'primary' : p.activeSlot] = wObj;
          }
        } else if (item.type === 'scope') {
          p.scope = item.itemKey;
        } else if (item.type === 'vest') {
          if (item.level > p.vestLevel || p.vest <= 0) {
            p.vestLevel = item.level;
            p.vest = ARMORS[item.level].maxVest;
          }
        } else if (item.type === 'helmet') {
          if (item.level > p.helmetLevel) {
            p.helmetLevel = item.level;
          }
        } else if (item.type === 'heal') {
          p.heals[item.itemKey] = (p.heals[item.itemKey] || 0) + 1;
        } else if (item.type === 'ammo') {
          p.ammo[item.itemKey] = (p.ammo[item.itemKey] || 0) + (item.count || 30);
        }

        this.loot.splice(i, 1);
        break;
      }
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
          p.vest = 50;
          p.vestLevel = 1;
          p.isAlive = true;
          p.respawnAt = null;
          p.invulnerableUntil = now + 2500;
          p.weapons.primary = { ...WEAPONS.m9, ammo: WEAPONS.m9.magSize, isReloading: false };
          p.activeSlot = 'primary';
        }
        continue;
      }

      // Check if player is wading in a water pond (slight 20% slowdown)
      let inWater = false;
      for (const pond of this.ponds) {
        if (distance(p.x, p.y, pond.x, pond.y) < pond.radius) {
          inWater = true;
          break;
        }
      }

      let speedMultiplier = inWater ? 0.8 : 1.0;
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
        resolveCircleRectCollision(p, ob.x, ob.y, ob.w, ob.h);
      }

      // Resolve Circular Obstacles (Trees, Rocks, Barrels)
      for (const cob of this.circularObstacles) {
        resolveCircleCircleCollision(p, cob.x, cob.y, cob.radius);
      }

      // Auto-pickup nearby ammo & medkits
      for (let i = this.loot.length - 1; i >= 0; i--) {
        const item = this.loot[i];
        if (distance(p.x, p.y, item.x, item.y) <= p.radius + 22) {
          if (item.type === 'ammo') {
            p.ammo[item.itemKey] = (p.ammo[item.itemKey] || 0) + (item.count || 30);
            this.loot.splice(i, 1);
          } else if (item.type === 'heal' && p.heals[item.itemKey] < 4) {
            p.heals[item.itemKey] = (p.heals[item.itemKey] || 0) + 1;
            this.loot.splice(i, 1);
          }
        }
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
            for (const ob of this.obstacles) {
              if (ob.type === 'crate') {
                if (circleRectCollisionFast(punchX, punchY, 18, ob.x, ob.y, ob.w, ob.h)) {
                  ob.hp -= active.damage;
                  if (ob.hp <= 0) {
                    this.dropCrateLoot(ob);
                  }
                }
              }
            }

            // Punch barrels (triggers explosion!)
            for (const cob of this.circularObstacles) {
              if (cob.type === 'barrel') {
                if (distance(punchX, punchY, cob.x, cob.y) <= cob.radius + 18) {
                  cob.hp -= active.damage;
                  if (cob.hp <= 0) {
                    this.triggerBarrelExplosion(cob, events);
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
            destroyed = true;
            if (ob.type === 'crate') {
              ob.hp -= b.damage;
              if (ob.hp <= 0) {
                this.dropCrateLoot(ob);
              }
            }
            break;
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
                this.triggerBarrelExplosion(cob, events);
              }
            }
            break;
          }
        }
      }

      // Check bullet hit on players
      if (!destroyed) {
        for (const victim of Object.values(this.players)) {
          if (victim.id === b.shooterId || !victim.isAlive) continue;
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

  damagePlayer(victim, rawDmg, shooter, weaponId, events) {
    let finalDmg = rawDmg;

    if (victim.vestLevel > 0 && victim.vest > 0) {
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
        icon: victim.weapons.primary.icon
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
    return {
      mode: this.mode,
      mapSize: this.mapSize,
      zone: this.zone,
      timeLeft: this.endTime ? Math.max(0, Math.ceil((this.endTime - Date.now()) / 1000)) : null,
      obstacles: this.obstacles,
      circularObstacles: this.circularObstacles,
      bushes: this.bushes,
      ponds: this.ponds,
      loot: this.loot,
      bullets: this.bullets,
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
        ammo: p.ammo,
        heals: p.heals,
        kills: p.kills,
        damageDealt: p.damageDealt,
        isAlive: p.isAlive,
        isPunching: p.isPunching,
        lastMeleePunchHand: p.lastMeleePunchHand,
        isInvulnerable: Date.now() < p.invulnerableUntil,
        isRespawning: Boolean(p.respawnAt),
        healingItem: p.healingItem
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
