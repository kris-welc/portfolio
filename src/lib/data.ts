export type ProjectStatus = "live" | "research" | "archive";

export interface Metric {
  readonly value: string;
  readonly label: string;
}

export interface Project {
  readonly id: string;
  readonly name: string;
  readonly status: ProjectStatus;
  readonly description: string;
  readonly metrics: readonly Metric[];
  readonly tags: readonly string[];
  readonly repoUrl?: string;
}

export interface ArticleTopic {
  readonly title: string;
  readonly summary: string;
}

export interface Article {
  readonly id: string;
  readonly slug?: string;
  readonly date?: string;
  readonly title: string;
  readonly hook: string;
  readonly tags: readonly string[];
  readonly accent: "amber" | "toxic" | "rust" | "bone";
  readonly readTime: string;
  readonly topicCount: number;
  readonly topics: readonly ArticleTopic[];
  readonly repoUrl?: string;
}

export interface SystemLayer {
  readonly name: string;
  readonly description: string;
  readonly icon: "monitor" | "bolt" | "bell";
  readonly accent: "amber" | "toxic" | "rust";
}

export interface SideProject {
  readonly name: string;
  readonly stack: string;
  readonly description: string;
  readonly accent: "amber" | "toxic";
  readonly repoUrl?: string;
}

export interface StackCategory {
  readonly label: string;
  readonly accent: "amber" | "toxic" | "rust" | "bone";
  readonly items: readonly string[];
}

export const PROJECTS: readonly Project[] = [
  {
    id: "SYS::ALPHA_AGENT",
    name: "Alpha Agent",
    status: "research",
    description:
      "Post-ASI scenario simulator using Bayesian weighting with market-anchored priors from Metaculus and Polymarket. Morris screening + Sobol sensitivity analysis across 20-parameter space.",
    metrics: [
      { value: "5", label: "Scenarios" },
      { value: "20", label: "Parameters" },
      { value: "688", label: "Predictions" },
    ],
    tags: ["Python", "Bayesian", "Monte Carlo", "Walk-Forward"],
  },
  {
    id: "SYS::SYBIL",
    name: "Sybil",
    status: "live",
    description:
      "Macro intelligence engine tracking 68 tickers with Hidden Markov Model regime detection. VAR forecasting with Bayesian self-improvement and seasonal decomposition.",
    metrics: [
      { value: "68", label: "Tickers" },
      { value: "HMM", label: "Regime Engine" },
      { value: "VAR", label: "Forecasting" },
    ],
    tags: ["Python", "HMM", "Geopolitical Risk", "LLM Scoring"],
  },
  {
    id: "SYS::V33_MONEYTREES",
    name: "V33 MoneyTrees",
    status: "live",
    description:
      "Algorithmic perpetual futures trader with adaptive regime detection, Bayesian Thompson Sampling signal weighting, ADWIN drift detection, and Renko-based entries.",
    metrics: [
      { value: "98.3%", label: "MC Confidence" },
      { value: "66%", label: "Win Rate" },
      { value: "2.02", label: "Profit Factor" },
    ],
    tags: ["Python", "Bybit", "Thompson Sampling", "VPIN/CVD"],
  },
  {
    id: "SYS::COPYBOT",
    name: "Copybot",
    status: "live",
    description:
      "Multi-feed prediction market trading system with two-path ensemble voting, NBA Elo modeling, Binance OBI signals, and automated position management with Kelly sizing.",
    metrics: [
      { value: "2-Path", label: "Ensemble" },
      { value: "4", label: "Signal Feeds" },
      { value: "Kelly", label: "Sizing" },
    ],
    tags: ["Python", "Polymarket", "Elo Model", "Ensemble"],
  },
] as const;

