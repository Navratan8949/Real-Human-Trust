export const MOCK_EVENTS = [
  {
    _id: "e1",
    title: "Free Health & Eye Check-up Camp",
    description:
      "A full-day medical camp offering free general health screenings, eye check-ups and medicine distribution for underserved families in Rajkot.",
    location: "Atika Community Hall, Rajkot",
    eventDate: "2026-08-22",
    registrationLastDate: "2026-08-20",
    maxParticipants: 500,
    image: "/community-health-camp-india.png",
  },
  {
    _id: "e2",
    title: "Back-to-School Kit Distribution",
    description:
      "Distributing school bags, books, and uniforms to 1,200 children from low-income families ahead of the new academic year.",
    location: "Municipal School No. 14, Rajkot",
    eventDate: "2026-09-05",
    registrationLastDate: "2026-09-01",
    maxParticipants: 300,
    image: "/children-receiving-school-supplies-india.png",
  },
  {
    _id: "e3",
    title: "Tree Plantation Drive - Green Gujarat",
    description:
      "Join hundreds of volunteers to plant 5,000 saplings across Rajkot district as part of our environmental sustainability mission.",
    location: "Aji Riverfront, Rajkot",
    eventDate: "2026-09-20",
    registrationLastDate: "2026-09-18",
    maxParticipants: 800,
    image: "/tree-plantation-volunteers-india.png",
  },
]

export const MOCK_PROJECTS = [
  {
    _id: "p1",
    title: "Shiksha Setu - Education for All",
    description:
      "Bridging the education gap by running free coaching centres and sponsoring school fees for underprivileged children.",
    category: "Education",
    status: "active",
    image: "/rural-classroom-children-learning-india.png",
  },
  {
    _id: "p2",
    title: "Anna Seva - Community Kitchen",
    description:
      "Serving nutritious meals daily to the homeless, elderly and daily-wage workers across Rajkot.",
    category: "Food & Nutrition",
    status: "active",
    image: "/community-kitchen-serving-food-india.png",
  },
  {
    _id: "p3",
    title: "Swasthya - Mobile Health Units",
    description:
      "Mobile medical vans delivering primary healthcare, check-ups and awareness to remote villages.",
    category: "Healthcare",
    status: "active",
    image: "/mobile-medical-van-rural-india.png",
  },
  {
    _id: "p4",
    title: "Naari Shakti - Women Empowerment",
    description:
      "Skill development and micro-enterprise training empowering women to become financially independent.",
    category: "Empowerment",
    status: "completed",
    image: "/women-skill-training-workshop-india.png",
  },
]

export const MOCK_CAMPAIGNS = [
  {
    _id: "c1",
    title: "Sponsor a Child's Education for a Year",
    description:
      "Help us cover tuition, books and uniforms for 200 bright children who cannot afford school this year.",
    targetAmount: 1000000,
    raisedAmount: 685000,
    endDate: "2026-12-31",
    category: "Education",
    image: "/smiling-school-children-india-education.png",
  },
  {
    _id: "c2",
    title: "Build a Rural Library",
    description:
      "Fund the construction of a community library serving 3 villages with books, computers and internet.",
    targetAmount: 1500000,
    raisedAmount: 420000,
    endDate: "2027-03-15",
    category: "Infrastructure",
    image: "/placeholder.svg?height=600&width=800",
  },
]

export const MOCK_NEWS = [
  {
    _id: "n1",
    title: "Real Human Trust Reaches 25,000 Lives Milestone",
    content:
      "This year our combined programs across education, health and nutrition have directly benefited over 25,000 individuals.",
    category: "Milestone",
    type: "news",
    createdAt: "2026-07-10",
    image: "/about-volunteers-india.png",
  },
  {
    _id: "n2",
    title: "New Skill Centre Inaugurated in Rajkot",
    content:
      "A state-of-the-art vocational skill development centre was inaugurated to train 500 youth annually.",
    category: "Announcement",
    type: "press_release",
    createdAt: "2026-06-18",
    image: "/women-skill-training-workshop-india.png",
  },
  {
    _id: "n3",
    title: "Monsoon Relief Distributed to 800 Families",
    content:
      "Emergency food and hygiene kits were provided to families affected by heavy monsoon flooding.",
    category: "Relief",
    type: "news",
    createdAt: "2026-05-30",
    image: "/community-kitchen-serving-food-india.png",
  },
]

