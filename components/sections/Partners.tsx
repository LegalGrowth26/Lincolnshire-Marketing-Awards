import { partners, type Partner } from '@/content/site'

export default function Partners() {
  return (
    <section id="partners" className="section-tight bg-ink-900 border-y border-white/5">
      <div className="container-page">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="max-w-2xl">
            <span className="eyebrow">Partners &amp; sponsors</span>
            <h2 className="h2 mt-4">Backed by the right people.</h2>
          </div>
          <p className="body-muted max-w-sm">
            Additional partner logos will be added as they come on board.
          </p>
        </div>

        <ul className="mt-10 grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
          {partners.map((p, i) => (
            <PartnerTile key={`${p.name}-${i}`} partner={p} />
          ))}
        </ul>

        <p className="text-xs text-ink-400 mt-8">
          Interested in partnering? Contact the organiser to discuss.
        </p>
      </div>
    </section>
  )
}

function PartnerTile({ partner }: { partner: Partner }) {
  const content = (
    <div
      className="h-24 flex items-center justify-center rounded-md bg-ink-800
                 border border-white/5 p-4 text-center transition-colors hover:border-white/15"
    >
      {partner.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={partner.logo}
          alt={partner.name}
          className="max-h-12 max-w-full object-contain opacity-80 hover:opacity-100 transition-opacity"
        />
      ) : (
        <span className="text-[11px] sm:text-xs font-medium text-ink-300 tracking-wide leading-tight">
          {partner.name}
        </span>
      )}
    </div>
  )

  return (
    <li>
      {partner.href ? (
        <a
          href={partner.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${partner.name} (opens in new tab)`}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </li>
  )
}
