"use client";

import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/section-label";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { SOCIAL_LINKS } from "@/lib/data";
import { useReveal } from "@/hooks/use-reveal";

const ICON_MAP = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
} as const;

const HOVER_BORDER = {
  github: "hover:border-waste-amber/40",
  linkedin: "hover:border-waste-toxic/40",
} as const;

export function ContactSection() {
  const headerRef = useReveal();
  const linksRef = useReveal();

  return (
    <section id="contact" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl text-center">
        <div ref={headerRef} className="reveal mb-12">
          <SectionLabel code="SEC_05" label="COMMS" />
          <h2 className="gradient-bone mb-4 font-display text-3xl font-bold tracking-wide md:text-4xl">
            Establish Contact
          </h2>
          <p className="mx-auto max-w-lg text-waste-sand">
            Open to collaboration on AI systems, algorithmic trading, and
            autonomous agent research.
          </p>
        </div>

        <div ref={linksRef} className="reveal flex items-center justify-center gap-6">
          {SOCIAL_LINKS.map((link) => {
            const Icon = ICON_MAP[link.type];
            return (
              <Button
                key={link.type}
                variant="outline"
                asChild
                className={`gap-3 border-waste-border bg-waste-panel px-6 py-3 transition-all duration-300 ${HOVER_BORDER[link.type]}`}
              >
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="text-waste-bone" />
                  <span className="font-mono text-sm tracking-wider text-waste-sand">
                    {link.name}
                  </span>
                </a>
              </Button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
