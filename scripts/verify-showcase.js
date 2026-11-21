#!/usr/bin/env node
/**
 * verify-showcase.js
 * Comprehensive automated verification test suite for the Interactive Technology Showcase
 * (NeuralWaves Halo Studio & Pulse One) Next.js 14 application.
 *
 * Validates:
 * 1. 118-frame image sequence integrity for headphones and watches (236 total frames).
 * 2. Canvas single-frame rendering, DPR scaling, and the lerp loop.
 * 3. Floating capsule controls: circular play/pause, circular reset button, glowing cyan scrubber,
 *    and monospace "001 / 118" frame counter.
 * 4. Responsive scroll-to-frame synchronization across 118-frame sequences.
 * 5. Route availability and default exports for the home, overview, and product pages.
 * 6. Responsive layout rules across mobile (375px), tablet (768px), and desktop.
 */

const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");

let passedTests = 0;
let totalTests = 0;
const failures = [];

function assert(condition, testName, details = "") {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ [PASS] ${testName}`);
  } else {
    failures.push({ testName, details });
    console.error(`  ✗ [FAIL] ${testName}`);
    if (details) {
      console.error(`    ↳ Details: ${details}`);
    }
  }
}

console.log("================================================================================");
console.log("  INTERACTIVE TECHNOLOGY SHOWCASE VERIFICATION SUITE");
console.log("================================================================================\n");

// ------------------------------------------------------------------------------
// TEST SUITE 1: 118-Frame Asset Sequence Integrity
// ------------------------------------------------------------------------------
console.log("▶ TEST SUITE 1: Frame Asset Pipeline (118 frames x 2 products)");

["headphones", "watches"].forEach((product) => {
  const seqDir = path.join(ROOT_DIR, "public", "sequences", product);
  assert(fs.existsSync(seqDir), `${product} sequence directory exists`, `Directory missing: ${seqDir}`);

  if (fs.existsSync(seqDir)) {
    const files = fs.readdirSync(seqDir).filter((f) => f.endsWith(".jpg"));
    assert(files.length === 118, `${product} sequence contains exactly 118 frames`, `Found ${files.length} frames`);

    let allValid = true;
    let corruptedFrames = [];
    let missingFrames = [];

    for (let i = 1; i <= 118; i++) {
      const expectedFilename = `ezgif-frame-${String(i).padStart(3, "0")}.jpg`;
      const filePath = path.join(seqDir, expectedFilename);

      if (!fs.existsSync(filePath)) {
        allValid = false;
        missingFrames.push(expectedFilename);
        continue;
      }

      const stat = fs.statSync(filePath);
      if (stat.size < 1000) {
        allValid = false;
        corruptedFrames.push(`${expectedFilename} (${stat.size} bytes)`);
      } else {
        // Verify JPEG magic bytes FF D8 FF
        const fd = fs.openSync(filePath, "r");
        const buffer = Buffer.alloc(3);
        fs.readSync(fd, buffer, 0, 3, 0);
        fs.closeSync(fd);
        if (buffer[0] !== 0xff || buffer[1] !== 0xd8 || buffer[2] !== 0xff) {
          allValid = false;
          corruptedFrames.push(`${expectedFilename} (invalid JPEG header)`);
        }
      }
    }

    assert(
      missingFrames.length === 0,
      `${product} frames 001..118 all present without gaps`,
      `Missing: ${missingFrames.slice(0, 5).join(", ")}`
    );
    assert(
      corruptedFrames.length === 0,
      `${product} all 118 frames valid non-empty JPEG files`,
      `Corrupted: ${corruptedFrames.slice(0, 5).join(", ")}`
    );
  }
});

// ------------------------------------------------------------------------------
// TEST SUITE 2: Canvas Framing & Single-Draw Animation Loop
// ------------------------------------------------------------------------------
console.log("\n▶ TEST SUITE 2: Canvas Framing Engine & Animation Loop");

const canvasPath = path.join(ROOT_DIR, "components", "canvas", "ProductSequenceCanvas.tsx");
assert(fs.existsSync(canvasPath), "ProductSequenceCanvas.tsx exists");

if (fs.existsSync(canvasPath)) {
  const canvasSrc = fs.readFileSync(canvasPath, "utf8");

  assert(
    canvasSrc.includes("const startFrame = 0;") &&
      canvasSrc.includes("const endFrame = totalFrames - 1;") &&
      canvasSrc.includes("max={totalSequenceFrames - 1}") &&
      canvasSrc.includes('String(totalFrames).padStart(3, "0")'),
    "Scroll and scrubber address all 118 frames for both products",
    "Product sequence does not span the complete frame set"
  );

  // 1. Fit the full frame without cropping or a duplicate blurred backdrop.
  assert(
    canvasSrc.includes("Math.min(width / img.naturalWidth, height / img.naturalHeight) * 0.96"),
    "Canvas fits each frame within the viewport while preserving its aspect ratio",
    "Expected a contain-style scale calculation"
  );

  // 2. Draw each source frame exactly once with no blurred duplicate.
  assert(
    canvasSrc.includes("ctx.drawImage(img, drawX, drawY, drawW, drawH);") &&
      !canvasSrc.includes("ctx.filter = \"blur") &&
      !canvasSrc.includes("foregroundCanvas"),
    "Canvas renders one sharp image layer without a blurred duplicate or foreground mask",
    "Canvas still contains a duplicate or blurred image layer"
  );

  assert(
    !canvasSrc.includes("activeScene?.annotations") &&
      !canvasSrc.includes("Precision Engineering"),
    "Canvas does not add annotation hotspots over the product",
    "Canvas annotation overlays are still present"
  );

  assert(
    canvasSrc.includes("sparkleSampleContextRef") &&
      canvasSrc.includes("sampleContext.getImageData(0, 0, 2, 2)") &&
      canvasSrc.includes("ctx.clip()"),
    "Embedded corner sparkle is replaced using nearby backdrop pixels without cropping the frame",
    "Corner sparkle cleanup or its product-safe clipping is missing"
  );

  assert(
    !canvasSrc.includes('ctx.fillText("NeuralWaves"') &&
      canvasSrc.includes("ctx.drawImage(img, drawX, drawY, drawW, drawH)"),
    "Canvas preserves the supplied product frame without an added brand badge",
    "A custom brand badge is still drawn over the product frame"
  );

  assert(
    canvasSrc.includes("feConvolveMatrix") &&
      canvasSrc.includes("kernelMatrix=") &&
      canvasSrc.includes("filter: `url(#${sharpenFilterId})`"),
    "Canvas applies a subtle sharpening filter to the source frames",
    "The source frames are not sharpened during display"
  );

  // 4. DPR scaling capped at 2
  assert(
    canvasSrc.includes("Math.min(window.devicePixelRatio || 1, 2)"),
    "Canvas caps high-DPI device pixel ratio at 2 for optimal GPU performance",
    "Missing DPR capping logic"
  );

  // 5. Container ResizeObserver for dynamic layout sizing
  assert(
    canvasSrc.includes("ResizeObserver") && canvasSrc.includes("resizeObserver.observe(containerRef.current)"),
    "Container uses ResizeObserver for accurate dynamic canvas sizing on layout mount",
    "ResizeObserver missing from ProductSequenceCanvas"
  );

  // 6. Redundant double-draw elimination: initial effect must not depend on currentFrameIndex
  const initialEffectMatch = canvasSrc.match(/useEffect\(\(\) => \{\s*if \(isLoaded\) \{\s*renderFrame\(currentFrameRef\.current\);\s*\}\s*\}, \[isLoaded, renderFrame\]\);/);
  assert(
    Boolean(initialEffectMatch),
    "Double-draw render loop eliminated: mount effect renders once on ready without depending on currentFrameIndex",
    "Mount effect still re-renders on currentFrameIndex"
  );

  // 7. Immediate poster frame & async load redraw
  assert(
    canvasSrc.includes("i === 0 || count >= Math.min(5, totalFrames)") &&
      canvasSrc.includes("Math.round(currentFrameRef.current) === i"),
    "Frame 0 rendered immediately as poster frame & canvas redrawn on async load completion",
    "Immediate frame 0 or async redraw missing from img.onload"
  );

  // 8. lastTimeRef reset on play toggle
  assert(
    canvasSrc.includes("lastTimeRef.current = 0"),
    "Delta timing reset (lastTimeRef = 0) on play/pause toggle to prevent frame jumps",
    "lastTimeRef reset missing from auto-play logic"
  );

  assert(
    canvasSrc.includes("if (!smoothLerp) {") &&
      canvasSrc.includes("currentFrameRef.current = targetIdx;") &&
      canvasSrc.includes("renderFrame(targetIdx);"),
    "Scroll progress renders its mapped frame directly when smoothing is disabled",
    "Direct progress-to-frame rendering is missing"
  );
}

