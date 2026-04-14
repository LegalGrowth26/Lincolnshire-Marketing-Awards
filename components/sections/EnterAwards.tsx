import Script from 'next/script'

const uploadGuidance = [
  'Supporting evidence in PDF or image format (max 10MB per file)',
  'Financial figures or growth charts (anonymised where needed)',
  'Customer testimonials or case studies',
  'Team photos, campaign screenshots, or media coverage',
  'Any relevant certificates, accreditations, or awards',
]

export default function EnterAwards() {
  return (
    <section id="enter" aria-labelledby="enter-heading" className="section-py bg-navy-900 relative overflow-hidden">
      {/* Background pattern */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,168,76,0.07) 1px, transparent 0)',
          backgroundSize: '30px 30px',
        }}
      />

      <div className="container-wide relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left — Info */}
          <div>
            <span className="section-label">Enter the Awards</span>
            <h2 id="enter-heading" className="section-title-white mb-6">
              Enter the 2026 Awards
            </h2>
            <div className="w-12 h-0.5 bg-sky-400 mb-8" aria-hidden="true" />

            <div className="space-y-5 text-gray-300 leading-relaxed mb-8">
              <p>
                Entry is completely free. Select your category, complete the submission form,
                and give the judges a clear, evidence-backed picture of what your business
                has achieved.
              </p>
              <p>
                Entries close <strong className="text-white">late July 2026</strong>.
                You may enter up to <strong className="text-white">3 categories</strong>. Each
                requires a separate submission tailored to that category&apos;s criteria.
              </p>
              <p>
                The strongest entries are specific, structured, and evidence-led. Use the tips
                below to give your submission the best possible chance of making the shortlist.
              </p>
            </div>

            {/* Tips */}
            <div className="bg-navy-800/60 border border-navy-700 rounded-sm p-6 mb-8">
              <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-sky-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M10 1a6 6 0 00-3.815 10.631C7.237 12.5 8 13.723 8 15h4c0-1.277.763-2.5 1.815-3.369A6 6 0 0010 1zm0 14a1 1 0 00-1 1v1a1 1 0 002 0v-1a1 1 0 00-1-1z" />
                </svg>
                Entry Writing Tips
              </h3>
              <ul className="space-y-2.5">
                {[
                  'Be specific: use numbers, percentages, and dates where possible',
                  'Focus on the past 12 months of activity',
                  'Explain what you did differently, not just what you achieved',
                  'Include the challenge you faced and how you overcame it',
                  'Keep your submission clear, structured, and evidence-backed',
                ].map((tip) => (
                  <li key={tip} className="flex items-start gap-2 text-sm text-gray-400">
                    <svg className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                    </svg>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            {/* Upload guidance */}
            <div>
              <h3 className="text-white font-semibold text-sm mb-3">Supporting Documents</h3>
              <p className="text-gray-400 text-sm mb-3">
                You can upload supporting evidence with your entry. Accepted formats:
              </p>
              <ul className="space-y-2">
                {uploadGuidance.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-400">
                    <svg className="w-3.5 h-3.5 text-sky-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
                      <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right — Embedded Form */}
          <div>
            <div className="bg-white rounded-sm overflow-hidden shadow-2xl">
              <div className="bg-sky-400 px-6 py-4">
                <h3 className="text-navy-900 font-bold text-base">
                  Enter the Lincolnshire Marketing Awards 2026
                </h3>
                <p className="text-navy-800 text-xs mt-0.5 font-medium">
                  Free to enter · Closes late July 2026
                </p>
              </div>
              <div className="ghl-form-wrapper">
                <iframe
                  src="https://link.tomcrm.co.uk/widget/form/V1nrLpBn5eXpl6EDCZdA"
                  id="inline-V1nrLpBn5eXpl6EDCZdA"
                  data-form-id="V1nrLpBn5eXpl6EDCZdA"
                  title="Enter the Lincolnshire Marketing Awards 2026"
                  style={{ width: '100%', height: '800px', border: 'none', overflow: 'hidden' }}
                />
              </div>
            </div>
            <p className="text-gray-500 text-xs text-center mt-3">
              Having trouble? Email{' '}
              <a
                href="mailto:tom@lincolnshiremarketing.co.uk"
                className="text-sky-400 hover:text-sky-300 underline"
              >
                tom@lincolnshiremarketing.co.uk
              </a>
            </p>
          </div>
        </div>
      </div>
      <Script src="https://link.tomcrm.co.uk/js/form_embed.js" strategy="afterInteractive" />
    </section>
  )
}
