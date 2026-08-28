// Prices in the closing CTA come from the settings table; refresh the cached
// page every 5 minutes so admin changes show without a redeploy.
export const revalidate = 300

import Header      from '@/components/layout/Header'
import Footer      from '@/components/layout/Footer'
import Hero        from '@/components/sections/Hero'
import Shortlist   from '@/components/sections/Shortlist'
import BookTickets from '@/components/sections/BookTickets'

export default function HomePage() {
  return (
    <>
      <Header />
      <main id="main-content">
        {/* Skip link target */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4
                     focus:z-50 focus:px-4 focus:py-2 focus:bg-sky-400 focus:text-navy-950
                     focus:font-semibold focus:rounded-sm"
        >
          Skip to main content
        </a>

        <Hero />
        <Shortlist />
        <BookTickets />
      </main>
      <Footer />
    </>
  )
}
