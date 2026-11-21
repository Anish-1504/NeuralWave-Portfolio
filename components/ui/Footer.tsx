import React from "react";
import Link from "next/link";
import { Headphones, Watch, Sparkles, ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative bg-[#070709] border-t border-white/[0.08] text-white/60 text-xs overflow-hidden">
      {/* Decorative top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center p-[1px]">
                <div className="w-full h-full bg-[#08080a] rounded-[7px] flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              </div>
              <span className="font-semibold text-sm tracking-widest text-white uppercase">
                Neural<span className="text-cyan-400">Waves</span>
              </span>
            </div>
            <p className="text-xs text-white/50 leading-relaxed">
              An interactive product studio exploring immersive sound, health sensing, and thoughtful wearable design.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-white/40">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>Independent concept showcase; not affiliated with device manufacturers.</span>
            </div>
          </div>

          {/* Col 2: Halo Studio */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-medium tracking-wider uppercase text-xs">
              <Headphones className="w-4 h-4 text-cyan-400" />
              <span>Halo Studio</span>
            </div>
            <ul className="space-y-2 text-white/50">
              <li>
                <Link href="/products/halo-studio" className="hover:text-white transition-colors">
                  118-frame product story
                </Link>
              </li>
              <li>
                <Link href="/products/halo-studio#anc-demo" className="hover:text-white transition-colors">
                  Adaptive noise-control demo
                </Link>
              </li>
              <li>
                <Link href="/products/halo-studio#acoustics" className="hover:text-white transition-colors">
                  Sound architecture & features
                </Link>
              </li>
              <li>
                <Link href="/products/halo-studio#specs" className="hover:text-white transition-colors">
                  Full Technical Specifications
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Pulse One */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-medium tracking-wider uppercase text-xs">
              <Watch className="w-4 h-4 text-sky-400" />
              <span>Pulse One</span>
            </div>
            <ul className="space-y-2 text-white/50">
              <li>
                <Link href="/products/pulse-one" className="hover:text-white transition-colors">
                  118-frame product story
                </Link>
              </li>
              <li>
                <Link href="/products/pulse-one#watch-faces" className="hover:text-white transition-colors">
                  Watch face studio & bands
                </Link>
              </li>
              <li>
                <Link href="/products/pulse-one#health" className="hover:text-white transition-colors">
                  Health & recovery stories
                </Link>
              </li>
              <li>
                <Link href="/products/pulse-one#activity" className="hover:text-white transition-colors">
                  Interactive activity goals
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-white/40 text-[11px]">
          <p>© {new Date().getFullYear()} NeuralWaves. An independent concept showcase.</p>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-white transition-colors">Privacy Notice</Link>
            <Link href="/" className="hover:text-white transition-colors">Acoustic Guidelines</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
