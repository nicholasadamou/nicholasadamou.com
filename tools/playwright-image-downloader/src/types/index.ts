/**
 * Core type definitions for the Playwright Image Downloader.
 * Contains all shared types, interfaces, and enums used throughout the application.
 */

import type {
  Browser,
  BrowserContext,
  Page,
  Download,
  Response,
} from "playwright";
import type { Stats } from "fs";

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * Configuration options for the image downloader.
 */
export interface ConfigOptions {
  /** Run browser in headless mode */
  headless?: boolean;
  /** Enable debug mode with DevTools */
  debug?: boolean;
  /** Directory where images will be saved */
  downloadDir?: string;
  /** Path to the manifest file */
  manifestPath?: string;
  /** Timeout in milliseconds */
  timeout?: number;
  /** Number of retry attempts */
  retries?: number;
  /** Preferred image size */
  preferredSize?: ImageSize;
  /** Maximum number of images to process (undefined = no limit) */
  limit?: number;
  /** Custom user agent string */
  userAgent?: string;
  /** Simulate downloads without actually downloading */
  dryRun?: boolean;
}

/**
 * Available image size options.
 */
export type ImageSize = "original" | "large" | "medium" | "small";

/**
 * Browser configuration for Playwright browser launch.
 */
export interface BrowserConfiguration {
  /** Whether to run browser in headless mode */
  headless: boolean;
  /** Whether to enable DevTools */
  devtools: boolean;
}

/**
 * Browser context configuration for Playwright context creation.
 */
export interface ContextConfiguration {
  /** User agent string */
  userAgent: string;
  /** Browser viewport dimensions */
  viewport: { width: number; height: number };
  /** Whether to accept downloads */
  acceptDownloads: boolean;
  /** Navigation timeout in milliseconds */
  navigationTimeout: number;
  /** Action timeout in milliseconds */
  actionTimeout: number;
}

/**
 * Size mapping configuration that defines width constraints for different image sizes.
 */
export interface SizeMapping {
  /** Width for small images (640px) */
  small: number;
  /** Width for medium images (1920px) */
  medium: number;
  /** Width for large images (2400px) */
  large: number;
  /** No width constraint for original images */
  original: null;
}

/**
 * Authentication credentials from environment variables.
 */
export interface AuthCredentials {
  /** Email from environment variables */
  email?: string;
  /** Password from environment variables */
  password?: string;
}

// ============================================================================
// Playwright Types (Re-exported for convenience)
// ============================================================================

export type { Browser, BrowserContext, Page, Download, Response };

// ============================================================================
// Image and Manifest Types
// ============================================================================

/**
 * Image metadata from the manifest.
 */
export interface ImageData {
  /** Photographer name */
  image_author?: string;
  /** Image width in pixels */
  width?: number;
  /** Image height in pixels */
  height?: number;
  /** Image description */
  description?: string;
  /** Additional metadata fields */
  [key: string]: unknown;
}

/**
 * Image entry tuple: [photoId, imageData].
 */
export type ImageEntry = [string, ImageData];

/**
 * Result of processing the manifest.
 */
export interface ProcessedManifestResult {
  /** Array of [photoId, imageData] tuples */
  imageEntries: ImageEntry[];
  /** The original manifest object */
  originalManifest: ManifestFile;
  /** Total number of images to process */
  totalImages: number;
}

/**
 * Structure of the manifest file.
 */
export interface ManifestFile {
  /** When the manifest was generated */
  generated_at: string;
  /** Manifest version */
  version?: string;
  /** Collection of images keyed by photo ID */
  images: Record<string, ImageData>;
  /** Additional metadata */
  [key: string]: unknown;
}

/**
 * Statistics about images in the manifest.
 */
export interface ImageStatistics {
  /** Total number of images */
  total: number;
  /** List of unique author names */
  authors: string[];
  /** Count of unique authors */
  uniqueAuthors: number;
  /** Average image width in pixels */
  averageWidth: number;
  /** Average image height in pixels */
  averageHeight: number;
  /** Count of images with dimension data */
  imagesWithDimensions: number;
}

