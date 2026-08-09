'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Icon } from '@/components/shared/Icon';

interface HeartParticle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  rotate: number;
  delay: number;
  duration: number;
  color: string;
}

interface PointerStart {
  id: number;
  x: number;
  y: number;
  time: number;
}

const HEART_COLORS = ['#aa1e25', '#d93645', '#ef7882', '#f4a6ad'];
const INTERACTIVE_SELECTOR = 'a, button, input, select, textarea, label, dialog';

export function HeartBurst() {
  const [particles, setParticles] = useState<HeartParticle[]>([]);
  const pointerStart = useRef<PointerStart | null>(null);
  const nextId = useRef(0);
  const lastBurstTime = useRef(-Infinity);
  const cleanupTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    function createBurst(x: number, y: number) {
      lastBurstTime.current = performance.now();
      const burstId = nextId.current;
      nextId.current += 8;
      const nextParticles = Array.from({ length: 8 }, (_, index): HeartParticle => {
        const angle = (-155 + index * 22 + Math.random() * 10) * (Math.PI / 180);
        const distanceFromTap = 48 + Math.random() * 58;
        return {
          id: burstId + index,
          x,
          y,
          dx: Math.cos(angle) * distanceFromTap,
          dy: Math.sin(angle) * distanceFromTap - 12,
          size: 10 + Math.random() * 9,
          rotate: -28 + Math.random() * 56,
          delay: index * 18,
          duration: 760 + Math.random() * 260,
          color: HEART_COLORS[index % HEART_COLORS.length]
        };
      });

      setParticles((current) => [...current, ...nextParticles]);
      const timer = setTimeout(() => {
        const ids = new Set(nextParticles.map((particle) => particle.id));
        setParticles((current) => current.filter((particle) => !ids.has(particle.id)));
        cleanupTimers.current = cleanupTimers.current.filter((item) => item !== timer);
      }, 1250);
      cleanupTimers.current.push(timer);
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target;
      if (!event.isPrimary || (target instanceof Element && target.closest(INTERACTIVE_SELECTOR))) return;
      pointerStart.current = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        time: performance.now()
      };
    }

    function handlePointerUp(event: PointerEvent) {
      const start = pointerStart.current;
      pointerStart.current = null;
      if (!start || start.id !== event.pointerId) return;

      const distance = Math.hypot(event.clientX - start.x, event.clientY - start.y);
      if (distance > 12 || performance.now() - start.time > 420) return;
      createBurst(event.clientX, event.clientY);
    }

    function handlePointerCancel() {
      pointerStart.current = null;
    }

    function handleClick(event: MouseEvent) {
      const target = event.target;
      if (
        performance.now() - lastBurstTime.current < 100 ||
        (target instanceof Element && target.closest(INTERACTIVE_SELECTOR))
      ) return;
      createBurst(event.clientX, event.clientY);
    }

    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    window.addEventListener('pointercancel', handlePointerCancel, { passive: true });
    window.addEventListener('click', handleClick, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerCancel);
      window.removeEventListener('click', handleClick);
      cleanupTimers.current.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="heart-burst-surface" aria-hidden="true">
      <div className="heart-burst-layer">
        {particles.map((particle) => (
          <Icon
            className="tap-heart"
            key={particle.id}
            name="heart"
            style={{
              '--heart-x': `${particle.x}px`,
              '--heart-y': `${particle.y}px`,
              '--heart-dx': `${particle.dx}px`,
              '--heart-dy': `${particle.dy}px`,
              '--heart-size': `${particle.size}px`,
              '--heart-rotate': `${particle.rotate}deg`,
              '--heart-delay': `${particle.delay}ms`,
              '--heart-duration': `${particle.duration}ms`,
              '--heart-color': particle.color
            } as CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
