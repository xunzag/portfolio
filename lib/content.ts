// Single source of truth for everything the room talks about.

export const profile = {
  name: "Farhan Ali",
  handle: "xunzag",
  role: "IT Engineer & Full-Stack Developer",
  roles: ["IT Engineer", "Full-Stack Developer", "Microsoft 365 Admin", "Problem Solver", "anime enjoyer"],
  tagline: "I build the product — and run the systems behind it.",
  bio: [
    "I'm an IT engineer and full-stack developer from Karachi. By day I lead IT for a US property-management client: Microsoft 365, Entra ID, Intune, SharePoint, and every ticket in between.",
    "Before that I shipped client web products end to end with React, Next.js and Node, and deployed them on Azure and AWS. I'm comfortable on both sides of the screen: the code, and the systems that keep it running.",
    "Off the clock it's Hunter x Hunter, photography up north, and The Weeknd on repeat.",
  ],
  location: "Karachi, Pakistan · Remote OK",
  timezone: "UTC +5 (PKT)",
  email: "farhan.babar123@gmail.com",
  cv: "/cv.pdf",
  photo: "/tex/me.webp",
  socials: {
    github: "https://github.com/xunzag",
    linkedin: "https://www.linkedin.com/in/farhan-ali-98a584206/",
    instagram: "https://www.instagram.com/xunzag",
  },
}

export const stats = [
  { value: 3, suffix: "+", label: "Years in tech" },
  { value: 4, suffix: "", label: "Companies" },
  { value: 9, suffix: "+", label: "Products shipped" },
  { value: 1, suffix: "", label: "M365 tenant run" },
]

export const credentials = [
  { title: "BS Software Engineering", where: "UIT University, Karachi", when: "2020 - 2024" },
  { title: "Microsoft Student Ambassador", where: "Workshops on Git & Microsoft tools", when: "2023 - 2024" },
]

export type Project = {
  slug: string
  title: string
  tagline: string
  description: string
  /** screenshot; projects without one get a generated title card */
  image?: string
  tech: string[]
  metrics: [string, string][]
  category: "Full Stack" | "Frontend" | "Mobile"
  year: string
  accent: string
  links: { github?: string; live?: string }
}

