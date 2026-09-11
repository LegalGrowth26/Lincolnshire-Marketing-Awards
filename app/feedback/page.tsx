import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FeedbackForm from './feedback-form'

export const metadata = {
  title: 'Feedback | Lincolnshire Marketing Awards 2026',
  description:
    'Were you at the Lincolnshire Marketing Awards 2026? Tell us what you thought — anonymously if you prefer.',
  robots: { index: false },
}

// Fully static, no cookies, no analytics, no tracking of any kind on this
// page — anonymity is honoured end to end. See app/api/feedback/route.ts.
export default function FeedbackPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        <header className="hero-overlay text-white relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(40,200,255,0.12) 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12 md:pt-36 relative z-10">
            <span className="section-label">Feedback</span>
            <h1 className="section-title-white text-3xl md:text-5xl">
              How was the awards night?
            </h1>
            <p className="mt-4 text-gray-300 leading-relaxed">
              Two minutes, nothing required, and anonymous unless you choose otherwise. It all
              goes into making next year better.
            </p>
          </div>
        </header>

        <div
          className="py-12 md:py-16"
          style={{ background: 'linear-gradient(160deg, #f8faff 0%, #eef3fb 50%, #f5f8ff 100%)' }}
        >
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <FeedbackForm />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
