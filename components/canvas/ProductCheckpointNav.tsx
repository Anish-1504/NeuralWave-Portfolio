"use client";

import { useEffect, useRef } from "react";

type ProductType = "headphones" | "watches";

interface Checkpoint {
  id: number;
  label: string;
  range: readonly [number, number];
}

interface ProductCheckpointNavProps {
  type: ProductType;
  checkpoints: readonly Checkpoint[];
  activeCheckpoint: number;
  onSelect: (progress: number) => void;
}

export function ProductCheckpointNav({
  type,
  checkpoints,
  activeCheckpoint,
  onSelect,
}: ProductCheckpointNavProps) {
  const isHeadphones = type === "headphones";
  const accentText = isHeadphones ? "text-cyan-300" : "text-sky-300";
  const activeButton = isHeadphones
    ? "bg-cyan-400/10 text-cyan-200 ring-cyan-300/30"
    : "bg-sky-400/10 text-sky-200 ring-sky-300/30";
  const progress = (activeCheckpoint / checkpoints.length) * 100;
  const activeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    activeButtonRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [activeCheckpoint]);

  return (
    <nav
      aria-label="Product disassembly checkpoints"
      className="absolute inset-x-0 bottom-16 sm:bottom-16 z-30 px-3 sm:px-5"
    >
      <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl border border-white/[0.12] bg-[#080a0e]/90 shadow-[0_16px_50px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
        <div className="h-px bg-white/10">
          <div
            className={`h-full bg-gradient-to-r ${
              type === "headphones" ? "from-blue-600 to-cyan-300" : "from-blue-600 to-sky-300"
            } transition-[width] duration-300`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center gap-3 px-2 py-2 sm:px-3">
          <div className="hidden shrink-0 flex-col border-r border-white/10 pr-3 sm:flex">
            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/35">
              Sequence
            </span>
            <span className={`font-mono text-xs font-semibold ${accentText}`}>
              {String(activeCheckpoint).padStart(2, "0")}
              <span className="text-white/35"> / {String(checkpoints.length).padStart(2, "0")}</span>
            </span>
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-between gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {checkpoints.map((checkpoint) => {
              const isActive = activeCheckpoint === checkpoint.id;
              const [number, ...labelParts] = checkpoint.label.split(" ");

              return (
                <button
                  key={checkpoint.id}
                  type="button"
                  ref={isActive ? activeButtonRef : undefined}
                  aria-label={`${checkpoint.label} checkpoint`}
                  aria-current={isActive ? "step" : undefined}
                  onClick={() => onSelect(checkpoint.range[0] + 0.01)}
                  className={`flex shrink-0 items-center gap-1.5 rounded-xl px-2 py-1.5 font-mono transition-all duration-200 sm:px-2.5 ${
                    isActive
                      ? `${activeButton} ring-1`
                      : "text-white/40 hover:bg-white/[0.06] hover:text-white/80"
                  }`}
                >
                  <span className="text-[9px] font-bold">{number}</span>
                  <span className="hidden text-[9px] tracking-wide md:inline">
                    {labelParts.join(" ")}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
