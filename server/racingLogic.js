/**
 * 2D Multiplayer Racing Engine & Physics Simulation
 * Using Kenney Racing Pack assets
 */

export const RACING_CARS = {
  red: {
    id: 'red',
    name: 'Kızıl Şimşek (GT)',
    image: '/assets/racing/Cars/car_red_1.png',
    smallImage: '/assets/racing/Cars/car_red_small_1.png',
    color: '#ef4444',
    topSpeed: 380, // km/h
    accel: 520,
    handling: 3.4,
    driftGrip: 0.28
  },
  blue: {
    id: 'blue',
    name: 'Mavi Fırtına (Turbo)',
    image: '/assets/racing/Cars/car_blue_1.png',
    smallImage: '/assets/racing/Cars/car_blue_small_1.png',
    color: '#3b82f6',
    topSpeed: 390,
    accel: 505,
    handling: 3.2,
    driftGrip: 0.26
  },
  green: {
    id: 'green',
    name: 'Yeşil Canavar (Sprint)',
    image: '/assets/racing/Cars/car_green_1.png',
    smallImage: '/assets/racing/Cars/car_green_small_1.png',
    color: '#10b981',
    topSpeed: 375,
    accel: 540,
    handling: 3.6,
    driftGrip: 0.30
  },
  yellow: {
    id: 'yellow',
    name: 'Sarı Akrep (Speed)',
    image: '/assets/racing/Cars/car_yellow_1.png',
    smallImage: '/assets/racing/Cars/car_yellow_small_1.png',
    color: '#f59e0b',
    topSpeed: 400,
    accel: 490,
    handling: 3.1,
    driftGrip: 0.25
  },
  black: {
    id: 'black',
    name: 'Kara Dul (Drift King)',
    image: '/assets/racing/Cars/car_black_1.png',
    smallImage: '/assets/racing/Cars/car_black_small_1.png',
    color: '#1e293b',
    topSpeed: 385,
    accel: 525,
    handling: 3.5,
    driftGrip: 0.32
  }
};

