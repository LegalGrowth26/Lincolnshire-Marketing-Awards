import Link from 'next/link'

const sponsors = {
  headline: null, // TBC
  category: [
    { name: 'Category Sponsor', tier: 'category', placeholder: true },
    { name: 'Category Sponsor', tier: 'category', placeholder: true },
    { name: 'Category Sponsor', tier: 'category', placeholder: true },
    { name: 'Category Sponsor', tier: 'category', placeholder: true },
    { name: 'Category Sponsor', tier: 'category', placeholder: true },
    { name: 'Category Sponsor', tier: 'category', placeholder: true },
  ],
  supporting: [
    { name: 'Supporting Sponsor', tier: 'supporting', placeholder: true },
    { name: 'Supporting Sponsor', tier: 'supporting', placeholder: true },
    { name: 'Supporting Sponsor', tier: 'supporting', placeholder: true },
  ],
}

function PlaceholderLogo({ size = 'md' }: { size?: 'lg' | 'md' | 'sm' }) {
  const sizeClasses = {
    lg: 'h-20 w-52',
    md: 'h-14 w-36',
    sm: 'h-12 w-28',
  }
  return (
    <div
      className={`${sizeClasses[size]} bg-gray-100 border-2 border-dashed border-gray-200 rounded-sm
                  flex items-center justify-center text-gray-400 text-xs font-medium`}
      aria-label="Sponsor logo — to be announced"
    >
      Your Logo Here
    </div>
  )
}

export default function Sponsors() {
  return (
    <section id="sponsors" aria-labelledby="sponsors-heading" className="section-py bg-white">
      <div className="container-wide">

        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="section-label">Our Sponsors</span>
          <h2 id="sponsors-heading" className="section-title mb-5">
            Thank You to Our Sponsors
          </h2>
          <p className="section-body">
            The Lincolnshire Marketing Awards is made possible by the generous support of our
            sponsors — Lincolnshire businesses who believe in recognising excellence.
          </p>
        </div>

        {/* Headline sponsor */}
        <div className="mb-12">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
            Headline Sponsor
          </p>
          <div className="flex items-center justify-center">
            {sponsors.headline ? (
              <div className="h-24 w-64 bg-gray-100 rounded-sm flex items-center justify-center">
                {/* Actual logo */}
              </div>
            ) : (
              <div className="bg-gold-50 border-2 border-dashed border-gold-200 rounded-sm
                              px-16 py-8 text-center max-w-sm">
                <div className="text-gold-500 text-2xl mb-2" aria-hidden="true">★</div>
                <p className="text-navy-900 font-bold text-sm mb-1">Headline Sponsor</p>
                <p className="text-gray-500 text-xs">
                  Premium visibility across all award materials
                </p>
                <Link
                  href="/sponsorship"
                  className="inline-block mt-4 text-gold-600 hover:text-gold-500 text-xs font-semibold underline"
                >
                  Enquire about headline sponsorship →
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Category sponsors */}
        <div className="mb-10">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
            Category Sponsors
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-center justify-items-center">
            {sponsors.category.map((sponsor, idx) => (
              <div key={idx} className="text-center">
                <PlaceholderLogo size="md" />
              </div>
            ))}
          </div>
        </div>

        {/* Supporting sponsors */}
        <div className="mb-14">
          <p className="text-center text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
            Supporting Sponsors
          </p>
          <div className="flex flex-wrap gap-6 items-center justify-center">
            {sponsors.supporting.map((sponsor, idx) => (
              <PlaceholderLogo key={idx} size="sm" />
            ))}
          </div>
        </div>

        {/* Sponsor CTA */}
        <div className="bg-navy-900 rounded-sm p-8 md:p-12 relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,168,76,0.07) 1px, transparent 0)',
              backgroundSize: '28px 28px',
            }}
          />
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="section-label">Become a Sponsor</span>
              <h3 className="section-title-white mb-4">
                Align Your Brand With Excellence
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Sponsoring the Lincolnshire Marketing Awards places your brand at the heart of the
                county&apos;s most credible business recognition event. Reach 200+ business leaders,
                gain category naming rights, and demonstrate your commitment to Lincolnshire&apos;s
                business community.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-4 md:justify-end">
              <Link href="/sponsorship" className="btn-gold-lg text-center">
                View Sponsorship Packages
              </Link>
              <a
                href="mailto:hello@lincolnshiremarketing.co.uk"
                className="btn-outline-white text-center"
              >
                Enquire Now
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
