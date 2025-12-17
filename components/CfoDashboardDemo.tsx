'use client';

import { useState, useEffect, useRef } from 'react';
import MondayPlanWidget from '@/components/dashboard/MondayPlanWidget';

// Types
type Week = 'Week 48' | 'Week 49' | 'Week 50';
type Department = 'All departments' | 'Department A' | 'Department B' | 'Department C';
type Location = 'All locations' | 'Remote-first' | 'Office-first';
type RoleType = 'All roles' | 'Knowledge work' | 'Ops';
type Confidence = 'High' | 'Medium' | 'Low';

interface KpiData {
  label: string;
  value: number;
  wowDelta: number;
  vs4WeekDelta: number;
  qtdDelta: number;
  confidence: Confidence;
  count?: number;
  total?: number;
  tooltip: string;
  definition?: string;
  threshold?: string;
  whyHigh?: string;
}

interface RiskDistribution {
  low: { percent: number; count: number };
  medium: { percent: number; count: number };
  high: { percent: number; count: number };
}

interface Driver {
  name: string;
  delta: string;
  confidence: Confidence;
  tooltip: string;
}

interface Team {
  name: string;
  highRiskShare: number;
  highRiskCount: number;
  primaryDriver: string;
  trendWow: number;
  confidence: Confidence;
  timeSeries: number[]; // High risk share values for last 8 weeks
}

interface Action {
  action: string;
  owner: string;
  timeframe: string;
  impact: string;
  column: 'Now' | 'Next' | 'Monitor';
  why: string;
  whatChanges: string;
  riskIfNoAction: string;
  confidenceNote: string;
  triggeredBy?: string[]; // Driver names that trigger this action
}

export type Intervention = {
  id: string;
  title: string;
  owner: 'HR' | 'Manager';
  status: 'Planned' | 'In progress' | 'Done';
  due: string;
  expectedImpact: string;
  earlySignal: 'Improving' | 'Stable' | 'Worsening';
  relatedDrivers?: string[];
};

interface DashboardData {
  week: Week;
  decisionFocus: string;
  status: 'Stable' | 'Watch' | 'At risk';
  kpis: KpiData[];
  riskDistribution: RiskDistribution;
  drivers: Driver[];
  teams: Team[];
  actions: Action[];
  cohortSize?: number;
  teamCount?: number;
  lastUpdated?: string;
  coverage?: number;
}

// Centralized style system - extracted from Weekly CFO Report component
// Reusing exact Tailwind classes for consistency

// Severity pills (High/Medium/Low) - exact classes from Weekly CFO Report ConfidencePill
const SEVERITY_STYLES = {
  High: {
    pillClass: 'bg-green-500/20 text-green-700 dark:text-green-400',
    borderClass: '', // ConfidencePill in report doesn't use border
  },
  Medium: {
    pillClass: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
    borderClass: '',
  },
  Low: {
    pillClass: 'bg-gray-500/20 text-gray-700 dark:text-gray-400',
    borderClass: '',
  },
} as const;

// Team series colors - consistent across line, legend, hover dot, tooltip marker
const TEAM_SERIES = {
  A: {
    label: 'Team A',
    color: '#6D8CFF', // Same for line, dot, tooltip marker
    lineColor: '#6D8CFF',
    dotColor: '#6D8CFF',
  },
  B: {
    label: 'Team B',
    color: '#62D5B2',
    lineColor: '#62D5B2',
    dotColor: '#62D5B2',
  },
  C: {
    label: 'Team C',
    color: '#C09CFF',
    lineColor: '#C09CFF',
    dotColor: '#C09CFF',
  },
} as const;

// Risk distribution colors - using severity color families
const RISK_COLORS = {
  Low: '#3AAE84',   // Maps to Low severity family
  Medium: '#C79A44', // Maps to Medium severity family
  High: '#D26464',   // Maps to High severity family
} as const;

// Status colors - using severity color families
const STATUS_COLORS = {
  Stable: 'text-green-600 dark:text-green-400',
  Watch: 'text-yellow-600 dark:text-yellow-400',
  'At risk': 'text-red-600 dark:text-red-400',
} as const;

// Intervention tracker demo data
const interventionsByWeek: Record<number, Intervention[]> = {
  48: [
    {
      id: 'int-48-1',
      title: 'Focus block protection measures',
      owner: 'Manager',
      status: 'Planned',
      due: 'Wed',
      expectedImpact: '-1 to -2pp risk',
      earlySignal: 'Stable',
      relatedDrivers: ['Focus block erosion'],
    },
    {
      id: 'int-48-2',
      title: 'Meeting cadence review for Q1',
      owner: 'Manager',
      status: 'Planned',
      due: 'Next week',
      expectedImpact: '-1 to -2pp risk',
      earlySignal: 'Stable',
      relatedDrivers: ['Meeting density and context switching'],
    },
  ],
  49: [
    {
      id: 'int-49-1',
      title: 'Planning stability measures',
      owner: 'Manager',
      status: 'In progress',
      due: 'Fri',
      expectedImpact: '-2 to -4pp risk',
      earlySignal: 'Improving',
      relatedDrivers: ['Last-minute changes and rework pressure'],
    },
    {
      id: 'int-49-2',
      title: 'Context switching workflow optimization',
      owner: 'Manager',
      status: 'In progress',
      due: 'Next week',
      expectedImpact: '-2 to -3pp risk',
      earlySignal: 'Stable',
      relatedDrivers: ['Meeting density and context switching'],
    },
    {
      id: 'int-48-1', // Continued from week 48
      title: 'Focus block protection measures',
      owner: 'Manager',
      status: 'Done',
      due: 'Wed',
      expectedImpact: '-1 to -2pp risk',
      earlySignal: 'Improving',
      relatedDrivers: ['Focus block erosion'],
    },
  ],
  50: [
    {
      id: 'int-50-1',
      title: 'Q1 planning stability implementation',
      owner: 'Manager',
      status: 'In progress',
      due: 'Fri',
      expectedImpact: '-3 to -5pp risk',
      earlySignal: 'Improving',
      relatedDrivers: ['Last-minute changes and rework pressure'],
    },
    {
      id: 'int-50-2',
      title: 'Workflow optimization for context switching',
      owner: 'Manager',
      status: 'In progress',
      due: 'Next week',
      expectedImpact: '-2 to -4pp risk',
      earlySignal: 'Stable',
      relatedDrivers: ['Meeting density and context switching'],
    },
    {
      id: 'int-50-3',
      title: 'Early intervention protocols deployment',
      owner: 'HR',
      status: 'Planned',
      due: 'Next week',
      expectedImpact: '-2 to -4pp volatility',
      earlySignal: 'Stable',
      relatedDrivers: ['Last-minute changes and rework pressure'],
    },
    {
      id: 'int-49-1', // Continued from week 49
      title: 'Planning stability measures',
      owner: 'Manager',
      status: 'Done',
      due: 'Fri',
      expectedImpact: '-2 to -4pp risk',
      earlySignal: 'Improving',
      relatedDrivers: ['Last-minute changes and rework pressure'],
    },
  ],
  51: [
    {
      id: 'int-50-1', // Continued from week 50
      title: 'Q1 planning stability implementation',
      owner: 'Manager',
      status: 'Done',
      due: 'Fri',
      expectedImpact: '-3 to -5pp risk',
      earlySignal: 'Improving',
      relatedDrivers: ['Last-minute changes and rework pressure'],
    },
    {
      id: 'int-51-1',
      title: 'High-risk segment support protocols',
      owner: 'HR',
      status: 'In progress',
      due: 'Wed',
      expectedImpact: '-2 to -4pp volatility',
      earlySignal: 'Improving',
      relatedDrivers: ['Last-minute changes and rework pressure'],
    },
    {
      id: 'int-50-2', // Continued from week 50
      title: 'Workflow optimization for context switching',
      owner: 'Manager',
      status: 'In progress',
      due: 'Next week',
      expectedImpact: '-2 to -4pp risk',
      earlySignal: 'Stable',
      relatedDrivers: ['Meeting density and context switching'],
    },
  ],
  52: [
    {
      id: 'int-52-1',
      title: 'Workload distribution review',
      owner: 'Manager',
      status: 'Planned',
      due: 'Fri',
      expectedImpact: '-2 to -3pp risk',
      earlySignal: 'Stable',
      relatedDrivers: ['Meeting density and context switching'],
    },
    {
      id: 'int-51-1', // Continued from week 51
      title: 'High-risk segment support protocols',
      owner: 'HR',
      status: 'Done',
      due: 'Wed',
      expectedImpact: '-2 to -4pp volatility',
      earlySignal: 'Improving',
      relatedDrivers: ['Last-minute changes and rework pressure'],
    },
    {
      id: 'int-50-2', // Continued from week 50
      title: 'Workflow optimization for context switching',
      owner: 'Manager',
      status: 'Done',
      due: 'Next week',
      expectedImpact: '-2 to -4pp risk',
      earlySignal: 'Improving',
      relatedDrivers: ['Meeting density and context switching'],
    },
  ],
};

