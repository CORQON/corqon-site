'use client';

import Link from 'next/link';

const trustCards = [
  {
    title: 'Team-level aggregation',
    description: 'Insights are computed at team level to protect individual privacy.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
  },
  {
    title: 'No individual scoring',
    description: 'We avoid employee-level scoring and keep signals system-first.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
  },
  {
    title: 'Data minimization',
    description: 'Only what is required for decision support, nothing extra.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: 'Access controls',
    description: 'Role-based access patterns, designed for leadership use.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  },
  {
    title: 'Retention controls',
    description: 'Clear retention and deletion rules, available for review.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Documentation',
    description: 'Privacy policy and procurement materials on request.',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
];

export default function PrivacyComplianceSection() {
  return (
    <section id="privacy" className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 corqon-section scroll-mt-28">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
        {/* Left Column - Text Content */}
        <div className="lg:col-span-5 space-y-4 sm:space-y-5 md:space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <span className="text-xs font-medium text-white/70 uppercase tracking-wider">
              Privacy and compliance
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white leading-tight">
            Privacy-safe by design.
          </h2>

          {/* Body */}
          <p className="text-sm sm:text-base text-white/70 leading-relaxed">
            Corqon provides system-level signals for leadership without individual tracking. Built to support procurement and GDPR alignment with clear controls and documentation.
          </p>

          {/* Trust Chips */}
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/60">
              GDPR-aligned
            </span>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/60">
              DPA available
            </span>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/60">
              Team-level only
            </span>
            <span className="text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-white/60">
              No individual scoring
            </span>
          </div>

          {/* CTA Button */}
          <div className="space-y-3">
            <Link 
              href="/privacy"
              className="inline-block px-5 py-2.5 bg-blue-600 dark:bg-blue-500 text-white rounded-full font-medium hover:bg-blue-700 dark:hover:bg-blue-400 transition-all text-sm shadow-lg hover:shadow-xl"
            >
              See full Privacy Policy
            </Link>
            
            {/* Helper Text */}
            <p className="text-xs text-white/45">
              Need a security overview? Ask during procurement.
            </p>

            {/* Secondary Procurement Link */}
            <a 
              href="mailto:info@corqon.com?subject=Security%20overview%20request"
              className="mt-2 inline-flex text-xs text-white/55 hover:text-white/80 transition"
            >
              Request security overview
            </a>
          </div>
        </div>

        {/* Right Column - Trust Cards Grid */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {trustCards.map((card, index) => (
              <div
                key={index}
                className="group relative bg-neutral-900/40 backdrop-blur-xl rounded-xl border border-white/10 p-4 sm:p-5 hover:border-white/15 hover:bg-neutral-900/50 transition-all duration-300 hover:-translate-y-0.5"
              >
                {/* Icon */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 text-white/70 group-hover:text-white/90 transition-colors">
                    {card.icon}
                  </div>
                  <h3 className="text-base font-semibold text-white leading-tight">
                    {card.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-sm text-white/60 leading-relaxed">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

