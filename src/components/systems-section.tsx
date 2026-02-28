"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionLabel } from "@/components/section-label";
import {
  MonitorIcon,
  BoltIcon,
  BellIcon,
  PhoneIcon,
  FlaskIcon,
  StarIcon,
} from "@/components/icons";
import { SYSTEM_LAYERS, SIDE_PROJECTS } from "@/lib/data";
import { useRevealAll } from "@/hooks/use-reveal";

const ICON_MAP = {
  monitor: MonitorIcon,
  bolt: BoltIcon,
  bell: BellIcon,
} as const;

const ACCENT_BORDER = {
  amber: "border-waste-amber/20",
  toxic: "border-waste-toxic/20",
  rust: "border-waste-rust/20",
} as const;

const ACCENT_TEXT = {
  amber: "text-waste-amber",
  toxic: "text-waste-toxic",
  rust: "text-waste-rust-light",
} as const;

const SIDE_ICON = {
  amber: PhoneIcon,
  toxic: FlaskIcon,
} as const;

export function SystemsSection() {
  const containerRef = useRevealAll();

  return (
    <section id="systems" className="rad-stripe relative px-6 py-24" ref={containerRef}>
      <div className="mx-auto max-w-6xl">
        <div className="reveal mb-16">
          <SectionLabel code="SEC_03" label="ARCHITECTURE" />
          <h2 className="gradient-bone font-display text-3xl font-bold tracking-wide md:text-4xl">
            Live Systems
          </h2>
        </div>

        <Card className="reveal panel-hover mb-8 border-waste-border bg-waste-panel">
          <CardContent className="p-8 md:p-12">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {SYSTEM_LAYERS.map((layer) => {
                const Icon = ICON_MAP[layer.icon];
                return (
                  <div key={layer.name} className="text-center">
                    <div
                      className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg border bg-waste-panel ${ACCENT_BORDER[layer.accent]}`}
                    >
                      <Icon className={ACCENT_TEXT[layer.accent]} />
                    </div>
                    <h3 className="mb-2 font-display font-semibold tracking-wide text-waste-bone">
                      {layer.name}
                    </h3>
                    <p className="text-sm text-waste-sand">{layer.description}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {SIDE_PROJECTS.map((project) => {
            const Icon = SIDE_ICON[project.accent];
            return (
              <Card
                key={project.name}
                className="reveal panel-hover group border-waste-border bg-waste-panel transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg border bg-waste-panel ${ACCENT_BORDER[project.accent]}`}
                    >
                      <Icon className={ACCENT_TEXT[project.accent]} />
                    </div>
                    <div>
                      <CardTitle
                        className={`font-display tracking-wide text-waste-bone transition-colors group-hover:${ACCENT_TEXT[project.accent]}`}
                      >
                        {project.name}
                      </CardTitle>
                      <span className="font-mono text-xs text-waste-dim">
                        {project.stack}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between gap-4">
                    <p className="text-sm text-waste-sand">{project.description}</p>
                    {project.repoUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="shrink-0 gap-1.5 border-waste-border bg-transparent font-mono text-xs tracking-wider text-waste-dim transition-all hover:border-waste-amber/40 hover:text-waste-amber"
                      >
                        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
                          <StarIcon className="h-3.5 w-3.5" />
                          STAR
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
