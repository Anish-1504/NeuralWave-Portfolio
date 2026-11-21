"use client";

import React, { useEffect, useRef, useState, useCallback, useId } from "react";
import { Play, Pause, RotateCcw, Sparkles } from "lucide-react";

interface ProductSequenceCanvasProps {
  type: "headphones" | "watches";
  totalFrames?: number;
  progress?: number; // 0 to 1
  onProgressChange?: (progress: number) => void;
  showControls?: boolean;
  className?: string;
  autoPlayDefault?: boolean;
  smoothLerp?: boolean;
  enableMouseTilt?: boolean;
}

// Global persistent image cache across component re-renders
const globalImageCache = new Map<string, HTMLImageElement>();

export function ProductSequenceCanvas({
  type,
  totalFrames = 118,
  progress,
  onProgressChange,
  showControls = true,
  className = "",
  autoPlayDefault = false,
  smoothLerp = true,
  enableMouseTilt = true,
}: ProductSequenceCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const sparkleSampleContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const sharpenFilterId = `sequence-sharpen-${useId().replace(/:/g, "")}`;
  const [completedCount, setCompletedCount] = useState(0);
  const [failedCount, setFailedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlayDefault);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });

  const startFrame = 0;
  const endFrame = totalFrames - 1;
  const totalSequenceFrames = totalFrames;

  const targetFrameRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const imagesArrayRef = useRef<HTMLImageElement[]>([]);

  // Frame URL generator
  const getFramePath = useCallback(
    (index: number) => {
      const num = String(index + 1).padStart(3, "0");
      return `/sequences/${type}/ezgif-frame-${num}.jpg`;
    },
    [type]
  );

  // Render a specific frame onto the canvas
  const renderFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const clampedIdx = Math.max(0, Math.min(totalFrames - 1, Math.round(frameIdx)));
    let img = imagesArrayRef.current[clampedIdx];

    if (!img || !img.complete || img.naturalWidth === 0) {
      let fallbackImg: HTMLImageElement | null = null;
      for (let offset = 1; offset < totalFrames; offset++) {
        const left = imagesArrayRef.current[clampedIdx - offset];
        if (left && left.complete && left.naturalWidth > 0) {
          fallbackImg = left;
          break;
        }
        const right = imagesArrayRef.current[clampedIdx + offset];
        if (right && right.complete && right.naturalWidth > 0) {
          fallbackImg = right;
          break;
        }
      }
      if (!fallbackImg || !fallbackImg.complete || fallbackImg.naturalWidth === 0) return;
      img = fallbackImg;
    }

    drawImgToCanvas(img, canvas, ctx);
  }, [totalFrames, type]);

  // Draw each supplied frame once; the frames already include their studio background.
  const drawImgToCanvas = (
    img: HTMLImageElement,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) => {
    const width = canvas.width;
    const height = canvas.height;

    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, width, height);

    const scale = Math.min(width / img.naturalWidth, height / img.naturalHeight) * 0.96;
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;
    const drawX = (width - drawW) / 2;
    const drawY = (height - drawH) / 2;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    const markX = drawX + drawW * 0.886;
    const markY = drawY + drawH * 0.798;
    const markWidth = drawW * 0.041;
    const markHeight = drawH * 0.07;
    const markCenterX = markX + markWidth / 2;
    const markCenterY = markY + markHeight / 2;
    if (!sparkleSampleContextRef.current) {
      const sampleCanvas = document.createElement("canvas");
      sampleCanvas.width = 2;
      sampleCanvas.height = 2;
      sparkleSampleContextRef.current = sampleCanvas.getContext("2d", {
        willReadFrequently: true,
      });
    }

    const sampleContext = sparkleSampleContextRef.current;
    if (!sampleContext) return;
    [
      [0.885, 0.797],
      [0.928, 0.797],
      [0.885, 0.869],
      [0.928, 0.869],
    ].forEach(([x, y], index) => {
      sampleContext.drawImage(
        img,
        img.naturalWidth * x,
        img.naturalHeight * y,
        1,
        1,
        index % 2,
        Math.floor(index / 2),
        1,
        1
      );
    });
    const sampleData = sampleContext.getImageData(0, 0, 2, 2).data;
    const backdropColor = [0, 1, 2].map((channel) =>
      Math.round(
        (sampleData[channel] +
          sampleData[channel + 4] +
          sampleData[channel + 8] +
          sampleData[channel + 12]) /
          4
      )
    );

    // Replace the fixed corner sparkle with a neighboring patch, clipped to its silhouette.
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(markCenterX, markY);
    ctx.lineTo(markCenterX + markWidth * 0.32, markCenterY - markHeight * 0.09);
    ctx.lineTo(markX + markWidth, markCenterY);
    ctx.lineTo(markCenterX + markWidth * 0.32, markCenterY + markHeight * 0.09);
    ctx.lineTo(markCenterX, markY + markHeight);
    ctx.lineTo(markCenterX - markWidth * 0.32, markCenterY + markHeight * 0.09);
    ctx.lineTo(markX, markCenterY);
    ctx.lineTo(markCenterX - markWidth * 0.32, markCenterY - markHeight * 0.09);
    ctx.closePath();
    ctx.clip();
    ctx.fillStyle = `rgb(${backdropColor.join(",")})`;
    ctx.fill();
    ctx.restore();
  };

  // Robust, non-blocking image preloader
  useEffect(() => {
    let active = true;
    const imgs: HTMLImageElement[] = new Array(totalFrames);
    let count = 0;
    let completed = 0;
    let failed = 0;
    const settledFrames = new Set<number>();
    const listeners: Array<{
      img: HTMLImageElement;
      onLoad: () => void;
      onError: () => void;
    }> = [];

    const settleFrame = (i: number, img: HTMLImageElement) => {
      if (!active || settledFrames.has(i)) return;
      settledFrames.add(i);
      completed++;
      setCompletedCount(completed);

      if (img.naturalWidth > 0) {
        count++;
        if (i === 0 || count >= Math.min(5, totalFrames)) {
          setIsLoaded(true);
        }
        if (Math.round(currentFrameRef.current) === i) {
          renderFrame(i);
        } else {
          renderFrame(currentFrameRef.current);
        }
      } else {
        failed++;
        setFailedCount(failed);
      }
    };

    for (let i = 0; i < totalFrames; i++) {
      const path = getFramePath(i);
      const cachedImage = globalImageCache.get(path);
      let img = cachedImage;

      if (!img) {
        img = new Image();
        globalImageCache.set(path, img);
      }

      imgs[i] = img;

      if (cachedImage && img.complete) {
        settleFrame(i, img);
      } else {
        const onLoad = () => settleFrame(i, img);
        const onError = () => settleFrame(i, img);
        img.addEventListener("load", onLoad, { once: true });
        img.addEventListener("error", onError, { once: true });
        listeners.push({ img, onLoad, onError });
        if (!img.src) img.src = path;
      }
    }

    imagesArrayRef.current = imgs;
    setCompletedCount(completed);
    setFailedCount(failed);

    if (count > 0) {
      setIsLoaded(true);
      renderFrame(currentFrameRef.current);
    }

    return () => {
      active = false;
      listeners.forEach(({ img, onLoad, onError }) => {
        img.removeEventListener("load", onLoad);
        img.removeEventListener("error", onError);
      });
    };
  }, [type, totalFrames, getFramePath, renderFrame]);

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      renderFrame(currentFrameRef.current);
    };

    resizeCanvas();
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(resizeCanvas) : null;
    if (resizeObserver && containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    window.addEventListener("resize", resizeCanvas);
    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [renderFrame]);

  useEffect(() => {
    if (isLoaded) {
      renderFrame(currentFrameRef.current);
    }
  }, [isLoaded, renderFrame]);

  useEffect(() => {
    if (progress !== undefined && !isPlaying) {
      const targetIdx = Math.min(
        endFrame,
        Math.max(startFrame, Math.round(startFrame + progress * (endFrame - startFrame)))
      );
      targetFrameRef.current = targetIdx;
      if (!smoothLerp) {
        currentFrameRef.current = targetIdx;
        setCurrentFrameIndex(targetIdx);
        renderFrame(targetIdx);
      }
    }
  }, [progress, isPlaying, smoothLerp, startFrame, endFrame, renderFrame]);

  useEffect(() => {
    let animId: number;

    const tick = () => {
      if (!isPlaying && smoothLerp) {
        const diff = targetFrameRef.current - currentFrameRef.current;
        if (Math.abs(diff) > 0.05) {
          // Advance one frame at a time so wheel/touchpad bursts don't skip images.
          currentFrameRef.current += Math.sign(diff) * Math.min(Math.abs(diff), 1);
          const rounded = Math.round(currentFrameRef.current);
          setCurrentFrameIndex(rounded);
          renderFrame(rounded);
        } else if (currentFrameRef.current !== targetFrameRef.current) {
          currentFrameRef.current = targetFrameRef.current;
          const rounded = Math.round(currentFrameRef.current);
          setCurrentFrameIndex(rounded);
          renderFrame(rounded);
        }
      }
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, smoothLerp, renderFrame]);

  useEffect(() => {
    lastTimeRef.current = 0;
    if (!isPlaying) {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      return;
    }

    const fps = 30;
    const interval = 1000 / fps;

    const loop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const delta = timestamp - lastTimeRef.current;

      if (delta >= interval) {
        lastTimeRef.current = timestamp - (delta % interval);
        const rel = (currentFrameRef.current - startFrame + 1) % totalSequenceFrames;
        currentFrameRef.current = startFrame + rel;
        targetFrameRef.current = currentFrameRef.current;
        const next = Math.round(currentFrameRef.current);
        setCurrentFrameIndex(next);
        renderFrame(next);
        if (onProgressChange) onProgressChange(rel / (totalSequenceFrames - 1));
      }

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isPlaying, startFrame, totalSequenceFrames, renderFrame, onProgressChange]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableMouseTilt || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setMouseTilt({ x: x * 8, y: -y * 8 }); // Max 8 degrees tilt
  };

  const handleMouseLeave = () => {
    setMouseTilt({ x: 0, y: 0 });
  };

  const loadPercent = Math.min(100, Math.round((completedCount / totalFrames) * 100));
  const sliderProgress =
    totalSequenceFrames > 1
      ? ((currentFrameIndex - startFrame) / (totalSequenceFrames - 1)) * 100
      : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full h-full flex items-center justify-center select-none overflow-hidden bg-[#050505] ${className}`}
      style={{
        perspective: "1200px",
      }}
    >
      {(failedCount > 0 || !isLoaded) && (
        <div
          role={failedCount > 0 ? "status" : undefined}
          className="absolute top-20 z-30 px-3.5 py-1.5 rounded-full glass-panel-elevated flex items-center gap-2 text-cyan-400 text-xs font-mono"
        >
          <Sparkles className={`w-3.5 h-3.5 ${!isLoaded ? "animate-spin" : ""}`} />
          <span>
            {failedCount > 0
              ? `${failedCount} frame${failedCount === 1 ? "" : "s"} unavailable`
              : `Loading frames (${loadPercent}%)`}
          </span>
        </div>
      )}

      {/* Main High-DPI Canvas with 3D Tilt */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-200 ease-out"
        style={{
          transform: `rotateY(${mouseTilt.x}deg) rotateX(${mouseTilt.y}deg)`,
        }}
      >
        <svg aria-hidden="true" className="absolute h-0 w-0 overflow-hidden">
          <filter
            id={sharpenFilterId}
            x="-5%"
            y="-5%"
            width="110%"
            height="110%"
            colorInterpolationFilters="sRGB"
          >
            <feConvolveMatrix
              order="3"
              kernelMatrix="0 -0.12 0 -0.12 1.48 -0.12 0 -0.12 0"
              preserveAlpha="true"
            />
          </filter>
        </svg>
        <canvas
          ref={canvasRef}
          className="w-full h-full pointer-events-none block"
          style={{ filter: `url(#${sharpenFilterId})` }}
        />
      </div>

      {showControls && (
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3.5 px-4 sm:px-5 h-14 rounded-full bg-[#23252a]/95 backdrop-blur-xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.85)] max-w-[92vw] sm:max-w-[860px] w-full">
          <button
            type="button"
            onClick={() => setIsPlaying((playing) => !playing)}
            className="w-8 h-8 rounded-full bg-[#242833] hover:bg-[#383d49] flex items-center justify-center text-white transition-all duration-200 flex-shrink-0 shadow-sm group"
            aria-label={isPlaying ? "Pause rotation" : "Play rotation"}
          >
            {isPlaying ? (
              <Pause className="w-3.5 h-3.5 fill-white text-white" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5 group-hover:scale-105 transition-transform" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              currentFrameRef.current = startFrame;
              targetFrameRef.current = startFrame;
              setCurrentFrameIndex(startFrame);
              renderFrame(startFrame);
              lastTimeRef.current = 0;
              if (onProgressChange) onProgressChange(0);
            }}
            className="w-8 h-8 rounded-full bg-[#242833] hover:bg-[#383d49] flex items-center justify-center text-[#a0a5af] hover:text-white transition-colors flex-shrink-0"
            aria-label="Reset to frame 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="flex-1 flex items-center relative py-1">
            <input
              type="range"
              min="0"
              max={totalSequenceFrames - 1}
              value={Math.max(0, currentFrameIndex - startFrame)}
              onChange={(e) => {
                const offset = parseInt(e.target.value, 10);
                const actualFrame = startFrame + offset;
                setIsPlaying(false);
                lastTimeRef.current = 0;
                currentFrameRef.current = actualFrame;
                targetFrameRef.current = actualFrame;
                setCurrentFrameIndex(actualFrame);
                renderFrame(actualFrame);
                if (onProgressChange) onProgressChange(offset / (totalSequenceFrames - 1));
              }}
              className="custom-scrubber w-full"
              style={{
                background: `linear-gradient(to right, #00d6ff ${sliderProgress}%, #34373d ${sliderProgress}%)`,
              }}
              aria-label="Scrub through product 3D rotation and explosion"
            />
          </div>

          <span className="text-[13px] font-mono text-[#a0a5af] tracking-wider flex-shrink-0 select-none font-medium">
            {String(currentFrameIndex + 1).padStart(3, "0")} / {String(totalFrames).padStart(3, "0")}
          </span>
        </div>
      )}
    </div>
  );
}
