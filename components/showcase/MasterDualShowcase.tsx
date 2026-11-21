"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Layers,
  Cpu,
  Activity,
  Volume2,
  Disc,
  Radio,
  Eye,
  Maximize2,
  CheckCircle2,
  Shield,
  Zap,
  ArrowRight,
  RotateCw,
} from "lucide-react";

export type ShowcaseMode = "dual" | "watch" | "sony";
export type WatchLayer = "all" | "display" | "s10" | "sensors";
export type SonyLayer = "all" | "driver" | "qn3" | "anc" | "cushion";

interface MasterDualShowcaseProps {
  initialMode?: ShowcaseMode;
  showNavControls?: boolean;
}

export function MasterDualShowcase({
  initialMode = "dual",
  showNavControls = true,
}: MasterDualShowcaseProps) {
  const [mode, setMode] = useState<ShowcaseMode>(initialMode);
  const [activeWatchLayer, setActiveWatchLayer] = useState<WatchLayer>("all");
  const [activeSonyLayer, setActiveSonyLayer] = useState<SonyLayer>("all");
  const [activeWatchBand, setActiveWatchBand] = useState<"titanium" | "black" | "orange" | "white">("titanium");
  const [activeSonyColor, setActiveSonyColor] = useState<"black" | "silver" | "blue">("black");
  const [is360Active, setIs360Active] = useState<"none" | "watch" | "sony">("none");
  const [soundwavePulse, setSoundwavePulse] = useState(false);

  // Trigger soundwave animation when ANC is selected
  useEffect(() => {
    if (activeSonyLayer === "anc") {
      setSoundwavePulse(true);
      const timer = setTimeout(() => setSoundwavePulse(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [activeSonyLayer]);

  return (
    <div className="relative w-full bg-[#030305] text-white overflow-hidden selection:bg-cyan-500 selection:text-black">
      {/* Top Floating Control Bar */}
      {showNavControls && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] relative z-20">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono tracking-widest text-white/60 uppercase">
              NEXT-GEN EXPLODED KEYNOTE SHOWCASE
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md">
            <button
              onClick={() => { setMode("dual"); setIs360Active("none"); }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                mode === "dual"
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              Dual Master View
            </button>
            <button
              onClick={() => { setMode("watch"); setIs360Active("none"); }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                mode === "watch"
                  ? "bg-sky-500 text-white shadow-[0_0_15px_rgba(14,165,233,0.5)]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
               Watch Series 10
            </button>
            <button
              onClick={() => { setMode("sony"); setIs360Active("none"); }}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                mode === "sony"
                  ? "bg-cyan-500 text-black font-semibold shadow-[0_0_15px_rgba(6,182,212,0.6)]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              SONY WH-1000XM6
            </button>
          </div>
        </div>
      )}

      {/* Main Showcase Stage */}
      <div className="relative w-full max-w-7xl mx-auto px-2 sm:px-6 py-6 sm:py-10">
        {/* Ambient Holographic Pedestal Floor Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Left Pedestal Glow (Electric Blue / Cyan) */}
          <div className="absolute bottom-10 left-[18%] -translate-x-1/2 w-[420px] h-[160px] bg-[radial-gradient(ellipse_at_center,rgba(0,180,255,0.28)_0%,rgba(0,120,255,0.12)_45%,transparent_70%)] blur-2xl" />
          {/* Right Pedestal Glow (Cyan / Gold Amber) */}
          <div className="absolute bottom-10 right-[18%] translate-x-1/2 w-[460px] h-[160px] bg-[radial-gradient(ellipse_at_center,rgba(0,214,255,0.24)_0%,rgba(217,119,6,0.15)_45%,transparent_70%)] blur-2xl" />
        </div>

        {/* Master Dual Graphic Stage Container */}
        <div className="relative w-full aspect-[16/9] min-h-[440px] sm:min-h-[580px] lg:min-h-[660px] rounded-3xl overflow-hidden border border-white/10 shadow-[0_30px_90px_rgba(0,0,0,0.95)] bg-gradient-to-b from-[#0a0c14] via-[#05060a] to-[#020204]">
          {/* Background Master Exploded Render */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/showcase/master_showcase.jpg"
              alt="Apple Watch Series 10 and Sony WH-1000XM6 Exploded Architectural Showcase"
              fill
              priority
              className={`object-cover object-center transition-all duration-700 ${
                mode === "watch"
                  ? "scale-125 translate-x-[22%] sm:translate-x-[20%]"
                  : mode === "sony"
                  ? "scale-125 -translate-x-[22%] sm:-translate-x-[20%]"
                  : "scale-100 translate-x-0"
              }`}
            />

            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.7)_100%)] pointer-events-none" />
          </div>

          {/* ========================================================================= */}
          {/* LEFT HALF: APPLE WATCH SERIES 10 INTERACTIVE OVERLAYS */}
          {/* ========================================================================= */}
          <div
            className={`absolute inset-y-0 left-0 w-full lg:w-1/2 transition-opacity duration-500 z-10 ${
              mode === "sony" ? "opacity-15 pointer-events-none" : "opacity-100"
            }`}
          >
            {/* Holographic Glowing Pedestal Animation (Watch) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none">
              <div className="w-48 sm:w-64 h-12 rounded-full border-2 border-sky-400/40 shadow-[0_0_30px_rgba(56,189,248,0.4)] animate-pulse" />
              <div className="absolute inset-1.5 rounded-full border border-cyan-400/30" />
            </div>

            {/* Bottom Interactive Controls (Apple Watch) */}
            <div className="absolute bottom-4 left-4 sm:left-8 right-4 sm:right-8 flex flex-wrap items-center gap-2 z-20">
              {/* 360 View Button */}
              <button
                onClick={() => setIs360Active(is360Active === "watch" ? "none" : "watch")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                  is360Active === "watch"
                    ? "bg-sky-500 text-white border-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.6)]"
                    : "bg-black/60 border-white/20 text-white/80 hover:bg-black/90"
                }`}
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>360° View</span>
              </button>

              {/* Exploded Layers Pill Selectors */}
              <button
                onClick={() => setActiveWatchLayer("display")}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-mono border transition-all ${
                  activeWatchLayer === "display"
                    ? "bg-sky-500/30 border-sky-400 text-sky-200"
                    : "bg-black/40 border-white/10 text-white/60 hover:text-white"
                }`}
              >
                Retina Display
              </button>
              <button
                onClick={() => setActiveWatchLayer("s10")}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-mono border transition-all ${
                  activeWatchLayer === "s10"
                    ? "bg-cyan-500/30 border-cyan-400 text-cyan-200"
                    : "bg-black/40 border-white/10 text-white/60 hover:text-white"
                }`}
              >
                S10 Core
              </button>
              <button
                onClick={() => setActiveWatchLayer("sensors")}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-mono border transition-all ${
                  activeWatchLayer === "sensors"
                    ? "bg-emerald-500/30 border-emerald-400 text-emerald-200"
                    : "bg-black/40 border-white/10 text-white/60 hover:text-white"
                }`}
              >
                Sensor Array
              </button>

              {/* Band Swatch Mini Selectors */}
              <div className="ml-auto hidden sm:flex items-center gap-1.5 bg-black/60 border border-white/15 px-2 py-1 rounded-xl">
                <button
                  onClick={() => setActiveWatchBand("black")}
                  title="Space Black Milanese"
                  className={`w-4 h-4 rounded-full bg-zinc-900 border ${
                    activeWatchBand === "black" ? "border-cyan-400 scale-125" : "border-white/30"
                  }`}
                />
                <button
                  onClick={() => setActiveWatchBand("orange")}
                  title="Traverse Orange"
                  className={`w-4 h-4 rounded-full bg-amber-600 border ${
                    activeWatchBand === "orange" ? "border-cyan-400 scale-125" : "border-white/30"
                  }`}
                />
                <button
                  onClick={() => setActiveWatchBand("titanium")}
                  title="Natural Titanium"
                  className={`w-4 h-4 rounded-full bg-stone-300 border ${
                    activeWatchBand === "titanium" ? "border-cyan-400 scale-125" : "border-white/30"
                  }`}
                />
                <button
                  onClick={() => setActiveWatchBand("white")}
                  title="Starlight White"
                  className={`w-4 h-4 rounded-full bg-slate-100 border ${
                    activeWatchBand === "white" ? "border-cyan-400 scale-125" : "border-white/30"
                  }`}
                />
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT HALF: SONY WH-1000XM6 INTERACTIVE OVERLAYS */}
          {/* ========================================================================= */}
          <div
            className={`absolute inset-y-0 right-0 w-full lg:w-1/2 transition-opacity duration-500 z-10 ${
              mode === "watch" ? "opacity-15 pointer-events-none" : "opacity-100"
            }`}
          >
            {/* Holographic Glowing Pedestal Animation (Sony) */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none">
              <div className="w-56 sm:w-72 h-12 rounded-full border-2 border-cyan-400/40 shadow-[0_0_30px_rgba(6,182,212,0.4)] animate-pulse" />
              <div className="absolute inset-1.5 rounded-full border border-amber-400/20" />
            </div>

            {/* Bottom Interactive Controls (Sony WH-1000XM6) */}
            <div className="absolute bottom-4 left-4 sm:left-8 right-4 sm:right-8 flex flex-wrap items-center gap-2 z-20">
              {/* 360 View Button */}
              <button
                onClick={() => setIs360Active(is360Active === "sony" ? "none" : "sony")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-mono transition-all ${
                  is360Active === "sony"
                    ? "bg-cyan-500 text-black font-semibold border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.6)]"
                    : "bg-black/60 border-white/20 text-white/80 hover:bg-black/90"
                }`}
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>360° View</span>
              </button>

              {/* Exploded Layer Pill Selectors */}
              <button
                onClick={() => setActiveSonyLayer("driver")}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-mono border transition-all ${
                  activeSonyLayer === "driver"
                    ? "bg-amber-500/30 border-amber-400 text-amber-200"
                    : "bg-black/40 border-white/10 text-white/60 hover:text-white"
                }`}
              >
                Driver Diaphragm
              </button>
              <button
                onClick={() => setActiveSonyLayer("qn3")}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-mono border transition-all ${
                  activeSonyLayer === "qn3"
                    ? "bg-blue-500/30 border-blue-400 text-blue-200"
                    : "bg-black/40 border-white/10 text-white/60 hover:text-white"
                }`}
              >
                QN3 HD
              </button>
              <button
                onClick={() => setActiveSonyLayer("anc")}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-mono border transition-all ${
                  activeSonyLayer === "anc"
                    ? "bg-cyan-500/30 border-cyan-400 text-cyan-200"
                    : "bg-black/40 border-white/10 text-white/60 hover:text-white"
                }`}
              >
                ANC Waves
              </button>
              <button
                onClick={() => setActiveSonyLayer("cushion")}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-mono border transition-all ${
                  activeSonyLayer === "cushion"
                    ? "bg-purple-500/30 border-purple-400 text-purple-200"
                    : "bg-black/40 border-white/10 text-white/60 hover:text-white"
                }`}
              >
                Cushion
              </button>

              {/* Color Finish Selectors */}
              <div className="ml-auto hidden sm:flex items-center gap-1.5 bg-black/60 border border-white/15 px-2 py-1 rounded-xl">
                <button
                  onClick={() => setActiveSonyColor("black")}
                  title="Matte Black"
                  className={`w-4 h-4 rounded-full bg-zinc-900 border ${
                    activeSonyColor === "black" ? "border-cyan-400 scale-125" : "border-white/30"
                  }`}
                />
                <button
                  onClick={() => setActiveSonyColor("silver")}
                  title="Platinum Silver"
                  className={`w-4 h-4 rounded-full bg-stone-300 border ${
                    activeSonyColor === "silver" ? "border-cyan-400 scale-125" : "border-white/30"
                  }`}
                />
                <button
                  onClick={() => setActiveSonyColor("blue")}
                  title="Midnight Blue"
                  className={`w-4 h-4 rounded-full bg-blue-900 border ${
                    activeSonyColor === "blue" ? "border-cyan-400 scale-125" : "border-white/30"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feature Specs Matrix below the Master Showcase */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Watch Key Highlights */}
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl"></span>
                <span className="text-sm font-bold tracking-tight text-white">Apple Watch Series 10</span>
              </div>
              <Link
                href="/products/pulse-one"
                className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1"
              >
                <span>Full Experience</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="text-base font-bold text-white">2,000 Nits</div>
                <div className="text-[10px] font-mono text-white/50 uppercase mt-0.5">OLED Display</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="text-base font-bold text-sky-400">S10 SiP</div>
                <div className="text-[10px] font-mono text-white/50 uppercase mt-0.5">Neural Engine</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="text-base font-bold text-emerald-400">50M Water</div>
                <div className="text-[10px] font-mono text-white/50 uppercase mt-0.5">Titanium Grade 5</div>
              </div>
            </div>
          </div>

          {/* Sony Key Highlights */}
          <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-wider text-white">SONY</span>
                <span className="text-sm font-bold tracking-tight text-cyan-400">WH-1000XM6</span>
              </div>
              <Link
                href="/products/halo-studio"
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <span>Full Experience</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="text-base font-bold text-white">QN3 HD</div>
                <div className="text-[10px] font-mono text-white/50 uppercase mt-0.5">Dual ANC Chip</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="text-base font-bold text-cyan-400">30mm Dome</div>
                <div className="text-[10px] font-mono text-white/50 uppercase mt-0.5">Carbon Driver</div>
              </div>
              <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                <div className="text-base font-bold text-amber-400">40 Hours</div>
                <div className="text-[10px] font-mono text-white/50 uppercase mt-0.5">Battery Life</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
