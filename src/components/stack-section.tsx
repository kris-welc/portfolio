"use client";

import { Card, CardContent } from "@/components/ui/card";
import { SectionLabel } from "@/components/section-label";
import { STACK } from "@/lib/data";
import { useReveal } from "@/hooks/use-reveal";

const ACCENT_TEXT = {
  amber: "text-waste-amber",
  toxic: "text-waste-toxic",
  rust: "text-waste-rust-light",
  bone: "text-waste-bone",
} as const;

const HOVER_BORDER = {
  amber: "hover:border-waste-amber/40",
  toxic: "hover:border-waste-toxic/40",
  rust: "hover:border-waste-rust-light/40",
  bone: "hover:border-waste-bone/30",
} as const;

export function StackSection() {
  const headerRef = useReveal();
  const gridRef = useReveal();

  return (
    <section id="stack" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div ref={headerRef} className="reveal mb-16">
          <SectionLabel code="SEC_04" label="ARMORY" />
          <h2 className="gradient-bone font-display text-3xl font-bold tracking-wide md:text-4xl">
            Stack
          </h2>
        </div>

        <div ref={gridRef} className="reveal grid grid-cols-2 gap-4 md:grid-cols-4">
          {STACK.map((category) => (
            <Card
              key={category.label}
              className={`border-waste-border bg-waste-panel transition-all duration-300 ${HOVER_BORDER[category.accent]}`}
            >
              <CardContent className="p-5 text-center">
                <div
                  className={`mb-3 font-mono text-xs tracking-widest ${ACCENT_TEXT[category.accent]}`}
                >
                  {category.label}
                </div>
                <div className="space-y-1.5 text-sm text-waste-sand">
                  {category.items.map((item) => (
                    <div key={item}>{item}</div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
