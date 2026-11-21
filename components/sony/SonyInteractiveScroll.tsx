"use client";

import React, { useRef, useState, useEffect } from "react";
import { ProductSequenceCanvas } from "@/components/canvas/ProductSequenceCanvas";
import { ProductCheckpointNav } from "@/components/canvas/ProductCheckpointNav";
import { ProductPartLabel } from "@/components/canvas/ProductPartLabel";

const CHECKPOINTS = [
  "01 VIEW", "02 FRAME", "03 DRIVE", "04 CHMBR", "05 CORE",
  "06 ANC", "07 MICS", "08 WIRE", "09 SOUND", "10 FINAL",
].map((label, index) => ({ id: index + 1, label, range: [index / 10, (index + 1) / 10] as [number, number] }));

export function SonyInteractiveScroll() {
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
        {/* Subtle Luxury Radial Glow behind the product */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_45%,#070d22_0%,#050505_70%)]" />

        {/* 118-Frame Image Sequence Canvas with full-screen scale */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center z-10">
          <ProductSequenceCanvas
            type="headphones"
            totalFrames={118}
            progress={scrollProgress}
            showControls={false}
            smoothLerp
          />
        </div>

        {/* Dynamic Slide Marking Point & Short Description */}
        <ProductPartLabel type="headphones" checkpoint={activeCheckpoint} />

        {/* Checkpoint Navigation Bar */}
        <ProductCheckpointNav
          type="headphones"
          checkpoints={CHECKPOINTS}
          activeCheckpoint={activeCheckpoint}
          onSelect={scrollToBeat}
        />

        {/* Scroll Progress Meter (Right Edge) */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 hidden md:flex flex-col items-center gap-2">
          <div className="text-[10px] font-mono text-cyan-400 font-bold">
            {Math.round(scrollProgress * 100)}%
          </div>
          <div className="w-1 h-36 bg-white/10 rounded-full overflow-hidden p-[0.5px]">
            <div
              className="w-full bg-gradient-to-b from-[#0050FF] to-[#00D6FF] rounded-full transition-all duration-75"
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
