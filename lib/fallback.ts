import type {
  AboutPage,
  ContactPage,
  Entry,
  HomePage,
  NowPage,
  Post,
  Project,
  RichText,
  SiteSettings,
} from "./types";

/**
 * Seed content.
 *
 * The site renders entirely from this when Sanity isn't configured, and any
 * individual field falls back to it when the CMS leaves that field empty. Once
 * the matching document exists in Sanity, the CMS wins, and nothing here needs to
 * be edited again.
 */

/** Minimal markdown-ish -> Portable Text, so seed prose stays readable here. */
function pt(lines: string[]): RichText {
  return lines.map((line, index) => {
    const key = `seed-${index}`;
    if (line.startsWith("### ")) {
      return block(key, "h3", line.slice(4));
    }
    if (line.startsWith("## ")) {
      return block(key, "h2", line.slice(3));
    }
    if (line.startsWith("- ")) {
      return { ...block(key, "normal", line.slice(2)), listItem: "bullet", level: 1 };
    }
    return block(key, "normal", line);
  }) as RichText;
}

function block(key: string, style: string, text: string) {
  return {
    _type: "block" as const,
    _key: key,
    style,
    markDefs: [],
    children: [{ _type: "span" as const, _key: `${key}-0`, text, marks: [] }],
  };
}

const entries = (items: [string, string?][]): Entry[] =>
  items.map(([title, detail], index) => ({
    _key: `seed-entry-${index}`,
    title,
    detail: detail ?? null,
    url: null,
  }));

export const fallbackSettings: SiteSettings = {
  name: "San Pashtoon",
  role: "Systems and Embedded Engineer",
  tagline: null,
  description:
    "Systems and embedded engineer working close to the metal: embedded systems, real-time audio, and developer tools.",
  email: "sspashto@uci.edu",
  location: "Irvine, CA",
  socialLinks: [
    { _key: "gh", label: "GitHub", url: "https://github.com/sanpasht", icon: "github" },
    {
      _key: "li",
      label: "LinkedIn",
      url: "https://linkedin.com/in/sanpasht",
      icon: "linkedin",
    },
    { _key: "em", label: "Email", url: "mailto:sspashto@uci.edu", icon: "mail" },
  ],
  ogImage: null,
};

export const fallbackHome: HomePage = {
  heroName: "San Pashtoon",
  heroSubtitle: null,
  heroRole: "Systems and Embedded Engineer",
  intro: pt([
    "I build software close to the metal: embedded systems, real-time audio, and developer tools. My interests are in systems programming, performance, correctness, and translating mathematical ideas into practical software.",
  ]),
  currentFocusTitle: "Current Focus",
  currentFocus: entries([
    [
      "Real-time audio on embedded hardware",
      "Latency budgets, DMA pipelines, and what it takes to keep a signal path deterministic.",
    ],
    [
      "Systems programming",
      "Writing C and Rust that behaves the same on the tenth run as the first.",
    ],
  ]),
  featuredProjects: null,
  showLatestWriting: true,
  seo: null,
};

export const fallbackAbout: AboutPage = {
  heading: "About",
  lede: "I came to software through mathematics, and I still approach it the same way: figure out what's actually true, then build on it.",
  portrait: null,
  body: pt([
    "I studied mathematics before I wrote software professionally, and that ordering shaped everything after it. Proof work teaches you that an argument either holds or it doesn't, and that most of the effort goes into finding the right way to state the problem. Engineering rewards the same habit. Most hard bugs turn out to be a definition that was wrong from the start.",
    "## What I work on",
    "I'm drawn to the parts of the stack where the machine stops being an abstraction. Embedded systems, real-time audio, and developer tooling all share a quality I like: the constraints are real and you cannot argue with them. A deadline in an audio callback is not a preference. Either the buffer is ready or the user hears a click.",
    "That interest runs through most of what I build: signal paths on microcontrollers, scheduling and allocation problems, and the small tools that make the rest of the work faster.",
    "## How I think about engineering",
    "I work from first principles. I don't trust surface explanations or tradition; I want to know what is actually happening underneath the system. When I can't explain a behaviour end to end, I treat that as the next thing to learn rather than a detail to route around.",
    "I also assume systems are adversarial. They get stressed, misused, and pushed past whatever the happy path assumed. Designing for the idealized case is how you end up debugging at 2am. I'd rather find the traps early and optimize under real constraints than chase something that's only optimal on paper.",
    "## Outside of work",
    "I train Brazilian jiu-jitsu and Muay Thai. Both are useful correctives to sitting in front of a screen: you find out quickly whether your model of a situation matches reality, and there's no way to argue with the feedback.",
    "I read philosophy and literature with the same appetite I have for technical material. Paradise Lost is the one I keep returning to. Milton takes an argument seriously enough to give the other side the best lines, which is a discipline worth borrowing.",
    "## Stack",
    "C, C++, Rust, Python, and TypeScript day to day. Embedded work on ARM Cortex-M. Linux, Git, and the usual tooling around them. I pick languages by what the problem needs, not by what I'd prefer to be writing.",
  ]),
  seo: null,
};

