'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface WeekData {
  week: string;
  dateRange: string;
  coverage: 'High' | 'Medium' | 'Low';
  participation: number;
  sustainabilityRisk: number;
  absencePressure: number;
  fragmentation: number;
  instability: number;
  whatChanged: {
    paragraph: string;
    bullets: string[];
  };
  topDrivers: {
    name: string;
    delta: string;
    confidence: 'High' | 'Medium' | 'Low';
    signalId: string;
  }[];
  actions: {
    action: string;
    owner: string;
    timeframe: string;
    impact: string;
    signalId: string;
  }[];
  topRiskTeams: {
    name: string;
    risk: number;
    wowChange: number;
    driver: string;
  }[];
  segmentView: {
    segment: string;
    highRiskShare: number;
    participation: number;
  }[];
}

const weeksData: WeekData[] = [
  {
    week: 'Week 48',
    dateRange: 'Nov 25 - Dec 1',
    coverage: 'High',
    participation: 67,
    sustainabilityRisk: 14,
    absencePressure: 6,
    fragmentation: 4,
    instability: 5,
    whatChanged: {
      paragraph: 'System-level indicators remain within expected ranges. Baseline patterns show consistent operational rhythm with minimal deviation from established norms.',
      bullets: [
        'Meeting density within normal variance',
        'Context switching aligned with 4-week average',
        'Planning stability consistent with baseline'
      ]
    },
    topDrivers: [
      { name: 'Meeting density', delta: '+2%', confidence: 'High', signalId: 'fragmentation' },
      { name: 'Context switching', delta: '+1%', confidence: 'High', signalId: 'fragmentation' },
      { name: 'Focus block erosion', delta: '0%', confidence: 'Medium', signalId: 'focusBlocks' }
    ],
    actions: [
      { action: 'Review meeting cadence for Q1 planning', owner: 'COO', timeframe: '2 weeks', impact: 'Expected risk shift: 1 to 2pp', signalId: 'fragmentation' },
      { action: 'Assess context switching patterns in delivery teams', owner: 'Head of Delivery', timeframe: '3 weeks', impact: 'Expected risk shift: 1 to 2pp', signalId: 'fragmentation' },
      { action: 'Monitor baseline absence trends', owner: 'HRD', timeframe: 'Ongoing', impact: 'Expected volatility reduction: 1 to 2pp', signalId: 'absencePressure' }
    ],
    topRiskTeams: [
      { name: 'Team A', risk: 18, wowChange: 0, driver: 'Meeting density' },
      { name: 'Team B', risk: 16, wowChange: -1, driver: 'Context switching' },
      { name: 'Team C', risk: 15, wowChange: +1, driver: 'Focus block erosion' }
    ],
    segmentView: [
      { segment: 'Remote-first', highRiskShare: 12, participation: 65 },
      { segment: 'Office-first', highRiskShare: 16, participation: 69 }
    ]
  },
  {
    week: 'Week 49',
    dateRange: 'Dec 2 - Dec 8',
    coverage: 'Medium',
    participation: 65,
    sustainabilityRisk: 15,
    absencePressure: 9,
    fragmentation: 6,
    instability: 8,
    whatChanged: {
      paragraph: 'Early volatility signals observed with upticks in fragmentation and instability. Patterns suggest emerging pressure points, though confidence varies by driver.',
      bullets: [
        'Context switching increased vs 4-week average',
        'Last-minute change pressure trending upward',
        'Focus block erosion patterns observed'
      ]
    },
    topDrivers: [
      { name: 'Last-minute changes', delta: '+8%', confidence: 'Medium', signalId: 'instability' },
      { name: 'Context switching', delta: '+6%', confidence: 'High', signalId: 'fragmentation' },
      { name: 'Meeting density', delta: '+3%', confidence: 'Medium', signalId: 'fragmentation' }
    ],
    actions: [
      { action: 'Address planning volatility in project timelines', owner: 'Head of Delivery', timeframe: '2 weeks', impact: 'Expected risk shift: 2 to 4pp', signalId: 'instability' },
      { action: 'Review context switching patterns in high-pressure teams', owner: 'COO', timeframe: '2 weeks', impact: 'Expected risk shift: 2 to 3pp', signalId: 'fragmentation' },
      { action: 'Monitor early risk signals for escalation patterns', owner: 'HRD', timeframe: 'Ongoing', impact: 'Expected volatility reduction: 2 to 3pp', signalId: 'absencePressure' }
    ],
    topRiskTeams: [
      { name: 'Team A', risk: 20, wowChange: +2, driver: 'Last-minute changes' },
      { name: 'Team B', risk: 18, wowChange: +2, driver: 'Context switching' },
      { name: 'Team C', risk: 17, wowChange: +2, driver: 'Instability' }
    ],
    segmentView: [
      { segment: 'Remote-first', highRiskShare: 13, participation: 63 },
      { segment: 'Office-first', highRiskShare: 17, participation: 67 }
    ]
  },
  {
    week: 'Week 50',
    dateRange: 'Dec 9 - Dec 15',
    coverage: 'High',
    participation: 67,
    sustainabilityRisk: 18,
    absencePressure: 14,
    fragmentation: 9,
    instability: 12,
    whatChanged: {
      paragraph: 'Clear risk uptick across multiple system-level indicators. Fragmentation and instability show sustained elevation, indicating structural pressure requiring attention.',
      bullets: [
        'Fragmentation increased vs 4-week average',
        'Instability signals show elevated last-minute change pressure',
        'Context switching at higher levels with high confidence'
      ]
    },
    topDrivers: [
      { name: 'Last-minute changes', delta: '+12%', confidence: 'High', signalId: 'instability' },
      { name: 'Context switching', delta: '+9%', confidence: 'High', signalId: 'fragmentation' },
      { name: 'Focus block erosion', delta: '+6%', confidence: 'Medium', signalId: 'focusBlocks' }
    ],
    actions: [
      { action: 'Implement planning stability measures for Q1', owner: 'COO', timeframe: '1 week', impact: 'Expected risk shift: 3 to 5pp', signalId: 'instability' },
      { action: 'Reduce context switching through workflow optimization', owner: 'Head of Delivery', timeframe: '2 weeks', impact: 'Expected risk shift: 2 to 4pp', signalId: 'fragmentation' },
      { action: 'Deploy early intervention protocols for high-risk segments', owner: 'HRD', timeframe: '1 week', impact: 'Expected volatility reduction: 2 to 4pp', signalId: 'absencePressure' }
    ],
    topRiskTeams: [
      { name: 'Team A', risk: 24, wowChange: +4, driver: 'Last-minute changes' },
      { name: 'Team B', risk: 22, wowChange: +4, driver: 'Context switching' },
      { name: 'Team C', risk: 20, wowChange: +3, driver: 'Instability' }
    ],
    segmentView: [
      { segment: 'Remote-first', highRiskShare: 15, participation: 65 },
      { segment: 'Office-first', highRiskShare: 21, participation: 69 }
    ]
  }
];