export const ARTICLES: readonly Article[] = [
  {
    id: "control-hierarchy",
    slug: "control-hierarchy",
    date: "2026-03-05",
    title: "Why the People Who Build Around AI Will Outperform the People Who Use It",
    hook: "Typing better prompts is not a skill with a future. The real leverage is in building the systems that contain, direct, and verify AI \u2014 pipelines, memory layers, tool orchestration, and evaluation loops. Ten engineering principles, a six-level hierarchy showing where you sit, and seven applications you can build today.",
    tags: ["AI Engineering", "System Design", "Leverage"],
    accent: "amber",
    readTime: "16 min",
    topicCount: 10,
    topics: [
      {
        title: "Models Are Components",
        summary: "AI generates options. Your code verifies, filters, and selects. Never let the model be the authority.",
      },
      {
        title: "Systems Beat Prompts",
        summary: "A structured pipeline (plan \u2192 execute \u2192 verify \u2192 repeat) outperforms any single prompt, no matter how clever.",
      },
      {
        title: "Build External Memory",
        summary: "Without persistent state, your AI resets every session. Four memory layers turn a chatbot into a system that learns.",
      },
      {
        title: "Tools Over Reasoning",
        summary: "Models degrade when forced to simulate computation. Let them orchestrate tools instead of replacing them.",
      },
      {
        title: "Control Loops",
        summary: "Single-shot outputs are fragile. Iterative loops with explicit stop conditions are robust.",
      },
      {
        title: "Where You Sit Matters",
        summary: "Six levels from consumer to goal designer. Real advantage starts at level 3 \u2014 everything below is consumption with better packaging.",
      },
      {
        title: "When Intelligence Is Cheap",
        summary: "Post-AGI, the bottlenecks shift to data, compute, and goals. The skills that matter today may not matter tomorrow.",
      },
      {
        title: "Agent Workforce",
        summary: "One operator controlling many autonomous agents. Research, code, analysis, marketing \u2014 the architecture is always the same.",
      },
      {
        title: "Market Structure",
        summary: "Four layers: model companies, infrastructure, domain operators, users. Individual leverage is highest at the domain layer.",
      },
      {
        title: "What to Own",
        summary: "Own your data, your processes, your infrastructure. Everything else is rented and can be taken away.",
      },
    ],
  },
  {
    id: "agent-algebra",
    slug: "agent-algebra",
    date: "2026-02-28",
    title: "How to Prove Your Multi-Agent System Actually Improves (Instead of Hoping)",
    hook: "You built a retry loop, a voting ensemble, a confidence router. But how do you know it converges instead of oscillating? How do you know your voting doesn't amplify the worst agent? You don't \u2014 because there's no theory behind it. Six mathematical theorems change that, each mapped to a composable Python primitive with a provable guarantee.",
    tags: ["Agent Composition", "Convergence Guarantees", "Open Source"],
    accent: "amber",
    readTime: "14 min",
    topicCount: 6,
    repoUrl: "https://github.com/kris-welc/agent-algebra",
    topics: [
      {
        title: "Will My Loop Converge?",
        summary: "Your retry loop runs 5 iterations \u2014 is iteration 5 better than 3, or just different? Contraction mapping guarantees convergence instead of oscillation.",
      },
      {
        title: "My Agents Are Mediocre Individually",
        summary: "Averaging mediocre agents keeps them mediocre. Boosting makes each one focus on what the others missed. Combined error drops exponentially.",
      },
      {
        title: "Which Agent Should I Trust?",
        summary: "Accuracy is the wrong metric \u2014 calibration is what matters. Proper scoring rules automatically give the most weight to the best-calibrated agent.",
      },
      {
        title: "How Much Should I Commit?",
        summary: "Textbook resource allocation assumes independence. Real systems have correlated failures. Path-dependent correction prevents ruin from bad streaks.",
      },
      {
        title: "My Sources Disagree",
        summary: "Simple averaging ignores relationships between sources. Belief propagation uses the structure of how sources relate to reach globally optimal consensus.",
      },
      {
        title: "Is This Signal or Noise?",
        summary: "If a pattern compresses, it's real. If it doesn't, it's noise. A universal filter that works without domain-specific rules.",
      },
    ],
  },
  {
    id: "dual-layer-regime",
    slug: "dual-layer-regime",
    date: "2026-02-28",
    title: "How to Detect When Your System's Rules Stop Working",
    hook: "Every automated system — recommendation engines, autoscalers, ML models, autonomous agents — runs on assumptions about current conditions. When conditions change, the old rules fail before you notice. Two independent detectors solve this: one classifies what mode you're in, the other catches the moment you're leaving it. Together they buy you 1-3 data points of early warning.",
    tags: ["Adaptive Systems", "Drift Detection", "Regime Classification"],
    accent: "toxic",
    readTime: "10 min",
    topicCount: 4,
    topics: [
      {
        title: "Structural Classification",
        summary: "How much of the total movement is productive? One ratio tells you if you're in signal or noise — and five graduated tiers let you respond proportionally.",
      },
      {
        title: "Transition Detection",
        summary: "Adaptive windowing that grows during stability and shrinks during change. Catches the moment conditions shift, before your classifier updates.",
      },
      {
        title: "Graduated Response",
        summary: "Five confidence tiers from full trust to extreme caution. Key insight: pessimistic signals work in noisy conditions, optimistic ones don't.",
      },
      {
        title: "Multiplicative Composition",
        summary: "Two independent layers multiply together. Most conservative during transitions in noisy conditions — no manual rules needed.",
      },
    ],
  },
  {
    id: "vpin-conviction",
    slug: "vpin-conviction",
    date: "2026-02-28",
    title: "How to Use Expert Behavior to Adjust Your Confidence in Real Time",
    hook: "In any system where some participants know more than others — markets, content platforms, hiring pipelines, open source ecosystems — the actions of informed actors carry signal you can measure. This article shows how to detect when experts are acting, which direction they favor, and how to adjust your own confidence asymmetrically: cut more when they disagree, boost less when they agree.",
    tags: ["Decision Systems", "Informed Flow", "Real-Time Enrichment"],
    accent: "rust",
    readTime: "8 min",
    topicCount: 3,
    topics: [
      {
        title: "Measuring Informed Activity",
        summary: "A simple ratio — flow imbalance vs total flow — reveals when knowledgeable participants are acting and which direction they favor.",
      },
      {
        title: "Asymmetric Confidence Adjustment",
        summary: "When experts agree with you, boost confidence modestly (+0.15). When they disagree, cut harder (-0.20). Missing an opportunity costs less than overcommitting to a mistake.",
      },
      {
        title: "Decoupled Real-Time Architecture",
        summary: "Two independent processes, shared SQLite in WAL mode, timeout-based reads. The enrichment layer is always additive, never blocking.",
      },
    ],
  },
  {
    id: "high-value-ai-skills-2027",
    title: "7 Skills That Pay More Because of AI (Not Despite It)",
    hook: "Everyone's asking which jobs AI will replace. The better question: which skills become more valuable because AI exists? These seven didn't matter two years ago. The people learning them now are already setting their own rates.",
    tags: ["AI Strategy", "Career", "Automation"],
    accent: "amber",
    readTime: "8 min",
    topicCount: 7,
    topics: [
      {
        title: "AI System Architecture",
        summary:
          "Designing systems where AI, automation, and humans work together. A thinking skill, not a technical skill — understanding business operations, data flow, and how pieces connect.",
      },
      {
        title: "Context Engineering",
        summary:
          "Prompt engineering is commoditized. Setting up environments where AI has all the context before you ask is what separates a tool from a team member.",
      },
      {
        title: "AI Training Data Curation",
        summary:
          "Curating, structuring, and maintaining data that makes AI useful for a specific business. Closer to being a librarian for AI than a data scientist.",
      },
      {
        title: "AI-Human Workflow Design",
        summary:
          "Designing handoff workflows where AI does the first pass, human reviews, AI implements changes. Speed and quality, not one or the other.",
      },
      {
        title: "No-Code AI Workflows",
        summary:
          "Building complex AI-powered workflows visually with n8n, Make, and Zapier. Delivering measurable 20+ hour/week savings. Free to learn, most people don't know it's valuable.",
      },
      {
        title: "AI Output Quality Control",
        summary:
          "Evaluating AI output at scale — catching errors, identifying generic versus useful output, building systems for consistent quality. Bad AI output is expensive.",
      },
      {
        title: "Automation Maintenance",
        summary:
          "Building automation is one skill. Keeping it running is another. Auditing, optimizing, and fixing drift in automated systems. The mechanic role that doesn't exist at scale yet.",
      },
    ],
  },
  {
    id: "vibe-coding-2-rules",
    title: "18 Decisions That Separate Builders Who Ship From Builders Who Don't",
    hook: "You're not slow because you're a bad developer. You're slow because you made 18 decisions that felt right but buried you in work that didn't need to exist. Auth, state management, deployment, payments \u2014 every one has a fast path and a trap. Here's which is which.",
    tags: ["Development", "Shipping", "Tools"],
    accent: "toxic",
    readTime: "12 min",
    topicCount: 18,
    topics: [
      {
        title: "Use Ready-Made Auth",
        summary:
          "Clerk or Supabase Auth. Sessions, tokens, OAuth, security edge cases — handled. Stop spending 2 weeks on auth for an MVP nobody has validated yet.",
      },
      {
        title: "Tailwind + shadcn/ui for UI",
        summary:
          "Figma to working UI in 2-3 hours. Consistent sizing, no random colors, no eyeballing pixels at 1am. The highest ROI decision you'll make.",
      },
      {
        title: "Zustand + Server Components",
        summary:
          "No Redux. No 6-layer Context wrappers. No PhD in state architecture for a product with 12 users. Zustand for client state, Server Components for the rest.",
      },
      {
        title: "tRPC + Server Actions for APIs",
        summary:
          "End-to-end type safety without configuration overhead. Eliminates an entire layer of boilerplate that used to eat up days.",
      },
      {
        title: "Deploy with Vercel One-Click",
        summary:
          "One push to main, done. Your energy is worth more than your server config. Manual deployments are a productivity trap.",
      },
      {
        title: "Prisma + Managed Postgres",
        summary:
          "Typed ORM, easy migrations, easy reads. Supabase/Neon/Railway for managed hosting. Handles 95% of what any MVP needs without friction.",
      },
      {
        title: "Validate with Zod + RHF",
        summary:
          "Zod for schema validation, React Hook Form for state. Unvalidated inputs is how you get broken data and angry users at 2am.",
      },
      {
        title: "Stripe for Payments",
        summary:
          "Never build your own payment system. Payments, subscriptions, refunds, compliance — 45 minutes to integrate and it works.",
      },
      {
        title: "Error Tracking on Day 1",
        summary:
          "Sentry tells you what broke, where, and how often. Set it up before launch, not after a user tweets at you about a crash.",
      },
      {
        title: "Analytics From the Start",
        summary:
          "PostHog or Plausible. If you don't know how users move through your product, you're guessing. Guessing for 3 months is how you build the wrong thing.",
      },
      {
        title: "Secrets in Env Files",
        summary:
          "Hardcoding API keys is obvious in hindsight, catastrophic in the moment. Use .env, add to .gitignore, use Doppler or Vercel for production.",
      },
      {
        title: "UploadThing for Files",
        summary:
          "File uploads seem simple until you're managing storage, CDN, size limits, and security. Integrate in an afternoon, move on.",
      },
      {
        title: "Preview Deployments",
        summary:
          "Every PR gets a preview URL. Test changes before production. Saves you from emergency rollbacks at midnight.",
      },
      {
        title: "Radix + shadcn Components",
        summary:
          "Unstyled, accessible, production-grade primitives. Build almost any UI pattern without reinventing the wheel.",
      },
      {
        title: "README From Day 1",
        summary:
          "You won't remember how everything works in 3 weeks. 20 minutes to write, saves 4 hours of confusion. Makes client handoffs smooth.",
      },
      {
        title: "Clean Folder Structure",
        summary:
          "Messy structure compounds. Every feature added to a messy codebase costs 30% more time just navigating. Components, hooks, utils, types — keep it predictable.",
      },
      {
        title: "Onboarding + Empty States",
        summary:
          "Most underrated UX investment. Empty states tell users what to do. Onboarding shows how to get value on day one. Confused users don't convert — they leave.",
      },
      {
        title: "Lighthouse Before Launch",
        summary:
          "Slow apps lose users. Free performance audit in 30 seconds. Score below 70 is a red flag. Fix before launch, not after you've lost users.",
      },
    ],
  },
] as const;