export const TRACK_CONFIG = {
  width: 3800,
  height: 2600,
  roadWidth: 200,
  pitRoadWidth: 125,

  // Track Centerline Waypoints (Clockwise circuit)
  waypoints: [
    { x: 1700, y: 2150 }, // 0: Start / Finish Line
    { x: 2500, y: 2150 }, // 1: Main Straight end
    { x: 3000, y: 2050 }, // 2: Turn 1 Entry
    { x: 3350, y: 1750 }, // 3: Turn 1 Apex
    { x: 3350, y: 1250 }, // 4: Turn 2
    { x: 3050, y: 850 },  // 5: Turn 3 Entry
    { x: 2600, y: 700 },  // 6: Turn 3 Apex
    { x: 2000, y: 650 },  // 7: Back Straight
    { x: 1400, y: 650 },  // 8: Back Straight Mid
    { x: 900, y: 800 },   // 9: Chicane Entry
    { x: 650, y: 1100 },  // 10: Hairpin Entry
    { x: 500, y: 1450 },  // 11: Hairpin Apex
    { x: 550, y: 1800 },  // 12: Turn 8 Entry
    { x: 800, y: 2100 },  // 13: Final Turn Exit
    { x: 1200, y: 2150 }  // 14: Main Straight Start
  ],

  // Checkpoints: Directional gates across the track
  checkpoints: [
    { id: 0, x1: 1700, y1: 2040, x2: 1700, y2: 2260, isFinish: true },  // S/F
    { id: 1, x1: 2500, y1: 2040, x2: 2500, y2: 2260 },
    { id: 2, x1: 3240, y1: 1700, x2: 3460, y2: 1800 },
    { id: 3, x1: 3240, y1: 1200, x2: 3460, y2: 1300 },
    { id: 4, x1: 2600, y1: 590,  x2: 2600, y2: 810 },
    { id: 5, x1: 1700, y1: 540,  x2: 1700, y2: 760 },
    { id: 6, x1: 900,  y1: 690,  x2: 900,  y2: 910 },
    { id: 7, x1: 550,  y1: 1100, x2: 750,  y2: 1100 },
    { id: 8, x1: 390,  y1: 1450, x2: 610,  y2: 1450 },
    { id: 9, x1: 800,  y1: 1990, x2: 800,  y2: 2210 }
  ],

  // Starting Grid Slots (Main Straight, facing East / 0 rad)
  startGrid: [
    { x: 1560, y: 2110, angle: 0 },
    { x: 1460, y: 2190, angle: 0 },
    { x: 1360, y: 2110, angle: 0 },
    { x: 1260, y: 2190, angle: 0 }
  ],

  // Pit Lane Geometry (Parallel to main straight at Y=2340)
  pitLane: {
    entry: { x: 1100, y: 2260 },
    exit: { x: 2350, y: 2260 },
    laneY: 2340,
    startX: 1150,
    endX: 2300,
    // 5 Team Pit Service Bays (One designated for each car color)
    bays: [
      { id: 0, colorKey: 'red',    team: 'Ferrari / Kırmızı Garaj',  x: 1300, y: 2340, color: '#ef4444', tent: 'tent_red_large.png' },
      { id: 1, colorKey: 'blue',   team: 'Alpine / Mavi Garaj',      x: 1500, y: 2340, color: '#3b82f6', tent: 'tent_blue_large.png' },
      { id: 2, colorKey: 'green',  team: 'Aston / Yeşil Garaj',      x: 1700, y: 2340, color: '#10b981', tent: 'tent_red_large.png' },
      { id: 3, colorKey: 'yellow', team: 'Renault / Sarı Garaj',     x: 1900, y: 2340, color: '#f59e0b', tent: 'tent_blue_large.png' },
      { id: 4, colorKey: 'black',  team: 'Mercedes / Siyah Garaj',   x: 2100, y: 2340, color: '#1e293b', tent: 'tent_blue_large.png' }
    ]
  },

  // Environmental Obstacles & Props
  props: [
    // Grandstands along the main straight (Proper 2:1 aspect ratio: 220x110)
    { type: 'tribune', x: 1350, y: 1920, w: 220, h: 110 },
    { type: 'tribune', x: 1650, y: 1920, w: 220, h: 110 },
    { type: 'tribune', x: 1950, y: 1920, w: 220, h: 110 },
    { type: 'tribune', x: 2250, y: 1920, w: 220, h: 110 },

    // Grandstand at turn 1 and infield
    { type: 'tribune', x: 3100, y: 1700, w: 220, h: 110 },
    { type: 'tribune', x: 1650, y: 1300, w: 220, h: 110 },

    // Pit Wall separating main straight and pit lane
    { type: 'barrier', x: 1220, y: 2240, w: 1020, h: 18 },

    // Stadium Lights along the fences
    { type: 'light', x: 1300, y: 1900, radius: 15 },
    { type: 'light', x: 1600, y: 1900, radius: 15 },
    { type: 'light', x: 1900, y: 1900, radius: 15 },
    { type: 'light', x: 2200, y: 1900, radius: 15 },
    { type: 'light', x: 3300, y: 1900, radius: 15 },
    { type: 'light', x: 3300, y: 1200, radius: 15 },
    { type: 'light', x: 1800, y: 480,  radius: 15 },

    // Directional curve arrows
    { type: 'arrow', x: 3100, y: 2250, angle: -0.6 },
    { type: 'arrow', x: 3450, y: 1800, angle: -1.5 },
    { type: 'arrow', x: 3450, y: 1200, angle: -2.3 },
    { type: 'arrow', x: 2800, y: 620,  angle: 3.14 },

    // Outer perimeter tire barriers on curves
    { type: 'tires', x: 3150, y: 2180, radius: 24 },
    { type: 'tires', x: 3300, y: 2080, radius: 24 },
    { type: 'tires', x: 3480, y: 1780, radius: 28 },
    { type: 'tires', x: 3480, y: 1600, radius: 28 },
    { type: 'tires', x: 3480, y: 1200, radius: 28 },
    { type: 'tires', x: 2750, y: 550, radius: 28 },
    { type: 'tires', x: 2550, y: 540, radius: 28 },
    { type: 'tires', x: 420,  y: 1350, radius: 28 },
    { type: 'tires', x: 400,  y: 1550, radius: 28 },
    { type: 'tires', x: 450,  y: 1750, radius: 28 },

    // Trees inside and outside infield (more lush vegetation)
    { type: 'tree', x: 1100, y: 1400, radius: 55 },
    { type: 'tree', x: 1300, y: 1150, radius: 65 },
    { type: 'tree', x: 1500, y: 1450, radius: 50 },
    { type: 'tree', x: 1750, y: 1150, radius: 75 },
    { type: 'tree', x: 2000, y: 1400, radius: 60 },
    { type: 'tree', x: 2250, y: 1150, radius: 70 },
    { type: 'tree', x: 2500, y: 1400, radius: 55 },
    { type: 'tree', x: 2750, y: 1150, radius: 65 },
    { type: 'tree', x: 900,  y: 1650, radius: 50 },
    { type: 'tree', x: 750,  y: 1450, radius: 60 },

    // Rocks & Barrels
    { type: 'rock',   x: 1350, y: 1550, radius: 20 },
    { type: 'rock',   x: 2150, y: 1550, radius: 22 },
    { type: 'barrel', x: 1180, y: 2280, radius: 14 },
    { type: 'barrel', x: 2250, y: 2280, radius: 14 },

    // Cones near pit entry & exit
    { type: 'cone', x: 1120, y: 2260, radius: 10 },
    { type: 'cone', x: 1140, y: 2280, radius: 10 },
    { type: 'cone', x: 2260, y: 2280, radius: 10 },
    { type: 'cone', x: 2280, y: 2260, radius: 10 }
  ]
};

