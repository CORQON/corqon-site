'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

export type MondayAction = {
  id: string;
  title: string;
  owner: 'HR' | 'Manager';
  effort: '15m' | '1h' | '1d';
  expectedOutcome: string;
  playbookId?: string;
  impactScore?: number;
  urgencyScore?: number;
  confidence?: 'High' | 'Medium' | 'Low';
  triggeredBy?: string[];
};

type ActionDelta = 'New this week' | 'Continued' | 'Updated';

// Week-keyed demo data for Monday plans
const mondayPlansByWeek: Record<number, MondayAction[]> = {
  48: [
    {
      id: 'w48-1',
      title: 'Protect focus blocks in delivery teams',
      owner: 'Manager',
      effort: '1h',
      expectedOutcome: 'Focus block protection measures reduce context switching interruptions. Expected to shift 1 to 2pp from Medium to Low risk segment.',
      playbookId: 'focus-blocks-playbook',
      impactScore: 75,
      urgencyScore: 65,
      confidence: 'High',
      triggeredBy: ['Focus block erosion'],
    },
    {
      id: 'w48-2',
      title: 'Review meeting cadence for Q1 planning',
      owner: 'Manager',
      effort: '1d',
      expectedOutcome: 'System-level meeting structure optimization reduces context switching and focus block erosion. Expected to shift 1 to 2pp of organization from High to Medium risk segment.',
      playbookId: 'meeting-cadence-playbook',
      impactScore: 80,
      urgencyScore: 70,
      confidence: 'High',
      triggeredBy: ['Meeting density and context switching'],
    },
    {
      id: 'w48-3',
      title: 'Assess context switching patterns in delivery teams',
      owner: 'Manager',
      effort: '1h',
      expectedOutcome: 'Workflow optimization reduces context switching frequency. Expected to shift 1 to 2pp from High to Medium risk segment.',
      impactScore: 70,
      urgencyScore: 60,
      confidence: 'Medium',
      triggeredBy: ['Meeting density and context switching'],
    },
  ],
  49: [
    {
      id: 'w49-1',
      title: 'Address planning volatility in project timelines',
      owner: 'Manager',
      effort: '1d',
      expectedOutcome: 'Planning stability measures reduce last-minute change pressure. Expected to shift 2 to 4pp of organization from High to Medium risk segment.',
      playbookId: 'planning-stability-playbook',
      impactScore: 85,
      urgencyScore: 80,
      confidence: 'Medium',
      triggeredBy: ['Last-minute changes and rework pressure'],
    },
    {
      id: 'w49-2',
      title: 'Review context switching patterns in high-pressure teams',
      owner: 'Manager',
      effort: '1h',
      expectedOutcome: 'Workflow optimization reduces context switching frequency. Expected to shift 2 to 3pp from High to Medium risk segment.',
      impactScore: 80,
      urgencyScore: 75,
      confidence: 'High',
      triggeredBy: ['Meeting density and context switching'],
    },
    {
      id: 'w48-3', // Continued from week 48
      title: 'Assess context switching patterns in delivery teams',
      owner: 'Manager',
      effort: '1h',
      expectedOutcome: 'Workflow optimization reduces context switching frequency. Expected to shift 1 to 2pp from High to Medium risk segment.',
      impactScore: 70,
      urgencyScore: 60,
      confidence: 'Medium',
      triggeredBy: ['Meeting density and context switching'],
    },
  ],
  50: [
    {
      id: 'w50-1',
      title: 'Implement planning stability measures for Q1',
      owner: 'Manager',
      effort: '1d',
      expectedOutcome: 'Planning stability measures reduce last-minute change pressure and rework cycles. Expected to shift 3 to 5pp of organization from High to Medium risk segment.',
      playbookId: 'planning-stability-playbook',
      impactScore: 90,
      urgencyScore: 85,
      confidence: 'High',
      triggeredBy: ['Last-minute changes and rework pressure'],
    },
    {
      id: 'w50-2',
      title: 'Reduce context switching through workflow optimization',
      owner: 'Manager',
      effort: '1h',
      expectedOutcome: 'Workflow optimization reduces context switching frequency and meeting density. Expected to shift 2 to 4pp from High to Medium risk segment.',
      impactScore: 85,
      urgencyScore: 80,
      confidence: 'High',
      triggeredBy: ['Meeting density and context switching'],
    },
    {
      id: 'w50-3',
      title: 'Schedule recovery-focused check-ins for high-risk segments',
      owner: 'HR',
      effort: '15m',
      expectedOutcome: 'Proactive support for teams showing recovery dip patterns reduces absence risk by 2-3pp.',
      impactScore: 75,
      urgencyScore: 80,
      confidence: 'High',
      triggeredBy: ['Last-minute changes and rework pressure'],
    },
  ],
  51: [
    {
      id: 'w50-1', // Continued from week 50
      title: 'Implement planning stability measures for Q1',
      owner: 'Manager',
      effort: '1d',
      expectedOutcome: 'Planning stability measures reduce last-minute change pressure and rework cycles. Expected to shift 3 to 5pp of organization from High to Medium risk segment.',
      playbookId: 'planning-stability-playbook',
      impactScore: 90,
      urgencyScore: 85,
      confidence: 'High',
      triggeredBy: ['Last-minute changes and rework pressure'],
    },
    {
      id: 'w51-2',
      title: 'Deploy early intervention protocols for high-risk segments',
      owner: 'HR',
      effort: '1h',
      expectedOutcome: 'Early intervention protocols provide targeted support to high-risk segments. Expected to reduce volatility by 2 to 4pp through proactive measures.',
      impactScore: 80,
      urgencyScore: 75,
      confidence: 'High',
      triggeredBy: ['Last-minute changes and rework pressure'],
    },
    {
      id: 'w51-3',
      title: 'Monitor focus block protection signals in delivery teams',
      owner: 'Manager',
      effort: '15m',
      expectedOutcome: 'Ongoing monitoring provides early detection capability for focus block erosion. No immediate intervention required, but continued observation supports decision readiness.',
      impactScore: 65,
      urgencyScore: 55,
      confidence: 'Medium',
      triggeredBy: ['Focus block erosion'],
    },
  ],
  52: [
    {
      id: 'w52-1',
      title: 'Review workload distribution in delivery teams',
      owner: 'Manager',
      effort: '1h',
      expectedOutcome: 'Identify teams with elevated workload signals and redistribute tasks to prevent burnout.',
      playbookId: 'workload-review-playbook',
      impactScore: 85,
      urgencyScore: 75,
      confidence: 'High',
      triggeredBy: ['Meeting density and context switching'],
    },
    {
      id: 'w51-2', // Continued from week 51
      title: 'Deploy early intervention protocols for high-risk segments',
      owner: 'HR',
      effort: '1h',
      expectedOutcome: 'Early intervention protocols provide targeted support to high-risk segments. Expected to reduce volatility by 2 to 4pp through proactive measures.',
      impactScore: 80,
      urgencyScore: 75,
      confidence: 'High',
      triggeredBy: ['Last-minute changes and rework pressure'],
    },
    {
      id: 'w52-3',
      title: 'Adjust meeting cadence to protect focus blocks',
      owner: 'Manager',
      effort: '1d',
      expectedOutcome: 'Reduced context switching improves focus quality and reduces fragmentation signals.',
      playbookId: 'meeting-cadence-playbook',
      impactScore: 75,
      urgencyScore: 65,
      confidence: 'Medium',
      triggeredBy: ['Meeting density and context switching', 'Focus block erosion'],
    },
  ],
};

