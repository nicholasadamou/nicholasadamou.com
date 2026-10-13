import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const files = execFileSync(
  "git",
  ["ls-files", "--cached", "--others", "--exclude-standard", "src", "scripts"],
  { encoding: "utf8" }
)
  .trim()
  .split("\n")
  .filter((file) => /\.(tsx?|m?js)$/.test(file));
const budget = JSON.parse(readFileSync(".loc-budget.json", "utf8"));
let total = 0;
for (const file of files) {
  const lines = readFileSync(file, "utf8")
    .split("\n")
    .filter((line) => line.trim()).length;
  total += lines;
  const limit = budget.exceptions[file] ?? budget.perFile;
  if (lines > limit)
    throw new Error(
      `${file}: ${lines} nonblank lines exceeds ${limit}. Split responsibilities or simplify.`
    );
}
if (total > budget.total)
  throw new Error(
    `${total} nonblank lines exceeds total budget ${budget.total}.`
  );
console.log(
  `${total}/${budget.total} nonblank source lines; per-file limits passed.`
);
