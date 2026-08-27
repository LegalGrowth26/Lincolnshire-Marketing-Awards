'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { runJobsNow, syncStripeNow, cancelPendingOrder, logout } from '../actions'
import type { JobReport } from '@/lib/jobs'
import type { StripeSyncResult } from '@/lib/orders'

export function RunJobsButton() {
  const [pending, start] = useTransition()
  const [report, setReport] = useState<JobReport | null>(null)
  const router = useRouter()

  return (
    <div className="relative">
      <button
        onClick={() =>
          start(async () => {
            const r = await runJobsNow()
            setReport(r)
            router.refresh()
          })
        }
        disabled={pending}
        className="text-sm font-semibold bg-neutral-900 text-white rounded-md px-4 py-2 disabled:opacity-50"
      >
        {pending ? 'Running' : 'Run email jobs now'}
      </button>
      {report && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-neutral-200 rounded-lg shadow-lg p-4 text-sm z-20">
          <div className="flex items-start justify-between">
            <p className="font-bold">Job run complete</p>
            <button onClick={() => setReport(null)} className="text-neutral-400">
              Close
            </button>
          </div>
          <ul className="mt-3 space-y-1 text-neutral-600">
            <li className="flex justify-between gap-3">
              <span>Stripe sync</span>
              <span className="tabular-nums">
                {report.stripeSync.error ? (
                  <span className="text-red-700">error</span>
                ) : (
                  `${report.stripeSync.markedPaid + report.stripeSync.created} recorded`
                )}
              </span>
            </li>
            <Line label="Invites" r={report.invites} />
            <Line label="Booking reminders" r={report.reminders} />
            <Line label="Detail chases" r={report.chases} />
            <Line label="Event plan" r={report.plan} />
          </ul>
        </div>
      )}
    </div>
  )
}

export function SyncStripeButton() {
  const [pending, start] = useTransition()
  const [result, setResult] = useState<StripeSyncResult | null>(null)
  const router = useRouter()

  return (
    <div className="relative">
      <button
        onClick={() =>
          start(async () => {
            const r = await syncStripeNow()
            setResult(r)
            router.refresh()
          })
        }
        disabled={pending}
        className="text-sm font-semibold border border-neutral-300 rounded-md px-4 py-2
                   hover:bg-neutral-50 disabled:opacity-50"
      >
        {pending ? 'Syncing' : 'Sync from Stripe'}
      </button>
      {result && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-neutral-200 rounded-lg shadow-lg p-4 text-sm z-20">
          <div className="flex items-start justify-between">
            <p className="font-bold">Stripe sync complete</p>
            <button onClick={() => setResult(null)} className="text-neutral-400">
              Close
            </button>
          </div>
          {result.error ? (
            <p className="mt-3 text-red-700">{result.error}</p>
          ) : (
            <ul className="mt-3 space-y-1 text-neutral-600">
              <li className="flex justify-between gap-3">
                <span>Paid sessions checked</span>
                <span className="tabular-nums">{result.checked}</span>
              </li>
              <li className="flex justify-between gap-3">
                <span>Pending orders marked paid</span>
                <span className="tabular-nums">{result.markedPaid}</span>
              </li>
              <li className="flex justify-between gap-3">
                <span>Orders created</span>
                <span className="tabular-nums">{result.created}</span>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export function CancelPendingButton({ orderId }: { orderId: string }) {
  const [pending, start] = useTransition()
  const router = useRouter()

  return (
    <button
      onClick={() => {
        if (!window.confirm('Cancel this pending order? The buyer has not paid.')) return
        start(async () => {
          await cancelPendingOrder(orderId)
          router.refresh()
        })
      }}
      disabled={pending}
      className="text-xs font-semibold text-red-700 border border-red-200 rounded-md
                 px-2.5 py-1 hover:bg-red-50 disabled:opacity-50"
    >
      {pending ? 'Cancelling' : 'Cancel'}
    </button>
  )
}

function Line({
  label,
  r,
}: {
  label: string
  r: { sent: number; skipped: number; failed: number; error?: string }
}) {
  return (
    <li className="flex justify-between gap-3">
      <span>{label}</span>
      <span className="tabular-nums">
        {r.error ? (
          <span className="text-red-700">error</span>
        ) : (
          <>
            {r.sent} sent
            {r.failed > 0 && <span className="text-red-700">, {r.failed} failed</span>}
          </>
        )}
      </span>
    </li>
  )
}

export function CopyButton({ text }: { text: string }) {
  const [done, setDone] = useState(false)
  return (
    <button
      onClick={async () => {
        await navigator.clipboard.writeText(text)
        setDone(true)
        setTimeout(() => setDone(false), 2000)
      }}
      className="text-sm font-semibold border border-neutral-300 rounded-md px-3 py-1.5 hover:bg-neutral-50"
    >
      {done ? 'Copied' : 'Copy for venue'}
    </button>
  )
}

export function LogoutButton() {
  return (
    <form action={logout}>
      <button className="text-sm text-neutral-500 hover:text-neutral-900">Sign out</button>
    </form>
  )
}
