export type EventCategory =
  | "Orientation"
  | "Workshop"
  | "Competition"
  | "Hackathon"
  | "Talk"
  | "Social";
export type EventBackground =
  | "genesis"
  | "gitgud"
  | "fossforge"
  | "trae"
  | "default";

export interface ClubEvent {
  id: number;
  number: string;
  title: string;
  subtitle: string;
  displayDate: string;
  category: EventCategory;
  accent: string;
  dotColor: string;
  labelColor: string;
  description: string;
  tags: string[];
  bg: EventBackground;
  registrationUrl: string | null;
  detail: string;
}

export interface ChintanLink {
  label: string;
  url: string;
}

export interface ChintanEvent {
  episode: string;
  title: string;
  speaker: string;
  speakerBio: string;
  topic: string;
  date: string;
  links?: ChintanLink[];
  flyer: string;
}

export const events: ClubEvent[] = [
  {
    id: 0,
    number: "00",
    title: "Genesis",
    subtitle: "Orientation & Founding",
    displayDate: "9 Aug 2024",
    category: "Orientation",
    accent: "from-emerald-500/20 to-green-500/5",
    dotColor: "bg-emerald-400 border-emerald-400/60 shadow-emerald-400/40",
    labelColor: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    description:
      "Where it all started. The founding orientation of UFC — introducing the club, its vision, and the community we set out to build.",
    tags: ["Founding", "Orientation", "Community"],
    bg: "genesis",
    registrationUrl: null,
    detail:
      "The first gathering of UFC — a room full of curious builders, a whiteboard full of ideas, and the beginning of something real. Genesis set the tone: this club is for people who want to build, not just learn about building.",
  },
  {
    id: 1,
    number: "01",
    title: "Git Gud",
    subtitle: "Introduction to Open Source",
    displayDate: "10 Sept 2024",
    category: "Workshop",
    accent: "from-green-500/20 to-green-500/5",
    dotColor: "bg-green-400 border-green-400/60 shadow-green-400/40",
    labelColor: "text-green-300 border-green-500/30 bg-green-500/10",
    description:
      "Hands-on workshop covering Git, GitHub, and open source contribution. Live demos, first PRs, and a deep dive into collaborative development culture.",
    tags: ["Git", "GitHub", "Open Source", "Version Control"],
    bg: "gitgud",
    registrationUrl:
      "https://docs.google.com/forms/d/e/1FAIpQLSf01qxq5oOiLDGlk4RE2Z_5piLapMK_bbp8R7Ut71Elx_UfWQ/viewform",
    detail:
      "Git Gud walked attendees through version control from scratch — commits, branches, PRs, and the open source contribution workflow. By the end, most attendees had made their first real PR to a public repo.",
  },
  {
    id: 2,
    number: "02",
    title: "FOSS Forge 2025",
    subtitle: "Open Source Competition & Festival",
    displayDate: "15–16 Oct 2025",
    category: "Competition",
    accent: "from-cyan-500/20 to-cyan-500/5",
    dotColor: "bg-cyan-400 border-cyan-400/60 shadow-cyan-400/40",
    labelColor: "text-cyan-300 border-cyan-500/30 bg-cyan-500/10",
    description:
      "2-day flagship open-source festival during ELYSIAN 2025. Git Clash, Pokémon YAML Showdown, and Repo Sprint — live leaderboards, team battles, and real contributions.",
    tags: ["Open Source", "Competition", "Git", "Team Event"],
    bg: "fossforge",
    registrationUrl: "https://tinyurl.com/FOSS-FORGE-REGISTRATION",
    detail:
      "FOSS Forge ran across two full days during ELYSIAN 2025. Day 1 featured Git Clash (live PR battles on curated issues) and the Pokémon YAML Showdown (config-driven battle simulation projected live). Day 2 was the Repo Sprint — teams received base repos and had hours to ship features, polish UX, and merge clean PRs.",
  },
  {
    id: 3,
    number: "03",
    title: "Trae AI",
    subtitle: "MiniMax-Sponsored · AI Agentic Coding + Mini Hackathon",
    displayDate: "Apr 2025",
    category: "Hackathon",
    accent: "from-purple-500/20 to-purple-500/5",
    dotColor: "bg-purple-400 border-purple-400/60 shadow-purple-400/40",
    labelColor: "text-purple-300 border-purple-500/30 bg-purple-500/10",
    description:
      "Sponsored by MiniMax — an agentic AI coding session paired with a mini hackathon. Builders explored AI-assisted development workflows and shipped projects in a single session.",
    tags: ["AI", "Agentic Coding", "Hackathon", "MiniMax", "Trae"],
    bg: "trae",
    registrationUrl: null,
    detail:
      "Trae AI brought in MiniMax as a sponsor for a session on agentic coding — using AI not just as a copilot but as an autonomous agent in your dev workflow. The session ended with a mini hackathon where teams built and demoed AI-assisted projects in a few hours.",
  },
];

export const chintans: ChintanEvent[] = [
  {
    episode: "01",
    title: "Threat Modeling & Precogly",
    speaker: "Vikramaditya Narayan",
    speakerBio:
      "Creator of Precogly — an open-source, enterprise-grade threat modeling platform built for compliance-aware security teams. Previously designed the prototype for a YC-funded AI governance platform. Leads the Bangalore chapter of Threat Modeling Connect, has spoken at ThreatModCon DC on emergent risks in multi-agentic systems. Holds an MS from Carnegie Mellon and is a Certified Threat Modeling Professional.",
    topic:
      "An intro to open threat modeling, followed by a deep dive into Precogly — what it is, why it was built, how it works, and how to contribute. Beginner-friendly with room to go deep.",
    date: "29 Apr 2025 · 6 PM",
    links: [
      {
        label: "Precogly on GitHub",
        url: "https://github.com/precogly/precogly",
      },
    ],
    flyer: "/event-images/OCC1.png",
  },
  {
    episode: "02",
    title: "Open Source, GSoC & Remote Work from a Tier 3 College",
    speaker: "Jigyasu Rajput",
    speakerBio:
      "3rd year engineering student from a Tier 3 college in Ghaziabad. Works remotely at a Japanese AI company, did GSoC at Python Software Foundation, and is an open source mentor at Newton School. Also part of Super 30 by Harkirat Singh. Documenting the entire journey so others don't have to figure it out alone.",
    topic:
      "For every college student in India who wants a remote tech job, open source, GSoC, or just wants to escape the placement rat race — this one's for you.",
    date: "6 May 2025 · 6 PM",
    links: [
      { label: "Twitter / X", url: "https://x.com/rajputwt" },
      {
        label: "LinkedIn",
        url: "https://www.linkedin.com/in/jigyasu-rajput-218657284/",
      },
      { label: "GitHub", url: "https://github.com/JigyasuRajput" },
    ],
    flyer: "/event-images/OCC2.png",
  },
];