// ============================================================================
// Download Types
// ============================================================================

/**
 * Result of a single image download attempt.
 */
export interface DownloadResult {
  /** Whether the download succeeded */
  success: boolean;
  /** The Unsplash photo ID */
  photoId: string;
  /** Full path to downloaded file (if successful) */
  filepath?: string;
  /** Name of downloaded file (if successful) */
  filename?: string;
  /** File size in bytes (if successful) */
  size?: number;
  /** Image author (if available) */
  author?: string;
  /** Error message (if failed) */
  error?: string;
  /** Whether download was skipped (file exists) */
  skipped?: boolean;
  /** Whether this was a dry run simulation */
  dryRun?: boolean;
}

/**
 * Size selection result from validation.
 */
export interface SizeSelection {
  /** The selected size name */
  selectedSize: ImageSize;
  /** The width constraint in pixels, or null for original */
  selectedWidth: number | null;
}

/**
 * Information about a saved file.
 */
export interface SavedFileInfo {
  /** Full path to saved file */
  filepath: string;
  /** Name of saved file */
  filename: string;
  /** File size in bytes */
  size: number;
}

/**
 * Result of checking if an image exists.
 */
export interface ImageExistsResult {
  /** Whether the image file exists */
  exists: boolean;
  /** Full path to existing file (if exists) */
  filepath?: string;
  /** File size in bytes (if exists) */
  size?: number;
}

/**
 * Download session summary.
 */
export interface DownloadSummary {
  /** Number of successful downloads */
  successful: number;
  /** Number of failed downloads */
  failed: number;
  /** Number of skipped (existing) files */
  skipped: number;
  /** Total storage used in bytes */
  totalStorage: number;
  /** Details of failed downloads */
  failedResults: DownloadResult[];
}

// ============================================================================
// Statistics Types
// ============================================================================

/**
 * Statistics data tracked during downloads.
 */
export interface StatsData {
  /** Total number of items to process */
  total: number;
  /** Number of successfully downloaded items */
  downloaded: number;
  /** Number of failed downloads */
  failed: number;
  /** Number of skipped items (already exist) */
  skipped: number;
}

/**
 * Manifest summary for statistics reporting.
 */
export interface ManifestSummary {
  /** Total images processed */
  total_images: number;
  /** Successfully downloaded count */
  downloaded: number;
  /** Failed download count */
  failed: number;
  /** Skipped download count */
  skipped: number;
  /** Success percentage */
  success_rate: number;
  /** Total operation time in seconds */
  duration_seconds: number;
}

// ============================================================================
// CLI Types
// ============================================================================

/**
 * CLI command option configuration.
 */
export interface CommandOptionConfig {
  /** CLI flag definition (e.g., "-t, --timeout <number>") */
  flag: string;
  /** Human-readable description for the option */
  description: string;
  /** Optional default value passed to Commander */
  defaultValue?: unknown;
}

/**
 * Raw CLI options from Commander (main command).
 */
export interface MainCliOptions {
  /** Run browser in headless mode */
  headless?: boolean;
  /** Enable debug/devtools */
  debug?: boolean;
  /** Timeout in ms (string accepted from env/CLI, parsed to number) */
  timeout?: string | number;
  /** Number of retries (string accepted, parsed to number) */
  retries?: string | number;
  /** Preferred image size */
  size?: string;
  /** Limit images processed (0 means no limit) */
  limit?: string | number;
  /** Do not actually download, simulate */
  dryRun?: boolean;
  /** Optional manifest path */
  manifestPath?: string;
  /** Optional download directory */
  downloadDir?: string;
}

/**
 * Normalized options for the downloader.
 */
export interface NormalizedDownloaderOptions {
  headless: boolean;
  debug: boolean;
  timeout: number;
  retries: number;
  preferredSize: ImageSize;
  limit?: number;
  dryRun: boolean;
  manifestPath?: string;
  downloadDir?: string;
}

