export const metadata = { title: 'Payment received', robots: { index: false } }

export default function BookingPending() {
  return (
    <main className="bg-neutral-950 text-white min-h-screen flex items-center">
      <div className="max-w-2xl mx-auto px-6 py-24">
        <p className="uppercase tracking-[0.2em] text-xs text-white/50 font-semibold">
          Payment received
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mt-5">Thank you, you are booked in.</h1>
        <p className="mt-6 text-white/70 leading-relaxed">
          Your payment has gone through. We are just finishing off your booking record, which
          takes a few seconds. A confirmation email is on its way with a link to add your guest
          names and dietary requirements.
        </p>
        <p className="mt-4 text-white/70 leading-relaxed">
          If it has not arrived within ten minutes, check your junk folder, then email{' '}
          <a
            className="underline underline-offset-4"
            href="mailto:tom@lincolnshiremarketing.co.uk"
          >
            tom@lincolnshiremarketing.co.uk
          </a>{' '}
          and we will sort it straight away.
        </p>
        <a
          href="/"
          className="inline-flex mt-10 border border-white/40 px-6 py-3 rounded-md font-semibold hover:bg-white/10"
        >
          Back to the awards
        </a>
      </div>
    </main>
  )
}
