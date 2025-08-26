import path from "path";

/**
 * @fileoverview CLI option parser and validator. Converts raw Commander options
 * into normalized, validated option objects consumed by the application.
 */

/**
 * Main CLI options interface
 */
export interface MainCliOptions {
  headless: boolean;
  debug: boolean;
  timeout: string | number;
  retries: string | number;
  size: string;
  limit: string | number;
  dryRun?: boolean;
  manifestPath?: string;
  downloadDir?: string;
}

/**
 * Normalized downloader options interface
 */
export interface NormalizedDownloaderOptions {
  headless: boolean;
  debug: boolean;
  timeout: number;
  retries: number;
  preferredSize: "original" | "large" | "medium" | "small";
  limit?: number;
  dryRun: boolean;
  manifestPath?: string;
  downloadDir?: string;
}

/**
 * Valid size options type
 */
type ValidSize = "original" | "large" | "medium" | "small";

/**
 * CLI option parser and validator following Single Responsibility Principle.
 * Handles parsing, validation, and normalization of command line options.
 * Converts raw CLI input into typed, validated configuration objects.
 *
 * @example
 * ```javascript
 * const optionParser = new OptionParser();
 *
 * // Parse main command options
 * const options = optionParser.parseMainOptions({
 *   headless: true,
 *   timeout: '45000',
 *   size: 'large'
 * });
 *
 * // Get default options from environment
 * const defaults = optionParser.getDefaultOptions();
 * ```
 */
export class OptionParser {
  private readonly validSizes: ValidSize[];

  /**
   * Create a new option parser instance.
   * Sets up validation rules and valid option values.
   */
  constructor() {
    this.validSizes = ["original", "large", "medium", "small"];
  }

  /**
   * Parse and validate main command options from raw CLI input.
   * Orchestrates the complete option processing pipeline: parsing, validation, and normalization.
   */
  public parseMainOptions(
    options: Record<string, any>
  ): NormalizedDownloaderOptions {
    const parsedOptions = this.parseNumericOptions(options);
    this.validateMainOptions(parsedOptions);
    return this.buildDownloaderOptions(parsedOptions);
  }

  /**
   * Parse string numeric options into proper number types.
   * Handles CLI input which comes as strings and converts to numbers.
   */
  private parseNumericOptions(
    options: Record<string, any>
  ): Record<string, any> {
    const timeout = parseInt(String(options.timeout));
    const retries = parseInt(String(options.retries));
    const limit = parseInt(String(options.limit));

    return {
      ...options,
      timeout,
      retries,
      limit,
    };
  }

  /**
   * Validate all main command options using individual validators.
   * Calls specific validation methods for each option type.
   */
  private validateMainOptions(options: Record<string, any>): void {
    this.validateTimeout(options.timeout);
    this.validateRetries(options.retries);
    this.validateLimit(options.limit);
    this.validateSize(options.size);
  }

  /**
   * Validate timeout value to ensure it meets minimum requirements.
   * Timeout must be at least 1000ms to allow reasonable operation time.
   */
  private validateTimeout(timeout: any): void {
    if (isNaN(timeout) || timeout < 1000) {
      throw new Error("Timeout must be at least 1000ms");
    }
  }

  /**
   * Validate retries value to ensure it's a positive number.
   * At least 1 retry is required for robust operation.
   */
  private validateRetries(retries: any): void {
    if (isNaN(retries) || retries < 1) {
      throw new Error("Retries must be a positive number");
    }
  }

  /**
   * Validate limit value to ensure it's non-negative.
   * 0 means no limit, positive numbers set download limits.
   */
  private validateLimit(limit: any): void {
    if (isNaN(limit) || limit < 0) {
      throw new Error("Limit must be 0 (no limit) or a positive number");
    }
  }

  /**
   * Validate size option against allowed values.
   * Performs case-insensitive validation against valid size options.
   */
  private validateSize(size: any): void {
    if (!this.validSizes.includes(String(size).toLowerCase() as ValidSize)) {
      throw new Error(`Size must be one of: ${this.validSizes.join(", ")}`);
    }
  }

  /**
   * Build normalized downloader options from parsed and validated CLI options.
   * Transforms CLI input into the format expected by the downloader service.
   */
  private buildDownloaderOptions(
    options: Record<string, any>
  ): NormalizedDownloaderOptions {
    const downloaderOptions: any = {
      headless: options.headless,
      debug: options.debug,
      timeout: options.timeout,
      retries: options.retries,
      preferredSize: String(options.size).toLowerCase() as ValidSize,
      limit: options.limit > 0 ? options.limit : undefined,
      dryRun: options.dryRun || false,
    };

    // Set custom paths if provided
    if (options.manifestPath) {
      downloaderOptions.manifestPath = path.resolve(options.manifestPath);
    }

    if (options.downloadDir) {
      downloaderOptions.downloadDir = path.resolve(options.downloadDir);
    }

    return downloaderOptions;
  }

  /**
   * Parse list command options and resolve manifest path.
   * Handles manifest path resolution with defaults.
   */
  public parseListOptions(options: Record<string, any>): {
    manifestPath: string;
  } {
    return {
      manifestPath: options.manifestPath
        ? path.resolve(options.manifestPath)
        : path.resolve(process.cwd(), "../../public/unsplash-manifest.json"),
    };
  }

  /**
   * Get default CLI options from environment variables.
   * Provides fallback values when CLI options are not specified.
   */
  public getDefaultOptions(): Record<string, any> {
    return {
      headless: process.env.PLAYWRIGHT_HEADLESS !== "false",
      debug: process.env.PLAYWRIGHT_DEBUG === "true",
      timeout: process.env.PLAYWRIGHT_TIMEOUT || "30000",
      retries: process.env.PLAYWRIGHT_RETRIES || "3",
      size: process.env.PLAYWRIGHT_PREFERRED_SIZE || "original",
      limit: process.env.PLAYWRIGHT_LIMIT || "0",
    };
  }
}
