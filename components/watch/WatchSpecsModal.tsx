"use client";

import React, { useState } from "react";
import { PULSE_SPECS, ProductSpec } from "@/lib/constants";
import { FileText, ChevronRight, CheckCircle2 } from "lucide-react";

export function WatchSpecsModal() {
  const [activeCategory, setActiveCategory] = useState<string>(PULSE_SPECS[0].category);

  const currentSpecGroup: ProductSpec =
    PULSE_SPECS.find((s) => s.category === activeCategory) || PULSE_SPECS[0];

  return (
    <div id="specs" className="py-24 relative overflow-hidden bg-[#07070a] border-t border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel text-sky-400 text-xs font-mono tracking-wider uppercase mb-4">
            <FileText className="w-3.5 h-3.5" />
            <span>Titanium Blueprint</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
            Pulse One <span className="text-gradient-apple">Specifications.</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-white/60">
            Display, connectivity, power, and health-sensing specifications for the Pulse One wearable.
          </p>
        </div>

        {/* Category Tabs & Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Category Selector */}
          <div className="md:col-span-4 flex flex-col gap-2">
            {PULSE_SPECS.map((spec) => {
              const isActive = activeCategory === spec.category;
              return (
                <button
                  key={spec.category}
                  type="button"
                  onClick={() => setActiveCategory(spec.category)}
                  className={`flex items-center justify-between p-4 rounded-2xl text-left text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-sky-600/20 border border-sky-400/60 text-white shadow-[0_0_20px_rgba(41,151,255,0.2)]"
                      : "bg-white/[0.03] border border-white/5 text-white/60 hover:text-white hover:bg-white/[0.06]"
                  }`}
                >
                  <span>{spec.category}</span>
                  <ChevronRight
                    className={`w-4 h-4 transition-transform ${
                      isActive ? "text-sky-400 translate-x-1" : "text-white/20"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right Specifications Details Table */}
          <div className="md:col-span-8 glass-panel-apple p-6 sm:p-8 rounded-3xl">
            <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-sky-400" />
                <span>{currentSpecGroup.category}</span>
              </h3>
              <span className="text-xs font-mono text-sky-400/80 uppercase">
                {currentSpecGroup.items.length} PARAMETERS
              </span>
            </div>

            <div className="divide-y divide-white/10">
              {currentSpecGroup.items.map((item, i) => (
                <div key={i} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="sm:w-1/2">
                    <span className="text-sm font-medium text-white/90">{item.label}</span>
                    {item.detail && (
                      <p className="text-xs text-white/50 mt-0.5">{item.detail}</p>
                    )}
                  </div>
                  <div className="sm:w-1/2 text-left sm:text-right">
                    <span className="text-sm font-semibold text-sky-300 font-mono">
                      {item.value}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
