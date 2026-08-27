export const metadata = { title: 'Payment received', robots: { index: false } }

export default function BookingPending() {
  return (
    <main className="hero-overlay text-white min-h-screen flex items-center relative overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 900px 500px at 70% 15%, rgba(40,200,255,0.07) 0%, transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(40,200,255,0.12) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <span className="section-label">Payment received</span>
        <h1 className="section-title-white text-4xl md:text-5xl">
          Thank you, you are booked in.
        </h1>
        <p className="mt-6 text-gray-300 leading-relaxed">
          Your payment has gone through. We are just finishing off your booking record, which
          takes a few seconds. A confirmation email is on its way with a link to add your guest
          names and dietary requirements.
        </p>
        <p className="mt-4 text-gray-300 leading-relaxed">
          If it has not arrived within ten minutes, check your junk folder, then email{' '}
          <a
            className="text-sky-400 hover:text-sky-300 underline underline-offset-4"
            href="mailto:tom@lincolnshiremarketing.co.uk"
          >
            tom@lincolnshiremarketing.co.uk
          </a>{' '}
          and we will sort it straight away.
        </p>
        <a href="/" className="btn-outline-white mt-10">
          Back to the awards
        </a>
      </div>
    </main>
  )
}