// Demo data model
const baseData: Record<Week, DashboardData> = {
  'Week 48': {
    week: 'Week 48',
    decisionFocus: 'System-level indicators remain within expected ranges.',
    status: 'Stable',
    kpis: [
      {
        label: 'Sustainability Risk',
        value: 14,
        wowDelta: 0,
        vs4WeekDelta: -1,
        qtdDelta: -2,
        confidence: 'High',
        count: 70,
        total: 500,
        tooltip: 'Share of organization in High risk segment. WoW compares to previous calendar week (Monday to Sunday).',
      },
      {
        label: 'Absence pressure',
        value: 6,
        wowDelta: 0,
        vs4WeekDelta: -0.5,
        qtdDelta: -1,
        confidence: 'High',
        tooltip: 'Relative vs baseline 2.8%. Measured from aggregated HRIS signals. WoW compares to previous calendar week.',
      },
      {
        label: 'Fragmentation',
        value: 4,
        wowDelta: 0,
        vs4WeekDelta: -1,
        qtdDelta: -2,
        confidence: 'High',
        tooltip: 'Context switching vs 4-week average. Measured from Stream 1 (meeting structure). WoW compares to previous calendar week.',
      },
      {
        label: 'Instability',
        value: 5,
        wowDelta: 0,
        vs4WeekDelta: -1,
        qtdDelta: -1.5,
        confidence: 'Medium',
        tooltip: 'Last-minute change pressure vs 4-week average. Measured from Stream 2 (instability signals). WoW compares to previous calendar week.',
      },
      {
        label: 'Participation',
        value: 67,
        wowDelta: 0,
        vs4WeekDelta: 1,
        qtdDelta: 2,
        confidence: 'High',
        tooltip: 'Share of eligible teams contributing data this week.',
      },
      {
        label: 'Coverage',
        value: 85,
        wowDelta: 0,
        vs4WeekDelta: 2,
        qtdDelta: 3,
        confidence: 'High',
        tooltip: 'Data coverage across streams. High indicates comprehensive data availability.',
      },
    ],
    riskDistribution: {
      low: { percent: 55, count: 275 },
      medium: { percent: 31, count: 155 },
      high: { percent: 14, count: 70 },
    },
    drivers: [
      {
        name: 'Meeting density and context switching',
        delta: '+2%',
        confidence: 'High',
        tooltip: 'Meeting density and context switching patterns. Measured from Stream 1 (meeting structure).',
      },
      {
        name: 'Last-minute changes and rework pressure',
        delta: '+1%',
        confidence: 'Medium',
        tooltip: 'Last-minute changes and rework pressure. Measured from Stream 2 (instability signals).',
      },
      {
        name: 'Focus block erosion',
        delta: '0%',
        confidence: 'Medium',
        tooltip: 'Focus block erosion patterns. Measured from Stream 1 (meeting structure).',
      },
    ],
    teams: [
      {
        name: 'Team A',
        highRiskShare: 18,
        highRiskCount: 9,
        primaryDriver: 'Meeting density',
        trendWow: 0,
        confidence: 'High',
        timeSeries: [16, 16, 17, 17, 17, 18, 18, 18],
      },
      {
        name: 'Team B',
        highRiskShare: 16,
        highRiskCount: 8,
        primaryDriver: 'Context switching',
        trendWow: -1,
        confidence: 'High',
        timeSeries: [17, 17, 16, 16, 16, 16, 16, 16],
      },
      {
        name: 'Team C',
        highRiskShare: 15,
        highRiskCount: 8,
        primaryDriver: 'Focus block erosion',
        trendWow: 1,
        confidence: 'Medium',
        timeSeries: [14, 14, 14, 14, 15, 15, 15, 15],
      },
    ],
    actions: [
      {
        action: 'Protect focus blocks in delivery teams',
        owner: 'Head of Delivery',
        timeframe: '1 week',
        impact: 'Expected risk shift (model-based): 1 to 2pp',
        column: 'Now',
        why: 'Focus block erosion at baseline levels, but early protection supports stability. High confidence based on consistent signal patterns.',
        whatChanges: 'Focus block protection measures reduce context switching interruptions. Expected to shift 1 to 2pp from Medium to Low risk segment.',
        riskIfNoAction: 'Expected continued baseline patterns: focus block erosion may remain at current levels without intervention.',
        confidenceNote: 'High confidence based on 85% coverage and 67% participation. Signal consistency is strong.',
        triggeredBy: ['Focus block erosion'],
      },
      {
        action: 'Review meeting cadence for Q1 planning',
        owner: 'COO',
        timeframe: '2 weeks',
        impact: 'Expected risk shift (model-based): 1 to 2pp',
        column: 'Next',
        why: 'Addresses observed meeting density increase (+2%) with high confidence. Pattern suggests structural fragmentation that may compound if unaddressed.',
        whatChanges: 'System-level meeting structure optimization reduces context switching and focus block erosion. Expected to shift 1 to 2pp of organization from High to Medium risk segment.',
        riskIfNoAction: 'Potential escalation pattern: continued fragmentation may increase High segment share by 2 to 3pp over next 4 weeks.',
        confidenceNote: 'High confidence based on 85% coverage and 67% participation. Signal consistency is strong.',
        triggeredBy: ['Meeting density and context switching'],
      },
      {
        action: 'Assess context switching patterns in delivery teams',
        owner: 'Head of Delivery',
        timeframe: '3 weeks',
        impact: 'Expected risk shift (model-based): 1 to 2pp',
        column: 'Monitor',
        why: 'Context switching patterns aligned with 4-week average but warrant monitoring. Medium confidence due to moderate signal consistency.',
        whatChanges: 'Workflow optimization reduces context switching frequency. Expected to shift 1 to 2pp from High to Medium risk segment.',
        riskIfNoAction: 'Expected continued volatility: context switching may remain elevated, maintaining current risk distribution.',
        confidenceNote: 'Medium confidence based on 85% coverage. Some gaps in data streams require cautious interpretation.',
        triggeredBy: ['Meeting density and context switching'],
      },
      {
        action: 'Monitor baseline absence trends',
        owner: 'HRD',
        timeframe: 'Ongoing',
        impact: 'Expected volatility reduction: 1 to 2pp',
        column: 'Monitor',
        why: 'Baseline absence patterns remain stable. Monitoring ensures early detection of any deviation from expected ranges.',
        whatChanges: 'Ongoing monitoring enables early intervention if patterns shift. No immediate action required, but continued observation supports decision readiness.',
        riskIfNoAction: 'Expected continued volatility: absence pressure may remain at current levels without intervention.',
        confidenceNote: 'High confidence based on comprehensive HRIS coverage and consistent participation.',
        triggeredBy: [],
      },
    ],
  },
  'Week 49': {
    week: 'Week 49',
    decisionFocus: 'Early volatility signals observed. Monitor for escalation patterns.',
    status: 'Watch',
    cohortSize: 500,
    teamCount: 8,
    lastUpdated: '1 day ago',
    coverage: 82,
    kpis: [
      {
        label: 'Sustainability Risk',
        value: 15,
        wowDelta: 1,
        vs4WeekDelta: 0,
        qtdDelta: -1,
        confidence: 'High',
        count: 75,
        total: 500,
        tooltip: 'Share of organization in High risk segment. WoW compares to previous calendar week (Monday to Sunday).',
      },
      {
        label: 'Absence pressure',
        value: 9,
        wowDelta: 3,
        vs4WeekDelta: 1.5,
        qtdDelta: 0.5,
        confidence: 'High',
        tooltip: 'Relative vs baseline 2.8%. Measured from aggregated HRIS signals. WoW compares to previous calendar week.',
      },
      {
        label: 'Fragmentation',
        value: 6,
        wowDelta: 2,
        vs4WeekDelta: 1,
        qtdDelta: 0,
        confidence: 'High',
        tooltip: 'Context switching vs 4-week average. Measured from Stream 1 (meeting structure). WoW compares to previous calendar week.',
      },
      {
        label: 'Instability',
        value: 8,
        wowDelta: 3,
        vs4WeekDelta: 2,
        qtdDelta: 1,
        confidence: 'Medium',
        tooltip: 'Last-minute change pressure vs 4-week average. Measured from Stream 2 (instability signals). WoW compares to previous calendar week.',
      },
      {
        label: 'Participation',
        value: 65,
        wowDelta: -2,
        vs4WeekDelta: -1,
        qtdDelta: 0,
        confidence: 'High',
        tooltip: 'Share of eligible teams contributing data this week.',
      },
      {
        label: 'Coverage',
        value: 82,
        wowDelta: -3,
        vs4WeekDelta: -1,
        qtdDelta: 0,
        confidence: 'Medium',
        tooltip: 'Data coverage across streams. Medium indicates moderate data availability with some gaps.',
      },
    ],
    riskDistribution: {
      low: { percent: 52, count: 260 },
      medium: { percent: 33, count: 165 },
      high: { percent: 15, count: 75 },
    },
    drivers: [
      {
        name: 'Last-minute changes and rework pressure',
        delta: '+8%',
        confidence: 'Medium',
        tooltip: 'Last-minute changes and rework pressure. Measured from Stream 2 (instability signals).',
      },
      {
        name: 'Meeting density and context switching',
        delta: '+6%',
        confidence: 'High',
        tooltip: 'Meeting density and context switching patterns. Measured from Stream 1 (meeting structure).',
      },
      {
        name: 'Focus block erosion',
        delta: '+3%',
        confidence: 'Medium',
        tooltip: 'Focus block erosion patterns. Measured from Stream 1 (meeting structure).',
      },
    ],
    teams: [
      {
        name: 'Team A',
        highRiskShare: 20,
        highRiskCount: 10,
        primaryDriver: 'Last-minute changes',
        trendWow: 2,
        confidence: 'High',
        timeSeries: [16, 17, 17, 18, 18, 19, 19, 20],
      },
      {
        name: 'Team B',
        highRiskShare: 18,
        highRiskCount: 9,
        primaryDriver: 'Context switching',
        trendWow: 2,
        confidence: 'High',
        timeSeries: [14, 15, 15, 16, 16, 17, 17, 18],
      },
      {
        name: 'Team C',
        highRiskShare: 17,
        highRiskCount: 9,
        primaryDriver: 'Instability',
        trendWow: 2,
        confidence: 'Medium',
        timeSeries: [13, 14, 14, 15, 15, 16, 16, 17],
      },
    ],
    actions: [
      {
        action: 'Address planning volatility in project timelines',
        owner: 'Head of Delivery',
        timeframe: '2 weeks',
        impact: 'Expected risk shift (model-based): 2 to 4pp',
        column: 'Now',
        why: 'Addresses observed last-minute changes increase (+8%) with medium confidence. Pattern suggests emerging planning instability requiring attention.',
        whatChanges: 'Planning stability measures reduce last-minute change pressure. Expected to shift 2 to 4pp of organization from High to Medium risk segment.',
        riskIfNoAction: 'Potential escalation pattern: continued planning volatility may increase High segment share by 3 to 5pp over next 4 weeks.',
        confidenceNote: 'Medium confidence based on 82% coverage. Some gaps in instability signal streams require cautious interpretation.',
      },
      {
        action: 'Review context switching patterns in high-pressure teams',
        owner: 'COO',
        timeframe: '2 weeks',
        impact: 'Expected risk shift (model-based): 2 to 3pp',
        column: 'Next',
        why: 'Addresses observed context switching increase (+6%) with high confidence. Pattern indicates structural fragmentation in high-pressure teams.',
        whatChanges: 'Workflow optimization reduces context switching frequency. Expected to shift 2 to 3pp from High to Medium risk segment.',
        riskIfNoAction: 'Expected continued volatility: context switching may remain elevated, maintaining or increasing current risk distribution.',
        confidenceNote: 'High confidence based on 82% coverage. Signal consistency is strong despite moderate overall coverage.',
      },
      {
        action: 'Monitor early risk signals for escalation patterns',
        owner: 'HRD',
        timeframe: 'Ongoing',
        impact: 'Expected volatility reduction: 2 to 3pp',
        column: 'Monitor',
        why: 'Early volatility signals observed across multiple indicators. Monitoring enables rapid response if patterns escalate.',
        whatChanges: 'Ongoing monitoring provides early detection capability. No immediate intervention required, but continued observation supports decision readiness.',
        riskIfNoAction: 'Expected continued volatility: early signals may escalate into sustained elevation if unaddressed.',
        confidenceNote: 'Medium confidence based on 82% coverage. Monitoring supports decision readiness despite moderate data gaps.',
      },
    ],
  },
  'Week 50': {
    week: 'Week 50',
    decisionFocus: 'Planning instability is elevated. Tighten change control.',
    status: 'At risk',
    cohortSize: 500,
    teamCount: 8,
    lastUpdated: 'Today',
    coverage: 85,
    kpis: [
      {
        label: 'Sustainability Risk',
        value: 18,
        wowDelta: 3,
        vs4WeekDelta: 3,
        qtdDelta: 2,
        confidence: 'High',
        count: 90,
        total: 500,
        tooltip: 'Share of organization in High risk segment. WoW compares to previous calendar week (Monday to Sunday).',
      },
      {
        label: 'Absence pressure',
        value: 14,
        wowDelta: 5,
        vs4WeekDelta: 4,
        qtdDelta: 2.5,
        confidence: 'High',
        tooltip: 'Relative vs baseline 2.8%. Measured from aggregated HRIS signals. WoW compares to previous calendar week.',
      },
      {
        label: 'Fragmentation',
        value: 9,
        wowDelta: 3,
        vs4WeekDelta: 4,
        qtdDelta: 3,
        confidence: 'High',
        tooltip: 'Context switching vs 4-week average. Measured from Stream 1 (meeting structure). WoW compares to previous calendar week.',
      },
      {
        label: 'Instability',
        value: 12,
        wowDelta: 4,
        vs4WeekDelta: 6,
        qtdDelta: 4.5,
        confidence: 'High',
        tooltip: 'Last-minute change pressure vs 4-week average. Measured from Stream 2 (instability signals). WoW compares to previous calendar week.',
      },
      {
        label: 'Participation',
        value: 67,
        wowDelta: 2,
        vs4WeekDelta: 0,
        qtdDelta: 2,
        confidence: 'High',
        tooltip: 'Share of eligible teams contributing data this week.',
      },
      {
        label: 'Coverage',
        value: 85,
        wowDelta: 3,
        vs4WeekDelta: 0,
        qtdDelta: 3,
        confidence: 'High',
        tooltip: 'Data coverage across streams. High indicates comprehensive data availability.',
      },
    ],
    riskDistribution: {
      low: { percent: 48, count: 240 },
      medium: { percent: 34, count: 170 },
      high: { percent: 18, count: 90 },
    },
    drivers: [
      {
        name: 'Last-minute changes and rework pressure',
        delta: '+12%',
        confidence: 'High',
        tooltip: 'Last-minute changes and rework pressure. Measured from Stream 2 (instability signals).',
      },
      {
        name: 'Meeting density and context switching',
        delta: '+9%',
        confidence: 'High',
        tooltip: 'Meeting density and context switching patterns. Measured from Stream 1 (meeting structure).',
      },
      {
        name: 'Focus block erosion',
        delta: '+6%',
        confidence: 'Medium',
        tooltip: 'Focus block erosion patterns. Measured from Stream 1 (meeting structure).',
      },
    ],
    teams: [
      {
        name: 'Team A',
        highRiskShare: 24,
        highRiskCount: 12,
        primaryDriver: 'Last-minute changes',
        trendWow: 4,
        confidence: 'High',
        timeSeries: [16, 17, 18, 19, 20, 21, 22, 24],
      },
      {
        name: 'Team B',
        highRiskShare: 22,
        highRiskCount: 11,
        primaryDriver: 'Context switching',
        trendWow: 4,
        confidence: 'High',
        timeSeries: [14, 15, 16, 17, 18, 19, 20, 22],
      },
      {
        name: 'Team C',
        highRiskShare: 20,
        highRiskCount: 10,
        primaryDriver: 'Instability',
        trendWow: 3,
        confidence: 'Medium',
        timeSeries: [13, 14, 15, 16, 17, 18, 19, 20],
      },
    ],
    actions: [
      {
        action: 'Implement planning stability measures for Q1',
        owner: 'COO',
        timeframe: '1 week',
        impact: 'Expected risk shift (model-based): 3 to 5pp',
        column: 'Now',
        why: 'Addresses observed last-minute changes increase (+12%) with high confidence. Pattern indicates clear planning instability requiring immediate attention.',
        whatChanges: 'Planning stability measures reduce last-minute change pressure and rework cycles. Expected to shift 3 to 5pp of organization from High to Medium risk segment.',
        riskIfNoAction: 'Potential escalation pattern: continued planning instability may increase High segment share by 4 to 6pp over next 4 weeks.',
        confidenceNote: 'High confidence based on 85% coverage and 67% participation. Signal consistency is strong.',
      },
      {
        action: 'Reduce context switching through workflow optimization',
        owner: 'Head of Delivery',
        timeframe: '2 weeks',
        impact: 'Expected risk shift (model-based): 2 to 4pp',
        column: 'Now',
        why: 'Addresses observed context switching increase (+9%) with high confidence. Pattern indicates structural fragmentation requiring workflow intervention.',
        whatChanges: 'Workflow optimization reduces context switching frequency and meeting density. Expected to shift 2 to 4pp from High to Medium risk segment.',
        riskIfNoAction: 'Potential escalation pattern: continued fragmentation may increase High segment share by 3 to 4pp over next 4 weeks.',
        confidenceNote: 'High confidence based on 85% coverage. Signal consistency is strong across meeting structure streams.',
      },
      {
        action: 'Deploy early intervention protocols for high-risk segments',
        owner: 'HRD',
        timeframe: '1 week',
        impact: 'Expected volatility reduction: 2 to 4pp',
        column: 'Next',
        why: 'High-risk segments show sustained elevation. Early intervention protocols enable targeted support before patterns compound.',
        whatChanges: 'Early intervention protocols provide targeted support to high-risk segments. Expected to reduce volatility by 2 to 4pp through proactive measures.',
        riskIfNoAction: 'Potential escalation pattern: high-risk segments may continue to elevate, increasing overall High segment share by 3 to 5pp.',
        confidenceNote: 'High confidence based on 85% coverage and 67% participation. Early intervention protocols are well-supported by data.',
      },
      {
        action: 'Monitor focus block protection signals in delivery teams',
        owner: 'Head of Delivery',
        timeframe: 'Ongoing',
        impact: 'Expected volatility monitoring: 1 to 2pp',
        column: 'Monitor',
        why: 'Focus block erosion patterns observed with medium confidence. Monitoring enables early detection of changes in focus block protection.',
        whatChanges: 'Ongoing monitoring provides early detection capability for focus block erosion. No immediate intervention required, but continued observation supports decision readiness.',
        riskIfNoAction: 'Expected continued monitoring: focus block patterns may remain elevated without intervention, maintaining current risk distribution.',
        confidenceNote: 'Medium confidence based on 85% coverage. Monitoring supports decision readiness despite moderate signal consistency.',
      },
    ],
  },
};

