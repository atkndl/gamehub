import React, { useRef, useEffect } from 'react';
import { SCOPES, WEAPONS } from '../../../server/survivalLogic';

export default function SurvivalCanvas({ state, myPlayerId, onAim, onShoot, onStopShoot }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);

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
        // Left click
        onShoot();
      }
    };

    const handleMouseUp = (e) => {
      if (e.button === 0) {
        onStopShoot();
      }
    };

    const handleContextMenu = (e) => {
      e.preventDefault(); // Prevent right-click context menu
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

  // Handle Canvas Rendering Loop
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

      // Find my player
      const myPlayer = state?.players?.find(p => p.id === myPlayerId);
      const camX = myPlayer ? myPlayer.x : 2100;
      const camY = myPlayer ? myPlayer.y : 2100;

      // Determine camera zoom based on equipped scope
      const scopeKey = myPlayer?.scope || '1x';
      const zoom = SCOPES[scopeKey]?.zoom || 1.0;

      // 1. Clear background
      ctx.fillStyle = '#0a0f1d';
      ctx.fillRect(0, 0, width, height);

      // Save base transform
      ctx.save();

      // Camera transformation: Center on player, scale by zoom, translate to world
      ctx.translate(width / 2, height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-camX, -camY);

      const mapSize = state?.mapSize || 4200;

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
      if (Array.isArray(state?.ponds)) {
        state.ponds.forEach(pond => {
          ctx.save();
          // Sandy shoreline
          ctx.beginPath();
          ctx.arc(pond.x, pond.y, pond.radius + 12, 0, Math.PI * 2);
          ctx.fillStyle = '#2d3748';
          ctx.fill();

          // Water body
          ctx.beginPath();
          ctx.arc(pond.x, pond.y, pond.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#0284c7';
          ctx.fill();

          // Water ripple effect
          const rippleRadius = pond.radius * (0.4 + 0.3 * Math.sin(Date.now() / 600));
          ctx.beginPath();
          ctx.arc(pond.x, pond.y, rippleRadius, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.restore();
        });
      }

      // 4. Render Ground Loot
      if (Array.isArray(state?.loot)) {
        state.loot.forEach(item => {
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
      if (Array.isArray(state?.obstacles)) {
        state.obstacles.forEach(ob => {
          ctx.save();

          if (ob.type === 'crate') {
            // Wooden Breakable Crate
            ctx.fillStyle = '#854d0e';
            ctx.fillRect(ob.x, ob.y, ob.w, ob.h);

            // Crate slats & diagonals
            ctx.strokeStyle = '#451a03';
            ctx.lineWidth = 3;
            ctx.strokeRect(ob.x + 2, ob.y + 2, ob.w - 4, ob.h - 4);
            ctx.beginPath();
            ctx.moveTo(ob.x, ob.y);
            ctx.lineTo(ob.x + ob.w, ob.y + ob.h);
            ctx.moveTo(ob.x + ob.w, ob.y);
            ctx.lineTo(ob.x, ob.y + ob.h);
            ctx.stroke();

            // Crate HP bar if damaged
            if (ob.hp < ob.maxHp) {
              const hpPct = ob.hp / ob.maxHp;
              ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
              ctx.fillRect(ob.x + 4, ob.y - 10, ob.w - 8, 4);
              ctx.fillStyle = '#ef4444';
              ctx.fillRect(ob.x + 4, ob.y - 10, (ob.w - 8) * hpPct, 4);
            }
          } else if (ob.type === 'container') {
            // Shipping Container (Corrugated metal box)
            const color = ob.color || '#dc2626';
            ctx.fillStyle = color;
            ctx.fillRect(ob.x, ob.y, ob.w, ob.h);

            // Outer dark rim
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 3;
            ctx.strokeRect(ob.x, ob.y, ob.w, ob.h);

            // Corrugated metal ridges
            ctx.lineWidth = 2;
            const isHorizontal = ob.w > ob.h;
            if (isHorizontal) {
              for (let rx = ob.x + 10; rx < ob.x + ob.w - 6; rx += 14) {
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
                ctx.beginPath();
                ctx.moveTo(rx, ob.y + 2);
                ctx.lineTo(rx, ob.y + ob.h - 2);
                ctx.stroke();

                ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
                ctx.beginPath();
                ctx.moveTo(rx + 2, ob.y + 2);
                ctx.lineTo(rx + 2, ob.y + ob.h - 2);
                ctx.stroke();
              }
            } else {
              for (let ry = ob.y + 10; ry < ob.y + ob.h - 6; ry += 14) {
                ctx.strokeStyle = 'rgba(0, 0, 0, 0.35)';
                ctx.beginPath();
                ctx.moveTo(ob.x + 2, ry);
                ctx.lineTo(ob.x + ob.w - 2, ry);
                ctx.stroke();

                ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
                ctx.beginPath();
                ctx.moveTo(ob.x + 2, ry + 2);
                ctx.lineTo(ob.x + ob.w - 2, ry + 2);
                ctx.stroke();
              }
            }

            // Corner steel castings
            ctx.fillStyle = '#1e293b';
            const cs = 7;
            ctx.fillRect(ob.x, ob.y, cs, cs);
            ctx.fillRect(ob.x + ob.w - cs, ob.y, cs, cs);
            ctx.fillRect(ob.x, ob.y + ob.h - cs, cs, cs);
            ctx.fillRect(ob.x + ob.w - cs, ob.y + ob.h - cs, cs, cs);

            // Container stencil text
            ctx.font = 'bold 9px monospace';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.textAlign = 'center';
            ctx.fillText(ob.label || 'CARGO', ob.x + ob.w / 2, ob.y + ob.h / 2 + 3);
          } else {
            // Concrete / Brick House Walls
            ctx.fillStyle = '#475569';
            ctx.fillRect(ob.x, ob.y, ob.w, ob.h);

            // Shaded border
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 3.5;
            ctx.strokeRect(ob.x, ob.y, ob.w, ob.h);

            // Diagonal roof stripes
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
            ctx.lineWidth = 2;
            for (let s = -ob.h; s < ob.w; s += 24) {
              ctx.beginPath();
              ctx.moveTo(ob.x + Math.max(0, s), ob.y);
              ctx.lineTo(ob.x + Math.min(ob.w, s + ob.h), ob.y + Math.min(ob.h, ob.w - s));
              ctx.stroke();
            }
          }

          ctx.restore();
        });
      }

      // 6. Render Circular Obstacles (Trees, Rocks, Red Explosive Barrels)
      if (Array.isArray(state?.circularObstacles)) {
        state.circularObstacles.forEach(cob => {
          ctx.save();

          if (cob.type === 'barrel') {
            // Red Explosive Barrel
            ctx.beginPath();
            ctx.arc(cob.x, cob.y, cob.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#dc2626'; // Vibrant Red
            ctx.fill();
            ctx.strokeStyle = '#7f1d1d';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Inner hazard ring
            ctx.beginPath();
            ctx.arc(cob.x, cob.y, cob.radius * 0.65, 0, Math.PI * 2);
            ctx.strokeStyle = '#fef08a';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Flame / Hazard icon
            ctx.font = '14px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🔥', cob.x, cob.y);

            // Barrel HP bar if damaged
            if (cob.hp < cob.maxHp) {
              const hpPct = cob.hp / cob.maxHp;
              ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
              ctx.fillRect(cob.x - cob.radius, cob.y - cob.radius - 8, cob.radius * 2, 4);
              ctx.fillStyle = '#ef4444';
              ctx.fillRect(cob.x - cob.radius, cob.y - cob.radius - 8, cob.radius * 2 * hpPct, 4);
            }
          } else if (cob.type === 'rock') {
            // Natural Granite Boulder
            ctx.beginPath();
            ctx.arc(cob.x, cob.y, cob.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#64748b'; // Slate granite
            ctx.fill();
            ctx.strokeStyle = '#334155';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Chiseled rock facets & highlights
            ctx.beginPath();
            ctx.arc(cob.x - cob.radius * 0.25, cob.y - cob.radius * 0.25, cob.radius * 0.45, 0, Math.PI * 2);
            ctx.fillStyle = '#94a3b8';
            ctx.fill();

            // Moss patch
            ctx.beginPath();
            ctx.arc(cob.x + cob.radius * 0.35, cob.y + cob.radius * 0.25, cob.radius * 0.3, 0, Math.PI * 2);
            ctx.fillStyle = '#15803d';
            ctx.fill();
          } else if (cob.type === 'tree') {
            // Solid Tree Trunk & Root Base
            ctx.beginPath();
            ctx.arc(cob.x, cob.y, cob.radius, 0, Math.PI * 2);
            ctx.fillStyle = '#3f1d0b'; // Dark bark
            ctx.fill();
            ctx.strokeStyle = '#1c0d02';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Tree Canopy Foliage Overhead
            ctx.beginPath();
            ctx.arc(cob.x, cob.y, cob.radius * 1.55, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(21, 128, 61, 0.88)'; // Lush green
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

      // 7. Render Flying Glowing Bullets
      if (Array.isArray(state?.bullets)) {
        state.bullets.forEach(b => {
          ctx.save();
          ctx.beginPath();
          ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = b.color || '#fef08a';
          ctx.shadowColor = b.color || '#facc15';
          ctx.shadowBlur = 8;
          ctx.fill();

          // Tracer line
          ctx.beginPath();
          ctx.moveTo(b.x, b.y);
          ctx.lineTo(b.x - b.vx * 2, b.y - b.vy * 2);
          ctx.strokeStyle = b.color || '#fef08a';
          ctx.lineWidth = 2.5;
          ctx.stroke();
          ctx.restore();
        });
      }

      // 8. Render Players
      if (Array.isArray(state?.players)) {
        state.players.forEach(p => {
          if (!p.isAlive) return;

          const isSelf = p.id === myPlayerId;

          // Check if player is concealed in a bush
          let insideBush = false;
          if (Array.isArray(state?.bushes)) {
            for (const bush of state.bushes) {
              const dx = p.x - bush.x;
              const dy = p.y - bush.y;
              if (dx * dx + dy * dy < bush.radius * bush.radius) {
                insideBush = true;
                break;
              }
            }
          }

          // If another player is hidden in bush and not self, hide them!
          if (insideBush && !isSelf) {
            // Concealed! Skip rendering unless shooting
            if (!p.isShooting) return;
          }

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle || 0);

          if (insideBush && isSelf) {
            ctx.globalAlpha = 0.55; // Semi-transparent to indicate camouflage
          }

          // Hands & Weapon
          const active = p.weapons[p.activeSlot];
          const isMelee = !active || active.isMelee;

          if (isMelee) {
            // Punching Hands
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
            const gunLen = active.length || 32;
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(10, -4, gunLen, 8);
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(10, -4, gunLen, 8);

            // Muzzle flash when firing
            if (p.isShooting && !active.isReloading && active.ammo > 0) {
              ctx.beginPath();
              ctx.arc(10 + gunLen + 4, 0, 7.5, 0, Math.PI * 2);
              ctx.fillStyle = '#fef08a';
              ctx.shadowColor = '#f59e0b';
              ctx.shadowBlur = 12;
              ctx.fill();
            }

            // Both Hands gripping the gun
            ctx.beginPath();
            ctx.arc(15, -10, 7, 0, Math.PI * 2);
            ctx.arc(22, 6, 7, 0, Math.PI * 2);
            ctx.fillStyle = '#f59e0b';
            ctx.fill();
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 2;
            ctx.stroke();
          }

          // Player Body (Round Circle)
          ctx.beginPath();
          ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = isSelf ? '#3b82f6' : '#ef4444'; // Blue for self, Red for enemies
          ctx.fill();
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 2.5;
          ctx.stroke();

          // Vest Armor Ring
          if (p.vestLevel > 0) {
            ctx.beginPath();
            ctx.arc(0, 0, p.radius * 0.72, 0, Math.PI * 2);
            ctx.strokeStyle = p.vestLevel === 3 ? '#38bdf8' : (p.vestLevel === 2 ? '#22c55e' : '#94a3b8');
            ctx.lineWidth = 3;
            ctx.stroke();
          }

          // Helmet Visor
          if (p.helmetLevel > 0) {
            ctx.fillStyle = p.helmetLevel === 3 ? '#0284c7' : (p.helmetLevel === 2 ? '#15803d' : '#64748b');
            ctx.fillRect(p.radius * 0.2, -6, 8, 12);
          }

          // Invulnerability Shield
          if (p.isInvulnerable) {
            ctx.beginPath();
            ctx.arc(0, 0, p.radius * 1.5, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.8)';
            ctx.lineWidth = 3;
            ctx.stroke();
          }

          ctx.restore();

          // Player Name & Mini Health Bar (drawn upright without rotation)
          ctx.save();
          ctx.translate(p.x, p.y);

          // Name Tag
          ctx.font = 'bold 11px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillStyle = isSelf ? '#60a5fa' : '#ffffff';
          ctx.fillText(`${p.avatar || '🎖️'} ${p.name}${isSelf ? ' (Sen)' : ''}`, 0, -p.radius - 14);

          // Health bar
          const barW = 38;
          const barH = 4;
          const hpPct = Math.max(0, p.hp / p.maxHp);
          ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
          ctx.fillRect(-barW / 2, -p.radius - 8, barW, barH);
          ctx.fillStyle = hpPct > 0.5 ? '#22c55e' : (hpPct > 0.25 ? '#eab308' : '#ef4444');
          ctx.fillRect(-barW / 2, -p.radius - 8, barW * hpPct, barH);

          // Vest bar if any
          if (p.vest > 0) {
            const vestPct = p.vest / 100;
            ctx.fillStyle = '#38bdf8';
            ctx.fillRect(-barW / 2, -p.radius - 12, barW * vestPct, 2.5);
          }

          ctx.restore();
        });
      }

      // 9. Render Camouflage Bushes (Top layer so players can hide inside!)
      if (Array.isArray(state?.bushes)) {
        state.bushes.forEach(bush => {
          ctx.save();
          // Bush outer cluster
          ctx.fillStyle = 'rgba(21, 128, 61, 0.82)';
          ctx.beginPath();
          ctx.arc(bush.x, bush.y, bush.radius, 0, Math.PI * 2);
          ctx.fill();

          // Leaf sub-circles for rich foliage texture
          ctx.fillStyle = 'rgba(34, 197, 94, 0.4)';
          for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
            const lx = bush.x + Math.cos(a) * (bush.radius * 0.55);
            const ly = bush.y + Math.sin(a) * (bush.radius * 0.55);
            ctx.beginPath();
            ctx.arc(lx, ly, bush.radius * 0.45, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        });
      }

      // 10. Render Safe Zone / Toxic Red Gas Circle (Alan Modu)
      if (state?.mode === 'battle_royale' && state?.zone) {
        const z = state.zone;
        ctx.save();

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
        ctx.fillStyle = 'rgba(239, 68, 68, 0.28)'; // Toxic red gas
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

      // Restore camera transform
      ctx.restore();

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
      if (Array.isArray(state?.ponds)) {
        state.ponds.forEach(pond => {
          ctx.beginPath();
          ctx.arc(miniX + pond.x * miniScale, miniY + pond.y * miniScale, Math.max(2, pond.radius * miniScale), 0, Math.PI * 2);
          ctx.fillStyle = '#0284c7';
          ctx.fill();
        });
      }

      // Minimap Buildings / Compounds
      if (Array.isArray(state?.obstacles)) {
        state.obstacles.forEach(ob => {
          if (ob.type === 'wall' || ob.type === 'container') {
            ctx.fillStyle = ob.type === 'container' ? '#f59e0b' : '#64748b';
            ctx.fillRect(miniX + ob.x * miniScale, miniY + ob.y * miniScale, Math.max(1, ob.w * miniScale), Math.max(1, ob.h * miniScale));
          }
        });
      }

      // Minimap Safe Zone
      if (state?.mode === 'battle_royale' && state?.zone) {
        const z = state.zone;
        ctx.beginPath();
        ctx.arc(miniX + z.x * miniScale, miniY + z.y * miniScale, z.currentRadius * miniScale, 0, Math.PI * 2);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Minimap Players
      if (Array.isArray(state?.players)) {
        state.players.forEach(p => {
          if (!p.isAlive) return;
          const isSelf = p.id === myPlayerId;
          ctx.beginPath();
          ctx.arc(miniX + p.x * miniScale, miniY + p.y * miniScale, isSelf ? 4.5 : 2.5, 0, Math.PI * 2);
          ctx.fillStyle = isSelf ? '#38bdf8' : '#ef4444';
          ctx.fill();
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
  }, [state, myPlayerId]);

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
