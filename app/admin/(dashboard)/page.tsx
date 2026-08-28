import Link from 'next/link'
import { sql } from '@/lib/db'
import { getSettings, poundsFromPence, formatEventDate, daysUntil } from '@/lib/config'
import {
  RunJobsButton,
  SyncStripeButton,
  CancelPendingButton,
  CopyButton,
  LogoutButton,
} from './client-bits'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function Dashboard() {
  const settings = await getSettings()

  // The previous data layer surfaced query errors as null data rather than
  // throwing; keep the dashboard rendering (with fallbacks) the same way.
  const safe = <T,>(p: Promise<T[]>): Promise<T[] | null> => p.catch(() => null)

  const [seatSummary, completion, dietary, notes, shortlist, pendingOrders, unnamedOrders, recentOrders, recentEmails] =
    await Promise.all([
      safe(sql`select * from v_seat_summary`),
      safe(sql`select * from v_guest_completion`),
      safe(sql`select * from v_dietary_counts`),
      safe(sql`select * from v_dietary_notes`),
      safe(sql`select * from v_shortlist_status where is_shortlisted = true`),
      safe(sql`select * from v_pending_orders`),
      safe(sql`
        select o.id, o.buyer_name, o.buyer_company, o.buyer_email, o.seats,
               o.ticket_type, o.created_at,
               (o.seats - coalesce(n.named, 0))::int as seats_unnamed
        from orders o
        left join lateral (
          select count(*)::int as named
          from guests g
          where g.order_id = o.id
            and g.full_name is not null
            and length(trim(g.full_name)) > 0
        ) n on true
        where o.status = 'paid' and o.details_completed_at is null
        order by o.created_at`),
      safe(sql`
        select id, buyer_name, buyer_email, seats, ticket_type, amount_total,
               created_at, details_completed_at, status
        from orders order by created_at desc limit 20`),
      safe(sql`
        select id, template, recipient_email, status, sent_at, error
        from email_log order by sent_at desc limit 20`),
    ])

  // The Neon driver returns bigint (count/sum) as strings, so every number
  // coming out of a v_ view is coerced here before any arithmetic —
  // "39" + "0" is "390", not 39.
  const sRaw = seatSummary?.[0] ?? {}
  const s = {
    single_orders: Number(sRaw.single_orders ?? 0),
    table_orders: Number(sRaw.table_orders ?? 0),
    seats_sold: Number(sRaw.seats_sold ?? 0),
    gross_pence: Number(sRaw.gross_pence ?? 0),
    orders_complete: Number(sRaw.orders_complete ?? 0),
    orders_outstanding: Number(sRaw.orders_outstanding ?? 0),
  }
  const cRaw = completion?.[0] ?? {}
  const c = {
    seats_total: Number(cRaw.seats_total ?? 0),
    seats_named: Number(cRaw.seats_named ?? 0),
    seats_unnamed: Number(cRaw.seats_unnamed ?? 0),
  }
  const diet = (dietary ?? [])
    .map((d) => ({ ...d, guest_count: Number(d.guest_count ?? 0) }))
    .filter((d) => d.guest_count > 0)
  const rows = (shortlist ?? []).map((r) => ({
    ...r,
    seats_booked: Number(r.seats_booked ?? 0),
  }))

  // Many businesses are shortlisted in more than one category, so the funnel
  // counts people, not nominations. One person gets one invite.
  const key = (r: { email: string }) => r.email.trim().toLowerCase()
  const people = new Set(rows.map(key))
  const uniq = (pred: (r: (typeof rows)[number]) => boolean) =>
    new Set(rows.filter(pred).map(key)).size

  const invited = uniq((r) => r.invite_state === 'invited')
  const booked = uniq((r) => r.has_booked)
  const notInvited = uniq((r) => r.invite_state === 'draft')
  const armed = uniq((r) => r.invite_state === 'armed')
  const capacity = settings.capacity_seats || 200
  const pct = Math.min(100, Math.round((s.seats_sold / capacity) * 100))
  const left = daysUntil(settings.event_date)

  const byCategory = new Map<string, typeof rows>()
  for (const r of rows) {
    const list = byCategory.get(r.category_title) ?? []
    list.push(r)
    byCategory.set(r.category_title, list)
  }

  const venueText = (notes ?? [])
    .map(
      (n) =>
        `${n.full_name || 'Name pending'} (${n.buyer_company || n.buyer_name || 'guest'}): ${
          (n.dietary_tags ?? []).join(', ') || 'no tags'
        }${n.dietary_notes ? ` | ${n.dietary_notes}` : ''}${
          n.accessibility_notes ? ` | access: ${n.accessibility_notes}` : ''
        }`,
    )
    .join('\n')

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Awards night dashboard</h1>
          <p className="text-neutral-500 mt-2">
            {formatEventDate(settings.event_date)} at {settings.venue}.{' '}
            {left > 0 ? `${left} days to go.` : 'The event has passed.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!settings.automation_enabled && (
            <span className="text-xs font-semibold uppercase tracking-wider bg-amber-100 text-amber-900 px-3 py-1.5 rounded-full">
              Automation off
            </span>
          )}
          <SyncStripeButton />
          <RunJobsButton />
          <LogoutButton />
        </div>
      </div>

      {/* Headline numbers */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card
          label="Seats sold"
          value={String(s.seats_sold)}
          sub={`${pct}% of ${capacity}`}
          bar={pct}
        />
        <Card label="Gross revenue" value={poundsFromPence(s.gross_pence)} sub="Stripe, before fees" />
        <Card
          label="Orders"
          value={String((s.single_orders ?? 0) + (s.table_orders ?? 0))}
          sub={`${s.table_orders} tables, ${s.single_orders} singles`}
        />
        <Card
          label="Guest details"
          value={`${c.seats_named} of ${c.seats_total}`}
          sub={c.seats_unnamed > 0 ? `${c.seats_unnamed} seats still unnamed` : 'All seats named'}
          tone={c.seats_unnamed > 0 ? 'amber' : 'green'}
        />
      </section>

      {/* Shortlist funnel */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card
          label="On the shortlist"
          value={String(people.size)}
          sub={`${people.size} businesses, ${rows.length} nominations`}
        />
        <Card
          label="Not yet invited"
          value={String(notInvited + armed)}
          sub={`${armed} armed and queued`}
        />
        <Card label="Invited" value={String(invited)} sub="One email each, all categories" />
        <Card
          label="Shortlisted and booked"
          value={String(booked)}
          sub={
            invited > 0
              ? `${Math.round((booked / invited) * 100)}% of those invited`
              : 'None invited yet'
          }
          tone="green"
        />
      </section>

      {/* Awaiting payment */}
      <Panel
        title="Awaiting payment"
        subtitle="Started checkout but have not paid. NOT counted in seats sold, revenue, capacity or dietaries — every total on this page filters on paid orders only."
      >
        {(pendingOrders ?? []).length === 0 ? (
          <Empty>Nobody is mid-checkout right now.</Empty>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {(pendingOrders ?? []).map((p) => (
              <li key={p.id} className="py-3 flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">
                    {p.buyer_name || p.buyer_email}
                    {p.buyer_name && (
                      <span className="font-normal text-neutral-500"> &middot; {p.buyer_email}</span>
                    )}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {p.ticket_type === 'table8' ? 'Table of 8' : 'Single ticket'} &middot;{' '}
                    {p.seats} {p.seats === 1 ? 'seat' : 'seats'} &middot; started{' '}
                    {ago(p.checkout_started_at ?? p.created_at)}
                  </p>
                </div>
                <CancelPendingButton orderId={p.id} />
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {/* Tables not yet named */}
      <Panel
        title="Tables not yet named"
        subtitle="Paid orders with seats still missing a guest name — the chase list before the venue deadline."
      >
        {(unnamedOrders ?? []).length === 0 ? (
          <Empty>Every paid seat has a name. Nothing to chase.</Empty>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {(unnamedOrders ?? []).map((o) => (
              <li key={o.id} className="py-3 flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">
                    {o.buyer_name || o.buyer_email}
                    {o.buyer_company && (
                      <span className="font-normal text-neutral-500"> &middot; {o.buyer_company}</span>
                    )}
                  </p>
                  <p className="text-sm text-neutral-500">
                    {o.ticket_type === 'table8' ? 'Table of 8' : 'Single ticket'} &middot;{' '}
                    {Number(o.seats)} {Number(o.seats) === 1 ? 'seat' : 'seats'} &middot;{' '}
                    {o.buyer_email}
                  </p>
                </div>
                <p className="shrink-0 text-sm font-semibold text-amber-700 tabular-nums">
                  {Number(o.seats_unnamed)} {Number(o.seats_unnamed) === 1 ? 'seat' : 'seats'} unnamed
                </p>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {/* Dietaries */}
      <section className="grid lg:grid-cols-2 gap-6">
        <Panel title="Dietary requirements" subtitle="Live, from registered guests">
          {diet.length === 0 ? (
            <Empty>No dietary requirements registered yet.</Empty>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {diet
                .slice()
                .sort((a, b) => b.guest_count - a.guest_count)
                .map((d) => (
                  <li key={d.slug} className="flex items-center justify-between py-3">
                    <span>{d.label}</span>
                    <span className="font-bold tabular-nums">{d.guest_count}</span>
                  </li>
                ))}
            </ul>
          )}
          <p className="mt-5 text-sm text-neutral-500">
            {c.seats_unnamed > 0
              ? `${c.seats_unnamed} seats have no guest yet, so these numbers will move.`
              : 'Every seat is accounted for, these are final numbers.'}
          </p>
        </Panel>

        <Panel
          title="Notes for the venue"
          subtitle="Free text from guests, plus access needs"
          action={
            <div className="flex gap-2">
              <CopyButton text={venueText} />
              <a
                href="/api/admin/export/venue"
                className="text-sm font-semibold border border-neutral-300 rounded-md px-3 py-1.5 hover:bg-neutral-50"
              >
                Download CSV
              </a>
            </div>
          }
        >
          {(notes ?? []).length === 0 ? (
            <Empty>Nothing to pass on yet.</Empty>
          ) : (
            <ul className="divide-y divide-neutral-100 max-h-96 overflow-y-auto">
              {(notes ?? []).map((n) => (
                <li key={n.guest_id} className="py-3">
                  <p className="font-semibold">
                    {n.full_name || <span className="text-neutral-400">Name pending</span>}
                    <span className="font-normal text-neutral-500">
                      {' '}
                      &middot; {n.buyer_company || n.buyer_name}
                    </span>
                  </p>
                  {(n.dietary_tags ?? []).length > 0 && (
                    <p className="text-sm text-neutral-600 mt-1">
                      {(n.dietary_tags ?? []).join(', ')}
                    </p>
                  )}
                  {n.dietary_notes && (
                    <p className="text-sm text-neutral-600 mt-1">{n.dietary_notes}</p>
                  )}
                  {n.accessibility_notes && (
                    <p className="text-sm text-neutral-600 mt-1">
                      Access: {n.accessibility_notes}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
          <p className="mt-4 text-xs text-neutral-400">
            This export contains names and dietary needs only. No category, score or result.
          </p>
        </Panel>
      </section>

      {/* Shortlist versus attendance */}
      <Panel
        title="Shortlist versus attendance"
        subtitle="Who is coming, who still needs a nudge"
        action={
          <Link
            href="/admin/shortlist"
            className="text-sm font-semibold border border-neutral-300 rounded-md px-3 py-1.5 hover:bg-neutral-50"
          >
            Manage shortlist
          </Link>
        }
      >
        {rows.length === 0 ? (
          <Empty>
            No shortlist imported yet.{' '}
            <Link href="/admin/shortlist" className="underline underline-offset-4">
              Import the spreadsheet
            </Link>
            .
          </Empty>
        ) : (
          <div className="space-y-7">
            {[...byCategory.entries()].map(([category, list]) => (
              <div key={category}>
                <div className="flex items-baseline justify-between border-b border-neutral-200 pb-2">
                  <h3 className="font-bold">{category}</h3>
                  <p className="text-sm text-neutral-500">
                    {list.filter((r) => r.has_booked).length} of {list.length} booked
                  </p>
                </div>
                <table className="w-full text-sm mt-1">
                  <tbody>
                    {list.map((r) => (
                      <tr key={r.id} className="border-b border-neutral-100 last:border-0">
                        <td className="py-2.5 pr-4 font-medium">{r.company_name}</td>
                        <td className="py-2.5 pr-4 text-neutral-500">{r.contact_name}</td>
                        <td className="py-2.5 pr-4">
                          <StateBadge state={r.invite_state} />
                        </td>
                        <td className="py-2.5 text-right">
                          {r.has_booked ? (
                            <span className="font-semibold text-green-700">
                              Booked, {r.seats_booked} {r.seats_booked === 1 ? 'seat' : 'seats'}
                            </span>
                          ) : (
                            <span className="text-neutral-400">Not booked</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        )}
      </Panel>

      {/* Activity */}
      <section className="grid lg:grid-cols-2 gap-6">
        <Panel title="Recent bookings" subtitle="Newest first">
          {(recentOrders ?? []).length === 0 ? (
            <Empty>No tickets sold yet.</Empty>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {(recentOrders ?? []).map((o) => (
                <li key={o.id} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">
                      {o.buyer_name || o.buyer_email}
                      {o.status !== 'paid' && (
                        <span className="ml-2 text-xs uppercase tracking-wider text-red-700">
                          {o.status}
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {o.ticket_type === 'table8' ? 'Table of 8' : 'Single ticket'} &middot;{' '}
                      {o.seats} {o.seats === 1 ? 'seat' : 'seats'} &middot;{' '}
                      {new Date(o.created_at).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-semibold tabular-nums">
                      {poundsFromPence(o.amount_total)}
                    </p>
                    <p
                      className={`text-xs ${
                        o.details_completed_at ? 'text-green-700' : 'text-amber-700'
                      }`}
                    >
                      {o.details_completed_at ? 'Details complete' : 'Awaiting details'}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Recent email" subtitle="What the automation has sent">
          {(recentEmails ?? []).length === 0 ? (
            <Empty>Nothing sent yet.</Empty>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {(recentEmails ?? []).map((e) => (
                <li key={e.id} className="py-3 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{e.template.replace(/_/g, ' ')}</p>
                    <p className="text-sm text-neutral-500">{e.recipient_email}</p>
                    {e.error && <p className="text-xs text-red-700 mt-1">{e.error}</p>}
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className={`text-xs font-semibold uppercase tracking-wider ${
                        e.status === 'sent' ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      {e.status}
                    </p>
                    <p className="text-xs text-neutral-400 mt-1">
                      {new Date(e.sent_at).toLocaleDateString('en-GB')}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </section>
    </div>
  )
}

// ---------------------------------------------------------------------------

function ago(value: string | Date | null | undefined) {
  if (!value) return 'just now'
  const ms = Date.now() - new Date(value).getTime()
  const mins = Math.floor(ms / 60_000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} ${mins === 1 ? 'minute' : 'minutes'} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`
  const days = Math.floor(hours / 24)
  return `${days} ${days === 1 ? 'day' : 'days'} ago`
}

function Card({
  label,
  value,
  sub,
  bar,
  tone,
}: {
  label: string
  value: string
  sub?: string
  bar?: number
  tone?: 'amber' | 'green'
}) {
  const toneClass =
    tone === 'amber' ? 'text-amber-700' : tone === 'green' ? 'text-green-700' : 'text-neutral-500'
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-6">
      <p className="text-sm text-neutral-500">{label}</p>
      <p className="text-3xl font-bold mt-2 tabular-nums">{value}</p>
      {typeof bar === 'number' && (
        <div className="h-1.5 bg-neutral-100 rounded-full mt-3 overflow-hidden">
          <div className="h-full bg-neutral-900" style={{ width: `${bar}%` }} />
        </div>
      )}
      {sub && <p className={`text-sm mt-2 ${toneClass}`}>{sub}</p>}
    </div>
  )
}

function Panel({
  title,
  subtitle,
  action,
  children,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section className="bg-white border border-neutral-200 rounded-xl p-6">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          {subtitle && <p className="text-sm text-neutral-500 mt-1">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="text-neutral-500 py-6 text-center">{children}</p>
}

function StateBadge({ state }: { state: string }) {
  const map: Record<string, string> = {
    draft: 'bg-neutral-100 text-neutral-600',
    armed: 'bg-blue-100 text-blue-800',
    invited: 'bg-green-100 text-green-800',
    suppressed: 'bg-neutral-100 text-neutral-400',
  }
  const label: Record<string, string> = {
    draft: 'Not invited',
    armed: 'Queued',
    invited: 'Invited',
    suppressed: 'Held back',
  }
  return (
    <span
      className={`text-xs font-semibold px-2.5 py-1 rounded-full ${map[state] ?? map.draft}`}
    >
      {label[state] ?? state}
    </span>
  )
}
