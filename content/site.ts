/**
 * Mission Business 2026 — site content
 *
 * Edit copy, speakers, partners, and event details here.
 * Components read from this file so you do not need to touch JSX to update text.
 */

/* ────────────────────────────── Event details ────────────────────────────── */

export const event = {
  name: 'Mission Business 2026',
  year: '2026',
  dateLong: '8 July 2026',
  dateShort: '8 Jul 2026',
  time: '8:45am – 2:15pm',
  venueName: 'Prince William of Gloucester Barracks',
  venueCity: 'Grantham',
  venuePostcode: 'NG31 7TE',
  venueFull: 'Prince William of Gloucester Barracks, Grantham, NG31 7TE',
  price: 'Free to attend',
  region: 'Lincolnshire / East Midlands',
  bookingFormUrl: 'https://api.leadconnectorhq.com/widget/form/3On4y0iRSXBd173zclN8',
}

/* ──────────────────────────────── Hero copy ──────────────────────────────── */

export const hero = {
  tag: 'Year two · 8 July 2026 · Grantham',
  headline: 'Mission Business is back.',
  subheadline:
    'Practical insight. Real opportunity. Powerful connections.',
  body:
    'Mission Business returns for its second year, bringing together business leaders, defence insight, practical speakers and valuable regional connections — hosted at Prince William of Gloucester Barracks, Grantham.',
  proofPoints: [
    'Free to attend',
    'Practical speaker sessions',
    'Defence and business insight',
    'Valuable regional networking',
    'Hosted on a military base',
    'Includes light lunch',
  ],
  primaryCta: { label: 'Register now', href: '#book' },
  secondaryCta: { label: 'View event details', href: '#details' },
}

/* ─────────────────────────────── Why attend ──────────────────────────────── */

export const whyAttend: { title: string; body: string }[] = [
  {
    title: 'Defence-related opportunities, unpacked',
    body: 'Understand where regional businesses can engage with defence supply chains, contracts and adjacent opportunities.',
  },
  {
    title: 'Practical insight from experienced speakers',
    body: 'Grounded sessions from people who have actually built businesses, run teams and delivered on mission.',
  },
  {
    title: 'The value of service leavers',
    body: 'Explore why ex-military talent is a strong fit for growing businesses, and how to hire from this pool.',
  },
  {
    title: 'Relationships that matter',
    body: 'Connect with business leaders, partners and organisations across Lincolnshire and the East Midlands.',
  },
]

/* ─────────────────────────── Event highlights ────────────────────────────── */

export const highlights: { title: string; body: string }[] = [
  {
    title: 'Year two',
    body: 'The return of Mission Business after a sold-out first year.',
  },
  {
    title: 'Built for decision-makers',
    body: 'Practical sessions designed for business owners, leaders and senior decision-makers.',
  },
  {
    title: 'Regionally focused',
    body: 'Strong relevance for Lincolnshire and the wider East Midlands business community.',
  },
  {
    title: 'Hosted on a military base',
    body: 'Unique setting at Prince William of Gloucester Barracks, Grantham.',
  },
  {
    title: 'Networking and lunch included',
    body: 'Dedicated time to build relationships, plus a light lunch provided.',
  },
  {
    title: 'Limited places',
    body: 'Last year sold out. Pre-registration is required for base access.',
  },
]

/* ──────────────────────────────── Speakers ───────────────────────────────── */

export type Speaker = {
  name: string
  role: string
  bio: string
  featured?: boolean
  featuredNote?: string
  image?: string // place file in /public/images/speakers/ and reference as /images/speakers/<file>
}

export const speakers: Speaker[] = [
  {
    name: 'Paul Green',
    role: 'Organiser · Founder, Business Unfinished',
    bio: 'Business coach, mentor and connector. Founder of Business Unfinished and host of Mission Business.',
  },
  {
    name: 'Col Lorna Ward',
    role: 'Speaker',
    bio: 'Senior defence leader sharing practical perspective on leadership, mission and people.',
  },
  {
    name: 'Lynsey Parke',
    role: 'Speaker',
    bio: 'Experienced speaker bringing insight on business growth, leadership and opportunity.',
  },
  {
    name: 'Helen Seymour',
    role: 'Speaker',
    bio: 'The first ever female fast jet pilot. A unique perspective on performance, pressure and leadership.',
    featured: true,
    featuredNote: 'First ever female fast jet pilot',
  },
  {
    name: 'Maj Guy Page',
    role: 'Speaker',
    bio: 'Military leader contributing practical insight relevant to business operations and teams.',
  },
  {
    name: 'Lt Col Noel Sheeran',
    role: 'Speaker',
    bio: 'Experienced defence leader sharing perspective on strategy, execution and people.',
  },
  {
    name: 'Maj Jordan Kemp',
    role: 'Speaker',
    bio: 'Military leader bringing a grounded view on delivery, discipline and decision-making.',
  },
  {
    name: 'Ian Astley',
    role: 'Speaker',
    bio: 'Speaker sharing practical, business-focused insight for owners and decision-makers.',
  },
  {
    name: 'Scott Linfoot',
    role: 'Speaker',
    bio: 'Speaker contributing real-world perspective relevant to regional business leaders.',
  },
]

/* ───────────────────────────── Organiser block ───────────────────────────── */

export const organiser = {
  name: 'Paul Green',
  role: 'Organiser · Founder, Business Unfinished',
  bio: 'Paul Green is an experienced business coach, mentor and connector with a long track record of helping businesses grow, build momentum and create meaningful opportunities. Mission Business is his flagship regional event, bringing practical insight and useful connections into one room.',
}

/* ───────────────────────────────── Partners ──────────────────────────────── */

export type Partner = {
  name: string
  logo?: string // place file in /public/images/partners/ and reference as /images/partners/<file>
  href?: string
}

export const partners: Partner[] = [
  { name: 'South Kesteven District Council' },
  { name: 'Ministry of Defence' },
  { name: 'Business Unfinished' },
  // Additional partner slots — fill these in as logos come in.
  { name: 'Partner slot' },
  { name: 'Partner slot' },
  { name: 'Partner slot' },
]

/* ───────────────────────────────── Booking ───────────────────────────────── */

export const booking = {
  heading: 'Book your place',
  subheading: 'Secure your free place today. Pre-registration is required.',
  note:
    'Attendee details are required in advance to help facilitate access to the base on the day.',
}

/* ────────────────────────────────── Footer ───────────────────────────────── */

export const footer = {
  tagline: 'Practical insight. Real opportunity. Powerful connections.',
  credit: 'An event by Business Unfinished.',
}