// Distance from point to line segment
function distToSegmentSquared(p, v, w) {
  const l2 = (v.x - w.x) * (v.x - w.x) + (v.y - w.y) * (v.y - w.y);
  if (l2 === 0) return (p.x - v.x) * (p.x - v.x) + (p.y - v.y) * (p.y - v.y);
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  const projX = v.x + t * (w.x - v.x);
  const projY = v.y + t * (w.y - v.y);
  return (p.x - projX) * (p.x - projX) + (p.y - projY) * (p.y - projY);
}

function distToSegment(p, v, w) {
  return Math.sqrt(distToSegmentSquared(p, v, w));
}

// Line intersection helper
function lineIntersects(p1, p2, p3, p4) {
  const ccw = (A, B, C) => (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
  return ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4);
}

export class RacingSession {
  constructor(roomCode, players = [], config = {}) {
    this.roomCode = roomCode;
    this.config = {
      mode: config.mode || 'laps', // 'laps' or 'time'
      laps: config.laps || 3,      // 3, 5, 10
      timeLimit: config.timeLimit || 120, // seconds for time mode
      ...config
    };

    this.track = TRACK_CONFIG;
    this.players = {};
    this.isGameOver = false;
    this.winner = null;
    this.startTime = Date.now() + 3500; // 3.5s countdown before green lights
    this.raceEndTime = null;
    this.countdownSeconds = 3;
    this.lightsState = 'red'; // 'red', 'yellow', 'green'
    this.lastTickTime = Date.now();

    // Initialize player vehicles
    players.forEach((p, index) => {
      const gridSlot = this.track.startGrid[index % this.track.startGrid.length];
      const carKeys = Object.keys(RACING_CARS);
      const chosenColor = p.carColor || carKeys[index % carKeys.length];
      const carModel = RACING_CARS[chosenColor] || RACING_CARS.red;

      this.players[p.id] = {
        id: p.id,
        name: p.name || `Yarışçı ${index + 1}`,
        avatar: p.avatar || '🏎️',
        carColor: chosenColor,
        carModel: carModel,

        // Spatial Physics
        x: gridSlot.x,
        y: gridSlot.y,
        prevX: gridSlot.x,
        prevY: gridSlot.y,
        angle: gridSlot.angle, // Heading in radians
        vx: 0,
        vy: 0,
        speed: 0, // In km/h
        driftAngle: 0, // Slip angle
        isDrifting: false,
        isNitroActive: false,
        onSurface: 'asphalt', // 'asphalt', 'grass', 'pit'

        // Vehicle Health & Resources
        nitro: 100, // 0 - 100%
        tires: {
          fl: 100, // Front Left
          fr: 100, // Front Right
          rl: 100, // Rear Left
          rr: 100  // Rear Right
        },
        damage: {
          front: 100,  // Front Wing / Bumper
          rear: 100,   // Rear Wing / Diffuser
          engine: 100, // Engine integrity
          body: 100    // Chassis
        },

        // Pit Stop Status
        inPit: false,
        pitBayId: index % 4, // Assigned pit garage
        pitProgress: 0,
        isServicing: false,

        // Race Progress
        currentLap: 1,
        nextCheckpoint: 1,
        lapStartTime: Date.now() + 3500,
        currentLapTime: 0,
        bestLapTime: null,
        lapTimes: [],
        totalRaceTime: 0,
        finished: false,
        finishPosition: null,

        // Inputs
        inputs: {
          gas: false,
          brake: false,
          left: false,
          right: false,
          handbrake: false,
          nitro: false
        }
      };
    });
  }

