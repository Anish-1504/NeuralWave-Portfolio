"use client";

import React, { useMemo } from "react";
import type { CSSProperties } from "react";

export type ProductType = "headphones" | "watches";

export interface SlidePartDetail {
  code: string;
  name: string;
  description: string;
  tag: string;
  target: [x: number, y: number]; // Percentage on the canvas [left%, top%]
}

export const SLIDE_PARTS: Record<ProductType, SlidePartDetail[]> = {
  headphones: [
    {
      code: "01 / 10 • VIEW",
      name: "Ergonomic Memory Headband",
      description: "Contoured pressure-relieving band distributing mass evenly for all-day listening comfort.",
      tag: "PRESSURE BALANCED",
      target: [48, 30],
    },
    {
      code: "02 / 10 • FRAME",
      name: "Dual-Axis Swivel Yoke",
      description: "Stepless silent swivel mechanism allowing smooth fold-flat rotation and tailored ergonomic seal.",
      tag: "SILENT GIMBAL",
      target: [40, 48],
    },
    {
      code: "03 / 10 • DRIVE",
      name: "30mm Carbon Composite Driver",
      description: "High-rigidity dome diaphragm reproducing micro-details from deep 4 Hz sub-bass to 40 kHz highs.",
      tag: "STUDIO TRANSIENTS",
      target: [46, 55],
    },
    {
      code: "04 / 10 • CHMBR",
      name: "Acoustic Damping Chamber",
      description: "Airflow-tuned resonance chamber eliminating unwanted standing waves and bass distortion.",
      tag: "AIRFLOW CONTROL",
      target: [52, 50],
    },
    {
      code: "05 / 10 • CORE",
      name: "Dual QN3 HD Neural Processors",
      description: "Real-time AI audio silicon recalculating ambient anti-noise filters 700,000 times per second.",
      tag: "NEURAL SILICON",
      target: [57, 46],
    },
    {
      code: "06 / 10 • ANC",
      name: "Dual-Side ANC Microphone Array",
      description: "Feedforward sensing cluster capturing high and low frequency ambient sound before it reaches the ear.",
      tag: "360° SENSING",
      target: [42, 42],
    },
    {
      code: "07 / 10 • MICS",
      name: "Beamforming Voice Isolation",
      description: "Precision directional microphones tracking vocal frequencies with real-time wind noise suppression.",
      tag: "CLEAR CALLS",
      target: [62, 42],
    },
    {
      code: "08 / 10 • WIRE",
      name: "Hi-Res LDAC Wireless Codec",
      description: "Delivers 990 kbps high-resolution 24-bit/96kHz audio streaming over low-latency Bluetooth.",
      tag: "990 KBPS BITRATE",
      target: [55, 54],
    },
    {
      code: "09 / 10 • SOUND",
      name: "High-Capacity Battery Cell",
      description: "Optimized power architecture providing up to 40 hours of continuous playback with quick charging.",
      tag: "40-HR ENDURANCE",
      target: [67, 58],
    },
    {
      code: "10 / 10 • FINAL",
      name: "Exploded Symmetrical Assembly",
      description: "Every precision acoustic, structural, and silicon component floating in technical alignment.",
      tag: "FULL BLUEPRINT",
      target: [51, 48],
    },
  ],
  watches: [
    {
      code: "01 / 10 • CASE",
      name: "Aerospace Grade 5 Titanium",
      description: "Ultra-durable corrosion-resistant titanium housing precision-machined with micro-beveled edges.",
      tag: "GRADE 5 TITANIUM",
      target: [48, 48],
    },
    {
      code: "02 / 10 • GLASS",
      name: "Curved Sapphire Crystal",
      description: "Diamond-hard scratch-resistant sapphire protecting the vivid 2,000-nit always-on OLED display.",
      tag: "2,000-NIT OLED",
      target: [43, 40],
    },
    {
      code: "03 / 10 • CROWN",
      name: "Haptic Digital Crown",
      description: "Micro-machined tactile crown with optical rotary sensor providing ultra-fine haptic scroll steps.",
      tag: "TACTILE CONTROL",
      target: [61, 42],
    },
    {
      code: "04 / 10 • ACTION",
      name: "Custom Action Button",
      description: "Instant-access high-visibility tactile button programmable for workouts, waypoints, and stopwatch.",
      tag: "INSTANT ACCESS",
      target: [37, 50],
    },
    {
      code: "05 / 10 • SIP",
      name: "S10 SiP Neural Processing Unit",
      description: "High-efficiency system-in-package running machine learning on-wrist with all-day battery efficiency.",
      tag: "ON-DEVICE AI",
      target: [52, 49],
    },
    {
      code: "06 / 10 • GPS",
      name: "Dual-Frequency L1/L5 GPS",
      description: "Integrated precision antenna delivering sub-meter positioning accuracy in dense urban canyons.",
      tag: "L1 + L5 GNSS",
      target: [50, 36],
    },
    {
      code: "07 / 10 • OPTIC",
      name: "Multi-LED Optical Bio-Sensors",
      description: "Green, red, and infrared LED cluster continuously monitoring heart rate and blood oxygen saturation.",
      tag: "CONTINUOUS VITALS",
      target: [65, 62],
    },
    {
      code: "08 / 10 • ECG",
      name: "Titanium ECG Electrodes",
      description: "Sub-dermal electrical heart sensor generating clinical-grade 30-second single-lead electrocardiograms.",
      tag: "MEDICAL GRADE",
      target: [68, 66],
    },
    {
      code: "09 / 10 • SPKR",
      name: "Dual Speaker & Siren Array",
      description: "Dual acoustic transducers providing 86-decibel audible emergency sirens and loud call clarity.",
      tag: "86 DB SIREN",
      target: [70, 52],
    },
    {
      code: "10 / 10 • FINAL",
      name: "Modular Hermetic Assembly",
      description: "Hermetically sealed multi-layer stack engineered for 50-meter water resistance and extreme environments.",
      tag: "50M WATER RESIST",
      target: [53, 49],
    },
  ],
};