export const projects: Project[] = [
  {
    slug: "cdta-exam-portal",
    title: "CDTA Exam Portal",
    tagline: "Secure national exam platform",
    description:
      "Exam portal for the CDTA with secure authentication and role-based access control: account creation, permissions and access management built for a non-technical admin team.",
    tech: ["Authentication", "Role-based access", "Account management", "Admin tooling"],
    metrics: [["RBAC", "access control"], ["Live", "in production"], ["Canada", "national body"]],
    category: "Full Stack",
    year: "2025",
    accent: "#5fd8ff",
    links: { live: "https://portal.cdtanational.ca" },
  },
  {
    slug: "shf-safe-home",
    title: "SHF Safe Home",
    tagline: "Field inspection app on the App Store",
    description:
      "Mobile-first, reliability-focused inspection app for field teams: data capture and reporting workflows that keep working across iOS devices on site.",
    tech: ["iOS", "Mobile-first", "Data capture", "Reporting"],
    metrics: [["iOS", "App Store"], ["Field", "data capture"], ["PDF", "reporting"]],
    category: "Mobile",
    year: "2025",
    accent: "#6fffc0",
    links: {},
  },
  {
    slug: "elevate-carts",
    title: "Elevate Carts",
    tagline: "Enterprise e-commerce engine",
    description:
      "Software company providing tailored e-commerce solutions, payment integrations and business analytics — architected to handle 100k+ SKUs.",
    image: "/tex/p-ec.webp",
    tech: ["Vue.js", "Laravel", "MySQL", "Docker", "AWS", "GraphQL"],
    metrics: [["50+", "clients"], ["1M+", "transactions"], ["99.9%", "uptime"]],
    category: "Full Stack",
    year: "2023",
    accent: "#8b7bff",
    links: { github: "https://github.com/xunzag/elevatecarts", live: "https://elevatecarts.com" },
  },
  {
    slug: "amazonchapter",
    title: "AmazonChapter",
    tagline: "Course marketplace for Amazon sellers",
    description:
      "Educational platform for Amazon-related courses — from FBA to marketing strategy — with interactive lessons, Stripe payments and a community.",
    image: "/tex/p5.webp",
    tech: ["Next.js", "React", "TypeScript", "Firebase", "Stripe", "TailwindCSS"],
    metrics: [["10k+", "learners"], ["25+", "courses"], ["96%", "satisfaction"]],
    category: "Full Stack",
    year: "2022",
    accent: "#ffb547",
    links: { github: "https://github.com/xunzag/amazonchapter", live: "https://amazonchapter.com" },
  },
  {
    slug: "freshcart",
    title: "FreshCart",
    tagline: "Same-day grocery ordering",
    description:
      "Modern grocery purchasing platform with seamless ordering, real-time inventory tracking and fast delivery options.",
    image: "/tex/p6.webp",
    tech: ["React", "Node.js", "Express", "MongoDB", "Redux", "TailwindCSS"],
    metrics: [["5k+", "products"], ["200+/day", "orders"], ["30 min", "avg delivery"]],
    category: "Full Stack",
    year: "2023",
    accent: "#3ee39a",
    links: { github: "https://github.com/xunzag/freshcart", live: "https://freshcart-demo.com" },
  },
  {
    slug: "lunchthymes",
    title: "LunchThymes",
    tagline: "School lunch ordering",
    description:
      "Food ordering platform for schools — parents order lunches for their children with payment integration and live order tracking.",
    image: "/tex/p2.webp",
    tech: ["React", "Node.js", "MongoDB", "Express", "shadcn/ui", "TailwindCSS"],
    metrics: [["10k+", "orders"], ["15+", "schools"], ["98%", "satisfaction"]],
    category: "Full Stack",
    year: "2022",
    accent: "#4cc9ff",
    links: { github: "https://github.com/xunzag/lunchthymes", live: "https://lunchthymes.com" },
  },
  {
    slug: "sales-analytics",
    title: "Sales Analytics",
    tagline: "Real-time D3 dashboard",
    description:
      "Real-time sales analytics dashboard with advanced D3.js visualisation, custom reporting and data export.",
    image: "/tex/p4.webp",
    tech: ["Next.js", "D3.js", "TypeScript", "Firebase", "TailwindCSS"],
    metrics: [["1M+", "data points"], ["50+", "reports"], ["99.9%", "accuracy"]],
    category: "Frontend",
    year: "2023",
    accent: "#ff6b6b",
    links: { github: "https://github.com/xunzag/sales-analytics" },
  },
  {
    slug: "lms-portal",
    title: "LMS Portal",
    tagline: "Learning management system",
    description:
      "Comprehensive LMS with course management, student progress tracking and interactive learning tools.",
    image: "/tex/p3.webp",
    tech: ["PHP", "Laravel", "MySQL", "jQuery", "Bootstrap", "AWS"],
    metrics: [["5k+", "students"], ["100+", "courses"], ["92%", "completion"]],
    category: "Full Stack",
    year: "2022",
    accent: "#2ee6c5",
    links: { github: "https://github.com/xunzag/lms-portal" },
  },
  {
    slug: "peptides-calculator",
    title: "Peptides Calculator",
    tagline: "Scientific mobile app",
    description:
      "Mobile app that calculates the molecular weight of peptides with real-time processing, validation and PDF export.",
    image: "/tex/p1.webp",
    tech: ["React Native", "TypeScript", "Node.js", "Prisma", "PostgreSQL"],
    metrics: [["1k+", "downloads"], ["500+", "users"], ["4.8★", "rating"]],
    category: "Mobile",
    year: "2024",
    accent: "#c77dff",
    links: { github: "https://github.com/xunzag/peptides-calculator" },
  },
]

export const experience = [
  {
    hash: "a3f9d12",
    role: "IT Lead",
    company: "VirtueServe Solutions",
    period: "Sep 2026 - Now",
    type: "Full-time",
    desc: "Lead IT for a US property-management client. Global Admin on Microsoft 365: Exchange, SharePoint, Entra ID, Intune. Runbooks, onboarding and every escalation.",
    active: true,
  },
  {
    hash: "c7f2b91",
    role: "Production Lead & Full Stack Dev",
    company: "Babar Tech Solutions",
    period: "Jan 2025 - Sep 2026",
    type: "Full-time",
    desc: "Led client web projects end to end: timelines, quality, releases. Azure and AWS deployments with Docker and Git.",
    active: false,
  },
  {
    hash: "8d1a5e3",
    role: "Full Stack Developer",
    company: "Elevate Carts",
    period: "Sep 2024 - Jan 2025",
    type: "Full-time",
    desc: "Scalable e-commerce apps with React, Next.js, Node and Express. SQL and NoSQL design, REST integrations.",
    active: false,
  },
  {
    hash: "41be7c0",
    role: "Data Scientist (Intern)",
    company: "Systems Limited",
    period: "Jun - Dec 2023",
    type: "Internship",
    desc: "Analysed large datasets, tuned neural networks for prediction, automated data pipelines in Python.",
    active: false,
  },
]

export const values = [
  { title: "Innovation first", body: "Embrace emerging tech, think outside the box, challenge conventions." },
  { title: "Quality driven", body: "Clean architecture, robust testing, performance first." },
  { title: "User focused", body: "Intuitive, accessible, feedback-driven experiences." },
]

