"use client";

import React, { useState, useEffect } from "react";
import { Compass, Clock, Flame, Moon, Palette, Sliders } from "lucide-react";

type WatchFace = "modular" | "wayfinder" | "activity" | "night";
type CaseFinish = "natural" | "graphite" | "white";
type BandOption = "ocean" | "trail" | "alpine";

export function WatchFaceStudio() {
  const [face, setFace] = useState<WatchFace>("modular");
  const [finish, setFinish] = useState<CaseFinish>("natural");
  const [band, setBand] = useState<BandOption>("ocean");
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

          {/* Right Live Watch Simulator Preview */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center">
            <div className="relative w-80 sm:w-96 p-8 rounded-[48px] bg-gradient-to-b from-[#18181c] to-[#0c0c0e] border-4 border-stone-600/80 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_50px_rgba(41,151,255,0.15)] flex flex-col items-center">
              {/* Digital Crown & Button Mock (Right Edge) */}
              <div className="absolute -right-3 top-24 w-3 h-14 bg-gradient-to-b from-stone-400 to-stone-600 rounded-r-md border-l border-black shadow-md" />
              <div className="absolute -right-2.5 top-44 w-2.5 h-10 bg-stone-500 rounded-r-sm" />

              {/* Action Button Mock (Left Edge) */}
              <div className="absolute -left-3 top-32 w-3 h-12 bg-amber-600 rounded-l-md border-r border-black shadow-md" />

              {/* OLED Screen Area */}
              <div
                className={`w-full aspect-[410/502] rounded-[36px] p-6 flex flex-col justify-between overflow-hidden relative shadow-inner border border-white/10 transition-colors duration-500 ${
                  face === "night" ? "bg-black text-red-500" : "bg-black text-white"
                }`}
              >
                {/* Watch Face UI Variant 1: Modular Grid */}
                {face === "modular" && (
                  <div className="w-full h-full flex flex-col justify-between">
                    {/* Top Complications */}
                    <div className="flex items-center justify-between text-xs font-mono font-bold">
                      <span className="text-amber-400">72° SUN</span>
                      <span className="text-sky-400">BATT 88%</span>
                      <span className="text-pink-500">76 BPM</span>
                    </div>

                    {/* Main Digital Time Display */}
                    <div className="text-center my-auto">
                      <div className="text-6xl font-black tracking-tight font-sans text-white">
                        {currentTime.hours}:{currentTime.minutes}
                      </div>
                      <div className="text-xs font-mono text-cyan-400 mt-1 uppercase tracking-widest">
                        SEC {currentTime.seconds} • ELEV 2,450 FT
                      </div>
                    </div>

                    {/* Bottom Activity Ring / Graph Summary */}
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-pink-500" />
                        <span className="text-xs font-semibold">680 / 500 CAL</span>
                      </div>
                      <span className="text-xs font-mono text-emerald-400">GOAL MET</span>
                    </div>
                  </div>
                )}

                {/* Watch Face UI Variant 2: Wayfinder Compass */}
                {face === "wayfinder" && (
                  <div className="w-full h-full flex flex-col items-center justify-between relative">
                    <div className="text-xs font-mono text-amber-500 font-bold">
                      37°46&apos;29&quot; N 122°25&apos;10&quot; W
                    </div>

                    {/* Rotating Compass Ring Mock */}
                    <div className="relative w-44 h-44 rounded-full border-2 border-dashed border-sky-400/60 flex items-center justify-center animate-spin-slow">
                      <div className="absolute top-1 text-[10px] font-bold text-amber-500">N</div>
                      <div className="absolute bottom-1 text-[10px] font-bold text-white/50">S</div>
                      <div className="absolute left-1 text-[10px] font-bold text-white/50">W</div>
                      <div className="absolute right-1 text-[10px] font-bold text-white/50">E</div>
                      <div className="w-1.5 h-16 bg-gradient-to-t from-transparent via-amber-500 to-amber-400 rounded-full" />
                    </div>

                    <div className="text-2xl font-bold font-mono">
                      {currentTime.hours}:{currentTime.minutes}
                    </div>
                  </div>
                )}

                {/* Watch Face UI Variant 3: Activity Analog */}
                {face === "activity" && (
                  <div className="w-full h-full flex flex-col items-center justify-center relative">
                    {/* Simulated Concentric Circles */}
                    <div className="relative w-44 h-44 flex items-center justify-center">
                      <div className="absolute inset-0 rounded-full border-4 border-pink-500 shadow-[0_0_15px_#ec4899]" />
                      <div className="absolute inset-4 rounded-full border-4 border-emerald-400 shadow-[0_0_15px_#34d399]" />
                      <div className="absolute inset-8 rounded-full border-4 border-sky-400 shadow-[0_0_15px_#38bdf8]" />
                      <div className="text-center z-10">
                        <div className="text-xl font-bold">{currentTime.hours}:{currentTime.minutes}</div>
                        <div className="text-[10px] font-mono text-white/50">MOVE • EXERCISE</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Watch Face UI Variant 4: Night Mode (Red) */}
                {face === "night" && (
                  <div className="w-full h-full flex flex-col justify-between items-center text-red-500">
                    <div className="text-xs font-mono font-bold tracking-widest uppercase">
                      TACTICAL NIGHT VISION
                    </div>
                    <div className="text-6xl font-black tracking-tight font-sans">
                      {currentTime.hours}:{currentTime.minutes}
                    </div>
                    <div className="text-xs font-mono tracking-widest">
                      LAT 34.0522° • 0 NIT RETINAL
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 text-xs font-mono text-white/40 tracking-wider">
              UP TO 2,000 NITS • ALWAYS-ON OLED
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