interface ProductPartLabelProps {
  type: ProductType;
  checkpoint: number; // 1 to 10
}

export function ProductPartLabel({ type, checkpoint }: ProductPartLabelProps) {
  const parts = SLIDE_PARTS[type];
  const safeIndex = Math.max(0, Math.min(parts.length - 1, checkpoint - 1));
  const currentPart = parts[safeIndex];

  const isHeadphones = type === "headphones";
  const [targetX, targetY] = currentPart.target;

  // Responsive styling variables
  const isRightSide = targetX >= 50;
  const accentTheme = isHeadphones
    ? {
        border: "border-cyan-400/40",
        glow: "shadow-[0_0_20px_rgba(6,182,212,0.35)]",
        textAccent: "text-cyan-300",
        badgeBg: "bg-cyan-500/10 border-cyan-400/30 text-cyan-300",
        radar: "border-cyan-400 bg-cyan-400/20",
        dot: "bg-cyan-300 shadow-[0_0_10px_#22d3ee]",
        pulse: "bg-cyan-400",
      }
    : {
        border: "border-sky-400/40",
        glow: "shadow-[0_0_20px_rgba(56,189,248,0.35)]",
        textAccent: "text-sky-300",
        badgeBg: "bg-sky-500/10 border-sky-400/30 text-sky-300",
        radar: "border-sky-400 bg-sky-400/20",
        dot: "bg-sky-300 shadow-[0_0_10px_#38bdf8]",
        pulse: "bg-sky-400",
      };

  // Desktop positioning offsets: place card to the left or right of the marking point
  const desktopLeft = isRightSide
    ? `max(1.5rem, calc(${targetX}% - 20rem))`
    : `min(calc(100% - 20rem), calc(${targetX}% + 2.5rem))`;

  const desktopTop = `clamp(5.5rem, calc(${targetY}% - 3rem), calc(100% - 15rem))`;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* 1. PULSING MARKING POINT HOTSPOT */}
      <div
        className="absolute transition-all duration-700 ease-out"
        style={{
          left: `${targetX}%`,
          top: `${targetY}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Radar Ping Ripples */}
        <span
          className={`absolute -inset-3 rounded-full opacity-60 animate-ping ${accentTheme.pulse}`}
        />
        {/* Target Reticle Outer Ring */}
        <div
          className={`relative flex items-center justify-center w-7 h-7 rounded-full border-2 bg-black/60 backdrop-blur-md transition-transform duration-300 ${accentTheme.radar} ${accentTheme.glow}`}
        >
          {/* Inner Solid Focal Core */}
          <div className={`w-2.5 h-2.5 rounded-full ${accentTheme.dot}`} />
          
          {/* Reticle Hairline Crosshairs */}
          <span className="absolute -top-1 w-0.5 h-1 bg-white/70" />
          <span className="absolute -bottom-1 w-0.5 h-1 bg-white/70" />
          <span className="absolute -left-1 w-1 h-0.5 bg-white/70" />
          <span className="absolute -right-1 w-1 h-0.5 bg-white/70" />
        </div>
      </div>

      {/* 2. SHORT DESCRIPTION TECHNICAL CARD */}
      {/* Desktop Version: Positioned adjacent to the marking point */}
      <div
        key={`${type}-${checkpoint}`}
        className="hidden sm:block absolute transition-all duration-700 ease-out animate-fade-in"
        style={{
          left: desktopLeft,
          top: desktopTop,
          maxWidth: "18.5rem",
        }}
      >
        <div
          className={`p-4 rounded-2xl bg-[#07090e]/85 backdrop-blur-2xl border ${accentTheme.border} ${accentTheme.glow} shadow-[0_20px_50px_rgba(0,0,0,0.8)]`}
        >
          {/* Slide Indicator Badge */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[9px] font-mono tracking-widest font-semibold uppercase ${accentTheme.badgeBg}`}
            >
              {currentPart.code}
            </span>
            <span className="text-[9px] font-mono tracking-wider text-white/40 uppercase">
              {currentPart.tag}
            </span>
          </div>

          {/* Part Name */}
          <h4 className="text-sm font-bold text-white tracking-tight leading-snug">
            {currentPart.name}
          </h4>

          {/* Short Description */}
          <p className="mt-1.5 text-xs text-white/70 leading-relaxed">
            {currentPart.description}
          </p>
        </div>
      </div>

      {/* Mobile Version: Positioned securely in top card area so it never clips or overlaps bottom controls */}
      <div
        key={`mobile-${type}-${checkpoint}`}
        className="sm:hidden absolute top-20 inset-x-4 transition-all duration-500 ease-out animate-fade-in"
      >
        <div
          className={`p-3.5 rounded-2xl bg-[#07090e]/90 backdrop-blur-2xl border ${accentTheme.border} ${accentTheme.glow} shadow-[0_15px_40px_rgba(0,0,0,0.85)]`}
        >
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[9px] font-mono tracking-widest font-semibold uppercase ${accentTheme.badgeBg}`}
            >
              {currentPart.code}
            </span>
            <span className="text-[9px] font-mono tracking-wider text-white/40 uppercase">
              {currentPart.tag}
            </span>
          </div>

          <h4 className="text-xs font-bold text-white tracking-tight leading-snug">
            {currentPart.name}
          </h4>

          <p className="mt-1 text-[11px] text-white/70 leading-relaxed">
            {currentPart.description}
          </p>
        </div>
      </div>
    </div>
  );
}