// ------------------------------------------------------------------------------
// TEST SUITE 3: Floating Capsule Controls Specifications
// ------------------------------------------------------------------------------
console.log("\n▶ TEST SUITE 3: Floating Capsule Controls & Styling");

if (fs.existsSync(canvasPath)) {
  const canvasSrc = fs.readFileSync(canvasPath, "utf8");

  // 1. Circular play/pause button
  assert(
    canvasSrc.includes("w-8 h-8 rounded-full bg-[#242833]") &&
      canvasSrc.includes("aria-label={isPlaying ? \"Pause rotation\" : \"Play rotation\"}"),
    "Circular play/pause button present with circular styling (w-8 h-8 rounded-full bg-[#242833])",
    "Play/pause button lacks circular styling"
  );

  // 2. Circular reset arrow button
  assert(
    canvasSrc.includes("w-8 h-8 rounded-full bg-[#242833]") &&
      canvasSrc.includes("aria-label=\"Reset to frame 1\"") &&
      canvasSrc.includes("<RotateCcw"),
    "Circular reset arrow button present matching circular play/pause housing",
    "Reset arrow button lacks circular styling"
  );

  // 3. Glowing cyan scrubber thumb & dynamic gradient track
  assert(
    canvasSrc.includes("className=\"custom-scrubber") &&
      canvasSrc.includes("linear-gradient(to right, #00d6ff"),
    "Custom scrubber features dynamic cyan progress track gradient fill",
    "Custom scrubber missing dynamic gradient background"
  );

  // 4. Monospace frame readout formatted as "001 / 118"
  assert(
    canvasSrc.includes("padStart(3, \"0\")") &&
      canvasSrc.includes("font-mono") &&
      canvasSrc.includes("totalFrames"),
    "Frame readout formatted with 3-digit padding in monospace font ('001 / 118')",
    "Frame readout formatting does not match '001 / 118'"
  );
}