export const MOCK_GALLERY = [
  { _id: "g1", title: "Education Drive", type: "photo", image: "/rural-classroom-children-learning-india.png" },
  { _id: "g2", title: "Health Camp", type: "photo", image: "/community-health-camp-india.png" },
  { _id: "g3", title: "Food Distribution", type: "photo", image: "/community-kitchen-serving-food-india.png" },
  { _id: "g4", title: "Women Empowerment", type: "photo", image: "/women-skill-training-workshop-india.png" },
  { _id: "g5", title: "Tree Plantation", type: "photo", image: "/tree-plantation-volunteers-india.png" },
  { _id: "g6", title: "School Kit Distribution", type: "photo", image: "/children-receiving-school-supplies-india.png" },
]

export const MOCK_TESTIMONIALS = [
  {
    _id: "t1",
    name: "Priya Mehta",
    designation: "Parent, Rajkot",
    message:
      "Real Human Education & Charitable Trust helped my daughter continue her education by providing books, school fees, and continuous support. We are truly grateful for their dedication towards education.",
    rating: 5,
    status: "active",
    image: {
      public_id: "",
      url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500",
    },
  },
  {
    _id: "t2",
    name: "Dr. Anand Joshi",
    designation: "Volunteer Physician",
    message:
      "I have participated in several medical camps organized by the trust. Their commitment to healthcare and community welfare is inspiring, and every event is managed professionally.",
    rating: 5,
    status: "active",
    image: {
      public_id: "",
      url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500",
    },
  },
  {
    _id: "t3",
    name: "Rekha Ben",
    designation: "Beneficiary, Women Empowerment",
    message:
      "The skill development and tailoring training provided by the trust changed my life. Today I earn independently and support my family with confidence and dignity.",
    rating: 5,
    status: "active",
    image: {
      public_id: "",
      url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500",
    },
  },
  {
    _id: "t4",
    name: "Rekha ",
    designation: "Beneficiary, Women Empowerment",
    message:
      "The skill development and tailoring training provided by the trust changed my life. Today I earn independently and support my family with confidence and dignity.",
    rating: 5,
    status: "active",
    image: {
      public_id: "",
      url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500",
    },
  },
];
export const MOCK_TEAM = [
  { _id: "tm1", name: "Rajesh Patel", designation: "Founder & Chairman", order: 1, photo: "/placeholder.svg?height=400&width=400" },
  { _id: "tm2", name: "Sunita Desai", designation: "Secretary", order: 2, photo: "/placeholder.svg?height=400&width=400" },
  { _id: "tm3", name: "Amit Shah", designation: "Treasurer", order: 3, photo: "/placeholder.svg?height=400&width=400" },
  { _id: "tm4", name: "Kavita Sharma", designation: "Program Director", order: 4, photo: "/placeholder.svg?height=400&width=400" },
]

export const MOCK_AWARDS = [
  { _id: "a1", title: "Best NGO in Education", awardedBy: "Gujarat State Social Welfare Board", year: "2024", description: "Recognised for outstanding contribution to child education." },
  { _id: "a2", title: "Excellence in Community Service", awardedBy: "Rajkot Municipal Corporation", year: "2023", description: "Honoured for sustained community upliftment programs." },
  { _id: "a3", title: "Social Impact Award", awardedBy: "Gujarat Chamber of Commerce", year: "2022", description: "For measurable social impact across the district." },
]
