import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import {
  ADMIN_COOKIE,
  cookieOptions,
  createSessionToken,
  loginAllowed,
  recordFailedLogin,
} from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Admin', robots: { index: false } }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  const sp = await searchParams

  async function login(formData: FormData) {
    'use server'
    const hdrs = await headers()
    const ip = hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const next = String(formData.get('next') || '/admin')
    const safeNext = next.startsWith('/admin') ? next : '/admin'

    if (!loginAllowed(ip)) {
      redirect(`/admin/login?error=throttled&next=${encodeURIComponent(safeNext)}`)
    }

    const password = String(formData.get('password') || '')
    const expected = process.env.ADMIN_PASSWORD || ''

    if (!expected || password !== expected) {
      recordFailedLogin(ip)
      redirect(`/admin/login?error=1&next=${encodeURIComponent(safeNext)}`)
    }

    const token = await createSessionToken()
    const jar = await cookies()
    jar.set(ADMIN_COOKIE, token, cookieOptions)
    redirect(safeNext)
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center">
      <div className="max-w-sm mx-auto px-6 w-full">
        <p className="uppercase tracking-[0.2em] text-xs text-white/50 font-semibold">
          Lincolnshire Marketing Awards
        </p>
        <h1 className="text-3xl font-bold mt-4">Admin</h1>

        <form action={login} className="mt-8 space-y-4">
          <input type="hidden" name="next" value={sp.next || '/admin'} />
          <label className="block">
            <span className="text-sm text-white/70">Password</span>
            <input
              type="password"
              name="password"
              autoFocus
              required
              className="mt-2 w-full bg-white/10 border border-white/20 rounded-md px-3 py-2.5 text-white"
            />
          </label>
          {sp.error === 'throttled' ? (
            <p className="text-sm text-amber-300">
              Too many attempts. Try again in fifteen minutes.
            </p>
          ) : sp.error ? (
            <p className="text-sm text-red-300">That password is not right.</p>
          ) : null}
          <button
            type="submit"
            className="w-full bg-white text-neutral-950 px-6 py-3 rounded-md font-semibold"
          >
            Sign in
          </button>
        </form>

        <p className="mt-8 text-xs text-white/40 leading-relaxed">
          This area contains judging scores and results. Do not share access or leave it open on
          a shared screen.
        </p>
      </div>
    </main>
  )
}