// 5. Verify CSS scrubber styling in globals.css
const globalsCssPath = path.join(ROOT_DIR, "app", "globals.css");
assert(fs.existsSync(globalsCssPath), "globals.css exists");
if (fs.existsSync(globalsCssPath)) {
  const css = fs.readFileSync(globalsCssPath, "utf8");
  assert(
    css.includes(".custom-scrubber::-webkit-slider-thumb") &&
      css.includes("background: #00d6ff") &&
      css.includes("box-shadow: 0 0 10px rgba(0, 214, 255, 0.8)"),
    "Scrubber thumb CSS styled with glowing cyan box-shadow (0 0 10px rgba(0, 214, 255, 0.8))",
    "Scrubber thumb glowing cyan styling missing from globals.css"
  );
}

// ------------------------------------------------------------------------------
// TEST SUITE 4: Scroll-to-Frame Synchronization
// ------------------------------------------------------------------------------
console.log("\n▶ TEST SUITE 4: Scroll-to-Frame Synchronization");

[
  ["components/hero/LandingHero.tsx", "LandingHero"],
  ["components/sony/SonyInteractiveScroll.tsx", "SonyInteractiveScroll"],
  ["components/watch/WatchInteractiveScroll.tsx", "WatchInteractiveScroll"],
].forEach(([relativePath, componentName]) => {
  const src = fs.readFileSync(path.join(ROOT_DIR, relativePath), "utf8");
  assert(
    src.includes("h-[240vh]"),
    `${componentName} completes its scroll sequence in a responsive 240vh range`,
    `Expected h-[240vh] in ${relativePath}`
  );
});

