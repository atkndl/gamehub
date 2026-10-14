/**
 * High-Performance Multiplayer Snake Arena Engine
 * GameHub 2.0
 */

export const GRID_SIZE = 40; // 40x40 Grid Arena
export const BASE_TICK_MS = 90; // ~11 ticks per second for standard snake

export const SNAKE_CLASSES = {
  speed: {
    id: 'speed',
    name: 'Yıldırım',
    title: 'Hızlı Yılan',
    icon: '⚡',
    color: '#eab308', // Amber/Yellow
    headColor: '#facc15',
    glowColor: 'rgba(234, 179, 8, 0.4)',
    initialLength: 4,
    tickInterval: 72, // ~20% faster than standard 90ms
    immunity: null,
    desc: 'Diğer yılanlardan %20 daha hızlı hareket eder.'
  },
  long: {
    id: 'long',
    name: 'Titan',
    title: 'Uzun Yılan',
    icon: '🐍',
    color: '#10b981', // Emerald/Green
    headColor: '#34d399',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    initialLength: 8, // Starts 2x longer (8 segments)
    tickInterval: 90,
    immunity: null,
    desc: 'Oyuna 2 kat daha uzun başlar (8 boğum). Alan kapatmada uzmandır.'
  },
  fire: {
    id: 'fire',
    name: 'Ejderha',
    title: 'Ateş Yılanı',
    icon: '🔥',
    color: '#ef4444', // Red/Orange
    headColor: '#f87171',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    initialLength: 4,
    tickInterval: 90,
    immunity: 'fire',
    desc: 'Ateş ve lav alanlarından hasar almadan güvenle geçer.'
  },
  ice: {
    id: 'ice',
    name: 'Buzul',
    title: 'Buz Yılanı',
    icon: '❄️',
    color: '#06b6d4', // Cyan
    headColor: '#22d3ee',
    glowColor: 'rgba(6, 182, 212, 0.4)',
    initialLength: 4,
    tickInterval: 90,
    immunity: 'ice',
    desc: 'Buz fırtınası alanlarından donmadan ve ölmeden geçer.'
  }
};

const SPAWN_POSITIONS = [
  { x: 5, y: 5, dir: { x: 1, y: 0 } },
  { x: 34, y: 34, dir: { x: -1, y: 0 } },
  { x: 34, y: 5, dir: { x: 0, y: 1 } },
  { x: 5, y: 34, dir: { x: 0, y: -1 } },
  { x: 20, y: 5, dir: { x: 0, y: 1 } },
  { x: 20, y: 34, dir: { x: 0, y: -1 } },
  { x: 5, y: 20, dir: { x: 1, y: 0 } },
  { x: 34, y: 20, dir: { x: -1, y: 0 } },
];

export class SnakeSession {
  constructor(roomCode, playersList, config = {}) {
    this.roomCode = roomCode;
    this.config = {
      hazardFrequency: config.hazardFrequency || 'normal', // 'low' | 'normal' | 'high'
      initialLives: 3,
      ...config
    };

    this.gridSize = GRID_SIZE;
    this.startTime = Date.now();
    this.isGameOver = false;
    this.leaderboard = [];
    this.eliminatedOrder = []; // Order of elimination

    // Foods array
    this.foods = [];
    // Hazard zones (Fire / Ice)
    this.hazards = [];
    this.nextHazardTime = Date.now() + 6000;

    // Players state
    this.players = {};
    const playerArray = Array.from(playersList);

    playerArray.forEach((p, idx) => {
      const snakeClassKey = p.snakeClass && SNAKE_CLASSES[p.snakeClass] ? p.snakeClass : 'speed';
      const snakeClass = SNAKE_CLASSES[snakeClassKey];
      const spawn = SPAWN_POSITIONS[idx % SPAWN_POSITIONS.length];

      const body = [];
      for (let i = 0; i < snakeClass.initialLength; i++) {
        body.push({
          x: Math.max(1, Math.min(GRID_SIZE - 2, spawn.x - spawn.dir.x * i)),
          y: Math.max(1, Math.min(GRID_SIZE - 2, spawn.y - spawn.dir.y * i))
        });
      }

      this.players[p.id] = {
        id: p.id,
        name: p.name || `Oyuncu ${idx + 1}`,
        avatar: p.avatar || '🐍',
        snakeClass: snakeClassKey,
        classInfo: snakeClass,
        body: body,
        dir: { ...spawn.dir },
        nextDir: { ...spawn.dir },
        lives: 3,
        score: 0,
        kills: 0,
        eatenCount: 0,
        maxLength: snakeClass.initialLength,
        isAlive: true,
        invulnerableUntil: Date.now() + 3000, // 3s grace period at start
        respawningAt: null,
        lastMoveTime: Date.now(),
        tickInterval: snakeClass.tickInterval
      };
    });

    // Populate initial food
    this.ensureFoodCount(14);
  }