  handlePlayerInput(playerId, data) {
    const p = this.players[playerId];
    if (!p) return;

    if (data.inputs) {
      p.inputs = { ...p.inputs, ...data.inputs };
    }

    // Direct Pit Stop Action Requests
    if (data.action === 'pit_service' && p.inPit) {
      if (data.serviceType === 'nitro') {
        // Pump nitro (+35% per tap/action, up to 100%)
        p.nitro = Math.min(100, (p.nitro || 0) + 35);
      } else if (data.serviceType === 'tires') {
        // Change all 4 tires to 100%
        p.tires.fl = 100;
        p.tires.fr = 100;
        p.tires.rl = 100;
        p.tires.rr = 100;
      } else if (data.serviceType === 'repair') {
        // Repair all damaged parts to 100%
        p.damage.front = 100;
        p.damage.rear = 100;
        p.damage.engine = 100;
        p.damage.body = 100;
      } else if (data.serviceType === 'exit_pit') {
        p.inPit = false;
        // Boost out of pit bay onto pit lane
        p.vx = Math.cos(0) * 12;
        p.vy = 0;
      }
    }
  }

  // Check which surface the car is on
  getSurface(x, y) {
    // 1. Check Main Track Road Segments FIRST! (Main track always gets full asphalt grip!)
    const wps = this.track.waypoints;
    const roadR = this.track.roadWidth / 2;
    for (let i = 0; i < wps.length; i++) {
      const v = wps[i];
      const w = wps[(i + 1) % wps.length];
      if (distToSegment({ x, y }, v, w) <= roadR) {
        return { surface: 'asphalt' };
      }
    }

    // 2. Check Pit Lane Bounds (ONLY when south of pit divider barrier, y >= 2245)
    const pit = this.track.pitLane;
    if (y >= 2245 && x >= pit.startX - 60 && x <= pit.endX + 60 && Math.abs(y - pit.laneY) <= this.track.pitRoadWidth / 2 + 15) {
      // Check if inside specific pit bay stop box
      for (const bay of pit.bays) {
        if (Math.abs(x - bay.x) <= 45 && Math.abs(y - bay.y) <= 35) {
          return { surface: 'pit_box', bayId: bay.id, colorKey: bay.colorKey };
        }
      }
      return { surface: 'pit_lane' };
    }

    // Check Pit Lane entry / exit transition diagonals (ONLY when south of main track, y >= 2245)
    if (y >= 2245) {
      if (distToSegment({ x, y }, pit.entry, { x: pit.startX, y: pit.laneY }) <= this.track.pitRoadWidth / 2) {
        return { surface: 'pit_lane' };
      }
      if (distToSegment({ x, y }, { x: pit.endX, y: pit.laneY }, pit.exit) <= this.track.pitRoadWidth / 2) {
        return { surface: 'pit_lane' };
      }
    }

    // Outside asphalt and pit lane -> Grass terrain!
    return { surface: 'grass' };
  }

