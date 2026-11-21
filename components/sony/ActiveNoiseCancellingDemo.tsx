"use client";

import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, Shield, Activity, Plane, Building2, Car } from "lucide-react";
import { audioDemo } from "@/lib/audio-synth";

export function ActiveNoiseCancellingDemo() {
  const [ancEnabled, setAncEnabled] = useState(true);
  const [environment, setEnvironment] = useState<"airplane" | "office" | "subway">("airplane");
  const [audioPlaying, setAudioPlaying] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);

  const environments = [
    { id: "airplane", name: "Airplane Cabin", icon: Plane, noiseFreq: "Low-frequency rumble", profile: "LOW BAND" },
    { id: "office", name: "Open Office", icon: Building2, noiseFreq: "Voices and room tone", profile: "MID BAND" },
    { id: "subway", name: "Urban Street", icon: Car, noiseFreq: "Traffic and broad noise", profile: "WIDE BAND" },
  ] as const;

  const handleToggleAudio = () => {
    const isNowPlaying = audioDemo.togglePlay(environment, ancEnabled);
    setAudioPlaying(isNowPlaying);
  };

  const handleEnvChange = (env: "airplane" | "office" | "subway") => {
    setEnvironment(env);
    audioDemo.setEnvironment(env);
  };

  const handleAncToggle = () => {
    const nextState = !ancEnabled;
    setAncEnabled(nextState);
    audioDemo.setAnc(nextState);
  };

  useEffect(() => {
    return () => {
      audioDemo.stop();
    };
  }, []);

  // Animate dynamic wave canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.04;
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Draw faint center zero-axis
      ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // Wave parameters based on environment
      const envFreq = environment === "airplane" ? 0.02 : environment === "office" ? 0.05 : 0.035;
      const envAmp = environment === "airplane" ? 36 : environment === "office" ? 28 : 32;

      // 1. Ambient Noise Wave (Red/Orange)
      ctx.beginPath();
      ctx.strokeStyle = "rgba(255, 99, 71, 0.75)";
      ctx.lineWidth = 2;
      for (let x = 0; x < width; x += 3) {
        const y = centerY + Math.sin(x * envFreq + time) * envAmp + Math.cos(x * 0.01 + time * 1.5) * (envAmp * 0.4);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // 2. Anti-Phase Cancellation Wave (Cyan) - Only active if ANC is enabled
      if (ancEnabled) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(0, 214, 255, 0.85)";
        ctx.lineWidth = 2;
        for (let x = 0; x < width; x += 3) {
          // Exact inverted phase (-Math.sin)
          const y = centerY - (Math.sin(x * envFreq + time) * envAmp + Math.cos(x * 0.01 + time * 1.5) * (envAmp * 0.4));
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // 3. Resultant Wave at User's Ear (Near flat / dampened silent blue)
        ctx.beginPath();
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2.5;
        for (let x = 0; x < width; x += 3) {
          const residual = (Math.sin(x * 0.08 + time * 2) * 3) * (Math.random() * 0.4 + 0.6);
          const y = centerY + residual;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [ancEnabled, environment]);

  return (
    <div id="anc-demo" className="py-24 relative overflow-hidden bg-[#07070a] border-t border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-cyan-400 text-xs font-mono tracking-wider uppercase mb-4">
            <Shield className="w-3.5 h-3.5" />
            <span>Adaptive Noise-Control Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Adaptive Noise Cancellation <span className="text-gradient-sony">In Action.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/60 leading-relaxed">
            Choose an environment and toggle the modeled counter-wave to explore how adaptive noise control can reduce steady background sound. This visual and audio demo is illustrative, not a laboratory measurement.
          </p>
        </div>

        {/* Interactive Simulator Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center glass-panel-sony p-6 sm:p-10 rounded-3xl relative">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <label className="text-xs font-mono uppercase tracking-widest text-white/50 block mb-3">
                1. Select Ambient Environment
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {environments.map((env) => {
                  const Icon = env.icon;
                  const isActive = environment === env.id;
                  return (
                    <button
                      key={env.id}
                      type="button"
                      onClick={() => handleEnvChange(env.id)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
                        isActive
                          ? "bg-blue-600/20 border-cyan-400/60 text-white shadow-[0_0_20px_rgba(0,214,255,0.15)]"
                          : "bg-white/[0.03] border-white/10 text-white/70 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isActive ? "bg-cyan-500/20 text-cyan-400" : "bg-white/5 text-white/60"}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold">{env.name}</div>
                          <div className="text-[11px] text-white/40">{env.noiseFreq}</div>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-cyan-400 font-medium">{env.profile}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ANC Toggle Switch & Audio Synth Trigger */}
            <div className="pt-4 border-t border-white/10 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/10">
                <div className="flex items-center gap-3">
                  <Activity className={`w-5 h-5 ${ancEnabled ? "text-cyan-400" : "text-white/40"}`} />
                  <div>
                    <div className="text-xs uppercase tracking-wider font-mono text-white/50">Noise-Control Model</div>
                    <div className="text-sm font-bold text-white">
                      {ancEnabled ? "Cancellation Model Active" : "Ambient-Only Model"}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAncToggle}
                  className={`relative inline-flex h-7 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    ancEnabled ? "bg-cyan-500" : "bg-white/20"
                  }`}
                  aria-label="Toggle noise-control simulation"
                >
                  <span
                    className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      ancEnabled ? "translate-x-7" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Live Web Audio Synthesis Button */}
              <button
                type="button"
                onClick={handleToggleAudio}
                className={`w-full py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2.5 font-semibold text-xs tracking-wider uppercase transition-all duration-300 ${
                  audioPlaying
                    ? "bg-red-500/20 border border-red-500/50 text-red-300 hover:bg-red-500/30"
                    : "bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:opacity-95 shadow-[0_0_25px_rgba(0,214,255,0.25)]"
                }`}
              >
                {audioPlaying ? (
                  <>
                    <VolumeX className="w-4 h-4" />
                    <span>Stop Audio Synthesis Demo</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    <span>Play Live Ambient Audio (Web Audio)</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Oscilloscope Canvas & Waveform Visualizer */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="w-full bg-[#040406] rounded-2xl p-5 border border-white/10 shadow-inner relative">
              <div className="flex items-center justify-between mb-3 text-[11px] font-mono text-white/50">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  SIMULATED ACOUSTIC WAVEFORM
                </span>
                <span className="text-white/40">ILLUSTRATIVE MODEL</span>
              </div>

              {/* Canvas Waveform */}
              <canvas
                ref={canvasRef}
                width={700}
                height={260}
                className="w-full h-52 rounded-xl bg-black/60 border border-white/5 object-contain"
              />

              {/* Legend */}
              <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1 rounded bg-[#ff6347]" />
                  <span className="text-white/70">1. Ambient Noise</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1 rounded bg-[#00d6ff]" />
                  <span className="text-white/70">2. Modeled Counter-Wave</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1 rounded bg-white" />
                  <span className="text-white/70">3. Combined Wave Model</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
