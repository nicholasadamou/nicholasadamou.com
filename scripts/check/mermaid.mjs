import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";

const { window } = new JSDOM("");
globalThis.window = window;
globalThis.document = window.document;
const { default: mermaid } = await import("mermaid");
mermaid.initialize({ startOnLoad: false, securityLevel: "strict" });
const files = execFileSync(
  "git",
  ["ls-files", "--cached", "--others", "--exclude-standard", "*.md"],
  { encoding: "utf8" }
)
  .trim()
  .split("\n");
let count = 0;
for (const file of files) {
  for (const [, diagram] of readFileSync(file, "utf8").matchAll(
    /```mermaid\s*\n([\s\S]*?)```/g
  )) {
    try {
      await mermaid.parse(diagram);
      count++;
    } catch (error) {
      throw new Error(`${file}: ${error.message}`, { cause: error });
    }
  }
}
console.log(`Validated ${count} Mermaid diagrams.`);
