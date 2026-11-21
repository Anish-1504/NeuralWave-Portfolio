"use client";

import React, { useState, useEffect } from "react";
import { Compass, Clock, Flame, Moon, Sliders } from "lucide-react";
import { ThreeWatchViewer, WatchFaceType, CaseFinishType, BandType } from "./ThreeWatchViewer";

export function WatchFaceStudio() {
  const [face, setFace] = useState<WatchFaceType>("modular");
  const [finish, setFinish] = useState<CaseFinishType>("natural");
  const [band, setBand] = useState<BandType>("ocean");
  const [currentTime, setCurrentTime] = useState({ hours: "09", minutes: "41", seconds: "38" });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime({
        hours: String(now.getHours()).padStart(2, "0"),
        minutes: String(now.getMinutes()).padStart(2, "0"),
        seconds: String(now.getSeconds()).padStart(2, "0"),
      });
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const faces = [
    { id: "modular", name: "Modular Grid", icon: Clock, desc: "Six glanceable daily details" },
    { id: "wayfinder", name: "Compass Dial", icon: Compass, desc: "Live compass with heading and bearing" },
    { id: "activity", name: "Activity Analog", icon: Flame, desc: "Calorie rings & analog chronograph" },
    { id: "night", name: "Night Mode", icon: Moon, desc: "Low-glare red display preset" },
  ] as const;

  const finishes = [
    { id: "natural", name: "Natural Titanium", color: "from-stone-300 via-zinc-400 to-stone-500", border: "border-stone-400" },
    { id: "graphite", name: "Space Graphite", color: "from-zinc-800 via-neutral-700 to-zinc-900", border: "border-zinc-700" },
    { id: "white", name: "Ceramic Pearl", color: "from-slate-100 via-zinc-200 to-slate-300", border: "border-slate-300" },
  ] as const;

  const bands = [
    { id: "ocean", name: "Tide Band (Midnight Blue)", bg: "bg-blue-600" },
    { id: "trail", name: "Traverse Loop (Graphite / Orange)", bg: "bg-amber-600" },
    { id: "alpine", name: "Ridge Loop (Starlight White)", bg: "bg-stone-200" },
  ] as const;

  return (
    <div id="watch-faces" className="py-24 relative overflow-hidden bg-[#070709] border-t border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-sky-400 text-xs font-mono tracking-wider uppercase mb-4">
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Dial & Finishes Customizer</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Pulse Face Studio. <span className="text-gradient-apple">Tailored to You.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/60">
            Personalize the bright always-on display with glanceable health details, compass bearings, movement goals, or a low-glare night face.
          </p>
        </div>

        {/* Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Watch Face & Finishes Selectors */}
          <div className="lg:col-span-5 space-y-6">
            {/* Dial Selector */}
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-white/50 block mb-3">
                1. Select Watch Face Dial
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {faces.map((f) => {
                  const Icon = f.icon;
                  const isActive = face === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setFace(f.id)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
                        isActive
                          ? "bg-sky-600/20 border-sky-400/60 text-white shadow-[0_0_20px_rgba(41,151,255,0.2)]"
                          : "bg-white/[0.03] border-white/10 text-white/70 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isActive ? "bg-sky-500/20 text-sky-400" : "bg-white/5 text-white/60"}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{f.name}</div>
                          <div className="text-[11px] text-white/40">{f.desc}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Case Finish Selector */}
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-white/50 block mb-3">
                2. Titanium Case Finish
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {finishes.map((fn) => {
                  const isActive = finish === fn.id;
                  return (
                    <button
                      key={fn.id}
                      type="button"
                      onClick={() => setFinish(fn.id)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        isActive
                          ? "bg-white/10 border-sky-400 text-white shadow-lg"
                          : "bg-white/[0.02] border-white/10 text-white/60 hover:text-white"
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full mx-auto mb-2 bg-gradient-to-tr ${fn.color} border ${fn.border}`} />
                      <div className="text-[11px] font-medium leading-tight">{fn.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Band Strap Selector */}
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-white/50 block mb-3">
                3. High-Performance Band
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {bands.map((b) => {
                  const isActive = band === b.id;
                  return (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => setBand(b.id)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        isActive
                          ? "bg-white/10 border-sky-400 text-white shadow-lg"
                          : "bg-white/[0.02] border-white/10 text-white/60 hover:text-white"
                      }`}
                    >
                      <div className={`w-5 h-2 rounded-full mx-auto mb-2 ${b.bg}`} />
                      <div className="text-[11px] font-medium leading-tight">{b.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Live 3D Interactive Watch Simulator Preview */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative py-6">
            <div className="relative w-full max-w-[520px] p-6 rounded-[48px] bg-gradient-to-b from-[#141418] via-[#0d0d10] to-[#070709] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_80px_rgba(41,151,255,0.18)] flex flex-col items-center overflow-hidden">
              {/* Corner Telemetry Accents */}
              <div className="absolute top-5 left-7 flex items-center gap-2 text-[10px] font-mono text-white/40 uppercase tracking-widest pointer-events-none z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>3D WEBGL ENGINE ACTIVE</span>
              </div>
              <div className="absolute top-5 right-7 text-[10px] font-mono text-cyan-400 uppercase tracking-widest pointer-events-none z-10">
                {finish.toUpperCase()} • {band.toUpperCase()}
              </div>

              {/* Dynamic 3D Three.js Smartwatch with Interactive Orbit & Zoom */}
              <ThreeWatchViewer
                face={face}
                finish={finish}
                band={band}
                currentTime={currentTime}
              />
            </div>

            <div className="mt-5 flex items-center gap-4 text-xs font-mono text-white/50 tracking-wider">
              <span>ALWAYS-ON RETINA OLED</span>
              <span>•</span>
              <span className="text-cyan-400">UP TO 2,000 NITS</span>
              <span>•</span>
              <span className="uppercase">{finish} TITANIUM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