/**
 * List command options.
 */
export interface ListCommandOptions {
  /** Path to manifest file */
  manifestPath?: string;
  /** Output format (table, json, csv) */
  format?: string;
  /** Limit number of items displayed */
  limit?: number;
  /** Filter by author name */
  author?: string;
  /** Filter by minimum width */
  minWidth?: number;
  /** Filter by minimum height */
  minHeight?: number;
}

// ============================================================================
// Environment Types
// ============================================================================

/**
 * Environment variable check configuration.
 */
export interface EnvironmentCheck {
  /** Environment variable name */
  name: string;
  /** Current value from process.env */
  value: string | undefined;
  /** Whether the variable is required */
  required: boolean;
  /** Human-readable description */
  description: string;
  /** If true, value should be masked in output */
  hideValue?: boolean;
  /** Logical category */
  category: "authentication" | "api" | "playwright";
  /** Derived display status (e.g., ✅/❌/⚠️) */
  status?: string;
  /** Derived masked/shortened value for display */
  displayValue?: string;
}

/**
 * Environment check result.
 */
export interface EnvironmentCheckResult {
  /** Individual environment checks */
  checks: EnvironmentCheck[];
  /** Whether environment is properly configured */
  isValid: boolean;
  /** Missing required variables */
  requiredMissing: string[];
  /** Summary statistics */
  summary: EnvironmentSummary;
}

/**
 * Environment check summary.
 */
export interface EnvironmentSummary {
  /** Total number of variables checked */
  total: number;
  /** Number of variables that are set */
  set: number;
  /** Number of required variables */
  required: number;
  /** Number of required variables that are set */
  requiredSet: number;
  /** Number of optional variables */
  optional: number;
  /** Number of optional variables that are set */
  optionalSet: number;
}

// ============================================================================
// Command Handler Interface
// ============================================================================

/**
 * Interface for CLI command handlers.
 */
export interface CommandHandler {
  /** Returns the command name */
  getName(): string;
  /** Returns the command description */
  getDescription(): string;
  /** Returns option configurations */
  getOptionsConfig(): CommandOptionConfig[];
  /** Executes the command */
  execute(options: Record<string, unknown>): Promise<unknown>;
  /** Handles command result */
  handleResult(result: unknown, options: Record<string, unknown>): void;
  /** Validates prerequisites before execution */
  validatePrerequisites?(
    options: Record<string, unknown>
  ): Promise<{ valid: boolean; error?: string }>;
}

// ============================================================================
// Local Manifest Types
// ============================================================================

/**
 * Local manifest data structure.
 */
export interface LocalManifest {
  /** When the local manifest was generated */
  generated_at: string;
  /** Local manifest version */
  version: string;
  /** Reference to source manifest generation time */
  source_manifest: string;
  /** Download method used */
  download_method: string;
  /** Collection of downloaded images */
  images: Record<string, LocalImageEntry>;
  /** Download statistics */
  stats: ManifestSummary;
}

/**
 * Local image entry in the manifest.
 */
export interface LocalImageEntry {
  /** Relative path to local file */
  local_path: string;
  /** When the image was downloaded */
  downloaded_at: string;
  /** Image author */
  author: string;
  /** File size in bytes */
  size_bytes: number;
  /** Whether download was skipped (file existed) */
  skipped: boolean;
  /** Download method used */
  download_method: string;
}

/**
 * Result of creating a local manifest.
 */
export interface LocalManifestResult {
  /** Generated local manifest object */
  localManifest: LocalManifest;
  /** Path where manifest was saved */
  localManifestPath: string;
}

// ============================================================================
// Validation Types
// ============================================================================

/**
 * Validation result.
 */
export interface ValidationResult {
  /** Whether validation passed */
  valid: boolean;
  /** Error message if validation failed */
  error?: string;
  /** Additional validation data */
  result?: unknown;
}
