import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 sm:py-24">
        <Link 
          href="/" 
          className="inline-flex items-center text-sm text-white/60 hover:text-white/90 transition-colors mb-8"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to home
        </Link>

        <h1 className="text-4xl sm:text-5xl font-semibold text-white mb-4">Privacy Policy</h1>
        <p className="text-white/50 text-sm mb-12">Last updated: December 17, 2025</p>

        <div className="space-y-12 text-white/70 leading-relaxed">
          {/* Overview */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Overview</h2>
            <p className="mb-4">
              CORQON is committed to protecting your privacy. This Privacy Policy explains how we collect, use, 
              and safeguard information when you use our platform.
            </p>
            <p>
              We prioritize privacy-safe, aggregated data analysis that respects individual privacy while 
              providing valuable organizational insights. Our platform is built on the principle that effective 
              leadership insights do not require individual tracking.
            </p>
          </section>

          {/* What Corqon Measures */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">What Corqon measures (system-level)</h2>
            <p className="mb-4">
              CORQON collects and processes organizational data to provide actionable insights about system-level 
              patterns including workload, fragmentation, planning stability, and team vitality.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Meeting density and context switching patterns at team level</li>
              <li>Planning stability and disruption signals across organizational units</li>
              <li>Aggregated energy direction trends (team-level only, fully anonymized)</li>
              <li>HR friction signals from existing HRIS systems (validation layer)</li>
            </ul>
            <p className="text-sm italic">
              All signals are system-level. We do not track, score, or profile individual employees.
            </p>
          </section>

          {/* Aggregation and Privacy */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Aggregation and privacy</h2>
            <p className="mb-4">
              Our platform is designed with privacy at its core:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li><strong className="text-white">Team-level aggregation:</strong> Insights are computed at team level to protect individual privacy</li>
              <li><strong className="text-white">No individual scoring:</strong> We avoid employee-level scoring and keep signals system-first</li>
              <li><strong className="text-white">Data minimization:</strong> Only what is required for decision support, nothing extra</li>
              <li><strong className="text-white">Minimum group sizes:</strong> Privacy thresholds ensure anonymity (typically team size ≥ 10)</li>
              <li><strong className="text-white">No PII exposure:</strong> Personal identifiable information is never exposed in reports or dashboards</li>
            </ul>
          </section>

          {/* Access and Retention */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Access and retention</h2>
            <p className="mb-4">
              <strong className="text-white">Access controls:</strong> Role-based access patterns, designed for leadership use. 
              Access is restricted to authorized personnel within your organization based on roles you define.
            </p>
            <p className="mb-4">
              <strong className="text-white">Retention controls:</strong> Clear retention and deletion rules, available for review. 
              We retain data only as long as necessary to provide the service and meet legal obligations.
            </p>
            <p className="mb-4">
              <strong className="text-white">Data security:</strong> We implement industry-standard security measures including 
              encryption in transit and at rest, access controls, and regular security audits.
            </p>
          </section>

          {/* GDPR and Compliance */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">GDPR and compliance considerations</h2>
            <p className="mb-4">
              CORQON aims to support GDPR-aligned data practices:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Data minimization principles applied throughout the platform</li>
              <li>Purpose limitation: data used only for organizational insights and decision support</li>
              <li>Privacy by design: aggregation and anonymization built into the core architecture</li>
              <li>Transparency: clear documentation of what we measure and how</li>
            </ul>
            <p className="text-sm italic">
              For detailed compliance documentation or Data Processing Agreements (DPA), please contact us during 
              procurement discussions.
            </p>
          </section>

          {/* Third-Party Services */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Third-party services</h2>
            <p>
              CORQON may use trusted third-party service providers to help deliver our services (e.g., cloud 
              infrastructure, analytics). These providers are contractually obligated to protect your data and 
              use it only for the purposes we specify.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Your rights</h2>
            <p className="mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
              <li>Access information about your organization's data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your organization's data</li>
              <li>Object to processing or request restriction</li>
              <li>Data portability where applicable</li>
            </ul>
            <p>
              For questions about your data or to exercise these rights, please contact us at the email 
              address below.
            </p>
          </section>

          {/* Not a Medical Product */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Not a medical product</h2>
            <p>
              CORQON is a business intelligence and analytics platform. It is not a medical product and 
              does not provide medical advice, diagnosis, or treatment. The insights provided are for 
              organizational improvement purposes only and should not be used for individual health assessments.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any material 
              changes by posting the new policy on this page and updating the "Last updated" date. 
              Continued use of the platform after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Contact us</h2>
            <p className="mb-4">
              If you have questions about this Privacy Policy, our privacy practices, or need procurement 
              documentation (security overviews, DPAs, compliance materials), please contact us:
            </p>
            <div className="bg-white/5 border border-white/10 rounded-lg p-6">
              <p className="mb-2">
                <strong className="text-white">Email:</strong>{' '}
                <a 
                  href="mailto:info@corqon.com" 
                  className="text-blue-400 hover:text-blue-300 transition-colors underline"
                >
                  info@corqon.com
                </a>
              </p>
              <p className="text-sm text-white/50 mt-4">
                For procurement inquiries, please include "Procurement" or "Security Documentation" in your subject line 
                for faster routing.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
