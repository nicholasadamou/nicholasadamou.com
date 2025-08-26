import { PlaywrightImageDownloader } from "../../PlaywrightImageDownloader.js";
import type { OptionParser } from "../OptionParser.js";
import type { OutputFormatter } from "../OutputFormatter.js";
import type {
  CommandOptionConfig,
  ValidationResult,
} from "../CliApplication.js";

/**
 * @fileoverview Main command handler for the download functionality.
 * Implements the Command pattern by encapsulating the main download operation
 * and coordinating with the option parser and output formatter.
 */

/**
 * Main command result interface
 */
export interface MainCommandResult {
  success: boolean;
  result?: any;
  error?: string;
  stack?: string | undefined;
}

/**
 * Main command handler for the download functionality.
 * Follows a Command pattern by encapsulating the main download operation.
 * Provides the primary interface for image downloading via CLI.
 */
export class MainCommand {
  private readonly optionParser: OptionParser;
  private readonly outputFormatter: OutputFormatter;

  /**
   * Create a new main command instance.
   */
  constructor(optionParser: OptionParser, outputFormatter: OutputFormatter) {
    this.optionParser = optionParser;
    this.outputFormatter = outputFormatter;
  }

  /**
   * Execute the main download command
   */
  public async execute(
    options: Record<string, any>
  ): Promise<MainCommandResult> {
    try {
      this.outputFormatter.displayHeader("Playwright Image Downloader");

      // Parse and validate options
      const downloaderOptions = this.optionParser.parseMainOptions(options);

      // Display configuration
      this.outputFormatter.displayConfiguration(downloaderOptions);

      // Display dry run notice if applicable
      if (options.dryRun) {
        this.outputFormatter.displayDryRunNotice();
      }

      // Create and configure downloader
      const downloader = new PlaywrightImageDownloader(downloaderOptions);

      // Set up graceful shutdown handling
      const cleanup = async () => {
        this.outputFormatter.displayShutdown();
        await downloader.cleanup();
        process.exit(0);
      };

      process.on("SIGINT", cleanup);
      process.on("SIGTERM", cleanup);

      // Run the downloader
      const result = await downloader.run();

      return {
        success: true,
        result,
      };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const errorStack = error instanceof Error ? error.stack : undefined;
      return {
        success: false,
        error: errorMessage,
        stack: errorStack,
      };
    }
  }

  /**
   * Handle command execution result
   */
  public handleResult(
    result: MainCommandResult,
    options: Record<string, any>
  ): void {
    if (result.success) {
      // Success is already handled by the downloader's internal logging
      return;
    }

    this.outputFormatter.displayError(
      "CLI Error",
      result.error || "Unknown error"
    );

    if (options.debug) {
      console.error(result.stack);
    }

    process.exit(1);
  }

  /**
   * Get command description
   */
  public getDescription(): string {
    return "Download images from Unsplash using Playwright for better authentication and reliability";
  }

  /**
   * Get command options configuration
   */
  public getOptionsConfig(): CommandOptionConfig[] {
    const defaults = this.optionParser.getDefaultOptions();

    return [
      {
        flag: "-h, --headless",
        description: "Run in headless mode (default: from env or true)",
        defaultValue: defaults.headless,
      },
      {
        flag: "--no-headless",
        description: "Run with visible browser",
      },
      {
        flag: "-d, --debug",
        description: "Enable debug mode with DevTools",
        defaultValue: defaults.debug,
      },
      {
        flag: "-t, --timeout <number>",
        description: "Timeout in milliseconds",
        defaultValue: defaults.timeout,
      },
      {
        flag: "-r, --retries <number>",
        description: "Number of retry attempts",
        defaultValue: defaults.retries,
      },
      {
        flag: "-s, --size <size>",
        description: "Preferred image size (original, large, medium, small)",
        defaultValue: defaults.size,
      },
      {
        flag: "-l, --limit <number>",
        description: "Limit the number of images to download",
        defaultValue: defaults.limit,
      },
      {
        flag: "--manifest-path <path>",
        description: "Path to the manifest file",
      },
      {
        flag: "--download-dir <path>",
        description: "Download directory",
      },
      {
        flag: "--dry-run",
        description:
          "Show what would be downloaded without actually downloading",
        defaultValue: false,
      },
    ];
  }

  /**
   * Validate command prerequisites
   */
  public async validatePrerequisites(
    options: Record<string, any>
  ): Promise<ValidationResult> {
    // Could add pre-execution validation here
    return { valid: true };
  }

  /**
   * Get command name
   */
  public getName(): string {
    return "main";
  }

  /**
   * Check if this command handles the given command name
   */
  public handles(commandName: string): boolean {
    return !commandName || commandName === "main"; // Default command
  }
}
