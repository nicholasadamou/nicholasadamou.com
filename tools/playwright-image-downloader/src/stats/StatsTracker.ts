import chalk from "chalk";
import type {
  StatsData,
  ManifestSummary,
  ConfigOptions,
  DownloadResult,
} from "../types/index.js";
import type { Config } from "../config/Config.js";

/**
 * @fileoverview Statistics tracker for download metrics and reporting.
 * Provides comprehensive tracking, calculation, and display of download statistics
 * including success rates, timing, progress tracking, and formatted output.
 *
 * Key Features:
 * - Download progress tracking (total, downloaded, failed, skipped)
 * - Timing and performance metrics
 * - Success rate calculations
 * - Progress percentage tracking
 * - Formatted output and reporting
 * - Configuration display utilities
 * - Manifest summary generation
 *
 * Statistics Tracking:
 * - Real-time counter updates
 * - Duration measurement
 * - Rate calculations
 * - Storage usage tracking
 * - Progress indicators
 *
 * @example
 * ```javascript
 * const statsTracker = new StatsTracker();
 *
 * // Set up tracking
 * statsTracker.setTotal(100);
 * statsTracker.startTiming();
 *
 * // Update counters during downloads
 * statsTracker.incrementDownloaded();
 * statsTracker.incrementFailed();
 * statsTracker.incrementSkipped();
 *
 * // Display final results
 * statsTracker.endTiming();
 * statsTracker.displayResults(totalStorageBytes);
 *
 * console.log('Success rate:', statsTracker.getSuccessRate() + '%');
 * ```
 */

/**
 * Statistics tracker for download metrics and reporting.
 * Follows the Single Responsibility Principle by handling only statistics-related operations.
 * Provides real-time tracking and comprehensive reporting of download operations.
 */
export class StatsTracker {
  private stats: StatsData = {
    total: 0,
    downloaded: 0,
    failed: 0,
    skipped: 0,
  };
  private startTime: number | null = null;
  private endTime: number | null = null;

  constructor() {
    this.reset();
  }

  /**
   * Reset all statistics to initial state
   */
  reset(): void {
    this.stats = {
      total: 0,
      downloaded: 0,
      failed: 0,
      skipped: 0,
    };
    this.startTime = null;
    this.endTime = null;
  }

  /**
   * Start timing the operation
   */
  startTiming(): void {
    this.startTime = Date.now();
  }

  /**
   * End timing the operation
   */
  endTiming(): void {
    this.endTime = Date.now();
  }

  /**
   * Get elapsed time in seconds
   */
  getElapsedTime(): number {
    if (!this.startTime) {
      return 0;
    }

    const endTime = this.endTime || Date.now();
    return (endTime - this.startTime) / 1000;
  }

  /**
   * Set the total number of items to process
   */
  setTotal(total: number): void {
    this.stats.total = total;
  }

  /**
   * Increment downloaded count
   */
  incrementDownloaded(): void {
    this.stats.downloaded++;
  }

  /**
   * Increment failed count
   */
  incrementFailed(): void {
    this.stats.failed++;
  }

  /**
   * Increment skipped count
   */
  incrementSkipped(): void {
    this.stats.skipped++;
  }

  /**
   * Get current statistics
   */
  getStats(): StatsData {
    return { ...this.stats };
  }

  /**
   * Get progress percentage
   */
  getProgress(): number {
    if (this.stats.total === 0) {
      return 0;
    }

    const processed =
      this.stats.downloaded + this.stats.failed + this.stats.skipped;
    return Math.round((processed / this.stats.total) * 100);
  }

  /**
   * Check if all items have been processed
   */
  isComplete(): boolean {
    const processed =
      this.stats.downloaded + this.stats.failed + this.stats.skipped;
    return processed >= this.stats.total;
  }

