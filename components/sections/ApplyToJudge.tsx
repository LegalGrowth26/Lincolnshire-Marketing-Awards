import Script from 'next/script'

const criteria = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
      </svg>
    ),
    title: 'Business Experience',
    body: 'You should have at least 3 years of commercial or professional experience relevant to business growth, marketing, or your specialist sector.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
      </svg>
    ),
    title: 'Impartiality',
    body: 'You must be able to judge all entries fairly. Any conflict of interest, personal or commercial, must be declared before judging begins.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Time Commitment',
    body: 'Judging takes place in August 2026. Expect to commit approximately 6–12 hours across your allocated categories.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
      </svg>
    ),
    title: 'Confidentiality',
    body: 'All entries are treated as strictly confidential. Judges must not disclose submission content to any third party.',
  },
]

const expectations = [
  'Complete a short online briefing before judging begins',
  'Sign and return a conflict of interest declaration',
  'Score entries using the provided judging criteria',
  'Submit scores by the agreed deadline in August',
  'Attend an optional judges\' recognition at the awards night',
]

export default function ApplyToJudge() {
  return (
    <section id="judge" aria-labelledby="judge-heading" className="section-py bg-white">
      <div className="container-wide">

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left — Info */}
          <div>
            <span className="section-label">Apply to Judge</span>
            <h2 id="judge-heading" className="section-title mb-6">
              Become a Judge in 2026
            </h2>
            <div className="gold-divider mb-8" aria-hidden="true" />

            <p className="text-gray-500 leading-relaxed mb-8">
              The quality of the Lincolnshire Marketing Awards depends on the quality of its judges.
              We&apos;re looking for experienced, credible business professionals who want to support
              and recognise the best in Lincolnshire business, and who can do so with complete
              impartiality.
            </p>

            {/* Criteria */}
            <h3 className="text-navy-900 font-bold text-sm uppercase tracking-wide mb-5">
              Judge Criteria
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {criteria.map(({ icon, title, body }) => (
                <div
                  key={title}
                  className="bg-gray-50 border border-gray-100 rounded-sm p-4"
                >
                  <div className="flex items-center gap-2 mb-2 text-navy-900">
                    {icon}
                    <h4 className="font-semibold text-sm">{title}</h4>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>

            {/* Expectations */}
            <h3 className="text-navy-900 font-bold text-sm uppercase tracking-wide mb-4">
              What to Expect
            </h3>
            <ul className="space-y-2.5 mb-8">
              {expectations.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-gray-500">
                  <svg
                    className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                  >
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <blockquote className="border-l-4 border-gold-500 pl-5 py-1">
              <p className="text-gray-600 text-sm italic leading-relaxed">
                &ldquo;Being a judge is a genuinely rewarding experience. You see the very best
                businesses in Lincolnshire up close, and you play a direct role in recognising
                their achievements.&rdquo;
              </p>
              <footer className="mt-2 text-gold-600 text-xs font-semibold">
                2025 Judging Panel Member
              </footer>
            </blockquote>
          </div>

          {/* Right — Form */}
          <div>
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-sm">
              <div className="bg-navy-900 px-6 py-4">
                <h3 className="text-white font-bold text-base">
                  Judge Application Form
                </h3>
                <p className="text-gray-400 text-xs mt-0.5">
                  Applications for 2026, reviewed on a rolling basis
                </p>
              </div>
              <div className="ghl-form-wrapper">
                <iframe
                  src="https://link.tomcrm.co.uk/widget/form/DfQrliVzVqp04kSpKbLU"
                  id="inline-DfQrliVzVqp04kSpKbLU"
                  data-form-id="DfQrliVzVqp04kSpKbLU"
                  title="Apply to Judge: Lincolnshire Marketing Awards 2026"
                  style={{ width: '100%', height: '720px', border: 'none', overflow: 'hidden' }}
                  scrolling="no"
                  loading="lazy"
                />
              </div>
            </div>
            <p className="text-gray-400 text-xs text-center mt-3">
              Questions?{' '}
              <a
                href="mailto:tom@lincolnshiremarketing.co.uk"
                className="text-gold-500 hover:text-gold-400 underline"
              >
                tom@lincolnshiremarketing.co.uk
              </a>
            </p>
          </div>
        </div>
      </div>
      <Script src="https://link.tomcrm.co.uk/js/form_embed.js" strategy="lazyOnload" />
    </section>
  )
}
