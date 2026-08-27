'use client'

import { useMemo, useState } from 'react'

type Guest = {
  seat_number: number
  full_name: string | null
  company: string | null
  dietary_tags: string[] | null
  dietary_notes: string | null
  accessibility_notes: string | null
}

type Option = { slug: string; label: string }

type Seat = {
  seat_number: number
  full_name: string
  company: string
  dietary_tags: string[]
  dietary_notes: string
  accessibility_notes: string
}

export default function BookingForm({
  token,
  seats,
  buyerName,
  initialGuests,
  options,
  alreadyComplete,
}: {
  token: string
  seats: number
  buyerName: string
  initialGuests: Guest[]
  options: Option[]
  alreadyComplete: boolean
}) {
  const initial = useMemo<Seat[]>(() => {
    return Array.from({ length: seats }, (_, i) => {
      const n = i + 1
      const g = initialGuests.find((x) => x.seat_number === n)
      return {
        seat_number: n,
        full_name: g?.full_name ?? (n === 1 ? buyerName : ''),
        company: g?.company ?? '',
        dietary_tags: g?.dietary_tags ?? [],
        dietary_notes: g?.dietary_notes ?? '',
        accessibility_notes: g?.accessibility_notes ?? '',
      }
    })
  }, [seats, initialGuests, buyerName])

  const [rows, setRows] = useState<Seat[]>(initial)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(
    alreadyComplete ? 'All your guests are registered. You can still make changes below.' : null,
  )
  const [error, setError] = useState<string | null>(null)

  const named = rows.filter((r) => r.full_name.trim().length > 0).length

  function update(i: number, patch: Partial<Seat>) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)))
  }

  function toggleTag(i: number, slug: string) {
    setRows((prev) =>
      prev.map((r, idx) => {
        if (idx !== i) return r
        let tags = r.dietary_tags.includes(slug)
          ? r.dietary_tags.filter((t) => t !== slug)
          : [...r.dietary_tags, slug]
        // "No requirements" is exclusive both ways.
        if (slug === 'none' && tags.includes('none')) tags = ['none']
        else if (slug !== 'none') tags = tags.filter((t) => t !== 'none')
        return { ...r, dietary_tags: tags }
      }),
    )
  }

  async function save() {
    setSaving(true)
    setError(null)
    setMessage(null)

    const needsNote = rows.find(
      (r) => r.dietary_tags.includes('other') && !r.dietary_notes.trim(),
    )
    if (needsNote) {
      setError(
        `Seat ${needsNote.seat_number}: you have ticked "Other", so please tell us what it is.`,
      )
      setSaving(false)
      return
    }

    try {
      const res = await fetch(`/api/booking/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seats: rows }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Could not save')
      setMessage(
        json.complete
          ? 'Saved. That is everyone, thank you. A confirmation is on its way to your inbox.'
          : `Saved. ${json.unnamed} ${json.unnamed === 1 ? 'seat still needs' : 'seats still need'} a name, come back any time.`,
      )
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-8">
        <p className="text-sm text-neutral-500">
          {named} of {seats} {seats === 1 ? 'seat' : 'seats'} named
        </p>
        <div className="h-2 flex-1 max-w-xs bg-neutral-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-neutral-900 transition-all"
            style={{ width: `${(named / seats) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-5">
        {rows.map((row, i) => (
          <section key={row.seat_number} className="border border-neutral-200 rounded-xl p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="font-bold text-lg">
                Seat {row.seat_number}
                {row.seat_number === 1 && (
                  <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    You
                  </span>
                )}
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-5">
              <label className="block">
                <span className="text-sm font-semibold">Full name</span>
                <input
                  value={row.full_name}
                  onChange={(e) => update(i, { full_name: e.target.value })}
                  className="mt-2 w-full border border-neutral-300 rounded-md px-3 py-2"
                  placeholder="First and last name"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">
                  Company or job title{' '}
                  <span className="font-normal text-neutral-400">optional</span>
                </span>
                <input
                  value={row.company}
                  onChange={(e) => update(i, { company: e.target.value })}
                  className="mt-2 w-full border border-neutral-300 rounded-md px-3 py-2"
                />
              </label>
            </div>

            <fieldset className="mt-5">
              <legend className="text-sm font-semibold">Dietary requirements</legend>
              <div className="flex flex-wrap gap-2 mt-3">
                {options.map((o) => {
                  const on = row.dietary_tags.includes(o.slug)
                  return (
                    <button
                      key={o.slug}
                      type="button"
                      onClick={() => toggleTag(i, o.slug)}
                      aria-pressed={on}
                      className={`px-3 py-1.5 rounded-full text-sm border transition ${
                        on
                          ? 'bg-neutral-900 text-white border-neutral-900'
                          : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-500'
                      }`}
                    >
                      {o.label}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <div className="grid sm:grid-cols-2 gap-4 mt-5">
              <label className="block">
                <span className="text-sm font-semibold">
                  Anything else the kitchen needs to know
                </span>
                <textarea
                  value={row.dietary_notes}
                  onChange={(e) => update(i, { dietary_notes: e.target.value })}
                  rows={2}
                  className="mt-2 w-full border border-neutral-300 rounded-md px-3 py-2"
                  placeholder="Severity of an allergy, other requirements"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold">
                  Access or seating notes{' '}
                  <span className="font-normal text-neutral-400">optional</span>
                </span>
                <textarea
                  value={row.accessibility_notes}
                  onChange={(e) => update(i, { accessibility_notes: e.target.value })}
                  rows={2}
                  className="mt-2 w-full border border-neutral-300 rounded-md px-3 py-2"
                  placeholder="Step free access, hearing loop, anything else"
                />
              </label>
            </div>
          </section>
        ))}
      </div>

      {error && (
        <p className="mt-6 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-4">
          {error}
        </p>
      )}
      {message && (
        <p className="mt-6 text-sm text-green-800 bg-green-50 border border-green-200 rounded-md p-4">
          {message}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          onClick={save}
          disabled={saving}
          className="bg-neutral-950 text-white px-7 py-3 rounded-md font-semibold disabled:opacity-50"
        >
          {saving ? 'Saving' : 'Save guest details'}
        </button>
        <p className="text-sm text-neutral-500">
          You can save now and come back to this link any time before the event.
        </p>
      </div>
    </div>
  )
}
