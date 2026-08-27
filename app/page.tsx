const categories = [
  {
    number: "01",
    title: "Business Growth Award",
    description:
      "Recognises businesses that have achieved significant, measurable growth over the past 12 months, in revenue, customers, team, or market share.",
    who: [
      "Any Lincolnshire-based business of any size",
      "Businesses with clear growth evidence from the past year",
    ],
    judges: [
      "Revenue or customer growth figures",
      "Strategic plan behind the growth",
      "Sustainability of growth achieved",
    ],
  },
  {
    number: "02",
    title: "Start-Up / New Business of the Year",
    description:
      "Celebrates the most promising new businesses established within the last two years, already demonstrating exceptional potential.",
    who: [
      "Businesses operating for less than 24 months at entry",
      "Sole traders, partnerships, or limited companies",
    ],
    judges: [
      "Innovation and market opportunity",
      "Early commercial traction",
      "Vision and growth roadmap",
    ],
  },
  {
    number: "03",
    title: "Scale-Up Business of the Year",
    description:
      "For businesses that have successfully scaled beyond their initial operating model, expanding teams, geographies, or product lines.",
    who: [
      "Businesses that have meaningfully expanded headcount or revenue",
      "Businesses operating a scalable model",
    ],
    judges: [
      "Evidence of scaling operations",
      "Repeatable, sustainable processes",
      "Leadership through growth",
    ],
  },
  {
    number: "04",
    title: "Breakthrough Business of the Year",
    description:
      "For businesses that have overcome a significant barrier, pivoted successfully, or achieved a remarkable result against the odds.",
    who: [
      "Any business with a compelling turnaround or breakthrough story",
      "Businesses that navigated major challenges",
    ],
    judges: [
      "The challenge or barrier faced",
      "Strategy and resilience demonstrated",
      "Outcome and measurable impact",
    ],
  },
  {
    number: "05",
    title: "Entrepreneur of the Year",
    description:
      "Recognises the individual behind the growth: the visionary driving their business and the wider Lincolnshire economy forward.",
    who: [
      "Business owners, founders, and directors",
      "Individuals with a clear impact in the last 12 months",
    ],
    judges: [
      "Personal leadership and vision",
      "Commercial achievement",
      "Wider community or industry contribution",
    ],
  },
  {
    number: "06",
    title: "Employer of the Year",
    description:
      "For businesses that truly put their people first, building an exceptional workplace culture where people thrive and grow.",
    who: [
      "Any Lincolnshire business with employees",
      "Businesses with a demonstrable people-first approach",
    ],
    judges: [
      "Culture, wellbeing, and development investment",
      "Staff retention and satisfaction evidence",
      "Team testimonials and HR initiatives",
    ],
  },
  {
    number: "07",
    title: "Rising Star Award",
    description:
      "Celebrating the next generation of Lincolnshire business talent, individuals or businesses showing exceptional early promise.",
    who: [
      "Individuals under 35 in a business leadership role",
      "Early-stage businesses in their first growth phase",
    ],
    judges: [
      "Ambition and drive",
      "Early measurable impact",
      "Future potential and trajectory",
    ],
  },
  {
    number: "08",
    title: "Community Impact Award",
    description:
      "For businesses making a genuine, positive difference in Lincolnshire's communities through their operations, charity work, or social mission.",
    who: [
      "Businesses with a demonstrable CSR or community programme",
      "Social enterprises with a clear community mission",
    ],
    judges: [
      "Measurable community outcomes",
      "Engagement beyond tokenism",
      "Long-term commitment to impact",
    ],
  },
  {
    number: "09",
    title: "Marketing Campaign of the Year",
    description:
      "Recognises the most effective, creative, and results-driven marketing campaign by a Lincolnshire business or agency in the past year.",
    who: [
      "Any business or agency that ran a Lincolnshire-related campaign",
      "In-house teams and external agencies are both eligible",
    ],
    judges: [
      "Campaign strategy and insight",
      "Creative execution",
      "Measurable results and ROI",
    ],
  },
  {
    number: "10",
    title: "Best Use of Social Media for Growth",
    description:
      "For businesses that have harnessed social media as a genuine driver of commercial growth, not just likes but real business results.",
    who: [
      "Any Lincolnshire business using social media to drive commercial outcomes",
      "Businesses with clear before/after analytics to share",
    ],
    judges: [
      "Platform strategy and content approach",
      "Engagement and follower growth",
      "Conversion or commercial impact from social",
    ],
  },
  {
    number: "11",
    title: "Brand Growth Award",
    description:
      "For businesses that have significantly invested in and grown their brand, resulting in stronger recognition, positioning, or market standing.",
    who: [
      "Any business that has undertaken a rebrand or brand development programme",
      "Businesses with measurable brand awareness growth",
    ],
    judges: [
      "Brand strategy and rationale",
      "Visual identity and consistency",
      "Evidence of improved market positioning",
    ],
  },
  {
    number: "12",
    title: "Customer Experience Award",
    description:
      "Celebrates businesses that consistently deliver exceptional customer experiences, turning customers into loyal advocates.",
    who: [
      "Any customer-facing Lincolnshire business",
      "Businesses with strong review scores, NPS data, or testimonials",
    ],
    judges: [
      "CX strategy and implementation",
      "Customer feedback and review evidence",
      "Complaint handling and resolution approach",
    ],
  },
  {
    number: "13",
    title: "Customer Growth Award",
    description:
      "For businesses that have substantially grown their customer base through outstanding service, referrals, or targeted acquisition strategy.",
    who: [
      "Businesses with evidence of significant customer acquisition",
      "Businesses that can evidence retention alongside growth",
    ],
    judges: [
      "Customer acquisition strategy",
      "Retention rates and lifetime value",
      "Evidence of customer-led growth",
    ],
  },
  {
    number: "14",
    title: "Professional Services Growth Award",
    description:
      "For accountants, solicitors, consultants, financial advisers, and other professional services firms demonstrating outstanding growth.",
    who: [
      "Businesses operating within regulated or professional services",
      "Firms with evidence of fee income or client growth",
    ],
    judges: [
      "Client growth and retention",
      "Service innovation or specialism development",
      "Reputation and market positioning",
    ],
  },
  {
    number: "15",
    title: "Business Recognition Award Nomination",
    description:
      "A special peer-nominated recognition for businesses or individuals making an outstanding contribution to the Lincolnshire business community.",
    who: [
      "Nominated by clients, peers, or the public",
      "Anyone who has made a significant contribution to Lincolnshire business",
    ],
    judges: [
      "Peer and community nomination strength",
      "Contribution beyond commercial success",
      "Positive influence on others",
    ],
  },
];

