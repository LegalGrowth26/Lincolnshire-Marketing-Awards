'use client'

import { useState } from 'react'

const inputClass = `mt-2 w-full border border-navy-200 bg-white rounded-sm px-3 py-2
                    focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30`

type Ratings = {
  rating_overall: number | null
  rating_venue: number | null
  rating_food: number | null
  rating_entertainment: number | null
  rating_ceremony: number | null
}

const RATING_LABELS: [keyof Ratings, string][] = [
  ['rating_overall', 'Overall'],
  ['rating_venue', 'The venue and the room'],
  ['rating_food', 'The food'],
  ['rating_entertainment', 'The entertainment'],
  ['rating_ceremony', 'The awards ceremony itself'],
]

const CHOICE_QUESTIONS: {
  key: 'length_felt' | 'price_felt' | 'would_return' | 'would_enter'
  question: string
  options: [string, string][]
}[] = [
  {
    key: 'length_felt',
    question: 'How did the length of the evening feel?',
    options: [
      ['too_short', 'Too short'],
      ['about_right', 'About right'],
      ['too_long', 'Too long'],
    ],
  },
  {
    key: 'price_felt',
    question: 'And the ticket price?',
    options: [
      ['too_cheap', 'Too cheap'],
      ['about_right', 'About right'],
      ['too_expensive', 'Too expensive'],
    ],
  },
  {
    key: 'would_return',
    question: 'Would you come again next year?',
    options: [
      ['yes', 'Yes'],
      ['maybe', 'Maybe'],
      ['no', 'No'],
    ],
  },
  {
    key: 'would_enter',
    question: 'Would you enter the awards again?',
    options: [
      ['yes', 'Yes'],
      ['maybe', 'Maybe'],
      ['no', 'No'],
      ['did_not_enter', 'I did not enter'],
    ],
  },
]

const TEXT_QUESTIONS: { key: string; question: string }[] = [
  { key: 'best_part', question: 'What was the best part of the night?' },
  { key: 'would_change', question: 'What would you change?' },
  { key: 'category_ideas', question: 'Is there a category we are missing, or one that should go?' },
  { key: 'anything_else', question: 'Anything else you want to tell us?' },
]