export const SYSTEM_LAYERS: readonly SystemLayer[] = [
  {
    name: "Intelligence Layer",
    description:
      "Sybil + Alpha Agent provide macro signals, scenario analysis, and regime detection across 68 instruments",
    icon: "monitor",
    accent: "amber",
  },
  {
    name: "Execution Layer",
    description:
      "V33 and Copybot execute trades autonomously across crypto perps and prediction markets, 24/7",
    icon: "bolt",
    accent: "toxic",
  },
  {
    name: "Intel Layer",
    description:
      "Multi-channel AI-curated news digests with Gemini scoring, RSS feeds, and custom delivery schedules",
    icon: "bell",
    accent: "rust",
  },
] as const;

export const SIDE_PROJECTS: readonly SideProject[] = [
  {
    name: "Aeryn",
    stack: "SwiftUI + Firebase",
    description:
      "iOS ally/achiever system with smart notification scheduling, habit tracking, and adaptive behavior via Cloud Functions.",
    accent: "amber",
  },
  {
    name: "Intel Digest",
    stack: "Python + Gemini",
    description:
      "AI-powered news curation across 4 channels — tech, wellness, jobs, and personal. LLM-scored with customizable delivery.",
    accent: "toxic",
  },
] as const;

export const STACK: readonly StackCategory[] = [
  {
    label: "CORE",
    accent: "amber",
    items: ["Python", "Swift / SwiftUI", "TypeScript"],
  },
  {
    label: "AI / ML",
    accent: "toxic",
    items: ["Claude / Gemini", "HMM / VAR", "Bayesian Methods"],
  },
  {
    label: "INFRA",
    accent: "rust",
    items: ["GCP Compute", "Firebase", "Secret Manager"],
  },
  {
    label: "DATA",
    accent: "bone",
    items: ["SQLite / Firestore", "WebSocket Feeds", "FRED / yfinance"],
  },
] as const;

export const SOCIAL_LINKS = [
  { name: "GITHUB", href: "https://github.com/kris-welc", type: "github" },
  {
    name: "LINKEDIN",
    href: "https://linkedin.com/in/kris-welc",
    type: "linkedin",
  },
] as const;
