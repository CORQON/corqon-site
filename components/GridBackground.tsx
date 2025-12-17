'use client';

import { useEffect, useRef, useState } from 'react';

interface Pulse {
  lineIndex: number;
  isVertical: boolean;
  progress: number;
  speed: number;
  opacity: number;
  easeProgress: number;
}

interface GridBackgroundProps {
  className?: string;
}

export default function GridBackground({ className = '' }: GridBackgroundProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check if desktop on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsDesktop(window.innerWidth >= 768);
    }
  }, []);
  const gridConfigRef = useRef<{
    cellSize: number;
    offsetX: number;
    offsetY: number;
    majorLineInterval: number;
  }>({
    cellSize: 240,
    offsetX: 0,
    offsetY: 0,
    majorLineInterval: 8,
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
    return 280;
  };

  const easeInOutCubic = (t: number): number => {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  };

  const initializePulses = (width: number, height: number, cellSize: number) => {
    const pulseCount = 18;
    
    if (pulsesRef.current.length === 0) {
      pulsesRef.current = [];
    }

    for (let i = pulsesRef.current.length; i < pulseCount; i++) {
      const isVertical = Math.random() > 0.5;
      const lineCount = isVertical 
        ? Math.ceil(width / cellSize) 
        : Math.ceil(height / cellSize);
      const lineIndex = Math.floor(Math.random() * lineCount);

      pulsesRef.current.push({
        lineIndex,
        isVertical,
        progress: Math.random() * 1.4 - 0.2,
        speed: 0.0018 + Math.random() * 0.0012,
        opacity: 0.1 + Math.random() * 0.08,
        easeProgress: 0,
      });
    }
  };

  const spawnNewPulse = (width: number, height: number, cellSize: number) => {
    const isVertical = Math.random() > 0.5;
    const lineCount = isVertical 
      ? Math.ceil(width / cellSize) 
      : Math.ceil(height / cellSize);
    const lineIndex = Math.floor(Math.random() * lineCount);

    pulsesRef.current.push({
      lineIndex,
      isVertical,
      progress: -0.2,
      speed: 0.0018 + Math.random() * 0.0012,
      opacity: 0.1 + Math.random() * 0.08,
      easeProgress: 0,
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

    const lineOpacity = 0.04;
    const majorLineOpacity = 0.07;
    const grayValue = 180;

    ctx.strokeStyle = `rgba(${grayValue}, ${grayValue}, ${grayValue}, ${lineOpacity})`;
    ctx.lineWidth = 1;

    const startX = Math.floor(-offsetX / cellSize) * cellSize + offsetX;
    const startY = Math.floor(-offsetY / cellSize) * cellSize + offsetY;

    const verticalLines = Math.ceil(width / cellSize) + 2;
    const horizontalLines = Math.ceil(height / cellSize) + 2;

    for (let i = 0; i < verticalLines; i++) {
      const x = startX + i * cellSize;
      const isMajor = i % config.majorLineInterval === 0;
      
      ctx.strokeStyle = `rgba(${grayValue}, ${grayValue}, ${grayValue}, ${isMajor ? majorLineOpacity : lineOpacity})`;
      ctx.lineWidth = isMajor ? 1.5 : 1;

      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let i = 0; i < horizontalLines; i++) {
      const y = startY + i * cellSize;
      const isMajor = i % config.majorLineInterval === 0;
      
      ctx.strokeStyle = `rgba(${grayValue}, ${grayValue}, ${grayValue}, ${isMajor ? majorLineOpacity : lineOpacity})`;
      ctx.lineWidth = isMajor ? 1.5 : 1;

      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    const nodeRadius = 2.5;
    const nodeGrayValue = 200;
    for (let i = 0; i < verticalLines; i++) {
      for (let j = 0; j < horizontalLines; j++) {
        const x = startX + i * cellSize;
        const y = startY + j * cellSize;
        
        if (x >= 0 && x <= width && y >= 0 && y <= height) {
          const nodeOpacity = 0.06;
          
          const gradient = ctx.createRadialGradient(x, y, 0, x, y, nodeRadius);
          gradient.addColorStop(0, `rgba(${nodeGrayValue}, ${nodeGrayValue}, ${nodeGrayValue}, ${nodeOpacity})`);
          gradient.addColorStop(0.5, `rgba(${nodeGrayValue}, ${nodeGrayValue}, ${nodeGrayValue}, ${nodeOpacity * 0.6})`);
          gradient.addColorStop(1, `rgba(${nodeGrayValue}, ${nodeGrayValue}, ${nodeGrayValue}, 0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
          ctx.fill();

          ctx.shadowBlur = 4;
          ctx.shadowColor = `rgba(${nodeGrayValue}, ${nodeGrayValue}, ${nodeGrayValue}, ${nodeOpacity * 0.3})`;
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
    const pulseGrayValue = 220;

    pulsesRef.current = pulsesRef.current.filter((pulse) => {
      if (pulse.progress < -0.2 || pulse.progress > 1.2) {
        return false;
      }

      const normalizedProgress = Math.max(0, Math.min(1, (pulse.progress + 0.2) / 1.4));
      pulse.easeProgress = easeInOutCubic(normalizedProgress);

      const startX = Math.floor(-offsetX / cellSize) * cellSize + offsetX;
      const startY = Math.floor(-offsetY / cellSize) * cellSize + offsetY;

      if (pulse.isVertical) {
        const x = startX + pulse.lineIndex * cellSize;
        if (x < 0 || x > width) return true;

        const pulseY = pulse.easeProgress * height;
        const pulseLength = 45;
        
        const fadeIn = pulse.progress < 0.1 ? Math.max(0, pulse.progress / 0.1) : 1;
        const fadeOut = pulse.progress > 0.9 ? Math.max(0, (1.2 - pulse.progress) / 0.3) : 1;
        const finalOpacity = pulse.opacity * Math.min(fadeIn, fadeOut);

        const streakGradient = ctx.createLinearGradient(
          x, pulseY - pulseLength / 2,
          x, pulseY + pulseLength / 2
        );
        streakGradient.addColorStop(0, `rgba(${pulseGrayValue}, ${pulseGrayValue}, ${pulseGrayValue}, 0)`);
        streakGradient.addColorStop(0.3, `rgba(${pulseGrayValue}, ${pulseGrayValue}, ${pulseGrayValue}, ${finalOpacity * 0.4})`);
        streakGradient.addColorStop(0.5, `rgba(${pulseGrayValue}, ${pulseGrayValue}, ${pulseGrayValue}, ${finalOpacity})`);
        streakGradient.addColorStop(0.7, `rgba(${pulseGrayValue}, ${pulseGrayValue}, ${pulseGrayValue}, ${finalOpacity * 0.4})`);
        streakGradient.addColorStop(1, `rgba(${pulseGrayValue}, ${pulseGrayValue}, ${pulseGrayValue}, 0)`);

        for (let layer = 0; layer < 3; layer++) {
          const layerOpacity = 1 - layer * 0.3;
          const layerWidth = 2 + layer * 0.5;
          
          ctx.strokeStyle = streakGradient;
          ctx.lineWidth = layerWidth;
          ctx.lineCap = 'round';

          ctx.beginPath();
          ctx.moveTo(x, pulseY - pulseLength / 2);
          ctx.lineTo(x, pulseY + pulseLength / 2);
          ctx.globalAlpha = layerOpacity;
          ctx.stroke();
        }
        ctx.globalAlpha = 1;

        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${pulseGrayValue}, ${pulseGrayValue}, ${pulseGrayValue}, ${finalOpacity * 0.5})`;
        ctx.strokeStyle = streakGradient;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(x, pulseY - pulseLength / 2);
        ctx.lineTo(x, pulseY + pulseLength / 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else {
        const y = startY + pulse.lineIndex * cellSize;
        if (y < 0 || y > height) return true;

        const pulseX = pulse.easeProgress * width;
        const pulseLength = 45;
        
        const fadeIn = pulse.progress < 0.1 ? Math.max(0, pulse.progress / 0.1) : 1;
        const fadeOut = pulse.progress > 0.9 ? Math.max(0, (1.2 - pulse.progress) / 0.3) : 1;
        const finalOpacity = pulse.opacity * Math.min(fadeIn, fadeOut);

        const streakGradient = ctx.createLinearGradient(
          pulseX - pulseLength / 2, y,
          pulseX + pulseLength / 2, y
        );
        streakGradient.addColorStop(0, `rgba(${pulseGrayValue}, ${pulseGrayValue}, ${pulseGrayValue}, 0)`);
        streakGradient.addColorStop(0.3, `rgba(${pulseGrayValue}, ${pulseGrayValue}, ${pulseGrayValue}, ${finalOpacity * 0.4})`);
        streakGradient.addColorStop(0.5, `rgba(${pulseGrayValue}, ${pulseGrayValue}, ${pulseGrayValue}, ${finalOpacity})`);
        streakGradient.addColorStop(0.7, `rgba(${pulseGrayValue}, ${pulseGrayValue}, ${pulseGrayValue}, ${finalOpacity * 0.4})`);
        streakGradient.addColorStop(1, `rgba(${pulseGrayValue}, ${pulseGrayValue}, ${pulseGrayValue}, 0)`);

        for (let layer = 0; layer < 3; layer++) {
          const layerOpacity = 1 - layer * 0.3;
          const layerWidth = 2 + layer * 0.5;
          
          ctx.strokeStyle = streakGradient;
          ctx.lineWidth = layerWidth;
          ctx.lineCap = 'round';

          ctx.beginPath();
          ctx.moveTo(pulseX - pulseLength / 2, y);
          ctx.lineTo(pulseX + pulseLength / 2, y);
          ctx.globalAlpha = layerOpacity;
          ctx.stroke();
        }
        ctx.globalAlpha = 1;

        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${pulseGrayValue}, ${pulseGrayValue}, ${pulseGrayValue}, ${finalOpacity * 0.5})`;
        ctx.strokeStyle = streakGradient;
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(pulseX - pulseLength / 2, y);
        ctx.lineTo(pulseX + pulseLength / 2, y);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      return true;
    });
  };

  const animate = () => {
    try {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      // CRITICAL: Never run on mobile - check immediately and bail out
      if (typeof window !== 'undefined' && window.innerWidth < 768) {
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      // CRITICAL: Cap DPR to 1 on mobile to prevent memory issues
      const dpr = typeof window !== 'undefined' && window.innerWidth < 768 
        ? 1 
        : (window.devicePixelRatio || 1);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

    const cellSize = getCellSize(width);
    gridConfigRef.current.cellSize = cellSize;

    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createRadialGradient(
      width * 0.5,
      height * 0.4,
      0,
      width * 0.5,
      height * 0.4,
      Math.max(width, height) * 0.8
    );

    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    if (pulsesRef.current.length === 0) {
      initializePulses(width, height, cellSize);
    }

    if (!reducedMotion) {
      timeRef.current += 0.016;

      gridConfigRef.current.offsetX += 0.04;
      gridConfigRef.current.offsetY += 0.025;

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
      if (lastPulseSpawnRef.current > 1.2 && pulsesRef.current.length < 24) {
        spawnNewPulse(width, height, cellSize);
        lastPulseSpawnRef.current = 0;
      }
    }

      drawGrid(ctx, width, height);
      drawPulses(ctx, width, height);

      animationFrameRef.current = requestAnimationFrame(animate);
    } catch (error) {
      // Silently handle errors to prevent crashes on mobile
      if (process.env.NODE_ENV === 'development') {
        console.error('GridBackground animation error:', error);
      }
    }
  };

  useEffect(() => {
    // CRITICAL: Never run on mobile - check immediately and bail out
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return;
    }
    if (!isDesktop) return;
    
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

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
        animationFrameRef.current = undefined;
      }
    };
  }, [reducedMotion, isDesktop]);

  // Don't render on mobile at all
  if (!isDesktop) {
    return null;
  }

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
