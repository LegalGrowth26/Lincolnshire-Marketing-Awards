import { booking, event } from '@/content/site'

export default function BookingForm() {
  return (
    <section id="book" className="section bg-ink-950">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="eyebrow">Book your place</span>
          <h2 className="h2 mt-4">{booking.heading}</h2>
          <p className="body-lg mt-5">{booking.subheading}</p>
          <p className="body-muted mt-3">{booking.note}</p>
        </div>

        <div className="mt-10 form-embed">
          <iframe
            src={event.bookingFormUrl}
            title="Mission Business 2026 registration form"
            loading="lazy"
            allow="clipboard-write"
          />
        </div>

        <p className="text-xs text-ink-400 mt-4">
          Having trouble with the form? Refresh the page, or contact the organiser directly.
        </p>
      </div>
    </section>
  )
}
