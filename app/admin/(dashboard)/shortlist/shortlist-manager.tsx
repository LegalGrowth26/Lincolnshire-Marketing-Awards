'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { armInvites, setShortlisted, suppressInvites } from '../../actions'

type Row = {
  id: string
  category_id: number
  category_title: string
  company_name: string
  contact_name: string | null
  email: string
  is_shortlisted: boolean
  invite_state: string
  invited_at: string | null
  reminder_count: number
  has_booked: boolean
  seats_booked: number
}

type Results = Record<string, { score: number | null; placement: string | null }>

const FILTERS = [
  { key: 'all', label: 'Everyone' },
  { key: 'shortlisted', label: 'On the shortlist' },
  { key: 'not_invited', label: 'Shortlisted, not invited' },
  { key: 'invited_not_booked', label: 'Invited, not booked' },
  { key: 'booked', label: 'Booked' },
] as const

export default function ShortlistManager({
  rows,
  categories,
  results,
}: {
  rows: Row[]
  categories: { id: number; title: string }[]
  results: Results
}) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['key']>('all')
  const [showResults, setShowResults] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [notice, setNotice] = useState<string | null>(null)
  const [pending, start] = useTransition()
  const router = useRouter()

  const visible = useMemo(() => {
    return rows.filter((r) => {
      switch (filter) {
        case 'shortlisted':
          return r.is_shortlisted
        case 'not_invited':
          return r.is_shortlisted && (r.invite_state === 'draft' || r.invite_state === 'armed')
        case 'invited_not_booked':
          return r.invite_state === 'invited' && !r.has_booked
        case 'booked':
          return r.has_booked
        default:
          return true
      }
    })
  }, [rows, filter])

  const grouped = useMemo(() => {
    const m = new Map<number, Row[]>()
    for (const r of visible) {
      const list = m.get(r.category_id) ?? []
      list.push(r)
      m.set(r.category_id, list)
    }
    return m
  }, [visible])

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function selectAllVisible() {
    setSelected(new Set(visible.map((r) => r.id)))
  }

  function run(fn: () => Promise<unknown>, message: string) {
    start(async () => {
      await fn()
      setSelected(new Set())
      setNotice(message)
      router.refresh()
    })
  }

  function doArm() {
    const ids = [...selected]
    const eligible = rows.filter(
      (r) => ids.includes(r.id) && r.is_shortlisted && r.invite_state !== 'invited',
    )
    if (eligible.length === 0) {
      setNotice('Nothing to arm. Rows must be ticked as shortlisted and not already invited.')
      return
    }
    const ok = window.confirm(
      `Arm ${eligible.length} congratulations email(s)?\n\nThey send on the next daily run, or immediately if you press "Run email jobs now" on the dashboard. Once an email is sent it cannot be unsent.`,
    )
    if (!ok) return
    run(
      async () => armInvites(eligible.map((r) => r.id)),
      `${eligible.length} invite(s) armed and queued.`,
    )
  }

  return (
    <section className="bg-white border border-neutral-200 rounded-xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">Manage entries</h2>
          <p className="text-sm text-neutral-500 mt-1">
            {rows.filter((r) => r.is_shortlisted).length} on the shortlist, {rows.length} imported
          </p>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showResults}
            onChange={(e) => setShowResults(e.target.checked)}
          />
          <span className={showResults ? 'font-semibold text-red-700' : ''}>
            Show scores and results
          </span>
        </label>
      </div>

      <div className="flex flex-wrap gap-2 mt-5">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-full text-sm border transition ${
              filter === f.key
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'bg-white text-neutral-700 border-neutral-300 hover:border-neutral-500'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-5 border-t border-neutral-100 pt-5">
        <button onClick={selectAllVisible} className="text-sm underline underline-offset-4">
          Select all visible ({visible.length})
        </button>
        <span className="text-sm text-neutral-400">{selected.size} selected</span>
        <div className="flex flex-wrap gap-2 ml-auto">
          <button
            disabled={!selected.size || pending}
            onClick={() =>
              run(
                async () => setShortlisted([...selected], true),
                `${selected.size} marked as shortlisted.`,
              )
            }
            className="text-sm font-semibold border border-neutral-300 rounded-md px-3 py-1.5 disabled:opacity-40 hover:bg-neutral-50"
          >
            Mark shortlisted
          </button>
          <button
            disabled={!selected.size || pending}
            onClick={() =>
              run(
                async () => setShortlisted([...selected], false),
                `${selected.size} removed from the shortlist.`,
              )
            }
            className="text-sm font-semibold border border-neutral-300 rounded-md px-3 py-1.5 disabled:opacity-40 hover:bg-neutral-50"
          >
            Remove from shortlist
          </button>
          <button
            disabled={!selected.size || pending}
            onClick={() =>
              run(async () => suppressInvites([...selected]), 'Invites held back.')
            }
            className="text-sm font-semibold border border-neutral-300 rounded-md px-3 py-1.5 disabled:opacity-40 hover:bg-neutral-50"
          >
            Hold back
          </button>
          <button
            disabled={!selected.size || pending}
            onClick={doArm}
            className="text-sm font-semibold bg-neutral-950 text-white rounded-md px-4 py-1.5 disabled:opacity-40"
          >
            Arm invites
          </button>
        </div>
      </div>

      {notice && (
        <p className="mt-4 text-sm bg-neutral-100 border border-neutral-200 rounded-md p-3">
          {notice}
        </p>
      )}

      <div className="mt-7 space-y-8">
        {categories
          .filter((c) => grouped.has(c.id))
          .map((c) => {
            const list = grouped.get(c.id)!
            return (
              <div key={c.id}>
                <div className="flex items-baseline justify-between border-b border-neutral-200 pb-2">
                  <h3 className="font-bold">{c.title}</h3>
                  <p className="text-sm text-neutral-500">
                    {list.filter((r) => r.is_shortlisted).length} shortlisted of {list.length}
                  </p>
                </div>
                <table className="w-full text-sm mt-1">
                  <tbody>
                    {list.map((r) => {
                      const res = results[r.id]
                      return (
                        <tr key={r.id} className="border-b border-neutral-100 last:border-0">
                          <td className="py-2.5 pr-3 w-8">
                            <input
                              type="checkbox"
                              checked={selected.has(r.id)}
                              onChange={() => toggle(r.id)}
                            />
                          </td>
                          <td className="py-2.5 pr-4">
                            <p className="font-medium">{r.company_name}</p>
                            <p className="text-neutral-500 text-xs">
                              {r.contact_name} &middot; {r.email}
                            </p>
                          </td>
                          <td className="py-2.5 pr-4">
                            {r.is_shortlisted ? (
                              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-neutral-900 text-white">
                                Shortlisted
                              </span>
                            ) : (
                              <span className="text-xs text-neutral-400">Not shortlisted</span>
                            )}
                          </td>
                          <td className="py-2.5 pr-4 text-neutral-600">
                            {r.invite_state === 'invited'
                              ? `Invited${r.reminder_count ? `, ${r.reminder_count} reminder(s)` : ''}`
                              : r.invite_state === 'armed'
                                ? 'Queued'
                                : r.invite_state === 'suppressed'
                                  ? 'Held back'
                                  : 'Not invited'}
                          </td>
                          <td className="py-2.5 pr-4">
                            {r.has_booked ? (
                              <span className="font-semibold text-green-700">
                                {r.seats_booked} {r.seats_booked === 1 ? 'seat' : 'seats'}
                              </span>
                            ) : (
                              <span className="text-neutral-400">Not booked</span>
                            )}
                          </td>
                          {showResults && (
                            <td className="py-2.5 text-right text-red-800 font-semibold whitespace-nowrap">
                              {res?.score ?? ''}
                              {res?.placement === 'winner' && ' Winner'}
                              {res?.placement === 'highly_commended' && ' Highly commended'}
                            </td>
                          )}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )
          })}
        {visible.length === 0 && (
          <p className="text-neutral-500 py-8 text-center">Nothing matches that filter.</p>
        )}
      </div>
    </section>
  )
}
