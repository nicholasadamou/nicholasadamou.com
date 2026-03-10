import fs from "fs";
import path from "path";
import type { VscoApiResponse, VscoImage } from "@/types/vsco";

interface VscoExportEntry {
  id: string;
  capture_date: number;
  height: number;
  width: number;
  file_name: string;
  is_video: boolean;
  perma_subdomain: string;
  share_link: string;
  description?: string;
}

const EXPORT_PATH = path.join(process.cwd(), "data", "vsco-export.json");

function readExport(): VscoExportEntry[] | null {
  try {
    if (!fs.existsSync(EXPORT_PATH)) return null;
    return JSON.parse(fs.readFileSync(EXPORT_PATH, "utf-8"));
  } catch {
    return null;
  }
}

export function getLocalVscoImages(
  limit?: number,
  offset?: number
): VscoApiResponse {
  const entries = readExport();

  if (!entries) {
    return {
      images: [],
      hasMore: false,
      totalCount: 0,
      source: "vsco-export",
      error: "No VSCO export found at data/vsco-export.json",
    };
  }

  // Deduplicate by file_name (export can have multiple entries for the same file)
  const seen = new Set<string>();
  const images: VscoImage[] = [];

  for (const entry of entries) {
    if (entry.is_video) continue;
    if (seen.has(entry.file_name)) continue;
    seen.add(entry.file_name);

    images.push({
      id: entry.id,
      url: `/images/vsco/${entry.file_name}`,
      alt: `Photography by ${entry.perma_subdomain}`,
      width: entry.width,
      height: entry.height,
      vsco_url: `https://vsco.co/${entry.perma_subdomain}/media/${entry.id}`,
      upload_date: new Date(entry.capture_date).toISOString(),
    });
  }

  // Sort by capture date (most recent first)
  images.sort((a, b) => {
    if (!a.upload_date || !b.upload_date) return 0;
    return (
      new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime()
    );
  });

  const totalCount = images.length;
  const startIndex = offset || 0;
  const endIndex = limit ? startIndex + limit : images.length;
  const paginatedImages = images.slice(startIndex, endIndex);

  return {
    images: paginatedImages,
    hasMore: endIndex < totalCount,
    totalCount,
    source: "vsco-export",
  };
}

export function hasLocalVscoImages(): boolean {
  const entries = readExport();
  return Array.isArray(entries) && entries.length > 0;
}
