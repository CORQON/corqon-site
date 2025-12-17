'use client';

import { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from '@/lib/useReducedMotion';

interface Stream {
  label: string;
  name: string;
  detects: string;
  confidence: 'High' | 'Medium';
  coverage: string;
}

type StreamStatus = 'idle' | 'scanning' | 'done';

const STREAMS: Stream[] = [
  {
    label: 'Stream 1',
    name: 'Meeting structure',
    detects: 'Context switching, meeting density, focus block erosion.',
    confidence: 'High',
    coverage: '88%',
  },
  {
    label: 'Stream 2',
    name: 'Instability signals',
    detects: 'Last-minute change pressure and rework cycles.',
    confidence: 'High',
    coverage: '83%',
  },
  {
    label: 'Stream 3',
    name: 'Check-ins optional',
    detects: 'Team-level self-report direction, not individual scoring.',
    confidence: 'Medium',
    coverage: '62%',
  },
  {
    label: 'Stream 4',
    name: 'HRIS validation',
    detects: 'Aggregated absence signals used for validation.',
    confidence: 'High',
    coverage: '90%',
  },
];

export default function DecisionInputsPanel() {
  const [streamStatuses, setStreamStatuses] = useState<StreamStatus[]>(['idle', 'idle', 'idle', 'idle']);
  const [activeIndex, setActiveIndex] = useState(0);
  const timeoutRefs = useRef<number[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    // Clear all timeouts on unmount or when preferences change
    return () => {
      timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
      timeoutRefs.current = [];
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      // Set all streams to done state immediately, no cycling
      setStreamStatuses(['done', 'done', 'done', 'done']);
      setActiveIndex(0);
      return;
    }

    // Clear any existing timeouts
    timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
    timeoutRefs.current = [];

    const processStream = (index: number) => {
      // Set current stream to scanning
      setStreamStatuses((prev) => {
        const newStatuses = [...prev];
        newStatuses[index] = 'scanning';
        return newStatuses;
      });
      setActiveIndex(index);

      // After 1600ms, mark as done
      const doneTimeout = window.setTimeout(() => {
        setStreamStatuses((prev) => {
          const newStatuses = [...prev];
          newStatuses[index] = 'done';
          return newStatuses;
        });

        // After 700ms in done state, move to next stream
        const nextTimeout = window.setTimeout(() => {
          const nextIndex = (index + 1) % STREAMS.length;
          
          if (nextIndex === 0) {
            // We've completed all streams, reset after 900ms pause
            const resetTimeout = window.setTimeout(() => {
              setStreamStatuses(['idle', 'idle', 'idle', 'idle']);
              processStream(0);
            }, 900);
            timeoutRefs.current.push(resetTimeout);
          } else {
            processStream(nextIndex);
          }
        }, 700);
        timeoutRefs.current.push(nextTimeout);
      }, 1600);
      timeoutRefs.current.push(doneTimeout);
    };

    // Start the cycle
    processStream(0);

    return () => {
      timeoutRefs.current.forEach((timeout) => clearTimeout(timeout));
      timeoutRefs.current = [];
    };
  }, [prefersReducedMotion]);

  return (
    <div className="h-full bg-white/60 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-white/10 p-6 min-h-[400px]">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1.5">
          Decision inputs
        </h3>
        <p className="text-sm text-gray-600 dark:text-white/60">
          What the assistant uses to ground Week 50 guidance.
        </p>
      </div>

      <div className="space-y-3">
        {STREAMS.map((stream, index) => {
          const status = streamStatuses[index];
          const isActive = status === 'scanning' || status === 'done';
          
          return (
            <div
              key={stream.label}
              className={`relative rounded-xl border transition-all duration-300 ease-out ${
                isActive
                  ? 'bg-[#0b0b0c] dark:bg-white/[0.03] border-[#2F6FFF]/40 dark:border-[#2F6FFF]/40 ring-1 ring-[#2F6FFF]/25 dark:ring-[#2F6FFF]/25 shadow-[0_0_0_1px_rgba(47,111,255,0.25),0_8px_30px_rgba(0,0,0,0.35)]'
                  : 'bg-white/[0.02] dark:bg-white/[0.02] border-white/10 dark:border-white/10'
              }`}
            >
              {/* Left accent bar for active state */}
              {isActive && (
                <div className="absolute left-0 top-3 bottom-3 w-px bg-[#2F6FFF] opacity-70 rounded-full" />
              )}

              <div className="px-4 py-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-medium text-gray-500 dark:text-white/50">
                        {stream.label}
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white/90">
                        {stream.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-white/60 mb-2.5">
                      {stream.detects}
                    </p>
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          stream.confidence === 'High'
                            ? 'bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/30'
                            : 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-500/30'
                        }`}
                      >
                        {stream.confidence}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-white/40">
                        {stream.coverage}
                      </span>
                    </div>
                  </div>

                  {/* Status indicator - Fixed height container to prevent layout shifts on mobile */}
                  <div className="flex-shrink-0 flex items-center gap-1.5 pt-1 min-h-[20px] md:min-h-[20px]">
                    {status === 'scanning' && (
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-0.5">
                          <div
                            className="w-1 h-1 rounded-full bg-[#2F6FFF] animate-corqon-dots"
                            style={{ animationDelay: '0ms' }}
                          />
                          <div
                            className="w-1 h-1 rounded-full bg-[#2F6FFF] animate-corqon-dots"
                            style={{ animationDelay: '150ms' }}
                          />
                          <div
                            className="w-1 h-1 rounded-full bg-[#2F6FFF] animate-corqon-dots"
                            style={{ animationDelay: '300ms' }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-500 dark:text-white/60 whitespace-nowrap">
                          Scanning
                        </span>
                      </div>
                    )}

                    {status === 'done' && (
                      <div className="flex items-center gap-1.5">
                        <div className="px-1.5 py-0.5 rounded-md bg-[#2F6FFF]/15 border border-[#2F6FFF]/25 animate-corqon-pop">
                          <svg
                            className="w-2.5 h-2.5 text-[#2F6FFF]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span className="text-[10px] text-gray-500 dark:text-white/60 whitespace-nowrap">
                          Ready
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