// KPI tooltip content mapping with thresholds and definitions
function getKpiTooltipContent(kpi: KpiData): React.ReactNode {
  const kpiInfo: Record<string, { definition: string; threshold: string; whyHigh?: string }> = {
    'Sustainability Risk': {
      definition: 'Share of organization in High risk segment based on aggregated team-level patterns.',
      threshold: 'High when > 15%. Elevated when trending up 2+ weeks.',
      whyHigh: kpi.value > 15 ? 'Current value exceeds 15% threshold, indicating elevated organizational risk.' : undefined,
    },
    'Absence pressure': {
      definition: 'Relative vs baseline absence (baseline 2.8%), measured from aggregated HRIS signals.',
      threshold: 'High when > 8% above baseline or trending up 2+ weeks.',
      whyHigh: kpi.value > 8 ? 'Current value exceeds 8% threshold, indicating elevated absence pressure.' : undefined,
    },
    'Fragmentation': {
      definition: 'Context switching vs 4-week average, measured from Stream 1 (meeting structure).',
      threshold: 'High when > 5% above 4-week average or trending up 2+ weeks.',
      whyHigh: kpi.value > 5 ? 'Context switching exceeds 4-week average by more than 5%, indicating fragmentation.' : undefined,
    },
    'Instability': {
      definition: 'Last-minute change pressure vs 4-week average, measured from Stream 2 (instability signals).',
      threshold: 'High when > 8% above 4-week average or trending up 2+ weeks.',
      whyHigh: kpi.value > 8 ? 'Last-minute changes exceed 4-week average, indicating planning instability.' : undefined,
    },
    'Participation': {
      definition: 'Share of eligible teams contributing data this week.',
      threshold: 'High when > 65%. Low when < 50%.',
      whyHigh: kpi.value < 50 ? 'Participation below 50% threshold, reducing signal reliability.' : undefined,
    },
    'Coverage': {
      definition: 'Data coverage across streams. Reflects completeness of signal inputs.',
      threshold: 'High when > 80%. Medium when 60-80%. Low when < 60%.',
      whyHigh: kpi.value < 60 ? 'Coverage below 60% threshold, indicating data gaps.' : undefined,
    },
  };

  const info = kpiInfo[kpi.label] || {
    definition: kpi.definition || kpi.tooltip,
    threshold: kpi.threshold || 'Threshold varies by context.',
    whyHigh: kpi.whyHigh,
  };

  return (
    <>
      <p className="mb-2">{info.definition}</p>
      <p className="text-white/80 text-xs mb-2">Threshold: {info.threshold}</p>
      {info.whyHigh && (
        <p className="text-white/90 text-xs mt-2 pt-2 border-t border-white/10">{info.whyHigh}</p>
      )}
    </>
  );
}