  ensureFoodCount(count = 14) {
    while (this.foods.length < count) {
      const pos = this.getRandomEmptyPosition();
      if (!pos) break;
      const isGold = Math.random() < 0.2;
      this.foods.push({
        id: Math.random().toString(36).substring(2, 9),
        x: pos.x,
        y: pos.y,
        type: isGold ? 'gold' : 'normal',
        points: isGold ? 30 : 10,
        growth: isGold ? 2 : 1
      });
    }
  }

  getRandomEmptyPosition(margin = 2) {
    let attempts = 0;
    while (attempts < 200) {
      attempts++;
      const x = Math.floor(Math.random() * (GRID_SIZE - margin * 2)) + margin;
      const y = Math.floor(Math.random() * (GRID_SIZE - margin * 2)) + margin;

      // Check collision with any snake body
      let occupied = false;
      for (const p of Object.values(this.players)) {
        if (!p.isAlive) continue;
        for (const seg of p.body) {
          if (seg.x === x && seg.y === y) {
            occupied = true;
            break;
          }
        }
        if (occupied) break;
      }

      // Check collision with foods
      if (!occupied) {
        for (const f of this.foods) {
          if (f.x === x && f.y === y) {
            occupied = true;
            break;
          }
        }
      }

      if (!occupied) return { x, y };
    }
    return null;
  }

  setPlayerDirection(playerId, newDir) {
    const player = this.players[playerId];
    if (!player || !player.isAlive || player.respawningAt) return;

    let dirVec = null;
    if (newDir === 'UP') dirVec = { x: 0, y: -1 };
    else if (newDir === 'DOWN') dirVec = { x: 0, y: 1 };
    else if (newDir === 'LEFT') dirVec = { x: -1, y: 0 };
    else if (newDir === 'RIGHT') dirVec = { x: 1, y: 0 };

    if (!dirVec) return;

    // Prevent immediate 180-degree turn into self
    if (player.dir.x + dirVec.x === 0 && player.dir.y + dirVec.y === 0) {
      return;
    }

    player.nextDir = dirVec;
  }

  updateHazards(now) {
    // 1. Clean expired hazards
    this.hazards = this.hazards.filter(h => h.expiresAt > now);

    // 2. Check warning phase transitions
    this.hazards.forEach(h => {
      if (h.state === 'warning' && now >= h.activeAt) {
        h.state = 'active';
      }
    });

    // 3. Spawn new hazard if due (max 2 active hazards on arena at once)
    if (now >= this.nextHazardTime && this.hazards.length < 2) {
      const type = Math.random() < 0.5 ? 'fire' : 'ice';
      const width = Math.floor(Math.random() * 4) + 7; // 7-10 width
      const height = Math.floor(Math.random() * 4) + 7; // 7-10 height
      const x = Math.floor(Math.random() * (GRID_SIZE - width - 6)) + 3;
      const y = Math.floor(Math.random() * (GRID_SIZE - height - 6)) + 3;

      const warningDuration = 2500; // 2.5s warning
      const activeDuration = 9000; // 9s active

      this.hazards.push({
        id: Math.random().toString(36).substring(2, 9),
        type,
        x,
        y,
        width,
        height,
        state: 'warning',
        createdAt: now,
        activeAt: now + warningDuration,
        expiresAt: now + warningDuration + activeDuration
      });

      this.nextHazardTime = now + 12000 + Math.random() * 5000;
    }
  }

  isPointInHazard(x, y, immunityType) {
    for (const h of this.hazards) {
      if (h.state === 'active') {
        if (x >= h.x && x < h.x + h.width && y >= h.y && y < h.y + h.height) {
          // If snake is immune to this hazard type, safe!
          if (immunityType === h.type) {
            return false;
          }
          return { inHazard: true, type: h.type };
        }
      }
    }
    return false;
  }

