'use client';

import { useEffect, useRef, useState } from 'react';

interface Pulse {
  progress: number;
  speed: number;
  opacity: number;
  length: number;
}

interface Wave {
  startX: number;
  startY: number;
  controlX1: number;
  controlY1: number;
  controlX2: number;
  controlY2: number;
  endX: number;
  endY: number;
  phase: number;
  phaseSpeed: number;
  pulses: Pulse[];
}

interface FlowBackgroundProps {
  className?: string;
  speed?: number;
  color?: string;
  origin?: 'sides';
}

export default function FlowBackground({ 
  className = '', 
  speed = 1.5,
  color = 'white',
  origin = 'sides'
}: FlowBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const [reducedMotion, setReducedMotion] = useState(false);
  const wavesRef = useRef<Wave[]>([]);
  const timeRef = useRef(0);
  const speedRef = useRef(speed);
  const reducedMotionRef = useRef(reducedMotion);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    reducedMotionRef.current = reducedMotion;
  }, [reducedMotion]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(prefersReducedMotion);
    reducedMotionRef.current = prefersReducedMotion;

    const handleReducedMotion = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
      reducedMotionRef.current = e.matches;
    };

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', handleReducedMotion);

    return () => {
      mediaQuery.removeEventListener('change', handleReducedMotion);
    };
  }, []);

  const initializeWaves = (width: number, height: number): Wave[] => {
    const convergenceX = width * 0.5;
    const convergenceY = height * 0.4;
    const currentSpeed = speedRef.current;

    const createWave = (
      startX: number,
      startY: number,
      phaseOffset: number,
      phaseSpeed: number
    ): Wave => {
      const controlX1 = startX + (convergenceX - startX) * 0.25 + Math.sin(phaseOffset) * 40;
      const controlY1 = startY + (convergenceY - startY) * 0.25 + Math.cos(phaseOffset) * 25;
      const controlX2 = startX + (convergenceX - startX) * 0.75 + Math.sin(phaseOffset * 1.3) * 35;
      const controlY2 = startY + (convergenceY - startY) * 0.75 + Math.cos(phaseOffset * 1.2) * 20;

      const pulses: Pulse[] = [];
      const pulseCount = 4;
      for (let i = 0; i < pulseCount; i++) {
        pulses.push({
          progress: Math.random() * 0.8 - 0.1,
          speed: (0.0015 + Math.random() * 0.001) * currentSpeed,
          opacity: 0.6 + Math.random() * 0.4,
          length: 0.015 + Math.random() * 0.02,
        });
      }

      return {
        startX,
        startY,
        controlX1,
        controlY1,
        controlX2,
        controlY2,
        endX: convergenceX,
        endY: convergenceY,
        phase: phaseOffset,
        phaseSpeed: phaseSpeed * currentSpeed,
        pulses,
      };
    };

    const offset = -100;
    return [
      createWave(offset, height * 0.2, 0, 0.002),
      createWave(offset, height * 0.6, Math.PI * 0.5, 0.0018),
      createWave(width - offset, height * 0.3, Math.PI, 0.0022),
      createWave(width - offset, height * 0.7, Math.PI * 1.5, 0.0019),
    ];
  };

  const getPointOnBezier = (
    t: number,
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ): [number, number] => {
    const mt = 1 - t;
    const mt2 = mt * mt;
    const mt3 = mt2 * mt;
    const t2 = t * t;
    const t3 = t2 * t;

    const x = mt3 * x0 + 3 * mt2 * t * x1 + 3 * mt * t2 * x2 + t3 * x3;
    const y = mt3 * y0 + 3 * mt2 * t * y1 + 3 * mt * t2 * y2 + t3 * y3;

    return [x, y];
  };

  const drawWave = (
    ctx: CanvasRenderingContext2D,
    wave: Wave,
    time: number
  ) => {
    const currentReducedMotion = reducedMotionRef.current;
    const phaseShift = currentReducedMotion ? 0 : Math.sin(time * wave.phaseSpeed + wave.phase) * 0.03;

    const points: [number, number][] = [];
    const segments = 120;
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const [x, y] = getPointOnBezier(
        t,
        wave.startX,
        wave.startY,
        wave.controlX1 + phaseShift * 25,
        wave.controlY1 + phaseShift * 18,
        wave.controlX2 + phaseShift * 18,
        wave.controlY2 + phaseShift * 12,
        wave.endX,
        wave.endY
      );
      points.push([x, y]);
    }

    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
      ctx.lineTo(points[i][0], points[i][1]);
    }

    const bodyColor = `rgba(255, 255, 255, 0.06)`;
    const edgeColor = `rgba(255, 255, 255, 0.12)`;

    ctx.strokeStyle = bodyColor;
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();

    ctx.strokeStyle = edgeColor;
    ctx.lineWidth = 1;
    ctx.stroke();

    if (!currentReducedMotion) {
      wave.pulses.forEach((pulse) => {
        const pulseProgress = pulse.progress;
        if (pulseProgress >= -0.1 && pulseProgress <= 1.1) {
          const [px, py] = getPointOnBezier(
            pulseProgress,
            wave.startX,
            wave.startY,
            wave.controlX1 + phaseShift * 25,
            wave.controlY1 + phaseShift * 18,
            wave.controlX2 + phaseShift * 18,
            wave.controlY2 + phaseShift * 12,
            wave.endX,
            wave.endY
          );

          const nextT = Math.min(1, pulseProgress + pulse.length);
          const [px2, py2] = getPointOnBezier(
            nextT,
            wave.startX,
            wave.startY,
            wave.controlX1 + phaseShift * 25,
            wave.controlY1 + phaseShift * 18,
            wave.controlX2 + phaseShift * 18,
            wave.controlY2 + phaseShift * 12,
            wave.endX,
            wave.endY
          );

          const dx = px2 - px;
          const dy = py2 - py;
          const angle = Math.atan2(dy, dx);
          const length = Math.sqrt(dx * dx + dy * dy);

          ctx.save();
          ctx.translate(px, py);
          ctx.rotate(angle);

          const fadeIn = pulseProgress < 0.1 ? pulseProgress / 0.1 : 1;
          const fadeOut = pulseProgress > 0.9 ? (1 - pulseProgress) / 0.1 : 1;
          const finalOpacity = pulse.opacity * Math.min(fadeIn, fadeOut);

          const pulseColor = `rgba(255, 255, 255, ${finalOpacity})`;

          ctx.shadowBlur = 12;
          ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
          ctx.fillStyle = pulseColor;
          ctx.fillRect(0, -2, length, 4);

          ctx.shadowBlur = 0;
          ctx.fillStyle = pulseColor;
          ctx.fillRect(0, -1.5, length, 3);

          ctx.restore();
        }
      });
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    if (wavesRef.current.length === 0 || Math.abs(wavesRef.current[0].endX - width * 0.5) > 10) {
      wavesRef.current = initializeWaves(width, height);
    }

    ctx.clearRect(0, 0, width, height);

    const currentReducedMotion = reducedMotionRef.current;
    if (!currentReducedMotion) {
      timeRef.current += 0.016;
    }

    wavesRef.current.forEach((wave) => {
      if (!currentReducedMotion) {
        wave.phase += wave.phaseSpeed * 0.8;

        wave.pulses.forEach((pulse) => {
          pulse.progress += pulse.speed;
          if (pulse.progress > 1.2) {
            pulse.progress = -0.2;
            pulse.opacity = 0.6 + Math.random() * 0.4;
            pulse.length = 0.015 + Math.random() * 0.02;
          }
        });
      }

      drawWave(ctx, wave, timeRef.current);
    });

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    wavesRef.current = [];

    const resizeObserver = new ResizeObserver(() => {
      wavesRef.current = [];
    });

    resizeObserver.observe(container);
    animate();

    return () => {
      resizeObserver.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [speed, reducedMotion]);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}
