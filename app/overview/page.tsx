import type { Metadata } from "next";
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Headphones,
  MousePointer2,
  Sparkles,
  Watch,
} from "lucide-react";
import { Footer } from "@/components/ui/Footer";
import { GlobalNavbar } from "@/components/navigation/GlobalNavbar";

export const metadata: Metadata = {
  title: "Overview | NeuralWaves",
  description:
    "Learn about NeuralWaves, an independent interactive showcase exploring immersive audio and wearable technology through cinematic product experiences.",
};

const experiences = [
  {
    name: "Halo Studio",
    category: "Immersive audio",
    description:
      "Explore headphone engineering through a cinematic product sequence, interactive noise-control demonstrations, acoustic design stories, and detailed specifications.",
    highlights: ["Scroll-driven product story", "Noise-control demo", "Acoustic architecture"],
    href: "/products/halo-studio",
    icon: Headphones,
    accent: "cyan",
  },
  {
    name: "Pulse One",
    category: "Wearable technology",
    description:
      "Discover a smartwatch concept focused on everyday health and movement, with interactive stories about its display, sensors, activity features, and design.",
    highlights: ["Watch face studio", "Health and recovery", "Activity goals"],
    href: "/products/pulse-one",
    icon: Watch,
    accent: "sky",
  },
];

export default function OverviewPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-[#050505] text-white selection:bg-cyan-400 selection:text-black">
      <GlobalNavbar />

      <section className="relative isolate px-4 pb-20 pt-36 sm:px-6 sm:pt-44">
        <div className="tech-grid absolute inset-0 -z-10 opacity-40" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(ellipse_at_50%_0%,rgba(0,214,255,0.12),transparent_65%)]" aria-hidden="true" />

        <div className="mx-auto max-w-5xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.06] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-200/80">
            <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
            An interactive product studio
          </div>

          <h1 className="max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            Technology is more than what it{" "}
            <span className="text-gradient-silver">does.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-white/60 sm:text-lg sm:leading-8">
            NeuralWaves is an independent concept showcase that makes product
            design and engineering easier to explore. Move through immersive
            stories about sound, sensing, and the details behind everyday
            technology.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/products/halo-studio"
              className="inline-flex items-center gap-2 rounded-full bg-cyan-300 px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-cyan-200"
            >
              Explore the experiences
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="#experiences"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/75 transition-colors hover:border-white/30 hover:text-white"
            >
              Browse the collection
            </Link>
          </div>

          <div className="mt-16 grid gap-4 border-t border-white/10 pt-7 sm:grid-cols-3">
            <div className="flex items-center gap-3 text-sm text-white/55">
              <MousePointer2 className="h-4 w-4 text-cyan-300" />
              Interactive product stories
            </div>
            <div className="flex items-center gap-3 text-sm text-white/55">
              <Activity className="h-4 w-4 text-sky-300" />
              Technology made tangible
            </div>
            <div className="flex items-center gap-3 text-sm text-white/55">
              <Sparkles className="h-4 w-4 text-violet-300" />
              Independent concept showcase
            </div>
          </div>
        </div>
      </section>

      <section id="experiences" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300/80">
            Two ways to experience it
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Designed to be explored.
          </h2>
          <p className="mt-3 text-sm leading-6 text-white/50">
            Each experience combines visual storytelling with approachable
            explanations of the ideas and features behind the product.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {experiences.map((experience) => {
            const Icon = experience.icon;
            const isAudio = experience.accent === "cyan";

            return (
              <article
                key={experience.name}
                className={`rounded-3xl border p-7 sm:p-9 ${
                  isAudio
                    ? "border-cyan-300/15 bg-gradient-to-br from-cyan-950/30 to-[#0a0b10]"
                    : "border-sky-300/15 bg-gradient-to-br from-sky-950/30 to-[#0a0b10]"
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
                  <Icon className={`h-5 w-5 ${isAudio ? "text-cyan-300" : "text-sky-300"}`} />
                </div>
                <p className={`mt-7 font-mono text-[10px] uppercase tracking-[0.2em] ${isAudio ? "text-cyan-300/75" : "text-sky-300/75"}`}>
                  {experience.category}
                </p>
                <h3 className="mt-2 text-2xl font-semibold">{experience.name}</h3>
                <p className="mt-3 min-h-20 text-sm leading-6 text-white/55">
                  {experience.description}
                </p>
                <ul className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm text-white/65">
                  {experience.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-center gap-2.5">
                      <span className={`h-1 w-1 rounded-full ${isAudio ? "bg-cyan-300" : "bg-sky-300"}`} />
                      {highlight}
                    </li>
                  ))}
                </ul>
                <Link
                  href={experience.href}
                  className={`mt-7 inline-flex items-center gap-2 text-sm font-semibold transition-colors ${isAudio ? "text-cyan-300 hover:text-cyan-200" : "text-sky-300 hover:text-sky-200"}`}
                >
                  Enter {experience.name}
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-white/[0.08] bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cyan-300/80">
              A simple guide
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight">
              Explore at your own pace.
            </h2>
          </div>
          <ol className="grid gap-6 sm:grid-cols-3">
            {[
              ["01", "Choose a product", "Open Halo Studio or Pulse One from the collection."],
              ["02", "Move through the story", "Scroll or use the sequence controls to inspect each frame."],
              ["03", "Go deeper", "Explore the feature stories and product specifications."],
            ].map(([number, title, description]) => (
              <li key={number} className="border-t border-white/15 pt-4">
                <span className="font-mono text-xs text-cyan-300">{number}</span>
                <h3 className="mt-3 text-sm font-semibold text-white/90">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/50">{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Footer />
    </main>
  );
}