  killPlayer(player, killerPlayer = null, reason = 'crash') {
    player.lives -= 1;

    // Convert snake body into food pellets for others to feast on!
    player.body.forEach((seg, idx) => {
      if (idx % 2 === 0 && Math.random() < 0.8) {
        this.foods.push({
          id: Math.random().toString(36).substring(2, 9),
          x: seg.x,
          y: seg.y,
          type: 'normal',
          points: 15,
          growth: 1
        });
      }
    });

    if (killerPlayer && killerPlayer.id !== player.id) {
      killerPlayer.kills += 1;
      killerPlayer.score += 50;
    }

    if (player.lives > 0) {
      // Schedule respawn after 1.2s
      player.respawningAt = Date.now() + 1200;
      player.body = [];
    } else {
      // Completely eliminated
      player.isAlive = false;
      player.respawningAt = null;
      player.body = [];
      this.eliminatedOrder.push({
        playerId: player.id,
        name: player.name,
        time: Date.now()
      });
    }

    return {
      playerId: player.id,
      killerId: killerPlayer ? killerPlayer.id : null,
      livesRemaining: player.lives,
      isEliminated: player.lives <= 0,
      reason
    };
  }

  respawnPlayer(player) {
    const spawn = this.getRandomEmptyPosition(4) || { x: 20, y: 20 };
    const randomDirs = [{ x: 1, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }];
    const dir = randomDirs[Math.floor(Math.random() * randomDirs.length)];

    const classInfo = player.classInfo;
    const body = [];
    for (let i = 0; i < classInfo.initialLength; i++) {
      body.push({
        x: Math.max(1, Math.min(GRID_SIZE - 2, spawn.x - dir.x * i)),
        y: Math.max(1, Math.min(GRID_SIZE - 2, spawn.y - dir.y * i))
      });
    }

    player.body = body;
    player.dir = { ...dir };
    player.nextDir = { ...dir };
    player.invulnerableUntil = Date.now() + 2500; // 2.5s invulnerability shield
    player.respawningAt = null;
    player.lastMoveTime = Date.now();
  }

  /**
   * Main game tick
   */
  tick(now = Date.now()) {
    if (this.isGameOver) return { gameOver: true, leaderboard: this.leaderboard };

    this.updateHazards(now);
    const events = [];

    // 1. Process respawning players
    for (const player of Object.values(this.players)) {
      if (player.lives > 0 && player.respawningAt && now >= player.respawningAt) {
        this.respawnPlayer(player);
      }
    }

    // 2. Move snakes that are ready for their tick
    const movedPlayers = [];
    for (const player of Object.values(this.players)) {
      if (!player.isAlive || player.respawningAt || player.body.length === 0) continue;

      if (now - player.lastMoveTime >= player.tickInterval) {
        player.lastMoveTime = now;
        player.dir = { ...player.nextDir };

        const head = player.body[0];
        const newHead = {
          x: head.x + player.dir.x,
          y: head.y + player.dir.y
        };

        player.pendingHead = newHead;
        movedPlayers.push(player);
      }
    }

    // 3. Collision Detection for moved snakes
    const toKill = []; // [{ player, killer, reason }]

    for (const player of movedPlayers) {
      const head = player.pendingHead;
      const isInvulnerable = now < player.invulnerableUntil;

      // A. Wall Collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        toKill.push({ player, killer: null, reason: 'wall' });
        continue;
      }

      // B. Hazard Zone Collision (if not invulnerable)
      if (!isInvulnerable) {
        const hazardHit = this.isPointInHazard(head.x, head.y, player.classInfo.immunity);
        if (hazardHit) {
          toKill.push({ player, killer: null, reason: `hazard_${hazardHit.type}` });
          continue;
        }
      }

      // C. Self Collision
      let hitSelf = false;
      for (let i = 1; i < player.body.length - 1; i++) {
        if (player.body[i].x === head.x && player.body[i].y === head.y) {
          hitSelf = true;
          break;
        }
      }
      if (hitSelf && !isInvulnerable) {
        toKill.push({ player, killer: null, reason: 'self' });
        continue;
      }

      // D. Other Snake Body / Head Collisions
      let hitOther = false;
      for (const other of Object.values(this.players)) {
        if (!other.isAlive || other.respawningAt || other.body.length === 0) continue;
        if (other.id === player.id) continue;

        // Check collision with other's body
        for (let i = 0; i < other.body.length; i++) {
          const seg = other.body[i];
          if (seg.x === head.x && seg.y === head.y) {
            if (!isInvulnerable) {
              toKill.push({ player, killer: other, reason: 'body_crash' });
              hitOther = true;
              break;
            }
          }
        }
        if (hitOther) break;

        // Head-to-Head Collision
        if (other.pendingHead && other.pendingHead.x === head.x && other.pendingHead.y === head.y) {
          if (!isInvulnerable && now >= other.invulnerableUntil) {
            toKill.push({ player, killer: other, reason: 'head_on' });
            hitOther = true;
            break;
          }
        }
      }
    }

