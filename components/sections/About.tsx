const stats = [
  { value: '15',   label: 'Award Categories' },
  { value: 'Free', label: 'To Enter' },
  { value: '3',    label: 'Judges Per Entry' },
  { value: '3rd',  label: 'Annual Event' },
]

export default function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="section-py"
      style={{ background: 'linear-gradient(160deg, #f8faff 0%, #eef3fb 50%, #f5f8ff 100%)' }}
    >
      <div className="container-wide">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — text */}
          <div>
            <span className="section-label">About the Awards</span>
            <h2 id="about-heading" className="section-title mb-6">
              Celebrating the Best in<br />
              <span
                className="text-sky-400"
                style={{
                  background: 'linear-gradient(135deg, #28c8ff, #00aee6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Lincolnshire Business
              </span>
            </h2>
            <div className="gold-divider mb-8" aria-hidden="true" />

            <div className="space-y-5 text-gray-500 leading-relaxed">
              <p>
                The Lincolnshire Marketing Awards is an annual celebration of outstanding business
                achievement across our county. Now in its third year, the awards recognise businesses
                of every size, from sole traders and start-ups to established employers and
                professional services firms, that have demonstrated genuine, measurable growth.
              </p>
              <p>
                Organised by <strong className="text-navy-900 font-semibold">Lincolnshire Marketing</strong>,
                these awards are open to <em>all</em> Lincolnshire businesses, not just those
                in marketing. With 15 categories spanning growth, leadership, people, community,
                and brand, there is an award for every ambitious business in the county.
              </p>
              <p>
                What makes them different? They&apos;re <strong className="text-navy-900 font-semibold">free to enter</strong>,
                rigorously <strong className="text-navy-900 font-semibold">independently judged</strong>,
                and focused entirely on substance over spectacle. Every entry is assessed purely
                on merit: three independent judges, no organiser influence, no exceptions.
              </p>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <a href="#enter" className="btn-gold">Enter the Awards</a>
              <a href="#categories" className="btn-outline-navy">View Categories</a>
            </div>
          </div>

          {/* Right — stat cards */}
          <div aria-label="Key award facts">
            <div className="grid grid-cols-2 gap-4">
              {stats.map(({ value, label }) => (
                <div
                  key={label}
                  className="card p-6 text-center group hover:border-sky-200 transition-all duration-200"
                  style={{ borderBottom: '2px solid rgba(40,200,255,0.15)' }}
                >
                  <div
                    className="text-3xl md:text-4xl font-bold mb-2 group-hover:scale-105 transition-transform duration-200"
                    style={{
                      background: 'linear-gradient(135deg, #28c8ff, #00aee6)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {value}
                  </div>
                  <div className="text-sm font-medium text-navy-900">{label}</div>
                </div>
              ))}
            </div>

            {/* Quote block */}
            <blockquote
              className="mt-6 rounded-sm p-6 relative overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, #040f2e 0%, #071d52 100%)',
                boxShadow: '0 0 40px rgba(40,200,255,0.08) inset',
              }}
            >
              <div
                aria-hidden="true"
                className="absolute top-0 left-0 w-1 h-full"
                style={{ background: 'linear-gradient(to bottom, #c9a84c, #28c8ff)' }}
              />
              <p className="text-gray-300 text-sm leading-relaxed italic pl-4">
                &ldquo;These awards exist to shine a light on the businesses that are quietly
                doing exceptional work across Lincolnshire, and to give them the recognition
                they deserve.&rdquo;
              </p>
              <footer className="mt-3 pl-4">
                <cite className="not-italic text-sky-400 text-xs font-semibold tracking-wide not-italic">
                  Tom Stansfield, Lincolnshire Marketing
                </cite>
              </footer>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  )
}
