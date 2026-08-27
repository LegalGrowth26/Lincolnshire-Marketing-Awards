import { db } from '@/lib/supabase'
import ShortlistManager from './shortlist-manager'
import ImportPanel from './import-panel'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function ShortlistPage() {
  const supabase = db()

  const [{ data: rows }, { data: categories }, { data: results }] = await Promise.all([
    supabase
      .from('v_shortlist_status')
      .select('*')
      .order('category_id')
      .order('company_name'),
    supabase.from('categories').select('id, title').order('sort_order'),
    supabase.from('shortlist_results').select('shortlist_id, score, placement'),
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
