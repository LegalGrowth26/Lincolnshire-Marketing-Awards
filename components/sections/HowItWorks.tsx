const steps = [
  {
    num: '01',
    title: 'Check Your Eligibility',
    body: 'Review the 15 award categories and identify which best fit your business achievements over the past year. You can enter up to 3 categories.',
    note: 'Takes 5 minutes',
  },
  {
    num: '02',
    title: 'Prepare Your Entry',
    body: 'Write a compelling submission of up to 1,000 words, backed by evidence: figures, testimonials, case studies. Show, don\'t just tell.',
    note: 'Written submission + supporting docs',
  },
  {
    num: '03',
    title: 'Submit Before the Deadline',
    body: 'Submit your entry via the online form before the late July 2026 deadline. You\'ll receive confirmation and a unique reference number.',
    note: 'Deadline: Late July 2026',
  },
  {
    num: '04',
    title: 'Independent Judging',
    body: 'Three independent judges assess every submission in your category. Scores are averaged. Organisers have no influence over results.',
    note: 'August 2026',
  },
  {
    num: '05',
    title: 'Shortlist Announced',
    body: 'Shortlisted finalists are notified privately first, then announced publicly. All finalists receive promotional assets to share.',
    note: 'Late August 2026',
  },
  {
    num: '06',
    title: 'Awards Night',
    body: 'Join us for a prestigious black-tie dinner. Winners are revealed on the night. Celebrate with Lincolnshire\'s best businesses.',
    note: 'September 2026 · Black Tie',
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-it-works-heading"
      className="section-py bg-navy-900 relative"
      style={{
        backgroundImage: "url('/images/bg-how-it-works.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Dark overlay over photo */}
      <div className="absolute inset-0 bg-navy-950/82" aria-hidden="true" />
      <div className="container-wide relative z-10">

        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <span className="section-label">The Process</span>
          <h2 id="how-it-works-heading" className="section-title-white mb-5">
            How It Works
          </h2>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            From entry to awards night in six simple steps. The process is designed to be
            straightforward, fair, and friction-free.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map(({ num, title, body, note }) => (
            <div
              key={num}
              className="relative bg-navy-800/60 border border-navy-700 rounded-sm p-7
                         hover:border-sky-400/40 transition-all duration-200 group"
            >
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-sky-400/0
                              group-hover:bg-sky-400/60 transition-all duration-200 rounded-t-sm" />

              {/* Step number */}
              <div className="text-5xl font-bold text-sky-400/20 leading-none mb-4 select-none"
                   aria-hidden="true">
                {num}
              </div>

              <h3 className="text-white font-semibold text-base mb-3">{title}</h3>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">{body}</p>

              {/* Note badge */}
              <div className="inline-flex items-center gap-1.5 bg-navy-900/60 border border-navy-600
                              rounded-sm px-3 py-1">
                <svg className="w-3 h-3 text-sky-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                </svg>
                <span className="text-sky-300 text-xs font-medium">{note}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="#enter" className="btn-gold-lg">
            Start Your Entry
          </a>
        </div>
      </div>
    </section>
  )
}