// Sort by priority: priorityScore = (impactScore ?? 0) * 0.6 + (urgencyScore ?? 0) * 0.4
function sortByPriority(actions: MondayAction[]): MondayAction[] {
  return [...actions].sort((a, b) => {
    const scoreA = (a.impactScore ?? 0) * 0.6 + (a.urgencyScore ?? 0) * 0.4;
    const scoreB = (b.impactScore ?? 0) * 0.6 + (b.urgencyScore ?? 0) * 0.4;
    return scoreB - scoreA;
  });
}

// Compute weekly change delta for an action
function computeActionDelta(
  action: MondayAction,
  currentWeek: number,
  previousWeekActions: MondayAction[]
): ActionDelta {
  const previousAction = previousWeekActions.find((a) => a.id === action.id);
  
  if (!previousAction) {
    return 'New this week';
  }
  
  // Check if key fields changed
  const fieldsChanged =
    previousAction.title !== action.title ||
    previousAction.effort !== action.effort ||
    previousAction.owner !== action.owner ||
    previousAction.confidence !== action.confidence ||
    Math.abs((previousAction.impactScore ?? 0) - (action.impactScore ?? 0)) > 5 ||
    Math.abs((previousAction.urgencyScore ?? 0) - (action.urgencyScore ?? 0)) > 5;
  
  if (fieldsChanged) {
    return 'Updated';
  }
  
  return 'Continued';
}

