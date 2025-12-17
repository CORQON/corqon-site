import Link from 'next/link';

export default function TermsPage() {
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

        <h1 className="text-4xl sm:text-5xl font-semibold text-white mb-4">Terms of Service</h1>
        <p className="text-white/50 text-sm mb-12">Last updated: December 17, 2025</p>

        <div className="space-y-10 text-white/70 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Agreement to Terms</h2>
            <p>
              By accessing or using the CORQON platform, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Description of Service</h2>
            <p>
              CORQON provides an AI-driven platform that analyzes organizational data to deliver insights 
              about employee vitality, focus, and work performance. Our service uses privacy-safe aggregation 
              methods to generate actionable recommendations for organizational improvement.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Account Responsibilities</h2>
            <p className="mb-4">
              When you create an account with CORQON, you are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Maintaining the security of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Ensuring that your use of the service complies with applicable laws</li>
              <li>Providing accurate and complete information</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Acceptable Use</h2>
            <p className="mb-4">
              You agree to use CORQON only for lawful purposes. You may not:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Use the service to harm, harass, or discriminate against individuals</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Use the service in any way that violates applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Privacy and Data Protection</h2>
            <p>
              Your use of CORQON is subject to our Privacy Policy, which explains how we collect, use, 
              and protect your data. We employ privacy-safe aggregation methods and do not create individual 
              employee profiles or scores.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Intellectual Property</h2>
            <p>
              The CORQON platform, including all software, algorithms, designs, and content, is protected 
              by intellectual property rights. You are granted a limited, non-exclusive license to use the 
              service as intended. All rights not expressly granted are reserved.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Disclaimer</h2>
            <p>
              CORQON is a business intelligence and analytics platform. It is not a medical product and 
              does not provide medical advice, diagnosis, or treatment. The insights provided are for 
              organizational improvement purposes only. Use of the service is at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, CORQON shall not be liable for any indirect, 
              incidental, special, consequential, or punitive damages arising from your use of the service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Termination</h2>
            <p>
              We reserve the right to suspend or terminate your access to CORQON at any time, with or 
              without cause or notice, if we believe you have violated these Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Changes to Terms</h2>
            <p>
              We may modify these Terms of Service at any time. We will notify you of material changes 
              by posting the updated terms on this page and updating the "Last updated" date. Your 
              continued use of the service after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
            <p>
              If you have questions about these Terms of Service, please contact us:
            </p>
            <p className="mt-4">
              <a 
                href="mailto:info@corqon.com" 
                className="text-white/90 hover:text-white transition-colors underline"
              >
                info@corqon.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

