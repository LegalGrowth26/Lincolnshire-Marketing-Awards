'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateGuest, setOrderSeats, setOrderStatus, createCompedBooking } from '../../actions'

type Guest = {
  id: string
  seat_number: number
  full_name: string | null
  company: string | null
  dietary_tags: string[] | null
  dietary_notes: string | null
  accessibility_notes: string | null
}

type Order = {
  id: string
  buyer_name: string | null
  buyer_email: string
  buyer_company: string | null
  seats: number
  ticket_type: string
  status: string
  is_comped: boolean
  details_completed_at: string | null
  created_at: string
  guests: Guest[]
}

type Option = { slug: string; label: string }

function orderLabel(o: Order) {
  const seats = Number(o.seats)
  if (o.is_comped) return `Comped · ${seats} ${seats === 1 ? 'seat' : 'seats'}`
  if (o.ticket_type === 'table8') {
    return seats === 8 ? 'Table of 8' : `Table of 8 · ${seats} seats`
  }
  return seats === 1 ? 'Single ticket' : `${seats} single tickets`
}

export default function GuestTable({
  orders,
  options,
}: {
  orders: Order[]
  options: Option[]
}) {
  const [editing, setEditing] = useState<string | null>(null)
  const [pending, start] = useTransition()
  const router = useRouter()

  return (
    <div className="space-y-6">
      <CompedForm />

      {orders.length === 0 ? (
        <p className="bg-white border border-neutral-200 rounded-xl p-10 text-center text-neutral-500">
          No paid bookings yet.
        </p>
      ) : (
        orders.map((o) => {
          const named = o.guests.filter((g) => (g.full_name ?? '').trim()).length
          return (
            <section key={o.id} className="bg-white border border-neutral-200 rounded-xl p-6">
              {/* Booking heading */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-bold text-lg">
                    {o.buyer_name || o.buyer_email}
                    {o.buyer_company && (
                      <span className="font-normal text-neutral-500">
                        {' '}
                        &middot; {o.buyer_company}
                      </span>
                    )}
                  </h2>
                  <p className="text-sm text-neutral-500 mt-1">
                    <span className="font-semibold text-neutral-700">{orderLabel(o)}</span>{' '}
                    &middot; {o.buyer_email} &middot; booked{' '}
                    {new Date(o.created_at).toLocaleDateString('en-GB')}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {o.is_comped && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-sky-100 text-sky-800">
                      Comped
                    </span>
                  )}
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      named >= o.seats
                        ? 'bg-green-100 text-green-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {named} of {o.seats} named
                  </span>
                  <button
                    onClick={() =>
                      start(async () => {
                        await setOrderSeats(o.id, Number(o.seats) + 1)
                        router.refresh()
                      })
                    }
                    disabled={pending || Number(o.seats) >= 40}
                    className="text-sm font-semibold border border-neutral-300 rounded-md px-3 py-1.5 hover:bg-neutral-50 disabled:opacity-50"
                    title="Add one seat to this booking without another payment"
                  >
                    + Add seat
                  </button>
                  <select
                    defaultValue={o.status}
                    onChange={(e) =>
                      start(async () => {
                        await setOrderStatus(
                          o.id,
                          e.target.value as 'paid' | 'refunded' | 'cancelled',
                        )
                        router.refresh()
                      })
                    }
                    className="text-sm border border-neutral-300 rounded-md px-2 py-1 bg-white"
                  >
                    <option value="paid">Paid</option>
                    <option value="refunded">Refunded</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Seats */}
              <div className="mt-5 divide-y divide-neutral-100">
                {o.guests
                  .slice()
                  .sort((a, b) => a.seat_number - b.seat_number)
                  .map((g) => (
                    <GuestRow
                      key={g.id}
                      guest={g}
                      options={options}
                      open={editing === g.id}
                      onOpen={() => setEditing(editing === g.id ? null : g.id)}
                      onSaved={() => {
                        setEditing(null)
                        router.refresh()
                      }}
                      pending={pending}
                    />
                  ))}
              </div>
            </section>
          )
        })
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Comped bookings — compere, judges, guests of the organisers.
// ---------------------------------------------------------------------------

function CompedForm() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [email, setEmail] = useState('')
  const [seats, setSeats] = useState('1')
  const [error, setError] = useState<string | null>(null)
  const [saving, start] = useTransition()
  const router = useRouter()

  function submit() {
    setError(null)
    start(async () => {
      const res = await createCompedBooking({ name, company, email, seats: Number(seats) })
      if ('error' in res) {
        setError(res.error)
        return
      }
      setOpen(false)
      setName('')
      setCompany('')
      setEmail('')
      setSeats('1')
      router.refresh()
    })
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold">Comped bookings</p>
          <p className="text-sm text-neutral-500 mt-0.5">
            Compere, judges, guests of the organisers. Counts in the venue headcount, never
            in revenue.
          </p>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-sm font-semibold border border-neutral-300 rounded-md px-4 py-2 hover:bg-neutral-50"
        >
          {open ? 'Cancel' : 'Add comped booking'}
        </button>
      </div>

      {open && (
        <div className="mt-4 bg-neutral-50 border border-neutral-200 rounded-lg p-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name (required)"
              className="border border-neutral-300 rounded-md px-3 py-2 text-sm"
            />
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company or role, optional"
              className="border border-neutral-300 rounded-md px-3 py-2 text-sm"
            />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email, optional"
              type="email"
              className="border border-neutral-300 rounded-md px-3 py-2 text-sm"
            />
            <input
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              type="number"
              min={1}
              max={40}
              placeholder="Seats"
              className="border border-neutral-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          {error && <p className="text-sm text-red-700 mt-3">{error}</p>}
          <button
            onClick={submit}
            disabled={saving}
            className="mt-4 bg-neutral-950 text-white px-5 py-2 rounded-md text-sm font-semibold disabled:opacity-50"
          >
            {saving ? 'Adding' : 'Add booking'}
          </button>
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// One seat. The edit form and its save path are unchanged: updateGuest takes
// exactly the same shape it always has.
// ---------------------------------------------------------------------------

function GuestRow({
  guest,
  options,
  open,
  onOpen,
  onSaved,
  pending,
}: {
  guest: Guest
  options: Option[]
  open: boolean
  onOpen: () => void
  onSaved: () => void
  pending: boolean
}) {
  const [name, setName] = useState(guest.full_name ?? '')
  const [company, setCompany] = useState(guest.company ?? '')
  const [tags, setTags] = useState<string[]>(guest.dietary_tags ?? [])
  const [notes, setNotes] = useState(guest.dietary_notes ?? '')
  const [access, setAccess] = useState(guest.accessibility_notes ?? '')
  const [saving, start] = useTransition()

  const visibleTags = (guest.dietary_tags ?? []).filter((t) => t !== 'none')

  function save() {
    start(async () => {
      await updateGuest(guest.id, {
        full_name: name,
        company,
        dietary_tags: tags,
        dietary_notes: notes,
        accessibility_notes: access,
      })
      onSaved()
    })
  }

  return (
    <div className="py-3">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-medium flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-neutral-400 text-sm">Seat {guest.seat_number}</span>
            {guest.full_name ? (
              <span>
                {guest.full_name}
                {guest.company && (
                  <span className="font-normal text-neutral-500"> &middot; {guest.company}</span>
                )}
              </span>
            ) : (
              <span className="text-neutral-400">Not yet named</span>
            )}
            {visibleTags.map((t) => (
              <span
                key={t}
                className="text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full"
              >
                {options.find((o) => o.slug === t)?.label ?? t}
              </span>
            ))}
          </p>
          {(guest.dietary_notes || guest.accessibility_notes) && (
            <p className="text-sm text-neutral-600 mt-1">
              {guest.dietary_notes}
              {guest.dietary_notes && guest.accessibility_notes && ' · '}
              {guest.accessibility_notes && `Access: ${guest.accessibility_notes}`}
            </p>
          )}
        </div>
        <button onClick={onOpen} className="text-sm underline underline-offset-4 shrink-0">
          {open ? 'Cancel' : 'Edit'}
        </button>
      </div>

      {open && (
        <div className="mt-4 bg-neutral-50 border border-neutral-200 rounded-lg p-4">
          <div className="grid sm:grid-cols-2 gap-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="border border-neutral-300 rounded-md px-3 py-2 text-sm"
            />
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company or job title"
              className="border border-neutral-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {options.map((o) => {
              const on = tags.includes(o.slug)
              return (
                <button
                  key={o.slug}
                  type="button"
                  onClick={() =>
                    setTags((prev) => {
                      let next = prev.includes(o.slug)
                        ? prev.filter((t) => t !== o.slug)
                        : [...prev, o.slug]
                      if (o.slug === 'none' && next.includes('none')) next = ['none']
                      else if (o.slug !== 'none') next = next.filter((t) => t !== 'none')
                      return next
                    })
                  }
                  className={`px-2.5 py-1 rounded-full text-xs border ${
                    on
                      ? 'bg-neutral-900 text-white border-neutral-900'
                      : 'bg-white border-neutral-300'
                  }`}
                >
                  {o.label}
                </button>
              )
            })}
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mt-3">
            <input
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Dietary notes"
              className="border border-neutral-300 rounded-md px-3 py-2 text-sm"
            />
            <input
              value={access}
              onChange={(e) => setAccess(e.target.value)}
              placeholder="Access or seating notes"
              className="border border-neutral-300 rounded-md px-3 py-2 text-sm"
            />
          </div>
          <button
            onClick={save}
            disabled={saving || pending}
            className="mt-4 bg-neutral-950 text-white px-5 py-2 rounded-md text-sm font-semibold disabled:opacity-50"
          >
            {saving ? 'Saving' : 'Save'}
          </button>
        </div>
      )}
    </div>
  )
}
