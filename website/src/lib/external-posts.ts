export type ExternalPost = {
  url: string;
  title: string;
  description: string;
  /**
   * A few-sentence summary of what the post actually argues — substance, key
   * examples, and conclusion. Richer than `description` (which is the one-line
   * teaser used on the site). Used to give the chat persona real material to
   * discuss without fetching the full text. Full bodies live on kasava.dev; the
   * `fetchExternalPost` tool can pull them on demand.
   */
  abstract: string;
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
    abstract:
      "After a user called Kasava 'insanely complex,' I argue SaaS should be designed like Breath of the Wild's 'chemistry engine' rather than linear dungeons. AI lets you build features fast, so the bottleneck is now judgment, not implementation — and I had terrible judgment, surfacing every feature on its own page. The fix was to stop designing prescribed user flows and start designing composable capabilities (search, analyze, generate, compare, track) that surface contextually wherever the user is working. Draws on Nintendo's shift from 'additive' to 'multiplicative' design and Clayton Christensen's Jobs to Be Done. Core principle: 'Build a chemistry engine, not a dungeon' — design capabilities not pages, let users compose, surface contextually, and have the courage to hide features.",
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
    abstract:
      "Launch post for Kasava's free Prompt Generator, which turns your design system and codebase into 100-300 line prompts for AI prototyping tools (v0, Lovable, Cursor, Claude Code). Most people write 'build me a dashboard' and get generic output; the gap to a good result is ~100+ lines of design context, so the tool extracts design tokens, component patterns, product context, and brand guidelines automatically. Cites the Stack Overflow 2025 survey (trust in AI output fell to 29%, 66% of devs spend more time fixing AI code), METR's RCT (experienced devs were 19% slower with AI but believed they were 20% faster), and the spec-driven-development movement (Addy Osmani, GitHub, Simon Willison). Thesis: better prompts beat better models.",
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
    abstract:
      "Argues product managers, not engineers, are the role best positioned for AI, because of three skills PMs have trained for years: mode-switching (shifting between constraint, narrative, empathy, and analysis thinking), comfort with non-deterministic outputs (PMs already write specs expecting iteration), and goal-oriented rather than precision-oriented thinking. Engineering culture values binary correctness, which is why 21% of engineers in Lenny Rachitsky's survey say AI worsens their work quality — the highest of any role — while PMs and founders report the highest satisfaction. Concludes the PM role evolves into the 'product engineer' who both decides what to build and builds it, but warns against 'falling asleep at the wheel' (citing the Harvard/BCG jagged-frontier study) and treating AI as a magic box rather than a fast collaborator that needs direction and review.",
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
    abstract:
      "Argues the right mental model for AI isn't an autonomous coworker but an exoskeleton that amplifies human capability. Backs it with real exoskeleton data (Ford EksoVest cut injuries 83%, Sarcos Guardian XO gives 20:1 strength amplification, Stanford's ankle exo cut running energy cost 15%) — the device never replaces the human, it amplifies them. Autonomous agents disappoint because they lack the implicit context humans carry; Kasava's answer is the 'product graph,' which combines automatically-ingested codebase/commit/issue context with human-supplied judgment about what matters. Lays out a micro-agent framework: decompose jobs into discrete tasks (not whole roles), build micro-agents that do one thing well, keep the human in the decision loop, and make the seams visible. Conclusion: 'The future isn't autonomous. It's amplified.'",
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
    abstract:
      "A transparent breakdown of how Kasava prices AI credits: 300 credits = $1, set to keep roughly an 11% margin above what they pay Anthropic. Input tokens cost 1 credit per 1,000 and output tokens 5 credits per 1,000, mirroring Anthropic's 5x output pricing, and they use user-favorable floor() rounding so sub-1,000-token operations cost nothing. Covers plan allocations (Free 300/seat, Pro 1,500/seat), volume bonuses on credit refills, auto-refill with spend caps, per-feature token tracking, and quota-based repository indexing. Explains why credits over direct token billing (predictable, flexible, fair aggregation) and why a deliberately slim margin (trust, competing on value not extraction, alignment with usage).",
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
    abstract:
      "Explains why Kasava runs the entire company from one monorepo — frontend, backend, marketing site, docs, blog posts, investor deck, Chrome extension, Google Docs add-on, and cloud functions. The real payoff is AI context: because everything lives together, Claude can make atomic cross-boundary changes (one 'add Asana integration' commit touches backend, frontend, docs, and the marketing site) and fact-check claims against the actual source. Everything ships the same way — git push — including blog posts and the investor deck (a Next.js site, not PowerPoint), which reinforces a shipping culture. Covers single-source-of-truth config (one billing-plans.json drives backend enforcement, frontend display, and the pricing page), selective path-based CI/CD, the CLAUDE.md-per-directory convention, the deliberate choice to avoid npm workspaces, and how they handle repo-size, build-time, and permission challenges. 'The monorepo isn't a constraint. It's a force multiplier.'",
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
    abstract:
      "How Kasava built a ~300-line design principles document specific enough that Claude Code can actively enforce it during development — solving the problem that building fast with AI risks inconsistent UX. Ben, a self-described design non-expert, describes the two failure modes he's lived: no design system (death by a thousand paper cuts) and a sprawling bureaucratic one (paralysis over 'is this a dialog or a sheet per section 4.3.2'). Every principle has to pass one test: can Claude actually evaluate it? A dedicated Playwright-driven design-review agent interacts with the live UI and checks interaction/user-flow, responsiveness at three breakpoints, visual polish, WCAG 2.1 AA accessibility, and robustness, then reports issues as Blocker/High/Medium/Nitpick with screenshots — describing problems and their impact rather than prescribing fixes, so humans keep agency. Core philosophy: 'Focus over features — every screen should answer one question clearly.'",
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
    abstract:
      "Argues MCP's (Model Context Protocol) most valuable use case isn't tool execution but documentation — keeping AI assistants current with fast-moving dependencies. Case study: Mastra shipped ~35 changelogs in 11 months (nearly weekly), and no human can keep up; relying on AI training data gives confident-but-wrong answers. MCP documentation servers (e.g. @mastra/mcp-docs-server) and Context7 (which indexes 58,000+ libraries) feed AI assistants current docs in real time. The deeper insight: MCP docs don't just help users keep up, they let dependencies move faster by breaking the 'velocity ceiling,' creating a virtuous cycle of faster adoption → faster feedback → faster releases. Advice: prioritize MCP doc servers for key dependencies, and if you maintain an open-source project, publish one. Also mentions auto-updating docs tooling like Mintlify Autopilot.",
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
    abstract:
      "The four MCP tools/plugins essential to Kasava's Claude Code workflow, framed around what stock Claude Code can't do (browse the web, drive a browser, remember yesterday). mgrep: semantic, multi-line code search that beat plain grep in MixedBread's benchmark (53% cheaper, 48% faster, 76% win rate) — but it requires their hosted indexing service, a security trade-off. Firecrawl: web search and scraping so Claude isn't limited by its training cutoff (docs lookup, competitor research, debugging). Beads: a git-native issue tracker (JSONL in the repo) that gives agents memory across sessions, solving the 'agents have amnesia' problem. Playwright MCP: browser control via the accessibility tree (not screenshots) for testing, screenshots, and design review. The compound effect: Claude can search, research, plan, implement, test, and track its own work end to end.",
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
    abstract:
      "Part 1 of a 3-part series, on structuring and maintaining CLAUDE.md files. Recommends a three-tier system: a root CLAUDE.md as the 'north star' kept under 300 lines, service-level files where the real domain context lives (with actual file paths and line numbers), and explicit anti-patterns to avoid (the Kitchen Sink, the Never-Updated Manifesto, the Novel). Introduces CLAUDE_FILES_INDEX.md — a master index so Claude can discover documentation it would otherwise miss — plus specialized indices (feature index, error-resolution index), and a /update command that auto-maintains freshness and timestamps. Treat CLAUDE.md files as living documents updated alongside PRs; they exist for Claude, not humans. Kasava went from 0 to 87 CLAUDE.md files.",
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
    abstract:
      "Part 2 of the series, on custom slash commands — each markdown file in .claude/commands/ becomes a command. Walks through Kasava's most-used commands: /blog (writes posts in your voice using real codebase examples), /issues (GitHub issue management), /think (structured problem-solving that restates, decomposes, researches, and proposes multiple approaches), /style, /update (keeps docs fresh), /visualize (architecture diagrams in Mermaid/PlantUML/Graphviz), /work (autonomous issue → branch → code → PR), and /upgrade (delegates to specialized agents). Design principles: make commands specific, use $ARGUMENTS, and document them in your main CLAUDE.md. Commands turn Claude from a general assistant into a team-specific toolkit; start with the task you ask Claude to do most often.",
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
    abstract:
      "Part 3 of the series, on specialized agents — best thought of not as prompts but as personas with deep domain knowledge. Telling an agent 'you're an expert in X' doesn't make it smarter, but it does direct where it focuses attention and spends its context budget; a scoped subagent that researches and returns an answer to the main thread produces higher-quality results. Kasava's agents include a Cloudflare Backend Architect, Mastra Workflow Architect, Vector Search Architect, Browser Extension Developer, Next.js Frontend Expert, and Web Research Analyst. Pro tips: start with your biggest pain point, iterate from real conversations, have agents research current best practices, give them memory of past decisions, make them opinionated, and update them as the codebase evolves.",
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
    abstract:
      "Part 2 of the Edge Architecture series, on framework choice and memory optimization within Cloudflare Workers' 128MB limit. Express alone uses ~120MB and assumes a long-running Node.js server, so it (and Fastify/Koa) don't fit; Kasava chose Hono, which is <14KB, ~18MB memory, zero dependencies, web-standards-first, and TypeScript-native with typed Cloudflare bindings. The other half is a dynamic loading system: their Mastra AI framework is initialized per-request and only for routes that actually need it (chat, bug analysis, analytics enrichment), while auth/billing/CRUD routes skip it entirely. Lessons: constraints drive better architecture, framework choice matters exponentially more on the edge, dynamic loading also speeds cold starts and improves isolation, and building on web standards avoids runtime lock-in.",
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
    abstract:
      "Part 3 of the Edge Architecture series — building a sub-10ms AI pipeline entirely on Cloudflare Workers, despite a 30-second execution limit. Central thesis: in the future of AI applications, networking matters more than compute, because inference cost is dropping ~10x/year while the speed of light isn't — so latency is a feature. The stack: Mastra for orchestration, PostgreSQL + pgvector on Supabase for vectors, Voyage AI's voyage-code-3 embeddings (32K context, 300+ languages, understands what code does not just says), Claude for the LLM, and multi-tier KV/in-memory caching. Long indexing jobs are chunked across 100+ parallel workers coordinated by Durable Objects (no distributed locks). They had to move tree-sitter AST parsing off the edge to Google Cloud Functions because of WebAssembly/Node.js dependencies and 25MB bundle size — sometimes good edge architecture means knowing when not to use the edge. Covers edge economics and trade-offs (30s limit, vendor lock-in, debugging).",
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
    abstract:
      "Part 4 of the Edge Architecture series — the story of migrating AI workflow orchestration from LangGraph to Mastra. The LangGraph pain points: documentation that 'felt like archaeology,' TypeScript treated as a second-class citizen (code littered with @ts-ignore and `as any`), and graph abstraction that was overkill when ~90% of their workflows were sequential. Mastra — built by Gatsby alumni Sam Bhagwat, Abhi Aiyer, and Shane Thomas — is TypeScript-first (not TypeScript-eventually), uses sequential composition that matches how you actually think, and ships production observability/tracing/retries built in. Migrating dropped their error rate ~30% in the first month. Kasava runs four major Mastra workflows (GitHub, Chat, Document, ReverseQuery) and 40+ agents. Lesson: the best abstraction is the one that matches how you actually think about the problem, and the best tools are built by people who've felt your pain.",
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
    abstract:
      "Part 1 of the Edge Architecture series — why Kasava built on Cloudflare Workers instead of the traditional AWS Lambda/EC2/VPC route. V8 isolates (vs containers) give sub-5ms cold starts globally with ~5-10MB overhead, like secure apartments in one building instead of a house per function; you lose full Node.js but the nodejs_compat flag handles ~95% of cases. Bindings provide zero-latency, no-auth connections to other Cloudflare services: R2 (S3-style storage with zero egress fees), KV (config-free global cache), Queues (built-in async processing), Durable Objects (single-threaded globally-unique coordination — no distributed locks), and Vectorize. Running code where users are cut response times ~200ms. The economics: 60-80% cheaper than an equivalent AWS setup with no infrastructure to manage. Trade-offs: 128MB memory limit, 30-second CPU limit, a different mental model, and some still-experimental services.",
    date: "2025-09-05",
    source: "Kasava blog",
    tags: ["engineering"],
    readingMinutes: 7,
  },
];