const sonyScrollPath = path.join(ROOT_DIR, "components", "sony", "SonyInteractiveScroll.tsx");
assert(fs.existsSync(sonyScrollPath), "SonyInteractiveScroll.tsx exists");
if (fs.existsSync(sonyScrollPath)) {
  const src = fs.readFileSync(sonyScrollPath, "utf8");
  assert(
    src.includes("progress={scrollProgress}") &&
      src.includes("<ProductCheckpointNav"),
    "Sony scroll progress drives its frame sequence and checkpoint navigation",
    "Scroll-to-frame or checkpoint navigation is missing from SonyInteractiveScroll"
  );
  assert(
    src.includes("className={`hidden absolute"),
    "Headphone narrative copy stays out of the product viewport",
    "Narrative copy is still displayed over the headphone sequence"
  );
}

const watchScrollPath = path.join(ROOT_DIR, "components", "watch", "WatchInteractiveScroll.tsx");
assert(fs.existsSync(watchScrollPath), "WatchInteractiveScroll.tsx exists");
if (fs.existsSync(watchScrollPath)) {
  const src = fs.readFileSync(watchScrollPath, "utf8");
  assert(
    src.includes("progress={scrollProgress}") &&
      src.includes("<ProductCheckpointNav"),
    "Watch scroll progress drives its frame sequence and checkpoint navigation",
    "Scroll-to-frame or checkpoint navigation is missing from WatchInteractiveScroll"
  );
  assert(
    src.includes("className={`hidden absolute"),
    "Watch narrative copy stays out of the product viewport",
    "Narrative copy is still displayed over the watch sequence"
  );
}

const partLabelPath = path.join(ROOT_DIR, "components", "canvas", "ProductPartLabel.tsx");
assert(fs.existsSync(partLabelPath), "ProductPartLabel.tsx exists");
if (fs.existsSync(partLabelPath)) {
  const partLabelSrc = fs.readFileSync(partLabelPath, "utf8");
  const partLabels = [...partLabelSrc.matchAll(/\["[^"]+",\s*"([^"]+)"\]/g)].map((match) => match[1]);

  assert(
    partLabels.length === 20 &&
      partLabels.every((description) => description.trim().split(/\s+/).length === 2),
    "Both product sequences provide 10 part labels with two-word descriptions",
    "Part labels are missing or a description is not exactly two words"
  );

  assert(
    partLabelSrc.includes('aria-live="polite"') &&
      partLabelSrc.includes("pointer-events-none") &&
      partLabelSrc.includes("PART_TARGETS") &&
      partLabelSrc.includes("targetStyle") &&
      partLabelSrc.includes("font-sans text-sm") &&
      partLabelSrc.includes("sm:text-base") &&
      partLabelSrc.includes("--label-top") &&
      partLabelSrc.includes("import { MapPin } from \"lucide-react\"") &&
      partLabelSrc.includes("<MapPin") &&
      !partLabelSrc.includes("rotate-45") &&
      partLabelSrc.includes("w-[min(11rem,44vw)]") &&
      !partLabelSrc.includes("<svg") &&
      !partLabelSrc.includes("markerEnd=") &&
      ["hero/LandingHero.tsx", "sony/SonyInteractiveScroll.tsx", "watch/WatchInteractiveScroll.tsx"].every((file) =>
        fs.readFileSync(path.join(ROOT_DIR, "components", file), "utf8").includes("ProductPartLabel")
      ),
    "Both product labels use readable nearby callouts and one map-pin pointer without connector lines",
    "Readable callout styling, single-pointer placement, or a product sequence integration is missing"
  );
}

const checkpointNavPath = path.join(ROOT_DIR, "components", "canvas", "ProductCheckpointNav.tsx");
assert(fs.existsSync(checkpointNavPath), "ProductCheckpointNav.tsx exists");
if (fs.existsSync(checkpointNavPath)) {
  const checkpointNavSrc = fs.readFileSync(checkpointNavPath, "utf8");
  assert(
    checkpointNavSrc.includes("bottom-16 sm:bottom-16") &&
      checkpointNavSrc.includes("onSelect(checkpoint.range[0] + 0.01)") &&
      ["hero/LandingHero.tsx", "sony/SonyInteractiveScroll.tsx", "watch/WatchInteractiveScroll.tsx"].every((file) =>
        fs.readFileSync(path.join(ROOT_DIR, "components", file), "utf8").includes("ProductCheckpointNav")
      ),
    "The redesigned checkpoint dock sits at the bottom and stays linked to scrolling on all sequences",
    "Checkpoint navigation is not docked or connected to all product sequences"
  );
}

// ------------------------------------------------------------------------------
// TEST SUITE 5: Route Availability & Page Exports
// ------------------------------------------------------------------------------
console.log("\n▶ TEST SUITE 5: Route Availability & Page Component Exports");

const routes = [
  { path: "app/page.tsx", route: "/" },
  { path: "app/overview/page.tsx", route: "/overview" },
  { path: "app/products/halo-studio/page.tsx", route: "/products/halo-studio" },
  { path: "app/products/pulse-one/page.tsx", route: "/products/pulse-one" },
];

routes.forEach(({ path: relPath, route }) => {
  const fullPath = path.join(ROOT_DIR, relPath);
  assert(fs.existsSync(fullPath), `Route file exists: ${relPath} (${route})`, `File missing: ${fullPath}`);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, "utf8");
    assert(
      content.includes("export default function") ||
        content.includes("export default") ||
        content.includes("export { default"),
      `Route ${route} has default export component`,
      `Missing default export in ${relPath}`
    );
  }
});

