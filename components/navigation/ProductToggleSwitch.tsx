"use client";

import React from "react";
import { Headphones, Watch } from "lucide-react";
import { motion } from "framer-motion";

export type ProductMode = "headphones" | "watch";

interface ProductToggleSwitchProps {
  activeMode: ProductMode;
  onToggle: (mode: ProductMode) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ProductToggleSwitch({
  activeMode,
  onToggle,
  className = "",
  size = "md",
}: ProductToggleSwitchProps) {
  const isHeadphones = activeMode === "headphones";

  const sizeClasses = {
    sm: "p-1 text-xs",
    md: "p-1 sm:p-1.5 text-xs sm:text-sm",
    lg: "p-1.5 sm:p-2 text-sm sm:text-base",
  };

  const btnPadding = {
    sm: "px-2.5 sm:px-3.5 py-1.5",
    md: "px-3 sm:px-4 py-1.5 sm:py-2",
    lg: "px-4 sm:px-6 py-2 sm:py-2.5",
  };

  return (
    <div
      role="radiogroup"
      aria-label="Toggle between NeuralWaves product showcases"
      className={`relative inline-flex items-center rounded-full glass-panel-elevated max-w-full select-none border border-white/10 shadow-lg ${sizeClasses[size]} ${className}`}
    >
      {/* Background Active Sliding Pill */}
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 38 }}
        className={`absolute rounded-full pointer-events-none transition-colors duration-300 ${
          isHeadphones
            ? "left-1.5 top-1.5 bottom-1.5 bg-gradient-to-r from-blue-600 to-cyan-500 shadow-[0_0_20px_rgba(0,214,255,0.4)]"
            : "right-1.5 top-1.5 bottom-1.5 bg-gradient-to-r from-sky-400 to-blue-600 shadow-[0_0_20px_rgba(41,151,255,0.4)]"
        }`}
        style={{
          width: "calc(50% - 3px)",
        }}
      />

      {/* Headphone product */}
      <button
        type="button"
        role="radio"
        aria-checked={isHeadphones}
        onClick={(e) => {
          e.preventDefault();
          onToggle("headphones");
        }}
        className={`relative z-10 flex items-center gap-1.5 sm:gap-2 rounded-full font-semibold transition-all duration-200 select-none whitespace-nowrap cursor-pointer ${
          btnPadding[size]
        } ${
          isHeadphones
            ? "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
            : "text-white/60 hover:text-white"
        }`}
      >
        <Headphones
          className={`transition-transform duration-200 flex-shrink-0 ${
            isHeadphones ? "scale-110 text-cyan-200" : "scale-100"
          } ${size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"}`}
        />
        <span>Halo Studio</span>
      </button>

      {/* Watch product */}
      <button
        type="button"
        role="radio"
        aria-checked={!isHeadphones}
        onClick={(e) => {
          e.preventDefault();
          onToggle("watch");
        }}
        className={`relative z-10 flex items-center gap-1.5 sm:gap-2 rounded-full font-semibold transition-all duration-200 select-none whitespace-nowrap cursor-pointer ${
          btnPadding[size]
        } ${
          !isHeadphones
            ? "text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]"
            : "text-white/60 hover:text-white"
        }`}
      >
        <Watch
          className={`transition-transform duration-200 flex-shrink-0 ${
            !isHeadphones ? "scale-110 text-sky-200" : "scale-100"
          } ${size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"}`}
        />
        <span>Pulse One</span>
      </button>
    </div>
  );
}
