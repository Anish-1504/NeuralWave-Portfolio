"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, X, Sparkles } from "lucide-react";
import { ProductToggleSwitch } from "./ProductToggleSwitch";
import type { ProductMode } from "./ProductToggleSwitch";

interface GlobalNavbarProps {
  activeMode?: ProductMode;
  onToggleMode?: (mode: ProductMode) => void;
}

export function GlobalNavbar({
  activeMode = "headphones",
  onToggleMode,
}: GlobalNavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isOverviewPage = pathname === "/overview";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isWatchPage = pathname.includes("pulse-one");
  const isHeadphonesPage = pathname.includes("halo-studio");
  const computedMode: ProductMode = isWatchPage
    ? "watch"
    : isHeadphonesPage
      ? "headphones"
      : activeMode;
  const handleSwitchMode = (mode: ProductMode) => {
    onToggleMode?.(mode);

    if (mode === "headphones" && !isHeadphonesPage && pathname !== "/") {
      router.push("/products/halo-studio");
    } else if (mode === "watch" && !isWatchPage && pathname !== "/") {
      router.push("/products/pulse-one");
    }
  };

  const navLinks = [
    { name: "Overview", href: "/overview" },
    { name: "Halo Studio", href: "/products/halo-studio" },
    { name: "Pulse One", href: "/products/pulse-one" },
  ];

  return (
    <header className="fixed inset-x-0 top-3 z-50 px-3 sm:top-4 sm:px-5">
      <div
        className={`relative mx-auto max-w-7xl rounded-2xl border border-white/[0.12] backdrop-blur-2xl transition-all duration-300 ${
          scrolled
            ? "bg-[#07090d]/95 py-1 shadow-[0_16px_50px_rgba(0,0,0,0.65)]"
            : "bg-[#080a0e]/78 py-1.5 shadow-[0_10px_36px_rgba(0,0,0,0.4)]"
        }`}
      >
        <div className="flex items-center justify-between gap-2 px-3 sm:gap-4 sm:px-4">
          <Link href="/" className="flex min-w-0 items-center gap-2.5 group">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-300/30 bg-gradient-to-br from-cyan-300/15 to-blue-500/10 text-cyan-200 shadow-[inset_0_0_18px_rgba(0,214,255,0.12)] transition-transform duration-300 group-hover:scale-105">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="flex min-w-0 flex-col leading-none">
              <span className="text-[11px] font-bold tracking-[0.18em] text-white">
                Neural<span className="text-cyan-300">Waves</span>
              </span>
              <span className="mt-1 text-[8px] font-mono tracking-[0.2em] text-white/40">
                SOUND · MOTION · SENSING
              </span>
            </span>
          </Link>

          {!isOverviewPage && (
            <div className="hidden min-w-0 flex-1 justify-center px-2 md:flex">
              <ProductToggleSwitch
                size="sm"
                activeMode={computedMode}
                onToggle={handleSwitchMode}
              />
            </div>
          )}

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-white/70 transition-colors hover:border-white/25 hover:bg-white/10 hover:text-white"
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={menuOpen}
              aria-controls="global-navigation-menu"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            id="global-navigation-menu"
            className="absolute right-0 top-full mt-2 w-[min(22rem,calc(100vw-1.5rem))] rounded-2xl border border-white/10 bg-[#080a0e]/95 p-3 shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl"
          >
            {!isOverviewPage && (
              <div className="mb-3 flex justify-center border-b border-white/10 pb-3 md:hidden">
                <ProductToggleSwitch
                  size="sm"
                  activeMode={computedMode}
                  onToggle={(mode) => {
                    handleSwitchMode(mode);
                    setMenuOpen(false);
                  }}
                />
              </div>
            )}
            <nav aria-label="Main navigation" className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  aria-current={pathname === link.href ? "page" : undefined}
                  className={`rounded-xl px-3.5 py-3 text-xs font-medium transition-colors ${
                    pathname === link.href
                      ? "bg-white/[0.08] text-white"
                      : "text-white/60 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
