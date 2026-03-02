// SPDX-License-Identifier: AGPL-3.0-only
// Copyright (c) 2026 Kris Welc. All rights reserved.
// Commercial license: see /COMMERCIAL-LICENSE.md

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DiagramShell } from "./diagram-shell";

interface NodeState {
  readonly id: string;
  readonly label: string;
  readonly belief: number;
  readonly localProb: number;
  readonly x: number;
  readonly y: number;
}

interface Edge {
  readonly from: string;
  readonly to: string;
}

const DAMPING = 0.3;
const MAX_ITER = 8;

const INITIAL_NODES: readonly NodeState[] = [
  { id: "intent", label: "user_intent", belief: 0.6, localProb: 0.6, x: 80, y: 50 },
  { id: "relevance", label: "context_rel", belief: 0.75, localProb: 0.75, x: 280, y: 50 },
  { id: "sentiment", label: "sentiment", belief: 0.55, localProb: 0.55, x: 80, y: 170 },
  { id: "factuality", label: "factuality", belief: 0.4, localProb: 0.4, x: 280, y: 170 },
];

const EDGES: readonly Edge[] = [
  { from: "intent", to: "relevance" },
  { from: "intent", to: "sentiment" },
  { from: "relevance", to: "sentiment" },
  { from: "sentiment", to: "factuality" },
];

function getNeighborBeliefs(
  nodeId: string,
  nodes: readonly NodeState[],
): readonly number[] {
  const neighbors: number[] = [];
  for (const edge of EDGES) {
    if (edge.from === nodeId) {
      const n = nodes.find((nd) => nd.id === edge.to);
      if (n) neighbors.push(n.belief);
    }
    if (edge.to === nodeId) {
      const n = nodes.find((nd) => nd.id === edge.from);
      if (n) neighbors.push(n.belief);
    }
  }
  return neighbors;
}

function propagateStep(nodes: readonly NodeState[]): readonly NodeState[] {
  return nodes.map((node) => {
    const neighbors = getNeighborBeliefs(node.id, nodes);
    if (neighbors.length === 0) return node;
    const avgNeighbor =
      neighbors.reduce((sum, b) => sum + b, 0) / neighbors.length;
    const newBelief =
      (1 - DAMPING) * node.belief + DAMPING * avgNeighbor;
    return { ...node, belief: newBelief };
  });
}

export function BeliefPropagation() {
  const [nodes, setNodes] = useState<readonly NodeState[]>(INITIAL_NODES);
  const [iteration, setIteration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeEdge, setActiveEdge] = useState<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const step = useCallback(() => {
    setIteration((prev) => {
      if (prev >= MAX_ITER) return prev;
      setNodes((n) => propagateStep(n));
      setActiveEdge(prev % EDGES.length);
      return prev + 1;
    });
  }, []);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setIteration(0);
    setNodes(INITIAL_NODES);
    setActiveEdge(null);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (isPlaying && iteration < MAX_ITER) {
      intervalRef.current = setInterval(step, 800);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
    if (iteration >= MAX_ITER) setIsPlaying(false);
  }, [isPlaying, iteration, step]);

  const converged = iteration >= MAX_ITER;
  const svgW = 360;
  const svgH = 220;

  return (
    <DiagramShell title="BELIEF PROPAGATION">
      {/* Graph */}
      <div className="mb-4 flex justify-center overflow-x-auto">
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="h-auto w-full max-w-[400px]"
        >
          {/* Edges */}
          {EDGES.map((edge, i) => {
            const from = nodes.find((n) => n.id === edge.from)!;
            const to = nodes.find((n) => n.id === edge.to)!;
            const isActive = activeEdge === i;
            return (
              <line
                key={`${edge.from}-${edge.to}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={
                  isActive
                    ? "var(--color-waste-toxic)"
                    : "var(--color-waste-border)"
                }
                strokeWidth={isActive ? 2 : 1}
                opacity={isActive ? 0.9 : 0.5}
                className="transition-all duration-300"
              />
            );
          })}

          {/* Nodes */}
          {nodes.map((node) => {
            const changed =
              Math.abs(node.belief - node.localProb) > 0.005;
            return (
              <g key={node.id}>
                {/* Outer ring */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={32}
                  fill="var(--color-waste-surface)"
                  stroke={
                    changed
                      ? "var(--color-waste-amber)"
                      : "var(--color-waste-border)"
                  }
                  strokeWidth={changed ? 1.5 : 1}
                  className="transition-all duration-500"
                />
                {/* Inner fill showing belief */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={Math.max(node.belief * 28, 4)}
                  fill="var(--color-waste-amber)"
                  opacity={0.25}
                  className="transition-all duration-500"
                />
                {/* Belief text */}
                <text
                  x={node.x}
                  y={node.y + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill="var(--color-waste-bone)"
                  fontSize="11"
                  fontFamily="var(--font-mono)"
                >
                  {node.belief.toFixed(2)}
                </text>
                {/* Label below */}
                <text
                  x={node.x}
                  y={node.y + 46}
                  textAnchor="middle"
                  fill="var(--color-waste-dim)"
                  fontSize="8"
                  fontFamily="var(--font-mono)"
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Stats */}
      <div className="mb-4 flex flex-wrap gap-4 font-mono text-xs">
        <span className="text-waste-dim">
          ITER: <span className="text-waste-bone">{iteration}</span>/{MAX_ITER}
        </span>
        <span className="text-waste-dim">
          DAMPING: <span className="text-waste-amber">{DAMPING}</span>
        </span>
        {converged && <span className="text-waste-toxic">CONVERGED</span>}
      </div>

      {/* Belief table */}
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {nodes.map((node) => {
          const delta = node.belief - node.localProb;
          return (
            <div
              key={node.id}
              className="rounded border border-waste-border bg-waste-bg p-2 text-center font-mono text-[0.65rem]"
            >
              <div className="text-waste-dim">{node.label}</div>
              <div className="text-waste-bone">{node.belief.toFixed(4)}</div>
              {delta !== 0 && (
                <div
                  className={
                    delta > 0 ? "text-waste-toxic" : "text-waste-rust-light"
                  }
                >
                  {delta > 0 ? "+" : ""}
                  {delta.toFixed(4)}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <button
          onClick={step}
          disabled={iteration >= MAX_ITER}
          className="rounded border border-waste-amber/40 bg-waste-amber/10 px-3 py-1.5 font-mono text-xs tracking-wider text-waste-amber transition-all hover:border-waste-amber hover:bg-waste-amber/20 hover:text-waste-amber-light disabled:cursor-not-allowed disabled:opacity-40"
        >
          STEP
        </button>
        <button
          onClick={() => setIsPlaying((p) => !p)}
          disabled={iteration >= MAX_ITER}
          className="rounded border border-waste-amber/40 bg-waste-amber/10 px-3 py-1.5 font-mono text-xs tracking-wider text-waste-amber transition-all hover:border-waste-amber hover:bg-waste-amber/20 hover:text-waste-amber-light disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isPlaying ? "PAUSE" : "PLAY"}
        </button>
        <button
          onClick={reset}
          className="rounded border border-waste-amber/40 bg-waste-amber/10 px-3 py-1.5 font-mono text-xs tracking-wider text-waste-amber transition-all hover:border-waste-amber hover:bg-waste-amber/20 hover:text-waste-amber-light"
        >
          RESET
        </button>
      </div>
    </DiagramShell>
  );
}
