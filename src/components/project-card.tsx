"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { StatusIndicator } from "@/components/status-indicator";
import { WastelandBadge } from "@/components/wasteland-badge";
import { StarIcon } from "@/components/icons";
import type { Project } from "@/lib/data";

interface ProjectCardProps {
  readonly project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const isLive = project.status === "live";

  return (
    <Card className="bracket panel-hover group border-waste-border bg-waste-panel transition-all duration-300">
      <CardHeader>
        <div>
          <span className="font-mono text-[0.6rem] tracking-[0.15em] text-waste-ash">
            {project.id}
          </span>
          <CardTitle className="mt-1 font-display text-xl tracking-wide text-waste-bone transition-colors group-hover:text-waste-amber">
            {project.name}
          </CardTitle>
        </div>
        <CardAction>
          <div className="flex items-center gap-2">
            {isLive ? (
              <div className="flex items-center gap-1.5">
                <StatusIndicator />
                <WastelandBadge variant="toxic" className="text-[0.6rem]">
                  Live
                </WastelandBadge>
              </div>
            ) : (
              <WastelandBadge variant="rust" className="text-[0.6rem]">
                Research
              </WastelandBadge>
            )}
          </div>
        </CardAction>
        <CardDescription className="text-sm leading-relaxed text-waste-sand">
          {project.description}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-4">
          {project.metrics.map((metric, i) => (
            <div key={metric.label} className="flex items-center gap-4">
              {i > 0 && (
                <Separator orientation="vertical" className="h-8 bg-waste-ash" />
              )}
              <div>
                <div className="font-mono text-lg font-medium text-waste-amber">
                  {metric.value}
                </div>
                <div className="font-mono text-[0.6rem] uppercase tracking-widest text-waste-dim">
                  {metric.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <WastelandBadge key={tag}>{tag}</WastelandBadge>
          ))}
        </div>
        {project.repoUrl && (
          <Button
            variant="outline"
            size="sm"
            asChild
            className="ml-4 shrink-0 gap-1.5 border-waste-border bg-transparent font-mono text-xs tracking-wider text-waste-dim transition-all hover:border-waste-amber/40 hover:text-waste-amber"
          >
            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
              <StarIcon className="h-3.5 w-3.5" />
              STAR
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
