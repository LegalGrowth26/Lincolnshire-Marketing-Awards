import 'server-only'
import { neon } from '@neondatabase/serverless'

let client: ReturnType<typeof neon> | null = null

function conn() {
  if (client) return client
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('Missing DATABASE_URL')
  client = neon(url)
  return client
}

/**
 * Tagged-template query helper over Neon Postgres.
 * Values are always sent as bind parameters, never interpolated into the SQL
 * string, so use it as: sql`select * from orders where id = ${id}`.
 * Returns the result rows.
 */
export function sql<T = any>(strings: TemplateStringsArray, ...params: unknown[]): Promise<T[]> {
  return conn()(strings, ...params) as Promise<T[]>
}
