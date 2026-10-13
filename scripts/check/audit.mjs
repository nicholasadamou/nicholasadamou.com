import { spawnSync } from "node:child_process";

// Tooling-only dependency; no upstream fix. Review by this date rather than
// allowing a permanent exception. See docs/src/contributing/quality-and-releases.md.
const reviewDate = new Date("2026-11-13T00:00:00Z");
if (new Date() >= reviewDate) {
  throw new Error(
    "Review the braces CVE-2026-93687 exception before running the audit."
  );
}
console.log(
  "Temporary tooling exception: CVE-2026-93687; review by 2026-11-13."
);
const result = spawnSync(
  "bun",
  ["audit", "--audit-level=high", "--ignore=GHSA-vfj7-8cjw-p6xm"],
  { stdio: "inherit" }
);
if (result.error) throw result.error;
process.exit(result.status ?? 1);
