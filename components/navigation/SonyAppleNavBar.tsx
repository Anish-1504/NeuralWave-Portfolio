"use client";

import { GlobalNavbar } from "./GlobalNavbar";
import type { ProductMode } from "./ProductToggleSwitch";

interface SonyAppleNavBarProps {
  activeMode?: ProductMode;
  onToggleMode?: (mode: ProductMode) => void;
}

export function SonyAppleNavBar({
  activeMode = "headphones",
  onToggleMode,
}: SonyAppleNavBarProps) {
  return <GlobalNavbar activeMode={activeMode} onToggleMode={onToggleMode} />;
}
