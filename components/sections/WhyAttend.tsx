import { whyAttend } from '@/content/site'

export default function WhyAttend() {
  return (
    <section id="why" className="section bg-ink-950">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="eyebrow">Why attend</span>
          <h2 className="h2 mt-4">Outcomes, not fluff.</h2>
          <p className="body-lg mt-5">
            A focused half-day built around what regional business leaders actually want:
            useful insight, the right conversations, and next steps worth following up.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {whyAttend.map((item, i) => (
            <article key={item.title} className="card">
              <div className="text-mb-500 text-sm font-mono">
                0{i + 1}
              </div>
              <h3 className="h3 mt-4">{item.title}</h3>
              <p className="body-muted mt-3 text-sm">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
