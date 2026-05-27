import Header       from '@/components/layout/Header'
import Footer       from '@/components/layout/Footer'
import Hero         from '@/components/sections/Hero'
import WhyAttend    from '@/components/sections/WhyAttend'
import Highlights   from '@/components/sections/Highlights'
import Speakers     from '@/components/sections/Speakers'
import Organiser    from '@/components/sections/Organiser'
import EventDetails from '@/components/sections/EventDetails'
import Partners     from '@/components/sections/Partners'
import BookingForm  from '@/components/sections/BookingForm'
import FinalCTA     from '@/components/sections/FinalCTA'

export default function HomePage() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100]
                   focus:px-4 focus:py-2 focus:bg-mb-500 focus:text-black focus:font-semibold
                   focus:rounded-md"
      >
        Skip to main content
      </a>

      <Header />

      <main id="main">
        <Hero />
        <WhyAttend />
        <Highlights />
        <Speakers />
        <Organiser />
        <EventDetails />
        <Partners />
        <BookingForm />
        <FinalCTA />
      </main>

      <Footer />
    </>
  )
}