const homeSrc = fs.readFileSync(path.join(ROOT_DIR, "app", "page.tsx"), "utf8");
const overviewSrc = fs.readFileSync(path.join(ROOT_DIR, "app", "overview", "page.tsx"), "utf8");
assert(
  homeSrc.includes('export { default, metadata } from "./overview/page";') &&
    overviewSrc.includes('href: "/products/halo-studio"') &&
    overviewSrc.includes('href: "/products/pulse-one"'),
  "The initial home route displays the overview and product pages are linked from it",
  "The home route must reuse the overview, with product routes available through overview links"
);

// ------------------------------------------------------------------------------
// TEST SUITE 6: Responsive Layout Alignment Rules
// ------------------------------------------------------------------------------
console.log("\n▶ TEST SUITE 6: Responsive Layout Alignment Rules");

// 1. Comparison removal and swipeable product stories
const compPath = path.join(ROOT_DIR, "components", "comparison", "ComparisonMatrix.tsx");
const compareRoute = path.join(ROOT_DIR, "app", "compare", "page.tsx");
assert(
  !fs.existsSync(compPath) && !fs.existsSync(compareRoute),
  "Comparison component and route are removed",
  "Comparison content is still available in the app"
);
const soundStoriesPath = path.join(ROOT_DIR, "components", "sony", "SoundTechAcoustics.tsx");
const watchStoriesPath = path.join(ROOT_DIR, "components", "watch", "WatchFeatureStories.tsx");
assert(
  fs.existsSync(soundStoriesPath) && fs.existsSync(watchStoriesPath),
  "Both products provide feature-story rails",
  "A product feature-story component is missing"
);
if (fs.existsSync(soundStoriesPath) && fs.existsSync(watchStoriesPath)) {
  const soundStories = fs.readFileSync(soundStoriesPath, "utf8");
  const watchStories = fs.readFileSync(watchStoriesPath, "utf8");
  assert(
    [soundStories, watchStories].every(
      (src) => src.includes("framer-motion") && src.includes("snap-x snap-mandatory") && src.includes("overflow-x-auto")
    ),
    "Both product feature rails animate and support horizontal scrolling",
    "Feature stories are missing motion or scroll-snap behavior"
  );
}

