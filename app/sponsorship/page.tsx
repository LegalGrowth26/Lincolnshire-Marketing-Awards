import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Sponsorship',
  description:
    'Sponsor the Lincolnshire Marketing Awards 2026. Reach 200+ Lincolnshire business leaders and align your brand with excellence. View sponsorship packages and enquire.',
}

const packages = [
  {
    tier: 'Headline Sponsor',
    price: 'From £3,500',
    highlight: true,
    description: 'The ultimate brand platform. Maximum visibility across all award materials, media, and the awards night itself.',
    benefits: [
      'Prominent logo placement on all event materials, signage, and stage',
      'Named in all press releases, social media, and email communications',
      'Full-page advertisement in the awards programme',
      'Opportunity to present an award on the night',
      'Table of 10 at the awards dinner',
      'Banner on the awards website — homepage placement',
      'Mentions in all pre-event marketing campaigns',
      'First right of refusal for 2027 headline sponsorship',
      'Post-event media coverage inclusion',
    ],
    cta: 'Enquire About Headline Sponsorship',
  },
  {
    tier: 'Category Sponsor',
    price: 'From £750',
    highlight: false,
    description: 'Own a specific award category. Your brand is associated with the winner and finalists throughout the entire award process.',
    benefits: [
      'Category named after your business (e.g. "Business Growth Award — sponsored by [Brand]")',
      'Logo on award category materials and event signage',
      'Opportunity to present the category award on the night',
      'Social media feature when category finalists are announced',
      'Logo in the awards programme',
      '2 complimentary seats at the awards dinner',
      'Website listing as category sponsor',
    ],
    cta: 'Enquire About Category Sponsorship',
  },
  {
    tier: 'Reception Sponsor',
    price: 'From £1,500',
    highlight: false,
    description: 'Sponsor the drinks reception. Maximum brand exposure as all guests arrive and network before the ceremony.',
    benefits: [
      'Brand prominently displayed during the drinks reception',
      'Named as reception sponsor in all event communications',
      'Opportunity to address guests during the reception',
      '4 complimentary seats at the awards dinner',
      'Logo in the awards programme',
      'Social media feature',
      'Website listing as reception sponsor',
    ],
    cta: 'Enquire About Reception Sponsorship',
  },
  {
    tier: 'Programme Sponsor',
    price: 'From £500',
    highlight: false,
    description: 'Brand your business across the awards programme — read by every guest on the night.',
    benefits: [
      'Full or half-page advertisement in the awards programme',
      'Logo listing as programme sponsor',
      'Website listing as supporting sponsor',
      '2 complimentary seats at the awards dinner',
    ],
    cta: 'Enquire About Programme Sponsorship',
  },
]

const audiences = [
  { stat: '200+', label: 'Guests at the awards night' },
  { stat: '1,500+', label: 'Email subscribers' },
  { stat: '5,000+', label: 'Social media reach' },
  { stat: '15',     label: 'Award categories' },
  { stat: '3rd',    label: 'Annual awards event' },
  { stat: '100%',   label: 'Lincolnshire-focused audience' },
]

const whySponsor = [
  {
    title: 'Targeted Lincolnshire Reach',
    body: 'Every guest, viewer, and entrant is a Lincolnshire business professional. There\'s no more targeted way to reach local decision-makers.',
  },
  {
    title: 'Association With Excellence',
    body: 'The awards are known for rigorous, independent judging. Sponsoring places your brand alongside credibility and genuine achievement.',
  },
  {
    title: 'Category Naming Rights',
    body: 'As a category sponsor, your brand name is attached to an award — mentioned at every stage from entry through to winner announcement.',
  },
  {
    title: 'Face Time on the Night',
    body: 'Sponsors have the opportunity to present awards and address 200+ guests. Few marketing opportunities offer this level of direct engagement.',
  },
  {
    title: 'Year-Round Visibility',
    body: 'Sponsorship benefits begin when entries open in May and continue through the post-event coverage. Not just one night — an entire season.',
  },
  {
    title: 'Supporting the Community',
    body: 'Sponsoring these awards is a genuine investment in Lincolnshire\'s business community. Clients and prospects notice businesses that give back.',
  },
]

const previousSponsors = [
  { name: 'Previous Sponsor', year: 2025, placeholder: true },
  { name: 'Previous Sponsor', year: 2025, placeholder: true },
  { name: 'Previous Sponsor', year: 2025, placeholder: true },
  { name: 'Previous Sponsor', year: 2024, placeholder: true },
]

