import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { notFound } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { AWARD_YEARS, getAwardYear } from '@/content/awards'

/** Logo files are supplied by the organisers; until one exists the grid shows a name plate. */
function logoExists(logo: string) {
  return existsSync(join(process.cwd(), 'public', logo))
}

const GALLERY_URL =
  'https://cvphotos.photoshelter.com/gallery/260910-Lincolnshire-Marketing-Awards/G0000zjUAZHbk5S0'

export const dynamicParams = false

export function generateStaticParams() {
  return AWARD_YEARS.map((y) => ({ year: String(y.year) }))
}

export function generateMetadata({ params }: { params: { year: string } }) {
  const awards = getAwardYear(Number(params.year))
  if (!awards) return {}
  return {
    title: `Lincolnshire Marketing Awards ${awards.year} Winners`,
    description: `The winners, highly commended and shortlisted businesses of the Lincolnshire Marketing Awards ${awards.year}, announced at the awards dinner on ${awards.eventDate} at the ${awards.venue}.`,
  }
}

export default function WinnersYearPage({ params }: { params: { year: string } }) {
  const awards = getAwardYear(Number(params.year))
  if (!awards) notFound()

  return (
    <>
      <Header />
      <main id="main-content">
        {/* Hero band */}
        <header className="hero-overlay text-white relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(40,200,255,0.12) 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 right-0 h-px"
            style={{ background: 'linear-gradient(to right, transparent, #28c8ff 30%, #c9a84c 60%, transparent)' }}
          />
          <div className="container-wide pt-32 pb-14 md:pt-40 md:pb-20 relative z-10">
            <span className="section-label">{awards.label}</span>
            <h1 className="section-title-white text-4xl md:text-6xl">
              Lincolnshire Marketing Awards {awards.year} Winners
            </h1>
            <p className="mt-5 text-gray-300 leading-relaxed text-base md:text-lg">
              Announced at the black-tie awards dinner on {awards.eventDate} at the{' '}
              {awards.venue}.
            </p>
          </div>
        </header>

        {/* Results */}
        <section
          aria-label={`The ${awards.year} results by category`}
          className="section-py"
          style={{ background: 'linear-gradient(160deg, #f8faff 0%, #eef3fb 50%, #f5f8ff 100%)' }}
        >
          <div className="container-wide max-w-4xl space-y-12">
            {awards.categories.map((cat) => (
              <article key={cat.title}>
                <div className="mb-5">
                  <h2 className="font-bold text-navy-900 text-xl md:text-2xl tracking-tight">
                    {cat.title}
                  </h2>
                  <div className="gold-divider mt-3" aria-hidden="true" />
                </div>

                {/* Winner — clearly first and largest */}
                <div
                  className="card p-7 relative overflow-hidden"
                  style={{ border: '1.5px solid rgba(201,168,76,0.5)' }}
                >
                  <div
                    aria-hidden="true"
                    className="absolute top-0 left-0 bottom-0 w-1"
                    style={{ background: 'linear-gradient(to bottom, #dda03a, #c9a84c, #b08a2e)' }}
                  />
                  <p className="text-gold-600 text-xs font-bold tracking-[0.22em] uppercase mb-2 pl-3">
                    Winner
                  </p>
                  <p className="font-bold text-navy-900 text-2xl md:text-3xl tracking-tight pl-3">
                    {cat.winner}
                  </p>
                </div>

                {/* Highly commended */}
                <div className="card px-7 py-5 mt-4" style={{ borderBottom: '2px solid rgba(40,200,255,0.2)' }}>
                  <p className="text-sky-500 text-xs font-bold tracking-[0.22em] uppercase mb-1.5">
                    Highly Commended
                  </p>
                  <p className="font-semibold text-navy-900 text-lg">{cat.highlyCommended}</p>
                </div>

                {/* The full shortlist stays published */}
                <div className="mt-4">
                  <p className="text-xs font-bold tracking-[0.22em] uppercase text-gray-400 mb-2.5">
                    Shortlisted
                  </p>
                  <ul className="flex flex-wrap gap-2" aria-label={`${cat.title} shortlist`}>
                    {cat.shortlist.map((entry) => (
                      <li
                        key={entry}
                        className="text-sm text-charcoal-700 bg-white border border-navy-100 rounded-full px-4 py-1.5"
                      >
                        {entry}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}

            <p className="text-center text-sm text-gray-400 pt-2">
              Every entry was scored by three independent judges. Congratulations to every
              winner, and to every shortlisted business — being shortlisted was an achievement
              in itself.
            </p>
          </div>
        </section>

        {/* Photographs */}
        <section
          aria-labelledby="photos-heading"
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
                <span className="section-label">The Night</span>
                <h2 id="photos-heading" className="section-title-white mb-4">
                  Photographs from the Night
                </h2>
                <p className="text-gray-400 max-w-xl mx-auto mb-8 leading-relaxed">
                  Photographs from the evening are by Chris Vaughan Photography and are ready
                  to download.
                </p>
                <a
                  href={GALLERY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold-lg"
                >
                  View the Gallery
                </a>
                <p className="text-gray-400 text-sm mt-5">
                  Password: <span className="font-semibold text-white">LMA26</span>
                </p>
                <p className="text-gray-500 text-xs mt-4">
                  All photography &copy; Chris Vaughan Photography.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Thank you */}
        <section
          aria-labelledby="thanks-heading"
          className="section-py"
          style={{ background: 'linear-gradient(160deg, #f8faff 0%, #eef3fb 50%, #f5f8ff 100%)' }}
        >
          <div className="container-wide">
            <div className="max-w-2xl mx-auto text-center mb-14">
              <span className="section-label">Thank You</span>
              <h2 id="thanks-heading" className="section-title mb-5">
                The People Who Made It Happen
              </h2>
              <p className="section-body">
                An evening like this does not happen on its own. Our thanks go to everyone
                who played a part in it.
              </p>
            </div>

            <ul className="flex flex-wrap justify-center gap-6 max-w-5xl mx-auto">
              {awards.supporters.map((s) => (
                <li
                  key={s.name}
                  className="card p-6 text-center grow sm:grow-0 sm:min-w-[260px] sm:max-w-xs"
                  style={{ borderBottom: '2px solid rgba(40,200,255,0.15)' }}
                >
                  {logoExists(s.logo) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.logo}
                      alt={`${s.name} logo`}
                      className="h-16 mx-auto mb-4 object-contain"
                    />
                  ) : (
                    <div
                      className="h-16 rounded-sm mb-4 flex items-center justify-center px-4"
                      style={{
                        background: 'linear-gradient(145deg, #040f2e 0%, #071d52 60%, #0a2d6e 100%)',
                        border: '1px solid rgba(201,168,76,0.35)',
                      }}
                    >
                      <span className="text-white font-semibold text-sm leading-snug">
                        {s.name}
                      </span>
                    </div>
                  )}
                  <p className="font-bold text-navy-900 text-sm tracking-tight">{s.name}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.role}</p>
                </li>
              ))}
            </ul>

            <p className="text-center text-sm text-gray-500 mt-12 max-w-xl mx-auto">
              Without all of these moving parts, we could not have run the event.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