interface DonutCardProps {
  label: string;
  value: number;
  subtitle: string;
  previousValue?: number;
}

function DonutCard({ label, value, subtitle, previousValue }: DonutCardProps) {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference * (1 - value / 100);
  
  // Calculate delta for display
  const delta = previousValue !== undefined ? value - previousValue : null;
  const deltaLabel = delta !== null 
    ? `${delta >= 0 ? '+' : ''}${delta}pp WoW`
    : `vs 4w: ${value > 10 ? '+' : ''}${value}%`;
  
  return (
    <div 
      className="group relative bg-neutral-900/40 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-white/10 transition-all duration-300 p-6 hover:border-white/15 hover:bg-neutral-900/50 hover:-translate-y-0.5 hover:shadow-lg focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-400/50 focus-within:ring-offset-2 focus-within:ring-offset-transparent"
      tabIndex={0}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="text-2xl font-semibold text-white">
            {value}%
          </p>
        </div>
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-white/10"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="text-blue-600 dark:text-blue-500 transition-all duration-500 group-hover:drop-shadow-lg"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] font-medium text-white/70 text-center leading-tight px-1">
              {deltaLabel}
            </span>
          </div>
        </div>
      </div>
      <p className="text-xs text-white/60 leading-relaxed">
        {subtitle}
      </p>
    </div>
  );
}

interface CoverageBadgeProps {
  coverage: 'High' | 'Medium' | 'Low';
}

function CoverageBadge({ coverage }: CoverageBadgeProps) {
  const colors = {
    High: 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30',
    Medium: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30',
    Low: 'bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30'
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${colors[coverage]}`}>
      {coverage} Coverage
    </span>
  );
}

interface ConfidencePillProps {
  confidence: 'High' | 'Medium' | 'Low';
}

function ConfidencePill({ confidence }: ConfidencePillProps) {
  const colors = {
    High: 'bg-green-500/20 text-green-700 dark:text-green-400',
    Medium: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    Low: 'bg-gray-500/20 text-gray-400'
  };
  
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[confidence]}`}>
      {confidence}
    </span>
  );
}

interface BriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  weekData: WeekData;
  previousWeek: WeekData | null;
}

