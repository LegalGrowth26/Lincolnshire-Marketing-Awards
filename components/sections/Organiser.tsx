import { organiser } from '@/content/site'

export default function Organiser() {
  return (
    <section className="section-tight bg-ink-900 border-y border-white/5">
      <div className="container-page">
        <div className="grid gap-10 md:grid-cols-12 items-start">
          <div className="md:col-span-4">
            <span className="eyebrow">The organiser</span>
            <h2 className="h2 mt-4">{organiser.name}</h2>
            <p className="text-mb-500 mt-3 text-sm uppercase tracking-[0.14em] font-semibold">
              {organiser.role}
            </p>
          </div>

          <div className="md:col-span-8">
            <p className="body-lg">{organiser.bio}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="chip">Business coach</span>
              <span className="chip">Mentor</span>
              <span className="chip">Connector</span>
              <span className="chip">Founder, Business Unfinished</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
