"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import type { ProductMode } from "@/components/navigation/ProductToggleSwitch";
import { ProductSequenceCanvas } from "@/components/canvas/ProductSequenceCanvas";
import { ProductCheckpointNav } from "@/components/canvas/ProductCheckpointNav";
import { ProductPartLabel } from "@/components/canvas/ProductPartLabel";
import {
  ArrowDown,
  ArrowUpRight,
  Sparkles,
  Cpu,
  Volume2,
  Watch,
  Activity,
  Layers,
  Shield,
  Sliders,
  CheckCircle2,
} from "lucide-react";

interface LandingHeroProps {
  activeMode: ProductMode;
}

const CHECKPOINTS = [
  "01 VIEW", "02 FRAME", "03 MATL", "04 PARTS", "05 CHIP",
  "06 SENSE", "07 SIGNAL", "08 AUDIO", "09 DETAIL", "10 FINAL",
].map((label, index) => ({ id: index + 1, label, range: [index / 10, (index + 1) / 10] as [number, number] }));

export function LandingHero({ activeMode }: LandingHeroProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const isHeadphones = activeMode === "headphones";

  // Track scroll position through the full 118-frame sequence.
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScrollableDistance = container.offsetHeight - window.innerHeight;

      if (totalScrollableDistance <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollableDistance));
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Jump to specific narrative checkpoint
  const scrollToBeat = (targetP: number) => {
    const container = containerRef.current;
    if (!container) return;
    const totalScrollableDistance = container.offsetHeight - window.innerHeight;
    if (totalScrollableDistance > 0) {
      window.scrollTo({
        top: container.getBoundingClientRect().top + window.scrollY + targetP * totalScrollableDistance,
        behavior: "smooth",
      });
    }
  };

  // Narrative Stage Flags
  const isBeat1 = scrollProgress >= 0 && scrollProgress < 0.2;
  const isBeat2 = scrollProgress >= 0.2 && scrollProgress < 0.4;
  const isBeat3 = scrollProgress >= 0.4 && scrollProgress < 0.6;
  const isBeat4 = scrollProgress >= 0.6 && scrollProgress < 0.8;
  const isBeat5 = scrollProgress >= 0.8;

  // Active Checkpoint Index
  const activeCheckpoint = CHECKPOINTS.find(
    (c) => scrollProgress >= c.range[0] && (scrollProgress < c.range[1] || c.id === 10)
  )?.id || 1;

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[240vh] bg-[#050505] selection:bg-cyan-400 selection:text-black"
    >
      {/* Pinned Full-Screen Viewport */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505]">
        {/* Atmospheric Dynamic Studio Glow */}
        <div
          className={`hidden pointer-events-none absolute inset-0 transition-opacity duration-1000 ${
            isHeadphones
              ? "bg-[radial-gradient(ellipse_at_50%_42%,rgba(72,91,255,0.34)_0%,rgba(0,214,255,0.12)_34%,rgba(153,73,255,0.10)_58%,#05050a_78%)]"
              : "bg-[radial-gradient(ellipse_at_50%_42%,rgba(67,116,255,0.30)_0%,rgba(100,210,255,0.14)_35%,rgba(188,92,255,0.12)_60%,#05050a_78%)]"
          }`}
        />

        <div className="hidden pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_12%_24%,rgba(126,88,255,0.16),transparent_28%),radial-gradient(circle_at_88%_76%,rgba(0,214,255,0.13),transparent_30%)]" />

        {/* Subtle Engineering Grid */}
        <div className="hidden absolute inset-0 tech-grid opacity-25 pointer-events-none" />

        {/* Giant Architectural Background Typography (Wallium / Luxury Studio style) */}
        <div className="hidden absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
          <span className="text-[18vw] sm:text-[22vw] font-black tracking-tighter text-white/[0.025] uppercase transition-all duration-700">
            {activeMode === "headphones"
              ? ["ACOUSTIC", "ARCHITECTURE", "DRIVERS", "CHAMBERS", "NEURALCORE", "NOISE CONTROL", "MICROPHONES", "HIGH-RES AUDIO", "SOUNDSTAGE", "EXPLODED"][activeCheckpoint - 1]
              : ["TITANIUM", "SAPPHIRE", "DIGITAL CROWN", "ACTION CONTROL", "PULSECORE SYSTEM", "GPS ARRAY", "HEALTH SENSORS", "ECG SYSTEM", "PERFORMANCE", "EXPLODED"][activeCheckpoint - 1]}
          </span>
        </div>

        {/* Full-Screen 3D Product Canvas (Scale 0.94 for Large Cinematic Presentation) */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center z-10">
          <ProductSequenceCanvas
            key={activeMode}
            type={activeMode === "headphones" ? "headphones" : "watches"}
            totalFrames={118}
            progress={scrollProgress}
            showControls={false}
            smoothLerp
            enableMouseTilt={true}
          />
        </div>
        <ProductCheckpointNav
          type={isHeadphones ? "headphones" : "watches"}
          checkpoints={CHECKPOINTS}
          activeCheckpoint={activeCheckpoint}
          onSelect={scrollToBeat}
        />

        {/* Dynamic Slide Marking Point & Short Description */}
        <ProductPartLabel type={isHeadphones ? "headphones" : "watches"} checkpoint={activeCheckpoint} />

        {/* ========================================================================= */}
        {/* NARRATIVE BEAT OVERLAYS: SYNCHRONIZED SCROLL-LINKED TEXT DESCRIPTIONS */}
        {/* ========================================================================= */}

        {/* BEAT 1: Hero Beauty & Intro (0% to 18% scroll) */}
        <div
          className={`hidden absolute top-36 sm:top-40 left-0 right-0 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none transition-all duration-700 ease-out ${
            isBeat1
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-8 pointer-events-none"
          }`}
        >
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel text-[11px] font-mono tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className={isHeadphones ? "text-cyan-400" : "text-sky-400"}>
                {isHeadphones
                  ? "ADAPTIVE NOISE CONTROL • HIGH-RES AUDIO"
                  : "ALWAYS-ON DISPLAY • UP TO 2,000 NITS • HEALTH SENSING"}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {isHeadphones ? "Halo Studio" : "Pulse One"}
            </h1>

            <p
              className={`text-lg sm:text-2xl font-semibold tracking-tight ${
                isHeadphones ? "text-gradient-sony" : "text-gradient-apple"
              }`}
            >
              {isHeadphones ? "Quiet, tuned to your day." : "A clearer view of your day."}
            </p>

            <p className="text-xs sm:text-sm text-white/50 max-w-md mx-auto leading-relaxed">
              {isHeadphones
                ? "Adaptive listening, high-resolution audio, and a light fold-flat frame built for long sessions."
                : "Bright display, health insights, guided movement, and connected tools—all explored as you scroll."}
            </p>

            <div className="pt-2 flex items-center justify-center gap-2 text-white/40 text-xs font-mono">
              <span>SCROLL TO DISASSEMBLE & EXPLORE</span>
              <ArrowDown
                className={`w-3.5 h-3.5 animate-bounce ${
                  isHeadphones ? "text-cyan-400" : "text-sky-400"
                }`}
              />
            </div>
          </div>
        </div>

        {/* BEAT 2: Engineering Blueprint / Disassembly (18% to 42% scroll) - Left Aligned */}
        <div
          className={`hidden absolute left-4 sm:left-10 md:left-16 top-1/2 -translate-y-1/2 z-20 max-w-[310px] sm:max-w-sm pointer-events-none transition-all duration-700 ease-out ${
            isBeat2
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-12 pointer-events-none"
          }`}
        >
          <div className="space-y-3">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-[10px] font-mono tracking-widest uppercase border-l-2 ${
                isHeadphones
                  ? "text-cyan-400 border-cyan-400"
                  : "text-sky-400 border-sky-400"
              }`}
            >
              {isHeadphones ? <Cpu className="w-3 h-3" /> : <Watch className="w-3 h-3" />}
              <span>{isHeadphones ? "Acoustic Blueprint" : "Case & Display"}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              {isHeadphones ? "Precision-engineered inside." : "Light, bright, ready."}
            </h2>

            <div
              className={`p-4 rounded-2xl border space-y-2 pointer-events-auto shadow-2xl ${
                isHeadphones
                  ? "glass-panel-sony border-cyan-400/30"
                  : "glass-panel-apple border-sky-400/30"
              }`}
            >
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-medium">
                {isHeadphones
                  ? "Custom 30mm carbon dome drivers, sealed acoustic chambers, and optimized airflow deliver studio-grade clarity."
                  : "42 mm or 46 mm cases pair with a bright wide-angle display, tactile crown, and customizable side control."}
              </p>
              <p className="text-xs text-white/50 leading-relaxed">
                {isHeadphones
                  ? "Every millimeter is balanced for comfort and pure resonance across a wide 4 Hz – 40,000 Hz frequency spectrum."
                  : "An always-on view keeps the time, activity, and useful health signals within a glance."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`px-2.5 py-1 rounded-lg glass-panel text-[10px] font-mono ${
                  isHeadphones ? "text-cyan-300" : "text-sky-300"
                }`}
              >
                {isHeadphones ? "30mm Composite Driver" : "42 / 46 mm Cases"}
              </span>
              <span className="px-2.5 py-1 rounded-lg glass-panel text-[10px] font-mono text-white/60">
                {isHeadphones ? "250g Fold-Flat Frame" : "2,000-Nit Display"}
              </span>
            </div>
          </div>
        </div>

        {/* BEAT 3: Silicon & Neural Processing (42% to 68% scroll) - Right Aligned */}
        <div
          className={`hidden absolute right-4 sm:right-10 md:right-16 top-1/2 -translate-y-1/2 z-20 max-w-[310px] sm:max-w-sm text-right pointer-events-none transition-all duration-700 ease-out ${
            isBeat3
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-12 pointer-events-none"
          }`}
        >
          <div className="space-y-3 flex flex-col items-end">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-[10px] font-mono tracking-widest uppercase border-r-2 ${
                isHeadphones
                  ? "text-cyan-400 border-cyan-400"
                  : "text-sky-400 border-sky-400"
              }`}
            >
              <Volume2 className="w-3 h-3" />
              <span>
                {isHeadphones ? "Adaptive Noise Control" : "PulseCore S12 Platform"}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              {isHeadphones
                ? "Adaptive noise control, refined."
                : "Useful intelligence, ready."}
            </h2>

            <div
              className={`p-4 rounded-2xl border space-y-2 text-left pointer-events-auto shadow-2xl ${
                isHeadphones
                  ? "glass-panel-sony border-cyan-400/30"
                  : "glass-panel-apple border-sky-400/30"
              }`}
            >
              <div className="flex items-start gap-2 text-xs text-white/90">
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                    isHeadphones ? "bg-cyan-400" : "bg-sky-400"
                  }`}
                />
                <span>
                  {isHeadphones
                    ? "Eight beamforming microphones capture ambient sounds in every direction."
                    : "On-wrist processing keeps everyday tools and health summaries responsive."}
                </span>
              </div>
              <div className="flex items-start gap-2 text-xs text-white/90">
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                    isHeadphones ? "bg-cyan-400" : "bg-sky-400"
                  }`}
                />
                <span>
                  {isHeadphones
                    ? "Adaptive listening adjusts to changes in fit and the environment around you."
                    : "Voice controls and connected features help keep quick interactions close."}
                </span>
              </div>
              <div className="flex items-start gap-2 text-xs text-white/90">
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                    isHeadphones ? "bg-cyan-400" : "bg-sky-400"
                  }`}
                />
                <span>
                  {isHeadphones
                    ? "Multipoint pairing makes it easy to move between a laptop and phone."
                    : "Health, sleep, and activity signals combine into a clearer daily overview."}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <span
                className={`px-2.5 py-1 rounded-lg glass-panel text-[10px] font-mono ${
                  isHeadphones ? "text-cyan-300" : "text-sky-300"
                }`}
              >
                {isHeadphones ? "8-Microphone Array" : "Readiness & HRV"}
              </span>
              <span className="px-2.5 py-1 rounded-lg glass-panel text-[10px] font-mono text-white/60">
                {isHeadphones ? "30-Hour Playback" : "24-Hour Battery"}
              </span>
            </div>
          </div>
        </div>

        {/* BEAT 4: Acoustics / Health Biosensors (68% to 88% scroll) - Left Aligned */}
        <div
          className={`hidden absolute left-4 sm:left-10 md:left-16 bottom-24 sm:bottom-28 z-20 max-w-[310px] sm:max-w-md pointer-events-none transition-all duration-700 ease-out ${
            isBeat4
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8 pointer-events-none"
          }`}
        >
          <div className="space-y-3">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-[10px] font-mono tracking-widest uppercase ${
                isHeadphones ? "text-cyan-400" : "text-sky-400"
              }`}
            >
              {isHeadphones ? (
                <Sparkles className="w-3 h-3" />
              ) : (
                <Activity className="w-3 h-3" />
              )}
              <span>
                {isHeadphones ? "Hi-Res Wireless Audio" : "Biosensing Cluster"}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              {isHeadphones ? "Texture & dynamic depth." : "Deep Health Insight."}
            </h2>

            <div
              className={`p-4 rounded-2xl border space-y-2 pointer-events-auto shadow-2xl ${
                isHeadphones
                  ? "glass-panel-sony border-cyan-400/30"
                  : "glass-panel-apple border-sky-400/30"
              }`}
            >
              <p className="text-xs sm:text-sm text-white/85 leading-relaxed font-medium">
                {isHeadphones
                  ? "High-resolution playback preserves fine texture when paired with compatible audio sources."
                  : "Green, red, and infrared LEDs paired with photodiodes measure blood oxygen and heart rate."}
              </p>
              <p className="text-xs text-white/50 leading-relaxed">
                {isHeadphones
                  ? "Signal restoration can enrich compressed audio for a fuller, more detailed listening experience."
                  : "Electrical heart sensors can record an ECG when placed on the skin; availability depends on region and setup."}
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-white/60">
              <span
                className={`font-bold ${
                  isHeadphones ? "text-cyan-400" : "text-sky-400"
                }`}
              >
                {isHeadphones ? "High-Resolution Wireless" : "On-Demand ECG"}
              </span>
              <span>•</span>
              <span>
                {isHeadphones ? "4 Hz – 40 kHz" : "SpO2 & Temperature"}
              </span>
            </div>
          </div>
        </div>

        {/* BEAT 5: Peak Exploded Engineering Diagram (88% to 100% scroll) - Centered Finish */}
        <div
          className={`hidden absolute bottom-24 sm:bottom-28 left-0 right-0 z-20 flex flex-col items-center justify-center p-3 sm:p-4 text-center pointer-events-none transition-all duration-700 ease-out ${
            isBeat5
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div className="max-w-xl mx-auto space-y-3 bg-[#0c0d12]/90 backdrop-blur-2xl p-5 sm:p-7 rounded-3xl border border-white/10 shadow-2xl pointer-events-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-panel text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
              <Layers className="w-3 h-3 text-cyan-400" />
              <span>Peak Exploded Blueprint</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {isHeadphones ? (
                <>
                  Every component.{" "}
                  <span className="text-gradient-sony">In perfect alignment.</span>
                </>
              ) : (
                <>
                  Layer by layer.{" "}
                  <span className="text-gradient-apple">Unrivaled engineering.</span>
                </>
              )}
            </h2>

            <p className="text-xs sm:text-sm text-white/70 max-w-md mx-auto">
              {isHeadphones
                ? "30 mm composite diaphragm drivers, an 8-microphone array, and dual NeuralCore processors shown in exploded alignment."
                : "Titanium chassis, sapphire crystal display, PulseCore system packaging, and health-sensing components shown in exploded alignment."}
            </p>

            {/* Direct Gateway Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href={
                  isHeadphones
                    ? "/products/halo-studio"
                    : "/products/pulse-one"
                }
                className={`relative inline-flex items-center justify-center p-[1px] rounded-full overflow-hidden group shadow-xl ${
                  isHeadphones
                    ? "shadow-[0_0_25px_rgba(0,214,255,0.4)]"
                    : "shadow-[0_0_25px_rgba(41,151,255,0.4)]"
                }`}
              >
                <span
                  className={`absolute inset-0 ${
                    isHeadphones
                      ? "bg-gradient-to-r from-[#0050FF] to-[#00D6FF]"
                      : "bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500"
                  }`}
                />
                <span className="relative px-6 py-2.5 rounded-full bg-[#050505] text-white text-xs font-semibold tracking-wider uppercase transition-all duration-300 group-hover:bg-opacity-80 flex items-center gap-2">
                  <span>
                    {isHeadphones
                      ? "Launch Dedicated Experience"
                      : "Launch Dedicated Experience"}
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </Link>

              <a
                href={isHeadphones ? "#anc-demo" : "#watch-faces"}
                className="px-5 py-2.5 rounded-full glass-panel text-white/80 hover:text-white text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                {isHeadphones ? "Test ANC Simulator" : "Watch Face Studio"}
              </a>
            </div>
          </div>
        </div>

        {/* Right Edge Minimalist Scroll Distance Meter */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-2">
          <div
            className={`text-[10px] font-mono font-bold ${
              isHeadphones ? "text-cyan-400" : "text-sky-400"
            }`}
          >
            {Math.round(scrollProgress * 100)}%
          </div>
          <div className="w-1 h-32 bg-white/10 rounded-full overflow-hidden p-[0.5px]">
            <div
              className={`w-full rounded-full transition-all duration-75 ${
                isHeadphones
                  ? "bg-gradient-to-b from-[#0050FF] to-[#00D6FF]"
                  : "bg-gradient-to-b from-sky-400 to-blue-600"
              }`}
              style={{ height: `${scrollProgress * 100}%` }}
            />
          </div>
          <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest rotate-90 mt-4">
            SCROLL
          </div>
        </div>
      </div>
    </section>
  );
}
