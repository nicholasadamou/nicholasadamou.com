#!/usr/bin/env node

/**
 * Compress oversized images in public/ using sharp.
 * - Resizes to max 2400px on the longest edge (preserves aspect ratio)
 * - JPEG quality 80, PNG compression level 9
 * - Overwrites originals in-place
 * - Only processes files > 500 KB
 */

import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const PUBLIC_DIR = path.resolve(process.cwd(), "public/images");
const MAX_DIMENSION = 2400;
const JPEG_QUALITY = 80;
const MIN_SIZE_BYTES = 500 * 1024; // 500 KB

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(full)));
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      files.push(full);
    }
  }
  return files;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

async function main() {
  const files = await walk(PUBLIC_DIR);
  let totalBefore = 0;
  let totalAfter = 0;
  let processed = 0;

  for (const file of files) {
    const info = await stat(file);
    if (info.size < MIN_SIZE_BYTES) continue;

    const sizeBefore = info.size;
    totalBefore += sizeBefore;

    const ext = path.extname(file).toLowerCase();
    const image = sharp(file);
    const metadata = await image.metadata();

    const needsResize =
      (metadata.width && metadata.width > MAX_DIMENSION) ||
      (metadata.height && metadata.height > MAX_DIMENSION);

    let pipeline = sharp(file);

    if (needsResize) {
      pipeline = pipeline.resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    if (ext === ".png") {
      pipeline = pipeline.png({ compressionLevel: 9 });
    } else {
      pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
    }

    const buffer = await pipeline.toBuffer();
    // Only write if we actually reduced size
    if (buffer.length < sizeBefore) {
      const { writeFile } = await import("node:fs/promises");
      await writeFile(file, buffer);
      totalAfter += buffer.length;
      processed++;
      const pct = ((1 - buffer.length / sizeBefore) * 100).toFixed(0);
      console.log(
        `  ${path.relative(PUBLIC_DIR, file)}: ${formatBytes(sizeBefore)} → ${formatBytes(buffer.length)} (-${pct}%)`
      );
    } else {
      totalAfter += sizeBefore;
      console.log(
        `  ${path.relative(PUBLIC_DIR, file)}: ${formatBytes(sizeBefore)} (already optimal)`
      );
    }
  }

  console.log(
    `\n✓ Processed ${processed} images: ${formatBytes(totalBefore)} → ${formatBytes(totalAfter)} (-${((1 - totalAfter / totalBefore) * 100).toFixed(0)}%)`
  );
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
