'use client';

import { useState, useEffect, useRef } from 'react';

interface CardData {
  title: string;
  body: string;
  businessImpact: string;
  supportingLine: string;
  label: string;
}

const cards: CardData[] = [
  {
    title: 'Workload & Fragmentation',
    body: 'Corqon analyzes how work is structured across teams including meeting density, context switching and focus erosion to surface fragmentation that quietly reduces output.',
    businessImpact: 'Business impact: Less hidden capacity loss across high-cost roles.',
    supportingLine: 'Measures system load, not individual performance.',
    label: 'Data Stream 1',
  },
  {
    title: 'Predictability & Disruption',
    body: 'We measure how stable or disrupted the work rhythm is. Last-minute changes, planning volatility and reactive workflows create disproportionate cognitive strain and rework.',
    businessImpact: 'Business impact: Fewer downstream delays and margin erosion.',
    supportingLine: 'Instability costs more than workload alone.',
    label: 'Data Stream 2',
  },
  {
    title: 'Energy Direction (Team-Level)',
    body: 'Corqon tracks directional energy trends at team level rising, stable or declining to detect early risk before absence, burnout or attrition spikes.',
    businessImpact: 'Business impact: Earlier intervention before absence becomes expensive.',
    supportingLine: 'System signals only. Zero individual tracking.',
    label: 'Data Stream 3',
  },
  {
    title: 'HR Friction Signals',
    body: 'Aggregated signals from existing HR systems validate structural strain, such as short-term absence patterns, recovery duration and repeat cycles.',
    businessImpact: 'Business impact: Confirms ROI and prioritizes the right fixes.',
    supportingLine: 'Confirmation layer for earlier system signals.',
    label: 'Data Stream 4',
  },
];

const confirmingStatements = [
  'Fragmentation monitored',
  'Disruption detected',
  'Early risk signals active',
  'HR patterns confirmed',
];

const CYCLE_DURATION = 15000; // 15 seconds
const CARD_DURATION = 4000; // 4 seconds per card

