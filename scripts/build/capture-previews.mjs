#!/usr/bin/env node

/**
 * Capture 1920×1080 screenshots of every project website.
 *
 * Saves PNGs to public/images/projects/previews/{name}.png.
 * Requires Playwright: npx playwright install chromium
 *
 * Usage:
 *   node scripts/build/capture-previews.mjs            # all projects
 *   node scripts/build/capture-previews.mjs prr sluice # specific projects only
 */

import { chromium } from "playwright";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";

const PREVIEWS_DIR = path.resolve(
  process.cwd(),
  "public/images/projects/previews",
);
const CONFIG_PATH = path.resolve(
  process.cwd(),
  "src/lib/projects/config.ts",
);
const WIDTH = 1920;
const HEIGHT = 1080;

/** Parse project entries from the TS config without importing it. */
async function loadProjects() {
  const src = await readFile(CONFIG_PATH, "utf-8");
  const entries = [];
  const re =
    /name:\s*"([^"]+)"[\s\S]*?href:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    entries.push({ name: m[1], href: m[2] });
  }
  return entries;
}

async function main() {
  const only = new Set(process.argv.slice(2));
  let projects = await loadProjects();

  if (only.size > 0) {
    projects = projects.filter((p) => only.has(p.name));
    if (projects.length === 0) {
      console.error("No matching projects found for:", [...only].join(", "));
      process.exit(1);
    }
  }

  await mkdir(PREVIEWS_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: WIDTH, height: HEIGHT },
    deviceScaleFactor: 1,
  });

  console.log(`Capturing ${projects.length} project previews…\n`);

  for (const project of projects) {
    const outFile = path.join(PREVIEWS_DIR, `${project.name}.png`);
    const page = await context.newPage();

    try {
      await page.goto(project.href, {
        waitUntil: "networkidle",
        timeout: 30_000,
      });
      // Give animations/fonts a moment to settle
      await page.waitForTimeout(1500);
      await page.screenshot({ path: outFile, type: "png" });
      console.log(`  ✓ ${project.name} → ${path.relative(process.cwd(), outFile)}`);
    } catch (err) {
      console.error(`  ✗ ${project.name}: ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  console.log("\nDone.");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
