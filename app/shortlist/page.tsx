import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Shortlist from '@/components/sections/Shortlist'
import BookTickets from '@/components/sections/BookTickets'

// The tickets CTA shows prices from the settings table; refresh the cached
// page every 5 minutes so admin changes show without a redeploy.
export const revalidate = 300

export const metadata = {
  title: 'The 2026 Shortlist | Lincolnshire Marketing Awards',
  description:
    'The shortlisted businesses for the Lincolnshire Marketing Awards 2026, by category. Winners are revealed at the black-tie awards dinner on 10 September 2026.',
}

export default function ShortlistPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-16 md:pt-20">
        <Shortlist />
        <BookTickets />
      </main>
      <Footer />
    </>
  )
}
