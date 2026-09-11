import { sql } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const RATING_LABELS: [string, string][] = [
  ['rating_overall', 'Overall'],
  ['rating_venue', 'Venue and room'],
  ['rating_food', 'Food'],
  ['rating_entertainment', 'Entertainment'],
  ['rating_ceremony', 'Awards ceremony'],
]

const CHOICE_QUESTIONS: { key: string; label: string; options: [string, string][] }[] = [
  {
    key: 'length_felt',
    label: 'Length of the evening',
    options: [
      ['too_short', 'Too short'],
      ['about_right', 'About right'],
      ['too_long', 'Too long'],
    ],
  },
  {
    key: 'price_felt',
    label: 'Ticket price',
    options: [
      ['too_cheap', 'Too cheap'],
      ['about_right', 'About right'],
      ['too_expensive', 'Too expensive'],
    ],
  },
  {
    key: 'would_return',
    label: 'Would come again',
    options: [
      ['yes', 'Yes'],
      ['maybe', 'Maybe'],
      ['no', 'No'],
    ],
  },
  {
    key: 'would_enter',
    label: 'Would enter again',
    options: [
      ['yes', 'Yes'],
      ['maybe', 'Maybe'],
      ['no', 'No'],
      ['did_not_enter', 'Did not enter'],
    ],
  },
]

const TEXT_QUESTIONS: [string, string][] = [
  ['best_part', 'Best part of the night'],
  ['would_change', 'Would change'],
  ['category_ideas', 'Category ideas'],
  ['anything_else', 'Anything else'],
]

export default async function FeedbackAdminPage() {
  const safe = <T,>(p: Promise<T[]>): Promise<T[] | null> => p.catch(() => null)

  const [summary, splits, rows] = await Promise.all([
    safe(sql`
      select count(*)::int as total,
             (count(*) filter (where is_anonymous))::int as anonymous_count,
             avg(rating_overall)       as avg_overall,
             avg(rating_venue)         as avg_venue,
             avg(rating_food)          as avg_food,
             avg(rating_entertainment) as avg_entertainment,
             avg(rating_ceremony)      as avg_ceremony
      from feedback`),
    safe(sql`
      select 'length_felt' as q, length_felt as v, count(*)::int as n
        from feedback where length_felt is not null group by length_felt
      union all
      select 'price_felt', price_felt, count(*)::int
        from feedback where price_felt is not null group by price_felt
      union all
      select 'would_return', would_return, count(*)::int
        from feedback where would_return is not null group by would_return
      union all
      select 'would_enter', would_enter, count(*)::int
        from feedback where would_enter is not null group by would_enter`),
    safe(sql`
      select id, created_at, is_anonymous, name, business,
             best_part, would_change, category_ideas, anything_else
      from feedback
      order by created_at desc`),
  ])

  const s = summary?.[0] ?? { total: 0, anonymous_count: 0 }
  const total = Number(s.total ?? 0)
  const anon = Number(s.anonymous_count ?? 0)
  const avg = (key: string) => {
    const v = Number((s as Record<string, unknown>)[`avg_${key}`])
    return Number.isFinite(v) && v > 0 ? v.toFixed(1) : '—'
  }
  const splitCount = (q: string, v: string) =>
    Number((splits ?? []).find((r) => r.q === q && r.v === v)?.n ?? 0)

  const textRows = (rows ?? []).filter((r) =>
    TEXT_QUESTIONS.some(([key]) => (r[key] ?? '').toString().trim().length > 0),
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Feedback</h1>
          <p className="text-neutral-500 mt-2">
            What people thought of the night. Anonymous responses carry no identity anywhere —
            not here, not in the export.
          </p>
        </div>
        <a
          href="/api/admin/export/feedback"
          className="text-sm font-semibold border border-neutral-300 rounded-md px-4 py-2 hover:bg-neutral-50"
        >
          Download CSV
        </a>
      </div>

      {/* Counts and averages */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card label="Responses" value={String(total)} sub={`${anon} anonymous`} />
        {RATING_LABELS.slice(0, 3).map(([key, label]) => (
          <Card key={key} label={`${label} (avg)`} value={avg(key.replace('rating_', ''))} sub="out of 5" />
        ))}
      </section>
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {RATING_LABELS.slice(3).map(([key, label]) => (
          <Card key={key} label={`${label} (avg)`} value={avg(key.replace('rating_', ''))} sub="out of 5" />
        ))}
      </section>

      {/* Choice splits */}
      <section className="grid lg:grid-cols-2 gap-6">
        {CHOICE_QUESTIONS.map(({ key, label, options }) => {
          const counts = options.map(([v, l]) => ({ v, l, n: splitCount(key, v) }))
          const max = Math.max(1, ...counts.map((c) => c.n))
          return (
            <div key={key} className="bg-white border border-neutral-200 rounded-xl p-6">
              <h2 className="font-bold mb-4">{label}</h2>
              <ul className="space-y-3">
                {counts.map(({ v, l, n }) => (
                  <li key={v}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{l}</span>
                      <span className="tabular-nums text-neutral-500">{n}</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-neutral-900"
                        style={{ width: `${Math.round((n / max) * 100)}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </section>

      {/* Free text, newest first */}
      <section className="bg-white border border-neutral-200 rounded-xl p-6">
        <h2 className="text-lg font-bold mb-1">In their own words</h2>
        <p className="text-sm text-neutral-500 mb-5">
          Every free-text answer in full, newest first.
        </p>
        {textRows.length === 0 ? (
          <p className="text-neutral-500 py-6 text-center">No written answers yet.</p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {textRows.map((r) => (
              <li key={r.id} className="py-5">
                <p className="text-sm text-neutral-500">
                  {new Date(r.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                  {' · '}
                  {r.is_anonymous ? (
                    <span className="italic">Anonymous</span>
                  ) : (
                    <span className="font-semibold text-neutral-800">
                      {[r.name, r.business].filter(Boolean).join(', ') || 'Identified, no name given'}
                    </span>
                  )}
                </p>
                <div className="mt-2 space-y-3">
                  {TEXT_QUESTIONS.map(([key, label]) =>
                    (r[key] ?? '').toString().trim() ? (
                      <div key={key}>
                        <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                          {label}
                        </p>
                        <p className="text-sm text-neutral-800 whitespace-pre-line mt-0.5">
                          {r[key]}
                        </p>
                      </div>
                    ) : null,
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

function Card({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-6">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="text-3xl font-bold mt-2 tabular-nums">{value}</p>
      {sub && <p className="text-sm mt-2 text-neutral-500">{sub}</p>}
    </div>
  )
}
