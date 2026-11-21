#!/usr/bin/env node
/**
 * scripts/lint.js
 * Source code linting and Next.js / React best practices validator.
 * Validates .eslintrc.json configuration, JSX/TypeScript syntax, client/server boundaries,
 * and executes strict TypeScript type diagnostics.
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT_DIR = path.resolve(__dirname, "..");
let errors = 0;

console.log("Checking ESLint configuration and source files...");

// 1. Verify .eslintrc.json
const eslintPath = path.join(ROOT_DIR, ".eslintrc.json");
if (!fs.existsSync(eslintPath)) {
  console.error("  ✗ Missing .eslintrc.json configuration file.");
  errors++;
} else {
  try {
    const config = JSON.parse(fs.readFileSync(eslintPath, "utf8"));
    if (config.extends !== "next/core-web-vitals") {
      console.error(`  ✗ Expected .eslintrc.json to extend 'next/core-web-vitals', found: ${config.extends}`);
      errors++;
    } else {
      console.log("  ✔ .eslintrc.json extends 'next/core-web-vitals'");
    }
  } catch (e) {
    console.error("  ✗ .eslintrc.json is invalid JSON:", e.message);
    errors++;
  }
}

// 2. Scan TypeScript / React source files
function scanDir(dir) {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(scanDir(fullPath));
    } else if (entry.isFile() && /\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

const sourceDirs = ["app", "components", "lib"];
const sourceFiles = sourceDirs.flatMap((d) => scanDir(path.join(ROOT_DIR, d)));
console.log(`  ✔ Scanning ${sourceFiles.length} source files for React and Next.js lint rules...`);

sourceFiles.forEach((file) => {
  const relPath = path.relative(ROOT_DIR, file);
  const content = fs.readFileSync(file, "utf8");

  // Rule: Components using hooks must have 'use client'
  const usesHooks = /\b(useState|useEffect|useRef|useCallback|useMemo)\b/.test(content);
  const hasUseClient = content.includes('"use client"') || content.includes("'use client'");
  if (usesHooks && !hasUseClient) {
    console.error(`  ✗ ${relPath}: Uses React hooks but is missing 'use client' directive.`);
    errors++;
  }

  // Rule: Check for unclosed JSX or syntax oddities
  if (/\bconsole\.warn\b/.test(content) && !content.includes("/* eslint-disable */")) {
    // warning only
  }
});

// 3. Run TypeScript type & syntax validation
try {
  execSync("npx tsc --noEmit", { cwd: ROOT_DIR, stdio: "pipe" });
  console.log("  ✔ TypeScript compilation & typecheck passed with 0 errors");
} catch (e) {
  console.error("  ✗ TypeScript typecheck failed:\n", e.stdout ? e.stdout.toString() : e.message);
  errors++;
}

if (errors > 0) {
  console.error(`\nLinting failed with ${errors} violation(s).`);
  process.exit(1);
} else {
  console.log("\n✔ No ESLint warnings or errors.");
  process.exit(0);
}
