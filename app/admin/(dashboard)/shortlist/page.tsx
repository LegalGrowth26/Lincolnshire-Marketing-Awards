import { sql } from '@/lib/db'
import ShortlistManager from './shortlist-manager'
import ImportPanel from './import-panel'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ShortlistPage() {
  const [rows, categories, results] = await Promise.all([
    sql`select * from v_shortlist_status order by category_id, company_name`,
    sql`select id, title from categories order by sort_order`,
    sql`select shortlist_id, score, placement from shortlist_results`,
  ])

  const resultMap = Object.fromEntries(
    (results ?? []).map((r) => [r.shortlist_id, { score: r.score, placement: r.placement }]),
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Shortlist</h1>
        <p className="text-neutral-500 mt-2">
          Import the judging spreadsheet, confirm who is on the shortlist, then arm the
          congratulations email.
        </p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-xl p-5">
        <p className="font-bold text-red-900">Confidential</p>
        <p className="text-sm text-red-800 mt-1 leading-relaxed">
          Scores, winners and highly commended are held on this screen only, hidden by default.
          They are never included in any email, any public page, or the venue export. Do not
          screen share this page.
        </p>
      </div>

      <ImportPanel />

      <ShortlistManager
        rows={rows ?? []}
        categories={categories ?? []}
        results={resultMap}
      />
    </div>
  )
}
