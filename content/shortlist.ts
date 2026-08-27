// Public shortlist for the 2026 awards.
// Announced publicly. Contains NO scores, NO winner, NO highly commended.
// Winners are revealed on the night and must never appear in this file.

export type ShortlistEntry = { company: string; contact?: string }
export type ShortlistCategory = { category: string; entries: ShortlistEntry[] }

export const shortlist: ShortlistCategory[] = [
  {
    category: "Business Growth Award",
    entries: [
      { company: "Agent Armour Accounts Limited", contact: "David Armour" },
      { company: "Laser Red", contact: "Stephanie Henderson" },
      { company: "Imp Electrical", contact: "Emily Purbrick" },
      { company: "Three Pillars Training", contact: "Sharon Williams" },
    ],
  },
  {
    category: "Start-Up / New Business of the Year",
    entries: [
      { company: "Nocturna Counselling", contact: "Sharlene O'Brien" },
      { company: "Arcanum Academy Ltd", contact: "Eleanor Bryan" },
      { company: "Duke IT Support", contact: "Hannah Pollard" },
      { company: "New Age Financial Services", contact: "Will Stokes" },
    ],
  },
  {
    category: "Scale-Up Business of the Year",
    entries: [
      { company: "Imp Electrical", contact: "Emily Purbrick" },
      { company: "Magna Radio" },
      { company: "Jolly Good Web", contact: "Hannah Langton" },
      { company: "Agent Armour Accounts Limited", contact: "David Armour" },
    ],
  },
  {
    category: "Breakthrough Business of the Year",
    entries: [
      { company: "LA Solutions", contact: "Lance Allcock" },
      { company: "Agri.Cycle", contact: "Charlie Fytche" },
      { company: "Wickerbys C.I.C Community Hub", contact: "Beverley Jones" },
      { company: "Fine Art and Illustration", contact: "Helen Dearnley" },
    ],
  },
  {
    category: "Entrepreneur of the Year",
    entries: [
      { company: "The Thrive Tribe", contact: "Mark Pitfield" },
      { company: "Samaxia Ltd", contact: "Sam Williamson" },
      { company: "The Skills Blueprint", contact: "Claire Lockey" },
      { company: "Arcanum", contact: "Eleanor Bryan" },
    ],
  },
  {
    category: "Employer of the Year",
    entries: [
      { company: "Guardian Angel Carers" },
      { company: "Laser Red", contact: "Stephanie Henderson" },
      { company: "Nick Young Tractor Parts", contact: "Emma Watson" },
    ],
  },
  {
    category: "Rising Star Award",
    entries: [
      { company: "SwitchUp Marketing", contact: "Morgan Varlow" },
      { company: "Prosper Digital", contact: "Callum Skinner" },
      { company: "Tiny Talk", contact: "Emmalee Cullum" },
      { company: "LA Solutions" },
    ],
  },
  {
    category: "Community Impact Award",
    entries: [
      { company: "Cash for kids", contact: "Hannah Clark" },
      { company: "Tiny Talk", contact: "Emmalee Cullum" },
      { company: "Beyond Money Education and Training CIC", contact: "Maureen O’Callaghan" },
      { company: "LIVES", contact: "Max Imbornone" },
    ],
  },
  {
    category: "Marketing Campaign of the Year",
    entries: [
      { company: "J&S Heating & Cooling", contact: "Jason Andrews" },
      { company: "DoughGirl", contact: "Maisie Whittam" },
      { company: "Thrive Tribe Live Business Expo", contact: "Amie-Leigh Minshull" },
    ],
  },
  {
    category: "Best Use of Social Media for Growth",
    entries: [
      { company: "Nick Young Tractor Parts", contact: "Emma Watson" },
      { company: "Williams Wealth Consultancy", contact: "Lauren Halliwell" },
      { company: "Magna Radio" },
      { company: "Arcanum Academy", contact: "Eleanor Bryan" },
    ],
  },
  {
    category: "Brand Growth Award",
    entries: [
      { company: "Guardian Angel Carers" },
      { company: "Fine Art and Illustration", contact: "Helen Dearnley" },
    ],
  },
  {
    category: "Customer Experience Award",
    entries: [
      { company: "The Thrive Tribe", contact: "Lucy Pitfield" },
      { company: "Voice Confident", contact: "Kaffy Rice-Oxley" },
      { company: "Duke IT", contact: "Hannah Pollard" },
      { company: "The Grange Spa", contact: "Matthew Craven" },
    ],
  },
  {
    category: "Customer Growth Award",
    entries: [
      { company: "Imp Electrical", contact: "Emily Purbrick" },
      { company: "Williams Wealth Consultancy", contact: "Lauren Halliwell" },
      { company: "Duke IT Support", contact: "Hannah Pollard" },
    ],
  },
  {
    category: "Professional Services Growth Award",
    entries: [
      { company: "Three Pillars", contact: "Sharon Williams" },
      { company: "Agent Armour Accounts Limited", contact: "David Armour" },
      { company: "Nocturna Counselling", contact: "Sharlene O’Brien" },
      { company: "Williams Wealth Consultancy", contact: "Lauren Halliwell" },
    ],
  },
  {
    category: "Business Recognition Award",
    entries: [
      { company: "Surprise Shirts", contact: "Tommy Findlay" },
      { company: "Lincoln City", contact: "Bobby Copping" },
      { company: "Robert Drury", contact: "Robert Drury" },
      { company: "Emmalee Cullum", contact: "Emmalee Cullum" },
      { company: "Business Unfinished", contact: "Paul Green" },
      { company: "Claire Lockey", contact: "Claire Lockey" },
    ],
  },
]
