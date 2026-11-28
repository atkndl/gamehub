import React, { useRef, useEffect } from 'react';
import { TRACK_CONFIG } from '../../../server/racingLogic';

const CAR_IMAGES = {
  red: '/assets/racing/Cars/car_red_1.png',
  blue: '/assets/racing/Cars/car_blue_1.png',
  green: '/assets/racing/Cars/car_green_1.png',
  yellow: '/assets/racing/Cars/car_yellow_1.png',
  black: '/assets/racing/Cars/car_black_1.png'
};

const PROP_IMAGES = {
  tent_red: '/assets/racing/Objects/tent_red_large.png',
  tent_blue: '/assets/racing/Objects/tent_blue_large.png',
  tires_red: '/assets/racing/Objects/tires_red.png',
  tires_white: '/assets/racing/Objects/tires_white.png',
  tribune: '/assets/racing/Objects/tribune_full.png',
  barrier: '/assets/racing/Objects/barrier_red_race.png',
  cone: '/assets/racing/Objects/cone_straight.png',
  tree: '/assets/racing/Objects/tree_large.png',
  barrel: '/assets/racing/Objects/barrel_red.png',
  crew_red: '/assets/racing/Characters/character_black_red.png',
  crew_blue: '/assets/racing/Characters/character_black_blue.png',
  crew_green: '/assets/racing/Characters/character_black_green.png',
  crew_white: '/assets/racing/Characters/character_black_white.png'
};

