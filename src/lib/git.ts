import { execSync } from "child_process";
import { existsSync } from "fs";
import path from "path";

/**
 * Get the last commit date for a specific file from Git
 * @param filePath - Relative path to the file from the project root
 * @returns Date object of the last commit, or current date if unavailable
 */
export function getFileLastModifiedDate(filePath: string): Date {
  try {
    // Get the absolute path to the file
    const absolutePath = path.join(process.cwd(), filePath);

    // Check if file exists
    if (!existsSync(absolutePath)) {
      console.warn(`File not found: ${absolutePath}`);
      return new Date();
    }

    // Get the last commit date for this file
    const command = `git log -1 --format=%cI "${filePath}"`;
    const output = execSync(command, {
      encoding: "utf-8",
      cwd: process.cwd(),
    }).trim();

    if (output) {
      return new Date(output);
    }

    // Fallback to current date if no git history
    return new Date();
  } catch (error) {
    console.warn(
      `Failed to get git commit date for ${filePath}:`,
      error instanceof Error ? error.message : error
    );
    return new Date();
  }
}

/**
 * Format a date as "Month YYYY" (e.g., "December 2024")
 */
export function formatLastUpdated(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}
