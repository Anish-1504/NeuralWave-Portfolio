"use client";

import React, { useEffect, useRef, useState } from "react";
import { HeartPulse, Droplets, Moon, ShieldAlert } from "lucide-react";

export function HealthSensorsExperience() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animRef = useRef<number | null>(null);
  const [bpm, setBpm] = useState(72);

  // Animate medical-grade ECG Waveform (P-Q-R-S-T sequence)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let offset = 0;

    const render = () => {
      offset += 2.5;
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Grid background lines
      ctx.strokeStyle = "rgba(0, 245, 212, 0.08)";
      ctx.lineWidth = 1;
      const gridSize = 20;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // ECG Wave trace
      ctx.beginPath();
      ctx.strokeStyle = "#00f5d4";
      ctx.lineWidth = 2.5;
      ctx.shadowColor = "#00f5d4";
      ctx.shadowBlur = 10;

      for (let x = 0; x < width; x += 2) {
        const cycle = (x + offset) % 240;
        let yVal = 0;

        // P wave
        if (cycle > 40 && cycle < 60) {
          yVal = -Math.sin(((cycle - 40) / 20) * Math.PI) * 12;
        }
        // Q dip
        else if (cycle >= 68 && cycle < 72) {
          yVal = 6;
        }
        // R spike (tall)
        else if (cycle >= 72 && cycle < 82) {
          yVal = -Math.sin(((cycle - 72) / 10) * Math.PI) * 58;
        }
        // S dip
        else if (cycle >= 82 && cycle < 88) {
          yVal = 14;
        }
        // T wave
        else if (cycle > 105 && cycle < 135) {
          yVal = -Math.sin(((cycle - 105) / 30) * Math.PI) * 16;
        }

        const y = centerY + yVal;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      animRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div id="health" className="py-24 relative overflow-hidden bg-[#07070a] border-t border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-emerald-400 text-xs font-mono tracking-wider uppercase mb-4">
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Health & Recovery Signals</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            A clearer view of wellbeing. <span className="text-gradient-apple">Day and night.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/60">
            Heart, ECG, blood oxygen, sleep, and recovery signals help you notice patterns over time. These tools support wellbeing and do not replace medical advice.
          </p>
        </div>

        {/* Live ECG Monitor Banner */}
        <div className="p-8 rounded-3xl glass-panel-apple mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
              <span className="text-xs font-mono uppercase tracking-widest text-white/70">
                LIVE ECG WAVEFORM (ILLUSTRATIVE DEMO)
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-white/50">HEART RATE:</span>
              <span className="text-emerald-400 font-bold text-base">{bpm} BPM</span>
            </div>
          </div>

          <canvas
            ref={canvasRef}
            width={900}
            height={160}
            className="w-full h-36 bg-black/70 rounded-2xl border border-white/10 shadow-inner"
          />

          <div className="mt-3 text-[11px] text-white/40 font-mono">
            *Illustrative interface only. Wearable readings are not a diagnosis and should not replace guidance from a qualified health professional.
          </div>
        </div>

        {/* 3 Health Sensors Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Blood Oxygen SpO2 */}
          <div className="p-8 rounded-3xl glass-panel-elevated relative group hover:border-sky-400/40 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 mb-6 group-hover:scale-110 transition-transform">
              <Droplets className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-sky-400 tracking-wider uppercase mb-1">
              Photoplethysmography
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
            Blood Oxygen Trends
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              On-demand and background measurements offer another signal to review alongside your activity, sleep, and overall wellbeing.
            </p>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/40">
              <span>VIEW</span>
              <span className="text-sky-300 font-semibold">On demand</span>
            </div>
          </div>

          {/* Card 2: Dual Wrist Temperature */}
          <div className="p-8 rounded-3xl glass-panel-elevated relative group hover:border-emerald-400/40 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <Moon className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-emerald-400 tracking-wider uppercase mb-1">
              Sleep & Recovery
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Readiness & HRV
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Sleep score, recent activity, and heart-rate variability help put recovery in context before you plan the day.
            </p>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/40">
              <span>INSIGHTS</span>
              <span className="text-emerald-300 font-semibold">Sleep • HRV</span>
            </div>
          </div>

          {/* Card 3: Crash & Fall Detection */}
          <div className="p-8 rounded-3xl glass-panel-elevated relative group hover:border-amber-400/40 transition-all duration-300">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div className="text-xs font-mono text-amber-400 tracking-wider uppercase mb-1">
              Personal Safety
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              Fall & Crash Alerts
            </h3>
            <p className="text-sm text-white/60 leading-relaxed">
              Motion sensing can identify certain hard falls or vehicle impacts and help connect you with emergency assistance when needed.
            </p>
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-mono text-white/40">
              <span>TOOLS</span>
              <span className="text-amber-300 font-semibold">Alerts • Emergency call</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