const ticketsUrl = "/tickets";

function Button({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: React.ReactNode;
  secondary?: boolean;
}) {
  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center px-6 py-3 rounded-md font-semibold transition ${
        secondary
          ? "border border-white/40 text-white hover:bg-white/10"
          : "bg-white text-black hover:bg-neutral-200"
      }`}
    >
      {children}
    </a>
  );
}

export default function Home() {
  return (
    <main className="bg-white text-neutral-900">
      {/* NAV */}
      <header className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <a href="#" className="font-bold text-white text-lg">
            Lincolnshire Marketing Awards
          </a>
          <nav className="hidden lg:flex gap-7 text-sm text-white/90">
            <a href="#about">About</a>
            <a href="#categories">Categories</a>
            <a href="#dates">Dates</a>
            <a href="#judging">Judging</a>
            <a href="#sponsors">Sponsors</a>
            <a href="#faqs">FAQs</a>
            <a href={ticketsUrl} className="font-semibold">
              Tickets
            </a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="min-h-screen bg-neutral-950 text-white flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-32">
          <p className="uppercase tracking-[0.25em] text-xs text-white/60 mb-6">
            Business Growth Awards · Lincolnshire · 2026
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-5xl">
            Lincolnshire Marketing Awards
          </h1>
          <p className="text-xl md:text-2xl mt-7 text-white/80 max-w-3xl">
            Recognising exceptional business growth across Lincolnshire.
          </p>
          <p className="mt-5 max-w-3xl text-white/65 leading-relaxed">
            Judging is complete and the shortlist is set. Winners are revealed
            at the black-tie awards dinner on 10 September 2026 at the
            DoubleTree by Hilton, Lincoln.
          </p>
          <div className="flex flex-wrap gap-4 mt-10">
            <Button href={ticketsUrl}>Book Your Tickets</Button>
            <Button href="#categories" secondary>
              View Categories
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 border-t border-white/20 pt-10">
            <Stat value="15" label="Award Categories" />
            <Stat value="3 Judges" label="Per Entry" />
            <Stat value="10 Sept" label="Awards Night" />
            <Stat value="Black Tie" label="Awards Dinner" />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <Eyebrow>About the Awards</Eyebrow>
          <h2 className="text-4xl md:text-5xl font-bold max-w-3xl">
            Celebrating the Best in Lincolnshire Business
          </h2>
          <div className="mt-10 grid md:grid-cols-2 gap-12 text-neutral-600 leading-7">
            <div>
              <p>
                The Lincolnshire Marketing Awards is an annual celebration of
                outstanding business achievement across our county. Now in its
                third year, the awards recognise businesses of every size,
                from sole traders and start-ups to established employers and
                professional services firms, that have demonstrated genuine,
                measurable growth.
              </p>
            </div>
            <div>
              <p>
                Organised by Lincolnshire Marketing, these awards are open to
                all Lincolnshire businesses, not just those in marketing. With
                15 categories spanning growth, leadership, people, community,
                and brand, there is an award for every ambitious business in
                the county.
              </p>
              <p className="mt-5">
                Entry is free, judging is independent, and the focus is
                entirely on substance over spectacle.
              </p>
            </div>
          </div>
          <blockquote className="mt-16 border-l-4 border-neutral-900 pl-7 text-2xl font-medium max-w-4xl">
            “These awards exist to shine a light on the businesses that are
            quietly doing exceptional work across Lincolnshire, and to give
            them the recognition they deserve.”
            <footer className="text-sm text-neutral-500 font-normal mt-4">
              Tom Stansfield, Lincolnshire Marketing
            </footer>
          </blockquote>
        </div>
      </section>

      {/* WHY IT MATTERS */}
      <section className="py-24 bg-neutral-100">
        <div className="max-w-6xl mx-auto px-6">
          <Eyebrow>Why It Matters</Eyebrow>
          <h2 className="text-4xl md:text-5xl font-bold">
            What Recognition Does for a Business
          </h2>
          <p className="mt-5 text-neutral-600 max-w-3xl">
            Being shortlisted or winning is a permanent, verifiable mark of
            excellence. Here is what it does for the businesses that earn it.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            <Feature
              title="Lasting Credibility"
              text="Being shortlisted or winning is a permanent, verifiable mark of excellence."
            />
            <Feature
              title="Trust With Clients"
              text="Independent recognition provides credibility that businesses cannot simply claim for themselves."
            />
            <Feature
              title="Profile Across Lincolnshire"
              text="Shortlisted businesses are featured across social media, email, and PR activity."
            />
            <Feature
              title="Recognition for Your People"
              text="Being shortlisted gives the team behind your results something tangible to celebrate."
            />
            <Feature
              title="The Best in the County, in One Room"
              text="The awards dinner brings together ambitious businesses from across Lincolnshire."
            />
            <Feature
              title="Judged on Merit"
              text="Three independent judges score every entry. Nobody buys their way onto the shortlist."
            />
          </div>
          <div className="mt-10">
            <a
              href={ticketsUrl}
              className="inline-flex bg-neutral-950 text-white px-6 py-3 rounded-md font-semibold"
            >
              Book Your Tickets
            </a>
          </div>
          <p className="mt-4 text-sm text-neutral-500">
            Single tickets and tables of 8 · Black-tie dinner, 10 September 2026
          </p>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <Eyebrow>Award Categories</Eyebrow>
          <h2 className="text-4xl md:text-5xl font-bold">
            15 Categories. One for Every Business.
          </h2>
          <p className="mt-5 max-w-4xl text-neutral-600 leading-7">
            These are not just marketing awards. They recognise every
            dimension of business growth: revenue, leadership, people, brand,
            community impact, and more. Every category was judged
            independently, and winners are announced on the night.
          </p>
          <div className="grid lg:grid-cols-2 gap-6 mt-14">
            {categories.map((category) => (
              <article
                key={category.number}
                className="border border-neutral-200 rounded-xl p-7"
              >
                <span className="text-sm font-bold text-neutral-400">
                  {category.number}
                </span>
                <h3 className="text-2xl font-bold mt-2">{category.title}</h3>
                <p className="text-neutral-600 mt-4">
                  {category.description}
                </p>
                <div className="grid md:grid-cols-2 gap-6 mt-7">
                  <div>
                    <h4 className="font-semibold">Who it recognises</h4>
                    <ul className="mt-3 space-y-2 text-sm text-neutral-600 list-disc pl-5">
                      {category.who.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold">What judges looked for</h4>
                    <ul className="mt-3 space-y-2 text-sm text-neutral-600 list-disc pl-5">
                      {category.judges.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-12 text-center">
            <a
              href={ticketsUrl}
              className="inline-flex bg-neutral-950 text-white px-7 py-4 rounded-md font-semibold"
            >
              Book Your Tickets
            </a>
            <p className="mt-3 text-sm text-neutral-500">
              Winners announced on the night · 10 September 2026
            </p>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="how-it-works" className="py-24 bg-neutral-950 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <Eyebrow light>The Process</Eyebrow>
          <h2 className="text-4xl md:text-5xl font-bold">How It Works</h2>
          <p className="mt-5 text-white/60 max-w-3xl">
            From submission to awards night. The process is designed to be
            straightforward, fair, and friction-free.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            <Process
              number="01"
              title="Entries Submitted"
              text="Businesses submitted a written case of up to 1,000 words, backed by evidence, against the criteria for their category."
              note="Closed, late July 2026"
            />
            <Process
              number="02"
              title="Independent Judging"
              text="Three independent judges assessed every submission in each category. Scores are averaged and the organisers take no part."
              note="August 2026"
            />
            <Process
              number="03"
              title="Shortlist Announced"
              text="Shortlisted finalists are notified privately first, then announced publicly. Only entries scoring close to the top make it."
              note="Late August 2026"
            />
            <Process
              number="04"
              title="Tickets Booked"
              text="Shortlisted businesses and their guests book single seats or a table of 8, and register guest names and dietary requirements."
              note="Book now"
            />
            <Process
              number="05"
              title="Final Details"
              text="Guest lists and dietary requirements go to the venue, and everyone gets the running order for the night a week ahead."
              note="Early September 2026"
            />
            <Process
              number="06"
              title="Awards Night"
              text="Join us for a prestigious black-tie dinner. Winners are revealed on the night."
              note="10 September 2026 · Black Tie"
            />
          </div>
        </div>
      </section>

      {/* JUDGING */}
      <section id="judging" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <Eyebrow>Judging &amp; Fairness</Eyebrow>
          <h2 className="text-4xl md:text-5xl font-bold">
            Independently Judged.
            <br />
            Rigorously Fair.
          </h2>
          <p className="mt-6 max-w-3xl text-neutral-600">
            Every entry was scored by an independent panel of experienced
            business professionals. The organising team has no involvement in
            scoring or results.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 mt-14">
            <Feature
              title="Fully Independent"
              text="Every entry is assessed by judges who operate entirely independently of the organising team."
            />
            <Feature
              title="3 Judges Per Submission"
              text="Every entry is scored by three separate judges. Final scores are averaged."
            />
            <Feature
              title="Conflict of Interest Checks"
              text="Judges declare connections to entrants and are recused where required."
            />
            <Feature
              title="Zero Organiser Influence"
              text="The organising team has no role in scoring or outcome decisions."
            />
            <Feature
              title="Scored on Merit Alone"
              text="Winners are determined by the quality of their submission and evidence provided."
            />
            <Feature
              title="An Honest Shortlist"
              text="Only entries scoring close to the top are shortlisted. We would rather a short shortlist than a padded one."
            />
          </div>
        </div>
      </section>

      {/* DATES */}
      <section id="dates" className="py-24 bg-neutral-100">
        <div className="max-w-6xl mx-auto px-6">
          <Eyebrow>Key Dates</Eyebrow>
          <h2 className="text-4xl md:text-5xl font-bold">
            Important Dates for 2026
          </h2>
          <div className="mt-14 space-y-5">
            <DateRow
              date="Late July 2026"
              title="Entries Closed"
              description="Submissions closed and went to the judging panel."
            />
            <DateRow
              date="August 2026"
              title="Judging Period"
              description="Independent judges assessed all submissions."
            />
            <DateRow
              date="Late August 2026"
              title="Shortlist Announced"
              description="Finalists are notified and publicly announced."
            />
            <DateRow
              date="Early September 2026"
              title="Guest Details Due"
              description="Final names and dietary requirements go to the venue."
            />
            <DateRow
              date="10 September 2026"
              title="Awards Night"
              description="Black-tie dinner at the DoubleTree by Hilton, Lincoln."
            />
          </div>
          <div className="mt-12 bg-white p-8 rounded-xl">
            <h3 className="text-xl font-bold">Secure your seats</h3>
            <p className="mt-2 text-neutral-600">
              Single tickets and tables of 8 are available now. Tables do go.
            </p>
            <a
              href={ticketsUrl}
              className="inline-flex mt-5 bg-neutral-950 text-white px-6 py-3 rounded-md font-semibold"
            >
              Book Your Tickets
            </a>
          </div>
        </div>
      </section>

      {/* SPONSORS */}
      <section id="sponsors" className="py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <Eyebrow>Our Sponsors</Eyebrow>
          <h2 className="text-4xl md:text-5xl font-bold">
            Thank You to Our Sponsors
          </h2>
          <p className="mt-5 text-neutral-600 max-w-3xl mx-auto">
            The Lincolnshire Marketing Awards is made possible by the generous
            support of Lincolnshire businesses who believe in recognising
            excellence.
          </p>
          <div className="mt-14 border rounded-xl p-12">
            <p className="text-sm uppercase tracking-widest text-neutral-400">
              Headline Sponsor
            </p>
          </div>
        </div>
      </section>

      {/* AWARDS NIGHT */}
      <section className="py-24 bg-neutral-950 text-white">
        <div className="max-w-6xl mx-auto px-6">
          <Eyebrow light>Awards Night</Eyebrow>
          <h2 className="text-4xl md:text-6xl font-bold">
            Thursday
            <br />
            10 September 2026
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="border border-white/15 rounded-xl p-6">
              <p className="text-white/50 text-sm">Venue</p>
              <p className="font-semibold mt-2">
                DoubleTree by Hilton
                <br />
                Lincoln
              </p>
            </div>
            <div className="border border-white/15 rounded-xl p-6">
              <p className="text-white/50 text-sm">Arrival</p>
              <p className="font-semibold mt-2">From 7:00pm</p>
            </div>
            <div className="border border-white/15 rounded-xl p-6">
              <p className="text-white/50 text-sm">Dress Code</p>
              <p className="font-semibold mt-2">Black Tie</p>
            </div>
          </div>
          <div className="mt-10">
            <Button href={ticketsUrl}>Book Your Tickets</Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faqs" className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <Eyebrow>FAQs</Eyebrow>
          <h2 className="text-4xl md:text-5xl font-bold">
            Frequently Asked Questions
          </h2>
          <div className="mt-12 divide-y">
            <Faq
              q="When is the awards night?"
              a="The 2026 Lincolnshire Marketing Awards take place on Thursday 10 September 2026 at the DoubleTree by Hilton, Lincoln. Arrival is from 7:00pm and the dress code is black tie."
            />
            <Faq
              q="How do I book tickets?"
              a="Book a single ticket or a table of 8 on the tickets page. Payment is taken securely through Stripe, and you will be brought straight back to a private page to register your guests."
            />
            <Faq
              q="Do I have to be shortlisted to attend?"
              a="No. The evening is open to anyone who wants to be there, whether you entered or not."
            />
            <Faq
              q="How do I give you dietary requirements?"
              a="After you book, you get a private link where you add each guest's name and any dietary or access requirements. It saves as you go, so you can come back to it later."
            />
            <Faq
              q="How were the awards judged?"
              a="Entries were independently scored by three judges. Scores were averaged and the organisers had no influence on the outcome. Only entries scoring close to the top were shortlisted."
            />
            <Faq
              q="When are winners announced?"
              a="Winners are revealed on the night. Nobody knows the results in advance, including the shortlisted businesses."
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-neutral-950 text-white py-14">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-8 justify-between">
          <div>
            <p className="font-bold">Lincolnshire Marketing Awards</p>
            <p className="text-white/50 text-sm mt-2">
              Recognising exceptional business growth across Lincolnshire.
            </p>
          </div>
          <div className="text-sm text-white/60">
            <p>tom@lincolnshiremarketing.co.uk</p>
            <p className="mt-2">© 2026 Lincolnshire Marketing Awards</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Eyebrow({
  children,
  light = false,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <p
      className={`uppercase tracking-[0.2em] text-xs font-semibold mb-5 ${
        light ? "text-white/50" : "text-neutral-400"
      }`}
    >
      {children}
    </p>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-white/50 mt-1">{label}</p>
    </div>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-7">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-3 text-neutral-600 leading-6">{text}</p>
    </div>
  );
}

function Process({
  number,
  title,
  text,
  note,
}: {
  number: string;
  title: string;
  text: string;
  note: string;
}) {
  return (
    <div className="border border-white/15 rounded-xl p-7">
      <p className="text-white/30 font-bold">{number}</p>
      <h3 className="text-xl font-bold mt-3">{title}</h3>
      <p className="text-white/60 mt-3 leading-6">{text}</p>
      <p className="text-sm text-white/40 mt-6">{note}</p>
    </div>
  );
}

function DateRow({
  date,
  title,
  description,
}: {
  date: string;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl p-7 grid md:grid-cols-[180px_1fr] gap-4">
      <p className="font-semibold">{date}</p>
      <div>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-neutral-600 mt-1">{description}</p>
      </div>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  return (
    <details className="py-6 group">
      <summary className="cursor-pointer list-none flex justify-between gap-6 font-semibold text-lg">
        {q}
        <span>+</span>
      </summary>
      <p className="mt-4 text-neutral-600 leading-7 max-w-3xl">{a}</p>
    </details>
  );
}
