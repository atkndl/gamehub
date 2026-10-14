import React, { useRef, useEffect } from 'react';
import { SNAKE_CLASSES } from './SnakeClassModal';

export default function SnakeCanvas({ state, myPlayerId }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !state) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const gridSize = state.gridSize || 40;
      const cellSize = width / gridSize;

      // 1. Clear background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // 2. Subtle Grid pattern
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= gridSize; i++) {
        ctx.beginPath();
        ctx.moveTo(i * cellSize, 0);
        ctx.lineTo(i * cellSize, height);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, i * cellSize);
        ctx.lineTo(width, i * cellSize);
        ctx.stroke();
      }

      const now = Date.now();

      // 3. Render Hazard Zones (Fire & Ice)
      if (Array.isArray(state.hazards)) {
        state.hazards.forEach(h => {
          const hzX = h.x * cellSize;
          const hzY = h.y * cellSize;
          const hzW = h.width * cellSize;
          const hzH = h.height * cellSize;

          ctx.save();
          if (h.type === 'fire') {
            if (h.state === 'warning') {
              // Warning phase: pulsing dashed orange border
              const pulse = (Math.sin(now / 150) + 1) / 2;
              ctx.fillStyle = `rgba(239, 68, 68, ${0.08 + pulse * 0.12})`;
              ctx.fillRect(hzX, hzY, hzW, hzH);
              ctx.strokeStyle = `rgba(249, 115, 22, ${0.4 + pulse * 0.5})`;
              ctx.setLineDash([8, 6]);
              ctx.lineWidth = 2.5;
              ctx.strokeRect(hzX, hzY, hzW, hzH);

              // Warning text
              ctx.fillStyle = '#fb923c';
              ctx.font = 'bold 11px sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText('⚠️ ATEŞ ALANI', hzX + hzW / 2, hzY + hzH / 2);
            } else {
              // Active phase: dangerous flaming lava
              const glow = (Math.sin(now / 200) + 1) / 2;
              const grad = ctx.createRadialGradient(
                hzX + hzW / 2, hzY + hzH / 2, 5,
                hzX + hzW / 2, hzY + hzH / 2, hzW / 1.2
              );
              grad.addColorStop(0, `rgba(239, 68, 68, ${0.35 + glow * 0.15})`);
              grad.addColorStop(1, 'rgba(185, 28, 28, 0.2)');
              ctx.fillStyle = grad;
              ctx.fillRect(hzX, hzY, hzW, hzH);

              ctx.strokeStyle = `rgba(239, 68, 68, ${0.7 + glow * 0.3})`;
              ctx.lineWidth = 2;
              ctx.strokeRect(hzX, hzY, hzW, hzH);

              // Center icon
              ctx.font = '16px sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText('🔥', hzX + hzW / 2, hzY + hzH / 2 + 5);
            }
          } else {
            // Ice Hazard
            if (h.state === 'warning') {
              const pulse = (Math.sin(now / 150) + 1) / 2;
              ctx.fillStyle = `rgba(6, 182, 212, ${0.08 + pulse * 0.12})`;
              ctx.fillRect(hzX, hzY, hzW, hzH);
              ctx.strokeStyle = `rgba(34, 211, 238, ${0.4 + pulse * 0.5})`;
              ctx.setLineDash([8, 6]);
              ctx.lineWidth = 2.5;
              ctx.strokeRect(hzX, hzY, hzW, hzH);

              ctx.fillStyle = '#67e8f9';
              ctx.font = 'bold 11px sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText('⚠️ BUZ ALANI', hzX + hzW / 2, hzY + hzH / 2);
            } else {
              const glow = (Math.sin(now / 200) + 1) / 2;
              const grad = ctx.createRadialGradient(
                hzX + hzW / 2, hzY + hzH / 2, 5,
                hzX + hzW / 2, hzY + hzH / 2, hzW / 1.2
              );
              grad.addColorStop(0, `rgba(6, 182, 212, ${0.35 + glow * 0.15})`);
              grad.addColorStop(1, 'rgba(14, 116, 144, 0.2)');
              ctx.fillStyle = grad;
              ctx.fillRect(hzX, hzY, hzW, hzH);

              ctx.strokeStyle = `rgba(6, 182, 212, ${0.7 + glow * 0.3})`;
              ctx.lineWidth = 2;
              ctx.strokeRect(hzX, hzY, hzW, hzH);

              ctx.font = '16px sans-serif';
              ctx.textAlign = 'center';
              ctx.fillText('❄️', hzX + hzW / 2, hzY + hzH / 2 + 5);
            }
          }
          ctx.restore();
        });
      }

      // 4. Render Foods
      if (Array.isArray(state.foods)) {
        state.foods.forEach(f => {
          const centerX = f.x * cellSize + cellSize / 2;
          const centerY = f.y * cellSize + cellSize / 2;
          const radius = cellSize * 0.42;

          ctx.save();
          if (f.type === 'gold') {
            // Golden Food: pulsing star / glowing orb
            const pulse = (Math.sin(now / 120) + 1) / 2;
            ctx.shadowColor = '#eab308';
            ctx.shadowBlur = 10 + pulse * 6;

            ctx.fillStyle = '#facc15';
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius * (0.9 + pulse * 0.15), 0, Math.PI * 2);
            ctx.fill();

            // Inner star core
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(centerX - radius * 0.25, centerY - radius * 0.25, radius * 0.25, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Normal Food: Red apple/berry with shine
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 6;

            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();

            // Leaf
            ctx.fillStyle = '#22c55e';
            ctx.beginPath();
            ctx.arc(centerX + radius * 0.3, centerY - radius * 0.7, radius * 0.35, 0, Math.PI * 2);
            ctx.fill();

            // Shine
            ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
            ctx.beginPath();
            ctx.arc(centerX - radius * 0.3, centerY - radius * 0.3, radius * 0.25, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        });
      }

      // 5. Render Snakes
      if (Array.isArray(state.players)) {
        state.players.forEach(p => {
          if (!p.isAlive || p.body.length === 0) return;

          const isSelf = p.id === myPlayerId;
          const classInfo = SNAKE_CLASSES[p.snakeClass] || SNAKE_CLASSES.speed;
          const baseColor = classInfo.color;
          const headColor = classInfo.headColor;

          ctx.save();

          // Body Segments (from tail to 1)
          for (let i = p.body.length - 1; i >= 1; i--) {
            const seg = p.body[i];
            const segX = seg.x * cellSize + cellSize / 2;
            const segY = seg.y * cellSize + cellSize / 2;
            const segRadius = (cellSize * 0.44) * (0.8 + (1 - i / p.body.length) * 0.2);

            ctx.beginPath();
            ctx.arc(segX, segY, segRadius, 0, Math.PI * 2);
            ctx.fillStyle = baseColor;
            ctx.globalAlpha = p.isInvulnerable ? 0.6 : 0.95;
            ctx.fill();

            // Inner shine highlight
            ctx.beginPath();
            ctx.arc(segX - segRadius * 0.2, segY - segRadius * 0.2, segRadius * 0.35, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
            ctx.fill();
          }

          // Snake Head (Segment 0)
          const head = p.body[0];
          const headX = head.x * cellSize + cellSize / 2;
          const headY = head.y * cellSize + cellSize / 2;
          const headRadius = cellSize * 0.52;

          // Invulnerability Shield
          if (p.isInvulnerable) {
            const pulse = (Math.sin(now / 100) + 1) / 2;
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.6 + pulse * 0.4})`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(headX, headY, headRadius * 1.45, 0, Math.PI * 2);
            ctx.stroke();
          }

          // Head Glow
          ctx.shadowColor = baseColor;
          ctx.shadowBlur = isSelf ? 16 : 8;

          ctx.beginPath();
          ctx.arc(headX, headY, headRadius, 0, Math.PI * 2);
          ctx.fillStyle = headColor;
          ctx.globalAlpha = 1;
          ctx.fill();

          // Eyes looking in direction of movement
          const dirX = p.dir?.x || 1;
          const dirY = p.dir?.y || 0;
          const perpX = -dirY;
          const perpY = dirX;

          const eyeDist = headRadius * 0.45;
          const eyeOffset = headRadius * 0.35;

          const leftEyeX = headX + dirX * eyeOffset + perpX * eyeDist;
          const leftEyeY = headY + dirY * eyeOffset + perpY * eyeDist;
          const rightEyeX = headX + dirX * eyeOffset - perpX * eyeDist;
          const rightEyeY = headY + dirY * eyeOffset - perpY * eyeDist;

          // Eye whites
          ctx.shadowBlur = 0;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(leftEyeX, leftEyeY, headRadius * 0.26, 0, Math.PI * 2);
          ctx.arc(rightEyeX, rightEyeY, headRadius * 0.26, 0, Math.PI * 2);
          ctx.fill();

          // Pupils
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(leftEyeX + dirX * 1.5, leftEyeY + dirY * 1.5, headRadius * 0.14, 0, Math.PI * 2);
          ctx.arc(rightEyeX + dirX * 1.5, rightEyeY + dirY * 1.5, headRadius * 0.14, 0, Math.PI * 2);
          ctx.fill();

          // Name Tag & Avatar above Head (flips below if near top boundary)
          ctx.font = 'bold 10px sans-serif';
          ctx.textAlign = 'center';
          const label = `${p.avatar} ${p.name}${isSelf ? ' (Sen)' : ''}`;
          ctx.fillStyle = isSelf ? '#facc15' : '#ffffff';
          const labelY = headY < 24 ? headY + headRadius + 14 : headY - headRadius - 6;
          ctx.fillText(label, headX, labelY);

          ctx.restore();
        });
      }

      // 6. Arena Perimeter Portal Border (Wraparound Grid indicator)
      ctx.save();
      const portalGlow = (Math.sin(now / 300) + 1) / 2;
      ctx.strokeStyle = `rgba(99, 102, 241, ${0.45 + portalGlow * 0.35})`; // Shimmering portal neon
      ctx.lineWidth = 2.5;
      ctx.setLineDash([12, 8]);
      ctx.strokeRect(1, 1, width - 2, height - 2);
      ctx.restore();
    };

    render();

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [state, myPlayerId]);

  return (
    <div className="relative w-full max-w-[620px] aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-800 bg-slate-950 flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={800}
        height={800}
        className="w-full h-full block"
      />
    </div>
  );
}
