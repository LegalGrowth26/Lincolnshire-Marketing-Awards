const reasons = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    title: 'Zero Cost to Enter',
    body: 'Entry is entirely free. No membership fees, no submission charges. The awards exist to recognise genuine achievement, not to be a revenue stream.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    title: 'Win Lasting Credibility',
    body: 'Being shortlisted or winning is a permanent, verifiable mark of excellence. Past winners and finalists use their status in pitches, proposals, and marketing for years.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0" />
      </svg>
    ),
    title: 'Build Trust With Clients',
    body: 'An independent award tells prospective clients something you could never say yourself: that your business has been assessed and found to be among the best in Lincolnshire.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0116.5 7.605" />
      </svg>
    ),
    title: 'Raise Your Profile Across Lincolnshire',
    body: 'All shortlisted businesses are featured across our social media, email, and PR activity. The exposure reaches thousands of Lincolnshire business professionals.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    title: 'Recognise Your People',
    body: 'Being shortlisted is a powerful motivator for the team behind your results. It gives your people something concrete to be proud of, and to share.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    title: 'Connect With the Best in the County',
    body: 'The awards dinner brings together Lincolnshire\'s most ambitious businesses. The connections made around those tables are as valuable as the recognition itself.',
  },
]

export default function WhyEnter() {
  return (
    <section id="why-enter" aria-labelledby="why-enter-heading" className="section-py bg-gray-50">
      <div className="container-wide">

        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="section-label">Why Enter</span>
          <h2 id="why-enter-heading" className="section-title mb-5">
            Why Your Business Should Enter
          </h2>
          <p className="section-body">
            Entry is free. The return in credibility, profile, and recognition can be
            transformational. Here is what being shortlisted or winning can do for your business.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reasons.map(({ icon, title, body }) => (
            <div
              key={title}
              className="card p-7 group hover:border-sky-200 transition-all duration-200"
            >
              <div
                className="w-12 h-12 rounded-sm bg-sky-50 flex items-center justify-center
                            text-sky-500 mb-5 group-hover:bg-sky-400 group-hover:text-navy-950
                            transition-all duration-200"
                aria-hidden="true"
              >
                {icon}
              </div>
              <h3 className="font-bold text-navy-900 mb-2 text-base">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a href="#enter" className="btn-gold-lg">
            Submit Your Free Entry
          </a>
          <p className="text-sm text-gray-400 mt-3">
            Maximum 3 category entries per business &nbsp;·&nbsp; Entry deadline late July 2026
          </p>
        </div>
      </div>
    </section>
  )
}