// Driver-action mapping: which actions address which drivers
function getActionsForDriver(driverName: string, actions: Action[]): Action[] {
  return actions.filter((action) => 
    action.triggeredBy?.some(driver => 
      driverName.toLowerCase().includes(driver.toLowerCase()) || 
      driver.toLowerCase().includes(driverName.toLowerCase())
    )
  );
}

// Apply filter offsets to base data
function applyFilters(
  data: DashboardData,
  department: Department,
  location: Location,
  roleType: RoleType
): DashboardData {
  // Small, believable offsets based on filters
  let multiplier = 1;
  if (department !== 'All departments') multiplier += 0.05;
  if (location !== 'All locations') multiplier += 0.03;
  if (roleType !== 'All roles') multiplier += 0.02;

  return {
    ...data,
    kpis: data.kpis.map((kpi) => ({
      ...kpi,
      value: Math.round(kpi.value * multiplier),
      count: kpi.count ? Math.round(kpi.count * multiplier) : undefined,
    })),
    riskDistribution: {
      low: {
        percent: Math.round(data.riskDistribution.low.percent * (1 / multiplier)),
        count: Math.round(data.riskDistribution.low.count * (1 / multiplier)),
      },
      medium: {
        percent: Math.round(data.riskDistribution.medium.percent * multiplier),
        count: Math.round(data.riskDistribution.medium.count * multiplier),
      },
      high: {
        percent: Math.round(data.riskDistribution.high.percent * multiplier),
        count: Math.round(data.riskDistribution.high.count * multiplier),
      },
    },
    teams: data.teams.map((team, idx) => ({
      ...team,
      highRiskShare: Math.round(team.highRiskShare * (1 + idx * 0.02 * multiplier)),
      highRiskCount: Math.round(team.highRiskCount * (1 + idx * 0.02 * multiplier)),
      timeSeries: team.timeSeries.map((value) => Math.round(value * (1 + idx * 0.02 * multiplier))),
    })),
  };
}

