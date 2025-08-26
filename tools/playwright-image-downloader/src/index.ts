#!/usr/bin/env node

/**
 * @fileoverview Public entry point for programmatic usage. Re-exports the main
 * PlaywrightImageDownloader class along with all supporting service classes so
 * consumers can compose advanced workflows as needed.
 *
 * This module provides both the high-level orchestrator class and all individual
 * service classes for maximum flexibility. Use the main class for simple operations
 * or compose individual services for custom workflows.
 *
 * @example
 * ```javascript
 * // Simple usage with the main orchestrator
 * import { PlaywrightImageDownloader } from './src/index.js';
 *
 * const downloader = new PlaywrightImageDownloader({
 *   headless: false,
 *   debug: true,
 *   preferredSize: 'large'
 * });
 *
 * const result = await downloader.run();
 * console.log('Downloaded:', result.stats.downloaded, 'images');
 * ```
 *
 * @example
 * ```javascript
 * // Advanced usage with individual services
 * import {
 *   Config,
 *   BrowserManager,
 *   ManifestService,
 *   FileSystemService
 * } from './src/index.js';
 *
 * const config = new Config({ timeout: 60000 });
 * const browserManager = new BrowserManager(config);
 * const fsService = new FileSystemService(config);
 * const manifestService = new ManifestService(config, fsService);
 *
 * // Custom workflow implementation
 * await browserManager.initialize();
 * const { imageEntries } = await manifestService.getProcessedImageEntries();
 * // ... custom processing
 * await browserManager.cleanup();
 * ```
 */

/**
 * Main orchestrator class for Playwright-based image downloading.
 * Provides complete workflow management with all services integrated.
 *
 * @see {@link PlaywrightImageDownloader}
 */
export { PlaywrightImageDownloader } from "./PlaywrightImageDownloader.js";

/**
 * Configuration management service for all downloader options.
 * Validates and normalizes user-provided configuration.
 *
 * @see {@link Config}
 */
export { Config } from "./config/Config.js";

/**
 * Browser lifecycle management service for Playwright operations.
 * Handles browser initialization, navigation, and cleanup.
 *
 * @see {@link BrowserManager}
 */
export { BrowserManager } from "./browser/BrowserManager.js";

/**
 * Authentication service for Unsplash login workflows.
 * Supports both automatic and manual authentication flows.
 *
 * @see {@link AuthenticationService}
 */
export { AuthenticationService } from "./auth/AuthenticationService.js";

/**
 * Statistics tracking service for download metrics and reporting.
 * Provides real-time progress tracking and performance metrics.
 *
 * @see {@link StatsTracker}
 */
export { StatsTracker } from "./stats/StatsTracker.js";

/**
 * File system operations service for manifest and image handling.
 * Manages all file I/O operations with validation and error handling.
 *
 * @see {@link FileSystemService}
 */
export { FileSystemService } from "./fs/FileSystemService.js";

/**
 * Manifest processing service for image metadata handling.
 * Loads, validates, and processes image manifest files.
 *
 * @see {@link ManifestService}
 */
export { ManifestService } from "./manifest/ManifestService.js";

/**
 * Download service for image retrieval with retry mechanisms.
 * Handles the complete download workflow with robust error handling.
 *
 * @see {@link DownloadService}
 */
export { DownloadService } from "./download/DownloadService.js";

/**
 * Re-export all types for external use
 */
export type * from "./types/index.js";

/**
 * Default export of the main orchestrator class for backward compatibility.
 * Allows `import PlaywrightImageDownloader from './src/index.js'` syntax.
 *
 * @default
 */
export { PlaywrightImageDownloader as default } from "./PlaywrightImageDownloader.js";
