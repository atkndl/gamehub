/**
 * Survival (2D Battle Royale & Deathmatch Engine)
 * GameHub 2.0 - Inspired by survev.io & PUBG 2D
 */

export const MAP_SIZE = 2400; // 2400 x 2400 pixels map

export const WEAPONS = {
  fists: {
    id: 'fists',
    name: 'Yumruk',
    icon: '👊',
    damage: 24,
    fireDelay: 280, // ms
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
    damage: 18,
    fireDelay: 170,
    bulletSpeed: 18,
    range: 650,
    magSize: 15,
    reloadTime: 1400,
    isMelee: false,
    bulletCount: 1,
    spread: 0.08,
    ammoType: '9mm',
    color: '#fbbf24',
    length: 22
  },
  m870: {
    id: 'm870',
    name: 'M870 Pompalı',
    icon: '💥',
    damage: 15, // 5 pellets * 15 = 75 max damage!
    fireDelay: 750,
    bulletSpeed: 16,
    range: 450,
    magSize: 5,
    reloadTime: 2200,
    isMelee: false,
    bulletCount: 5,
    spread: 0.22,
    ammoType: '12g',
    color: '#f97316',
    length: 34
  },
  ak47: {
    id: 'ak47',
    name: 'AK-47',
    icon: '⚡',
    damage: 24,
    fireDelay: 130, // rapid auto
    bulletSpeed: 21,
    range: 850,
    magSize: 30,
    reloadTime: 1900,
    isMelee: false,
    bulletCount: 1,
    spread: 0.11,
    ammoType: '762',
    color: '#ef4444',
    length: 38
  },
  m4a1: {
    id: 'm4a1',
    name: 'M4A1',
    icon: '🎯',
    damage: 20,
    fireDelay: 105, // very fast
    bulletSpeed: 22,
    range: 880,
    magSize: 30,
    reloadTime: 1800,
    isMelee: false,
    bulletCount: 1,
    spread: 0.07,
    ammoType: '556',
    color: '#3b82f6',
    length: 36
  },
  mosin: {
    id: 'mosin',
    name: 'Mosin Keskin Nişancı',
    icon: '🔭',
    damage: 78, // devastating sniper
    fireDelay: 1100,
    bulletSpeed: 30,
    range: 1400,
    magSize: 5,
    reloadTime: 2400,
    isMelee: false,
    bulletCount: 1,
    spread: 0.02,
    ammoType: '762',
    color: '#8b5cf6',
    length: 46
  },
  mp5: {
    id: 'mp5',
    name: 'MP5 Hafif Makineli',
    icon: '🔥',
    damage: 16,
    fireDelay: 95,
    bulletSpeed: 19,
    range: 700,
    magSize: 30,
    reloadTime: 1500,
    isMelee: false,
    bulletCount: 1,
    spread: 0.12,
    ammoType: '9mm',
    color: '#10b981',
    length: 28
  }
};

