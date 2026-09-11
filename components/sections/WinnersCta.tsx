/**
 * Closing call to action — the 2026 results are out. Reuses the deep navy
 * gradient panel treatment used across the site.
 */
export default function WinnersCta() {
  return (
    <section
      id="winners-cta"
      aria-labelledby="winners-cta-heading"
      className="section-py"
      style={{ background: 'linear-gradient(160deg, #f5f8ff 0%, #eef3fb 100%)' }}
    >
      <div className="container-wide">
        <div
          className="rounded-sm p-8 md:p-14 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, #040f2e 0%, #071d52 40%, #0a2d6e 100%)',
            boxShadow: '0 0 60px rgba(40,200,255,0.06) inset',
          }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 600px 300px at 50% 0%, rgba(40,200,255,0.07) 0%, transparent 70%)',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,168,76,0.08) 1px, transparent 0)',
              backgroundSize: '30px 30px',
            }}
          />
          <div className="relative z-10">
            <span className="section-label">The Results</span>
            <h2 id="winners-cta-heading" className="section-title-white mb-4">
              The 2026 Winners
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-8 leading-relaxed">
              The winners were revealed at the black-tie awards dinner on 10 September 2026
              at the DoubleTree by Hilton, Lincoln — along with photographs from the night.
            </p>
            <a href="/winners/2026" className="btn-gold-lg">
              View the 2026 Winners
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