function BriefingModal({ isOpen, onClose, weekData, previousWeek }: BriefingModalProps) {
  const router = useRouter();
  const [isCopyPanelOpen, setIsCopyPanelOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Handle ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isCopyPanelOpen) {
          setIsCopyPanelOpen(false);
        } else {
          onClose();
        }
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose, isCopyPanelOpen]);

  if (!isOpen) return null;

  // Calculate WoW deltas
  const getWowDelta = (current: number, previous: number | null): string => {
    if (previous === null) return 'N/A';
    const delta = current - previous;
    return `${delta >= 0 ? '+' : ''}${delta}pp`;
  };

  const sustainabilityDelta = getWowDelta(weekData.sustainabilityRisk, previousWeek?.sustainabilityRisk ?? null);
  const absenceDelta = getWowDelta(weekData.absencePressure, previousWeek?.absencePressure ?? null);
  const fragmentationDelta = getWowDelta(weekData.fragmentation, previousWeek?.fragmentation ?? null);
  const instabilityDelta = getWowDelta(weekData.instability, previousWeek?.instability ?? null);

  // Determine status
  const getStatus = (): { label: string; color: string } => {
    if (weekData.sustainabilityRisk >= 18 || weekData.instability >= 12) {
      return { label: 'At risk', color: 'text-red-600 dark:text-red-400' };
    } else if (weekData.sustainabilityRisk >= 15 || weekData.instability >= 8) {
      return { label: 'Watch', color: 'text-yellow-600 dark:text-yellow-400' };
    }
    return { label: 'Stable', color: 'text-green-600 dark:text-green-400' };
  };

  const status = getStatus();

  // Map driver to stream
  const getDriverStream = (driverName: string): string => {
    if (driverName.includes('Meeting density') || driverName.includes('Context switching') || driverName.includes('Focus block')) {
      return 'Stream 1 (meeting structure)';
    }
    if (driverName.includes('Last-minute changes')) {
      return 'Stream 2 (instability signals)';
    }
    return 'Stream 1 (meeting structure)';
  };

  // Get rationale for action
  const getActionRationale = (signalId: string): string => {
    const driver = weekData.topDrivers.find(d => d.signalId === signalId);
    if (!driver) return 'Based on observed system-level patterns.';
    return `Addresses observed ${driver.name.toLowerCase()} increase (${driver.delta}) with ${driver.confidence.toLowerCase()} confidence.`;
  };

  // Generate structured briefing text for clipboard
  const generateBriefingText = (): string => {
    const sustainabilityDelta = getWowDelta(weekData.sustainabilityRisk, previousWeek?.sustainabilityRisk ?? null);
    const absenceDelta = getWowDelta(weekData.absencePressure, previousWeek?.absencePressure ?? null);
    const fragmentationDelta = getWowDelta(weekData.fragmentation, previousWeek?.fragmentation ?? null);
    const instabilityDelta = getWowDelta(weekData.instability, previousWeek?.instability ?? null);

    let text = `WEEKLY CFO BRIEFING\n`;
    text += `${weekData.week} | ${weekData.dateRange} | Consulting / Tech services, 500 FTE\n\n`;
    text += `EXECUTIVE STATUS\n`;
    text += `Status: ${status.label}\n`;
    text += `What changed: ${weekData.whatChanged.paragraph}\n`;
    text += `Why it matters: ${weekData.sustainabilityRisk >= 18 
      ? 'Sustained elevation across multiple indicators suggests structural pressure requiring immediate attention.'
      : weekData.sustainabilityRisk >= 15
      ? 'Emerging patterns indicate potential pressure points that warrant monitoring.'
      : 'System-level indicators remain within expected operational ranges.'}\n\n`;
    
    text += `KEY MOVEMENTS\n`;
    text += `Sustainability Risk: ${weekData.sustainabilityRisk}% (${sustainabilityDelta} WoW)\n`;
    text += `Absence pressure: ${weekData.absencePressure}% (${absenceDelta} WoW)\n`;
    text += `Fragmentation: ${weekData.fragmentation}% (${fragmentationDelta} WoW)\n`;
    text += `Instability: ${weekData.instability}% (${instabilityDelta} WoW)\n\n`;

    text += `DRIVERS (WITH CONFIDENCE)\n`;
    weekData.topDrivers.forEach(driver => {
      text += `${driver.name}: ${driver.delta} (${driver.confidence} confidence)\n`;
    });
    text += `\n`;

    text += `RECOMMENDED ACTIONS\n`;
    weekData.actions.forEach(action => {
      text += `• ${action.action}\n`;
      text += `  Owner: ${action.owner} | Timeframe: ${action.timeframe} | Impact: ${action.impact}\n`;
    });
    text += `\n`;

    text += `ACTION SUMMARY BY CLUSTER\n`;
    text += `High-volatility teams (Team A/B/C):\n`;
    text += `  Context: Elevated risk indicators observed across delivery teams with sustained fragmentation and instability patterns.\n`;
    text += `  Actions required:\n`;
    text += `    • Review and optimize meeting cadence to reduce context switching\n`;
    text += `    • Implement planning stability measures for upcoming quarters\n`;
    text += `    • Monitor early risk signals for escalation patterns\n`;
    text += `  Typical owner: COO, Head of Delivery\n\n`;

    text += `Remote-first vs Office-first segment:\n`;
    text += `  Context: Differential patterns observed between work location segments, with office-first showing higher risk share.\n`;
    text += `  Actions required:\n`;
    text += `    • Assess workflow differences between segments\n`;
    text += `    • Review context switching patterns in high-pressure teams\n`;
    text += `    • Deploy early intervention protocols for high-risk segments\n`;
    text += `  Typical owner: HRD, COO\n\n`;

    text += `Delivery-heavy / change-heavy workstreams:\n`;
    text += `  Context: Workstreams with high change velocity showing elevated instability and last-minute change pressure.\n`;
    text += `  Actions required:\n`;
    text += `    • Address planning volatility in project timelines\n`;
    text += `    • Reduce context switching through workflow optimization\n`;
    text += `    • Implement planning stability measures\n`;
    text += `  Typical owner: Head of Delivery, COO\n`;

    return text;
  };

  // Handle copy to clipboard
  const handleCopyToClipboard = async () => {
    try {
      const text = generateBriefingText();
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setIsCopyPanelOpen(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-neutral-900/40 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-neutral-900/40 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
          <h3 className="text-xl font-semibold text-white">
            Weekly CFO Briefing
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400/50 rounded"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
            {/* Header Block */}
            <div className="space-y-3 pb-4 border-b border-gray-200/30 dark:border-white/10">
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
                <span className="font-medium text-white">{weekData.week}</span>
                <span className="text-white/40">•</span>
                <span>{weekData.dateRange}</span>
                <span className="text-white/40">•</span>
                <span>Consulting / Tech services, 500 FTE</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <CoverageBadge coverage={weekData.coverage} />
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/30">
                  Participation: {weekData.participation}%
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30">
                  Baseline absence: 2.8%
                </span>
              </div>
              <p className="text-xs text-white/50">
                Privacy-safe aggregation. No individual scoring. Not a medical product.
              </p>
            </div>

            {/* Executive Status */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                Executive status
              </h4>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="font-medium text-white">Status: </span>
                  <span className={status.color}>{status.label}</span>
                </p>
                <p className="text-white/70">
                  <span className="font-medium text-white">What changed: </span>
                  {weekData.whatChanged.paragraph}
                </p>
                <p className="text-white/70">
                  <span className="font-medium text-white">Why it matters: </span>
                  {weekData.sustainabilityRisk >= 18 
                    ? 'Sustained elevation across multiple indicators suggests structural pressure requiring immediate attention.'
                    : weekData.sustainabilityRisk >= 15
                    ? 'Emerging patterns indicate potential pressure points that warrant monitoring.'
                    : 'System-level indicators remain within expected operational ranges.'}
                </p>
              </div>
            </div>

            {/* Key Movements */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                Key movements
              </h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li>
                  <span className="font-medium text-white">Sustainability Risk: </span>
                  {weekData.sustainabilityRisk}% ({sustainabilityDelta} WoW). Measured as the share of the organization in the High segment based on aggregated team-level patterns. WoW compares to the previous calendar week (Monday to Sunday).
                </li>
                <li>
                  <span className="font-medium text-white">Absence pressure: </span>
                  {weekData.absencePressure}% ({absenceDelta} WoW). Relative vs baseline, measured from aggregated HRIS signals. WoW compares to the previous calendar week.
                </li>
                <li>
                  <span className="font-medium text-white">Fragmentation: </span>
                  {weekData.fragmentation}% ({fragmentationDelta} WoW). Context switching vs 4-week average, measured from Stream 1 (meeting structure). WoW compares to the previous calendar week.
                </li>
                <li>
                  <span className="font-medium text-white">Instability: </span>
                  {weekData.instability}% ({instabilityDelta} WoW). Last-minute change pressure vs 4-week average, measured from Stream 2 (instability signals). WoW compares to the previous calendar week.
                </li>
              </ul>
            </div>

            {/* Metric Notes */}
            <div className="space-y-2 pt-2 border-t border-gray-200/30 dark:border-white/10">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                Metric definitions and delta notes
              </h4>
              <ul className="text-xs text-white/70 space-y-1">
                <li>• WoW: previous calendar week (Monday to Sunday)</li>
                <li>• 4-week average: trailing 4 complete calendar weeks</li>
                <li>• pp vs %: pp used for share changes where applicable</li>
              </ul>
            </div>

            {/* Drivers and Confidence */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                Drivers (with confidence)
              </h4>
              <div className="space-y-3">
                {weekData.topDrivers.map((driver, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium text-white mb-1">
                      {driver.name}
                    </p>
                    <p className="text-white/70 text-xs">
                      Observed delta: {driver.delta} • Confidence: {driver.confidence} • Where measured: {getDriverStream(driver.name)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Leading Pattern Check */}
            {weekData.instability >= 8 && (
              <div className="space-y-2 pt-2 border-t border-gray-200/30 dark:border-white/10">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Leading pattern check
                </h4>
                <p className="text-sm text-white/70">
                  Observed pattern, not a guarantee. Instability signals show elevated pressure with {weekData.topDrivers.find(d => d.signalId === 'instability')?.confidence || 'Medium'} confidence. Pattern requires monitoring to confirm persistence.
                </p>
              </div>
            )}

            {/* Recommended Actions */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                Recommended actions (with rationale)
              </h4>
              <div className="space-y-4">
                {weekData.actions.map((action, index) => (
                  <div key={index} className="text-sm space-y-1 pb-3 border-b border-gray-200/20 dark:border-white/5 last:border-0">
                    <p className="font-medium text-white">
                      {action.action}
                    </p>
                    <p className="text-white/70 text-xs">
                      Owner: {action.owner} • Timeframe: {action.timeframe} • Expected impact: {action.impact}
                    </p>
                    <p className="text-white/70 text-xs italic">
                      Rationale: {getActionRationale(action.signalId)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Data Coverage and Limitations */}
            <div className="space-y-2 pt-2 border-t border-gray-200/30 dark:border-white/10">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                Data coverage and limitations
              </h4>
              <div className="text-sm text-white/70 space-y-2">
                <p>
                  <span className="font-medium text-white">Coverage: </span>
                  {weekData.coverage} coverage indicates {weekData.coverage === 'High' ? 'comprehensive data availability across streams' : weekData.coverage === 'Medium' ? 'moderate data availability with some gaps' : 'limited data availability requiring cautious interpretation'}.
                </p>
                <p>
                  <span className="font-medium text-white">Participation: </span>
                  {weekData.participation}% participation rate reflects the share of eligible teams contributing data this week.
                </p>
                <p className="text-xs italic">
                  Interpretation note: aggregated signals, directional decision support.
                </p>
              </div>
            </div>

            {/* Action Summary by Cluster */}
            <div className="space-y-3 pt-2 border-t border-gray-200/30 dark:border-white/10">
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                Action summary by cluster
              </h4>
              <div className="space-y-4 text-sm">
                {/* High-volatility teams */}
                <div>
                  <h5 className="font-medium text-white mb-2">
                    High-volatility teams (Team A/B/C)
                  </h5>
                  <p className="text-white/70 mb-2 text-xs">
                    Elevated risk indicators observed across delivery teams with sustained fragmentation and instability patterns.
                  </p>
                  <ul className="text-white/70 space-y-1 text-xs ml-4">
                    <li>• Review and optimize meeting cadence to reduce context switching</li>
                    <li>• Implement planning stability measures for upcoming quarters</li>
                    <li>• Monitor early risk signals for escalation patterns</li>
                  </ul>
                  <p className="text-white/50 text-xs mt-2 italic">
                    Typical owner: COO, Head of Delivery
                  </p>
                </div>

                {/* Remote-first vs Office-first */}
                <div>
                  <h5 className="font-medium text-white mb-2">
                    Remote-first vs Office-first segment
                  </h5>
                  <p className="text-white/70 mb-2 text-xs">
                    Differential patterns observed between work location segments, with office-first showing higher risk share.
                  </p>
                  <ul className="text-white/70 space-y-1 text-xs ml-4">
                    <li>• Assess workflow differences between segments</li>
                    <li>• Review context switching patterns in high-pressure teams</li>
                    <li>• Deploy early intervention protocols for high-risk segments</li>
                  </ul>
                  <p className="text-white/50 text-xs mt-2 italic">
                    Typical owner: HRD, COO
                  </p>
                </div>

                {/* Delivery-heavy / change-heavy workstreams */}
                <div>
                  <h5 className="font-medium text-white mb-2">
                    Delivery-heavy / change-heavy workstreams
                  </h5>
                  <p className="text-white/70 mb-2 text-xs">
                    Workstreams with high change velocity showing elevated instability and last-minute change pressure.
                  </p>
                  <ul className="text-white/70 space-y-1 text-xs ml-4">
                    <li>• Address planning volatility in project timelines</li>
                    <li>• Reduce context switching through workflow optimization</li>
                    <li>• Implement planning stability measures</li>
                  </ul>
                  <p className="text-white/50 text-xs mt-2 italic">
                    Typical owner: Head of Delivery, COO
                  </p>
                </div>
              </div>
            </div>

            {/* Connect to AI Assistant Button */}
            <div className="pt-4 border-t border-gray-200/30 dark:border-white/10 flex justify-center">
              <button
                onClick={() => {
                  // Extract week number from weekData.week (e.g., "Week 50" -> "50")
                  const weekNumber = weekData.week.match(/\d+/)?.[0] || '50';
                  // Close modal and navigate to animated chat with deep link params
                  onClose();
                  router.push(`/?source=weekly-briefing&week=${weekNumber}#briefing-chat`);
                }}
                className="inline-flex items-center justify-center px-6 py-2.5 bg-blue-600 dark:bg-blue-500 text-white text-sm font-medium rounded-full hover:bg-blue-700 dark:hover:bg-blue-400 active:bg-blue-800 dark:active:bg-blue-600 active:scale-[0.99] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 dark:focus-visible:ring-blue-400/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
              >
                Connect to your AI assistant
              </button>
            </div>

            {/* Privacy and Compliance Footer */}
            <div className="pt-4 border-t border-gray-200/30 dark:border-white/10">
              <p className="text-xs text-white/70 leading-relaxed space-y-1">
                <span className="font-medium text-white">Privacy and compliance:</span>
              </p>
              <ul className="text-xs text-white/70 leading-relaxed space-y-1 mt-2">
                <li>• All insights are aggregated at team level and privacy-safe by design.</li>
                <li>• No individual scoring.</li>
                <li>• Not a medical product.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copy Panel Modal */}
      {isCopyPanelOpen && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsCopyPanelOpen(false)}
        >
          <div 
            className="relative bg-neutral-900/40 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 max-w-md w-full shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Connect to your AI assistant
              </h3>
              <p className="text-sm text-white/70 leading-relaxed">
                This exports a structured briefing you can paste into your assistant to discuss decisions based on data.
              </p>
              <button
                onClick={handleCopyToClipboard}
                disabled={copied}
                className="w-full px-4 py-3 bg-blue-600 dark:bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-400 active:bg-blue-800 dark:active:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {copied ? 'Copied' : 'Copy briefing to clipboard'}
              </button>
              <button
                onClick={() => setIsCopyPanelOpen(false)}
                className="w-full px-4 py-2 text-sm font-medium text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500/50 dark:focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface MethodologyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function MethodologyModal({ isOpen, onClose }: MethodologyModalProps) {
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="relative bg-neutral-900/40 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-neutral-900/40 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 px-6 py-4 flex items-center justify-between z-10">
          <h3 className="text-xl font-semibold text-white">
            How we measure this
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
              Stream 1: Meeting structure
            </h4>
            <p className="text-sm text-white/70 leading-relaxed mb-2">
              Measures fragmentation, context switching, and focus block erosion through calendar and work pattern analysis.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
              Stream 2: Instability signals
            </h4>
            <p className="text-sm text-white/70 leading-relaxed mb-2">
              Tracks last-minute changes, planning volatility, and rework pressure to identify structural disruption patterns.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
              Stream 3: Recovery proxies
            </h4>
            <p className="text-sm text-white/70 leading-relaxed mb-2">
              Optional aggregated wearables and anonymous check-ins provide directional trends only, fully anonymized at team level.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
              Stream 4: Absence validation
            </h4>
            <p className="text-sm text-white/70 leading-relaxed mb-2">
              HRIS signals used at aggregated level to validate systemic patterns and confirm early risk indicators.
            </p>
          </div>
          
          <div className="pt-4 border-t border-gray-200/50 dark:border-white/10">
            <h4 className="text-sm font-semibold text-white mb-3">
              Privacy and compliance
            </h4>
            <ul className="text-sm text-white/70 leading-relaxed space-y-2">
              <li>• Aggregated team-level data only, no individual scoring</li>
              <li>• Privacy-safe aggregation ensures no personal identification</li>
              <li>• Not a medical product</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WeeklyCfoReportSection() {
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(2); // Week 50 default
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const selectedWeek = weeksData[selectedWeekIndex];
  const previousWeek = selectedWeekIndex > 0 ? weeksData[selectedWeekIndex - 1] : null;
  
  // Handle week change with transition
  const handleWeekChange = (index: number) => {
    if (index === selectedWeekIndex) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedWeekIndex(index);
      setIsTransitioning(false);
    }, 150);
  };
  
  // Get previous week values for delta calculation
  const getPreviousValue = (signalId: string): number | undefined => {
    if (!previousWeek) return undefined;
    switch (signalId) {
      case 'sustainability': return previousWeek.sustainabilityRisk;
      case 'absencePressure': return previousWeek.absencePressure;
      case 'fragmentation': return previousWeek.fragmentation;
      case 'instability': return previousWeek.instability;
      default: return undefined;
    }
  };
  
  return (
    <section id="weekly-data" className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 corqon-section-tight scroll-mt-28">
      {/* Headline and Intro */}
      <div className="text-center mb-8 sm:mb-10 lg:mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-3 sm:mb-4 px-4 sm:px-0">
          Weekly Data Briefing
        </h2>
        <p className="text-base sm:text-lg text-white/70 max-w-3xl mx-auto leading-relaxed mb-6 sm:mb-8 px-4 sm:px-6 md:px-0">
          System-level insights for decision support. Privacy-safe aggregation, no individual scoring. Not a medical product.
        </p>
        
        {/* Premium Segmented Control */}
        <div className="inline-flex items-center bg-neutral-900/40 backdrop-blur-xl rounded-full border border-gray-200/50 dark:border-white/10 p-1 sm:p-1.5 gap-1 sm:gap-1.5 mb-6 sm:mb-8 overflow-x-auto max-w-full">
          {weeksData.map((week, index) => (
            <button
              key={index}
              onClick={() => handleWeekChange(index)}
              className={`relative px-3 sm:px-4 md:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-transparent min-h-[44px] flex items-center justify-center whitespace-nowrap ${
                selectedWeekIndex === index
                  ? 'text-white bg-white dark:bg-neutral-800 shadow-sm'
                  : 'text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-neutral-800/50'
              }`}
              aria-pressed={selectedWeekIndex === index}
            >
              {week.week}
            </button>
          ))}
        </div>
      </div>
      
      {/* Report Card */}
      <div className="bg-neutral-900/40 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 shadow-xl overflow-hidden">
        {/* Report Header */}
        <div className="border-b border-gray-200/30 dark:border-white/10 p-4 sm:p-5 md:p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-semibold text-white mb-2">
                Weekly Data Report
              </h3>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-white/70">
                <span className="font-medium">{selectedWeek.week}</span>
                <span className="text-white/40">•</span>
                <span>{selectedWeek.dateRange}</span>
                <span className="text-white/40">•</span>
                <span className="break-words">Consulting / Tech services, 500 FTE</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <CoverageBadge coverage={selectedWeek.coverage} />
              <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-500/30 whitespace-nowrap">
                Participation: {selectedWeek.participation}%
              </span>
              <span className="px-2 sm:px-3 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-400 border border-gray-500/30 whitespace-nowrap">
                Baseline absence: 2.8%
              </span>
            </div>
          </div>
        </div>
        
        {/* KPI Donut Cards */}
        <div className={`p-4 sm:p-5 md:p-6 lg:p-8 transition-opacity duration-300 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <DonutCard
              label="Sustainability Risk"
              value={selectedWeek.sustainabilityRisk}
              subtitle="Share of org in High segment"
              previousValue={getPreviousValue('sustainability')}
            />
            <DonutCard
              label="Absence pressure"
              value={selectedWeek.absencePressure}
              subtitle="Relative vs baseline"
              previousValue={getPreviousValue('absencePressure')}
            />
            <DonutCard
              label="Fragmentation"
              value={selectedWeek.fragmentation}
              subtitle="Context switching vs 4-week avg"
              previousValue={getPreviousValue('fragmentation')}
            />
            <DonutCard
              label="Instability"
              value={selectedWeek.instability}
              subtitle="Last-minute change pressure vs 4-week avg"
              previousValue={getPreviousValue('instability')}
            />
          </div>
          
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-8 mb-6 sm:mb-8">
            {/* What Changed */}
            <div className="bg-white/5 dark:bg-neutral-900/60 backdrop-blur-xl rounded-xl border border-gray-200/20 dark:border-white/10 p-4 sm:p-5 md:p-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
                  What changed this week and why
                </h4>
                <button
                  onClick={() => setIsBriefingOpen(true)}
                  className="px-3 py-1.5 bg-blue-600 dark:bg-blue-500 text-white text-xs font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-transparent"
                >
                  See full briefing
                </button>
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-4">
                {selectedWeek.whatChanged.paragraph}
              </p>
              <ul className="space-y-2">
                {selectedWeek.whatChanged.bullets.map((bullet, index) => (
                  <li key={index} className="text-sm text-white/70 flex items-start">
                    <span className="text-white/40 mr-2">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Top Drivers */}
            <div className="bg-white/5 dark:bg-neutral-900/60 backdrop-blur-xl rounded-xl border border-gray-200/20 dark:border-white/10 p-4 sm:p-5 md:p-6">
              <h4 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
                Top drivers
              </h4>
              <div className="space-y-4">
                {selectedWeek.topDrivers.map((driver, index) => (
                  <div 
                    key={index} 
                    className="group flex items-center justify-between p-3 rounded-lg border border-transparent transition-all duration-200 hover:bg-white/5 dark:hover:bg-white/5 focus-within:bg-white/5 dark:focus-within:bg-white/5 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-400/50 focus-within:ring-offset-2 focus-within:ring-offset-transparent"
                    tabIndex={0}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">
                        {driver.name}
                      </p>
                      <p className="text-xs text-white/60 mt-1">
                        {driver.delta}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <ConfidencePill confidence={driver.confidence} />
                      <div className="w-1 h-6 bg-blue-500 dark:bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200"></div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-white/50 mt-4 leading-relaxed">
                Confidence reflects data coverage and signal consistency, team-level, aggregated.
              </p>
            </div>
          </div>
          
          {/* Recommended Actions Table */}
          <div className="bg-white/5 dark:bg-neutral-900/60 backdrop-blur-xl rounded-xl border border-gray-200/20 dark:border-white/10 p-4 sm:p-5 md:p-6 mb-6 sm:mb-8">
            <h4 className="text-sm font-semibold text-white mb-3 sm:mb-4 uppercase tracking-wider">
              Recommended actions
            </h4>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-gray-200/30 dark:border-white/10">
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs font-semibold text-white/50 uppercase tracking-wider">
                        Action
                      </th>
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs font-semibold text-white/50 uppercase tracking-wider">
                        Owner
                      </th>
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs font-semibold text-white/50 uppercase tracking-wider">
                        Timeframe
                      </th>
                      <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs font-semibold text-white/50 uppercase tracking-wider">
                        Expected impact
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedWeek.actions.map((action, index) => (
                      <tr
                        key={index}
                        className="group border-b border-gray-200/20 dark:border-white/5 transition-all duration-200 hover:bg-white/5 dark:hover:bg-white/5 focus-within:bg-white/5 dark:focus-within:bg-white/5 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-400/50 focus-within:ring-offset-2 focus-within:ring-offset-transparent"
                        tabIndex={0}
                      >
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-white break-words">
                          {action.action}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-white/70 whitespace-nowrap">
                          {action.owner}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-white/70 whitespace-nowrap">
                          {action.timeframe}
                        </td>
                        <td className="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm text-white/70 break-words">
                          {action.impact}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Details Accordion */}
          <div className="mb-8">
            <button
              onClick={() => setIsDetailsOpen(!isDetailsOpen)}
              className="w-full flex items-center justify-between p-4 bg-white/5 dark:bg-neutral-900/60 backdrop-blur-xl rounded-xl border border-gray-200/20 dark:border-white/10 hover:bg-white/10 dark:hover:bg-neutral-900/70 transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-transparent"
            >
              <span className="text-sm font-semibold text-white">
                {isDetailsOpen ? 'Hide details' : 'Show details'}
              </span>
              <svg
                className={`w-5 h-5 text-white/70 transition-transform duration-300 ${
                  isDetailsOpen ? 'transform rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <div
              className={`overflow-hidden transition-all duration-300 ${
                isDetailsOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-6 space-y-6">
                {/* Top Risk Teams */}
                <div>
                  <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                    Top risk teams
                  </h4>
                  <div className="space-y-3">
                    {selectedWeek.topRiskTeams.map((team, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white/5 dark:bg-neutral-900/60 backdrop-blur-xl rounded-lg border border-gray-200/20 dark:border-white/10 hover:bg-white/10 dark:hover:bg-neutral-900/70 transition-all duration-200"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">
                            {team.name}
                          </p>
                          <p className="text-xs text-white/60 mt-1">
                            {team.driver}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-white">
                            High risk: {team.risk}%
                          </p>
                          <p className="text-xs text-white/60">
                            {team.wowChange >= 0 ? '+' : ''}{team.wowChange}pp WoW
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Segment View */}
                <div>
                  <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
                    Segment view
                  </h4>
                  <div className="space-y-3">
                    {selectedWeek.segmentView.map((segment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white/5 dark:bg-neutral-900/60 backdrop-blur-xl rounded-lg border border-gray-200/20 dark:border-white/10"
                      >
                        <p className="text-sm font-medium text-white">
                          {segment.segment}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-white/70">
                          <span>High risk share: {segment.highRiskShare}%</span>
                          <span>Participation: {segment.participation}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-white/50 mt-4 leading-relaxed">
                    Displayed only when groups meet privacy thresholds (for example group size {'>='} 10).
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Footer Actions */}
          <div className="border-t border-gray-200/30 dark:border-white/10 p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="/reports/corqon-weekly-cfo-sample.pdf"
                download
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-transparent rounded"
              >
                Download sample PDF
              </a>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-sm font-medium text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-gray-500/50 dark:focus:ring-white/30 focus:ring-offset-2 focus:ring-offset-transparent rounded"
              >
                How we measure this
              </button>
            </div>
            <p className="text-xs text-white/50 text-center sm:text-right">
              Privacy-safe aggregation. No individual scoring. Not a medical product.
            </p>
          </div>
        </div>
      </div>
      
      <MethodologyModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      <BriefingModal 
        isOpen={isBriefingOpen} 
        onClose={() => setIsBriefingOpen(false)} 
        weekData={selectedWeek}
        previousWeek={previousWeek}
      />
    </section>
  );
}