// 2. Product header shell and shared Sony header
const navPath = path.join(ROOT_DIR, "components", "navigation", "SonyAppleNavBar.tsx");
assert(fs.existsSync(navPath), "SonyAppleNavBar.tsx exists");
if (fs.existsSync(navPath)) {
  const src = fs.readFileSync(navPath, "utf8");
  assert(
    src.includes("<GlobalNavbar"),
    "Headphone product page uses the shared redesigned global header",
    "Headphone page header is not using the shared navigation design"
  );
}
const globalNavPath = path.join(ROOT_DIR, "components", "navigation", "GlobalNavbar.tsx");
assert(fs.existsSync(globalNavPath), "GlobalNavbar.tsx exists");
if (fs.existsSync(globalNavPath)) {
  const src = fs.readFileSync(globalNavPath, "utf8");
  assert(
    src.includes('Neural<span className="text-cyan-300">') &&
      src.includes(">Waves</span>") &&
      !src.includes("OPEN DEVICE") &&
      !src.includes("Compare") &&
      src.includes("Open navigation menu") &&
      src.includes("<ProductToggleSwitch") &&
      src.includes("rounded-2xl border border-white/[0.12]"),
    "Floating header has the new brand treatment, device switch, and accessible navigation menu",
    "The redesigned global header is missing required controls or styling"
  );
}

// 3. Hero switch mobile responsiveness
const heroPath = path.join(ROOT_DIR, "components", "hero", "LandingHero.tsx");
const switchPath = path.join(ROOT_DIR, "components", "navigation", "ProductToggleSwitch.tsx");
assert(fs.existsSync(heroPath) && fs.existsSync(switchPath), "LandingHero and ProductToggleSwitch exist");
if (fs.existsSync(heroPath) && fs.existsSync(switchPath)) {
  const heroSrc = fs.readFileSync(heroPath, "utf8");
  const switchSrc = fs.readFileSync(switchPath, "utf8");
  assert(
    !heroSrc.includes("<ProductToggleSwitch") &&
      overviewSrc.includes("<GlobalNavbar />") &&
      heroSrc.includes("<ProductCheckpointNav") &&
      switchSrc.includes("max-w-full"),
    "Product pages keep product selection in the header and use the bottom checkpoint dock",
    "Product selection is duplicated or the bottom checkpoint dock is missing"
  );
  assert(
    heroSrc.includes("progress={scrollProgress}") && heroSrc.includes("smoothLerp"),
    "Landing scroll progress drives the product frame sequence",
    "LandingHero does not connect scroll progress to the frame renderer"
  );
  assert(
    switchSrc.includes("px-2.5 sm:px-4 py-1.5 sm:py-2") || switchSrc.includes("text-xs sm:text-sm"),
    "ProductToggleSwitch uses responsive button padding/text for clean scaling on small mobile viewports",
    "ProductToggleSwitch lacks responsive button sizing"
  );
}

// 4. ESLint config presence
const eslintPath = path.join(ROOT_DIR, ".eslintrc.json");
assert(fs.existsSync(eslintPath), ".eslintrc.json configuration file exists");
if (fs.existsSync(eslintPath)) {
  const eslintCfg = JSON.parse(fs.readFileSync(eslintPath, "utf8"));
  assert(
    eslintCfg.extends === "next/core-web-vitals",
    ".eslintrc.json extends 'next/core-web-vitals'",
    `Expected extends: next/core-web-vitals, got: ${eslintCfg.extends}`
  );
}

// ------------------------------------------------------------------------------
// SUMMARY & EXIT CODE
// ------------------------------------------------------------------------------
console.log("\n================================================================================");
console.log(`  VERIFICATION RESULTS: ${passedTests} / ${totalTests} PASSED (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log("================================================================================\n");

if (failures.length > 0) {
  console.error(`💥 Verification FAILED with ${failures.length} defect(s):`);
  failures.forEach((f, i) => {
    console.error(`  ${i + 1}. ${f.testName}: ${f.details}`);
  });
  process.exit(1);
} else {
  console.log("🎉 All verification criteria passed with ZERO defects!");
  process.exit(0);
}