  /**
   * Get summary statistics object for manifests
   */
  getSummaryForManifest(): ManifestSummary {
    return {
      total_images: this.stats.total,
      downloaded: this.stats.downloaded,
      failed: this.stats.failed,
      skipped: this.stats.skipped,
      success_rate: this.getSuccessRate(),
      duration_seconds: this.getElapsedTime(),
    };
  }

  /**
   * Get success rate as percentage
   */
  getSuccessRate(): number {
    const attempted = this.stats.downloaded + this.stats.failed;
    if (attempted === 0) {
      return 0;
    }
    return Math.round((this.stats.downloaded / attempted) * 100);
  }

  /**
   * Display configuration summary
   */
  displayConfiguration(config: Config): void {
    console.log(chalk.blue("📊 Configuration:"));
    console.log(
      chalk.gray(`   • Download directory: ${config.get("downloadDir")}`)
    );
    console.log(chalk.gray(`   • Timeout: ${config.get("timeout")}ms`));
    console.log(chalk.gray(`   • Retries: ${config.get("retries")}`));
    console.log(chalk.gray(`   • Headless: ${config.get("headless")}`));
    console.log(
      chalk.gray(`   • Preferred size: ${config.get("preferredSize")}`)
    );
    console.log(
      chalk.gray(
        `   • Image limit: ${config.get("limit") ? config.get("limit") : "No limit"}`
      )
    );
  }

  /**
   * Display final results summary
   */
  displayResults(totalStorageBytes: number = 0): void {
    this.endTiming();

    console.log(chalk.blue("\n📊 Download Results:"));
    console.log(
      chalk.green(`   ✅ Successfully downloaded: ${this.stats.downloaded}`)
    );
    console.log(
      chalk.gray(`   ⏭️  Skipped (already exist): ${this.stats.skipped}`)
    );
    console.log(chalk.red(`   ❌ Failed to download: ${this.stats.failed}`));
    console.log(
      chalk.blue(`   ⏱️  Total time: ${this.getElapsedTime().toFixed(2)}s`)
    );

    if (this.stats.downloaded > 0 && this.getElapsedTime() > 0) {
      const rate = (this.stats.downloaded / this.getElapsedTime()).toFixed(2);
      console.log(chalk.blue(`   📈 Download rate: ${rate} images/second`));
    }

    if (this.stats.downloaded + this.stats.failed > 0) {
      console.log(chalk.blue(`   ✨ Success rate: ${this.getSuccessRate()}%`));
    }

    if (totalStorageBytes > 0) {
      const sizeInMB = (totalStorageBytes / (1024 * 1024)).toFixed(2);
      console.log(chalk.blue(`   💾 Storage used: ${sizeInMB} MB`));
    }

    if (this.stats.failed > 0) {
      console.log(
        chalk.yellow(
          "\n⚠️  Some downloads failed. You may want to run this again."
        )
      );
    }
  }

  /**
   * Display progress during downloads
   */
  displayProgress(currentItem: any, photoId: string): void {
    const processed =
      this.stats.downloaded + this.stats.failed + this.stats.skipped;
    const progress = this.getProgress();

    console.log(
      chalk.blue(
        `[${processed}/${this.stats.total}] (${progress}%) Processing: ${photoId}`
      )
    );
  }

  /**
   * Display failed items summary
   */
  displayFailedItems(failedResults: DownloadResult[]): void {
    if (failedResults.length === 0) {
      return;
    }

    console.log(chalk.red("\n❌ Failed Downloads:"));
    failedResults.forEach((result) => {
      console.log(chalk.red(`   • ${result.photoId}: ${result.error}`));
    });
  }

  /**
   * Get a formatted duration string
   */
  getFormattedDuration(): string {
    const seconds = this.getElapsedTime();

    if (seconds < 60) {
      return `${seconds.toFixed(2)}s`;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
  }

  /**
   * Display completion message
   */
  displayCompletion(): void {
    if (this.stats.failed > 0) {
      console.log(
        chalk.yellow("⚠️  Download process completed with some failures")
      );
    } else {
      console.log(chalk.green("🎉 Download process completed successfully!"));
    }
  }
}
