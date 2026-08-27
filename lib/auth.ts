import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

export const ADMIN_COOKIE = 'lma_admin'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET
  if (!s || s.length < 32) {
    throw new Error('ADMIN_SESSION_SECRET must be set and at least 32 characters')
  }
  return new TextEncoder().encode(s)
}

export async function createSessionToken() {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret())
}

export async function verifySessionToken(token: string | undefined) {
  if (!token) return false
  try {
    const { payload } = await jwtVerify(token, secret())
    return payload.role === 'admin'
  } catch {
    return false
  }
}

/** Use inside server components and server actions under /admin. */
export async function requireAdmin() {
  const jar = await cookies()
  const ok = await verifySessionToken(jar.get(ADMIN_COOKIE)?.value)
  if (!ok) throw new Error('Not authorised')
  return true
}

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: MAX_AGE,
}

// Simple in-memory login throttle. Enough for a single admin on one project.
const attempts = new Map<string, { count: number; resetAt: number }>()

export function loginAllowed(ip: string) {
  const now = Date.now()
  const rec = attempts.get(ip)
  if (!rec || now > rec.resetAt) {
    attempts.set(ip, { count: 0, resetAt: now + 15 * 60 * 1000 })
    return true
  }
  return rec.count < 10
}

export function recordFailedLogin(ip: string) {
  const now = Date.now()
  const rec = attempts.get(ip) ?? { count: 0, resetAt: now + 15 * 60 * 1000 }
  rec.count += 1
  attempts.set(ip, rec)
}
