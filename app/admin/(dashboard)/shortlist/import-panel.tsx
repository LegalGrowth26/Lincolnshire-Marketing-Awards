'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Papa from 'papaparse'
import { importShortlist, type ImportRow, type ImportReport } from '../../actions'

const FIELDS = [
  { key: 'category', label: 'Category', required: true },
  { key: 'company_name', label: 'Company name', required: true },
  { key: 'contact_name', label: 'Contact name', required: false },
  { key: 'email', label: 'Email', required: true },
  { key: 'phone', label: 'Phone', required: false },
  { key: 'score', label: 'Score (confidential)', required: false },
  { key: 'placement', label: 'Result (confidential)', required: false },
] as const

type FieldKey = (typeof FIELDS)[number]['key']

/** Best guess at which spreadsheet column is which. Tom can override any of it. */
function guess(header: string): FieldKey | '' {
  const h = header.toLowerCase().replace(/[^a-z]/g, '')
  if (h.includes('categor') || h.includes('award')) return 'category'
  if (h.includes('company') || h.includes('business') || h.includes('entrant')) return 'company_name'
  if (h.includes('email') || h.includes('mail')) return 'email'
  if (h.includes('contact') || h.includes('name')) return 'contact_name'
  if (h.includes('phone') || h.includes('tel') || h.includes('mobile')) return 'phone'
  if (h.includes('score') || h.includes('total') || h.includes('avg') || h.includes('mark'))
    return 'score'
  if (h.includes('placement') || h.includes('result') || h.includes('position') || h.includes('winner'))
    return 'placement'
  return ''
}

export default function ImportPanel() {
  const [open, setOpen] = useState(false)
  const [headers, setHeaders] = useState<string[]>([])
  const [data, setData] = useState<Record<string, string>[]>([])
  const [map, setMap] = useState<Record<FieldKey, string>>({} as Record<FieldKey, string>)
  const [report, setReport] = useState<ImportReport | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()
  const router = useRouter()

  function onFile(file: File) {
    setError(null)
    setReport(null)
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        const hs = res.meta.fields ?? []
        setHeaders(hs)
        setData(res.data)
        const auto = {} as Record<FieldKey, string>
        for (const h of hs) {
          const g = guess(h)
          if (g && !auto[g]) auto[g] = h
        }
        setMap(auto)
      },
      error: (e) => setError(e.message),
    })
  }

  const ready = FIELDS.filter((f) => f.required).every((f) => map[f.key])

  function runImport() {
    setError(null)
    const rows: ImportRow[] = data.map((r) => ({
      category: r[map.category] ?? '',
      company_name: r[map.company_name] ?? '',
      contact_name: map.contact_name ? r[map.contact_name] : undefined,
      email: r[map.email] ?? '',
      phone: map.phone ? r[map.phone] : undefined,
      score: map.score ? r[map.score] : undefined,
      placement: map.placement ? r[map.placement] : undefined,
    }))

    start(async () => {
      try {
        const res = await importShortlist(rows)
        setReport(res)
        setData([])
        setHeaders([])
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Import failed')
      }
    })
  }

  return (
    <section className="bg-white border border-neutral-200 rounded-xl p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold">Import the spreadsheet</h2>
          <p className="text-sm text-neutral-500 mt-1">
            Upload a CSV, tell us which column is which, check the preview, then import.
            Re-importing updates existing rows rather than duplicating them.
          </p>
        </div>
        <button
          onClick={() => setOpen((o) => !o)}
          className="text-sm font-semibold border border-neutral-300 rounded-md px-3 py-1.5 hover:bg-neutral-50 shrink-0"
        >
          {open ? 'Close' : 'Import CSV'}
        </button>
      </div>

      {open && (
        <div className="mt-6 border-t border-neutral-100 pt-6">
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
            className="block text-sm"
          />

          {headers.length > 0 && (
            <>
              <h3 className="font-bold mt-7">Match your columns</h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {FIELDS.map((f) => (
                  <label key={f.key} className="block">
                    <span className="text-sm font-semibold">
                      {f.label}
                      {f.required && <span className="text-red-600"> *</span>}
                    </span>
                    <select
                      value={map[f.key] ?? ''}
                      onChange={(e) => setMap((m) => ({ ...m, [f.key]: e.target.value }))}
                      className="mt-2 w-full border border-neutral-300 rounded-md px-3 py-2 text-sm bg-white"
                    >
                      <option value="">Not in my sheet</option>
                      {headers.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>

              <div className="mt-7">
                <h3 className="font-bold">Preview, first five rows of {data.length}</h3>
                <div className="overflow-x-auto mt-3 border border-neutral-200 rounded-lg">
                  <table className="w-full text-sm">
                    <thead className="bg-neutral-50">
                      <tr>
                        {FIELDS.filter((f) => map[f.key]).map((f) => (
                          <th key={f.key} className="text-left font-semibold px-3 py-2">
                            {f.label}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.slice(0, 5).map((r, i) => (
                        <tr key={i} className="border-t border-neutral-100">
                          {FIELDS.filter((f) => map[f.key]).map((f) => (
                            <td key={f.key} className="px-3 py-2">
                              {r[map[f.key]]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <button
                onClick={runImport}
                disabled={!ready || pending}
                className="mt-6 bg-neutral-950 text-white px-6 py-2.5 rounded-md font-semibold disabled:opacity-40"
              >
                {pending ? 'Importing' : `Import ${data.length} rows`}
              </button>
              {!ready && (
                <p className="text-sm text-neutral-500 mt-3">
                  Match category, company name and email to continue.
                </p>
              )}
            </>
          )}

          {error && (
            <p className="mt-5 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-4">
              {error}
            </p>
          )}

          {report && (
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-5 text-sm">
              <p className="font-bold text-green-900">
                {report.created} created, {report.updated} updated
              </p>
              {report.perCategory.length > 0 && (
                <>
                  <p className="mt-3 font-semibold text-green-900">Rows per category</p>
                  <ul className="mt-1 text-green-900/80">
                    {report.perCategory.map((c) => (
                      <li key={c.category}>
                        {c.category}: {c.count}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-green-900/70">
                    Check these against what you expect. Shortlist sizes vary by category.
                  </p>
                </>
              )}
              {report.skipped.length > 0 && (
                <>
                  <p className="mt-4 font-semibold text-amber-900">
                    {report.skipped.length} rows skipped
                  </p>
                  <ul className="mt-1 text-amber-900/80 max-h-40 overflow-y-auto">
                    {report.skipped.map((s, i) => (
                      <li key={i}>
                        Row {s.row}: {s.reason}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  )
}
