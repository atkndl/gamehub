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
  tribune_empty: '/assets/racing/Objects/tribune_empty.png',
  barrier: '/assets/racing/Objects/barrier_red_race.png',
  cone: '/assets/racing/Objects/cone_straight.png',
  tree: '/assets/racing/Objects/tree_large.png',
  tree_small: '/assets/racing/Objects/tree_small.png',
  barrel: '/assets/racing/Objects/barrel_red.png',
  rock: '/assets/racing/Objects/rock1.png',
  arrow: '/assets/racing/Objects/arrow_yellow.png',
  lights: '/assets/racing/Objects/lights.png',
  oil: '/assets/racing/Objects/oil.png',
  crew_red: '/assets/racing/Characters/character_black_red.png',
  crew_blue: '/assets/racing/Characters/character_black_blue.png',
  crew_green: '/assets/racing/Characters/character_black_green.png',
  crew_white: '/assets/racing/Characters/character_black_white.png'
};

const SPECTATOR_SPRITES = [
  '/assets/racing/Characters/character_black_red.png',
  '/assets/racing/Characters/character_black_blue.png',
  '/assets/racing/Characters/character_black_green.png',
  '/assets/racing/Characters/character_black_white.png',
  '/assets/racing/Characters/character_blonde_blue.png',
  '/assets/racing/Characters/character_blonde_red.png',
  '/assets/racing/Characters/character_blonde_green.png',
  '/assets/racing/Characters/character_brown_green.png',
  '/assets/racing/Characters/character_brown_red.png',
  '/assets/racing/Characters/character_brown_blue.png',
  '/assets/racing/Characters/character_brown_white.png'
];

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
    props: {},
    spectators: []
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
    SPECTATOR_SPRITES.forEach(src => {
      const img = new Image();
      img.src = src;
      imagesRef.current.spectators.push(img);
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
      const myPlayer = Array.isArray(curState?.players)
        ? curState.players.find(p => p.id === myPlayerId) || curState.players[0]
        : curState?.players?.[myPlayerId];

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
      for (let x = 0; x < track.width; x += 120) {
        if ((x / 120) % 2 === 0) {
          ctx.fillRect(x, 0, 120, track.height);
        }
      }

      // 3. Render Asphalt Road with Striped Red/White Curbs
      ctx.save();
      const roadPath = new Path2D();
      track.waypoints.forEach((pt, idx) => {
        if (idx === 0) roadPath.moveTo(pt.x, pt.y);
        else roadPath.lineTo(pt.x, pt.y);
      });
      roadPath.closePath();

      // Outer Red & White Curbs (Kerbs)
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#dc2626'; // Red curb base
      ctx.lineWidth = track.roadWidth + 36;
      ctx.stroke(roadPath);

      // Dash white pattern onto curb edges
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = track.roadWidth + 36;
      ctx.setLineDash([35, 35]);
      ctx.stroke(roadPath);
      ctx.setLineDash([]);

      // Main Dark Asphalt Surface
      ctx.strokeStyle = '#1e293b'; // High grip dark asphalt
      ctx.lineWidth = track.roadWidth;
      ctx.stroke(roadPath);

      // Inner Asphalt Texture
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = track.roadWidth - 24;
      ctx.stroke(roadPath);

      // Road Centerline Dashed Marking
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.lineWidth = 4;
      ctx.setLineDash([30, 30]);
      ctx.stroke(roadPath);
      ctx.setLineDash([]);
      ctx.restore();

      // 4. Render Pit Lane (Parallel Road South of Main Straight)
      const pit = track.pitLane;
      ctx.save();
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';

      // Pit Lane Asphalt
      ctx.beginPath();
      ctx.moveTo(pit.entry.x, pit.entry.y);
      ctx.lineTo(pit.startX, pit.laneY);
      ctx.lineTo(pit.endX, pit.laneY);
      ctx.lineTo(pit.exit.x, pit.exit.y);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = track.pitRoadWidth;
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

      // 5 Pit Service Box Markings on Asphalt (One designated for each car color)
      pit.bays.forEach(bay => {
        const isMyBay = myPlayer?.carColor === bay.colorKey;

        // Colored bay box
        ctx.strokeStyle = bay.color;
        ctx.lineWidth = isMyBay ? 5 : 3;
        ctx.strokeRect(bay.x - 44, bay.y - 30, 88, 60);

        ctx.fillStyle = isMyBay ? `${bay.color}45` : `${bay.color}20`;
        ctx.fillRect(bay.x - 44, bay.y - 30, 88, 60);

        // Box Number & Team Label
        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(bay.team.split('/')[1] || `PİT ${bay.id + 1}`, bay.x, bay.y - 38);

        // Service Stop Pad Marking inside Box
        ctx.fillStyle = bay.color;
        ctx.fillRect(bay.x - 26, bay.y - 4, 52, 8);

        // If it's my car's designated pit bay, draw an indicator arrow!
        if (isMyBay) {
          ctx.font = 'bold 12px sans-serif';
          ctx.fillStyle = '#fde047';
          ctx.fillText('▼ SENİN GARAJIN', bay.x, bay.y - 52);
        }
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
          sm.alpha -= 0.0006; // Slow fade
          if (sm.alpha <= 0) skidmarksRef.current.splice(i, 1);
        }
        ctx.restore();
      }

      // 7. Render Environmental Props (Grandstands with spectators, Tents, Barriers, Trees, Lights, Arrows, Rocks)
      track.props.forEach(p => {
        ctx.save();
        if (p.type === 'tribune') {
          // Draw grandstand structure in 2:1 aspect ratio
          const tribImg = imagesRef.current.props.tribune;
          if (tribImg && tribImg.complete && tribImg.naturalWidth > 0) {
            ctx.drawImage(tribImg, p.x, p.y, p.w, p.h);
          } else {
            ctx.fillStyle = '#475569';
            ctx.fillRect(p.x, p.y, p.w, p.h);
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(p.x, p.y, p.w, 8);
          }

          // Populate grandstand with spectators in proper 52:36 aspect ratio!
          const specs = imagesRef.current.spectators;
          if (specs.length > 0) {
            // 3 Seating rows
            const rows = [p.y + 14, p.y + 42, p.y + 70];
            const specW = 24;
            const specH = 17; // exact 52:36 aspect ratio (1.41 : 1)
            const numPerRow = Math.floor((p.w - 18) / (specW + 3));

            rows.forEach((rowY, rIdx) => {
              for (let col = 0; col < numPerRow; col++) {
                const specIndex = Math.abs(Math.floor(p.x) + rIdx * 5 + col * 3) % specs.length;
                const sImg = specs[specIndex];
                if (sImg && sImg.complete && sImg.naturalWidth > 0) {
                  const specX = p.x + 10 + col * (specW + 3);
                  ctx.drawImage(sImg, specX, rowY, specW, specH);
                }
              }
            });
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
        } else if (p.type === 'rock') {
          const rockImg = imagesRef.current.props.rock;
          if (rockImg && rockImg.complete) {
            ctx.drawImage(rockImg, p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
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
        } else if (p.type === 'arrow') {
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle || 0);
          const arrowImg = imagesRef.current.props.arrow;
          if (arrowImg && arrowImg.complete) {
            ctx.drawImage(arrowImg, -16, -16, 32, 32);
          }
        } else if (p.type === 'light') {
          // Stadium light pole
          const lightImg = imagesRef.current.props.lights;
          if (lightImg && lightImg.complete) {
            ctx.drawImage(lightImg, p.x - 20, p.y - 20, 40, 40);
          }
        } else if (p.type === 'barrel') {
          const barrelImg = imagesRef.current.props.barrel;
          if (barrelImg && barrelImg.complete) {
            ctx.drawImage(barrelImg, p.x - 14, p.y - 14, 28, 28);
          }
        }
        ctx.restore();
      });

      // Pit Tents & Pit Crew Mechanics next to Pit Bays (5 Team Garages)
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
            interp.x += (p.x - interp.x) * 0.45;
            interp.y += (p.y - interp.y) * 0.45;

            // Angle wrap-around interpolation
            let diff = p.angle - interp.angle;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            interp.angle += diff * 0.45;
          }

          // Spawn Tire Skidmarks if drifting
          if (p.isDrifting || (p.handbrake && Math.hypot(p.vx, p.vy) > 3)) {
            const cos = Math.cos(interp.angle);
            const sin = Math.sin(interp.angle);
            // Left rear tire & right rear tire
            const lrX = interp.x - cos * 28 - sin * 16;
            const lrY = interp.y - sin * 28 + cos * 16;
            const rrX = interp.x - cos * 28 + sin * 16;
            const rrY = interp.y - sin * 28 - cos * 16;

            if (interp.prevLrX) {
              skidmarksRef.current.push({ x1: interp.prevLrX, y1: interp.prevLrY, x2: lrX, y2: lrY, alpha: 0.65 });
              skidmarksRef.current.push({ x1: interp.prevRrX, y1: interp.prevRrY, x2: rrX, y2: rrY, alpha: 0.65 });
            }
            interp.prevLrX = lrX;
            interp.prevLrY = lrY;
            interp.prevRrX = rrX;
            interp.prevRrY = rrY;

            // Drift smoke particles
            for (let i = 0; i < 2; i++) {
              particlesRef.current.push({
                x: lrX + (Math.random() - 0.5) * 8,
                y: lrY + (Math.random() - 0.5) * 8,
                vx: -p.vx * 0.2 + (Math.random() - 0.5) * 2,
                vy: -p.vy * 0.2 + (Math.random() - 0.5) * 2,
                size: 8 + Math.random() * 8,
                alpha: 0.55,
                color: 'rgba(241, 245, 249,'
              });
            }
          } else {
            interp.prevLrX = null;
            interp.prevRrX = null;
          }

          // Nitro Flame Exhausts
          if (p.isNitroActive) {
            const cos = Math.cos(interp.angle);
            const sin = Math.sin(interp.angle);
            const ex1X = interp.x - cos * 38 - sin * 10;
            const ex1Y = interp.y - sin * 38 + cos * 10;
            const ex2X = interp.x - cos * 38 + sin * 10;
            const ex2Y = interp.y - sin * 38 - cos * 10;

            for (let i = 0; i < 2; i++) {
              particlesRef.current.push({
                x: ex1X,
                y: ex1Y,
                vx: -cos * 8 + (Math.random() - 0.5) * 3,
                vy: -sin * 8 + (Math.random() - 0.5) * 3,
                size: 6 + Math.random() * 6,
                alpha: 0.85,
                color: 'rgba(56, 189, 248,'
              });
              particlesRef.current.push({
                x: ex2X,
                y: ex2Y,
                vx: -cos * 8 + (Math.random() - 0.5) * 3,
                vy: -sin * 8 + (Math.random() - 0.5) * 3,
                size: 6 + Math.random() * 6,
                alpha: 0.85,
                color: 'rgba(56, 189, 248,'
              });
            }
          }

          // Render Car Body
          ctx.save();
          ctx.translate(interp.x, interp.y);
          ctx.rotate(interp.angle + Math.PI / 2); // Rotate sprite to match heading

          // Car Drop Shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
          ctx.beginPath();
          ctx.ellipse(4, 4, 22, 38, 0, 0, Math.PI * 2);
          ctx.fill();

          const carImg = imagesRef.current.cars[p.carColor] || imagesRef.current.cars.red;
          if (carImg && carImg.complete) {
            ctx.drawImage(carImg, -21, -39, 42, 78);
          } else {
            ctx.fillStyle = p.carColor === 'blue' ? '#3b82f6' : '#ef4444';
            ctx.fillRect(-20, -38, 40, 76);
          }

          // Player Name & Rank Badge floating above car
          ctx.rotate(-(interp.angle + Math.PI / 2)); // Counter-rotate text
          ctx.font = 'bold 13px sans-serif';
          ctx.textAlign = 'center';

          // Background pill for nickname
          const isMe = p.id === myPlayerId;
          ctx.fillStyle = isMe ? 'rgba(30, 41, 59, 0.9)' : 'rgba(15, 23, 42, 0.75)';
          ctx.fillRect(-50, -56, 100, 20);
          ctx.strokeStyle = isMe ? '#f59e0b' : 'rgba(255, 255, 255, 0.2)';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(-50, -56, 100, 20);

          ctx.fillStyle = isMe ? '#fde047' : '#ffffff';
          ctx.fillText(p.name, 0, -42);

          ctx.restore();
        });
      }

      // 9. Render Particles (Drift Smoke, Nitro Flames, Sparks)
      if (particlesRef.current.length > 0) {
        ctx.save();
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
          const pt = particlesRef.current[i];
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
          ctx.fillStyle = `${pt.color} ${pt.alpha})`;
          ctx.fill();

          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.size *= 0.96;
          pt.alpha -= 0.035;

          if (pt.alpha <= 0 || pt.size <= 1) {
            particlesRef.current.splice(i, 1);
          }
        }
        ctx.restore();
      }

      // 10. Starting Countdown Lights Gantry (Rendered overhead at start line)
      if (curState?.countdownSeconds != null && curState.countdownSeconds > 0) {
        ctx.save();
        ctx.translate(1700, 2150);

        // Overhead gantry box
        ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 4;
        ctx.fillRect(-150, -140, 300, 80);
        ctx.strokeRect(-150, -140, 300, 80);

        // 5 Red Lights
        for (let i = 0; i < 5; i++) {
          const lx = -100 + i * 50;
          ctx.beginPath();
          ctx.arc(lx, -100, 16, 0, Math.PI * 2);

          if (curState.lightsState === 'red') {
            ctx.fillStyle = '#ef4444';
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 15;
          } else if (curState.lightsState === 'yellow') {
            ctx.fillStyle = '#eab308';
            ctx.shadowColor = '#eab308';
            ctx.shadowBlur = 15;
          } else {
            ctx.fillStyle = '#22c55e';
            ctx.shadowColor = '#22c55e';
            ctx.shadowBlur = 20;
          }
          ctx.fill();
        }
        ctx.restore();
      }

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    // Resize Canvas to Window
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [myPlayerId]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block bg-slate-950 cursor-crosshair"
    />
  );
}
