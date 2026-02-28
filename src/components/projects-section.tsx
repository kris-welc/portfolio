"use client";

import { SectionLabel } from "@/components/section-label";
import { ProjectCard } from "@/components/project-card";
import { PROJECTS } from "@/lib/data";
import { useReveal } from "@/hooks/use-reveal";

export function ProjectsSection() {
  const ref = useReveal();

  return (
    <section id="projects" className="relative px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div ref={ref} className="reveal mb-16">
          <SectionLabel code="SEC_01" label="FEATURED PROJECTS" />
          <h2 className="gradient-bone font-display text-3xl font-bold tracking-wide md:text-4xl">
            Deployed Systems
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {PROJECTS.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