  tick(now) {
    const dt = Math.min(0.06, Math.max(0.015, (now - this.lastTickTime) / 1000));
    this.lastTickTime = now;

    const events = [];

    // Countdown before green lights
    if (now < this.startTime) {
      const remaining = (this.startTime - now) / 1000;
      this.countdownSeconds = Math.ceil(remaining);
      if (remaining > 2.0) this.lightsState = 'red';
      else if (remaining > 0.8) this.lightsState = 'yellow';
      else this.lightsState = 'yellow_flash';
      return { state: this.getState(), events };
    } else {
      if (this.lightsState !== 'green') {
        this.lightsState = 'green';
        events.push({ type: 'green_lights' });
      }
    }

    // Check game over in time mode
    if (this.config.mode === 'time') {
      const elapsedTotal = (now - this.startTime) / 1000;
      if (elapsedTotal >= this.config.timeLimit && !this.isGameOver) {
        this.finishRace(events);
      }
    }

    const alivePlayers = Object.values(this.players);

    // Physics Update for each player
    for (const p of alivePlayers) {
      if (p.finished && this.isGameOver) continue;

      p.prevX = p.x;
      p.prevY = p.y;

      const surfaceInfo = this.getSurface(p.x, p.y);
      p.onSurface = surfaceInfo.surface;

      // Handle Pit Bay Auto-Stop & Service Status (ONLY for matching car color!)
      if (surfaceInfo.surface === 'pit_box' && surfaceInfo.colorKey === p.carColor) {
        const baySpeed = Math.hypot(p.vx, p.vy);
        // Only slow down and initiate pit service if the player is slowing down / stopping into their bay
        if (baySpeed < 12) {
          p.inPit = true;
          p.vx *= 0.65;
          p.vy *= 0.65;
        }
      } else {
        // Passing through other team's bay or driving on pit lane -> do NOT trap or stop the car!
        p.inPit = false;
      }

      // Tire wear grip multiplier
      const avgTireHealth = (p.tires.fl + p.tires.fr + p.tires.rl + p.tires.rr) / 4;
      const tireGripFactor = 0.25 + 0.75 * (avgTireHealth / 100);

      // Engine integrity multiplier
      const engineFactor = 0.40 + 0.60 * (p.damage.engine / 100);

      // Surface Grip & Top Speed Modifier
      let surfaceMaxSpeed = p.carModel.topSpeed;
      let surfaceFriction = 0.985;
      let lateralTraction = 0.92 * tireGripFactor;

      if (p.onSurface === 'grass') {
        surfaceMaxSpeed = 135; // Grass speed limit
        surfaceFriction = 0.94; // Higher roll resistance
        lateralTraction = 0.55 * tireGripFactor;
      } else if (p.onSurface === 'pit_lane' || p.onSurface === 'pit_box') {
        surfaceMaxSpeed = 160; // Smooth Pit lane speed limiter (160 km/h)
      }

      // Handbrake & Drift Mechanics
      const isHandbrake = Boolean(p.inputs.handbrake);
      if (isHandbrake) {
        lateralTraction = p.carModel.driftGrip * 0.75; // Rear breaks loose into drift
        // Handbrake wears rear tires rapidly!
        p.tires.rl = Math.max(0, p.tires.rl - 4.5 * dt);
        p.tires.rr = Math.max(0, p.tires.rr - 4.5 * dt);
      }

      // Nitro Activation (Shift key)
      const isNitroRequested = Boolean(p.inputs.nitro && p.nitro > 2 && !p.inPit);
      p.isNitroActive = isNitroRequested;
      let accelMultiplier = 1.0;
      if (isNitroRequested) {
        accelMultiplier = 2.3;
        surfaceMaxSpeed += 110;
        p.nitro = Math.max(0, p.nitro - 18 * dt);
      }

      // Steering
      const currentSpeed = Math.hypot(p.vx, p.vy);
      const speedKmh = currentSpeed * 22; // Scale to km/h
      p.speed = Math.round(speedKmh);

      // Steering responsiveness depends on current speed
      if (currentSpeed > 0.5) {
        const steerDir = (p.inputs.left ? -1 : 0) + (p.inputs.right ? 1 : 0);
        const steerSpeedFactor = Math.min(1.0, currentSpeed / 8.0);
        let turnRate = p.carModel.handling * steerSpeedFactor * dt;

        // If drifting, allow faster counter-steering!
        if (isHandbrake) {
          turnRate *= 1.35;
        }
        if (p.onSurface === 'grass') {
          turnRate *= 0.65;
        }

        p.angle += steerDir * turnRate;
      }

      // Forward Vector & Lateral Drift Vector
      const fwdX = Math.cos(p.angle);
      const fwdY = Math.sin(p.angle);
      const rightX = -Math.sin(p.angle);
      const rightY = Math.cos(p.angle);

      // Decompose current velocity into Forward and Lateral components
      const forwardVelocity = p.vx * fwdX + p.vy * fwdY;
      const lateralVelocity = p.vx * rightX + p.vy * rightY;

      // Acceleration / Braking Forces
      let forwardForce = 0;
      if (p.inputs.gas && !p.inPit) {
        forwardForce += p.carModel.accel * accelMultiplier * engineFactor * dt;
      }
      if (p.inputs.brake) {
        if (forwardVelocity > 1) {
          forwardForce -= 900 * dt; // Strong braking
          // Braking wears front tires
          p.tires.fl = Math.max(0, p.tires.fl - 1.2 * dt);
          p.tires.fr = Math.max(0, p.tires.fr - 1.2 * dt);
        } else {
          forwardForce -= 300 * dt; // Reverse
        }
      }

      // Apply forward acceleration
      let newFwdVel = forwardVelocity + forwardForce * 0.04;

      // Clamp to surface max speed
      const maxForwardUnits = surfaceMaxSpeed / 22;
      newFwdVel = Math.max(-maxForwardUnits * 0.35, Math.min(maxForwardUnits, newFwdVel));

      // Cancel lateral velocity according to tire traction (drifting allows lateral velocity to slide!)
      const newLatVel = lateralVelocity * (1 - lateralTraction);

      // Calculate Drift Slip Angle
      p.driftAngle = Math.abs(Math.atan2(newLatVel, Math.max(0.1, Math.abs(newFwdVel))));
      p.isDrifting = (p.driftAngle > 0.22 && currentSpeed > 4.0) || (isHandbrake && currentSpeed > 3.0);

      if (p.isDrifting) {
        // Drifting wears outer tires
        p.tires.rl = Math.max(0, p.tires.rl - 2.0 * dt);
        p.tires.rr = Math.max(0, p.tires.rr - 2.0 * dt);
      }

      // Reconstruct world velocity
      p.vx = (fwdX * newFwdVel + rightX * newLatVel) * surfaceFriction;
      p.vy = (fwdY * newFwdVel + rightY * newLatVel) * surfaceFriction;

      // Apply Movement
      p.x += p.vx;
      p.y += p.vy;

      // Barrier / World Boundary Collisions
      p.x = Math.max(40, Math.min(this.track.width - 40, p.x));
      p.y = Math.max(40, Math.min(this.track.height - 40, p.y));

      // Collisions with Track Barriers
      for (const prop of this.track.props) {
        if (prop.type === 'barrier' || prop.type === 'tribune') {
          // AABB Collision
          if (p.x >= prop.x - 25 && p.x <= prop.x + prop.w + 25 &&
              p.y >= prop.y - 25 && p.y <= prop.y + prop.h + 25) {
            // Collision response
            p.vx *= -0.45;
            p.vy *= -0.45;
            p.x = p.prevX;
            p.y = p.prevY;
            // Impact damage
            const impactDmg = Math.min(30, Math.round(currentSpeed * 2.2));
            p.damage.front = Math.max(0, p.damage.front - impactDmg);
            p.damage.body = Math.max(0, p.damage.body - impactDmg * 0.7);
            events.push({ type: 'crash', x: p.x, y: p.y, intensity: impactDmg });
          }
        } else if (prop.type === 'tires' || prop.type === 'tree') {
          // Circle Collision
          const cdx = p.x - prop.x;
          const cdy = p.y - prop.y;
          const cdist = Math.hypot(cdx, cdy);
          const minD = prop.radius + 22;
          if (cdist < minD && cdist > 0) {
            const push = (minD - cdist);
            p.x += (cdx / cdist) * push;
            p.y += (cdy / cdist) * push;
            p.vx *= -0.4;
            p.vy *= -0.4;
            const impactDmg = Math.min(25, Math.round(currentSpeed * 1.8));
            p.damage.front = Math.max(0, p.damage.front - impactDmg);
            events.push({ type: 'crash', x: p.x, y: p.y, intensity: impactDmg });
          }
        }
      }

      // Checkpoint & Lap Detection
      this.checkLapProgress(p, events);
    }

    // Car-to-Car Collisions
    for (let i = 0; i < alivePlayers.length; i++) {
      for (let j = i + 1; j < alivePlayers.length; j++) {
        const c1 = alivePlayers[i];
        const c2 = alivePlayers[j];
        const cdx = c2.x - c1.x;
        const cdy = c2.y - c1.y;
        const dist = Math.hypot(cdx, cdy);
        if (dist < 46 && dist > 0) {
          // Elastic separation
          const overlap = 46 - dist;
          const nx = cdx / dist;
          const ny = cdy / dist;
          c1.x -= nx * overlap * 0.5;
          c1.y -= ny * overlap * 0.5;
          c2.x += nx * overlap * 0.5;
          c2.y += ny * overlap * 0.5;

          const relVx = c2.vx - c1.vx;
          const relVy = c2.vy - c1.vy;
          const impulse = Math.hypot(relVx, relVy) * 0.35;
          c1.vx -= nx * impulse;
          c1.vy -= ny * impulse;
          c2.vx += nx * impulse;
          c2.vy += ny * impulse;

          // Minor car-on-car contact damage
          c1.damage.body = Math.max(0, c1.damage.body - 3);
          c2.damage.body = Math.max(0, c2.damage.body - 3);
          events.push({ type: 'car_bump', x: (c1.x + c2.x) / 2, y: (c1.y + c2.y) / 2 });
        }
      }
    }

    return { state: this.getState(), events };
  }