function StarRow({
  label,
  value,
  onChange,
}: {
  label: string
  value: number | null
  onChange: (v: number | null) => void
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3">
      <span className="text-sm font-semibold text-navy-900">{label}</span>
      <div className="flex gap-1" role="radiogroup" aria-label={`${label}, one to five stars`}>
        {[1, 2, 3, 4, 5].map((n) => {
          const on = value !== null && n <= value
          return (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={value === n}
              aria-label={`${n} star${n === 1 ? '' : 's'}`}
              onClick={() => onChange(value === n ? null : n)}
              className="p-1 transition-transform hover:scale-110"
            >
              <svg
                className="w-7 h-7"
                viewBox="0 0 24 24"
                fill={on ? '#c9a84c' : 'none'}
                stroke={on ? '#b08a2e' : '#a9caf2'}
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.562.562 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                />
              </svg>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function FeedbackForm() {
  const [ratings, setRatings] = useState<Ratings>({
    rating_overall: null,
    rating_venue: null,
    rating_food: null,
    rating_entertainment: null,
    rating_ceremony: null,
  })
  const [choices, setChoices] = useState<Record<string, string | null>>({
    length_felt: null,
    price_felt: null,
    would_return: null,
    would_enter: null,
  })
  const [texts, setTexts] = useState<Record<string, string>>({
    best_part: '',
    would_change: '',
    category_ideas: '',
    anything_else: '',
  })
  const [identified, setIdentified] = useState(false)
  const [name, setName] = useState('')
  const [business, setBusiness] = useState('')
  const [email, setEmail] = useState('')
  const [honeypot, setHoneypot] = useState('')
  const [startedAt] = useState(() => Date.now())
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function toggleIdentified(on: boolean) {
    setIdentified(on)
    if (!on) {
      // Anonymous means anonymous: anything already typed is cleared, and the
      // submission below never includes these fields at all.
      setName('')
      setBusiness('')
      setEmail('')
    }
  }

  async function submit() {
    setSubmitting(true)
    setError(null)

    // Identifying keys are only present in the body when the toggle is on —
    // an anonymous submission omits them entirely, not as empty strings.
    const body: Record<string, unknown> = {
      ...ratings,
      ...choices,
      ...texts,
      is_anonymous: !identified,
      website: honeypot,
      elapsed: Date.now() - startedAt,
    }
    if (identified) {
      if (name.trim()) body.name = name.trim()
      if (business.trim()) body.business = business.trim()
      if (email.trim()) body.email = email.trim()
    }

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error()
      setDone(true)
    } catch {
      setError('Something went wrong sending your feedback. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="card p-10 text-center">
        <span className="section-label">Thank You</span>
        <h2 className="text-2xl font-bold text-navy-900 tracking-tight">
          Your feedback is in.
        </h2>
        <p className="mt-3 text-charcoal-700 leading-relaxed">
          Thank you for taking the time — it goes straight into planning next year.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Ratings */}
      <div className="card p-6">
        <h2 className="font-bold text-lg text-navy-900 tracking-tight">How was the evening?</h2>
        <p className="text-sm text-gray-500 mt-1">One to five stars. Skip anything you like.</p>
        <div className="mt-3 divide-y divide-navy-50">
          {RATING_LABELS.map(([key, label]) => (
            <StarRow
              key={key}
              label={label}
              value={ratings[key]}
              onChange={(v) => setRatings((r) => ({ ...r, [key]: v }))}
            />
          ))}
        </div>
      </div>

      {/* Quick choices */}
      <div className="card p-6">
        <h2 className="font-bold text-lg text-navy-900 tracking-tight">A few quick ones</h2>
        <div className="mt-4 space-y-5">
          {CHOICE_QUESTIONS.map(({ key, question, options }) => (
            <fieldset key={key}>
              <legend className="text-sm font-semibold text-navy-900">{question}</legend>
              <div className="flex flex-wrap gap-2 mt-2.5">
                {options.map(([value, label]) => {
                  const on = choices[key] === value
                  return (
                    <button
                      key={value}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() =>
                        setChoices((c) => ({ ...c, [key]: on ? null : value }))
                      }
                      className={`px-4 py-1.5 rounded-full text-sm border transition ${
                        on
                          ? 'bg-navy-900 text-white border-navy-900'
                          : 'bg-white text-charcoal-700 border-navy-200 hover:border-sky-400'
                      }`}
                    >
                      {label}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          ))}
        </div>
      </div>

      {/* Free text */}
      <div className="card p-6">
        <h2 className="font-bold text-lg text-navy-900 tracking-tight">In your own words</h2>
        <p className="text-sm text-gray-500 mt-1">All optional.</p>
        <div className="mt-4 space-y-4">
          {TEXT_QUESTIONS.map(({ key, question }) => (
            <label key={key} className="block">
              <span className="text-sm font-semibold text-navy-900">{question}</span>
              <textarea
                value={texts[key]}
                onChange={(e) => setTexts((t) => ({ ...t, [key]: e.target.value }))}
                rows={3}
                className={inputClass}
              />
            </label>
          ))}
        </div>
      </div>

      {/* About you — optional, off by default */}
      <div className="card p-6">
        <h2 className="font-bold text-lg text-navy-900 tracking-tight">
          About you <span className="text-sm font-normal text-gray-400">— optional</span>
        </h2>
        <p className="text-sm text-charcoal-700 mt-2 leading-relaxed">
          If you leave this switched off we do not record who you are, and we have no way of
          working it out afterwards.
        </p>
        <label className="flex items-center gap-3 mt-4 cursor-pointer">
          <button
            type="button"
            role="switch"
            aria-checked={identified}
            onClick={() => toggleIdentified(!identified)}
            className={`relative w-11 h-6 rounded-full transition-colors ${
              identified ? 'bg-navy-900' : 'bg-navy-100'
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${
                identified ? 'left-[22px]' : 'left-0.5'
              }`}
            />
          </button>
          <span
            className="text-sm font-semibold text-navy-900"
            onClick={() => toggleIdentified(!identified)}
          >
            I am happy to be identified
          </span>
        </label>

        {identified && (
          <div className="grid sm:grid-cols-3 gap-4 mt-5">
            <label className="block">
              <span className="text-sm font-semibold text-navy-900">
                Name <span className="font-normal text-gray-400">optional</span>
              </span>
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-navy-900">
                Business <span className="font-normal text-gray-400">optional</span>
              </span>
              <input
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-navy-900">
                Email <span className="font-normal text-gray-400">optional</span>
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </label>
          </div>
        )}
      </div>

      {/* Honeypot — invisible to people, tempting to bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </label>
      </div>

      {error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-sm p-4">
          {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button type="button" onClick={submit} disabled={submitting} className="btn-gold-lg">
          {submitting ? 'Sending' : 'Send Your Feedback'}
        </button>
        <p className="text-sm text-gray-500">Nothing is required — send as much or as little as you like.</p>
      </div>
    </div>
  )
}
