import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BookTickets from '@/components/sections/BookTickets'
import { judges } from '@/content/judges'

export const metadata = {
  title: 'The Judging Panel | Lincolnshire Marketing Awards 2026',
  description:
    'The independent judging panel behind the Lincolnshire Marketing Awards 2026. Three judges per entry, scored on merit alone.',
}

// The tickets CTA shows prices from the settings table; refresh the cached
// page every 5 minutes so admin changes show without a redeploy.
export const revalidate = 300

/** "Dr Islam Gouda" -> "IG"; honorifics don't belong in an avatar. */
function initials(name: string) {
  const parts = name.replace(/^Dr\.?\s+/i, '').trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

export default function JudgesPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-16 md:pt-20">
        <section
          aria-labelledby="judges-heading"
          className="section-py"
          style={{ background: 'linear-gradient(160deg, #f8faff 0%, #eef3fb 50%, #f5f8ff 100%)' }}
        >
          <div className="container-wide">
            {/* Header */}
            <div className="max-w-2xl mx-auto text-center mb-14">
              <span className="section-label">The Judging Panel</span>
              <h2 id="judges-heading" className="section-title mb-5">
                Thank You to
                <span
                  className="block"
                  style={{
                    background: 'linear-gradient(135deg, #28c8ff, #00aee6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Our Judges
                </span>
              </h2>
              <p className="section-body">
                The nine members of the 2026 judging panel gave their time and expertise
                entirely voluntarily. Every entry was scored by three of them, independently
                and on merit alone — these awards are credible because of the work they put in.
              </p>
            </div>

            {/* Judge cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {judges.map((judge) => (
                <div
                  key={judge.name}
                  className="card p-7 text-center group hover:border-sky-200 transition-all duration-200"
                  style={{ borderBottom: '2px solid rgba(40,200,255,0.15)' }}
                >
                  {/* Initials avatar — no stock photos */}
                  <div
                    className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center"
                    aria-hidden="true"
                    style={{
                      background: 'linear-gradient(145deg, #040f2e 0%, #071d52 60%, #0a2d6e 100%)',
                      border: '2px solid rgba(201,168,76,0.4)',
                      boxShadow: '0 0 20px rgba(40,200,255,0.12)',
                    }}
                  >
                    <span className="text-sky-300 font-bold text-lg tracking-wide">
                      {initials(judge.name)}
                    </span>
                  </div>
                  <h3 className="font-bold text-navy-900 text-base tracking-tight">
                    {judge.name}
                  </h3>
                </div>
              ))}
            </div>

            <p className="text-center text-sm text-gray-400 mt-12 max-w-2xl mx-auto">
              Judges declared any conflicts of interest before judging began and were recused
              where required. The panel&apos;s scores are final and confidential — winners are
              revealed on the night.
            </p>
          </div>
        </section>

        <BookTickets />
      </main>
      <Footer />
    </>
  )
}