  checkLapProgress(p, events) {
    if (p.finished) return;

    const curTime = Date.now();
    p.currentLapTime = Math.max(0, (curTime - p.lapStartTime) / 1000);
    p.totalRaceTime = Math.max(0, (curTime - this.startTime) / 1000);

    const cp = this.track.checkpoints[p.nextCheckpoint];
    if (!cp) return;

    // Check if player crossed next checkpoint segment
    const crossed = lineIntersects(
      { x: p.prevX, y: p.prevY },
      { x: p.x, y: p.y },
      { x: cp.x1, y: cp.y1 },
      { x: cp.x2, y: cp.y2 }
    );

    if (crossed) {
      if (cp.isFinish) {
        // Lap Completed!
        const lapDuration = p.currentLapTime;
        p.lapTimes.push(lapDuration);
        if (!p.bestLapTime || lapDuration < p.bestLapTime) {
          p.bestLapTime = lapDuration;
        }

        events.push({
          type: 'lap_complete',
          playerId: p.id,
          lap: p.currentLap,
          lapTime: lapDuration
        });

        // Check if race completed
        if (this.config.mode === 'laps' && p.currentLap >= this.config.laps) {
          p.finished = true;
          const finishedCount = Object.values(this.players).filter(pl => pl.finished).length;
          p.finishPosition = finishedCount;

          events.push({
            type: 'player_finished',
            playerId: p.id,
            position: p.finishPosition,
            totalTime: p.totalRaceTime
          });

          // Check if all finished
          const allDone = Object.values(this.players).every(pl => pl.finished);
          if (allDone || !this.winner) {
            this.winner = this.winner || p;
            if (allDone) this.finishRace(events);
          }
        } else {
          p.currentLap++;
          p.nextCheckpoint = 1;
          p.lapStartTime = curTime;
        }
      } else {
        // Advance to next checkpoint
        p.nextCheckpoint = (p.nextCheckpoint + 1) % this.track.checkpoints.length;
      }
    }
  }

