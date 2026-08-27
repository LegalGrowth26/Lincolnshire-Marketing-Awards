'use client'

import { useState, useTransition } from 'react'
import { startBooking, type BookSeatInput } from './actions'
import type { TicketType } from '@/lib/orders'

type Option = { slug: string; label: string }

type Seat = {
  seat_number: number
  full_name: string
  company: string
  dietary_tags: string[]
  dietary_notes: string
  accessibility_notes: string
}

const emptySeat = (n: number): Seat => ({
  seat_number: n,
  full_name: '',
  company: '',
  dietary_tags: [],
  dietary_notes: '',
  accessibility_notes: '',
})

const inputClass = `mt-2 w-full border border-navy-200 bg-white rounded-sm px-3 py-2
                    focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30`

export default function BookForm({
  initialType,
  options,
}: {
  initialType: TicketType
  options: Option[]
}) {
  const [step, setStep] = useState<1 | 2>(1)
  const [ticketType, setTicketType] = useState<TicketType>(initialType)
  const [buyer, setBuyer] = useState({ name: '', company: '', email: '', phone: '' })
  const [seats, setSeats] = useState<Seat[]>(() =>
    Array.from({ length: initialType === 'table8' ? 8 : 1 }, (_, i) => emptySeat(i + 1)),
  )
  const [error, setError] = useState<string | null>(null)
  const [submitting, start] = useTransition()

  const seatCount = ticketType === 'table8' ? 8 : 1

  function choose(type: TicketType) {
    setTicketType(type)
    const count = type === 'table8' ? 8 : 1
    setSeats((prev) =>
      Array.from({ length: count }, (_, i) => prev[i] ?? emptySeat(i + 1)),
    )
  }

  function toStep2() {
    if (!buyer.name.trim()) return setError('Please add your name.')
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(buyer.email.trim())) {
      return setError('Please add a valid email address.')
    }
    setError(null)
    // Seat 1 is the buyer — prefill it without overwriting anything typed.
    setSeats((prev) =>
      prev.map((s, i) =>
        i === 0
          ? {
              ...s,
              full_name: s.full_name || buyer.name.trim(),
              company: s.company || buyer.company.trim(),
            }
          : s,
      ),
    )
    setStep(2)
  }

  function updateSeat(i: number, patch: Partial<Seat>) {
    setSeats((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)))
  }

  function toggleTag(i: number, slug: string) {
    setSeats((prev) =>
      prev.map((s, idx) => {
        if (idx !== i) return s
        let tags = s.dietary_tags.includes(slug)
          ? s.dietary_tags.filter((t) => t !== slug)
          : [...s.dietary_tags, slug]
        // "No requirements" is exclusive both ways.
        if (slug === 'none' && tags.includes('none')) tags = ['none']
        else if (slug !== 'none') tags = tags.filter((t) => t !== 'none')
        return { ...s, dietary_tags: tags }
      }),
    )
  }

  function submit() {
    setError(null)
    start(async () => {
      const payload: BookSeatInput[] = seats.map((s) => ({ ...s }))
      const res = await startBooking({
        ticket_type: ticketType,
        buyer_name: buyer.name,
        buyer_company: buyer.company,
        buyer_email: buyer.email,
        buyer_phone: buyer.phone,
        seats: payload,
      })
      // On success the action redirects to Stripe and never resolves here.
      if (res && 'error' in res) setError(res.error)
    })
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="flex items-center gap-3 mb-8 text-xs font-bold uppercase tracking-widest">
        <span className={step === 1 ? 'text-sky-500' : 'text-gray-400'}>1 · Your details</span>
        <span className="text-gray-300">—</span>
        <span className={step === 2 ? 'text-sky-500' : 'text-gray-400'}>2 · Your guests</span>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          {/* Ticket type */}
          <fieldset>
            <legend className="text-sm font-semibold text-navy-900 mb-3">Ticket type</legend>
            <div className="grid sm:grid-cols-2 gap-4">
              {(
                [
                  ['single', 'Single ticket', 'One seat at a shared table.'],
                  ['table8', 'Table of 8', 'Your own table for the team or clients.'],
                ] as const
              ).map(([value, label, blurb]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => choose(value)}
                  aria-pressed={ticketType === value}
                  className="card p-5 text-left transition-all duration-200"
                  style={
                    ticketType === value
                      ? { border: '1.5px solid rgba(40,200,255,0.6)' }
                      : undefined
                  }
                >
                  <span className="font-bold text-navy-900 block">{label}</span>
                  <span className="text-sm text-gray-500 mt-1 block">{blurb}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="card p-6">
            <h2 className="font-bold text-lg text-navy-900 tracking-tight">About you</h2>
            <div className="grid sm:grid-cols-2 gap-4 mt-5">
              <label className="block">
                <span className="text-sm font-semibold text-navy-900">Full name</span>
                <input
                  value={buyer.name}
                  onChange={(e) => setBuyer((b) => ({ ...b, name: e.target.value }))}
                  className={inputClass}
                  placeholder="First and last name"
                  autoComplete="name"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-navy-900">
                  Company <span className="font-normal text-gray-400">optional</span>
                </span>
                <input
                  value={buyer.company}
                  onChange={(e) => setBuyer((b) => ({ ...b, company: e.target.value }))}
                  className={inputClass}
                  autoComplete="organization"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-navy-900">Email</span>
                <input
                  type="email"
                  value={buyer.email}
                  onChange={(e) => setBuyer((b) => ({ ...b, email: e.target.value }))}
                  className={inputClass}
                  placeholder="you@company.co.uk"
                  autoComplete="email"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-navy-900">
                  Phone <span className="font-normal text-gray-400">optional</span>
                </span>
                <input
                  type="tel"
                  value={buyer.phone}
                  onChange={(e) => setBuyer((b) => ({ ...b, phone: e.target.value }))}
                  className={inputClass}
                  autoComplete="tel"
                />
              </label>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button type="button" onClick={toStep2} className="btn-gold">
              Continue to guest details
            </button>
            <p className="text-sm text-gray-500">
              Only your name and email are needed before payment.
            </p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <p className="text-sm text-gray-500">
            Add whoever you already know is coming. You do not need all{' '}
            {seatCount === 1 ? 'the details' : `${seatCount} names`} now — after payment you get a
            private link to finish this any time before the event.
          </p>

          {seats.map((seat, i) => (
            <section key={seat.seat_number} className="card p-6">
              <h2 className="font-bold text-lg text-navy-900 tracking-tight">
                Seat {seat.seat_number}
                {seat.seat_number === 1 && (
                  <span className="ml-2 text-xs font-bold uppercase tracking-wider text-gold-500">
                    You
                  </span>
                )}
              </h2>

              <div className="grid sm:grid-cols-2 gap-4 mt-5">
                <label className="block">
                  <span className="text-sm font-semibold text-navy-900">
                    Full name <span className="font-normal text-gray-400">optional for now</span>
                  </span>
                  <input
                    value={seat.full_name}
                    onChange={(e) => updateSeat(i, { full_name: e.target.value })}
                    className={inputClass}
                    placeholder="First and last name"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-navy-900">
                    Company or job title <span className="font-normal text-gray-400">optional</span>
                  </span>
                  <input
                    value={seat.company}
                    onChange={(e) => updateSeat(i, { company: e.target.value })}
                    className={inputClass}
                  />
                </label>
              </div>

              {options.length > 0 && (
                <fieldset className="mt-5">
                  <legend className="text-sm font-semibold text-navy-900">
                    Dietary requirements
                  </legend>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {options.map((o) => {
                      const on = seat.dietary_tags.includes(o.slug)
                      return (
                        <button
                          key={o.slug}
                          type="button"
                          onClick={() => toggleTag(i, o.slug)}
                          aria-pressed={on}
                          className={`px-3 py-1.5 rounded-full text-sm border transition ${
                            on
                              ? 'bg-navy-900 text-white border-navy-900'
                              : 'bg-white text-charcoal-700 border-navy-200 hover:border-sky-400'
                          }`}
                        >
                          {o.label}
                        </button>
                      )
                    })}
                  </div>
                </fieldset>
              )}

              <div className="grid sm:grid-cols-2 gap-4 mt-5">
                <label className="block">
                  <span className="text-sm font-semibold text-navy-900">
                    Anything else the kitchen needs to know
                  </span>
                  <textarea
                    value={seat.dietary_notes}
                    onChange={(e) => updateSeat(i, { dietary_notes: e.target.value })}
                    rows={2}
                    className={inputClass}
                    placeholder="Severity of an allergy, other requirements"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-navy-900">
                    Access or seating notes <span className="font-normal text-gray-400">optional</span>
                  </span>
                  <textarea
                    value={seat.accessibility_notes}
                    onChange={(e) => updateSeat(i, { accessibility_notes: e.target.value })}
                    rows={2}
                    className={inputClass}
                    placeholder="Step free access, hearing loop, anything else"
                  />
                </label>
              </div>
            </section>
          ))}

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn-outline-navy"
              disabled={submitting}
            >
              Back
            </button>
            <button type="button" onClick={submit} disabled={submitting} className="btn-gold">
              {submitting ? 'Taking you to payment' : 'Continue to secure payment'}
            </button>
            <p className="text-sm text-gray-500">Payment is taken securely by Stripe.</p>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm p-4">
          {error}
        </p>
      )}
    </div>
  )
}
