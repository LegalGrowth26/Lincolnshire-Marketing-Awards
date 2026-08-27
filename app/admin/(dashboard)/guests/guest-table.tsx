'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateGuest, setOrderSeats, setOrderStatus } from '../../actions'

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
  details_completed_at: string | null
  created_at: string
  guests: Guest[]
}

export default function GuestTable({
  orders,
  options,
}: {
  orders: Order[]
  options: { slug: string; label: string }[]
}) {
  const [editing, setEditing] = useState<string | null>(null)
  const [pending, start] = useTransition()
  const router = useRouter()

  if (orders.length === 0) {
    return (
      <p className="bg-white border border-neutral-200 rounded-xl p-10 text-center text-neutral-500">
        No tickets sold yet.
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {orders.map((o) => {
        const named = o.guests.filter((g) => (g.full_name ?? '').trim()).length
        return (
          <section key={o.id} className="bg-white border border-neutral-200 rounded-xl p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-bold text-lg">
                  {o.buyer_name || o.buyer_email}
                  {o.buyer_company && (
                    <span className="font-normal text-neutral-500"> &middot; {o.buyer_company}</span>
                  )}
                </h2>
                <p className="text-sm text-neutral-500 mt-1">
                  {o.ticket_type === 'table8' ? 'Table of 8' : 'Single ticket'} &middot;{' '}
                  {o.buyer_email} &middot; booked{' '}
                  {new Date(o.created_at).toLocaleDateString('en-GB')}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    named >= o.seats
                      ? 'bg-green-100 text-green-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {named} of {o.seats} named
                </span>
                <label className="text-sm flex items-center gap-2">
                  Seats
                  <input
                    type="number"
                    min={1}
                    max={40}
                    defaultValue={o.seats}
                    onBlur={(e) => {
                      const v = Number(e.target.value)
                      if (v !== o.seats) {
                        start(async () => {
                          await setOrderSeats(o.id, v)
                          router.refresh()
                        })
                      }
                    }}
                    className="w-16 border border-neutral-300 rounded-md px-2 py-1"
                  />
                </label>
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
      })}
    </div>
  )
}

function GuestRow({
  guest,
  options,
  open,
  onOpen,
  onSaved,
  pending,
}: {
  guest: Guest
  options: { slug: string; label: string }[]
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
        <div>
          <p className="font-medium">
            <span className="text-neutral-400 text-sm mr-2">Seat {guest.seat_number}</span>
            {guest.full_name || <span className="text-neutral-400">Not yet named</span>}
          </p>
          {(guest.dietary_tags ?? []).length > 0 && (
            <p className="text-sm text-neutral-600 mt-1">
              {(guest.dietary_tags ?? [])
                .map((t) => options.find((o) => o.slug === t)?.label ?? t)
                .join(', ')}
              {guest.dietary_notes && ` | ${guest.dietary_notes}`}
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
