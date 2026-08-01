import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Past Winners',
  description:
    'The independently judged winners and highly commended businesses from the Lincolnshire Marketing Awards 2024 and 2025. The county\'s premier business growth awards.',
}

interface Winner {
  category: string
  winner: string
  highlyCommended?: string | string[]
}

interface YearData {
  year: number
  venue: string
  host?: string
  winners: Winner[]
}

const pastWinners: YearData[] = [
  {
    year: 2025,
    venue: 'Cathedral Ballroom, DoubleTree by Hilton, Lincoln',
    host: 'Dan Temple, Cobalt Human Solutions',
    winners: [
      {
        category: 'Innovative Marketing Award',
        winner: 'Lincoln United',
        highlyCommended: 'Business Bollox',
      },
      {
        category: 'Corporate & Social Responsibility Award',
        winner: 'Lincolnshire FA',
        highlyCommended: 'Zest Theatre',
      },
      {
        category: 'Best Use of Social Media Award',
        winner: 'Lincoln United',
        highlyCommended: 'Lincolnshire FA',
      },
      {
        category: 'Best Website Award',
        winner: 'Toby Lee',
        highlyCommended: 'Eight Branches',
      },
      {
        category: 'Entrepreneur of the Year',
        winner: 'Stuart Burlton',
        highlyCommended: 'Eleanor Hancock',
      },
      {
        category: 'New Business Award',
        winner: "She's in Business CIC",
        highlyCommended: 'Your Brand Lab',
      },
      {
        category: 'Best Family-Owned Business',
        winner: 'NY Tractor Parts',
        highlyCommended: ['Agri.Cycle', 'The Moss Man'],
      },
      {
        category: 'Growth Award',
        winner: 'Reuseabox',
        highlyCommended: "She's in Business CIC",
      },
      {
        category: 'Best Business Service Provider',
        winner: 'The Thrive Tribe',
        highlyCommended: ['Zest Theatre', 'Number 75 Design'],
      },
      {
        category: 'Business Recognition Award',
        winner: 'Laurel Kavanagh (University of Lincoln, Student Enterprise)',
        highlyCommended: 'Rachael Hunt (Lincoln Business Club)',
      },
    ],
  },
  {
    year: 2024,
    venue: 'Inaugural Lincolnshire Marketing Conference and Awards, Lincolnshire',
    winners: [
      {
        category: 'Innovative Marketing Award',
        winner: 'Scott Perry',
      },
      {
        category: 'Corporate & Social Responsibility Award',
        winner: 'Ringrose Law',
      },
      {
        category: 'Best Use of Social Media Award',
        winner: 'Rebecca Heald',
      },
      {
        category: 'Best Website Award',
        winner: 'Petaurum HR',
      },
      {
        category: 'Entrepreneur of the Year',
        winner: 'Nathan Wilson',
      },
      {
        category: 'Best New Business Award',
        winner: 'Guardian Angel Carers, Lincoln and Newark',
      },
      {
        category: 'Best Family-Owned Business Award',
        winner: 'Mortgages in Lincoln',
      },
      {
        category: 'Growth Award',
        winner: 'Dads Advocates',
      },
      {
        category: 'Best Business Service Provider Award',
        winner: 'Petaurum HR',
      },
      {
        category: 'Business Recognition Award',
        winner: 'Nicholsons Accountants',
      },
    ],
  },
]