// Components
function ConfidenceChip({ confidence }: { confidence: Confidence }) {
  const style = SEVERITY_STYLES[confidence];

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${style.pillClass} ${style.borderClass}`}>
      {confidence}
    </span>
  );
}

// Info icon component - inline SVG
function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function Tooltip({ content, children }: { content: string; children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<'above' | 'below'>('above');
  const timeoutRef = useRef<NodeJS.Timeout>();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 100);
  };

  const handleFocus = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleBlur = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 100);
  };

  useEffect(() => {
    if (!isOpen || !containerRef.current || !tooltipRef.current) return;
    
    // CRITICAL: Disable scroll/resize listeners on mobile to prevent crashes
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return () => {}; // Return empty cleanup to satisfy React
    }

    const updatePosition = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      const tooltipRect = tooltipRef.current?.getBoundingClientRect();
      if (!rect || !tooltipRect) return;

      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;
      const tooltipHeight = tooltipRect.height + 8;

      if (spaceAbove < tooltipHeight && spaceBelow > spaceAbove) {
        setPosition('below');
      } else {
        setPosition('above');
      }
    };

    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative inline-flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
      {isOpen && (
        <div
          ref={tooltipRef}
          className={`absolute left-1/2 -translate-x-1/2 z-50 max-w-xs p-3 rounded-lg shadow-xl text-sm leading-relaxed pointer-events-none bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 text-gray-900 dark:text-white ${
            position === 'above' ? 'bottom-full mb-2' : 'top-full mt-2'
          }`}
        >
          {content}
          <div
            className={`absolute left-1/2 -translate-x-1/2 w-2 h-2 bg-white/60 dark:bg-neutral-900/40 border-r border-b border-gray-200/50 dark:border-white/10 transform rotate-45 ${
              position === 'above' ? 'top-full -mt-px' : 'bottom-full -mb-px'
            }`}
          />
        </div>
      )}
    </div>
  );
}

interface TooltipState {
  isOpen: boolean;
  position: { x: number; y: number } | null;
  kpiLabel: string;
  kpi?: KpiData;
}

function KpiCard({ 
  kpi,
  onTooltipChange,
  deltaView
}: { 
  kpi: KpiData;
  onTooltipChange: (state: TooltipState) => void;
  deltaView: 'WoW' | 'vs 4w' | 'QTD';
}) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const iconRef = useRef<HTMLButtonElement>(null);

  const updateTooltipState = (open: boolean) => {
    setIsTooltipOpen(open);
    
    if (open && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      // Position tooltip centered below icon
      let x = rect.left + rect.width / 2;
      let y = rect.bottom + 8; // mt-2 = 8px
      
      // Clamp to viewport (tooltip width is 256px = 64 * 4)
      const tooltipWidth = 256;
      const padding = 16;
      x = Math.max(padding + tooltipWidth / 2, Math.min(x, window.innerWidth - padding - tooltipWidth / 2));
      
      onTooltipChange({ isOpen: true, position: { x, y }, kpiLabel: kpi.label, kpi });
    } else {
      onTooltipChange({ isOpen: false, position: null, kpiLabel: kpi.label, kpi });
    }
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    updateTooltipState(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      updateTooltipState(false);
    }, 100);
  };

  const handleFocus = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    updateTooltipState(true);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Only hide if focus is moving outside
    const relatedTarget = e.relatedTarget as Node | null;
    if (relatedTarget && iconRef.current?.parentElement?.contains(relatedTarget)) {
      return;
    }
    timeoutRef.current = setTimeout(() => {
      updateTooltipState(false);
    }, 100);
  };

  // Update position on scroll/resize when tooltip is open - disabled on mobile
  useEffect(() => {
    if (!isTooltipOpen) return;
    
    // CRITICAL: Disable scroll/resize listeners on mobile to prevent crashes
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return () => {}; // Return empty cleanup to satisfy React
    }

    const updatePosition = () => {
      if (iconRef.current) {
        const rect = iconRef.current.getBoundingClientRect();
        let x = rect.left + rect.width / 2;
        let y = rect.bottom + 8;
        
        // Clamp to viewport
        const tooltipWidth = 256;
        const padding = 16;
        x = Math.max(padding + tooltipWidth / 2, Math.min(x, window.innerWidth - padding - tooltipWidth / 2));
        
        onTooltipChange({ isOpen: true, position: { x, y }, kpiLabel: kpi.label, kpi });
      }
    };

    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isTooltipOpen, kpi.label, onTooltipChange]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="group relative bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl rounded-xl border border-gray-200/50 dark:border-white/10 p-4 transition-all duration-200 hover:border-gray-300/50 dark:hover:border-white/15 hover:bg-white/80 dark:hover:bg-neutral-900/50 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex flex-col items-center mb-3">
        <div className="mb-2">
          <ConfidenceChip confidence={kpi.confidence} />
        </div>
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-medium text-gray-500 dark:text-white/50 uppercase tracking-wider text-center">
            {kpi.label}
          </p>
          <div 
            className="relative inline-flex"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              ref={iconRef}
              type="button"
              onFocus={handleFocus}
              onBlur={handleBlur}
              className="flex-shrink-0"
              aria-label="More info"
            >
              <InfoIcon className="w-3.5 h-3.5 text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/60 cursor-help transition-colors" />
            </button>
          </div>
        </div>
      </div>
      <div className="mb-2">
        <p className="text-2xl font-semibold text-gray-900 dark:text-white text-center">
          {kpi.value}%
        </p>
        {kpi.count !== undefined && kpi.total !== undefined && (
          <p className="text-xs text-gray-600 dark:text-white/60 mt-1 text-center">
            High segment: {kpi.count} people
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-white/60 justify-center">
        {deltaView === 'WoW' && (
          <span>WoW: {kpi.wowDelta >= 0 ? '+' : ''}{kpi.wowDelta}pp</span>
        )}
        {deltaView === 'vs 4w' && (
          <span>vs 4w: {kpi.vs4WeekDelta >= 0 ? '+' : ''}{kpi.vs4WeekDelta}pp</span>
        )}
        {deltaView === 'QTD' && (
          <span>QTD: {kpi.qtdDelta >= 0 ? '+' : ''}{kpi.qtdDelta}pp</span>
        )}
      </div>
    </div>
  );
}

function Dropdown({
  options,
  value,
  onChange,
  label,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl rounded-lg border border-gray-200/50 dark:border-white/10 text-sm font-medium text-gray-900 dark:text-white hover:bg-white/80 dark:hover:bg-neutral-900/60 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-transparent flex items-center gap-2"
      >
        <span>{value}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 z-50 min-w-full bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl rounded-lg border border-gray-200/50 dark:border-white/10 shadow-lg overflow-hidden">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm text-gray-900 dark:text-white hover:bg-white/80 dark:hover:bg-neutral-900/60 transition-colors ${
                value === option ? 'bg-blue-50 dark:bg-blue-900/20' : ''
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface TeamLineChartProps {
  teams: Team[];
  selectedWeek: Week;
}

function TeamLineChart({ teams, selectedWeek }: TeamLineChartProps) {
  const [hoveredPoint, setHoveredPoint] = useState<{ weekIndex: number; teamIndex: number } | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Map week to index: Week 48 = 0, Week 49 = 1, Week 50 = 2
  const weekIndexMap: Record<Week, number> = {
    'Week 48': 0,
    'Week 49': 1,
    'Week 50': 2,
  };
  const currentWeekIndex = weekIndexMap[selectedWeek];

  // Generate week labels (8 weeks ending at selected week)
  const weekLabels: string[] = [];
  for (let i = 7; i >= 0; i--) {
    const weekNum = 48 + currentWeekIndex - 7 + i;
    weekLabels.push(`W${weekNum}`);
  }

  // Chart dimensions
  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 400;
  const height = 200;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Find min and max values for scaling
  const allValues = teams.flatMap((team) => team.timeSeries);
  const minValue = Math.max(0, Math.min(...allValues) - 2);
  const maxValue = Math.min(100, Math.max(...allValues) + 2);
  const valueRange = maxValue - minValue;

  // Helper to map value to y position
  const valueToY = (value: number) => {
    return padding.top + chartHeight - ((value - minValue) / valueRange) * chartHeight;
  };

  // Helper to map week index to x position
  const weekToX = (weekIdx: number) => {
    return padding.left + (weekIdx / (weekLabels.length - 1)) * chartWidth;
  };

  // Team colors - using centralized TEAM_SERIES
  const teamColors = [
    { color: TEAM_SERIES.A.color }, // Team A
    { color: TEAM_SERIES.B.color }, // Team B
    { color: TEAM_SERIES.C.color }, // Team C
  ];

  // Generate path data for each team
  const generatePath = (series: number[]): string => {
    return series
      .map((value, idx) => {
        const x = weekToX(idx);
        const y = valueToY(value);
        return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
      })
      .join(' ');
  };

  // Handle mouse move to find nearest point
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || !containerRef.current) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - svgRect.left;
    const y = e.clientY - svgRect.top;

    let nearestWeekIdx = 0;
    let nearestTeamIdx = 0;
    let minDistance = Infinity;

    // Find nearest point across all teams and weeks
    for (let weekIdx = 0; weekIdx < weekLabels.length; weekIdx++) {
      const weekX = weekToX(weekIdx);
      for (let teamIdx = 0; teamIdx < teams.length; teamIdx++) {
        const valueY = valueToY(teams[teamIdx].timeSeries[weekIdx]);
        const distance = Math.sqrt(Math.pow(x - weekX, 2) + Math.pow(y - valueY, 2));
        if (distance < minDistance) {
          minDistance = distance;
          nearestWeekIdx = weekIdx;
          nearestTeamIdx = teamIdx;
        }
      }
    }

    // Calculate tooltip position relative to container
    const tooltipX = e.clientX - containerRect.left;
    const tooltipY = e.clientY - containerRect.top;

    setHoveredPoint({ weekIndex: nearestWeekIdx, teamIndex: nearestTeamIdx });
    setTooltipPos({ x: tooltipX, y: tooltipY });
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
    setTooltipPos(null);
  };

  // Calculate WoW delta for tooltip
  const getWowDelta = (series: number[], weekIdx: number): number | null => {
    if (weekIdx === 0) return null;
    return series[weekIdx] - series[weekIdx - 1];
  };

  return (
    <div ref={containerRef} className="relative">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-48"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Faint horizontal guide lines */}
        {[minValue, (minValue + maxValue) / 2, maxValue].map((value, idx) => (
          <line
            key={idx}
            x1={padding.left}
            y1={valueToY(value)}
            x2={width - padding.right}
            y2={valueToY(value)}
            stroke="currentColor"
            strokeWidth="0.5"
            className="text-gray-300/30 dark:text-white/10"
          />
        ))}

        {/* Draw lines for each team */}
        {teams.map((team, teamIdx) => {
          const pathData = generatePath(team.timeSeries);
          const isHovered = hoveredPoint?.teamIndex === teamIdx;
          const color = teamColors[teamIdx % teamColors.length];

          return (
            <g key={teamIdx}>
              <path
                d={pathData}
                fill="none"
                stroke={color.color}
                strokeWidth={isHovered ? 2.5 : 1.5}
                className="transition-all duration-200"
                opacity={hoveredPoint && !isHovered ? 0.4 : 0.8}
              />
              {/* Points - only show on hover for the hovered team */}
              {hoveredPoint?.weekIndex !== undefined && isHovered && (
                <circle
                  cx={weekToX(hoveredPoint.weekIndex)}
                  cy={valueToY(team.timeSeries[hoveredPoint.weekIndex])}
                  r={4}
                  fill={color.color}
                  stroke={color.color}
                  strokeWidth={1}
                  className="transition-all duration-200"
                />
              )}
            </g>
          );
        })}

        {/* Hovered point indicator */}
        {hoveredPoint && (
          <line
            x1={weekToX(hoveredPoint.weekIndex)}
            y1={padding.top}
            x2={weekToX(hoveredPoint.weekIndex)}
            y2={height - padding.bottom}
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4,4"
            className="text-gray-400/50 dark:text-white/20"
          />
        )}
      </svg>

      {/* Team legend */}
      <div className="flex items-center justify-center gap-4 mt-3 text-xs">
        {teams.map((team, idx) => {
          const color = teamColors[idx % teamColors.length];
          const isHovered = hoveredPoint?.teamIndex === idx;
          return (
            <div
              key={idx}
              className="flex items-center gap-1.5"
              style={{
                opacity: hoveredPoint && !isHovered ? 0.4 : 1,
              }}
            >
              <div
                className="w-3 h-0.5"
                style={{
                  backgroundColor: color.color,
                }}
              />
              <span className="text-gray-600 dark:text-white/70">{team.name}</span>
            </div>
          );
        })}
      </div>

      {/* Tooltip */}
      {hoveredPoint && tooltipPos && containerRef.current && (
        (() => {
          const containerRect = containerRef.current.getBoundingClientRect();
          const tooltipWidth = 224; // w-56 = 14rem = 224px
          const tooltipMaxHeight = 160; // max-h-40 = 10rem = 160px
          const padding = 12;
          
          // Calculate initial position (centered on hover point)
          let tooltipX = tooltipPos.x - tooltipWidth / 2;
          let tooltipY = tooltipPos.y - tooltipMaxHeight - 8;
          
          // Clamp X position within container bounds
          tooltipX = Math.max(
            padding,
            Math.min(tooltipX, containerRect.width - tooltipWidth - padding)
          );
          
          // Clamp Y position within container bounds
          if (tooltipY < padding) {
            tooltipY = tooltipPos.y + 8; // Show below if not enough space above
          }
          tooltipY = Math.max(
            padding,
            Math.min(tooltipY, containerRect.height - tooltipMaxHeight - padding)
          );
          
          return (
            <div
              className="absolute z-50 w-56 max-h-40 overflow-auto p-3 rounded-lg shadow-xl text-sm leading-relaxed pointer-events-none bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl border border-gray-200/50 dark:border-white/10 text-gray-900 dark:text-white"
              style={{
                left: `${tooltipX}px`,
                top: `${tooltipY}px`,
              }}
            >
              <div className="font-medium mb-2">{weekLabels[hoveredPoint.weekIndex]}</div>
              {teams.map((team, teamIdx) => {
                const value = team.timeSeries[hoveredPoint.weekIndex];
                const wowDelta = getWowDelta(team.timeSeries, hoveredPoint.weekIndex);
                const color = teamColors[teamIdx % teamColors.length];
                const isHighlighted = hoveredPoint.teamIndex === teamIdx;
                return (
                  <div
                    key={teamIdx}
                    className="flex items-center gap-2 mb-1 last:mb-0"
                    style={{ opacity: isHighlighted ? 1 : 0.7 }}
                  >
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: color.color }}
                    />
                    <span className={isHighlighted ? 'font-medium' : ''}>
                      {team.name}: {value}%
                    </span>
                    {wowDelta !== null && (
                      <span className="text-gray-600 dark:text-white/60">
                        ({wowDelta >= 0 ? '+' : ''}{wowDelta}pp WoW)
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })()
      )}
    </div>
  );
}

function RiskDistributionChart({ data }: { data: RiskDistribution }) {
  const [hoveredSegment, setHoveredSegment] = useState<'low' | 'medium' | 'high' | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const total = data.low.percent + data.medium.percent + data.high.percent;
  const lowWidth = (data.low.percent / total) * 100;
  const mediumWidth = (data.medium.percent / total) * 100;
  const highWidth = (data.high.percent / total) * 100;

  const handleMouseMove = (e: React.MouseEvent<SVGElement>, segment: 'low' | 'medium' | 'high') => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top - 30,
      text: `${segment === 'low' ? 'Low' : segment === 'medium' ? 'Medium' : 'High'}: ${data[segment].percent}% (${data[segment].count} people)`,
    });
  };

  const handleMouseLeave = () => {
    setHoveredSegment(null);
    setTooltip(null);
  };

  const colors = {
    low: RISK_COLORS.Low,
    medium: RISK_COLORS.Medium,
    high: RISK_COLORS.High,
  };

  return (
    <div className="relative">
      <svg
        ref={svgRef}
        viewBox="0 0 300 40"
        className="w-full h-10"
        onMouseLeave={handleMouseLeave}
      >
        {/* Low segment */}
        <rect
          x="0"
          y="10"
          width={lowWidth * 3}
          height="20"
          rx="4"
          fill={colors.low}
          className="transition-all duration-200"
          style={{ opacity: hoveredSegment === 'low' ? 1 : 0.85 }}
          onMouseEnter={() => setHoveredSegment('low')}
          onMouseMove={(e) => handleMouseMove(e, 'low')}
        />
        {/* Medium segment */}
        <rect
          x={lowWidth * 3}
          y="10"
          width={mediumWidth * 3}
          height="20"
          rx="4"
          fill={colors.medium}
          className="transition-all duration-200"
          style={{ opacity: hoveredSegment === 'medium' ? 1 : 0.85 }}
          onMouseEnter={() => setHoveredSegment('medium')}
          onMouseMove={(e) => handleMouseMove(e, 'medium')}
        />
        {/* High segment */}
        <rect
          x={(lowWidth + mediumWidth) * 3}
          y="10"
          width={highWidth * 3}
          height="20"
          rx="4"
          fill={colors.high}
          className="transition-all duration-200"
          style={{ opacity: hoveredSegment === 'high' ? 1 : 0.85 }}
          onMouseEnter={() => setHoveredSegment('high')}
          onMouseMove={(e) => handleMouseMove(e, 'high')}
        />
      </svg>
      {tooltip && (
        <div
          className="absolute z-50 px-2 py-1 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl rounded text-xs text-gray-900 dark:text-white border border-gray-200/50 dark:border-white/10 shadow-lg pointer-events-none"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: 'translateX(-50%)',
          }}
        >
          {tooltip.text}
        </div>
      )}
      <div className="flex items-center justify-between mt-2 text-xs text-gray-600 dark:text-white/70">
        <span>Low: {data.low.percent}%</span>
        <span>Medium: {data.medium.percent}%</span>
        <span>High: {data.high.percent}%</span>
      </div>
      <div className="border-t border-gray-200/30 dark:border-white/10 mt-4 pt-3">
        <p className="text-gray-600 dark:text-white/60 text-sm leading-relaxed">
          Distribution reflects aggregated team-level signals for the selected filters. Percentages sum to 100.
        </p>
      </div>
    </div>
  );
}

function ActionDetailsModal({
  action,
  isOpen,
  onClose,
}: {
  action: Action | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !action) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="relative bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col m-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">Action Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 rounded"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="overflow-y-auto flex-1 p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 uppercase tracking-wider">
                Action
              </h4>
              <p className="text-xs sm:text-sm text-gray-900 dark:text-white break-words">{action.action}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 uppercase tracking-wider">
                Why this action
              </h4>
              <p className="text-sm text-gray-600 dark:text-white/70 leading-relaxed">{action.why}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 uppercase tracking-wider">
                What it changes
              </h4>
              <p className="text-sm text-gray-600 dark:text-white/70 leading-relaxed">{action.whatChanges}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 uppercase tracking-wider">
                When to do it
              </h4>
              <p className="text-sm text-gray-600 dark:text-white/70">{action.timeframe}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 uppercase tracking-wider">
                Risk if no action
              </h4>
              <p className="text-sm text-gray-600 dark:text-white/70 leading-relaxed">{action.riskIfNoAction}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 uppercase tracking-wider">
                Confidence note
              </h4>
              <p className="text-sm text-gray-600 dark:text-white/70 leading-relaxed">{action.confidenceNote}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function TeamDrilldown({
  team: teamData,
  isOpen,
  onClose,
  data: dashboardData,
}: {
  team: Team | null;
  isOpen: boolean;
  onClose: () => void;
  data: DashboardData;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen || !teamData) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
      />
      <div
        className={`fixed right-0 top-0 bottom-0 w-full max-w-lg bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl border-l border-gray-200/50 dark:border-white/10 shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full overflow-y-auto">
          <div className="sticky top-0 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{teamData.name}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 rounded"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
            <div>
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 uppercase tracking-wider">
                System summary
              </h4>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-white/70 leading-relaxed">
                {teamData.name} shows elevated risk indicators with {teamData.highRiskShare}% of team members in the High segment. Primary driver is {teamData.primaryDriver.toLowerCase()}, with a {teamData.trendWow >= 0 ? '+' : ''}{teamData.trendWow}pp change week-over-week. Confidence level is {teamData.confidence.toLowerCase()}.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                Key signals
              </h4>
              <ul className="space-y-2">
                {dashboardData.drivers.map((driver, idx) => (
                  <li key={idx} className="text-sm text-gray-600 dark:text-white/70 flex items-start">
                    <span className="text-gray-400 dark:text-white/40 mr-2">•</span>
                    <div className="flex-1">
                      <span>{driver.name}</span>
                      <span className="ml-2">{driver.delta}</span>
                      <ConfidenceChip confidence={driver.confidence} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                Suggested actions
              </h4>
              <ul className="space-y-2">
                {dashboardData.actions
                  .filter((action) => action.column === 'Now' || action.column === 'Next')
                  .map((action, idx) => (
                    <li key={idx} className="text-sm text-gray-600 dark:text-white/70 flex items-start">
                      <span className="text-gray-400 dark:text-white/40 mr-2">•</span>
                      <div className="flex-1">
                        <span>{action.action}</span>
                        <span className="ml-2 text-xs text-gray-500 dark:text-white/50">
                          ({action.owner})
                        </span>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="pt-4 border-t border-gray-200/30 dark:border-white/10">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 uppercase tracking-wider">
                Data notes
              </h4>
              <ul className="text-xs text-gray-600 dark:text-white/70 space-y-1">
                <li>• WoW: previous calendar week (Monday to Sunday)</li>
                <li>• Coverage: {dashboardData.kpis.find((k) => k.label === 'Coverage')?.value}%</li>
                <li>• Participation: {dashboardData.kpis.find((k) => k.label === 'Participation')?.value}%</li>
              </ul>
            </div>
            <div className="pt-4 border-t border-gray-200/30 dark:border-white/10">
              <p className="text-xs text-gray-500 dark:text-white/50 italic">
                Aggregated signals. No individual scoring. Not a medical product.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function CfoDashboardDemo() {
  const [selectedWeek, setSelectedWeek] = useState<Week>('Week 50');
  const [department, setDepartment] = useState<Department>('All departments');
  const [location, setLocation] = useState<Location>('All locations');
  const [roleType, setRoleType] = useState<RoleType>('All roles');
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [isDrilldownOpen, setIsDrilldownOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const [isActionDetailsOpen, setIsActionDetailsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [tooltipState, setTooltipState] = useState<TooltipState>({ isOpen: false, position: null, kpiLabel: '' });
  const [deltaView, setDeltaView] = useState<'WoW' | 'vs 4w' | 'QTD'>('WoW');
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState(false);

  const currentData = applyFilters(baseData[selectedWeek], department, location, roleType);

  const handleWeekChange = (week: string) => {
    if (week === selectedWeek) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedWeek(week as Week);
      setIsTransitioning(false);
    }, 150);
  };

  const handleTeamClick = (team: Team) => {
    setSelectedTeam(team);
    setIsDrilldownOpen(true);
  };

  const handleActionDetailsClick = (action: Action) => {
    setSelectedAction(action);
    setIsActionDetailsOpen(true);
  };

  const handleScrollToReports = () => {
    const element = document.getElementById('weekly-cfo-report');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Extract week number from "Week 48" format
  const weekNumber = parseInt(selectedWeek.replace('Week ', ''), 10);
  const currentInterventions = interventionsByWeek[weekNumber] || [];

  const handleNavigateToChatbot = () => {
    // Dispatch custom event to trigger assistant with Week 50 question
    const prompt = `Explain Week ${weekNumber} and recommended next steps.`;
    window.dispatchEvent(new CustomEvent('corqon:assistantAsk', { 
      detail: { week: weekNumber, prompt } 
    }));
  };

  const handleInterventionClick = (intervention: Intervention) => {
    setSelectedIntervention(intervention);
    setIsInterventionModalOpen(true);
  };

  // Handle escape key for intervention modal
  useEffect(() => {
    if (!isInterventionModalOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsInterventionModalOpen(false);
        setSelectedIntervention(null);
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isInterventionModalOpen]);


  const statusColors = STATUS_COLORS;

  return (
    <div className="w-full overflow-x-hidden">
      {/* Device-like Frame */}
      <div className="relative rounded-xl sm:rounded-2xl md:rounded-[2rem] lg:rounded-[2.5rem] p-2 sm:p-3 md:p-4 lg:p-6 xl:p-8 shadow-[0_20px_60px_-12px_rgba(0,0,0,0.25)] dashboard-frame-gradient">
        <div
          className="relative rounded-xl sm:rounded-2xl lg:rounded-3xl overflow-hidden shadow-inner"
          style={{ backgroundColor: '#0A0D14' }}
        >
          <div className="bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl rounded-lg sm:rounded-xl lg:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8">
            {/* Dashboard Header */}
            <div className="mb-4 sm:mb-5 md:mb-6 pb-3 sm:pb-4 border-b border-gray-200/30 dark:border-white/10">
              {/* Grid layout: Reports | Title (centered) | Controls */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 mb-3 sm:mb-4 items-center">
                {/* Left: Reports button */}
                <div className="lg:justify-start flex justify-center lg:order-1 order-3">
                  <button
                    onClick={handleScrollToReports}
                    className="px-3 sm:px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white text-xs sm:text-sm font-medium rounded-lg hover:bg-blue-700 dark:hover:bg-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-transparent min-h-[44px]"
                  >
                    Reports
                  </button>
                </div>
                {/* Center: Title and subtitle */}
                <div className="text-center lg:order-2 order-1">
                  <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-1">
                    Analytical Overview
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-white/70">
                    System-level signals for decision support
                  </p>
                </div>
                {/* Right: Controls */}
                <div className="flex flex-wrap items-center justify-center lg:justify-end gap-2 sm:gap-3 lg:order-3 order-2">
                  <Dropdown
                    options={['Week 48', 'Week 49', 'Week 50']}
                    value={selectedWeek}
                    onChange={handleWeekChange}
                  />
                  <Dropdown
                    options={['All departments', 'Department A', 'Department B', 'Department C']}
                    value={department}
                    onChange={(v) => setDepartment(v as Department)}
                  />
                  <Dropdown
                    options={['All locations', 'Remote-first', 'Office-first']}
                    value={location}
                    onChange={(v) => setLocation(v as Location)}
                  />
                  <Dropdown
                    options={['All roles', 'Knowledge work', 'Ops']}
                    value={roleType}
                    onChange={(v) => setRoleType(v as RoleType)}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <p className="text-xs sm:text-sm text-gray-600 dark:text-white/70 break-words">
                  <span className="font-medium text-gray-900 dark:text-white">Decision focus: </span>
                  {currentData.decisionFocus}
                </p>
                <span className={`text-xs sm:text-sm font-medium ${statusColors[currentData.status]} whitespace-nowrap`}>
                  Status: {currentData.status}
                </span>
              </div>
              {/* Data Context */}
              <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200/20 dark:border-white/5 flex items-center gap-2 sm:gap-4 text-xs text-gray-500 dark:text-white/50 flex-wrap">
                <span>
                  Cohort: {currentData.cohortSize || 500} employees, {currentData.teamCount || 8} teams
                </span>
                <span>•</span>
                <span>Updated: {currentData.lastUpdated || '2 days ago'}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <span>Coverage: {currentData.coverage || 85}%</span>
                  <Tooltip content="Data coverage reflects completeness of signal inputs across all streams. Higher coverage indicates more reliable insights.">
                    <InfoIcon className="w-3 h-3 text-gray-400 dark:text-white/40 cursor-help" />
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Monday Plan Widget */}
            <MondayPlanWidget week={selectedWeek} />

            {/* KPI Strip */}
            <div className="mb-4 sm:mb-5 md:mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                  Key Indicators
                </h3>
                <div className="flex items-center gap-1 bg-white/40 dark:bg-white/5 rounded-lg p-1 border border-gray-200/30 dark:border-white/10 w-full sm:w-auto">
                  {(['WoW', 'vs 4w', 'QTD'] as const).map((view) => (
                    <button
                      key={view}
                      onClick={() => setDeltaView(view)}
                      className={`flex-1 sm:flex-none px-2 sm:px-2.5 py-1.5 sm:py-1 text-xs font-medium rounded transition-colors min-h-[44px] sm:min-h-0 flex items-center justify-center ${
                        deltaView === view
                          ? 'bg-white dark:bg-white/10 text-gray-900 dark:text-white shadow-sm'
                          : 'text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white'
                      }`}
                    >
                      {view}
                    </button>
                  ))}
                </div>
              </div>
              <div
                className={`relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 transition-opacity duration-200 ${
                  isTransitioning ? 'opacity-50' : 'opacity-100'
                }`}
              >
                {currentData.kpis.map((kpi, idx) => (
                  <KpiCard 
                    key={idx} 
                    kpi={kpi}
                    onTooltipChange={setTooltipState}
                    deltaView={deltaView}
                  />
                ))}
              </div>
            </div>

            {/* Main Content Grid */}
            <div className={`space-y-4 sm:space-y-5 md:space-y-6 transition-opacity duration-200 ${
              isTransitioning ? 'opacity-50' : 'opacity-100'
            }`}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
                {/* Risk Distribution Chart */}
                <div className="lg:col-span-1 bg-white/5 dark:bg-neutral-900/60 backdrop-blur-xl rounded-xl border border-gray-200/20 dark:border-white/10 p-4 sm:p-5 md:p-6">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider">
                    Risk distribution
                  </h3>
                  <RiskDistributionChart data={currentData.riskDistribution} />
                </div>

                {/* Top Drivers */}
                <div className="lg:col-span-1 bg-white/5 dark:bg-neutral-900/60 backdrop-blur-xl rounded-xl border border-gray-200/20 dark:border-white/10 p-4 sm:p-5 md:p-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 uppercase tracking-wider">
                    Top drivers
                  </h3>
                  <ul className="space-y-3">
                    {currentData.drivers.map((driver, idx) => {
                      const relatedActions = getActionsForDriver(driver.name, currentData.actions);
                      return (
                        <li
                          key={idx}
                          className="group flex items-start justify-between p-3 rounded-lg border border-transparent hover:bg-white/5 dark:hover:bg-white/5 transition-all"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {driver.name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-white/60 mt-1">{driver.delta}</p>
                            {relatedActions.length > 0 && (
                              <p className="text-xs text-gray-500 dark:text-white/50 mt-1">
                                {relatedActions.length} {relatedActions.length === 1 ? 'action' : 'actions'}
                              </p>
                            )}
                          </div>
                          <ConfidenceChip confidence={driver.confidence} />
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Top Risk Teams */}
                <div className="lg:col-span-1 bg-white/5 dark:bg-neutral-900/60 backdrop-blur-xl rounded-xl border border-gray-200/20 dark:border-white/10 p-4 sm:p-5 md:p-6">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 uppercase tracking-wider">
                    Top risk teams
                  </h3>
                  <TeamLineChart teams={currentData.teams} selectedWeek={selectedWeek} />
                </div>
              </div>

              {/* Intervention Tracker */}
              <div className="bg-white/5 dark:bg-neutral-900/60 backdrop-blur-xl rounded-xl border border-gray-200/20 dark:border-white/10 p-4 sm:p-5 md:p-6">
                <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 dark:text-white/50 uppercase tracking-wider mb-1">Execution</p>
                    <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">
                      Intervention Tracker
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-white/60 mt-1">
                      Track what was initiated this week and whether signals are improving
                    </p>
                  </div>
                  <button
                    onClick={handleNavigateToChatbot}
                    className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 focus:ring-offset-2 focus:ring-offset-transparent min-h-[44px] w-full sm:w-auto whitespace-nowrap"
                  >
                    Brief {selectedWeek} with CORQON AI
                  </button>
                </div>
                {currentInterventions.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-sm text-gray-600 dark:text-white/70 mb-2">
                      No interventions tracked for this week yet.
                    </p>
                    <p className="text-xs text-gray-500 dark:text-white/50">
                      Start with Monday plan actions to begin tracking.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {currentInterventions.map((intervention) => {
                      const statusStyles = {
                        Planned: 'bg-gray-500/20 text-gray-700 dark:text-gray-400',
                        'In progress': 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
                        Done: 'bg-green-500/20 text-green-700 dark:text-green-400',
                      };
                      const signalStyles = {
                        Improving: 'bg-green-500/20 text-green-700 dark:text-green-400',
                        Stable: 'bg-gray-500/20 text-gray-700 dark:text-gray-400',
                        Worsening: 'bg-red-500/20 text-red-700 dark:text-red-400',
                      };

                      return (
                        <div
                          key={intervention.id}
                          onClick={() => handleInterventionClick(intervention)}
                          className="group p-3 sm:p-4 bg-white/40 dark:bg-white/5 rounded-lg border border-gray-200/30 dark:border-white/10 hover:bg-white/60 dark:hover:bg-white/10 transition-all cursor-pointer min-h-[44px]"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-6 gap-2 sm:gap-3 items-center">
                            <div className="md:col-span-2">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                {intervention.title}
                              </h4>
                              {intervention.relatedDrivers && intervention.relatedDrivers.length > 0 && (
                                <p className="text-xs text-gray-500 dark:text-white/50">
                                  {intervention.relatedDrivers.slice(0, 2).join(', ')}
                                </p>
                              )}
                            </div>
                            <div>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[intervention.status]}`}>
                                {intervention.owner}
                              </span>
                            </div>
                            <div>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[intervention.status]}`}>
                                {intervention.status}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 dark:text-white/60">
                              {intervention.due}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500 dark:text-white/50">
                                {intervention.expectedImpact}
                              </span>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${signalStyles[intervention.earlySignal]}`}>
                                {intervention.earlySignal}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="mt-4 sm:mt-5 md:mt-6 pt-3 sm:pt-4 border-t border-gray-200/30 dark:border-white/10">
              <p className="text-xs text-gray-500 dark:text-white/50 text-center">
                Privacy-safe aggregation. No individual scoring. Not a medical product.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Drilldown Slide-over */}
      <TeamDrilldown
        team={selectedTeam}
        isOpen={isDrilldownOpen}
        onClose={() => {
          setIsDrilldownOpen(false);
          setSelectedTeam(null);
        }}
        data={currentData}
      />

      {/* Action Details Modal */}
      <ActionDetailsModal
        action={selectedAction}
        isOpen={isActionDetailsOpen}
        onClose={() => {
          setIsActionDetailsOpen(false);
          setSelectedAction(null);
        }}
      />

      {/* Intervention Details Modal */}
      {isInterventionModalOpen && selectedIntervention && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => {
              setIsInterventionModalOpen(false);
              setSelectedIntervention(null);
            }}
            aria-hidden="true"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className="relative bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl rounded-2xl border border-gray-200/50 dark:border-white/10 max-w-lg w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col pointer-events-auto m-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white/60 dark:bg-neutral-900/40 backdrop-blur-xl border-b border-gray-200/50 dark:border-white/10 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between z-10">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white break-words pr-2">
                  {selectedIntervention.title}
                </h3>
                <button
                  onClick={() => {
                    setIsInterventionModalOpen(false);
                    setSelectedIntervention(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 rounded"
                  aria-label="Close modal"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="overflow-y-auto flex-1 p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    selectedIntervention.status === 'Planned' ? 'bg-gray-500/20 text-gray-700 dark:text-gray-400' :
                    selectedIntervention.status === 'In progress' ? 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400' :
                    'bg-green-500/20 text-green-700 dark:text-green-400'
                  }`}>
                    {selectedIntervention.status}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-700 dark:text-gray-400">
                    {selectedIntervention.owner}
                  </span>
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-700 dark:text-gray-400">
                    Due: {selectedIntervention.due}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    selectedIntervention.earlySignal === 'Improving' ? 'bg-green-500/20 text-green-700 dark:text-green-400' :
                    selectedIntervention.earlySignal === 'Stable' ? 'bg-gray-500/20 text-gray-700 dark:text-gray-400' :
                    'bg-red-500/20 text-red-700 dark:text-red-400'
                  }`}>
                    {selectedIntervention.earlySignal}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 uppercase tracking-wider">
                    Expected impact
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-white/70">
                    {selectedIntervention.expectedImpact}
                  </p>
                </div>
                {selectedIntervention.relatedDrivers && selectedIntervention.relatedDrivers.length > 0 && (
                  <div>
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 uppercase tracking-wider">
                      Related drivers
                    </h4>
                    <ul className="space-y-1">
                      {selectedIntervention.relatedDrivers.map((driver, idx) => (
                        <li key={idx} className="text-xs sm:text-sm text-gray-600 dark:text-white/70 flex items-start">
                          <span className="text-gray-400 dark:text-white/40 mr-2 mt-0.5">•</span>
                          <span className="break-words">{driver}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="pt-3 sm:pt-4 border-t border-gray-200/30 dark:border-white/10">
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white mb-2 uppercase tracking-wider">
                    What to check next week
                  </h4>
                  <ul className="space-y-2">
                    <li className="text-xs sm:text-sm text-gray-600 dark:text-white/70 flex items-start">
                      <span className="text-gray-400 dark:text-white/40 mr-2 mt-0.5">•</span>
                      <span className="break-words">Monitor early signal trends for {selectedIntervention.earlySignal.toLowerCase()} pattern</span>
                    </li>
                    <li className="text-xs sm:text-sm text-gray-600 dark:text-white/70 flex items-start">
                      <span className="text-gray-400 dark:text-white/40 mr-2 mt-0.5">•</span>
                      <span className="break-words">Review expected impact metrics against actual outcomes</span>
                    </li>
                    <li className="text-xs sm:text-sm text-gray-600 dark:text-white/70 flex items-start">
                      <span className="text-gray-400 dark:text-white/40 mr-2 mt-0.5">•</span>
                      <span className="break-words">Assess whether intervention requires escalation or adjustment</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* KPI Tooltip Layer - Fixed position to escape overflow containers */}
      {tooltipState.isOpen && tooltipState.position && (
        <div
          className="fixed z-[999]"
          style={{
            left: `${tooltipState.position.x}px`,
            top: `${tooltipState.position.y}px`,
            transform: 'translate(-50%, 0)',
          }}
          onMouseEnter={() => {
            // Keep tooltip open when hovering over it
            setTooltipState(prev => prev.isOpen ? prev : { ...prev, isOpen: true });
          }}
          onMouseLeave={() => {
            setTooltipState(prev => ({ ...prev, isOpen: false }));
          }}
        >
          <div className="w-64 max-w-[260px] px-3 py-2 rounded-lg shadow-xl text-sm leading-relaxed bg-[#0B0F17] border border-white/10 text-white/85 break-words">
            {tooltipState.kpi && getKpiTooltipContent(tooltipState.kpi)}
          </div>
        </div>
      )}
    </div>
  );
}
