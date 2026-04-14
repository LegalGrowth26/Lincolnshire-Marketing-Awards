import Header       from '@/components/layout/Header'
import Footer       from '@/components/layout/Footer'
import Hero         from '@/components/sections/Hero'
import About        from '@/components/sections/About'
import WhyEnter     from '@/components/sections/WhyEnter'
import Categories   from '@/components/sections/Categories'
import HowItWorks   from '@/components/sections/HowItWorks'
import Judging      from '@/components/sections/Judging'
import ImportantDates from '@/components/sections/ImportantDates'
import EnterAwards  from '@/components/sections/EnterAwards'
import ApplyToJudge from '@/components/sections/ApplyToJudge'
import Sponsors     from '@/components/sections/Sponsors'
import EventDetails from '@/components/sections/EventDetails'
import FAQs         from '@/components/sections/FAQs'

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
        <About />
        <WhyEnter />
        <Categories />
        <HowItWorks />
        <Judging />
        <ImportantDates />
        <EnterAwards />
        <ApplyToJudge />
        <Sponsors />
        <EventDetails />
        <FAQs />
      </main>
      <Footer />
    </>
  )
}
