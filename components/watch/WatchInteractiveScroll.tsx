"use client";

import React, { useRef, useState, useEffect } from "react";
import { ProductSequenceCanvas } from "@/components/canvas/ProductSequenceCanvas";
import { ProductCheckpointNav } from "@/components/canvas/ProductCheckpointNav";
import { ProductPartLabel } from "@/components/canvas/ProductPartLabel";

const CHECKPOINTS = [
  "01 CASE", "02 GLASS", "03 CROWN", "04 ACTION", "05 SIP",
  "06 GPS", "07 OPTIC", "08 ECG", "09 SPKR", "10 FINAL",
].map((label, index) => ({ id: index + 1, label, range: [index / 10, (index + 1) / 10] as [number, number] }));

export function WatchInteractiveScroll() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const totalScrollableDistance = container.offsetHeight - window.innerHeight;

      if (totalScrollableDistance <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollableDistance));
      setScrollProgress((current) =>
        Math.abs(current - progress) > 0.0005 ? progress : current
      );
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToBeat = (targetP: number) => {
    const container = containerRef.current;
    if (!container) return;
    const totalScrollableDistance = container.offsetHeight - window.innerHeight;
    if (totalScrollableDistance > 0) {
      window.scrollTo({
        top: container.getBoundingClientRect().top + window.scrollY + targetP * totalScrollableDistance,
        behavior: "smooth",
      });
    }
  };

  const activeCheckpoint = CHECKPOINTS.find(
    (c) => scrollProgress >= c.range[0] && (scrollProgress < c.range[1] || c.id === 10)
  )?.id || 1;

  return (
    <div
      id="overview"
      ref={containerRef}
      className="relative w-full h-[240vh] bg-[#050505]"
    >
      {/* Pinned Sticky Viewport Area */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505]">
        {/* Subtle Luxury Radial Glow */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_45%,#08172c_0%,#050505_70%)]" />

        {/* Full-resolution 118-frame image sequence */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center z-10">
          <ProductSequenceCanvas
            type="watches"
            totalFrames={118}
            progress={scrollProgress}
            showControls={false}
            smoothLerp
            enableMouseTilt={true}
          />
        </div>

        {/* Dynamic Slide Marking Point & Short Description */}
        <ProductPartLabel type="watches" checkpoint={activeCheckpoint} />

        {/* Checkpoint Navigation Bar */}
        <ProductCheckpointNav
          type="watches"
          checkpoints={CHECKPOINTS}
          activeCheckpoint={activeCheckpoint}
          onSelect={scrollToBeat}
        />

        {/* Scroll Progress Meter (Right Edge) */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-2">
          <div className="text-[10px] font-mono text-sky-400 font-bold">
            {Math.round(scrollProgress * 100)}%
          </div>
          <div className="w-1 h-36 bg-white/10 rounded-full overflow-hidden p-[0.5px]">
            <div
              className="w-full bg-gradient-to-b from-sky-400 to-blue-600 rounded-full transition-all duration-75"
              style={{ height: `${scrollProgress * 100}%` }}
            />
          </div>
          <div className="text-[9px] font-mono text-white/30 uppercase tracking-widest rotate-90 mt-4">
            SCROLL
          </div>
        </div>
      </div>
    </div>
  );
}
