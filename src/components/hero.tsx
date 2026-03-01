import { StatusIndicator } from "@/components/status-indicator";
import { WastelandBadge } from "@/components/wasteland-badge";

const DOMAINS = [
  { label: "Algorithmic Trading", variant: "amber" as const },
  { label: "Macro Intelligence", variant: "toxic" as const },
  { label: "Scenario Modeling", variant: "rust" as const },
  { label: "Autonomous Agents", variant: "bone" as const },
];

export function Hero() {
  return (
    <section className="hero-glow relative flex min-h-screen items-center justify-center px-6">
      <div className="mx-auto max-w-4xl text-center">
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-waste-dim">
            <StatusIndicator />
            SIGNAL ACTIVE — AUTONOMOUS SYSTEMS ONLINE
          </span>
        </div>

        <h1 className="flicker mb-10 font-display text-6xl font-bold tracking-tight md:text-8xl">
          <span className="gradient-hot">KRIS WELC</span>
        </h1>

        <div className="mb-14 flex flex-wrap items-center justify-center gap-3">
          {DOMAINS.map(({ label, variant }) => (
            <WastelandBadge key={label} variant={variant} className="px-3 py-1.5">
              {label}
            </WastelandBadge>
          ))}
        </div>

        <a
          href="#articles"
          className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-waste-amber transition-colors hover:text-waste-amber-light"
        >
          <span>Read dispatches</span>
          <svg
            className="h-4 w-4 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </a>
      </div>

      <div className="absolute bottom-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-waste-border to-transparent" />
    </section>
  );
}
