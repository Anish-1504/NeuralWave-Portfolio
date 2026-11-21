"use client";

import { motion } from "framer-motion";
import {
  Activity,
  BrainCircuit,
  HeartPulse,
  Moon,
  Radio,
  ShieldCheck,
} from "lucide-react";

const FEATURES = [
  {
    icon: HeartPulse,
    title: "Health sensing",
    detail: "Frequent heart-rate readings, ECG, blood oxygen, and temperature trends offer more context through the day.",
    stat: "Heart • ECG • Oxygen",
  },
  {
    icon: Activity,
    title: "Daily readiness",
    detail: "Bring recent movement, sleep, and personal vitals together in one morning check-in, then follow how the day changes.",
    stat: "A score that evolves",
  },
  {
    icon: Moon,
    title: "Sleep insights",
    detail: "Review sleep duration, consistency, wake-ups, and stage estimates to understand the habits behind your rest.",
    stat: "Rest • Rhythm • Recovery",
  },
  {
    icon: Radio,
    title: "Training modes",
    detail: "Track pace, distance, heart rate, and intervals across runs, rides, swims, strength sessions, and everyday movement.",
    stat: "Move at your pace",
  },
  {
    icon: BrainCircuit,
    title: "On-wrist tools",
    detail: "Use quick voice actions, summaries, and connected features without turning every moment into a phone check.",
    stat: "Voice • 5G • Audio",
  },
  {
    icon: ShieldCheck,
    title: "Safety support",
    detail: "Fall and crash alerts can help reach emergency services or chosen contacts when a serious impact is detected.",
    stat: "Help when it matters",
  },
] as const;

export function WatchFeatureStories() {
  return (
    <section
      id="pulse-highlights"
      className="relative overflow-hidden border-y border-white/[0.08] bg-[#08090d] py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 flex flex-col gap-4 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-sky-300">
              Pulse One • Everyday intelligence
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              More than a glance.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/55 sm:text-base">
              Explore health, recovery, movement, and safety features in a swipeable collection of short product stories.
            </p>
          </div>
          <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
            Scroll to explore
          </span>
        </div>

        <div
          aria-label="Pulse One feature stories"
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
                className="group w-[min(82vw,22rem)] shrink-0 snap-start rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-6 transition-colors duration-300 hover:border-sky-300/30 sm:w-[min(38vw,24rem)] sm:p-7"
              >
                <div className="mb-7 flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.18em] text-white/35">
                    {String(index + 1).padStart(2, "0")} / {String(FEATURES.length).padStart(2, "0")}
                  </span>
                  <span className="grid h-10 w-10 place-items-center rounded-xl border border-sky-300/15 bg-sky-300/[0.08] text-sky-200 transition-transform duration-300 group-hover:scale-110">
                    <Icon className="h-4 w-4" />
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                <p className="mt-3 min-h-20 text-sm leading-relaxed text-white/55">
                  {feature.detail}
                </p>
                <p className="mt-6 border-t border-white/10 pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-sky-200/75">
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
