interface Category {
  id: number
  name: string
  description: string
  whoShouldEnter: string[]
  judgesLookFor: string[]
  nominationOnly?: boolean
}

const categories: Category[] = [
  {
    id: 1,
    name: 'Business Growth Award',
    description: 'Recognises businesses that have achieved significant, measurable growth over the past 12 months, in revenue, customers, team, or market share.',
    whoShouldEnter: ['Any Lincolnshire-based business of any size', 'Businesses with clear growth evidence from the past year'],
    judgesLookFor: ['Revenue or customer growth figures', 'Strategic plan behind the growth', 'Sustainability of growth achieved'],
  },
  {
    id: 2,
    name: 'Start-Up / New Business of the Year',
    description: 'Celebrates the most promising new businesses established within the last two years, already demonstrating exceptional potential.',
    whoShouldEnter: ['Businesses operating for less than 24 months at entry', 'Sole traders, partnerships, or limited companies'],
    judgesLookFor: ['Innovation and market opportunity', 'Early commercial traction', 'Vision and growth roadmap'],
  },
  {
    id: 3,
    name: 'Scale-Up Business of the Year',
    description: 'For businesses that have successfully scaled beyond their initial operating model, expanding teams, geographies, or product lines.',
    whoShouldEnter: ['Businesses that have meaningfully expanded headcount or revenue', 'Businesses operating a scalable model'],
    judgesLookFor: ['Evidence of scaling operations', 'Repeatable, sustainable processes', 'Leadership through growth'],
  },
  {
    id: 4,
    name: 'Breakthrough Business of the Year',
    description: 'For businesses that have overcome a significant barrier, pivoted successfully, or achieved a remarkable result against the odds.',
    whoShouldEnter: ['Any business with a compelling turnaround or breakthrough story', 'Businesses that navigated major challenges'],
    judgesLookFor: ['The challenge or barrier faced', 'Strategy and resilience demonstrated', 'Outcome and measurable impact'],
  },
  {
    id: 5,
    name: 'Entrepreneur of the Year',
    description: 'Recognises the individual behind the growth: the visionary driving their business and the wider Lincolnshire economy forward.',
    whoShouldEnter: ['Business owners, founders, and directors', 'Individuals with a clear impact in the last 12 months'],
    judgesLookFor: ['Personal leadership and vision', 'Commercial achievement', 'Wider community or industry contribution'],
  },
  {
    id: 6,
    name: 'Employer of the Year',
    description: 'For businesses that truly put their people first, building an exceptional workplace culture where people thrive and grow.',
    whoShouldEnter: ['Any Lincolnshire business with employees', 'Businesses with a demonstrable people-first approach'],
    judgesLookFor: ['Culture, wellbeing, and development investment', 'Staff retention and satisfaction evidence', 'Team testimonials and HR initiatives'],
  },
  {
    id: 7,
    name: 'Rising Star Award',
    description: 'Celebrating the next generation of Lincolnshire business talent, individuals or businesses showing exceptional early promise.',
    whoShouldEnter: ['Individuals under 35 in a business leadership role', 'Early-stage businesses in their first growth phase'],
    judgesLookFor: ['Ambition and drive', 'Early measurable impact', 'Future potential and trajectory'],
  },
  {
    id: 8,
    name: 'Community Impact Award',
    description: 'For businesses making a genuine, positive difference in Lincolnshire\'s communities through their operations, charity work, or social mission.',
    whoShouldEnter: ['Businesses with a demonstrable CSR or community programme', 'Social enterprises with a clear community mission'],
    judgesLookFor: ['Measurable community outcomes', 'Engagement beyond tokenism', 'Long-term commitment to impact'],
  },
  {
    id: 9,
    name: 'Marketing Campaign of the Year',
    description: 'Recognises the most effective, creative, and results-driven marketing campaign by a Lincolnshire business or agency in the past year.',
    whoShouldEnter: ['Any business or agency that ran a Lincolnshire-related campaign', 'In-house teams and external agencies are both eligible'],
    judgesLookFor: ['Campaign strategy and insight', 'Creative execution', 'Measurable results and ROI'],
  },
  {
    id: 10,
    name: 'Best Use of Social Media for Growth',
    description: 'For businesses that have harnessed social media as a genuine driver of commercial growth, not just likes but real business results.',
    whoShouldEnter: ['Any Lincolnshire business using social media to drive commercial outcomes', 'Businesses with clear before/after analytics to share'],
    judgesLookFor: ['Platform strategy and content approach', 'Engagement and follower growth', 'Conversion or commercial impact from social'],
  },
  {
    id: 11,
    name: 'Brand Growth Award',
    description: 'For businesses that have significantly invested in and grown their brand, resulting in stronger recognition, positioning, or market standing.',
    whoShouldEnter: ['Any business that has undertaken a rebrand or brand development programme', 'Businesses with measurable brand awareness growth'],
    judgesLookFor: ['Brand strategy and rationale', 'Visual identity and consistency', 'Evidence of improved market positioning'],
  },
  {
    id: 12,
    name: 'Customer Experience Award',
    description: 'Celebrates businesses that consistently deliver exceptional customer experiences, turning customers into loyal advocates.',
    whoShouldEnter: ['Any customer-facing Lincolnshire business', 'Businesses with strong review scores, NPS data, or testimonials'],
    judgesLookFor: ['CX strategy and implementation', 'Customer feedback and review evidence', 'Complaint handling and resolution approach'],
  },
  {
    id: 13,
    name: 'Customer Growth Award',
    description: 'For businesses that have substantially grown their customer base through outstanding service, referrals, or targeted acquisition strategy.',
    whoShouldEnter: ['Businesses with evidence of significant customer acquisition', 'Businesses that can evidence retention alongside growth'],
    judgesLookFor: ['Customer acquisition strategy', 'Retention rates and lifetime value', 'Evidence of customer-led growth (referrals, reviews)'],
  },
  {
    id: 14,
    name: 'Professional Services Growth Award',
    description: 'For accountants, solicitors, consultants, financial advisers, and other professional services firms demonstrating outstanding growth.',
    whoShouldEnter: ['Businesses operating within regulated or professional services', 'Firms with evidence of fee income or client growth'],
    judgesLookFor: ['Client growth and retention', 'Service innovation or specialism development', 'Reputation and market positioning'],
  },
  {
    id: 15,
    name: 'Business Recognition Award',
    description: 'A special peer-nominated recognition for businesses or individuals making an outstanding contribution to the Lincolnshire business community.',
    whoShouldEnter: ['Nominated by clients, peers, or the public (not self-nominated)', 'Anyone who has made a significant contribution to Lincolnshire business'],
    judgesLookFor: ['Peer and community nomination strength', 'Contribution beyond commercial success', 'Positive influence on others'],
    nominationOnly: true,
  },
]