// Single source of truth: ring geometry constants
const CX = 100;
const CY = 100;
const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Start angle for ring progress (12 o'clock = -90 degrees)
const START_ANGLE_DEG = -90;

export default function SystemIntelligenceSection() {
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  // Initialize cycle start time - will be reset in useEffect to ensure it starts at top
  const cycleStartRef = useRef<number>(0);
  const animationFrameRef = useRef<number>();
  const reducedMotionRef = useRef<boolean>(false);
  const progressRef = useRef<number>(0);
  const activeIndexRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGCircleElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = mediaQuery.matches;

    const handleChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Progress clock using requestAnimationFrame with optimized updates
  useEffect(() => {
    // Don't run animations on mobile - check immediately and never start animation loop
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      // Just set initial state on mobile, no animation, no requestAnimationFrame
      setProgress(0);
      setActiveIndex(0);
      // Ensure no animation frame is ever started
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }
      return;
    }
    
    // Reset cycle start time to ensure it starts at the top (progress = 0)
    cycleStartRef.current = Date.now();
    progressRef.current = 0;
    activeIndexRef.current = 0;
    
    // Initialize DOM elements to starting position (top checkmark)
    if (svgRef.current) {
      svgRef.current.style.strokeDashoffset = `${CIRCUMFERENCE}`;
    }
    if (glowRef.current) {
      // Glow starts at top (12 o'clock) to match the rotated ring
      glowRef.current.style.transform = `rotate(${START_ANGLE_DEG}deg)`;
    }
    
    if (reducedMotionRef.current) {
      // Reduced motion: use simple interval
      const interval = setInterval(() => {
        const now = Date.now();
        const elapsed = (now - cycleStartRef.current) % CYCLE_DURATION;
        const t = elapsed / CYCLE_DURATION;
        const p = Math.min(Math.max(t, 0), 0.999999);
        const discreteIndex = Math.floor(p * 4);
        setProgress(p);
        setActiveIndex(discreteIndex);
      }, CARD_DURATION);
      return () => clearInterval(interval);
    } else {
      // Normal motion: use requestAnimationFrame with batched state updates
      
      const updateProgress = () => {
        const now = Date.now();
        const elapsed = (now - cycleStartRef.current) % CYCLE_DURATION;
        const t = elapsed / CYCLE_DURATION;
        // Clamp p to [0, 0.999999) to prevent edge case at exactly 1.0
        const p = Math.min(Math.max(t, 0), 0.999999);
        const newIndex = Math.floor(p * 4);
        
        // Update refs immediately for DOM manipulation
        progressRef.current = p;
        
        // Direct DOM updates for smooth animation (no React re-render)
        if (svgRef.current) {
          const strokeDashoffset = CIRCUMFERENCE * (1 - p);
          svgRef.current.style.strokeDashoffset = `${strokeDashoffset}`;
        }
        
        if (glowRef.current) {
          // Rotate glow to match progress, starting from top (12 o'clock)
          const glowRotation = START_ANGLE_DEG + (p * 360);
          glowRef.current.style.transform = `rotate(${glowRotation}deg)`;
        }
        
        // Only update React state when activeIndex changes (4 times per cycle, not 60fps)
        if (newIndex !== activeIndexRef.current) {
          activeIndexRef.current = newIndex;
          setActiveIndex(newIndex);
          // Update progress state only when index changes to keep React in sync
          setProgress(p);
        }
        
        animationFrameRef.current = requestAnimationFrame(updateProgress);
      };
      
      animationFrameRef.current = requestAnimationFrame(updateProgress);
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, []);

  const handleCardClick = (index: number) => {
    // Reset cycle to start at the clicked card
    const targetProgress = index * 0.25;
    cycleStartRef.current = Date.now() - targetProgress * CYCLE_DURATION;
    progressRef.current = targetProgress;
    activeIndexRef.current = index;
    setProgress(targetProgress);
    setActiveIndex(index);
    
    // Immediately update DOM for instant feedback
    if (svgRef.current) {
      const strokeDashoffset = CIRCUMFERENCE * (1 - targetProgress);
      svgRef.current.style.strokeDashoffset = `${strokeDashoffset}`;
    }
    if (glowRef.current) {
      // Rotate glow to match progress, starting from top (12 o'clock)
      const glowRotation = START_ANGLE_DEG + (targetProgress * 360);
      glowRef.current.style.transform = `rotate(${glowRotation}deg)`;
    }
  };

  // Node positions around the circle (top, right, bottom, left)
  // Checkpoint 0: Top (12 o'clock) - active when p in [0.00, 0.25)
  // Checkpoint 1: Right (3 o'clock) - active when p in [0.25, 0.50)
  // Checkpoint 2: Bottom (6 o'clock) - active when p in [0.50, 0.75)
  // Checkpoint 3: Left (9 o'clock) - active when p in [0.75, 1.00)
  const nodePositions = [
    { top: '0%', left: '50%', transform: 'translate(-50%, -50%)' }, // Top (12 o'clock) - 0%
    { top: '50%', right: '0%', transform: 'translate(50%, -50%)' }, // Right (3 o'clock) - 25%
    { bottom: '0%', left: '50%', transform: 'translate(-50%, 50%)' }, // Bottom (6 o'clock) - 50%
    { top: '50%', left: '0%', transform: 'translate(-50%, -50%)' }, // Left (9 o'clock) - 75%
  ];

  // Compute active checkpoints using milestone thresholds (accumulative model)
  // Checkmarks become green at quarter milestones and stay green
  const EPS = 1e-6;
  const p = Math.min(Math.max(progress, 0), 1);
  
  // Milestones aligned with START_ANGLE_DEG coordinate system
  const milestones = [
    { key: 'top',    threshold: 0.0,  angleDeg: -90 },
    { key: 'right',  threshold: 0.25, angleDeg: 0 },
    { key: 'bottom', threshold: 0.5,  angleDeg: 90 },
    { key: 'left',   threshold: 0.75, angleDeg: 180 },
  ] as const;
  
  const isTopActive = p >= (milestones[0].threshold - EPS);
  const isRightActive = p >= (milestones[1].threshold - EPS);
  const isBottomActive = p >= (milestones[2].threshold - EPS);
  const isLeftActive = p >= (milestones[3].threshold - EPS);
  
  const checkpointActiveStates = [
    isTopActive,    // index 0: Top
    isRightActive,  // index 1: Right
    isBottomActive, // index 2: Bottom
    isLeftActive,   // index 3: Left
  ];

  return (
    <section id="datastreams" className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 corqon-section scroll-mt-28">
      {/* Title and Subtitle */}
      <div className="text-center mb-8 sm:mb-10 lg:mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-semibold tracking-tight text-gray-900 dark:text-white mb-3 sm:mb-4 px-4 sm:px-0">
          How Corqon Reads Your Organization
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-white/60 max-w-3xl mx-auto leading-relaxed px-4 sm:px-6 md:px-0">
          Four system-level data streams that reveal hidden productivity loss and absenteeism risk without tracking individuals.
        </p>
      </div>

      {/* Two Column Layout - 12 column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-stretch">
        {/* Left Column - Confidence Loop Visual (5 columns) */}
        <div className="lg:col-span-5 relative order-1 lg:order-1 h-[300px] sm:h-[350px] md:h-[400px] lg:h-[520px] flex items-center justify-center group">
          <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[420px] aspect-square" ref={containerRef}>
            {/* Radial Gradient Vignette Background */}
            <div className="absolute inset-0 rounded-full confidence-loop-bg"></div>

            {/* Ring Container */}
            <div className="relative w-full h-full confidence-loop-container">
              {/* Main Ring - Thicker Stroke */}
              <svg
                className="absolute inset-0 w-full h-full confidence-loop-ring"
                viewBox="0 0 200 200"
              >
                <defs>
                  <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="rgba(34, 197, 94, 0.1)" />
                    <stop offset="50%" stopColor="rgba(34, 197, 94, 0.2)" />
                    <stop offset="100%" stopColor="rgba(34, 197, 94, 0.1)" />
                  </linearGradient>
                </defs>
                {/* Rotate ring drawing layer to start at 12 o'clock */}
                <g transform={`rotate(-90 ${CX} ${CY})`}>
                  <circle
                    cx={CX}
                    cy={CY}
                    r={RADIUS}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-gray-300/30 dark:text-white/15"
                  />
                  {/* Gradient Ring Overlay */}
                  <circle
                    cx={CX}
                    cy={CY}
                    r={RADIUS}
                    fill="none"
                    stroke="url(#ringGradient)"
                    strokeWidth="2"
                    className="dark:opacity-60"
                  />
                  {/* Progress Arc - driven by progress p with direct DOM updates */}
                  <circle
                    ref={svgRef}
                    cx={CX}
                    cy={CY}
                    r={RADIUS}
                    fill="none"
                    stroke="rgba(34, 197, 94, 0.5)"
                    strokeWidth="2.5"
                    strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                    strokeDashoffset={CIRCUMFERENCE}
                    className="confidence-progress-arc"
                    style={{
                      willChange: 'stroke-dashoffset',
                      transition: 'none',
                    }}
                  />
                </g>
              </svg>

              {/* Inner Glow - Synchronized with progress p with direct DOM updates */}
              <div 
                ref={glowRef}
                className="absolute inset-0 rounded-full confidence-loop-sweep-sync"
                style={{
                  willChange: 'transform',
                  transform: `rotate(${START_ANGLE_DEG}deg)`,
                  transition: 'none',
                }}
              ></div>

              {/* Nodes with Check Marks - milestone threshold model */}
              {nodePositions.map((pos, index) => {
                const isActiveCheckpoint = checkpointActiveStates[index];
                
                return (
                  <div
                    key={index}
                    className="absolute z-10"
                    style={{
                      ...pos,
                    }}
                  >
                    <div
                      className={`relative w-8 h-8 rounded-full transition-all duration-500 flex items-center justify-center ${
                        isActiveCheckpoint
                          ? 'confidence-node-active'
                          : 'confidence-node-inactive'
                      }`}
                    >
                      {/* Check Mark SVG */}
                      <svg
                        className={`w-4 h-4 transition-all duration-500 ${
                          isActiveCheckpoint
                            ? 'text-white'
                            : 'text-gray-400 dark:text-white/30'
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                      >
                        <path d="M5 13l4 4L19 7" />
                      </svg>

                      {/* Active Node Glow */}
                      {isActiveCheckpoint && (
                        <div className="absolute inset-0 rounded-full confidence-node-glow"></div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Center Labels with Confirming Statement */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-center">
                <p className="text-xs font-semibold text-gray-500 dark:text-white/60 mb-0.5 tracking-wider">
                  CORQON
                </p>
                <p className="text-[10px] font-medium text-gray-500 dark:text-white/50 tracking-wider mb-2">
                  INTELLIGENCE LAYER
                </p>
                <p className="text-[10px] font-medium text-gray-600 dark:text-white/70 transition-all duration-500">
                  {confirmingStatements[activeIndex]}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Compact Cards (7 columns) */}
        <div className="lg:col-span-7 order-2 lg:order-2 h-auto sm:h-[350px] md:h-[400px] lg:h-[520px]">
          <div className="h-full lg:grid lg:grid-rows-4 lg:gap-2 flex flex-col gap-3">
            {cards.map((card, index) => (
              <button
                key={index}
                onClick={() => handleCardClick(index)}
                className={`w-full text-left rounded-xl transition-all duration-500 h-full flex flex-col card-interaction min-h-[120px] sm:min-h-0 ${
                  activeIndex === index
                    ? 'lg:p-4 p-4 active-card'
                    : 'lg:p-3.5 p-4 inactive-card'
                } focus:outline-none focus:ring-2 focus:ring-gray-400/50 dark:focus:ring-white/20 focus:ring-offset-2 focus:ring-offset-transparent`}
              >
                {/* Label - System Style */}
                <div className="mb-1 flex-shrink-0">
                  <span
                    className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded ${
                      activeIndex === index
                        ? 'bg-blue-500 text-white'
                        : 'text-white/30 bg-white/5'
                    }`}
                  >
                    {card.label}
                  </span>
                </div>

                {/* Title */}
                <h3
                  className={`text-base sm:text-lg mb-1 leading-tight flex-shrink-0 transition-all duration-500 ${
                    activeIndex === index
                      ? 'text-gray-900 font-semibold'
                      : 'text-white/70 font-normal opacity-75'
                  }`}
                >
                  {card.title}
                </h3>

                {/* Body - Clamped to 3 lines */}
                <p
                  className={`text-sm leading-snug mb-1.5 flex-grow corqon-clamp-3 ${
                    activeIndex === index
                      ? 'text-gray-700'
                      : 'text-white/60'
                  }`}
                >
                  {card.body}
                </p>

                {/* Business Impact - Annotation Level */}
                <p
                  className={`text-[11px] leading-tight mb-1.5 flex-shrink-0 corqon-clamp-1 tracking-tight ${
                    activeIndex === index
                      ? 'text-gray-700 font-medium'
                      : 'text-white/45'
                  }`}
                >
                  {card.businessImpact}
                </p>

                {/* Divider */}
                <div
                  className={`h-px mb-1 flex-shrink-0 ${
                    activeIndex === index
                      ? 'bg-gray-300'
                      : 'bg-white/8'
                  }`}
                ></div>

                {/* Supporting Line - Clamped to 1 line */}
                <p
                  className={`text-xs leading-tight flex-shrink-0 corqon-clamp-1 ${
                    activeIndex === index
                      ? 'text-gray-600'
                      : 'text-white/40'
                  }`}
                >
                  {card.supportingLine}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* System Tiles Row - Hover Highlight Tiles */}
      <div className="mt-16 lg:mt-20">
        <SystemTiles />
      </div>
    </section>
  );
}

interface TileData {
  title: string;
  body: string;
}

const systemTiles: TileData[] = [
  {
    title: 'Workload & Fragmentation',
    body: 'Corqon measures how work is fragmented by meetings, interruptions, and context switching. It reveals where focus structurally erodes inside the operating system of the company.',
  },
  {
    title: 'Planning Stability & Disruption',
    body: 'Corqon analyzes how predictable work planning remains over time, including last-minute changes and ad-hoc escalations. It shows where instability silently increases cognitive load and degrades sustainable performance.',
  },
  {
    title: 'Energy Feedback',
    body: 'Corqon monitors directional energy signals at team level, fully anonymized. This enables early detection of unsustainable work patterns before absence occurs.',
  },
  {
    title: 'HR Friction',
    body: 'Existing HR data is used to validate systemic signals across teams. This connects operational strain to real capacity loss without individual tracking.',
  },
];

function SystemTiles() {
  return (
    <div className="system-tiles-open-frame relative py-8 lg:py-12">
      {/* Outer Frame Lines - Always visible, z-10 */}
      {/* Left Edge - Vertical Dotted Line */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] corqon-dots-v pointer-events-none z-10"></div>
      
      {/* Right Edge - Vertical Dotted Line */}
      <div className="absolute right-0 top-0 bottom-0 w-[2px] corqon-dots-v pointer-events-none z-10"></div>
      
      {/* Bottom Edge - Horizontal Dotted Line */}
      <div className="absolute left-0 right-0 bottom-0 h-[2px] corqon-dots-h pointer-events-none z-10"></div>
      
      {/* Internal Vertical Dividers - Desktop (4 columns) */}
      {/* Divider at 25% */}
      <div className="hidden lg:block absolute top-0 bottom-0 left-1/4 w-[2px] corqon-dots-v pointer-events-none z-10"></div>
      {/* Divider at 50% */}
      <div className="hidden lg:block absolute top-0 bottom-0 left-1/2 w-[2px] corqon-dots-v pointer-events-none z-10"></div>
      {/* Divider at 75% */}
      <div className="hidden lg:block absolute top-0 bottom-0 left-3/4 w-[2px] corqon-dots-v pointer-events-none z-10"></div>
      
      {/* Internal Vertical Divider - Medium (2 columns) */}
      <div className="hidden md:block lg:hidden absolute top-0 bottom-0 left-1/2 w-[2px] corqon-dots-v pointer-events-none z-10"></div>
      
      {/* Internal Horizontal Dividers - Medium (2x2 grid) */}
      <div className="hidden md:block lg:hidden absolute left-0 right-0 top-1/2 h-[2px] corqon-dots-h pointer-events-none z-10"></div>
      
      {/* Segments Grid - No gaps */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
        {systemTiles.map((tile, index) => (
          <div
            key={index}
            className="system-tile-segment-open group relative p-4 sm:p-5 md:p-6 lg:p-8 cursor-pointer transition-all duration-[250ms] focus-within:outline-none focus-visible:outline-none min-h-[44px]"
            tabIndex={0}
          >
            {/* Horizontal Divider - Mobile (stacked) */}
            {index < systemTiles.length - 1 && (
              <div className="block md:hidden absolute left-0 right-0 bottom-0 h-[2px] corqon-dots-h pointer-events-none z-10"></div>
            )}
            
            {/* Content - z-20 above lines */}
            <div className="relative z-20">
              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2 sm:mb-3 leading-tight">
                {tile.title}
              </h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 dark:text-white/60 leading-relaxed">
                {tile.body}
              </p>
            </div>

            {/* Hover Gradient Wash - Per Segment, z-0 below lines */}
            <div className="absolute inset-0 system-tile-hover-wash opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-[250ms] pointer-events-none z-0"></div>

            {/* Left Blue Indicator - Only on hover/focus, per segment, z-30 above everything */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 lg:h-16 bg-blue-600 dark:bg-blue-500 rounded-r-full opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-[250ms] pointer-events-none z-30"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
