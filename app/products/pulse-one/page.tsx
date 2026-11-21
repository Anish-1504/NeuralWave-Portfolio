"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GlobalNavbar } from "@/components/navigation/GlobalNavbar";
import { ProductMode } from "@/components/navigation/ProductToggleSwitch";
import { WatchInteractiveScroll } from "@/components/watch/WatchInteractiveScroll";
import { WatchFeatureStories } from "@/components/watch/WatchFeatureStories";
import { WatchFaceStudio } from "@/components/watch/WatchFaceStudio";
import { FitnessActivityRings } from "@/components/watch/FitnessActivityRings";
import { HealthSensorsExperience } from "@/components/watch/HealthSensorsExperience";
import { WatchSpecsModal } from "@/components/watch/WatchSpecsModal";
import { Footer } from "@/components/ui/Footer";
import { Headphones, ArrowUpRight } from "lucide-react";

export default function PulseOnePage() {
  const [activeMode, setActiveMode] = useState<ProductMode>("watch");
  const router = useRouter();

  const handleToggle = (mode: ProductMode) => {
    setActiveMode(mode);
    if (mode === "headphones") {
      router.push("/products/halo-studio");
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-sky-500 selection:text-black overflow-x-clip">
      {/* Global Navbar with Active Watch Mode & Working Toggle Switch */}
      <GlobalNavbar activeMode="watch" onToggleMode={handleToggle} />

      {/* Immediate Full-Screen Pinned 10-Stage Disassembly Experience */}
      <WatchInteractiveScroll />

      {/* Scrollable stories for health, recovery, training, and safety */}
      <WatchFeatureStories />

      {/* Interactive Watch Face Studio & Case/Band Selector */}
      <section id="watch-faces">
        <WatchFaceStudio />
      </section>

      {/* Interactive Calorie Activity Rings */}
      <section id="activity">
        <FitnessActivityRings />
      </section>

      {/* Optical Biosensors & Live ECG Telemetry */}
      <section id="health">
        <HealthSensorsExperience />
      </section>

      {/* Full Technical Specifications Blueprint */}
      <section id="specs">
        <WatchSpecsModal />
      </section>

      {/* Explore the second NeuralWaves product */}
      <section className="py-20 bg-[#07070a] border-t border-white/[0.08]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 glass-panel-sony p-8 sm:p-10 rounded-3xl">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-blue-500/10 text-cyan-400">
              <Headphones className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
                NEURALWAVES COLLECTION
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                Meet Halo Studio
              </h3>
              <p className="text-xs sm:text-sm text-white/50 mt-1">
                Discover immersive listening, adaptive noise control, and a carefully tuned acoustic stage.
              </p>
            </div>
          </div>

          <Link
            href="/products/halo-studio"
            className="px-6 py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-2 shadow-xl flex-shrink-0"
          >
            <span>Explore Halo Studio</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Global Footer */}
      <Footer />
    </main>
  );
}