export const skillGroups = [
  {
    name: "Development",
    color: "#8b7bff",
    items: [
      { name: "React & Next.js", level: 92 },
      { name: "TypeScript", level: 88 },
      { name: "Node & Express", level: 87 },
      { name: "Python", level: 80 },
    ],
  },
  {
    name: "Microsoft 365 & Cloud",
    color: "#4cc9ff",
    items: [
      { name: "M365 Admin", level: 93 },
      { name: "Entra ID & Intune", level: 86 },
      { name: "SharePoint", level: 88 },
      { name: "Azure & AWS", level: 82 },
    ],
  },
  {
    name: "Data & DevOps",
    color: "#3ee39a",
    items: [
      { name: "PostgreSQL & SQL", level: 85 },
      { name: "MongoDB", level: 84 },
      { name: "Docker & CI/CD", level: 85 },
      { name: "Git", level: 92 },
    ],
  },
]

export const toolbelt = [
  "React", "Next.js", "TypeScript", "Node.js", "Python", "PowerShell", "Microsoft 365", "Entra ID",
  "Intune", "SharePoint", "Azure", "AWS", "Docker", "PostgreSQL", "MongoDB", "Zendesk",
]

export const animes = [
  { title: "Hunter x Hunter", image: "/tex/a-hxh.webp", rating: "9.1", fav: "Killua Zoldyck", arc: "Chimera Ant Arc", quote: "You should enjoy the little detours to the fullest." },
  { title: "Attack on Titan", image: "/tex/a-aot.webp", rating: "9.0", fav: "Levi Ackerman", arc: "Marley Arc", quote: "If you win, you live. If you lose, you die." },
  { title: "Death Note", image: "/tex/a-deathnote.webp", rating: "9.0", fav: "L Lawliet", arc: "L vs Light", quote: "I am Justice!" },
  { title: "Monster", image: "/tex/a-monster.webp", rating: "8.9", fav: "Dr. Kenzo Tenma", arc: "The Perfect Suicide", quote: "The monster inside of me has grown this large." },
  { title: "Bleach", image: "/tex/a-bleach.webp", rating: "8.8", fav: "Byakuya Kuchiki", arc: "Soul Society Arc", quote: "If fate is a millstone, then we are the grist." },
  { title: "Jujutsu Kaisen", image: "/tex/a-jjk.webp", rating: "8.7", fav: "Gojo Satoru", arc: "Shibuya Incident", quote: "Throughout heaven and earth, I alone am the honored one." },
]

export const hobbies = [
  { title: "Gaming", image: "/tex/h-got.webp", detail: "Ghost of Tsushima · RPG & strategy", quote: "We end this together!", since: "2010" },
  { title: "Photography", image: "/tex/h-photography.webp", detail: "Sony A7III · Northern Areas", quote: "The best camera is the one you have with you.", since: "2019" },
  { title: "Reading", image: "/tex/h-reading.webp", detail: "12 books/year · history & science", quote: "Knowledge is power, books are the battery.", since: "2015" },
  { title: "Music", image: "/tex/h-musice.webp", detail: "The Weeknd · guitar", quote: "Music is how I debug my brain.", since: "2016" },
]

export const openTo = [
  "IT engineering & Microsoft 365 roles",
  "Full-stack development",
  "Long-term contracts (6+ months)",
  "Consulting & freelance projects",
]

export const duckQuotes = [
  "Have you tried console.log?",
  "It works on my machine. 🦆",
  "Quack. That's a race condition.",
  "Did you check the dependency array?",
  "Ship it. Fix it in prod.",
  "Explain it to me line by line…",
  "99 little bugs in the code…",
  "Is it cached? It's always cached.",
]

// Public EmailJS identifiers (safe to ship to the browser).
export const emailjsConfig = {
  serviceId: "service_gx0cj7o",
  templateId: "template_nodmfpa",
  publicKey: "pa51ET1DYIGze1RqM",
}

// ── "Cool things about me" — straight from Farhan's own /etc/farhan.conf ──
export const facts = [
  { value: "06:00", label: "wake-up call", note: "early bird mode" },
  { value: "120", label: "WPM typing", note: "measured, not estimated" },
  { value: "500+", label: "LeetCode solved", note: "the grind never stops" },
  { value: "100k+", label: "lines of code", note: "and counting" },
  { value: "2190", label: "cups of coffee", note: "lifetime total" },
  { value: "4L", label: "water a day", note: "hydration > caffeination" },
  { value: "50", label: "push-ups", note: "daily PR" },
  { value: "6h", label: "sleep", note: "non-negotiable" },
]

export const setup = [
  ["Machine", "MacBook Pro M3"],
  ["Desk", "Zendesk, Splashtop, M365 admin"],
  ["Editor", "VS Code (neovim on weekends)"],
  ["Shell", "zsh + oh-my-zsh"],
  ["Debugger", "a rubber duck"],
  ["Fuel", "chai, coffee, lo-fi"],
  ["Camera", "Sony A7III"],
] as const

export const principles = [
  "Own it end to end: the code and the systems under it.",
  "Obsessed with performance.",
  "Write code other devs actually want to maintain.",
  "It works on my machine → so I ship the machine.",
]
