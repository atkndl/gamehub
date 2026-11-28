import React, { useRef, useEffect } from 'react';
import { SCOPES, WEAPONS } from '../../../server/survivalLogic';

export default function SurvivalCanvas({ state, myPlayerId, keysDownRef, onAim, onShoot, onStopShoot }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  const myPlayerIdRef = useRef(myPlayerId);
  myPlayerIdRef.current = myPlayerId;

  const smoothCamRef = useRef({ x: 2100, y: 2100 });
  const localPredictedRef = useRef({ x: 2100, y: 2100, initialized: false });
  const interpPlayersRef = useRef({});
  const prevHpRef = useRef(null);
  const damageFlashRef = useRef(0);
  const wetUntilRef = useRef(0);
  const sparksRef = useRef([]); // Metallic ricochet sparks & wood debris
  const prevCrateHpRef = useRef({});
  const prevCratePosRef = useRef({});

  // Handle Mouse Aiming & Shooting
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // In camera-centered coordinate system, player is at screen center!
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const angle = Math.atan2(mouseY - centerY, mouseX - centerX);
      onAim(angle);
    };

    const handleMouseDown = (e) => {
      if (e.button === 0) {
        onShoot();
      }
    };

    const handleMouseUp = (e) => {
      if (e.button === 0) {
        onStopShoot();
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('contextmenu', handleContextMenu);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [onAim, onShoot, onStopShoot]);

  // Handle Canvas Rendering Loop - Continuous & Independent of React Re-renders
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
      const curMyPlayerId = myPlayerIdRef.current;

      // Find my player in current server state
      const myPlayer = curState?.players?.find(p => p.id === curMyPlayerId);

      // Real-time client-side water pond detection (instant response)
      const curPx = localPredictedRef.current.initialized ? localPredictedRef.current.x : (myPlayer?.x || 2100);
      const curPy = localPredictedRef.current.initialized ? localPredictedRef.current.y : (myPlayer?.y || 2100);

      let localInWater = false;
      if (Array.isArray(curState?.ponds)) {
        for (const pond of curState.ponds) {
          const dx = curPx - pond.x;
          const dy = curPy - pond.y;
          if (dx * dx + dy * dy < (pond.radius + 6) * (pond.radius + 6)) {
            localInWater = true;
            break;
          }
        }
      }

      const nowTime = Date.now();
      if (localInWater) {
        wetUntilRef.current = nowTime + 4000; // Lingering wetness for 4 seconds
      }
      const localIsWet = localInWater || (wetUntilRef.current && nowTime < wetUntilRef.current) || Boolean(myPlayer?.isWet);
      const inWaterFinal = localInWater || Boolean(myPlayer?.inWater);

      // Local player position smoothing & responsive camera
      if (myPlayer) {
        if (!localPredictedRef.current.initialized) {
          localPredictedRef.current = { x: myPlayer.x, y: myPlayer.y, initialized: true };
        } else {
          // Reconcile towards authoritative server position smoothly
          const dx = myPlayer.x - localPredictedRef.current.x;
          const dy = myPlayer.y - localPredictedRef.current.y;
          const dist = Math.hypot(dx, dy);

          if (dist > 180) {
            // Large warp or respawn: snap immediately
            localPredictedRef.current.x = myPlayer.x;
            localPredictedRef.current.y = myPlayer.y;
          } else {
            // Smoothly glide towards authoritative server position without runaway drift or sticking
            localPredictedRef.current.x += dx * 0.40;
            localPredictedRef.current.y += dy * 0.40;
          }
        }

        // Detect damage taken for full-screen red flash
        if (prevHpRef.current !== null && myPlayer.hp < prevHpRef.current - 0.5) {
          const lost = prevHpRef.current - myPlayer.hp;
          damageFlashRef.current = Math.min(0.70, 0.30 + lost * 0.02);
        }
        prevHpRef.current = myPlayer.hp;
      }

      const targetCamX = localPredictedRef.current.initialized ? localPredictedRef.current.x : 2100;
      const targetCamY = localPredictedRef.current.initialized ? localPredictedRef.current.y : 2100;

      // Ultra-smooth camera glide following player
      smoothCamRef.current.x += (targetCamX - smoothCamRef.current.x) * 0.38;
      smoothCamRef.current.y += (targetCamY - smoothCamRef.current.y) * 0.38;
      const camX = smoothCamRef.current.x;
      const camY = smoothCamRef.current.y;

      // Determine camera zoom based on equipped scope
      const scopeKey = myPlayer?.scope || '1x';
      const zoom = SCOPES[scopeKey]?.zoom || 1.65;

      // 1. Clear background
      ctx.fillStyle = '#0a0f1d';
      ctx.fillRect(0, 0, width, height);

      // Save base transform
      ctx.save();

      // Camera transformation: Center on player, scale by zoom, translate to world
      ctx.translate(width / 2, height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-camX, -camY);

      const mapSize = curState?.mapSize || 4200;

      // 2. Render Ground Terrain (Tactical dark grass with subtle grid)
      ctx.fillStyle = '#162217';
      ctx.fillRect(0, 0, mapSize, mapSize);

      // Subtle tactical terrain grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      const gridSize = 100;
      for (let x = 0; x <= mapSize; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, mapSize);
        ctx.stroke();
      }
      for (let y = 0; y <= mapSize; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(mapSize, y);
        ctx.stroke();
      }

      // Outer map void boundary
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 6;
      ctx.strokeRect(0, 0, mapSize, mapSize);

      // 3. Render Water Ponds
      if (Array.isArray(curState?.ponds)) {
        curState.ponds.forEach(pond => {
          ctx.save();
          // Sandy shoreline
          ctx.beginPath();
          ctx.arc(pond.x, pond.y, pond.radius + 14, 0, Math.PI * 2);
          ctx.fillStyle = '#b45309';
          ctx.fill();

          // Water body
          ctx.beginPath();
          ctx.arc(pond.x, pond.y, pond.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#0284c7';
          ctx.fill();

          // Double water ripple waves
          const rippleRadius1 = pond.radius * (0.35 + 0.3 * Math.sin(Date.now() / 600));
          ctx.beginPath();
          ctx.arc(pond.x, pond.y, rippleRadius1, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          const rippleRadius2 = pond.radius * (0.65 + 0.25 * Math.sin(Date.now() / 800 + 1));
          ctx.beginPath();
          ctx.arc(pond.x, pond.y, rippleRadius2, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(186, 230, 253, 0.25)';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.restore();
        });
      }

      // 4. Render Ground Loot
      if (Array.isArray(curState?.loot)) {
        curState.loot.forEach(item => {
          ctx.save();
          const bob = Math.sin(Date.now() / 250) * 2.5;

          // Glowing loot shadow
          ctx.shadowBlur = 12;
          ctx.shadowColor = item.type === 'weapon' ? '#fbbf24' : (item.type === 'scope' ? '#818cf8' : '#10b981');

          // Loot pedestal base
          ctx.beginPath();
          ctx.arc(item.x, item.y, 18, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Loot Icon / Label
          ctx.font = '18px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowBlur = 0;
          ctx.fillText(item.icon || '📦', item.x, item.y + bob);

          // Name tag
          ctx.font = 'bold 9px sans-serif';
          ctx.fillStyle = '#ffffff';
          ctx.fillText(item.name || '', item.x, item.y + 26);

          ctx.restore();
        });
      }

      // 5. Render Rectangular Obstacles (Crates, Shipping Containers, Buildings)
      if (Array.isArray(curState?.obstacles)) {
        curState.obstacles.forEach(ob => {
          ctx.save();

          if (ob.type === 'crate') {
            // Wooden Breakable Crate - Kademeli küçülme ve kırılma efekti!
            const hpRatio = Math.max(0.15, Math.min(1, (ob.hp / (ob.maxHp || 60))));
            const scale = 0.55 + 0.45 * hpRatio;
            const curW = ob.w * scale;
            const curH = ob.h * scale;
            const drawX = ob.x + (ob.w - curW) / 2;
            const drawY = ob.y + (ob.h - curH) / 2;

            // Base wood crate
            ctx.fillStyle = '#854d0e';
            ctx.fillRect(drawX, drawY, curW, curH);

            // Crate slats & diagonals
            ctx.strokeStyle = '#451a03';
            ctx.lineWidth = Math.max(1.5, 3 * scale);
            ctx.strokeRect(drawX + 2, drawY + 2, curW - 4, curH - 4);
            ctx.beginPath();
            ctx.moveTo(drawX, drawY);
            ctx.lineTo(drawX + curW, drawY + curH);
            ctx.moveTo(drawX + curW, drawY);
            ctx.lineTo(drawX, drawY + curH);
            ctx.stroke();

            // Fracture cracks if damaged
            if (hpRatio < 0.8) {
              ctx.strokeStyle = 'rgba(20, 10, 5, 0.85)';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(drawX + curW * 0.3, drawY + 2);
              ctx.lineTo(drawX + curW * 0.48, drawY + curH * 0.5);
              ctx.lineTo(drawX + curW * 0.38, drawY + curH - 2);
              ctx.stroke();
            }
            if (hpRatio < 0.45) {
              ctx.strokeStyle = 'rgba(15, 7, 3, 0.95)';
              ctx.lineWidth = 2.5;
              ctx.beginPath();
              ctx.moveTo(drawX + 2, drawY + curH * 0.6);
              ctx.lineTo(drawX + curW * 0.55, drawY + curH * 0.42);
              ctx.lineTo(drawX + curW - 2, drawY + curH * 0.3);
              ctx.stroke();
            }

            // Crate HP bar if damaged
            if (ob.hp < (ob.maxHp || 60)) {
              ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
              ctx.fillRect(drawX + 2, drawY - 9, curW - 4, 3.5);
              ctx.fillStyle = hpRatio > 0.5 ? '#eab308' : '#ef4444';
              ctx.fillRect(drawX + 2, drawY - 9, (curW - 4) * hpRatio, 3.5);
            }
          } else if (ob.type === 'container') {
            // Shipping Container (Corrugated metal box - BULLETS RICOCHET OFF THIS!)
            const color = ob.color || '#dc2626';
            ctx.fillStyle = color;
            ctx.fillRect(ob.x, ob.y, ob.w, ob.h);

            // Metallic sheen border
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 3;
            ctx.strokeRect(ob.x, ob.y, ob.w, ob.h);

            // Corrugated metal ridges
            ctx.lineWidth = 2;
            const isHorizontal = ob.w > ob.h;
            if (isHorizontal) {
              for (let rx = ob.x + 10; rx < ob.x + ob.w - 6; rx += 14) {
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
                ctx.beginPath();
                ctx.moveTo(rx, ob.y + 2);
                ctx.lineTo(rx, ob.y + ob.h - 2);
                ctx.stroke();

                ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
                ctx.beginPath();
                ctx.moveTo(rx + 2, ob.y + 2);
                ctx.lineTo(rx + 2, ob.y + ob.h - 2);
                ctx.stroke();
              }
            } else {
              for (let ry = ob.y + 10; ry < ob.y + ob.h - 6; ry += 14) {
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
                ctx.beginPath();
                ctx.moveTo(ob.x + 2, ry);
                ctx.lineTo(ob.x + ob.w - 2, ry);
                ctx.stroke();

                ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
                ctx.beginPath();
                ctx.moveTo(ob.x + 2, ry + 2);
                ctx.lineTo(ob.x + ob.w - 2, ry + 2);
                ctx.stroke();
              }
            }

            // Small "METAL / RICOCHET" label icon
            ctx.font = 'bold 9px sans-serif';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.textAlign = 'center';
            ctx.fillText('⚡ METAL', ob.x + ob.w / 2, ob.y + ob.h / 2 + 3);
          } else if (ob.type === 'wall') {
            ctx.fillStyle = '#475569';
            ctx.fillRect(ob.x, ob.y, ob.w, ob.h);
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 2;
            ctx.strokeRect(ob.x, ob.y, ob.w, ob.h);
          }

          ctx.restore();
        });
      }

      // 6. Render Circular Obstacles (Barrels, Rocks, Trees)
      if (Array.isArray(curState?.circularObstacles)) {
        curState.circularObstacles.forEach(cob => {
          ctx.save();

          if (cob.type === 'barrel') {
            // Explosive Red Barrel
            ctx.beginPath();
            ctx.arc(cob.x, cob.y, cob.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#dc2626';
            ctx.fill();
            ctx.strokeStyle = '#7f1d1d';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Hazard Warning stripes
            ctx.beginPath();
            ctx.arc(cob.x, cob.y, cob.radius * 0.5, 0, Math.PI * 2);
            ctx.fillStyle = '#facc15';
            ctx.fill();

            ctx.font = 'bold 12px sans-serif';
            ctx.fillStyle = '#000000';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('☣', cob.x, cob.y);
          } else if (cob.type === 'rock') {
            // Boulder / Rock
            ctx.beginPath();
            ctx.arc(cob.x, cob.y, cob.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#64748b';
            ctx.fill();
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(cob.x - cob.radius * 0.25, cob.y - cob.radius * 0.25, cob.radius * 0.45, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.fill();
          } else if (cob.type === 'tree') {
            // Tree Trunk
            ctx.beginPath();
            ctx.arc(cob.x, cob.y, cob.radius * 0.45, 0, Math.PI * 2);
            ctx.fillStyle = '#78350f';
            ctx.fill();

            // Tree Canopy Foliage Overhead
            ctx.beginPath();
            ctx.arc(cob.x, cob.y, cob.radius * 1.55, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(21, 128, 61, 0.88)';
            ctx.fill();

            // Canopy inner highlight
            ctx.beginPath();
            ctx.arc(cob.x - cob.radius * 0.3, cob.y - cob.radius * 0.3, cob.radius * 0.7, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(34, 197, 94, 0.4)';
            ctx.fill();
          }

          ctx.restore();
        });
      }

      // 7. Render Flying Glowing Bullets & Metallic Ricochet Trails
      if (Array.isArray(curState?.bullets)) {
        curState.bullets.forEach(b => {
          ctx.save();
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.hasRicocheted ? 4.5 : 3.5, 0, Math.PI * 2);
          ctx.fillStyle = b.hasRicocheted ? '#fef08a' : (b.color || '#fef08a');
          ctx.shadowColor = b.hasRicocheted ? '#f59e0b' : (b.color || '#facc15');
          ctx.shadowBlur = b.hasRicocheted ? 12 : 8;
          ctx.fill();

          // Tracer line
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(b.x - b.vx * 2, b.y - b.vy * 2);
          ctx.strokeStyle = b.hasRicocheted ? '#fbbf24' : (b.color || '#fef08a');
          ctx.lineWidth = b.hasRicocheted ? 3.5 : 2.5;
          ctx.stroke();
          ctx.restore();
        });
      }

      // 8. Render Players
      if (Array.isArray(curState?.players)) {
        curState.players.forEach(p => {
          if (!p.isAlive) return;

          const isSelf = p.id === curMyPlayerId;

          let renderX = p.x;
          let renderY = p.y;
          let renderAngle = p.angle || 0;

          if (isSelf && localPredictedRef.current.initialized) {
            const keys = keysDownRef?.current;
            let mx = 0;
            let my = 0;
            if (keys?.w) my -= 1;
            if (keys?.s) my += 1;
            if (keys?.a) mx -= 1;
            if (keys?.d) mx += 1;
            if (mx !== 0 && my !== 0) {
              mx *= 0.7071;
              my *= 0.7071;
            }
            renderX = localPredictedRef.current.x + mx * 3.5;
            renderY = localPredictedRef.current.y + my * 3.5;
          } else {
            let interp = interpPlayersRef.current[p.id];
            if (!interp) {
              interp = { x: p.x, y: p.y, angle: p.angle || 0 };
              interpPlayersRef.current[p.id] = interp;
            } else {
              interp.x += (p.x - interp.x) * 0.35;
              interp.y += (p.y - interp.y) * 0.35;
              let diff = (p.angle || 0) - interp.angle;
              while (diff < -Math.PI) diff += Math.PI * 2;
              while (diff > Math.PI) diff -= Math.PI * 2;
              interp.angle += diff * 0.35;
            }
            renderX = interp.x;
            renderY = interp.y;
            renderAngle = interp.angle;
          }

          // Check if player is concealed in a bush
          let insideBush = false;
          if (Array.isArray(curState?.bushes)) {
            for (const bush of curState.bushes) {
              const dx = renderX - bush.x;
              const dy = renderY - bush.y;
              if (dx * dx + dy * dy < bush.radius * bush.radius) {
                insideBush = true;
                break;
              }
            }
          }

          if (insideBush && !isSelf) {
            if (!p.isShooting) return;
          }

          ctx.save();
          ctx.translate(renderX, renderY);
          ctx.rotate(renderAngle);

          if (insideBush && isSelf) {
            ctx.globalAlpha = 0.55;
          }

          // If in water, draw swimming/wading ripple ring around player
          if ((isSelf && inWaterFinal) || p.inWater) {
            ctx.beginPath();
            ctx.arc(0, 0, p.radius + 6 + Math.sin(Date.now() / 200) * 3, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
            ctx.lineWidth = 2.5;
            ctx.stroke();
          }

          // Hands & Weapon
          const active = p.weapons[p.activeSlot];
          const isMelee = !active || active.isMelee;

          if (isMelee) {
            const punchOffset = p.isPunching ? 14 : 0;
            const rightHandX = 14 + (p.lastMeleePunchHand === 1 ? punchOffset : 0);
            const leftHandX = 14 + (p.lastMeleePunchHand === -1 ? punchOffset : 0);

            // Left Hand
            ctx.beginPath();
            ctx.arc(leftHandX, -16, 7.5, 0, Math.PI * 2);
            ctx.fillStyle = '#f59e0b';
            ctx.fill();
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Right Hand
            ctx.beginPath();
            ctx.arc(rightHandX, 16, 7.5, 0, Math.PI * 2);
            ctx.fillStyle = '#f59e0b';
            ctx.fill();
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 2;
            ctx.stroke();
          } else {
            // Gun Barrel
            const weaponLen = active.length || 32;
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(8, -3.5, weaponLen, 7);
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(8, -3.5, weaponLen, 7);

            // Hands gripping weapon
            ctx.beginPath();
            ctx.arc(14, -13, 7, 0, Math.PI * 2);
            ctx.fillStyle = '#f59e0b';
            ctx.fill();
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(weaponLen - 6, 7, 7, 0, Math.PI * 2);
            ctx.fillStyle = '#f59e0b';
            ctx.fill();
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 2;
            ctx.stroke();
          }

          // Main Player Circle Body
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = isSelf ? '#38bdf8' : '#f87171';
          ctx.fill();
          ctx.strokeStyle = isSelf ? '#0284c7' : '#dc2626';
          ctx.lineWidth = 3;
          ctx.stroke();

          // Vest Armor Outline
          if (p.vestLevel > 0) {
            ctx.beginPath();
            ctx.arc(0, 0, p.radius - 4, 0, Math.PI * 2);
            ctx.strokeStyle = '#3b82f6';
            ctx.lineWidth = 3.5;
            ctx.stroke();
          }

          // Helmet Armor Outline
          if (p.helmetLevel > 0) {
            ctx.beginPath();
            ctx.arc(0, 0, p.radius * 0.45, 0, Math.PI * 2);
            ctx.fillStyle = '#1e293b';
            ctx.fill();
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2;
            ctx.stroke();
          }

          // Invulnerability Shield Glow
          if (p.isInvulnerable) {
            ctx.beginPath();
            ctx.arc(0, 0, p.radius + 6, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
            ctx.lineWidth = 3;
            ctx.setLineDash([6, 6]);
            ctx.stroke();
            ctx.setLineDash([]);
          }

          ctx.restore();

          // Player Name & HP overhead tag
          ctx.save();
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 4;
          ctx.shadowColor = '#000000';
          ctx.fillText(`${p.avatar || ''} ${p.name}`, renderX, renderY - p.radius - 16);

          // Small HP Bar overhead
          const hpWidth = 36;
          const hpHeight = 4;
          const hpRatio = Math.max(0, p.hp / p.maxHp);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
          ctx.fillRect(renderX - hpWidth / 2, renderY - p.radius - 12, hpWidth, hpHeight);
          ctx.fillStyle = hpRatio > 0.5 ? '#22c55e' : (hpRatio > 0.25 ? '#f59e0b' : '#ef4444');
          ctx.fillRect(renderX - hpWidth / 2, renderY - p.radius - 12, hpWidth * hpRatio, hpHeight);

          ctx.restore();
        });
      }

      // 9. Render Soft Bushes (Players inside are camouflaged)
      if (Array.isArray(curState?.bushes)) {
        curState.bushes.forEach(b => {
          ctx.save();
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(22, 101, 52, 0.85)';
          ctx.fill();

          ctx.beginPath();
          ctx.arc(b.x + b.radius * 0.2, b.y - b.radius * 0.2, b.radius * 0.6, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(34, 197, 94, 0.4)';
          ctx.fill();

          ctx.restore();
        });
      }

      // 10. Render Safe Zone (Alan Modu Red Zone Boundary & Target Circle)
      if (curState?.mode === 'battle_royale' && curState?.zone) {
        const z = curState.zone;
        ctx.save();

        // Safe zone target circle (dotted white circle showing where the zone is shrinking to)
        if (z.targetRadius && z.targetRadius < z.currentRadius) {
          ctx.beginPath();
          ctx.setLineDash([12, 12]);
          ctx.arc(z.x, z.y, z.targetRadius, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.lineWidth = 2.5;
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Safe zone circle border
        ctx.beginPath();
        ctx.arc(z.x, z.y, z.currentRadius, 0, Math.PI * 2);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 3.5;
        ctx.stroke();

        // Invert path to shade everything OUTSIDE the safe circle in toxic red gas
        ctx.beginPath();
        ctx.rect(-2000, -2000, mapSize + 4000, mapSize + 4000);
        ctx.arc(z.x, z.y, z.currentRadius, 0, Math.PI * 2, true);
        ctx.fillStyle = 'rgba(239, 68, 68, 0.28)';
        ctx.fill();

        // Pulsing border aura
        const aura = (Math.sin(Date.now() / 200) + 1) / 2;
        ctx.beginPath();
        ctx.arc(z.x, z.y, z.currentRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(239, 68, 68, ${0.4 + aura * 0.5})`;
        ctx.lineWidth = 8;
        ctx.stroke();

        ctx.restore();
      }

      // Track crate damage and spawn wooden splinter particles
      if (Array.isArray(curState?.obstacles)) {
        const curCrateMap = {};
        curState.obstacles.forEach(ob => {
          if (ob.type === 'crate') {
            curCrateMap[ob.id] = ob.hp;
            const prevHp = prevCrateHpRef.current[ob.id];
            if (prevHp !== undefined && ob.hp < prevHp) {
              // Crate took damage: spawn flying wood splinter chips
              const cx = ob.x + ob.w / 2;
              const cy = ob.y + ob.h / 2;
              const colors = ['#854d0e', '#a16207', '#ca8a04', '#713f12', '#d97706'];
              for (let i = 0; i < 8; i++) {
                const angle = Math.random() * Math.PI * 2;
                const spd = 2 + Math.random() * 4.5;
                sparksRef.current.push({
                  x: cx + Math.cos(angle) * 10,
                  y: cy + Math.sin(angle) * 10,
                  vx: Math.cos(angle) * spd,
                  vy: Math.sin(angle) * spd,
                  size: 3 + Math.random() * 3.5,
                  color: colors[Math.floor(Math.random() * colors.length)],
                  life: 1.0
                });
              }
            }
            prevCratePosRef.current[ob.id] = { x: ob.x + ob.w / 2, y: ob.y + ob.h / 2 };
          }
        });

        // Detect shattered crates (existed in prev frame, no longer in current)
        Object.keys(prevCrateHpRef.current).forEach(id => {
          if (curCrateMap[id] === undefined) {
            const pos = prevCratePosRef.current[id];
            if (pos) {
              const colors = ['#854d0e', '#a16207', '#ca8a04', '#713f12', '#451a03', '#f59e0b'];
              for (let i = 0; i < 18; i++) {
                const angle = Math.random() * Math.PI * 2;
                const spd = 3 + Math.random() * 6;
                sparksRef.current.push({
                  x: pos.x + Math.cos(angle) * 12,
                  y: pos.y + Math.sin(angle) * 12,
                  vx: Math.cos(angle) * spd,
                  vy: Math.sin(angle) * spd,
                  size: 4 + Math.random() * 4,
                  color: colors[Math.floor(Math.random() * colors.length)],
                  life: 1.2
                });
              }
              delete prevCratePosRef.current[id];
            }
          }
        });
        prevCrateHpRef.current = curCrateMap;
      }

      // Render & update active particle sparks & wood debris
      for (let sIdx = sparksRef.current.length - 1; sIdx >= 0; sIdx--) {
        const spark = sparksRef.current[sIdx];
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vx *= 0.91;
        spark.vy *= 0.91;
        spark.life -= 0.038;
        if (spark.life <= 0) {
          sparksRef.current.splice(sIdx, 1);
          continue;
        }
        ctx.save();
        ctx.fillStyle = spark.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, spark.life));
        ctx.fillRect(spark.x - spark.size / 2, spark.y - spark.size / 2, spark.size, spark.size);
        ctx.restore();
      }

      // Restore camera transform
      ctx.restore();

      // --- FULL-SCREEN OVERLAYS (Wet Vignette, Damage Red Flash & Zone Danger Alert) ---
      // 1. Wet Blue Screen Tint, Vignette & Water Droplets (when wading or soaked)
      if (localIsWet) {
        const wetAlpha = inWaterFinal ? 0.55 : 0.35;
        const wetGrad = ctx.createRadialGradient(width / 2, height / 2, width * 0.20, width / 2, height / 2, width * 0.75);
        wetGrad.addColorStop(0, 'rgba(14, 165, 233, 0.04)');
        wetGrad.addColorStop(0.5, `rgba(2, 132, 199, ${wetAlpha * 0.55})`);
        wetGrad.addColorStop(0.85, `rgba(2, 132, 199, ${wetAlpha * 0.85})`);
        wetGrad.addColorStop(1, `rgba(3, 105, 161, ${wetAlpha})`);
        ctx.fillStyle = wetGrad;
        ctx.fillRect(0, 0, width, height);

        // Blue screen water tint overlay across the entire screen
        ctx.fillStyle = `rgba(14, 165, 233, ${inWaterFinal ? 0.14 : 0.07})`;
        ctx.fillRect(0, 0, width, height);

        // Water droplet highlights on screen corners
        ctx.save();
        ctx.fillStyle = 'rgba(224, 242, 254, 0.45)';
        const t = Date.now() / 300;
        const dropletPositions = [
          { x: 35 + Math.sin(t) * 8, y: 45 + Math.cos(t) * 6, r: 8 },
          { x: 60 + Math.sin(t + 0.5) * 6, y: 35 + Math.cos(t + 0.5) * 8, r: 5 },
          { x: width - 40 + Math.sin(t + 1) * 8, y: 55 + Math.cos(t + 1) * 8, r: 10 },
          { x: width - 70 + Math.sin(t + 1.5) * 7, y: 40 + Math.cos(t + 1.5) * 6, r: 6 },
          { x: 50 + Math.sin(t + 2) * 10, y: height - 50 + Math.cos(t + 2) * 7, r: 9 },
          { x: 80 + Math.sin(t + 2.5) * 6, y: height - 35 + Math.cos(t + 2.5) * 9, r: 5 },
          { x: width - 45 + Math.sin(t + 3) * 8, y: height - 45 + Math.cos(t + 3) * 10, r: 11 },
          { x: width - 75 + Math.sin(t + 3.5) * 7, y: height - 60 + Math.cos(t + 3.5) * 7, r: 6 }
        ];
        dropletPositions.forEach(d => {
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.restore();
      }

      // 2. Full-Screen Red Damage Flash Vignette
      if (damageFlashRef.current > 0.01) {
        const dmgGrad = ctx.createRadialGradient(width / 2, height / 2, width * 0.2, width / 2, height / 2, width * 0.75);
        dmgGrad.addColorStop(0, 'rgba(239, 68, 68, 0)');
        dmgGrad.addColorStop(0.7, `rgba(220, 38, 38, ${damageFlashRef.current * 0.5})`);
        dmgGrad.addColorStop(1, `rgba(185, 28, 28, ${damageFlashRef.current})`);
        ctx.fillStyle = dmgGrad;
        ctx.fillRect(0, 0, width, height);

        damageFlashRef.current = Math.max(0, damageFlashRef.current - 0.022);
      }

      // 2b. Low HP Pulsing Blood Vignette & Danger Alert (Can azaldığında kaçırılmayacak net kırmızı efekt!)
      if (myPlayer && myPlayer.isAlive && myPlayer.hp <= 45) {
        const hpRatio = 1 - Math.max(0, myPlayer.hp / 45); // 0 at 45hp, 1 at 0hp
        const heartbeat = Math.sin(Date.now() / 180) * 0.5 + 0.5; // Hızlı nabız
        const alpha = Math.min(0.78, 0.22 + hpRatio * 0.34 + heartbeat * 0.22);

        const bloodGrad = ctx.createRadialGradient(
          width / 2, height / 2, Math.min(width, height) * 0.24,
          width / 2, height / 2, Math.max(width, height) * 0.72
        );
        bloodGrad.addColorStop(0, 'rgba(153, 27, 27, 0)');
        bloodGrad.addColorStop(0.60, `rgba(185, 28, 28, ${alpha * 0.45})`);
        bloodGrad.addColorStop(1, `rgba(127, 29, 29, ${alpha})`);
        ctx.fillStyle = bloodGrad;
        ctx.fillRect(0, 0, width, height);

        // Flashing thick red danger frame
        ctx.save();
        ctx.strokeStyle = `rgba(239, 68, 68, ${alpha * 0.85})`;
        ctx.lineWidth = 10 + heartbeat * 8;
        ctx.strokeRect(0, 0, width, height);
        ctx.restore();
      }

      // 3. Safe Zone Danger Alerts & Gas Pulsing
      if (curState?.mode === 'battle_royale' && curState?.zone && myPlayer) {
        const z = curState.zone;
        const distFromCenter = Math.hypot(myPlayer.x - z.x, myPlayer.y - z.y);
        const isOutsideZone = distFromCenter > z.currentRadius;

        if (isOutsideZone) {
          // Intense red toxic gas flashing around player
          const pulse = (Math.sin(Date.now() / 150) + 1) / 2;
          const gasGrad = ctx.createRadialGradient(width / 2, height / 2, width * 0.25, width / 2, height / 2, width * 0.72);
          gasGrad.addColorStop(0, 'rgba(239, 68, 68, 0.08)');
          gasGrad.addColorStop(0.7, `rgba(220, 38, 38, ${0.35 + pulse * 0.25})`);
          gasGrad.addColorStop(1, `rgba(185, 28, 28, ${0.55 + pulse * 0.3})`);
          ctx.fillStyle = gasGrad;
          ctx.fillRect(0, 0, width, height);
        } else if (z.isShrinking) {
          // Pulsing warning border when zone is actively shrinking
          const pulse = (Math.sin(Date.now() / 250) + 1) / 2;
          ctx.save();
          ctx.strokeStyle = `rgba(245, 158, 11, ${0.25 + pulse * 0.35})`;
          ctx.lineWidth = 14;
          ctx.strokeRect(0, 0, width, height);
          ctx.restore();
        }
      }

      // 11. Floating Tactical Minimap (HUD overlay on top right)
      const miniSize = 140;
      const miniPad = 16;
      const miniX = width - miniSize - miniPad;
      const miniY = miniPad;
      const miniScale = miniSize / mapSize;

      ctx.save();
      // Minimap background
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.fillRect(miniX, miniY, miniSize, miniSize);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 2;
      ctx.strokeRect(miniX, miniY, miniSize, miniSize);

      // Minimap Ponds
      if (Array.isArray(curState?.ponds)) {
        curState.ponds.forEach(pond => {
          ctx.beginPath();
          ctx.arc(miniX + pond.x * miniScale, miniY + pond.y * miniScale, Math.max(2, pond.radius * miniScale), 0, Math.PI * 2);
          ctx.fillStyle = '#0284c7';
          ctx.fill();
        });
      }

      // Minimap Buildings / Containers
      if (Array.isArray(curState?.obstacles)) {
        curState.obstacles.forEach(ob => {
          if (ob.type === 'wall' || ob.type === 'container') {
            ctx.fillStyle = ob.type === 'container' ? '#f59e0b' : '#64748b';
            ctx.fillRect(miniX + ob.x * miniScale, miniY + ob.y * miniScale, Math.max(1, ob.w * miniScale), Math.max(1, ob.h * miniScale));
          }
        });
      }

      // Minimap Safe Zone & Target
      if (curState?.mode === 'battle_royale' && curState?.zone) {
        const z = curState.zone;
        if (z.targetRadius && z.targetRadius < z.currentRadius) {
          ctx.beginPath();
          ctx.setLineDash([4, 4]);
          ctx.arc(miniX + z.x * miniScale, miniY + z.y * miniScale, z.targetRadius * miniScale, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.setLineDash([]);
        }

        ctx.beginPath();
        ctx.arc(miniX + z.x * miniScale, miniY + z.y * miniScale, z.currentRadius * miniScale, 0, Math.PI * 2);
        ctx.strokeStyle = z.isShrinking ? '#f59e0b' : '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      // Minimap Players - ONLY show self! (Düşmanların konumu gizlendi)
      if (Array.isArray(curState?.players)) {
        curState.players.forEach(p => {
          if (!p.isAlive) return;
          const isSelf = p.id === curMyPlayerId;
          if (!isSelf) return; // Rakipler haritada görünmez
          const px = localPredictedRef.current.initialized ? localPredictedRef.current.x : p.x;
          const py = localPredictedRef.current.initialized ? localPredictedRef.current.y : p.y;
          ctx.beginPath();
          ctx.arc(miniX + px * miniScale, miniY + py * miniScale, 4.5, 0, Math.PI * 2);
          ctx.fillStyle = '#38bdf8';
          ctx.fill();

          // Radar ping around self
          ctx.beginPath();
          ctx.arc(miniX + px * miniScale, miniY + py * miniScale, 7.5 + Math.sin(Date.now() / 200) * 2.5, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });
      }

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      running = false;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []); // Run continuous animation loop once on mount!

  // Dynamic canvas resizing
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
    <div className="fixed inset-0 overflow-hidden bg-slate-950 select-none cursor-crosshair">
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
      />
    </div>
  );
}
