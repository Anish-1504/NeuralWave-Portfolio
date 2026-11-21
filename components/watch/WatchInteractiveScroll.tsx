"use client";

import React, { useRef, useState, useEffect } from "react";
import { ProductSequenceCanvas } from "@/components/canvas/ProductSequenceCanvas";
import { ProductCheckpointNav } from "@/components/canvas/ProductCheckpointNav";
import { ProductPartLabel } from "@/components/canvas/ProductPartLabel";
import { ArrowDown, Watch, Cpu, Sparkles, Activity, ArrowUpRight } from "lucide-react";

const CHECKPOINTS = [
  "01 VIEW", "02 CASE", "03 GLASS", "04 CROWN", "05 CORE",
  "06 GPS", "07 SENSE", "08 ECG", "09 ACTION", "10 FINAL",
].map((label, index) => ({ id: index + 1, label, range: [index / 10, (index + 1) / 10] as [number, number] }));

export function WatchInteractiveScroll() {
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
        {/* Subtle Luxury Radial Glow */}
        <div className="hidden absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_45%,#08172c_0%,#050505_70%)]" />

        {/* Giant Architectural Background Typography */}
        <div className="hidden absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden">
          <span className="text-[20vw] font-black tracking-tighter text-white/[0.025] uppercase transition-all duration-700">
            {["TITANIUM", "SAPPHIRE", "DIGITAL CROWN", "ACTION CONTROL", "PULSECORE SYSTEM", "GPS ARRAY", "HEALTH SENSORS", "ECG SYSTEM", "PERFORMANCE", "EXPLODED"][activeCheckpoint - 1]}
          </span>
        </div>

        {/* Full-resolution 118-frame image sequence */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center z-10">
          <ProductSequenceCanvas
            type="watches"
            totalFrames={118}
            progress={scrollProgress}
            showControls={false}
            smoothLerp
            enableMouseTilt={true}
          />
        </div>
        <ProductCheckpointNav
          type="watches"
          checkpoints={CHECKPOINTS}
          activeCheckpoint={activeCheckpoint}
          onSelect={scrollToBeat}
        />
        <ProductPartLabel type="watches" checkpoint={activeCheckpoint} />

        {/* BEAT 1: Hero Intro (0–15% scroll) */}
        <div
          className={`hidden absolute top-16 sm:top-20 left-0 right-0 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none transition-all duration-700 ease-out ${
            isBeat1
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-8 pointer-events-none"
          }`}
        >
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full glass-panel text-[11px] font-mono tracking-widest text-sky-400 uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ALWAYS-ON DISPLAY • HEALTH SENSING</span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-tight">
              Pulse One
            </h1>

            <p className="text-xl sm:text-2xl font-semibold text-gradient-apple tracking-tight">
              A clearer view of your day.
            </p>

            <p className="text-xs sm:text-sm text-white/50 max-w-md mx-auto leading-relaxed">
              A bright always-on display brings activity, recovery, health signals, and connected tools into reach.
            </p>

            <div className="pt-2 flex items-center justify-center gap-2 text-white/40 text-xs font-mono">
              <span>SCROLL TO DISASSEMBLE & EXPLORE</span>
              <ArrowDown className="w-3.5 h-3.5 text-sky-400 animate-bounce" />
            </div>
          </div>
        </div>

        {/* BEAT 2: Craftsmanship (15–40% scroll) - Left Aligned */}
        <div
          className={`hidden absolute left-6 sm:left-12 md:left-16 top-16 sm:top-24 md:top-1/2 md:-translate-y-1/2 z-20 max-w-xs sm:max-w-sm pointer-events-none transition-all duration-700 ease-out ${
            isBeat2
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-12 pointer-events-none"
          }`}
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-[10px] font-mono tracking-widest text-sky-400 uppercase border-l-2 border-sky-400">
              <Watch className="w-3 h-3" />
              <span>Case & Display</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Light, bright, ready.
            </h2>

            <div className="p-4 rounded-2xl glass-panel-elevated border border-white/10 space-y-2 pointer-events-auto shadow-2xl">
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                Choose from 42 mm or 46 mm cases in aluminium, titanium, or ceramic, with a bright wide-angle display.
              </p>
              <p className="text-xs text-white/50 leading-relaxed">
                A tactile crown and customizable side control keep common actions a quick reach away.
              </p>
            </div>

            <div className="flex gap-2">
              <span className="px-2.5 py-1 rounded-lg glass-panel text-[10px] font-mono text-sky-300">
                42 / 46 mm
              </span>
              <span className="px-2.5 py-1 rounded-lg glass-panel text-[10px] font-mono text-white/60">
                Up to 2,000 nits
              </span>
            </div>
          </div>
        </div>

        {/* BEAT 3: SiP Silicon Internals (40–65% scroll) - Right Aligned */}
        <div
          className={`hidden absolute right-6 sm:right-12 md:right-16 top-1/2 -translate-y-1/2 z-20 max-w-xs sm:max-w-sm text-right pointer-events-none transition-all duration-700 ease-out ${
            isBeat3
              ? "opacity-100 translate-x-0"
              : "opacity-0 translate-x-12 pointer-events-none"
          }`}
        >
          <div className="space-y-3 flex flex-col items-end">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-[10px] font-mono tracking-widest text-sky-400 uppercase border-r-2 border-sky-400">
              <Cpu className="w-3 h-3" />
              <span>PulseCore S12 Platform</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Intelligence Within.
            </h2>

            <div className="p-4 rounded-2xl glass-panel-apple border border-sky-400/30 space-y-2 text-left pointer-events-auto shadow-2xl">
              <div className="flex items-start gap-2 text-xs text-white/90">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 flex-shrink-0" />
                <span>Responsive on-wrist processing for everyday tools and health summaries.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-white/90">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 flex-shrink-0" />
                <span>Voice controls help keep quick interactions hands-free.</span>
              </div>
              <div className="flex items-start gap-2 text-xs text-white/90">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-1.5 flex-shrink-0" />
                <span>Cellular connectivity keeps key features close when your phone is away.</span>
              </div>
            </div>

            <a
              href="#watch-faces"
              className="pointer-events-auto inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
            >
              <span>Explore Custom Watch Face Studio</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* BEAT 4: Health Sensors (65–85% scroll) - Left Aligned */}
        <div
          className={`hidden absolute left-6 sm:left-12 md:left-16 bottom-24 sm:bottom-28 z-20 max-w-xs sm:max-w-md pointer-events-none transition-all duration-700 ease-out ${
            isBeat4
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8 pointer-events-none"
          }`}
        >
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-[10px] font-mono tracking-widest text-emerald-400 uppercase">
              <Activity className="w-3 h-3" />
              <span>Biosensing Cluster Telemetry</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Pioneering Health Insights.
            </h2>

            <div className="p-4 rounded-2xl glass-panel-elevated border border-white/10 space-y-2 pointer-events-auto shadow-2xl">
              <p className="text-xs text-white/80 leading-relaxed">
                High-frequency heart readings, ECG, blood oxygen, and overnight temperature trends build a richer picture of wellbeing.
              </p>
              <p className="text-xs text-white/50 leading-relaxed">
                Readiness and sleep views bring recovery context alongside daily movement and training.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-white/50">
              <span className="text-emerald-400 font-bold">ECG Waveform</span>
              <span>•</span>
              <span>SpO2 Blood Oxygen</span>
              <span>•</span>
              <span>Dual Temp Sensors</span>
            </div>
          </div>
        </div>

        {/* BEAT 5: Peak Exploded Engineering Diagram (85–100% scroll) - Centered Finish */}
        <div
          className={`hidden absolute bottom-24 sm:bottom-28 left-0 right-0 z-20 flex flex-col items-center justify-center p-4 text-center pointer-events-none transition-all duration-700 ease-out ${
            isBeat5
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
          }`}
        >
          <div className="max-w-xl mx-auto space-y-3 bg-black/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-2xl pointer-events-auto">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-none">
              Daily Precision. <span className="text-gradient-apple">Made Personal.</span>
            </h2>

            <p className="text-xs sm:text-sm text-white/70 max-w-md mx-auto">
              Case, display, processing, and sensing layers brought together for a wearable that supports the whole day.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#specs"
                className="relative inline-flex items-center justify-center p-[1px] rounded-full overflow-hidden group shadow-[0_0_25px_rgba(41,151,255,0.4)]"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-sky-400 to-blue-600" />
                <span className="relative px-6 py-2.5 rounded-full bg-[#050505] text-white text-xs font-semibold tracking-wider uppercase transition-all duration-300 group-hover:bg-opacity-90 flex items-center gap-2">
                  <span>Explore Pulse One Specs</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-sky-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </a>

              <a
                href="#watch-faces"
                className="px-5 py-2.5 rounded-full glass-panel text-white/70 hover:text-white text-xs font-semibold tracking-wider uppercase transition-colors"
              >
                Customize Dial & Bands
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Progress Meter (Right Edge) */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-2">
          <div className="text-[10px] font-mono text-sky-400 font-bold">
            {Math.round(scrollProgress * 100)}%
          </div>
          <div className="w-1 h-36 bg-white/10 rounded-full overflow-hidden p-[0.5px]">
            <div
              className="w-full bg-gradient-to-b from-sky-400 to-blue-600 rounded-full transition-all duration-75"
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