    // 4. Execute kills
    const killedIds = new Set();
    for (const item of toKill) {
      if (!killedIds.has(item.player.id)) {
        killedIds.add(item.player.id);
        const killEvt = this.killPlayer(item.player, item.killer, item.reason);
        events.push(killEvt);
      }
    }

    // 5. Advance surviving moved snakes
    for (const player of movedPlayers) {
      if (killedIds.has(player.id)) continue;

      const newHead = player.pendingHead;
      player.body.unshift(newHead);

      // Check food consumption
      let ateFood = false;
      let eatenIdx = -1;
      for (let i = 0; i < this.foods.length; i++) {
        const f = this.foods[i];
        if (f.x === newHead.x && f.y === newHead.y) {
          eatenIdx = i;
          player.score += f.points;
          player.eatenCount += 1;
          ateFood = true;
          break;
        }
      }

      if (ateFood && eatenIdx !== -1) {
        const food = this.foods.splice(eatenIdx, 1)[0];
        events.push({
          type: 'food_eaten',
          playerId: player.id,
          foodType: food.type,
          newScore: player.score
        });
        // Snake grows: do not pop tail!
      } else {
        // Did not eat: pop tail to maintain length
        player.body.pop();
      }

      if (player.body.length > player.maxLength) {
        player.maxLength = player.body.length;
      }

      delete player.pendingHead;
    }

    // Maintain food density
    this.ensureFoodCount(14);

    // 6. Check Game Over Condition
    const allPlayers = Object.values(this.players);
    const alivePlayers = allPlayers.filter(p => p.lives > 0);

    // If multiple players originally played and only <= 1 remains alive:
    if (allPlayers.length > 1 && alivePlayers.length <= 1) {
      this.isGameOver = true;
      this.leaderboard = this.buildLeaderboard();
      return {
        gameOver: true,
        leaderboard: this.leaderboard,
        state: this.getState(),
        events
      };
    }

    // Single-player practice mode: ends when 0 lives
    if (allPlayers.length === 1 && alivePlayers.length === 0) {
      this.isGameOver = true;
      this.leaderboard = this.buildLeaderboard();
      return {
        gameOver: true,
        leaderboard: this.leaderboard,
        state: this.getState(),
        events
      };
    }

    return {
      gameOver: false,
      state: this.getState(),
      events
    };
  }

  buildLeaderboard() {
    const list = Object.values(this.players).map(p => ({
      playerId: p.id,
      name: p.name,
      avatar: p.avatar,
      snakeClass: p.snakeClass,
      classInfo: p.classInfo,
      lives: p.lives,
      score: p.score,
      kills: p.kills,
      eatenCount: p.eatenCount,
      maxLength: p.maxLength,
      isAlive: p.lives > 0,
      survivalRank: 0
    }));

    // Sort order:
    // 1. Alive players first
    // 2. Elimination order (last eliminated ranks higher)
    // 3. Highest kills
    // 4. Highest score
    const elimMap = new Map();
    this.eliminatedOrder.forEach((e, idx) => {
      elimMap.set(e.playerId, idx); // higher index = survived longer
    });

    list.sort((a, b) => {
      if (a.isAlive !== b.isAlive) {
        return a.isAlive ? -1 : 1;
      }
      const orderA = elimMap.has(a.playerId) ? elimMap.get(a.playerId) : 999;
      const orderB = elimMap.has(b.playerId) ? elimMap.get(b.playerId) : 999;
      if (orderA !== orderB) {
        return orderB - orderA;
      }
      if (b.kills !== a.kills) {
        return b.kills - a.kills;
      }
      return b.score - a.score;
    });

    return list.map((item, idx) => ({
      ...item,
      rank: idx + 1,
      isWinner: idx === 0
    }));
  }

  getState() {
    return {
      gridSize: this.gridSize,
      hazards: this.hazards,
      foods: this.foods,
      players: Object.values(this.players).map(p => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        snakeClass: p.snakeClass,
        body: p.body,
        dir: p.dir,
        lives: p.lives,
        score: p.score,
        kills: p.kills,
        isAlive: p.isAlive,
        isInvulnerable: Date.now() < p.invulnerableUntil,
        isRespawning: Boolean(p.respawningAt)
      })),
      isGameOver: this.isGameOver
    };
  }
}
