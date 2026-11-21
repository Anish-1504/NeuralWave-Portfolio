"use client";

import { motion } from "framer-motion";
import {
  BatteryCharging,
  Headphones,
  Layers,
  Mic2,
  Music4,
  Shield,
} from "lucide-react";

const FEATURES = [
  {
    icon: Layers,
    category: "Acoustic architecture",
    title: "30 mm dynamic drivers",
    description:
      "A light carbon-fiber composite diaphragm helps keep transients clean and detail present from low bass to airy highs.",
    stat: "4 Hz – 40 kHz range",
  },
  {
    icon: Shield,
    category: "Adaptive quiet",
    title: "Noise control that listens",
    description:
      "An eight-microphone array and dual signal processors respond to fit, movement, and changing ambient sound.",
    stat: "8 microphones",
  },
  {
    icon: Music4,
    category: "Wireless detail",
    title: "High-resolution playback",
    description:
      "High-resolution wireless playback and real-time signal restoration preserve more texture with compatible audio sources.",
    stat: "High-res • AAC • SBC",
  },
  {
    icon: Mic2,
    category: "Voice pickup",
    title: "Clearer calls on the move",
    description:
      "Directional microphone pickup and noise reduction help your voice stay present in busy streets and shared spaces.",
    stat: "Beamformed voice capture",
  },
  {
    icon: BatteryCharging,
    category: "Power",
    title: "Ready for the long haul",
    description:
      "Listen for up to 30 hours with noise cancelling enabled. A short USB-C charge can add hours when you are in a hurry.",
    stat: "Up to 30 hours",
  },
  {
    icon: Headphones,
    category: "Everyday comfort",
    title: "Light, soft, fold-flat",
    description:
      "A roughly 250-gram frame, cushioned synthetic leather, and flat-folding hinges are built for travel and long sessions.",
    stat: "About 250 grams",
  },
] as const;

export function SoundTechAcoustics() {
  return (
    <section
      id="acoustics"
      className="relative overflow-hidden border-y border-white/[0.08] bg-[#050507] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300">
              Halo Studio • Sound architecture
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Sound, shaped around you.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
              Explore the acoustic design, adaptive quiet, call clarity, and everyday details behind the listening experience.
            </p>
          </div>
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
            Scroll to explore
          </span>
        </div>

        <div
          aria-label="Halo Studio sound and comfort features"
          className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-5 sm:mx-0 sm:gap-4 sm:px-0"
        >
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: (index % 3) * 0.06 }}
                className="group w-[min(82vw,22rem)] shrink-0 snap-start rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6 transition-colors duration-300 hover:border-cyan-300/30 sm:w-[min(38vw,24rem)] sm:p-7"
              >
                <div className="mb-7 flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.18em] text-white/35">
                    {String(index + 1).padStart(2, "0")} / {String(FEATURES.length).padStart(2, "0")}
                  </span>
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.08] text-cyan-200 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <p className="font-mono text-[9px] uppercase tracking-[0.17em] text-cyan-200/65">
                  {feature.category}
                </p>
                <h3 className="mt-2 text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 min-h-20 text-sm leading-relaxed text-white/55">
                  {feature.description}
                </p>
                <p className="mt-6 border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-200/75">
                  {feature.stat}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
