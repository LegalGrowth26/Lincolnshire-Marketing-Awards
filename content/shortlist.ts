// Public shortlist for the 2026 awards.
// Announced publicly. Contains NO scores, NO winner, NO highly commended.
// Winners are revealed on the night and must never appear in this file.
//
// `name` is the entry as it should be shown. `detail` is secondary text shown
// beneath it — only the Business Recognition Award uses it, because that award
// is a peer nomination of individuals, so it shows the person with their
// company beneath. Every other category is company names only.

export type ShortlistEntry = { name: string; detail?: string }
export type ShortlistCategory = { category: string; entries: ShortlistEntry[] }

export const shortlist: ShortlistCategory[] = [
  {
    category: "Business Growth Award",
    entries: [
      { name: "Agent Armour Accounts Limited" },
      { name: "Laser Red" },
      { name: "Imp Electrical" },
      { name: "Three Pillars Training" },
    ],
  },
  {
    category: "Start-Up / New Business of the Year",
    entries: [
      { name: "Nocturna Counselling" },
      { name: "Arcanum Academy Ltd" },
      { name: "Duke IT Support" },
      { name: "New Age Financial Services" },
    ],
  },
  {
    category: "Scale-Up Business of the Year",
    entries: [
      { name: "Imp Electrical" },
      { name: "Magna Radio" },
      { name: "Jolly Good Web" },
      { name: "Agent Armour Accounts Limited" },
    ],
  },
  {
    category: "Breakthrough Business of the Year",
    entries: [
      { name: "LA Solutions" },
      { name: "Agri.Cycle" },
      { name: "Wickerbys C.I.C Community Hub" },
      { name: "Fine Art and Illustration" },
    ],
  },
  {
    category: "Entrepreneur of the Year",
    entries: [
      { name: "The Thrive Tribe" },
      { name: "Samaxia Ltd" },
      { name: "The Skills Blueprint" },
      { name: "Arcanum" },
    ],
  },
  {
    category: "Employer of the Year",
    entries: [
      { name: "Guardian Angel Carers" },
      { name: "Laser Red" },
      { name: "Nick Young Tractor Parts" },
    ],
  },
  {
    category: "Rising Star Award",
    entries: [
      { name: "SwitchUp Marketing" },
      { name: "Prosper Digital" },
      { name: "Tiny Talk" },
      { name: "LA Solutions" },
    ],
  },
  {
    category: "Community Impact Award",
    entries: [
      { name: "Cash for kids" },
      { name: "Tiny Talk" },
      { name: "Beyond Money Education and Training CIC" },
      { name: "LIVES" },
    ],
  },
  {
    category: "Marketing Campaign of the Year",
    entries: [
      { name: "J&S Heating & Cooling" },
      { name: "DoughGirl" },
      { name: "Thrive Tribe Live Business Expo" },
    ],
  },
  {
    category: "Best Use of Social Media for Growth",
    entries: [
      { name: "Nick Young Tractor Parts" },
      { name: "Williams Wealth Consultancy" },
      { name: "Magna Radio" },
      { name: "Arcanum Academy" },
    ],
  },
  {
    category: "Brand Growth Award",
    entries: [
      { name: "Guardian Angel Carers" },
      { name: "Fine Art and Illustration" },
    ],
  },
  {
    category: "Customer Experience Award",
    entries: [
      { name: "The Thrive Tribe" },
      { name: "Voice Confident" },
      { name: "Duke IT" },
      { name: "The Grange Spa" },
    ],
  },
  {
    category: "Customer Growth Award",
    entries: [
      { name: "Imp Electrical" },
      { name: "Williams Wealth Consultancy" },
      { name: "Duke IT Support" },
    ],
  },
  {
    category: "Professional Services Growth Award",
    entries: [
      { name: "Three Pillars" },
      { name: "Agent Armour Accounts Limited" },
      { name: "Nocturna Counselling" },
      { name: "Williams Wealth Consultancy" },
    ],
  },
  {
    category: "Business Recognition Award",
    entries: [
      { name: "Tommy Findlay", detail: "Surprise Shirts" },
      { name: "Bobby Copping", detail: "Lincoln City" },
      { name: "Robert Drury" },
      { name: "Emmalee Cullum" },
      { name: "Paul Green", detail: "Business Unfinished" },
      { name: "Claire Lockey" },
    ],
  },
]