export const fallbackNow: NowPage = {
  heading: "Now",
  intro: pt([
    "What I'm actively working on, reading, and thinking about. Updated when it stops being true.",
  ]),
  currentFocus: entries([
    ["Real-time audio pipelines", "Getting deterministic latency out of embedded hardware."],
    ["Firmware correctness", "Making failure modes explicit instead of incidental."],
  ]),
  building: entries([
    ["SIME", "A systems project in progress."],
    ["STM32 Air Guitar", "Gesture-driven audio synthesis on a Cortex-M."],
  ]),
  learning: entries([
    ["Rust for embedded targets", "Ownership as a hardware discipline, not just a compiler rule."],
    ["Digital signal processing", "Filters, windows, and the arithmetic behind them."],
  ]),
  research: entries([
    ["Scheduling and allocation", "Practical approximations for constrained assignment problems."],
  ]),
  reading: [
    {
      _key: "seed-read-0",
      title: "Paradise Lost",
      author: "John Milton",
      note: "Re-reading. The argument is better than the summary suggests.",
      url: null,
    },
    {
      _key: "seed-read-1",
      title: "Computer Systems: A Programmer's Perspective",
      author: "Bryant & O'Hallaron",
      note: null,
      url: null,
    },
  ],
  courses: entries([["Advanced algorithms"], ["Embedded systems design"]]),
  goals: entries([
    ["Ship one substantial systems project per quarter"],
    ["Write publicly once a month"],
  ]),
  technologies: ["C", "C++", "Rust", "Python", "TypeScript", "STM32", "Linux"],
  recentlyFinished: entries([
    ["Parking Algorithm", "Constraint-based allocation, written up under Projects."],
  ]),
  thoughts: pt([
    "Most performance work is really measurement work. The change is usually small once you know where it goes.",
  ]),
  lastUpdated: "2026-08-01T00:00:00.000Z",
  seo: null,
};

export const fallbackContact: ContactPage = {
  heading: "Contact",
  body: pt([
    "I'm glad to hear about interesting technical problems, systems work, and roles where correctness matters. The fastest way to reach me is email.",
  ]),
  links: null,
  responseNote: "I usually reply within a couple of days.",
  seo: null,
};

/**
 * The three seed projects from the spec. Descriptions are deliberately thin:
 * they exist so the routes render, and are meant to be replaced in the Studio.
 */
export const fallbackProjects: Project[] = [
  {
    _id: "seed-project-sime",
    title: "SIME",
    slug: "sime",
    shortDescription:
      "Placeholder. Replace this description in the Studio once the write-up is ready.",
    technologies: ["C", "Embedded", "Real-time"],
    tags: ["systems"],
    status: "in-progress",
    featured: true,
    date: "2026-06-01",
    githubUrl: null,
    demoUrl: null,
    coverImage: null,
    longDescription: pt([
      "This is seed content. Open the Studio, edit the SIME project, and this page fills in from the CMS.",
    ]),
    architecture: null,
    challenges: null,
    lessons: null,
    futureWork: null,
    gallery: null,
    seo: null,
  },
  {
    _id: "seed-project-air-guitar",
    title: "STM32 Air Guitar",
    slug: "stm32-air-guitar",
    shortDescription:
      "Gesture-driven audio synthesis on an STM32, built around a fixed real-time budget.",
    technologies: ["C", "STM32", "DSP", "I2S"],
    tags: ["embedded", "audio"],
    status: "shipped",
    featured: true,
    date: "2026-03-01",
    githubUrl: null,
    demoUrl: null,
    coverImage: null,
    longDescription: pt([
      "Seed content. An accelerometer drives a synthesis path running on a Cortex-M, with the whole signal chain sized to fit inside the audio callback.",
      "Replace this text in the Studio.",
    ]),
    architecture: null,
    challenges: null,
    lessons: null,
    futureWork: null,
    gallery: null,
    seo: null,
  },
  {
    _id: "seed-project-parking",
    title: "Parking Algorithm",
    slug: "parking-algorithm",
    shortDescription:
      "A constrained allocation problem, solved as an optimization rather than a heuristic.",
    technologies: ["Python", "Optimization"],
    tags: ["algorithms", "mathematics"],
    status: "shipped",
    featured: true,
    date: "2025-11-01",
    githubUrl: null,
    demoUrl: null,
    coverImage: null,
    longDescription: pt([
      "Seed content. Assignment under capacity and proximity constraints, framed as an optimization problem and then made fast enough to run online.",
      "Replace this text in the Studio.",
    ]),
    architecture: null,
    challenges: null,
    lessons: null,
    futureWork: null,
    gallery: null,
    seo: null,
  },
];

export const fallbackPosts: Post[] = [
  {
    _id: "seed-post-hello",
    title: "Starting a writing habit",
    slug: "starting-a-writing-habit",
    summary:
      "A placeholder first post. Delete it once there's something real here. Everything on this page is editable in the Studio.",
    publishedAt: "2026-08-01T00:00:00.000Z",
    tags: ["meta"],
    featured: false,
    coverImage: null,
    body: pt([
      "This post exists so the writing section has something to render before the CMS is connected. Once you publish a real post in the Studio, this one disappears.",
      "## What this section supports",
      "Code blocks with syntax highlighting, LaTeX, tables, footnotes, images, and an automatic table of contents. Reading time is computed from the body, so there's nothing to maintain by hand.",
      "Drafts stay private until you set visibility to Published, and a future publish date schedules the post rather than hiding it manually.",
    ]),
    seo: null,
  },
];
