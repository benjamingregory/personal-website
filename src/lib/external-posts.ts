export type ExternalPost = {
  url: string;
  title: string;
  description: string;
  date: string;
  source: string;
  tags?: string[];
  readingMinutes?: number;
};

export const externalPosts: ExternalPost[] = [
  {
    url: "https://www.kasava.dev/blog/breath-of-the-wildification-of-saas",
    title:
      "How I Learned to Stop Worrying and Love Open-World Software (Or, The Breath of the Wildification of SaaS)",
    description:
      "Our first version was, as one user put it, 'insanely complex.' AI let us build everything, so we tried to show everything.",
    date: "2026-04-05",
    source: "Kasava blog",
    tags: ["product", "ai"],
    readingMinutes: 8,
  },
  {
    url: "https://www.kasava.dev/blog/your-ai-prototype-is-only-as-good-as-your-prompt",
    title: "Your Prototype Is Only as Good as Your Prompt",
    description:
      "AI prototyping tools are everywhere. Lovable hit $400M ARR. v0 has 2 million users. But most prototypes still fall short of what they could be.",
    date: "2026-04-03",
    source: "Kasava blog",
    tags: ["product", "ai"],
    readingMinutes: 5,
  },
  {
    url: "https://www.kasava.dev/blog/why-pms-are-built-for-ai",
    title:
      "Non-Determinism Isn't a Bug. It's Tuesday: Why Product Managers Were Built for AI",
    description:
      "Engineers get all the AI headlines, but product managers have been training for this moment their entire careers.",
    date: "2026-04-01",
    source: "Kasava blog",
    tags: ["product", "ai"],
    readingMinutes: 10,
  },
  {
    url: "https://www.kasava.dev/blog/ai-as-exoskeleton",
    title: "Stop Thinking of AI as a Coworker. It's an Exoskeleton.",
    description:
      "Companies that treat AI as an autonomous agent are disappointed. Those that treat it as an exoskeleton are winning.",
    date: "2026-02-19",
    source: "Kasava blog",
    tags: ["engineering", "ai"],
    readingMinutes: 9,
  },
  {
    url: "https://www.kasava.dev/blog/transparent-pricing-ai-credits",
    title: "Transparent Pricing: How We Calculate AI Credits",
    description:
      "We believe in transparent pricing. Here's exactly how we calculate credits, convert tokens, and price our AI features.",
    date: "2026-01-24",
    source: "Kasava blog",
    tags: ["product"],
    readingMinutes: 4,
  },
  {
    url: "https://www.kasava.dev/blog/everything-as-code-monorepo",
    title: "Everything as Code: How We Manage Our Company In One Monorepo",
    description:
      "Frontend, backend, marketing website, documentation, blog content, investor site, Chrome extension — all in one repo.",
    date: "2025-12-29",
    source: "Kasava blog",
    tags: ["engineering"],
    readingMinutes: 11,
  },
  {
    url: "https://www.kasava.dev/blog/self-enforcing-design-system-claude-code",
    title: "How We Built a Self-Enforcing Design System with Claude Code",
    description:
      "Building fast with AI risks inconsistent UX. Here's how we created a design system that Claude Code keeps us honest against.",
    date: "2025-12-09",
    source: "Kasava blog",
    tags: ["engineering", "ai"],
    readingMinutes: 9,
  },
  {
    url: "https://www.kasava.dev/blog/mcp-for-docs",
    title: "MCP for Documentation: The Use Case Nobody's Talking About",
    description:
      "Everyone's excited about MCP for tool use. But the killer use case might be something simpler: keeping docs current.",
    date: "2025-12-04",
    source: "Kasava blog",
    tags: ["engineering", "ai"],
    readingMinutes: 7,
  },
  {
    url: "https://www.kasava.dev/blog/4-claude-code-tools-we-cant-live-without",
    title: "4 Claude Code Tools We Can't Live Without",
    description:
      "Claude Code is powerful out of the box, but these tools make it unstoppable. Here are the four we use every day.",
    date: "2025-12-02",
    source: "Kasava blog",
    tags: ["engineering", "ai"],
    readingMinutes: 8,
  },
  {
    url: "https://www.kasava.dev/blog/complete-claude-code-best-practices-guide-part-1",
    title: "Complete Claude Code Best Practices Guide (Part 1)",
    description:
      "The foundational guide to getting the most out of Claude Code in your development workflow.",
    date: "2025-09-08",
    source: "Kasava blog",
    tags: ["engineering", "ai"],
    readingMinutes: 4,
  },
  {
    url: "https://www.kasava.dev/blog/complete-claude-code-best-practices-part-2",
    title:
      "Complete Claude Code Best Practices Guide (Part 2): Custom Commands",
    description:
      "Your AI shortcuts to productivity — learn how to create powerful custom commands.",
    date: "2025-09-08",
    source: "Kasava blog",
    tags: ["engineering", "ai"],
    readingMinutes: 4,
  },
  {
    url: "https://www.kasava.dev/blog/complete-claude-code-best-practices-part-3",
    title:
      "Complete Claude Code Best Practices Guide (Part 3): Specialized Agents",
    description:
      "Deep dive into building specialized agents with Claude Code for complex development workflows.",
    date: "2025-09-08",
    source: "Kasava blog",
    tags: ["engineering", "ai"],
    readingMinutes: 2,
  },
  {
    url: "https://www.kasava.dev/blog/how-we-fit-an-ai-platform-in-128mb",
    title:
      "The Complete Edge Architecture Guide (Part 2): How We Fit an AI Platform in 128MB",
    description:
      "The engineering challenges and solutions behind our memory-efficient AI platform.",
    date: "2025-09-05",
    source: "Kasava blog",
    tags: ["engineering"],
    readingMinutes: 6,
  },
  {
    url: "https://www.kasava.dev/blog/the-complete-edge-architecture-guide-part-3",
    title:
      "The Complete Edge Architecture Guide (Part 3): How We Built an AI Pipeline on the Edge",
    description:
      "Technical deep dive into our edge-first AI pipeline architecture.",
    date: "2025-09-05",
    source: "Kasava blog",
    tags: ["engineering", "ai"],
    readingMinutes: 12,
  },
  {
    url: "https://www.kasava.dev/blog/our-ai-orchestration-journey",
    title:
      "The Complete Edge Architecture Guide (Part 4): Our AI Orchestration Journey",
    description:
      "How we built a sophisticated AI orchestration system on the edge.",
    date: "2025-09-05",
    source: "Kasava blog",
    tags: ["engineering", "ai"],
    readingMinutes: 5,
  },
  {
    url: "https://www.kasava.dev/blog/why-we-went-all-in-on-cloudflare",
    title:
      "The Complete Edge Architecture Guide (Part 1): Why We Went All-In on Cloudflare",
    description:
      "Our decision to build on Cloudflare Workers and the benefits we've seen.",
    date: "2025-09-05",
    source: "Kasava blog",
    tags: ["engineering"],
    readingMinutes: 7,
  },
];
