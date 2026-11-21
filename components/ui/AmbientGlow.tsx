import React from "react";

interface AmbientGlowProps {
  color?: "sony" | "apple" | "neutral";
  className?: string;
}

export function AmbientGlow({ color = "sony", className = "" }: AmbientGlowProps) {
  const glowStyles = {
    sony: "bg-[radial-gradient(circle_at_50%_40%,rgba(0,80,255,0.18)_0%,rgba(0,214,255,0.08)_40%,transparent_70%)]",
    apple: "bg-[radial-gradient(circle_at_50%_40%,rgba(41,151,255,0.18)_0%,rgba(100,210,255,0.08)_40%,transparent_70%)]",
    neutral: "bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.08)_0%,transparent_70%)]",
  };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${glowStyles[color]} ${className}`}
    />
  );
}
