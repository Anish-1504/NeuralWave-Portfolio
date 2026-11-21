"use client";

import type { CSSProperties } from "react";
import { MapPin } from "lucide-react";

type ProductType = "headphones" | "watches";
type PartTarget = readonly [x: number, y: number];

export const PRODUCT_PART_LABELS = {
  headphones: [
    ["Headband", "Pressure balanced"],
    ["Ear Cushions", "Memory foam"],
    ["Carbon Driver", "Precision tuned"],
    ["Acoustic Chamber", "Bass optimized"],
    ["NeuralCore Processor", "Noise analyzed"],
    ["ANC Microphones", "Ambient sensing"],
    ["Voice Microphone", "Clear capture"],
    ["Wireless Codec", "High resolution"],
    ["Battery Cell", "Extended listening"],
    ["Internal Assembly", "Precision aligned"],
  ],
  watches: [
    ["Titanium Case", "Impact resistant"],
    ["Sapphire Crystal", "Scratch resistant"],
    ["Digital Crown", "Tactile control"],
    ["Action Button", "Instant access"],
    ["PulseCore SiP", "On-device processing"],
    ["GPS Antenna", "Dual frequency"],
    ["Optical Sensors", "Wellness sensing"],
    ["ECG Electrodes", "Heart sensing"],
    ["Speaker Array", "Clear alerts"],
    ["Internal Assembly", "Precision aligned"],
  ],
} as const satisfies Record<ProductType, readonly (readonly [string, string])[]>;

const PART_TARGETS: Record<ProductType, readonly PartTarget[]> = {
  headphones: [
    [46, 35],
    [42, 62],
    [47, 58],
    [51, 54],
    [57, 48],
    [42, 42],
    [61, 40],
    [56, 51],
    [69, 61],
    [54, 52],
  ],
  watches: [
    [51, 51],
    [44, 42],
    [58, 45],
    [57, 55],
    [54, 52],
    [54, 41],
    [68, 72],
    [69, 73],
    [75, 61],
    [55, 55],
  ],
};

interface ProductPartLabelProps {
  type: ProductType;
  checkpoint: number;
}

export function ProductPartLabel({ type, checkpoint }: ProductPartLabelProps) {
  const parts = PRODUCT_PART_LABELS[type];
  const partIndex = Math.max(0, Math.min(parts.length - 1, checkpoint - 1));
  const [name, description] = parts[partIndex];
  const [targetX, targetY] = PART_TARGETS[type][partIndex];
  const accentText = type === "headphones" ? "text-cyan-300" : "text-sky-300";
  const accentBorder = type === "headphones" ? "border-l-cyan-300/70" : "border-l-sky-300/70";
  const markerColor =
    type === "headphones"
      ? "text-cyan-200 drop-shadow-[0_0_8px_rgba(34,211,238,0.9)]"
      : "text-sky-200 drop-shadow-[0_0_8px_rgba(125,211,252,0.9)]";
  const mobileLabelLeft =
    targetX < 50
      ? `calc(${targetX}% + 0.75rem)`
      : `calc(${targetX}% - min(11rem, 44vw) - 0.75rem)`;
  const desktopLabelLeft =
    targetX < 55
      ? `calc(${targetX}% - 11rem - 1rem)`
      : `calc(${targetX}% + 1rem)`;
  const targetStyle: CSSProperties = {
    left: `${targetX}%`,
    top: `${targetY}%`,
  };
  const labelStyle = {
    "--mobile-label-left": mobileLabelLeft,
    "--desktop-label-left": desktopLabelLeft,
    "--label-top": `clamp(5.5rem, calc(${targetY}% - 5.5rem), calc(100% - 8rem))`,
  } as CSSProperties;

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      <div
        aria-atomic="true"
        aria-live="polite"
        className={`absolute top-[var(--label-top)] left-[var(--mobile-label-left)] w-[min(11rem,44vw)] rounded-xl border border-white/10 border-l-2 bg-gradient-to-br from-[#10161b]/95 to-[#050709]/95 px-3 py-2.5 text-left shadow-xl shadow-black/40 backdrop-blur-xl sm:left-[var(--desktop-label-left)] sm:w-44 ${accentBorder}`}
        style={labelStyle}
      >
        <p className={`font-mono text-[9px] font-semibold tracking-[0.16em] sm:text-[10px] ${accentText}`}>
          PART {String(partIndex + 1).padStart(2, "0")} / {String(parts.length).padStart(2, "0")}
        </p>
        <p className="mt-1 font-sans text-sm font-bold leading-tight tracking-tight text-white sm:text-base">{name}</p>
        <p className="mt-1 font-sans text-[11px] leading-snug text-white/65 sm:text-xs">{description}</p>
      </div>
      <div className="absolute" style={targetStyle}>
        <MapPin
          aria-hidden="true"
          className={`absolute -left-3 -top-[21px] h-6 w-6 ${markerColor}`}
          strokeWidth={2.2}
        />
      </div>
    </div>
  );
}
