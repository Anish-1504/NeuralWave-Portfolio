"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SonyAppleNavBar } from "@/components/navigation/SonyAppleNavBar";
import { ProductMode } from "@/components/navigation/ProductToggleSwitch";
import { SonyInteractiveScroll } from "@/components/sony/SonyInteractiveScroll";
import { ActiveNoiseCancellingDemo } from "@/components/sony/ActiveNoiseCancellingDemo";
import { SoundTechAcoustics } from "@/components/sony/SoundTechAcoustics";
import { SonySpecsModal } from "@/components/sony/SonySpecsModal";
import { Footer } from "@/components/ui/Footer";
import { ArrowUpRight, Watch } from "lucide-react";

export default function HaloStudioPage() {
  const [activeMode, setActiveMode] = useState<ProductMode>("headphones");
  const router = useRouter();

  const handleToggleMode = (mode: ProductMode) => {
    setActiveMode(mode);
    if (mode === "watch") {
      router.push("/products/pulse-one");
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500 selection:text-black overflow-x-clip">
      <SonyAppleNavBar activeMode={activeMode} onToggleMode={handleToggleMode} />

      {/* Immediate Full-Screen Pinned 10-Stage Disassembly Experience */}
      <SonyInteractiveScroll />

      {/* Technology & Acoustic Driver Breakdown Section */}
      <section id="technology">
        <SoundTechAcoustics />
      </section>

      {/* Noise Cancelling Live Simulation Section */}
      <section id="noise-cancelling">
        <ActiveNoiseCancellingDemo />
      </section>

      {/* Technical Specifications Blueprint Section */}
      <section id="specs">
        <SonySpecsModal />
      </section>

      {/* Explore the second NeuralWaves product */}
      <section className="py-20 bg-[#07070a] border-t border-white/[0.08]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-6 glass-panel-apple p-8 sm:p-10 rounded-3xl">
          <div className="flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-sky-500/10 text-sky-400">
              <Watch className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-mono text-sky-400 uppercase tracking-widest">
                NEURALWAVES COLLECTION
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                Meet Pulse One
              </h3>
              <p className="text-xs sm:text-sm text-white/50 mt-1">
                Discover a connected wearable shaped around movement, recovery, and everyday health.
              </p>
            </div>
          </div>

          <Link
            href="/products/pulse-one"
            className="px-6 py-3.5 rounded-full bg-gradient-to-r from-sky-400 to-blue-600 text-white font-semibold text-xs uppercase tracking-wider hover:opacity-90 transition-all flex items-center gap-2 shadow-xl flex-shrink-0"
          >
            <span>Explore Pulse One</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Global Footer */}
      <Footer />
    </main>
  );
}