// Extract week number from "Week 48" format
function extractWeekNumber(week: string): number {
  const match = week.match(/Week (\d+)/);
  return match ? parseInt(match[1], 10) : 50;
}

function ActionDetailsModal({
  action,
  isOpen,
  onClose,
}: {
  action: MondayAction | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !action || !mounted) return null;

  const confidence = action.confidence || 'Medium';

  // Mock playbook content structure
  const playbookContent = action.playbookId
    ? {
        why: [
          'Signal patterns indicate elevated risk in this area',
          'Early intervention prevents compounding effects',
          'Data confidence supports actionable recommendations',
        ],
        mondaySteps: [
          'Review current state and baseline metrics',
          'Identify specific teams or segments affected',
          'Schedule coordination meeting with stakeholders',
          'Define success criteria and measurement approach',
          'Execute first intervention step',
        ],
      }
    : null;

  const modalContent = (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
        role="dialog"
        aria-modal="true"
        aria-labelledby="action-modal-title"
      >
        <div
          className="relative bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 max-w-lg w-[calc(100%-2rem)] max-h-[85vh] overflow-hidden shadow-2xl flex flex-col pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 px-6 py-4 flex items-center justify-between z-10">
            <h3 id="action-modal-title" className="text-lg font-semibold text-gray-900 dark:text-white">
              {action.title}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 rounded"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="overflow-y-auto flex-1 p-6 space-y-6">
            {/* Owner, Effort, and Confidence badges */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-700 dark:text-gray-400">
                {action.owner}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-700 dark:text-gray-400">
                {action.effort}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-700 dark:text-gray-400">
                {confidence} confidence
              </span>
            </div>

            {/* Why this is recommended */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                Why this is recommended
              </h4>
              <ul className="space-y-2">
                {playbookContent
                  ? playbookContent.why.map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-600 dark:text-white/70 flex items-start">
                        <span className="text-gray-400 dark:text-white/40 mr-2 mt-0.5">•</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))
                  : [
                      'Signal patterns indicate elevated risk in this area',
                      'Early intervention prevents compounding effects',
                      'Data confidence supports actionable recommendations',
                    ].map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-600 dark:text-white/70 flex items-start">
                        <span className="text-gray-400 dark:text-white/40 mr-2 mt-0.5">•</span>
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
              </ul>
            </div>

            {/* Monday steps */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                Monday steps
              </h4>
              <ul className="space-y-2">
                {playbookContent
                  ? playbookContent.mondaySteps.map((step, idx) => (
                      <li key={idx} className="text-sm text-gray-600 dark:text-white/70 flex items-start">
                        <span className="text-gray-400 dark:text-white/40 mr-2 mt-0.5">•</span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))
                  : [
                      'Review current state and baseline metrics',
                      'Identify specific teams or segments affected',
                      'Schedule coordination meeting with stakeholders',
                      'Define success criteria and measurement approach',
                      'Execute first intervention step',
                    ].map((step, idx) => (
                      <li key={idx} className="text-sm text-gray-600 dark:text-white/70 flex items-start">
                        <span className="text-gray-400 dark:text-white/40 mr-2 mt-0.5">•</span>
                        <span className="leading-relaxed">{step}</span>
                      </li>
                    ))}
              </ul>
            </div>

            {/* Expected outcome */}
            <div className="pt-4 border-t border-gray-200/30 dark:border-white/10">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 uppercase tracking-wider">
                Expected outcome
              </h4>
              <p className="text-sm text-gray-600 dark:text-white/70 leading-relaxed">{action.expectedOutcome}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modalContent, document.body);
}

interface MondayPlanWidgetProps {
  week: string; // e.g., "Week 48"
}

export default function MondayPlanWidget({ week }: MondayPlanWidgetProps) {
  const [selectedAction, setSelectedAction] = useState<MondayAction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const weekNumber = extractWeekNumber(week);
  const currentWeekActions = mondayPlansByWeek[weekNumber] || mondayPlansByWeek[50];
  const previousWeekNumber = weekNumber - 1;
  const previousWeekActions = mondayPlansByWeek[previousWeekNumber] || [];

  const sortedActions = sortByPriority(currentWeekActions);

  const handleActionClick = (action: MondayAction) => {
    setSelectedAction(action);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="bg-white/5 dark:bg-neutral-900/60 backdrop-blur-xl rounded-xl border border-gray-200/20 dark:border-white/10 p-6 mb-6">
        <div className="mb-4">
          <p className="text-xs text-gray-500 dark:text-white/50 uppercase tracking-wider mb-1">Priority today</p>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1 uppercase tracking-wider">
            This week: Monday plan
          </h3>
          <p className="text-xs text-gray-600 dark:text-white/60">
            Top actions based on {week} signals
            {previousWeekNumber >= 48 && (
              <span className="ml-1 text-gray-500 dark:text-white/40">(vs Week {previousWeekNumber})</span>
            )}
          </p>
        </div>

        <div className="space-y-3">
          {sortedActions.map((action) => {
            const delta = computeActionDelta(action, weekNumber, previousWeekActions);
            const deltaStyles = {
              'New this week': 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
              'Continued': 'bg-gray-500/20 text-gray-700 dark:text-gray-400',
              'Updated': 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
            };

            return (
              <div
                key={action.id}
                className="group p-4 bg-white/40 dark:bg-white/5 rounded-lg border border-gray-200/30 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/10 transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                  {/* Left: Title and expected outcome */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-2">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white flex-1">{action.title}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${deltaStyles[delta]} flex-shrink-0`}>
                        {delta}
                      </span>
                    </div>
                    {action.triggeredBy && action.triggeredBy.length > 0 && (
                      <p className="text-xs text-gray-500 dark:text-white/50 mb-1.5">
                        Triggered by: {action.triggeredBy.slice(0, 2).join(', ')}
                      </p>
                    )}
                    <p className="text-xs text-gray-500 dark:text-white/50 leading-relaxed">{action.expectedOutcome}</p>
                  </div>

                  {/* Right: Badges and CTA */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end gap-2 lg:gap-2 flex-shrink-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/20 text-gray-700 dark:text-gray-400">
                        {action.owner}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/20 text-gray-700 dark:text-gray-400">
                        {action.effort}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-500/20 text-gray-700 dark:text-gray-400">
                        {(action.confidence || 'Medium')} confidence
                      </span>
                    </div>
                    <button
                      onClick={() => handleActionClick(action)}
                      className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-transparent"
                      aria-label={`See details for ${action.title}`}
                    >
                      See details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Details Modal */}
      <ActionDetailsModal
        action={selectedAction}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedAction(null);
        }}
      />
    </>
  );
}