  finishRace(events) {
    this.isGameOver = true;
    this.raceEndTime = Date.now();

    // Determine rankings
    const sorted = Object.values(this.players).sort((a, b) => {
      if (a.finished && !b.finished) return -1;
      if (!a.finished && b.finished) return 1;
      if (a.currentLap !== b.currentLap) return b.currentLap - a.currentLap;
      if (a.nextCheckpoint !== b.nextCheckpoint) return b.nextCheckpoint - a.nextCheckpoint;
      return (a.bestLapTime || 9999) - (b.bestLapTime || 9999);
    });

    sorted.forEach((p, idx) => {
      p.rank = idx + 1;
      if (idx === 0) this.winner = p;
    });

    events.push({
      type: 'race_over',
      winner: this.winner?.name,
      standings: sorted.map(s => ({
        id: s.id,
        name: s.name,
        rank: s.rank,
        carColor: s.carColor,
        bestLapTime: s.bestLapTime,
        totalTime: s.totalRaceTime
      }))
    });
  }

  getState() {
    // Calculate live race rankings based on lap and checkpoint progress
    const rankedPlayers = Object.values(this.players).map(p => ({
      ...p,
      rankScore: (p.currentLap * 100) + p.nextCheckpoint - (p.currentLapTime / 1000)
    })).sort((a, b) => b.rankScore - a.rankScore);

    rankedPlayers.forEach((p, idx) => {
      p.liveRank = idx + 1;
    });

    return {
      roomCode: this.roomCode,
      config: this.config,
      isGameOver: this.isGameOver,
      winner: this.winner?.name || null,
      countdownSeconds: this.countdownSeconds,
      lightsState: this.lightsState,
      timeLeft: this.config.mode === 'time'
        ? Math.max(0, Math.ceil(this.config.timeLimit - (Date.now() - this.startTime) / 1000))
        : null,
      track: {
        width: this.track.width,
        height: this.track.height,
        pitLane: this.track.pitLane
      },
      players: rankedPlayers.map(p => ({
        id: p.id,
        name: p.name,
        avatar: p.avatar,
        carColor: p.carColor,
        carModel: p.carModel,
        x: Math.round(p.x * 10) / 10,
        y: Math.round(p.y * 10) / 10,
        angle: Math.round(p.angle * 100) / 100,
        speed: p.speed,
        vx: Math.round(p.vx * 10) / 10,
        vy: Math.round(p.vy * 10) / 10,
        isDrifting: p.isDrifting,
        isNitroActive: p.isNitroActive,
        onSurface: p.onSurface,
        nitro: Math.round(p.nitro),
        tires: {
          fl: Math.round(p.tires.fl),
          fr: Math.round(p.tires.fr),
          rl: Math.round(p.tires.rl),
          rr: Math.round(p.tires.rr)
        },
        damage: {
          front: Math.round(p.damage.front),
          rear: Math.round(p.damage.rear),
          engine: Math.round(p.damage.engine),
          body: Math.round(p.damage.body)
        },
        inPit: p.inPit,
        pitBayId: p.pitBayId,
        currentLap: p.currentLap,
        nextCheckpoint: p.nextCheckpoint,
        currentLapTime: Math.round(p.currentLapTime * 10) / 10,
        bestLapTime: p.bestLapTime ? Math.round(p.bestLapTime * 100) / 100 : null,
        totalRaceTime: Math.round(p.totalRaceTime * 10) / 10,
        finished: p.finished,
        liveRank: p.liveRank,
        rank: p.rank
      }))
    };
  }
}
