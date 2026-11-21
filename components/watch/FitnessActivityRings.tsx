"use client";

import React, { useState } from "react";
import { Flame, Timer, Footprints, Award } from "lucide-react";

export function FitnessActivityRings() {
  const [moveCalories, setMoveCalories] = useState(680);
  const [exerciseMinutes, setExerciseMinutes] = useState(45);
  const [standHours, setStandHours] = useState(12);

  const moveGoal = 500;
  const exerciseGoal = 30;
  const standGoal = 12;

  // Calculate percentages (clamped to max 150% visually)
  const movePct = Math.min(1.5, moveCalories / moveGoal);
  const exercisePct = Math.min(1.5, exerciseMinutes / exerciseGoal);
  const standPct = Math.min(1.5, standHours / standGoal);

  // SVG ring circumference values (2 * PI * r)
  // Outer (Move): r = 88, circ = 552.9
  // Middle (Exercise): r = 68, circ = 427.2
  // Inner (Stand): r = 48, circ = 301.6
  const circMove = 2 * Math.PI * 88;
  const circExercise = 2 * Math.PI * 68;
  const circStand = 2 * Math.PI * 48;

  return (
    <div id="activity" className="py-24 relative overflow-hidden bg-[#050507]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-pink-400 text-xs font-mono tracking-wider uppercase mb-4">
            <Flame className="w-3.5 h-3.5" />
            <span>Interactive Daily Activity Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Move with momentum. <span className="text-gradient-apple">Every day.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/60">
            Set daily movement, training, and standing goals. Adjust the controls to see each progress ring respond in real time.
          </p>
        </div>

        {/* Interactive Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center glass-panel-apple p-8 sm:p-12 rounded-3xl">
          {/* Left: Interactive Sliders */}
          <div className="lg:col-span-6 space-y-6">
            {/* Move Slider */}
            <div className="p-4 rounded-2xl bg-black/40 border border-pink-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5 text-pink-400 font-bold uppercase">
                  <Flame className="w-4 h-4" /> MOVE CALORIES
                </span>
                <span className="text-white font-bold text-sm">{moveCalories} / {moveGoal} KCAL</span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step="10"
                value={moveCalories}
                onChange={(e) => setMoveCalories(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-pink-500"
                aria-label="Move calories slider"
              />
              <div className="text-[11px] text-white/40">Illustrative calorie estimate based on personal movement data.</div>
            </div>

            {/* Exercise Slider */}
            <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase">
                  <Timer className="w-4 h-4" /> EXERCISE DURATION
                </span>
                <span className="text-white font-bold text-sm">{exerciseMinutes} / {exerciseGoal} MIN</span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={exerciseMinutes}
                onChange={(e) => setExerciseMinutes(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                aria-label="Exercise duration slider"
              />
              <div className="text-[11px] text-white/40">Brisk walk, run, HIIT, or swimming laps with built-in GPS.</div>
            </div>

            {/* Stand Slider */}
            <div className="p-4 rounded-2xl bg-black/40 border border-sky-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="flex items-center gap-1.5 text-sky-400 font-bold uppercase">
                  <Footprints className="w-4 h-4" /> STAND HOURS
                </span>
                <span className="text-white font-bold text-sm">{standHours} / {standGoal} HRS</span>
              </div>
              <input
                type="range"
                min="0"
                max="18"
                step="1"
                value={standHours}
                onChange={(e) => setStandHours(parseInt(e.target.value, 10))}
                className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-sky-400"
                aria-label="Stand hours slider"
              />
              <div className="text-[11px] text-white/40">Stand and move for at least 1 minute during 12 separate hours.</div>
            </div>

            {/* Badges Earned */}
            <div className="p-4 rounded-2xl glass-panel flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="w-6 h-6 text-amber-400" />
                <div>
                  <div className="text-xs font-semibold text-white">Momentum Badge</div>
                  <div className="text-[11px] text-white/50">Unlocked by moving beyond your daily target</div>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 uppercase font-bold">UNLOCKED</span>
            </div>
          </div>

          {/* Right: Scalable Vector Graphics Activity Rings */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                {/* Background Track Rings */}
                <circle cx="100" cy="100" r="88" stroke="rgba(236, 72, 153, 0.15)" strokeWidth="16" fill="none" />
                <circle cx="100" cy="100" r="68" stroke="rgba(52, 211, 153, 0.15)" strokeWidth="16" fill="none" />
                <circle cx="100" cy="100" r="48" stroke="rgba(56, 189, 248, 0.15)" strokeWidth="16" fill="none" />

                {/* 1. Move Ring (Outer Pink) */}
                <circle
                  cx="100"
                  cy="100"
                  r="88"
                  stroke="#fa114f"
                  strokeWidth="16"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={circMove}
                  strokeDashoffset={circMove * (1 - Math.min(1, movePct))}
                  style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)" }}
                  className="drop-shadow-[0_0_12px_rgba(250,17,79,0.6)]"
                />

                {/* 2. Exercise Ring (Middle Green) */}
                <circle
                  cx="100"
                  cy="100"
                  r="68"
                  stroke="#9fe870"
                  strokeWidth="16"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={circExercise}
                  strokeDashoffset={circExercise * (1 - Math.min(1, exercisePct))}
                  style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)" }}
                  className="drop-shadow-[0_0_12px_rgba(159,232,112,0.6)]"
                />

                {/* 3. Stand Ring (Inner Cyan) */}
                <circle
                  cx="100"
                  cy="100"
                  r="48"
                  stroke="#00f5d4"
                  strokeWidth="16"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={circStand}
                  strokeDashoffset={circStand * (1 - Math.min(1, standPct))}
                  style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)" }}
                  className="drop-shadow-[0_0_12px_rgba(0,245,212,0.6)]"
                />
              </svg>

              {/* Center Status Pill */}
              <div className="absolute text-center">
                <div className="text-xl sm:text-2xl font-black text-white">
                  {Math.round(movePct * 100)}%
                </div>
                <div className="text-[10px] font-mono text-white/50 uppercase">GOAL PROGRESS</div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-6 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-pink-400">
                <span className="w-2.5 h-2.5 rounded-full bg-[#fa114f]" /> Move
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-[#9fe870]" /> Exercise
              </span>
              <span className="flex items-center gap-1.5 text-sky-400">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00f5d4]" /> Stand
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
