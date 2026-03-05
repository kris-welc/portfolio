import type { ComponentType } from "react";

export interface ArticleEntry {
  readonly slug: string;
  readonly component: () => Promise<{ default: ComponentType }>;
}

export const ARTICLE_REGISTRY: Record<string, () => Promise<ComponentType>> = {
  "control-hierarchy": async () => {
    const mod = await import("./control-hierarchy");
    return mod.ControlHierarchyContent;
  },
  "agent-algebra": async () => {
    const mod = await import("./agent-algebra");
    return mod.AgentAlgebraContent;
  },
  "dual-layer-regime": async () => {
    const mod = await import("./dual-layer-regime");
    return mod.DualLayerRegimeContent;
  },
  "vpin-conviction": async () => {
    const mod = await import("./vpin-conviction");
    return mod.VpinConvictionContent;
  },
};
