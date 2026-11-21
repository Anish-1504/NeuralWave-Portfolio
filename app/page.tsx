"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GlobalNavbar } from "@/components/navigation/GlobalNavbar";
import { ProductMode } from "@/components/navigation/ProductToggleSwitch";
import { LandingHero } from "@/components/hero/LandingHero";
import { ActiveNoiseCancellingDemo } from "@/components/sony/ActiveNoiseCancellingDemo";
import { SoundTechAcoustics } from "@/components/sony/SoundTechAcoustics";
import { SonySpecsModal } from "@/components/sony/SonySpecsModal";
import { WatchFaceStudio } from "@/components/watch/WatchFaceStudio";
import { FitnessActivityRings } from "@/components/watch/FitnessActivityRings";
import { HealthSensorsExperience } from "@/components/watch/HealthSensorsExperience";
import { WatchFeatureStories } from "@/components/watch/WatchFeatureStories";
import { WatchSpecsModal } from "@/components/watch/WatchSpecsModal";
import { Footer } from "@/components/ui/Footer";
import { Headphones, Watch, ArrowUpRight, Sparkles } from "lucide-react";

export default function HomePage() {
  const [activeMode, setActiveMode] = useState<ProductMode>("headphones");

  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-x-clip selection:bg-cyan-400 selection:text-black">
      {/* Fixed Global Navbar with Synchronized Toggle */}
      <GlobalNavbar activeMode={activeMode} onToggleMode={setActiveMode} />

      {/* Hero Section */}
      <LandingHero activeMode={activeMode} />

      {/* Dual Product Gateway Cards */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-white/60 text-xs font-mono uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Dedicated Flagship Portals</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Choose Your <span className="text-gradient-silver">Experience.</span>
          </h2>
          <p className="mt-2 text-sm text-white/50">
            Each device features an independent, full-viewport 10-stage scroll-driven disassembly sequence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Halo Studio */}
          <div
            onClick={() => setActiveMode("headphones")}
            className={`isolate p-8 sm:p-10 rounded-3xl cursor-pointer transition-all duration-500 ease-out relative overflow-hidden group hover:-translate-y-1 before:absolute before:inset-0 before:-z-10 before:rounded-3xl before:transition-opacity before:duration-500 ${
              activeMode === "headphones"
                ? "glass-panel-sony border-cyan-300/50 scale-[1.01] shadow-[0_24px_90px_rgba(0,214,255,0.12)] before:bg-[radial-gradient(circle_at_90%_0%,rgba(0,214,255,0.18),transparent_42%),radial-gradient(circle_at_5%_100%,rgba(111,75,255,0.16),transparent_45%)] before:opacity-100"
                : "glass-panel border-violet-300/15 bg-[#0c0c14]/80 opacity-90 hover:opacity-100 hover:border-cyan-300/35 hover:shadow-[0_24px_70px_rgba(0,214,255,0.08)] before:bg-[radial-gradient(circle_at_90%_0%,rgba(0,214,255,0.14),transparent_42%),radial-gradient(circle_at_5%_100%,rgba(111,75,255,0.13),transparent_45%)] before:opacity-60 hover:before:opacity-100"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-violet-500/20 text-cyan-300 ring-1 ring-cyan-200/15 shadow-[0_0_28px_rgba(0,214,255,0.12)]">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest block">
                    NEURALWAVES AUDIO
                  </span>
                  <span className="text-lg font-bold text-white">Halo Studio</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-cyan-400/10 to-violet-400/10 text-cyan-200 text-xs font-mono border border-cyan-200/15">
                118 FRAMES
              </span>
            </div>

            <p className="text-sm text-white/70 leading-relaxed mb-6">
              Explore precision-tuned 30 mm drivers, adaptive multi-microphone noise control, immersive high-resolution audio, and all-day comfort.
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-xs font-mono text-white/50">Up to 30 hours • Fast charge</span>
              <Link
                href="/products/halo-studio"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 group-hover:text-cyan-300 uppercase tracking-wider"
              >
                <span>Launch Experience</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Card 2: Pulse One */}
          <div
            onClick={() => setActiveMode("watch")}
            className={`isolate p-8 sm:p-10 rounded-3xl cursor-pointer transition-all duration-500 ease-out relative overflow-hidden group hover:-translate-y-1 before:absolute before:inset-0 before:-z-10 before:rounded-3xl before:transition-opacity before:duration-500 ${
              activeMode === "watch"
                ? "glass-panel-apple border-sky-300/50 scale-[1.01] shadow-[0_24px_90px_rgba(100,160,255,0.12)] before:bg-[radial-gradient(circle_at_90%_0%,rgba(100,180,255,0.18),transparent_42%),radial-gradient(circle_at_5%_100%,rgba(201,92,255,0.16),transparent_45%)] before:opacity-100"
                : "glass-panel border-fuchsia-300/15 bg-[#0c0c14]/80 opacity-90 hover:opacity-100 hover:border-sky-300/35 hover:shadow-[0_24px_70px_rgba(125,115,255,0.1)] before:bg-[radial-gradient(circle_at_90%_0%,rgba(100,180,255,0.15),transparent_42%),radial-gradient(circle_at_5%_100%,rgba(201,92,255,0.14),transparent_45%)] before:opacity-60 hover:before:opacity-100"
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-sky-400/20 to-fuchsia-500/20 text-sky-300 ring-1 ring-sky-200/15 shadow-[0_0_28px_rgba(113,150,255,0.14)]">
                  <Watch className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-sky-400 uppercase tracking-widest block">
                    NEURALWAVES WEARABLE
                  </span>
                  <span className="text-lg font-bold text-white">Pulse One</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-gradient-to-r from-sky-400/10 to-fuchsia-400/10 text-sky-200 text-xs font-mono border border-sky-200/15">
                118 FRAMES
              </span>
            </div>

            <p className="text-sm text-white/70 leading-relaxed mb-6">
              Explore a bright always-on display, frequent heart sensing, readiness and sleep insights, guided workouts, and connected safety tools.
            </p>

            <div className="flex items-center justify-between pt-4 border-t border-white/10">
              <span className="text-xs font-mono text-white/50">24-hour battery • Health insights</span>
              <Link
                href="/products/pulse-one"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-400 group-hover:text-sky-300 uppercase tracking-wider"
              >
                <span>Launch Experience</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contextual Deep Dive Section depending on currently selected ActiveMode */}
      <div className="transition-all duration-500">
        {activeMode === "headphones" ? (
          <>
            {/* Sony Interactive Suite */}
            <ActiveNoiseCancellingDemo />
            <SoundTechAcoustics />
            <SonySpecsModal />
          </>
        ) : (
          <>
            {/* Apple Watch Interactive Suite */}
            <WatchFeatureStories />
            <WatchFaceStudio />
            <FitnessActivityRings />
            <HealthSensorsExperience />
            <WatchSpecsModal />
          </>
        )}
      </div>

      {/* Global Footer */}
      <Footer />
    </main>
  );
}
