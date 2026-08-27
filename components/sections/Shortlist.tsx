import { shortlist } from '@/content/shortlist'

/**
 * The public 2026 shortlist, grouped by category.
 *
 * Shortlisted businesses only — no scores, no winner, no highly commended.
 * Winners are revealed on the night. See docs/CONFIDENTIAL.md.
 *
 * Category sizes vary, so entries flow in a wrapping row rather than a
 * fixed grid that would imply a set count.
 */
export default function Shortlist() {
  return (
    <section
      id="shortlist"
      aria-labelledby="shortlist-heading"
      className="section-py"
      style={{ background: 'linear-gradient(160deg, #f8faff 0%, #eef3fb 50%, #f5f8ff 100%)' }}
    >
      <div className="container-wide">

        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="section-label">The 2026 Shortlist</span>
          <h2 id="shortlist-heading" className="section-title mb-5">
            Congratulations to Our
            <span
              className="block"
              style={{
                background: 'linear-gradient(135deg, #28c8ff, #00aee6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Shortlisted Businesses
            </span>
          </h2>
          <p className="section-body">
            Independently judged, three judges per entry, scored on merit alone.
            Winners are revealed at the black-tie awards dinner on 10 September 2026.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-12">
          {shortlist.map(({ category, entries }) => (
            <div key={category}>
              <div className="mb-5">
                <h3 className="font-bold text-navy-900 text-lg md:text-xl tracking-tight">
                  {category}
                </h3>
                <div className="gold-divider mt-3" aria-hidden="true" />
              </div>

              <ul className="flex flex-wrap gap-4" aria-label={`${category} shortlist`}>
                {entries.map(({ company, contact }) => (
                  <li
                    key={`${company}-${contact ?? ''}`}
                    className="card px-6 py-4 hover:border-sky-200 transition-all duration-200
                               grow sm:grow-0 sm:min-w-[260px]"
                    style={{ borderBottom: '2px solid rgba(40,200,255,0.15)' }}
                  >
                    <div className="font-semibold text-navy-900 text-sm">{company}</div>
                    {contact && (
                      <div className="text-gray-500 text-xs mt-1">{contact}</div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-14">
          Winners are announced on the night. Nobody knows the results in advance,
          including the shortlisted businesses.
        </p>
      </div>
    </section>
  )
}