function CategoryCard({ cat }: { cat: Category }) {
  return (
    <article
      aria-labelledby={`cat-${cat.id}-heading`}
      className="relative card p-6 flex flex-col group hover:border-sky-200 transition-all duration-200"
    >
      {/* Top accent bar */}
      <div className="cat-top-bar" aria-hidden="true" />

      {/* Header */}
      <div className="flex items-start gap-3 mb-4 pt-2">
        <span
          className="flex-shrink-0 w-8 h-8 rounded-sm bg-sky-50 flex items-center justify-center
                     text-sky-600 text-xs font-bold"
          aria-hidden="true"
        >
          {String(cat.id).padStart(2, '0')}
        </span>
        <h3 id={`cat-${cat.id}-heading`} className="font-bold text-navy-900 text-sm leading-snug flex-1">
          {cat.name}
          {cat.nominationOnly && (
            <span className="ml-2 inline-flex items-center text-[10px] font-semibold uppercase tracking-wide
                             bg-sky-100 text-sky-700 px-2 py-0.5 rounded-sm align-middle">
              Nomination
            </span>
          )}
        </h3>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 leading-relaxed mb-5 flex-1">{cat.description}</p>

      {/* Details */}
      <div className="space-y-4 border-t border-gray-100 pt-4">
        <div>
          <h4 className="text-xs font-semibold text-navy-900 uppercase tracking-wide mb-2">
            Who should enter
          </h4>
          <ul className="space-y-1">
            {cat.whoShouldEnter.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-gray-500">
                <svg className="w-3.5 h-3.5 text-sky-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold text-navy-900 uppercase tracking-wide mb-2">
            Judges look for
          </h4>
          <ul className="space-y-1">
            {cat.judgesLookFor.map((item) => (
              <li key={item} className="flex items-start gap-2 text-xs text-gray-500">
                <svg className="w-3.5 h-3.5 text-navy-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="pt-4 mt-4 border-t border-gray-100">
        <a
          href={cat.nominationOnly ? '#enter' : '#enter'}
          className="block w-full text-center btn-outline-navy text-xs py-2.5"
        >
          {cat.nominationOnly ? 'Nominate for This Category' : 'Enter This Category'}
        </a>
      </div>
    </article>
  )
}

export default function Categories() {
  return (
    <section id="categories" aria-labelledby="categories-heading" className="section-py bg-white">
      <div className="container-wide">

        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="section-label">Award Categories</span>
          <h2 id="categories-heading" className="section-title mb-5">
            15 Categories. One for Every Business.
          </h2>
          <p className="section-body">
            These are not just marketing awards. They recognise every dimension of business growth:
            revenue, leadership, people, brand, community impact, and more. Whether you&apos;re a
            sole trader, a growing employer, or an established professional services firm,
            there is a category for you. Enter up to 3.
          </p>
        </div>

        {/* Category grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} cat={cat} />
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="#enter" className="btn-gold-lg">
            Enter the Awards, Free
          </a>
          <p className="text-gray-400 text-sm mt-3">Max 3 categories per entrant · All entries reviewed independently</p>
        </div>
      </div>
    </section>
  )
}
