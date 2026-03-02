// SPDX-License-Identifier: AGPL-3.0-only
// Copyright (c) 2026 Kris Welc. All rights reserved.
// Commercial license: see /COMMERCIAL-LICENSE.md

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DiagramShell } from "./diagram-shell";

interface ConvergenceState {
  readonly accuracy: number;
  readonly threshold: number;
}

const TARGETS = { accuracy: 0.72, threshold: 0.55 } as const;
const INITIAL: ConvergenceState = { accuracy: 0.5, threshold: 0.6 };
const MAX_ITER = 8;

function computeStep(
  current: ConvergenceState,
  k: number,
): ConvergenceState {
  return {
    accuracy: current.accuracy + k * (TARGETS.accuracy - current.accuracy),
    threshold: current.threshold + k * (TARGETS.threshold - current.threshold),
  };
}

function computeDistance(a: ConvergenceState, b: ConvergenceState): number {
  return Math.sqrt(
    (a.accuracy - b.accuracy) ** 2 + (a.threshold - b.threshold) ** 2,
  );
}

export function ContractionConvergence() {
  const [k, setK] = useState(0.5);
  const [iteration, setIteration] = useState(0);
  const [state, setState] = useState<ConvergenceState>(INITIAL);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const step = useCallback(() => {
    setIteration((prev) => {
      if (prev >= MAX_ITER) return prev;
      const newIter = prev + 1;
      setState((s) => computeStep(s, k));
      return newIter;
    });
  }, [k]);

  const reset = useCallback(() => {
    setIsPlaying(false);
    setIteration(0);
    setState(INITIAL);
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);

  useEffect(() => {
    if (isPlaying && iteration < MAX_ITER) {
      intervalRef.current = setInterval(step, 600);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
    if (iteration >= MAX_ITER) setIsPlaying(false);
  }, [isPlaying, iteration, step]);

  // Reset iteration when k changes
  useEffect(() => {
    reset();
  }, [k, reset]);

  const distance = computeDistance(state, TARGETS);
  const converged = distance < 0.005;

  return (
    <DiagramShell title="CONTRACTION MAPPING">
      {/* Bars */}
      <div className="mb-6 space-y-4">
        <BarRow
          label="accuracy"
          value={state.accuracy}
          target={TARGETS.accuracy}
        />
        <BarRow
          label="threshold"
          value={state.threshold}
          target={TARGETS.threshold}
        />
      </div>

      {/* Stats */}
      <div className="mb-4 flex flex-wrap gap-4 font-mono text-xs">
        <span className="text-waste-dim">
          ITER: <span className="text-waste-bone">{iteration}</span>/{MAX_ITER}
        </span>
        <span className="text-waste-dim">
          DIST:{" "}
          <span className={converged ? "text-waste-toxic" : "text-waste-bone"}>
            {distance.toFixed(4)}
          </span>
        </span>
        <span className="text-waste-dim">
          k = <span className="text-waste-amber">{k.toFixed(1)}</span>
        </span>
        {converged && (
          <span className="text-waste-toxic">CONVERGED</span>
        )}
      </div>

      {/* Slider */}
      <div className="mb-4">
        <label className="mb-1.5 flex items-center justify-between font-mono text-xs text-waste-dim">
          <span>CONTRACTION FACTOR (k)</span>
          <span className="text-waste-amber">{k.toFixed(1)}</span>
        </label>
        <input
          type="range"
          min={0.1}
          max={0.9}
          step={0.1}
          value={k}
          onChange={(e) => setK(parseFloat(e.target.value))}
          className="diagram-slider w-full"
        />
        <div className="mt-1 flex justify-between font-mono text-[0.6rem] text-waste-ash">
          <span>0.1 (slow)</span>
          <span>0.9 (fast)</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <DiagramButton onClick={step} disabled={iteration >= MAX_ITER}>
          STEP
        </DiagramButton>
        <DiagramButton
          onClick={() => setIsPlaying((p) => !p)}
          disabled={iteration >= MAX_ITER}
        >
          {isPlaying ? "PAUSE" : "PLAY"}
        </DiagramButton>
        <DiagramButton onClick={reset}>RESET</DiagramButton>
      </div>
    </DiagramShell>
  );
}

function BarRow({
  label,
  value,
  target,
}: {
  readonly label: string;
  readonly value: number;
  readonly target: number;
}) {
  const pct = Math.min(value * 100, 100);
  const targetPct = target * 100;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between font-mono text-xs">
        <span className="text-waste-dim">{label}</span>
        <span className="text-waste-bone">{value.toFixed(3)}</span>
      </div>
      <div className="relative h-6 overflow-hidden rounded bg-waste-bg">
        {/* Bar fill */}
        <div
          className="absolute inset-y-0 left-0 rounded bg-waste-amber/30 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
        {/* Target marker */}
        <div
          className="absolute inset-y-0 w-0.5 bg-waste-toxic"
          style={{ left: `${targetPct}%` }}
        />
        <span
          className="absolute top-0 font-mono text-[0.55rem] text-waste-toxic"
          style={{ left: `${targetPct + 1}%` }}
        >
          {target}
        </span>
      </div>
    </div>
  );
}

function DiagramButton({
  children,
  onClick,
  disabled,
}: {
  readonly children: React.ReactNode;
  readonly onClick: () => void;
  readonly disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="rounded border border-waste-amber/40 bg-waste-amber/10 px-3 py-1.5 font-mono text-xs tracking-wider text-waste-amber transition-all hover:border-waste-amber hover:bg-waste-amber/20 hover:text-waste-amber-light disabled:cursor-not-allowed disabled:opacity-40"
    >
      {children}
    </button>
  );
}