export default function RacingCanvas({ state, myPlayerId }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const smoothCamRef = useRef({ x: 1560, y: 2110 });
  const interpPlayersRef = useRef({});
  const skidmarksRef = useRef([]); // Permanent skidmark lines
  const particlesRef = useRef([]); // Drift smoke, nitro flames, sparks

  const imagesRef = useRef({
    cars: {},
    props: {}
  });

  // Preload Kenney PNG Sprites
  useEffect(() => {
    Object.entries(CAR_IMAGES).forEach(([k, src]) => {
      const img = new Image();
      img.src = src;
      imagesRef.current.cars[k] = img;
    });
    Object.entries(PROP_IMAGES).forEach(([k, src]) => {
      const img = new Image();
      img.src = src;
      imagesRef.current.props[k] = img;
    });
  }, []);

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let running = true;

    const render = () => {
      if (!running) return;

      const width = canvas.width;
      const height = canvas.height;
      const curState = stateRef.current;
      const myPlayer = curState?.players?.find(p => p.id === myPlayerId) || curState?.players?.[0];

      // Camera Glide
      if (myPlayer) {
        // Look-ahead camera lead in the direction of velocity
        const leadX = (myPlayer.vx || 0) * 12;
        const leadY = (myPlayer.vy || 0) * 12;
        smoothCamRef.current.x += (myPlayer.x + leadX - smoothCamRef.current.x) * 0.18;
        smoothCamRef.current.y += (myPlayer.y + leadY - smoothCamRef.current.y) * 0.18;
      }

      const camX = smoothCamRef.current.x;
      const camY = smoothCamRef.current.y;
      const zoom = 0.95; // Wide track overview

      // 1. Clear Screen
      ctx.fillStyle = '#15803d'; // Rich grass green
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-camX, -camY);

      const track = TRACK_CONFIG;

      // 2. Render Grass Background with Subtle Mowed Lawn Stripes
      ctx.fillStyle = '#166534';
      ctx.fillRect(0, 0, track.width, track.height);

      ctx.fillStyle = 'rgba(21, 128, 61, 0.35)';
      for (let x = 0; x < track.width; x += 120) {
        ctx.fillRect(x, 0, 60, track.height);
      }

      // Outer World Fence Boundary
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 10;
      ctx.strokeRect(0, 0, track.width, track.height);

      // 3. Render Asphalt Circuit Track
      const wps = track.waypoints;
      const roadR = track.roadWidth / 2;

      // Outer Red/White Striped Curbs (Borders)
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(wps[0].x, wps[0].y);
      for (let i = 1; i < wps.length; i++) ctx.lineTo(wps[i].x, wps[i].y);
      ctx.closePath();
      ctx.strokeStyle = '#dc2626'; // Red curb border
      ctx.lineWidth = track.roadWidth + 36;
      ctx.stroke();

      // Alternating White Curbs on edges
      ctx.setLineDash([24, 24]);
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = track.roadWidth + 36;
      ctx.stroke();
      ctx.setLineDash([]);

      // Main Dark Asphalt Surface
      ctx.strokeStyle = '#1e293b'; // Dark race asphalt
      ctx.lineWidth = track.roadWidth;
      ctx.stroke();

      // Road Centerline Dotted White Markings
      ctx.beginPath();
      ctx.moveTo(wps[0].x, wps[0].y);
      for (let i = 1; i < wps.length; i++) ctx.lineTo(wps[i].x, wps[i].y);
      ctx.closePath();
      ctx.setLineDash([32, 40]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 4;
      ctx.stroke();
      ctx.setLineDash([]);

      // 4. Render Pit Lane
      const pit = track.pitLane;
      ctx.save();
      // Pit Road Surface
      ctx.beginPath();
      ctx.moveTo(pit.entry.x, pit.entry.y);
      ctx.lineTo(pit.startX, pit.laneY);
      ctx.lineTo(pit.endX, pit.laneY);
      ctx.lineTo(pit.exit.x, pit.exit.y);
      ctx.strokeStyle = '#334155'; // Slightly lighter asphalt for pit lane
      ctx.lineWidth = track.pitRoadWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Yellow Pit Speed Limiter Solid Edge Lines
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 5;
      ctx.stroke();

      // Pit Lane Center Dashed Line
      ctx.beginPath();
      ctx.moveTo(pit.startX, pit.laneY);
      ctx.lineTo(pit.endX, pit.laneY);
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.6)';
      ctx.setLineDash([20, 20]);
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.setLineDash([]);

      // 4 Pit Service Box Markings on Asphalt
      pit.bays.forEach(bay => {
        // Colored bay box
        ctx.strokeStyle = bay.color;
        ctx.lineWidth = 4;
        ctx.strokeRect(bay.x - 42, bay.y - 30, 84, 60);

        ctx.fillStyle = `${bay.color}25`;
        ctx.fillRect(bay.x - 42, bay.y - 30, 84, 60);

        // Box Number & Team Label
        ctx.font = 'bold 12px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(`PİT ${bay.id + 1}`, bay.x, bay.y - 38);

        // Service Stop Pad Marking inside Box
        ctx.fillStyle = bay.color;
        ctx.fillRect(bay.x - 25, bay.y - 4, 50, 8);
      });
      ctx.restore();

      // 5. Start / Finish Line Checkered Grid (X: 1700, Y: 2150)
      ctx.save();
      const sfX = 1700;
      const sfY = 2150;
      const sfH = track.roadWidth;
      const sqSize = 14;
      for (let sy = sfY - sfH / 2; sy < sfY + sfH / 2; sy += sqSize) {
        for (let col = 0; col < 2; col++) {
          const isWhite = (Math.floor(sy / sqSize) + col) % 2 === 0;
          ctx.fillStyle = isWhite ? '#ffffff' : '#000000';
          ctx.fillRect(sfX - 14 + col * sqSize, sy, sqSize, sqSize);
        }
      }

      // Starting Grid Slot Markers on Asphalt
      track.startGrid.forEach((grid, idx) => {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3;
        ctx.strokeRect(grid.x - 30, grid.y - 20, 60, 40);

        ctx.font = '900 16px sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(String(idx + 1), grid.x, grid.y);
      });
      ctx.restore();

      // 6. Render Tire Skidmarks Left on Road
      if (skidmarksRef.current.length > 0) {
        ctx.save();
        for (let i = skidmarksRef.current.length - 1; i >= 0; i--) {
          const sm = skidmarksRef.current[i];
          ctx.beginPath();
          ctx.moveTo(sm.x1, sm.y1);
          ctx.lineTo(sm.x2, sm.y2);
          ctx.strokeStyle = `rgba(15, 23, 42, ${sm.alpha})`;
          ctx.lineWidth = 5;
          ctx.lineCap = 'round';
          ctx.stroke();
          sm.alpha -= 0.0008; // Very slow fade
          if (sm.alpha <= 0) skidmarksRef.current.splice(i, 1);
        }
        ctx.restore();
      }

      // 7. Render Environmental Props (Grandstands, Tents, Barriers, Trees, Pit Crew)
      track.props.forEach(p => {
        ctx.save();
        if (p.type === 'tribune') {
          const tribImg = imagesRef.current.props.tribune;
          if (tribImg && tribImg.complete && tribImg.naturalWidth > 0) {
            ctx.drawImage(tribImg, p.x, p.y, p.w, p.h);
          } else {
            ctx.fillStyle = '#475569';
            ctx.fillRect(p.x, p.y, p.w, p.h);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(p.x, p.y, p.w, 8);
          }
        } else if (p.type === 'barrier') {
          // Pit Wall
          ctx.fillStyle = '#e2e8f0';
          ctx.fillRect(p.x, p.y, p.w, p.h);
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 3;
          ctx.strokeRect(p.x, p.y, p.w, p.h);

          // Red / White angled caution stripes
          ctx.save();
          ctx.clip(new Path2D(`M${p.x},${p.y} h${p.w} v${p.h} h-${p.w} Z`));
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 10;
          for (let sx = p.x - 30; sx < p.x + p.w + 30; sx += 24) {
            ctx.beginPath();
            ctx.moveTo(sx, p.y);
            ctx.lineTo(sx + 15, p.y + p.h);
            ctx.stroke();
          }
          ctx.restore();
        } else if (p.type === 'tires') {
          const tImg = imagesRef.current.props.tires_red;
          if (tImg && tImg.complete) {
            ctx.drawImage(tImg, p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#dc2626';
            ctx.fill();
          }
        } else if (p.type === 'tree') {
          const treeImg = imagesRef.current.props.tree;
          if (treeImg && treeImg.complete) {
            ctx.drawImage(treeImg, p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#14532d';
            ctx.fill();
          }
        } else if (p.type === 'cone') {
          const coneImg = imagesRef.current.props.cone;
          if (coneImg && coneImg.complete) {
            ctx.drawImage(coneImg, p.x - 10, p.y - 10, 20, 20);
          } else {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#f97316';
            ctx.fill();
          }
        }
        ctx.restore();
      });

      // Pit Tents & Pit Crew Mechanics next to Pit Bays
      pit.bays.forEach((bay, bIdx) => {
        ctx.save();
        const tentImg = bay.tent === 'tent_red_large.png' ? imagesRef.current.props.tent_red : imagesRef.current.props.tent_blue;
        if (tentImg && tentImg.complete) {
          ctx.drawImage(tentImg, bay.x - 45, bay.y + 36, 90, 75);
        }

        // Pit Crew Mechanics Standing by the bay
        const crewKeys = ['crew_red', 'crew_blue', 'crew_green', 'crew_white'];
        const crewImg = imagesRef.current.props[crewKeys[bIdx % crewKeys.length]];
        if (crewImg && crewImg.complete) {
          ctx.drawImage(crewImg, bay.x - 30, bay.y + 32, 28, 28);
          ctx.drawImage(crewImg, bay.x + 8, bay.y + 32, 28, 28);
        }

        // Stacks of tires & drums next to garage
        const tireImg = imagesRef.current.props.tires_red;
        if (tireImg && tireImg.complete) {
          ctx.drawImage(tireImg, bay.x + 36, bay.y + 38, 24, 24);
        }
        ctx.restore();
      });

      // 8. Render Players & Cars
      if (Array.isArray(curState?.players)) {
        curState.players.forEach(p => {
          let interp = interpPlayersRef.current[p.id];
          if (!interp) {
            interp = { x: p.x, y: p.y, angle: p.angle, prevX: p.x, prevY: p.y };
            interpPlayersRef.current[p.id] = interp;
          } else {
            interp.prevX = interp.x;
            interp.prevY = interp.y;
            interp.x += (p.x - interp.x) * 0.40;
            interp.y += (p.y - interp.y) * 0.40;

            let diff = p.angle - interp.angle;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            interp.angle += diff * 0.40;
          }

          const isSelf = p.id === myPlayerId;
          const carImg = imagesRef.current.cars[p.carColor || 'red'];

          // Spawn Tire Skidmarks & Smoke when Drifting
          if (p.isDrifting && p.speed > 40) {
            // Rear wheels position
            const rX1 = interp.x - Math.cos(interp.angle) * 28 - Math.sin(interp.angle) * 16;
            const rY1 = interp.y - Math.sin(interp.angle) * 28 + Math.cos(interp.angle) * 16;
            const rX2 = interp.x - Math.cos(interp.angle) * 28 + Math.sin(interp.angle) * 16;
            const rY2 = interp.y - Math.sin(interp.angle) * 28 - Math.cos(interp.angle) * 16;

            if (interp.prevWheel1) {
              skidmarksRef.current.push({
                x1: interp.prevWheel1.x,
                y1: interp.prevWheel1.y,
                x2: rX1,
                y2: rY1,
                alpha: 0.55
              });
              skidmarksRef.current.push({
                x1: interp.prevWheel2.x,
                y1: interp.prevWheel2.y,
                x2: rX2,
                y2: rY2,
                alpha: 0.55
              });
            }
            interp.prevWheel1 = { x: rX1, y: rY1 };
            interp.prevWheel2 = { x: rX2, y: rY2 };

            // Smoke puffs
            for (let i = 0; i < 2; i++) {
              particlesRef.current.push({
                x: (rX1 + rX2) / 2 + (Math.random() - 0.5) * 12,
                y: (rY1 + rY2) / 2 + (Math.random() - 0.5) * 12,
                vx: -Math.cos(interp.angle) * 2 + (Math.random() - 0.5) * 3,
                vy: -Math.sin(interp.angle) * 2 + (Math.random() - 0.5) * 3,
                size: 8 + Math.random() * 8,
                color: 'rgba(226, 232, 240, 0.45)',
                life: 1.0,
                decay: 0.04
              });
            }
          } else {
            interp.prevWheel1 = null;
            interp.prevWheel2 = null;
          }

          // Nitro Flame Jets from Exhausts
          if (p.isNitroActive) {
            const exX = interp.x - Math.cos(interp.angle) * 35;
            const exY = interp.y - Math.sin(interp.angle) * 35;
            for (let i = 0; i < 3; i++) {
              particlesRef.current.push({
                x: exX + (Math.random() - 0.5) * 10,
                y: exY + (Math.random() - 0.5) * 10,
                vx: -Math.cos(interp.angle) * (8 + Math.random() * 6),
                vy: -Math.sin(interp.angle) * (8 + Math.random() * 6),
                size: 6 + Math.random() * 7,
                color: Math.random() > 0.4 ? '#38bdf8' : '#60a5fa',
                life: 0.8,
                decay: 0.08
              });
            }
          }

          // Off-road Grass Particle Spray
          if (p.onSurface === 'grass' && p.speed > 30) {
            particlesRef.current.push({
              x: interp.x + (Math.random() - 0.5) * 20,
              y: interp.y + (Math.random() - 0.5) * 20,
              vx: (Math.random() - 0.5) * 4,
              vy: (Math.random() - 0.5) * 4,
              size: 4 + Math.random() * 4,
              color: Math.random() > 0.5 ? '#15803d' : '#854d0e',
              life: 0.7,
              decay: 0.05
            });
          }

          // Draw Car
          ctx.save();
          ctx.translate(interp.x, interp.y);
          // Kenney cars face Up (North). Add Math.PI/2 to align with East 0 rad
          ctx.rotate(interp.angle + Math.PI / 2);

          // Car Drop Shadow
          ctx.beginPath();
          ctx.ellipse(4, 6, 24, 38, 0, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
          ctx.fill();

          if (carImg && carImg.complete && carImg.naturalWidth > 0) {
            // Original Kenney car sprite size: 71x131 -> draw scaled at 42x78
            ctx.drawImage(carImg, -21, -39, 42, 78);
          } else {
            // Procedural fallback vehicle
            ctx.fillStyle = p.carModel?.color || '#ef4444';
            ctx.fillRect(-18, -35, 36, 70);
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(-14, -15, 28, 22);
          }

          // Headlights Beam in Front
          ctx.beginPath();
          ctx.moveTo(-12, -38);
          ctx.lineTo(-24, -90);
          ctx.lineTo(24, -90);
          ctx.lineTo(12, -38);
          ctx.closePath();
          ctx.fillStyle = 'rgba(254, 240, 138, 0.12)';
          ctx.fill();

          ctx.restore();

          // Overhead Player Tag (Rank, Name, Speed)
          ctx.save();
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = '#ffffff';

          // Rank Badge
          const rankText = `P${p.liveRank || p.rank || 1}`;
          const badgeColor = p.liveRank === 1 ? '#eab308' : (p.liveRank === 2 ? '#94a3b8' : '#b45309');
          ctx.fillStyle = badgeColor;
          ctx.fillRect(interp.x - 30, interp.y - 56, 20, 16);
          ctx.fillStyle = '#000000';
          ctx.font = '900 10px sans-serif';
          ctx.fillText(rankText, interp.x - 20, interp.y - 44);

          // Name
          ctx.fillStyle = isSelf ? '#38bdf8' : '#ffffff';
          ctx.font = 'bold 11px sans-serif';
          ctx.fillText(`${p.name}`, interp.x + 8, interp.y - 44);

          // If in pit, show PIT STOP service tag
          if (p.inPit) {
            ctx.fillStyle = '#eab308';
            ctx.font = '900 10px sans-serif';
            ctx.fillText('⚡ PİT SERVİSİ', interp.x, interp.y + 45);
          }

          ctx.restore();
        });
      }

      // 9. Update & Render Active Particles (Smoke, Nitro, Sparks)
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const pt = particlesRef.current[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life -= pt.decay;
        if (pt.life <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = Math.max(0, pt.life);
        ctx.fill();
        ctx.restore();
      }

      ctx.restore(); // Restore camera transform

      // 10. Start Lights Gantry Overlay during Countdown
      if (curState?.countdownSeconds != null && curState.countdownSeconds > 0) {
        ctx.save();
        const gW = 280;
        const gH = 90;
        const gX = width / 2 - gW / 2;
        const gY = 60;

        ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
        ctx.beginPath();
        ctx.roundRect(gX, gY, gW, gH, 18);
        ctx.fill();
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 3;
        ctx.stroke();

        // 5 Starting Light Bulbs
        const bulbR = 18;
        const bulbSpacing = 48;
        const startX = width / 2 - 2 * bulbSpacing;

        for (let b = 0; b < 5; b++) {
          const bx = startX + b * bulbSpacing;
          const by = gY + 45;

          ctx.beginPath();
          ctx.arc(bx, by, bulbR, 0, Math.PI * 2);
          let bulbColor = '#334155'; // Dark off

          if (curState.lightsState === 'red') {
            bulbColor = '#ef4444'; // Red lights
          } else if (curState.lightsState === 'yellow' || curState.lightsState === 'yellow_flash') {
            bulbColor = '#f59e0b'; // Yellow ready
          } else if (curState.lightsState === 'green') {
            bulbColor = '#22c55e'; // Green GO!
          }

          ctx.fillStyle = bulbColor;
          ctx.fill();
          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        ctx.font = '900 13px sans-serif';
        ctx.fillStyle = '#e2e8f0';
        ctx.textAlign = 'center';
        ctx.fillText(
          curState.lightsState === 'green'
            ? 'GAZA BAS! BAŞLA!'
            : `YARIŞ BAŞLIYOR: ${curState.countdownSeconds}`,
          width / 2,
          gY + 80
        );

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [myPlayerId]);

  // Window resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-emerald-950 select-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