export default function SponsorshipPage() {
  return (
    <>
      <Header />
      <main id="main-content">

        {/* Page Hero */}
        <div
          className="relative pt-32 pb-16 md:pt-40 md:pb-24"
          style={{ background: 'linear-gradient(140deg, #060e22 0%, #0d1b3e 60%, #162558 100%)' }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,168,76,0.1) 1px, transparent 0)',
              backgroundSize: '32px 32px',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600"
          />
          <div className="container-wide relative z-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-gold-400 text-sm mb-8 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Home
            </Link>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="section-label">Sponsorship 2026</span>
                <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-6">
                  Align Your Brand With<br />
                  <span className="text-gold-400">Lincolnshire Excellence</span>
                </h1>
                <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-lg">
                  Sponsoring the Lincolnshire Marketing Awards places your brand at the heart
                  of the county&apos;s most credible business recognition event — reaching
                  200+ business leaders across an entire award season.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a href="#packages" className="btn-gold-lg">
                    View Packages
                  </a>
                  <a href="mailto:hello@lincolnshiremarketing.co.uk" className="btn-outline-white">
                    Enquire Now
                  </a>
                </div>
              </div>

              {/* Audience stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {audiences.map(({ stat, label }) => (
                  <div
                    key={label}
                    className="bg-navy-800/50 border border-navy-700 rounded-sm p-4 text-center"
                  >
                    <div className="text-gold-400 font-bold text-2xl leading-none mb-1">{stat}</div>
                    <div className="text-gray-400 text-xs leading-snug">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Why Sponsor */}
        <section aria-labelledby="why-sponsor-heading" className="section-py bg-white">
          <div className="container-wide">
            <div className="max-w-2xl mx-auto text-center mb-14">
              <span className="section-label">Why Sponsor</span>
              <h2 id="why-sponsor-heading" className="section-title mb-5">
                The Business Case for Sponsorship
              </h2>
              <p className="section-body">
                This isn&apos;t a vanity purchase. Sponsoring the Lincolnshire Marketing Awards
                delivers real, measurable brand value across a qualified Lincolnshire business audience.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {whySponsor.map(({ title, body }) => (
                <div
                  key={title}
                  className="card p-6 hover:border-gold-300 transition-all duration-200 group"
                >
                  <div
                    className="w-2 h-2 rounded-full bg-gold-500 mb-4 group-hover:w-3 group-hover:h-3
                                transition-all duration-200"
                    aria-hidden="true"
                  />
                  <h3 className="font-bold text-navy-900 text-sm mb-2">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Packages */}
        <section id="packages" aria-labelledby="packages-heading" className="section-py bg-gray-50">
          <div className="container-wide">
            <div className="max-w-2xl mx-auto text-center mb-14">
              <span className="section-label">Packages</span>
              <h2 id="packages-heading" className="section-title mb-5">
                Sponsorship Packages
              </h2>
              <p className="section-body">
                Choose the package that best fits your marketing objectives. All packages can be
                tailored — contact us to discuss bespoke arrangements.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {packages.map((pkg) => (
                <div
                  key={pkg.tier}
                  className={`relative rounded-sm overflow-hidden border transition-all duration-200 ${
                    pkg.highlight
                      ? 'border-gold-400 shadow-lg bg-white'
                      : 'border-gray-200 bg-white hover:border-gold-200 hover:shadow-md'
                  }`}
                >
                  {pkg.highlight && (
                    <div className="bg-gold-500 text-navy-900 text-[10px] font-bold uppercase
                                    tracking-widest text-center py-1.5 px-4">
                      Most Popular
                    </div>
                  )}
                  <div className={`h-1 ${pkg.highlight ? 'bg-gold-500' : 'bg-navy-900'}`} aria-hidden="true" />
                  <div className="p-7">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-bold text-navy-900 text-lg">{pkg.tier}</h3>
                        <p className="text-gray-500 text-sm mt-1 leading-relaxed">{pkg.description}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-gold-600 font-bold text-lg leading-none">{pkg.price}</div>
                        <div className="text-gray-400 text-xs mt-0.5">+VAT</div>
                      </div>
                    </div>

                    <ul className="space-y-2 mb-7">
                      {pkg.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-2.5 text-sm text-gray-600">
                          <svg className="w-4 h-4 text-gold-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                          </svg>
                          {benefit}
                        </li>
                      ))}
                    </ul>

                    <a
                      href={`mailto:hello@lincolnshiremarketing.co.uk?subject=${encodeURIComponent(pkg.tier + ' — Lincolnshire Marketing Awards 2026')}`}
                      className={pkg.highlight ? 'btn-gold w-full justify-center' : 'btn-outline-navy w-full justify-center'}
                    >
                      {pkg.cta}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-gray-500">
              Prices are subject to availability and may vary. All packages are exclusive of VAT.
              Bespoke arrangements available on request.
            </p>
          </div>
        </section>

        {/* Previous sponsors */}
        <section aria-labelledby="prev-sponsors-heading" className="section-py bg-white">
          <div className="container-wide">
            <div className="max-w-2xl mx-auto text-center mb-12">
              <span className="section-label">Previous Sponsors</span>
              <h2 id="prev-sponsors-heading" className="section-title mb-5">
                Past Sponsors & Partners
              </h2>
              <p className="section-body">
                We&apos;re grateful to the businesses that have supported the Lincolnshire Marketing Awards
                since our inaugural event in 2024.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 items-center justify-items-center mb-12">
              {previousSponsors.map((sponsor, idx) => (
                <div
                  key={idx}
                  className="h-16 w-36 bg-gray-100 border-2 border-dashed border-gray-200 rounded-sm
                             flex items-center justify-center text-gray-400 text-xs text-center px-3"
                  aria-label={`Sponsor from ${sponsor.year} — to be confirmed`}
                >
                  {sponsor.year}
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-gray-500 text-sm mb-1">Interested in sponsoring the 2026 awards?</p>
              <a
                href="mailto:hello@lincolnshiremarketing.co.uk?subject=Sponsorship%20Enquiry%20—%20Lincolnshire%20Marketing%20Awards%202026"
                className="text-gold-500 hover:text-gold-400 font-semibold text-sm underline underline-offset-2"
              >
                Contact us today to discuss options →
              </a>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="section-py bg-navy-900 relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,168,76,0.07) 1px, transparent 0)',
              backgroundSize: '28px 28px',
            }}
          />
          <div className="container-wide relative z-10 text-center">
            <span className="section-label">Get Started</span>
            <h2 className="section-title-white mb-5 max-w-2xl mx-auto">
              Ready to Become a Sponsor?
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
              Sponsorship packages for 2026 are available now. Contact us to discuss the right
              package for your business — or to put together something bespoke.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:hello@lincolnshiremarketing.co.uk?subject=Sponsorship%20Enquiry%20—%20Lincolnshire%20Marketing%20Awards%202026"
                className="btn-gold-lg"
              >
                Get In Touch
              </a>
              <Link href="/" className="btn-outline-white">
                Back to Main Site
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
