import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: 'Book | Lincolnshire Marketing Awards 2026',
  description:
    'Ticket sales for the Lincolnshire Marketing Awards 2026 have closed. The awards took place on 10 September 2026.',
  robots: { index: false },
}

// The 2026 event has happened. The route stays up for old links, saying so.
export default function BookClosedPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-16 md:pt-20">
        <section
          className="section-py min-h-[50vh] flex items-center"
          style={{ background: 'linear-gradient(160deg, #f8faff 0%, #eef3fb 50%, #f5f8ff 100%)' }}
        >
          <div className="container-wide max-w-2xl text-center mx-auto">
            <span className="section-label">Bookings</span>
            <h1 className="section-title mb-5">Tickets for 2026 have closed.</h1>
            <p className="section-body mb-8">
              The Lincolnshire Marketing Awards 2026 took place on 10 September at the
              DoubleTree by Hilton, Lincoln.
            </p>
            <a href="/winners/2026" className="btn-gold-lg">
              View the 2026 Winners
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
