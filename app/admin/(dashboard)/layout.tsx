import Link from 'next/link'

export const metadata = { title: 'Awards admin', robots: { index: false, follow: false } }

const NAV = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/shortlist', label: 'Shortlist' },
  { href: '/admin/guests', label: 'Guest list' },
  { href: '/admin/settings', label: 'Settings' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="bg-neutral-950 text-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center gap-x-8 gap-y-3">
          <Link href="/admin" className="font-bold">
            Awards admin
          </Link>
          <nav className="flex gap-6 text-sm text-white/70">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="hover:text-white">
                {n.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/"
            className="ml-auto text-sm text-white/50 hover:text-white"
            target="_blank"
          >
            View site
          </Link>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-6 py-10">{children}</div>
    </div>
  )
}