export const SCOPES = {
  '1x': { id: '1x', name: '1x Görüş', zoom: 1.0, fov: 900 },
  '2x': { id: '2x', name: '2x Dürbün', zoom: 0.75, fov: 1300 },
  '4x': { id: '4x', name: '4x Dürbün', zoom: 0.55, fov: 1800 },
  '8x': { id: '8x', name: '8x Dürbün', zoom: 0.38, fov: 2500 }
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

function circleRectCollision(cx, cy, radius, rx, ry, rw, rh) {
  const testX = Math.max(rx, Math.min(cx, rx + rw));
  const testY = Math.max(ry, Math.min(cy, ry + rh));
  const distX = cx - testX;
  const distY = cy - testY;
  return (distX * distX + distY * distY) < (radius * radius);
}

export class SurvivalSession {
  constructor(roomCode, playersList, config = {}) {
    this.roomCode = roomCode;
    this.mode = config.mode || 'battle_royale'; // 'battle_royale' (Alan) | 'deathmatch' (Maç)
    this.matchDuration = config.matchDuration || 180; // Seconds (default 3 mins for deathmatch)
    this.startTime = Date.now();
    this.endTime = this.mode === 'deathmatch' ? this.startTime + this.matchDuration * 1000 : null;
    this.isGameOver = false;
    this.leaderboard = [];

    // Map boundaries
    this.mapSize = MAP_SIZE;

    // Red Zone (Alan Modu)
    this.zone = {
      x: MAP_SIZE / 2,
      y: MAP_SIZE / 2,
      currentRadius: MAP_SIZE * 0.58,
      targetRadius: MAP_SIZE * 0.58,
      shrinkSpeed: 2.2, // radius reduction per tick when shrinking
      phase: 0,
      nextPhaseTime: Date.now() + 15000,
      damagePerSecond: 3
    };

    // Environmental Obstacles
    this.obstacles = [];
    this.bushes = [];
    this.loot = [];
    this.bullets = [];

    // Generate static arena structures & crates
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
        boost: 0, // Adrenaline (0-100)
        weapons: {
          primary: { ...WEAPONS.m9, ammo: WEAPONS.m9.magSize, isReloading: false, reloadProgress: 0 },
          secondary: null,
          melee: { ...WEAPONS.fists }
        },
        activeSlot: 'primary', // 'primary' | 'secondary' | 'melee'
        scope: '1x',
        ammo: {
          '9mm': 60,
          '12g': 15,
          '762': 60,
          '556': 60
        },
        heals: {
          bandage: 3,
          medkit: 1,
          soda: 2
        },
        kills: 0,
        damageDealt: 0,
        isAlive: true,
        lastShootTime: 0,
        lastMeleePunchHand: 1, // 1: right hand, -1: left hand
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
    // Spread players around spawn rings
    const center = MAP_SIZE / 2;
    const spawnRadius = 600;
    const angle = (idx / Math.max(1, total)) * Math.PI * 2 + Math.PI * 0.25;
    return {
      x: center + Math.cos(angle) * spawnRadius,
      y: center + Math.sin(angle) * spawnRadius
    };
  }

  initMap() {
    // 1. Indestructible boundary walls
    const borderThick = 40;
    this.obstacles.push(
      { id: 'wall_top', type: 'wall', x: 0, y: -borderThick, w: MAP_SIZE, h: borderThick, hp: Infinity },
      { id: 'wall_bottom', type: 'wall', x: 0, y: MAP_SIZE, w: MAP_SIZE, h: borderThick, hp: Infinity },
      { id: 'wall_left', type: 'wall', x: -borderThick, y: 0, w: borderThick, h: MAP_SIZE, hp: Infinity },
      { id: 'wall_right', type: 'wall', x: MAP_SIZE, y: 0, w: borderThick, h: MAP_SIZE, hp: Infinity }
    );

    // 2. Concrete stone obstacles & compounds
    const compounds = [
      { x: 500, y: 500, w: 180, h: 180 },
      { x: 1720, y: 500, w: 180, h: 180 },
      { x: 500, y: 1720, w: 180, h: 180 },
      { x: 1720, y: 1720, w: 180, h: 180 },
      { x: 1100, y: 1100, w: 200, h: 200 }, // Center bunker
      // Silo blocks
      { x: 850, y: 1200, w: 80, h: 80 },
      { x: 1470, y: 1200, w: 80, h: 80 },
      { x: 1200, y: 850, w: 80, h: 80 },
      { x: 1200, y: 1470, w: 80, h: 80 }
    ];

    compounds.forEach((c, idx) => {
      this.obstacles.push({
        id: `building_${idx}`,
        type: 'stone',
        x: c.x,
        y: c.y,
        w: c.w,
        h: c.h,
        hp: Infinity
      });
    });

    // 3. Breakable Crates (Kutular) that drop loot!
    for (let i = 0; i < 42; i++) {
      const cx = 200 + Math.floor(Math.random() * (MAP_SIZE - 400));
      const cy = 200 + Math.floor(Math.random() * (MAP_SIZE - 400));
      // Avoid center bunker overlap
      if (cx > 1000 && cx < 1400 && cy > 1000 && cy < 1400) continue;

      this.obstacles.push({
        id: `crate_${i}`,
        type: 'crate',
        x: cx,
        y: cy,
        w: 52,
        h: 52,
        hp: 60,
        maxHp: 60
      });
    }

    // 4. Bushes (Çalılar - Hiding spots / ambush)
    for (let i = 0; i < 35; i++) {
      const bx = 150 + Math.floor(Math.random() * (MAP_SIZE - 300));
      const by = 150 + Math.floor(Math.random() * (MAP_SIZE - 300));
      this.bushes.push({
        id: `bush_${i}`,
        x: bx,
        y: by,
        radius: 45 + Math.floor(Math.random() * 20)
      });
    }

    // 5. Initial Ground Loot Spawns
    const weaponKeys = ['m870', 'ak47', 'm4a1', 'mosin', 'mp5', 'm9'];
    for (let i = 0; i < 28; i++) {
      const lx = 250 + Math.floor(Math.random() * (MAP_SIZE - 500));
      const ly = 250 + Math.floor(Math.random() * (MAP_SIZE - 500));
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

    // Scopes loot
    ['2x', '2x', '4x', '4x', '8x'].forEach(scopeKey => {
      this.spawnLoot({
        x: 300 + Math.floor(Math.random() * (MAP_SIZE - 600)),
        y: 300 + Math.floor(Math.random() * (MAP_SIZE - 600)),
        type: 'scope',
        itemKey: scopeKey,
        name: SCOPES[scopeKey].name,
        icon: '🔭'
      });
    });

    // Armors, Helmets, Meds
    for (let i = 0; i < 20; i++) {
      const lx = 300 + Math.floor(Math.random() * (MAP_SIZE - 600));
      const ly = 300 + Math.floor(Math.random() * (MAP_SIZE - 600));
      const roll = Math.random();
      if (roll < 0.3) {
        const lvl = Math.random() < 0.6 ? 1 : (Math.random() < 0.7 ? 2 : 3);
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
    if (roll < 0.4) {
      const wKeys = ['m870', 'ak47', 'm4a1', 'mp5', 'mosin'];
      const picked = wKeys[Math.floor(Math.random() * wKeys.length)];
      drops.push({ type: 'weapon', itemKey: picked, name: WEAPONS[picked].name, icon: WEAPONS[picked].icon });
      drops.push({ type: 'ammo', itemKey: WEAPONS[picked].ammoType, count: 30, name: `${WEAPONS[picked].ammoType.toUpperCase()} Mermi`, icon: '📦' });
    } else if (roll < 0.65) {
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
        x: crate.x + 26 + (i * 24 - 12),
        y: crate.y + 26 + (i * 12),
        ...d
      });
    });
  }

  handlePlayerInput(playerId, data) {
    const p = this.players[playerId];
    if (!p || !p.isAlive) return;

    if (data.movement) {
      // Normalize movement vector
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
        if (data.slot === 'secondary' && !p.weapons.secondary) return;
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
    if (p.healingItem) return; // Already healing
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
      if (distance(p.x, p.y, item.x, item.y) <= 65) {
        // Collect
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
      // Set new smaller target circle within current zone
      const minRadius = 80;
      const reduction = Math.max(minRadius, this.zone.currentRadius * 0.65);
      this.zone.targetRadius = reduction;

      // Drift circle center slightly
      const maxDrift = (this.zone.currentRadius - reduction) * 0.45;
      const driftAngle = Math.random() * Math.PI * 2;
      this.zone.x = Math.max(300, Math.min(MAP_SIZE - 300, this.zone.x + Math.cos(driftAngle) * maxDrift));
      this.zone.y = Math.max(300, Math.min(MAP_SIZE - 300, this.zone.y + Math.sin(driftAngle) * maxDrift));

      this.zone.nextPhaseTime = now + 24000;
      this.zone.damagePerSecond = 3 + this.zone.phase * 1.5;
    }

    // Shrink radius smoothly towards target
    if (this.zone.currentRadius > this.zone.targetRadius) {
      this.zone.currentRadius = Math.max(this.zone.targetRadius, this.zone.currentRadius - 0.7);
    }
  }

  tick(now = Date.now()) {
    if (this.isGameOver) {
      return { gameOver: true, leaderboard: this.leaderboard, state: this.getState() };
    }

    const events = [];

    // 1. Update Red Zone
    this.updateZone(now);

    // 2. Process Players Movement & State
    for (const p of Object.values(this.players)) {
      if (!p.isAlive) {
        // Handle deathmatch respawn
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

      // Adrenaline boost regeneration & speed multiplier
      let speedMultiplier = 1.0;
      if (p.boost > 0) {
        speedMultiplier += (p.boost / 100) * 0.25; // up to +25% speed
        p.boost = Math.max(0, p.boost - 0.08);
        if (p.hp < p.maxHp) {
          p.hp = Math.min(p.maxHp, p.hp + 0.05); // gradual regen
        }
      }

      // Move player with obstacle collision resolution
      const baseSpeed = 4.6 * speedMultiplier;
      const nextX = p.x + p.movement.x * baseSpeed;
      const nextY = p.y + p.movement.y * baseSpeed;

      let collidedX = false;
      let collidedY = false;

      // Map boundary check
      if (nextX - p.radius < 0 || nextX + p.radius > MAP_SIZE) collidedX = true;
      if (nextY - p.radius < 0 || nextY + p.radius > MAP_SIZE) collidedY = true;

      // Obstacle collision
      for (const ob of this.obstacles) {
        if (circleRectCollision(nextX, p.y, p.radius, ob.x, ob.y, ob.w, ob.h)) {
          collidedX = true;
        }
        if (circleRectCollision(p.x, nextY, p.radius, ob.x, ob.y, ob.w, ob.h)) {
          collidedY = true;
        }
      }

      if (!collidedX) p.x = nextX;
      if (!collidedY) p.y = nextY;

      // Auto-pickup nearby ammo & medkits if close
      for (let i = this.loot.length - 1; i >= 0; i--) {
        const item = this.loot[i];
        if (distance(p.x, p.y, item.x, item.y) <= p.radius + 18) {
          if (item.type === 'ammo') {
            p.ammo[item.itemKey] = (p.ammo[item.itemKey] || 0) + (item.count || 30);
            this.loot.splice(i, 1);
          } else if (item.type === 'heal' && p.heals[item.itemKey] < 4) {
            p.heals[item.itemKey] = (p.heals[item.itemKey] || 0) + 1;
            this.loot.splice(i, 1);
          }
        }
      }

      // Active weapon reload completion
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
          // Player is outside the safe zone!
          const dmg = (this.zone.damagePerSecond / 22); // per tick
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
          // Punch!
          if (now - p.lastShootTime >= active.fireDelay) {
            p.lastShootTime = now;
            p.isPunching = true;
            p.lastMeleePunchHand *= -1; // alternate hands

            // Check punch hit in cone in front of player
            const punchDist = p.radius + active.range;
            const punchX = p.x + Math.cos(p.angle) * punchDist;
            const punchY = p.y + Math.sin(p.angle) * punchDist;

            // Punch other players
            for (const victim of Object.values(this.players)) {
              if (victim.id === p.id || !victim.isAlive) continue;
              if (now < victim.invulnerableUntil) continue;
              if (distance(punchX, punchY, victim.x, victim.y) <= victim.radius + 15) {
                this.damagePlayer(victim, active.damage, p, 'fists', events);
              }
            }

            // Punch crates to break them
            for (const ob of this.obstacles) {
              if (ob.type === 'crate') {
                if (circleRectCollision(punchX, punchY, 18, ob.x, ob.y, ob.w, ob.h)) {
                  ob.hp -= active.damage;
                  if (ob.hp <= 0) {
                    this.dropCrateLoot(ob);
                  }
                }
              }
            }

            events.push({ type: 'punch', playerId: p.id });
          }
        } else if (active.ammo > 0) {
          // Gunshot!
          if (now - p.lastShootTime >= active.fireDelay) {
            p.lastShootTime = now;
            active.ammo--;

            // Spawn bullets
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
          // Out of ammo in magazine
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

      // Map limits
      if (b.x < 0 || b.x > MAP_SIZE || b.y < 0 || b.y > MAP_SIZE || b.rangeLeft <= 0) {
        destroyed = true;
      }

      // Obstacle collision
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

      // Player hit detection
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

    // Clean broken crates
    this.obstacles = this.obstacles.filter(ob => ob.hp > 0);

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

    // Apply helmet & vest reduction
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

    // Drop loot where victim died
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

    // Deathmatch respawn timer
    if (this.mode === 'deathmatch') {
      victim.respawnAt = Date.now() + 3000;
    }

    events.push({
      type: 'kill',
      victimId: victim.id,
      victimName: victim.name,
      killerId: killer ? killer.id : null,
      killerName: killer ? killer.name : (weaponId === 'gas' ? 'Kızıl Gaz Alanı' : 'Bilinmeyen'),
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
      // Highest kills wins
      list.sort((a, b) => b.kills !== a.kills ? b.kills - a.kills : b.damageDealt - a.damageDealt);
    } else {
      // Last survivor wins
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
      bushes: this.bushes,
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
