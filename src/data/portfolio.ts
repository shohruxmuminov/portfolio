/**
 * Single source of truth for portfolio content.
 * Based on SHOHRUX_PORTFOLIO_PROFILE.md — keep statuses and claims honest.
 */

export type ProjectStatus = "In development" | "Prototype" | "Concept" | "Live";

export type Project = {
  id: string;
  index: string;
  name: string;
  status: ProjectStatus;
  /** Secondary descriptor shown next to the status, e.g. "Product exploration". */
  stage?: string;
  tags: string[];
  summary: string;
  explores: string[];
  /** Which particle sculpture represents this project (see src/lib/shapes.ts). */
  shape: number;
  /** Caption for the 3D particle study shown beside the project. */
  study: string;
  /** Only verified URLs. Leave undefined to render no link. */
  links?: { repo?: string; demo?: string };
};

export const portfolio = {
  name: "Shohrux",
  role: "Developer · AI Product Builder · Creative Technologist",
  location: "Uzbekistan",

  /** Set to null to render the hero without a portrait. */
  portrait: {
    src: "/images/shohrux-portrait.webp",
    alt: "Portrait of Shohrux",
    width: 640,
    height: 800,
  } as { src: string; alt: string; width: number; height: number } | null,

  hero: {
    eyebrow: "Developer · AI Product Builder · Creative Technologist",
    headlineLead: "I build",
    headlineAccent: "thoughtful",
    headlineTail: "digital experiences.",
    supporting:
      "From web products and AI-powered tools to desktop experiments and interactive 3D — I enjoy turning ambitious ideas into useful experiences.",
    primaryCta: { label: "Explore selected work", href: "#work" },
    secondaryCta: { label: "More about me", href: "#about" },
    meta: ["Uzbekistan", "Developer", "AI Product Builder"],
  },

  about: {
    eyebrow: "About",
    heading: "A little about me",
    paragraphs: [
      "I’m Shohrux — a developer and independent product builder from Uzbekistan. I’m interested in the space where software engineering, artificial intelligence, and visual experience meet.",
      "I enjoy building more than static interfaces. I like thinking through the full product: what problem it solves, how the user moves through it, how the underlying systems connect, and how the details come together. That curiosity has led me to explore AI-assisted learning platforms, personal AI assistants, Electron-based desktop environments, and interactive 3D web experiences.",
      "Some of these projects are prototypes or ongoing explorations, and I prefer to present them honestly. For me, progress means turning a clear idea into something people can actually try, learn from, and improve.",
    ],
    facts: [
      { label: "Based in", value: "Uzbekistan" },
      { label: "Working across", value: "Web · AI · Desktop · 3D" },
      { label: "Currently", value: "Building and refining prototypes" },
    ],
  },

  focus: {
    eyebrow: "Focus",
    heading: "What I’m exploring",
    intro: "Current interests and working areas — the places where most of my building and experimenting happens.",
    areas: [
      {
        key: "web",
        title: "Web Products",
        body: "Building clear, responsive interfaces and product flows — from first layout to a version people can actually use.",
      },
      {
        key: "ai",
        title: "AI Experiences",
        body: "Exploring assistants, model integrations and AI-supported workflows that solve a real problem rather than decorate one.",
      },
      {
        key: "desktop",
        title: "Desktop Software",
        body: "Experimenting with desktop interfaces and Electron-based applications, including OS-inspired shells and workspaces.",
      },
      {
        key: "3d",
        title: "Interactive 3D",
        body: "Exploring spatial interfaces, Three.js and motion-led storytelling that adds depth without getting in the way.",
      },
    ],
  },

  toolkit: {
    eyebrow: "Toolkit",
    heading: "Tools & technologies explored",
    note: "Tools that show up in my projects and workflows — listed as what I’ve explored, not a ranking of expertise.",
    groups: [
      { title: "Build & prototype", items: ["Antigravity", "Claude Code", "Codex", "Lovable", "Base44"] },
      { title: "Application & infrastructure", items: ["Python", "Electron", "Supabase", "Vercel", "GitHub"] },
      { title: "AI & integrations", items: ["OpenRouter", "MCP", "Google AI Studio"] },
      { title: "Interactive web", items: ["Three.js", "3D interaction", "Scroll-driven motion", "Responsive design"] },
    ],
  },

  process: {
    eyebrow: "Approach",
    heading: "From first idea to working product",
    steps: [
      { n: "01", title: "Understand", body: "Define the user, the problem and the intended result." },
      { n: "02", title: "Explore", body: "Evaluate approaches and shape the experience." },
      { n: "03", title: "Build", body: "Create a focused, testable version." },
      { n: "04", title: "Refine", body: "Improve usability, reliability, performance and detail." },
    ],
  },

  contact: {
    eyebrow: "Contact",
    heading: "Have an idea worth building?",
    body: "I’m interested in thoughtful products, useful tools, and interesting technical challenges.",
    /** Shown when no contact destination is configured in src/config/site.ts. */
    placeholder: "Direct contact links will be added here soon.",
  },

  marquee: [
    "Web Products",
    "AI Experiences",
    "Desktop Software",
    "Interactive 3D",
    "Product UX",
    "Rapid Prototyping",
    "Learning Technology",
  ],

  footerBio: "Building useful things at the intersection of web, AI, and interaction.",

  work: {
    eyebrow: "Selected work",
    heading: "Ideas, made tangible.",
    intro:
      "A mix of products in development, working prototypes and early concepts. Each one is labelled with where it honestly stands today.",
  },

  projects: [
    {
      id: "ielts-cdi",
      index: "01",
      name: "IELTS CDI Exam Preparation Platform",
      status: "In development",
      stage: "Product exploration",
      tags: ["EdTech", "Web application", "AI-assisted evaluation"],
      summary:
        "A focused exploration of what a practical computer-delivered exam-preparation platform could look like — combining test-taking workflows, content management, and AI-assisted feedback.",
      explores: [
        "Listening, Reading and Writing test flows",
        "Timers, answer sheets and result review",
        "Admin and material-creator workflows",
        "AI-assisted Writing feedback concepts",
      ],
      shape: 1,
      study: "Exam sheets & answer bubbles",
      links: { repo: "https://github.com/shohruxmuminov/ielts-with-antigravity" },
    },
    {
      id: "shohrux-ai",
      index: "02",
      name: "S.H.O.H.R.U.X AI",
      status: "In development",
      stage: "Prototype",
      tags: ["AI", "Desktop software", "Personal assistant"],
      summary:
        "An ongoing experiment in building a personal AI workspace — bringing conversation, files, models, and task-oriented interactions into one desktop experience.",
      explores: [
        "Python logic with an Electron-style interface",
        "Configurable model providers",
        "Voice-oriented, assistant-style interaction",
        "File context and a “second brain” concept",
      ],
      shape: 2,
      study: "Neural network sphere",
    },
    {
      id: "orbit-os",
      index: "03",
      name: "Orbit OS",
      status: "Prototype",
      stage: "Exploration",
      tags: ["Desktop experience", "Electron", "Systems UI"],
      summary:
        "An exploration of desktop experience design: testing how an OS-like interface can be prototyped, structured, and extended beyond a conventional web app.",
      explores: [
        "Desktop shell and OS-inspired navigation",
        "Window and application-style interactions",
        "System dashboard concepts",
      ],
      shape: 3,
      study: "Planet, orbits & floating windows",
    },
    {
      id: "street-walker",
      index: "04",
      name: "3D Street View Walker",
      status: "Concept",
      stage: "Experiment",
      tags: ["Creative development", "Three.js", "3D web"],
      summary:
        "A creative experiment in bringing geographic context into an interactive 3D browser experience — map data, buildings and a walk-through model of navigation.",
      explores: ["Map and building-data exploration", "Walk-through interaction model", "Spatial navigation and immersion"],
      shape: 4,
      study: "Wireframe city block",
    },
    {
      id: "mechanical-watch",
      index: "05",
      name: "Mechanical Watch Experience",
      status: "Concept",
      stage: "Experiment",
      tags: ["Interactive web", "3D", "Motion design"],
      summary:
        "A visual web experiment exploring how scroll-driven motion can turn a product page into an interactive mechanical story, revealing a watch layer by layer.",
      explores: ["Scroll-linked transitions", "Layer-by-layer component reveal", "Product storytelling through motion"],
      shape: 5,
      study: "Gear train & balance wheel",
    },
  ] satisfies Project[] as Project[],
};

export type Portfolio = typeof portfolio;
