"use client";

import React, { useRef, useState, useEffect } from "react";
import { ProductSequenceCanvas } from "@/components/canvas/ProductSequenceCanvas";
import { ProductCheckpointNav } from "@/components/canvas/ProductCheckpointNav";
import { ProductPartLabel } from "@/components/canvas/ProductPartLabel";
import { ArrowDown, Cpu, Sparkles, Volume2, ArrowUpRight } from "lucide-react";

const CHECKPOINTS = [
  "01 VIEW", "02 FRAME", "03 DRIVE", "04 CHMBR", "05 CORE",
  "06 ANC", "07 MICS", "08 WIRE", "09 SOUND", "10 FINAL",
].map((label, index) => ({ id: index + 1, label, range: [index / 10, (index + 1) / 10] as [number, number] }));

export function SonyInteractiveScroll() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScrollableDistance = container.offsetHeight - window.innerHeight;

      if (totalScrollableDistance <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollableDistance));
      setScrollProgress((current) =>
        Math.abs(current - progress) > 0.0005 ? progress : current
      );
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Narrative Beats
  const isBeat1 = scrollProgress >= 0 && scrollProgress < 0.2;
  const isBeat2 = scrollProgress >= 0.2 && scrollProgress < 0.4;
  const isBeat3 = scrollProgress >= 0.4 && scrollProgress < 0.6;
  const isBeat4 = scrollProgress >= 0.6 && scrollProgress < 0.8;
  const isBeat5 = scrollProgress >= 0.8;

  const activeCheckpoint = CHECKPOINTS.find(
    (c) => scrollProgress >= c.range[0] && (scrollProgress < c.range[1] || c.id === 10)
  )?.id || 1;

  return (
    <div
      id="overview"
      ref={containerRef}
      className="relative w-full h-[240vh] bg-[#050505]"
    >
      {/* Pinned Sticky Viewport Area */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505]">
        {/* Subtle Luxury Radial Glow behind the product */}
        <div className="hidden absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_45%,#070d22_0%,#050505_70%)]" />

        {/* Giant Architectural Background Typography */}
        <div className="hidden absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
          <span className="text-[20vw] font-black tracking-tighter text-white/[0.025] uppercase transition-all duration-700">
            {["ACOUSTIC", "ARCHITECTURE", "DRIVERS", "CHAMBERS", "NEURALCORE", "NOISE CONTROL", "MICROPHONES", "HIGH-RES AUDIO", "SOUNDSTAGE", "EXPLODED"][activeCheckpoint - 1]}
          </span>
        </div>

        {/* 118-Frame Image Sequence Canvas with exact bottom bar & full-screen scale */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center z-10">
          <ProductSequenceCanvas
            type="headphones"
            totalFrames={118}
            progress={scrollProgress}
            showControls={false}
            smoothLerp
          />
        </div>
        <ProductCheckpointNav
          type="headphones"
          checkpoints={CHECKPOINTS}
          activeCheckpoint={activeCheckpoint}
          onSelect={scrollToBeat}
        />
        <ProductPartLabel type="headphones" checkpoint={activeCheckpoint} />

        {/* Narrative Overlays Positioned with Ample Breathing Room */}

        {/* BEAT 1: Hero Intro (0–15% scroll) */}
        <div
          className={`hidden absolute top-12 sm:top-20 left-0 right-0 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none transition-all duration-700 ease-out ${
            isBeat1
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-8 pointer-events-none"
          }`}
        >
          <div className="max-w-3xl space-y-1.5 sm:space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-[11px] font-mono tracking-widest text-cyan-400 uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NEURALWAVES HALO STUDIO</span>
            </div>

            <h1 className="text-3xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
              Halo Studio
            </h1>

            <p className="text-lg sm:text-2xl font-semibold text-gradient-sony tracking-tight">
              Quiet, tuned to your day.
            </p>

            <p className="text-xs sm:text-sm text-white/50 max-w-md mx-auto leading-relaxed">
              Adaptive listening, high-resolution audio, and a light fold-flat frame built for long sessions.
            </p>

            <div className="pt-1 sm:pt-2 flex items-center justify-center gap-2 text-white/40 text-[11px] sm:text-xs font-mono">
              <span>SCROLL TO DISASSEMBLE & EXPLORE</span>
              <ArrowDown className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
            </div>
          </div>
        </div>

        {/* BEAT 2: Engineering Reveal (15–40% scroll) - Left Aligned */}
        <div
          className={`hidden absolute left-4 sm:left-12 md:left-16 top-1/2 -translate-y-1/2 z-20 max-w-[280px] sm:max-w-sm pointer-events-none transition-all duration-700 ease-out ${
            isBeat2
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-12 pointer-events-none"
          }`}
        >
          <div className="space-y-2.5 sm:space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-[10px] font-mono tracking-widest text-cyan-400 uppercase border-l-2 border-cyan-400">
              <Cpu className="w-3 h-3" />
              <span>Acoustic Blueprint</span>
            </div>

            <h2 className="text-xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Precision-engineered for silence.
            </h2>

            <div className="p-3 sm:p-4 rounded-2xl glass-panel-elevated border border-white/10 space-y-2 pointer-events-auto shadow-2xl">
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                Custom drivers, sealed acoustic chambers, and optimized airflow deliver studio-grade clarity.
              </p>
              <p className="text-xs text-white/50 leading-relaxed">
                Every component is tuned for balance, power, and comfort—hour after hour.
              </p>
            </div>

            <div className="flex gap-2">
              <span className="px-2.5 py-1 rounded-lg glass-panel text-[10px] font-mono text-cyan-300">
                30mm Composite Driver
              </span>
              <span className="px-2.5 py-1 rounded-lg glass-panel text-[10px] font-mono text-white/60">
                250g Fold-Flat Frame
              </span>
            </div>
          </div>
        </div>

        {/* BEAT 3: Noise Cancelling & Mics (40–65% scroll) - Right Aligned */}
        <div
          className={`hidden absolute right-4 sm:right-12 md:right-16 top-1/2 -translate-y-1/2 z-20 max-w-[280px] sm:max-w-sm text-right pointer-events-none transition-all duration-700 ease-out ${
            isBeat3
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-12 pointer-events-none"
          }`}
        >
          <div className="space-y-2.5 sm:space-y-3 flex flex-col items-end">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-[10px] font-mono tracking-widest text-cyan-400 uppercase border-r-2 border-cyan-400">
              <Volume2 className="w-3 h-3" />
              <span>Adaptive Noise Control</span>
            </div>

            <h2 className="text-xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Adaptive noise cancelling, redefined.
            </h2>

            <div className="p-3 sm:p-4 rounded-2xl glass-panel-sony border border-cyan-400/30 space-y-1.5 sm:space-y-2 text-left pointer-events-auto shadow-2xl">
              <div className="flex items-start gap-2 text-xs text-white/90">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                <span>Multi-microphone array listens in every direction.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-white/90">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                <span>Real-time noise analysis adjusts to your environment.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-white/90">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                <span>Your music stays pure—planes, trains, and crowds fade away.</span>
              </div>
            </div>

            <a
              href="#noise-cancelling"
              className="pointer-events-auto inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>Test Anti-Phase Audio Demo</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* BEAT 4: Sound & Upscaling (65–85% scroll) - Left Aligned */}
        <div
          className={`hidden absolute left-4 sm:left-12 md:left-16 bottom-20 sm:bottom-28 z-20 max-w-[280px] sm:max-w-md pointer-events-none transition-all duration-700 ease-out ${
            isBeat4
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8 pointer-events-none"
          }`}
        >
          <div className="space-y-2.5 sm:space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
              <Sparkles className="w-3 h-3" />
              <span>Hi-Res Wireless Audio</span>
            </div>

            <h2 className="text-xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Immersive, lifelike sound.
            </h2>

            <div className="p-3 sm:p-4 rounded-2xl glass-panel-elevated border border-white/10 space-y-1.5 sm:space-y-2 pointer-events-auto shadow-2xl">
              <p className="text-xs text-white/80 leading-relaxed">
                High-performance drivers unlock detail, depth, and texture in every track.
              </p>
              <p className="text-xs text-white/50 leading-relaxed">
                AI-enhanced upscaling restores clarity to compressed audio, so every note feels alive.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-white/50">
              <span className="text-cyan-400 font-bold">High-Resolution Wireless Audio</span>
              <span>•</span>
              <span>4 Hz – 40 kHz</span>
            </div>
          </div>
        </div>

        {/* BEAT 5: Peak Exploded Engineering Diagram (85–100% scroll) - Centered Finish */}
        <div
          className={`hidden absolute bottom-20 sm:bottom-28 left-0 right-0 z-20 flex flex-col items-center justify-center p-3 sm:p-4 text-center pointer-events-none transition-all duration-700 ease-out ${
            isBeat5
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div className="max-w-xl mx-auto space-y-2.5 sm:space-y-3 bg-black/80 backdrop-blur-xl p-4 sm:p-6 rounded-3xl border border-white/10 shadow-2xl pointer-events-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Acoustic precision. <span className="text-gradient-sony">Exploded symmetry.</span>
            </h2>

            <p className="text-xs sm:text-sm text-white/70 max-w-md mx-auto">
              Every driver, microphone, and acoustic damping chamber floating in technical alignment.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#specs"
                className="relative inline-flex items-center justify-center p-[1px] rounded-full overflow-hidden group shadow-[0_0_25px_rgba(0,214,255,0.4)]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-[#0050FF] to-[#00D6FF]" />
                <span className="relative px-6 py-2.5 rounded-full bg-[#050505] text-white text-xs font-semibold tracking-wider uppercase transition-all duration-300 group-hover:bg-opacity-90 flex items-center gap-2">
                  <span>Explore Halo Studio</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </a>

              <a
                href="#specs"
                className="px-5 py-2.5 rounded-full glass-panel text-white/70 hover:text-white text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                See full specs
              </a>
            </div>

            <p className="text-[10px] font-mono text-white/40 pt-1 tracking-wider">
              Engineered for airports, offices, and everything in between.
            </p>
          </div>
        </div>

        {/* Scroll Progress Meter (Right Edge) */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-2">
          <div className="text-[10px] font-mono text-cyan-400 font-bold">
            {Math.round(scrollProgress * 100)}%
          </div>
          <div className="w-1 h-36 bg-white/10 rounded-full overflow-hidden p-[0.5px]">
            <div
              className="w-full bg-gradient-to-b from-[#0050FF] to-[#00D6FF] rounded-full transition-all duration-75"
              style={{ height: `${scrollProgress * 100}%` }}
            />
          </div>
          <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest rotate-90 mt-4">
            SCROLL
          </div>
        </div>
      </div>
    </div>
  );
}
