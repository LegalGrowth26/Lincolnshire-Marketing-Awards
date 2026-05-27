import { speakers, type Speaker } from '@/content/site'

export default function Speakers() {
  const featured = speakers.find((s) => s.featured)

  return (
    <section id="speakers" className="section bg-ink-950">
      <div className="container-page">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <span className="eyebrow">Selected speakers</span>
            <h2 className="h2 mt-4">Practical voices. Real experience.</h2>
          </div>
          <p className="body-muted max-w-sm">
            A lean line-up of operators, leaders and specialists. More speaker detail to
            follow as the programme is finalised.
          </p>
        </div>

        {/* Featured callout */}
        {featured && featured.featuredNote && (
          <aside
            className="mt-10 card flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6
                       border-mb-500/40 bg-mb-500/5"
          >
            <span className="chip-accent shrink-0">Featured</span>
            <p className="text-white">
              <strong className="font-semibold">{featured.name}</strong>
              <span className="text-ink-300"> — {featured.featuredNote}.</span>
            </p>
          </aside>
        )}

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {speakers.map((s) => (
            <SpeakerCard key={s.name} speaker={s} />
          ))}
        </div>

        <p className="text-xs text-ink-400 mt-8">
          Speaker line-up subject to change. Additional speakers and session details to be announced.
        </p>
      </div>
    </section>
  )
}

function SpeakerCard({ speaker }: { speaker: Speaker }) {
  const initials = speaker.name
    .split(' ')
    .filter((part) => !/^(Col|Lt|Maj|Sgt|Capt|Lt\.?|Col\.?|Maj\.?)$/i.test(part))
    .map((part) => part[0])
    .slice(0, 2)
    .join('')

  return (
    <article className="card flex flex-col">
      <div className="flex items-center gap-4">
        {/* Avatar / placeholder */}
        <div
          className="h-14 w-14 shrink-0 rounded-full bg-ink-700 border border-white/10
                     grid place-items-center text-ink-300 font-semibold"
          aria-hidden="true"
        >
          {speaker.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={speaker.image}
              alt=""
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div>
          <h3 className="text-base font-semibold text-white leading-tight">
            {speaker.name}
          </h3>
          <p className="text-xs text-mb-500 mt-1 uppercase tracking-[0.12em]">
            {speaker.role}
          </p>
        </div>
      </div>

      <p className="text-sm text-ink-300 mt-5 leading-relaxed">{speaker.bio}</p>
    </article>
  )
}
