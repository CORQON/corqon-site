'use client';

import { useEffect, useRef, useState } from 'react';

interface Pulse {
  lineIndex: number;
  isVertical: boolean;
  progress: number;
  speed: number;
  opacity: number;
  length: number;
}

interface GridHeroBackgroundProps {
  className?: string;
}

export default function GridHeroBackground({ className = '' }: GridHeroBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const [reducedMotion, setReducedMotion] = useState(false);
  const gridConfigRef = useRef<{
    cellSize: number;
    offsetX: number;
    offsetY: number;
  }>({
    cellSize: 240,
    offsetX: 0,
    offsetY: 0,
  });
  const pulsesRef = useRef<Pulse[]>([]);
  const timeRef = useRef(0);
  const lastPulseSpawnRef = useRef(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(prefersReducedMotion);

    const handleReducedMotion = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', handleReducedMotion);

    return () => {
      mediaQuery.removeEventListener('change', handleReducedMotion);
    };
  }, []);


  const getCellSize = (width: number): number => {
    if (width < 640) return 200;
    if (width < 1024) return 220;
    return 240;
  };

  const initializePulses = (width: number, height: number, cellSize: number) => {
    const pulseCount = 35;
    
    pulsesRef.current = [];

    for (let i = 0; i < pulseCount; i++) {
      const isVertical = Math.random() > 0.5;
      const lineCount = isVertical 
        ? Math.ceil((width + 400) / cellSize) + 1
        : Math.ceil((height + 400) / cellSize) + 1;
      const lineIndex = Math.floor(Math.random() * lineCount);

      pulsesRef.current.push({
        lineIndex,
        isVertical,
        progress: Math.random() * 1.5 - 0.3,
        speed: 0.002 + Math.random() * 0.0015,
        opacity: 0.08 + Math.random() * 0.06,
        length: 60 + Math.random() * 40,
      });
    }
  };

  const spawnNewPulse = (width: number, height: number, cellSize: number) => {
    const isVertical = Math.random() > 0.5;
    const lineCount = isVertical 
      ? Math.ceil((width + 400) / cellSize) + 1
      : Math.ceil((height + 400) / cellSize) + 1;
    const lineIndex = Math.floor(Math.random() * lineCount);

    pulsesRef.current.push({
      lineIndex,
      isVertical,
      progress: -0.3,
      speed: 0.002 + Math.random() * 0.0015,
      opacity: 0.08 + Math.random() * 0.06,
      length: 60 + Math.random() * 40,
    });
  };

  const drawGrid = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    const config = gridConfigRef.current;
    const cellSize = config.cellSize;
    const offsetX = config.offsetX;
    const offsetY = config.offsetY;

    const overscan = 200;
    const drawWidth = width + overscan * 2;
    const drawHeight = height + overscan * 2;
    const drawStartX = -overscan;
    const drawStartY = -overscan;

    const lineOpacity = 0.05;
    const grayValue = 200;
    const lineWidth = 1;

    ctx.strokeStyle = `rgba(${grayValue}, ${grayValue}, ${grayValue}, ${lineOpacity})`;
    ctx.lineWidth = lineWidth;

    const startX = Math.floor((drawStartX - offsetX) / cellSize) * cellSize + offsetX;
    const startY = Math.floor((drawStartY - offsetY) / cellSize) * cellSize + offsetY;

    const verticalLines = Math.ceil(drawWidth / cellSize) + 2;
    const horizontalLines = Math.ceil(drawHeight / cellSize) + 2;

    for (let i = 0; i < verticalLines; i++) {
      const x = startX + i * cellSize;
      ctx.beginPath();
      ctx.moveTo(x, drawStartY);
      ctx.lineTo(x, drawStartY + drawHeight);
      ctx.stroke();
    }

    for (let i = 0; i < horizontalLines; i++) {
      const y = startY + i * cellSize;
      ctx.beginPath();
      ctx.moveTo(drawStartX, y);
      ctx.lineTo(drawStartX + drawWidth, y);
      ctx.stroke();
    }

    const nodeRadius = 3;
    const nodeOpacity = 0.1;
    const nodeGrayValue = 220;

    for (let i = 0; i < verticalLines; i++) {
      for (let j = 0; j < horizontalLines; j++) {
        const x = startX + i * cellSize;
        const y = startY + j * cellSize;
        
        if (x >= drawStartX - 10 && x <= drawStartX + drawWidth + 10 && y >= drawStartY - 10 && y <= drawStartY + drawHeight + 10) {
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, nodeRadius * 2);
          gradient.addColorStop(0, `rgba(${nodeGrayValue}, ${nodeGrayValue}, ${nodeGrayValue}, ${nodeOpacity})`);
          gradient.addColorStop(0.4, `rgba(${nodeGrayValue}, ${nodeGrayValue}, ${nodeGrayValue}, ${nodeOpacity * 0.5})`);
          gradient.addColorStop(1, `rgba(${nodeGrayValue}, ${nodeGrayValue}, ${nodeGrayValue}, 0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, nodeRadius * 2, 0, Math.PI * 2);
          ctx.fill();

          ctx.shadowBlur = 6;
          ctx.shadowColor = `rgba(${nodeGrayValue}, ${nodeGrayValue}, ${nodeGrayValue}, ${nodeOpacity * 0.4})`;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
    }
  };

  const drawPulses = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    if (reducedMotion) return;

    const config = gridConfigRef.current;
    const cellSize = config.cellSize;
    const offsetX = config.offsetX;
    const offsetY = config.offsetY;
    const overscan = 200;
    const pulseGrayValue = 240;

    pulsesRef.current = pulsesRef.current.filter((pulse) => {
      if (pulse.progress < -0.3 || pulse.progress > 1.3) {
        return false;
      }

      const drawStartX = -overscan;
      const drawStartY = -overscan;
      const drawWidth = width + overscan * 2;
      const drawHeight = height + overscan * 2;

      const startX = Math.floor((drawStartX - offsetX) / cellSize) * cellSize + offsetX;
      const startY = Math.floor((drawStartY - offsetY) / cellSize) * cellSize + offsetY;

      if (pulse.isVertical) {
        const x = startX + pulse.lineIndex * cellSize;
        if (x < drawStartX - 20 || x > drawStartX + drawWidth + 20) return true;

        const normalizedProgress = Math.max(0, Math.min(1, (pulse.progress + 0.3) / 1.6));
        const pulseY = drawStartY + normalizedProgress * drawHeight;
        
        const fadeIn = pulse.progress < 0.1 ? Math.max(0, (pulse.progress + 0.3) / 0.4) : 1;
        const fadeOut = pulse.progress > 1.0 ? Math.max(0, (1.3 - pulse.progress) / 0.3) : 1;
        const finalOpacity = pulse.opacity * Math.min(fadeIn, fadeOut);

        const streakGradient = ctx.createLinearGradient(
          x, pulseY - pulse.length / 2,
          x, pulseY + pulse.length / 2
        );
        streakGradient.addColorStop(0, `rgba(${pulseGrayValue}, ${pulseGrayValue}, ${pulseGrayValue}, 0)`);
        streakGradient.addColorStop(0.25, `rgba(${pulseGrayValue}, ${pulseGrayValue}, ${pulseGrayValue}, ${finalOpacity * 0.3})`);
        streakGradient.addColorStop(0.5, `rgba(${pulseGrayValue}, ${pulseGrayValue}, ${pulseGrayValue}, ${finalOpacity})`);
        streakGradient.addColorStop(0.75, `rgba(${pulseGrayValue}, ${pulseGrayValue}, ${pulseGrayValue}, ${finalOpacity * 0.3})`);
        streakGradient.addColorStop(1, `rgba(${pulseGrayValue}, ${pulseGrayValue}, ${pulseGrayValue}, 0)`);

        for (let layer = 0; layer < 3; layer++) {
          const layerOpacity = 1 - layer * 0.25;
          const layerWidth = 2.5 + layer * 0.8;
          
          ctx.strokeStyle = streakGradient;
          ctx.lineWidth = layerWidth;
          ctx.lineCap = 'round';

          ctx.beginPath();
          ctx.moveTo(x, pulseY - pulse.length / 2);
          ctx.lineTo(x, pulseY + pulse.length / 2);
          ctx.globalAlpha = layerOpacity * 0.7;
          ctx.stroke();
        }
        ctx.globalAlpha = 1;

        ctx.shadowBlur = 12;
        ctx.shadowColor = `rgba(${pulseGrayValue}, ${pulseGrayValue}, ${pulseGrayValue}, ${finalOpacity * 0.6})`;
        ctx.strokeStyle = streakGradient;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(x, pulseY - pulse.length / 2);
        ctx.lineTo(x, pulseY + pulse.length / 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        const y = startY + pulse.lineIndex * cellSize;
        if (y < drawStartY - 20 || y > drawStartY + drawHeight + 20) return true;

        const normalizedProgress = Math.max(0, Math.min(1, (pulse.progress + 0.3) / 1.6));
        const pulseX = drawStartX + normalizedProgress * drawWidth;
        
        const fadeIn = pulse.progress < 0.1 ? Math.max(0, (pulse.progress + 0.3) / 0.4) : 1;
        const fadeOut = pulse.progress > 1.0 ? Math.max(0, (1.3 - pulse.progress) / 0.3) : 1;
        const finalOpacity = pulse.opacity * Math.min(fadeIn, fadeOut);

        const streakGradient = ctx.createLinearGradient(
          pulseX - pulse.length / 2, y,
          pulseX + pulse.length / 2, y
        );
        streakGradient.addColorStop(0, `rgba(${pulseGrayValue}, ${pulseGrayValue}, ${pulseGrayValue}, 0)`);
        streakGradient.addColorStop(0.25, `rgba(${pulseGrayValue}, ${pulseGrayValue}, ${pulseGrayValue}, ${finalOpacity * 0.3})`);
        streakGradient.addColorStop(0.5, `rgba(${pulseGrayValue}, ${pulseGrayValue}, ${pulseGrayValue}, ${finalOpacity})`);
        streakGradient.addColorStop(0.75, `rgba(${pulseGrayValue}, ${pulseGrayValue}, ${pulseGrayValue}, ${finalOpacity * 0.3})`);
        streakGradient.addColorStop(1, `rgba(${pulseGrayValue}, ${pulseGrayValue}, ${pulseGrayValue}, 0)`);

        for (let layer = 0; layer < 3; layer++) {
          const layerOpacity = 1 - layer * 0.25;
          const layerWidth = 2.5 + layer * 0.8;
          
          ctx.strokeStyle = streakGradient;
          ctx.lineWidth = layerWidth;
          ctx.lineCap = 'round';

          ctx.beginPath();
          ctx.moveTo(pulseX - pulse.length / 2, y);
          ctx.lineTo(pulseX + pulse.length / 2, y);
          ctx.globalAlpha = layerOpacity * 0.7;
          ctx.stroke();
        }
        ctx.globalAlpha = 1;

        ctx.shadowBlur = 12;
        ctx.shadowColor = `rgba(${pulseGrayValue}, ${pulseGrayValue}, ${pulseGrayValue}, ${finalOpacity * 0.6})`;
        ctx.strokeStyle = streakGradient;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(pulseX - pulse.length / 2, y);
        ctx.lineTo(pulseX + pulse.length / 2, y);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      return true;
    });
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

    const cellSize = getCellSize(width);
    gridConfigRef.current.cellSize = cellSize;

    ctx.clearRect(0, 0, width, height);

    if (pulsesRef.current.length === 0) {
      initializePulses(width, height, cellSize);
    }

    if (!reducedMotion) {
      timeRef.current += 0.016;

      gridConfigRef.current.offsetX += 0.03;
      gridConfigRef.current.offsetY += 0.02;

      if (gridConfigRef.current.offsetX >= cellSize) {
        gridConfigRef.current.offsetX = 0;
      }
      if (gridConfigRef.current.offsetY >= cellSize) {
        gridConfigRef.current.offsetY = 0;
      }

      pulsesRef.current.forEach((pulse) => {
        pulse.progress += pulse.speed;
      });

      lastPulseSpawnRef.current += 0.016;
      const spawnInterval = 0.8;
      const maxPulses = 50;
      if (lastPulseSpawnRef.current > spawnInterval && pulsesRef.current.length < maxPulses) {
        spawnNewPulse(width, height, cellSize);
        lastPulseSpawnRef.current = 0;
      }
    }

    drawGrid(ctx, width, height);
    drawPulses(ctx, width, height);

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Don't initialize on mobile (below md breakpoint)
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return;
    }

    pulsesRef.current = [];
    lastPulseSpawnRef.current = 0;

    const resizeObserver = new ResizeObserver(() => {
      pulsesRef.current = [];
      lastPulseSpawnRef.current = 0;
    });

    resizeObserver.observe(container);
    animate();

    return () => {
      resizeObserver.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [reducedMotion]);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className} hidden md:block`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}

