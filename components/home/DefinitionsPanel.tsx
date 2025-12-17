'use client';

import { useState } from 'react';

interface Definition {
  label: string;
  short: string;
  full: string;
  category: 'time' | 'reliability' | 'input';
}

const DEFINITIONS: Definition[] = [
  {
    label: 'WoW',
    short: 'Previous calendar week (Monday to Sunday).',
    full: 'Week over Week comparison uses the previous complete calendar week (Monday to Sunday) as the baseline for measuring changes and trends.',
    category: 'time',
  },
  {
    label: '4w',
    short: 'Trailing 4 complete calendar weeks.',
    full: 'The 4-week metric aggregates data from the trailing four complete calendar weeks to provide a more stable trend view, smoothing out single-week anomalies.',
    category: 'time',
  },
  {
    label: 'QTD',
    short: 'Quarter to date baseline comparison.',
    full: 'Quarter to Date compares current period performance against the baseline established at the start of the current quarter, providing quarterly context for trends.',
    category: 'time',
  },
  {
    label: 'Confidence',
    short: 'Based on coverage and signal stability, aggregated.',
    full: 'Confidence scores reflect the reliability of the signal, calculated from data coverage (how much of the expected data is present) and signal stability (consistency over time). All confidence metrics are aggregated at the team level.',
    category: 'reliability',
  },
  {
    label: 'Streams',
    short: 'Independent inputs combined at team level.',
    full: 'Streams are independent data sources that are analyzed separately and then combined at the team level to provide a comprehensive view. Each stream contributes unique signals that are aggregated to form the final guidance.',
    category: 'input',
  },
];

const getCategoryColor = (category: 'time' | 'reliability' | 'input', isExpanded: boolean) => {
  const opacity = isExpanded ? 'opacity-80' : 'opacity-60';
  
  switch (category) {
    case 'time':
      return `bg-[#2F6FFF] ${opacity}`;
    case 'reliability':
      return `bg-emerald-400 ${opacity}`;
    case 'input':
      return `bg-white ${opacity}`;
    default:
      return `bg-white ${opacity}`;
  }
};

const getCategoryLabel = (category: 'time' | 'reliability' | 'input') => {
  switch (category) {
    case 'time':
      return 'Time deltas';
    case 'reliability':
      return 'Reliability';
    case 'input':
      return 'Inputs';
    default:
      return '';
  }
};

export default function DefinitionsPanel() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="h-full bg-white/60 dark:bg-white/5 rounded-xl border border-gray-200/50 dark:border-white/10 p-6 min-h-[400px]">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1.5">
          Definitions
        </h3>
        <p className="text-sm text-gray-600 dark:text-white/60 mb-3">
          How to read the weekly deltas and confidence.
        </p>
        
        {/* Legend */}
        <div className="flex items-center gap-4 text-[10px] text-gray-500 dark:text-white/40">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#2F6FFF] opacity-60" />
            <span>Time deltas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 opacity-60" />
            <span>Reliability</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-white opacity-60" />
            <span>Inputs</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {DEFINITIONS.map((definition, index) => {
          const isExpanded = expandedIndex === index;
          const railColor = getCategoryColor(definition.category, isExpanded);
          
          return (
            <button
              key={definition.label}
              onClick={() => toggleExpand(index)}
              className="w-full text-left group relative"
              aria-expanded={isExpanded}
            >
              <div className={`relative rounded-lg border bg-white/[0.02] dark:bg-white/[0.02] transition-all duration-200 ${
                isExpanded
                  ? 'bg-white/[0.03] dark:bg-white/[0.03] border-white/15 dark:border-white/15'
                  : 'border-white/10 dark:border-white/10 hover:bg-white/[0.03] dark:hover:bg-white/[0.03] hover:border-white/15 dark:hover:border-white/15'
              }`}>
                {/* Category rail */}
                <div className={`absolute left-0 top-2 bottom-2 w-[2px] rounded-full ${railColor} transition-opacity duration-200`} />
                
                <div className="pl-4 pr-3 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-semibold transition-colors duration-200 ${
                          isExpanded
                            ? 'text-gray-900 dark:text-white'
                            : 'text-gray-900 dark:text-white/90'
                        }`}>
                          {definition.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-white/60 leading-relaxed">
                        {definition.short}
                      </p>
                      {isExpanded && (
                        <p className="text-xs text-gray-600 dark:text-white/60 leading-relaxed mt-2 pt-2 border-t border-white/10 dark:border-white/10 animate-fade-in">
                          {definition.full}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 pt-0.5">
                      <svg
                        className={`w-4 h-4 text-gray-400 dark:text-white/40 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