function WinnerCard({ winner }: { winner: Winner }) {
  const hcList = Array.isArray(winner.highlyCommended)
    ? winner.highlyCommended
    : winner.highlyCommended
    ? [winner.highlyCommended]
    : []

  return (
    <div className="bg-white border border-gray-100 rounded-sm shadow-sm hover:shadow-md
                    hover:border-sky-200 transition-all duration-200 overflow-hidden">
      <div className="h-1 bg-sky-400" aria-hidden="true" />
      <div className="p-5 md:p-6">
        <h4 className="text-[11px] font-bold text-sky-600 uppercase tracking-wide mb-4 leading-snug">
          {winner.category}
        </h4>

        <div className="flex items-start gap-3 mb-3">
          <div
            className="flex-shrink-0 w-8 h-8 bg-gold-500 rounded-sm flex items-center justify-center"
            aria-hidden="true"
          >
            <svg className="w-4 h-4 text-navy-900" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <div>
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-0.5">
              Winner
            </div>
            <div className="font-bold text-navy-900 text-sm leading-snug">{winner.winner}</div>
          </div>
        </div>

        {hcList.length > 0 && (
          <div className="border-t border-gray-100 pt-3 mt-3">
            <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">
              Highly Commended
            </div>
            {hcList.map((hc) => (
              <div key={hc} className="text-gray-500 text-xs leading-relaxed py-0.5">
                {hc}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function PastWinnersPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        {/* Page Hero */}
        <div
          className="relative pt-32 pb-16 md:pt-40 md:pb-20"
          style={{ background: 'linear-gradient(140deg, #071d52 0%, #0a2d6e 60%, #0d3a84 100%)' }}
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
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-600 via-sky-400 to-sky-600"
          />
          <div className="container-wide relative z-10 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-sky-400 text-sm mb-6 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back to Home
            </Link>
            <span className="block text-sky-400 text-xs font-semibold tracking-[0.18em] uppercase mb-4">
              Hall of Fame
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
              Past Winners
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed mb-6">
              The Lincolnshire Marketing Awards has recognised outstanding Lincolnshire businesses
              since its inaugural event in 2024. These are the winners and highly commended
              businesses that set the standard.
            </p>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
              {[
                ['2 Events', 'Completed'],
                ['Independent', 'Judging Panel'],
                ['Black Tie', 'Awards Dinner'],
              ].map(([val, label]) => (
                <div key={label} className="text-center">
                  <div className="text-sky-400 font-bold text-base leading-none">{val}</div>
                  <div className="text-gray-500 text-xs mt-1">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Credibility strip */}
        <div className="bg-navy-900 border-b border-navy-800">
          <div className="container-wide py-8">
            <div className="grid sm:grid-cols-3 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-navy-700">
              <div className="py-4 sm:py-0">
                <p className="text-white font-semibold text-sm mb-1">Independently Judged</p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Every winner was selected by an independent panel. Three judges per entry,
                  with no organiser influence on outcomes.
                </p>
              </div>
              <div className="py-4 sm:py-0 sm:px-6">
                <p className="text-white font-semibold text-sm mb-1">Open to All Businesses</p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  Winners include sole traders, charities, sports clubs, professional services
                  firms, and growing SMEs, from across Lincolnshire.
                </p>
              </div>
              <div className="py-4 sm:py-0">
                <p className="text-white font-semibold text-sm mb-1">Merit Only</p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  No pay-to-win. No membership required. Winners are determined entirely by
                  the quality of their submission and supporting evidence.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Winners by year */}
        <div className="bg-gray-50 section-py">
          <div className="container-wide">

            {pastWinners.map((yearData) => (
              <div key={yearData.year} className="mb-20 last:mb-0">

                {/* Year header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-6
                                border-b-2 border-navy-900">
                  <div>
                    <div className="text-sky-500 text-5xl font-bold leading-none mb-1">
                      {yearData.year}
                    </div>
                    <h2 className="text-navy-900 font-bold text-xl">
                      Lincolnshire Marketing Awards {yearData.year}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">{yearData.venue}</p>
                    {yearData.host && (
                      <p className="text-gray-400 text-xs mt-0.5">
                        Hosted by {yearData.host}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 bg-navy-900 text-white px-4 py-2 rounded-sm self-start sm:self-auto">
                    <svg className="w-4 h-4 text-sky-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-semibold">
                      {yearData.winners.length} Categories
                    </span>
                  </div>
                </div>

                {/* Winners grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {yearData.winners.map((winner) => (
                    <WinnerCard key={winner.category} winner={winner} />
                  ))}
                </div>
              </div>
            ))}

            {/* 2026 teaser */}
            <div className="mt-20 bg-navy-900 rounded-sm p-8 md:p-12 text-center relative overflow-hidden">
              <div
                aria-hidden="true"
                className="absolute inset-0"
                style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(201,168,76,0.08) 1px, transparent 0)',
                  backgroundSize: '28px 28px',
                }}
              />
              <div className="relative z-10">
                <div className="text-sky-400 text-5xl font-bold mb-2">2026</div>
                <h3 className="text-white font-bold text-2xl mb-4">
                  Could Your Business Be on This Page?
                </h3>
                <p className="text-gray-400 max-w-xl mx-auto mb-3 leading-relaxed">
                  Entries for the 2026 awards open in early May. Free to enter, independently
                  judged, and celebrated at a black-tie dinner in 10 September 2026.
                </p>
                <p className="text-gray-500 text-sm max-w-lg mx-auto mb-8">
                  These awards are open to all Lincolnshire businesses. No entry fees,
                  no prior relationship with the organiser required.
                </p>
                <Link href="/#enter" className="btn-gold-lg">
                  Enter the 2026 Awards, Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
