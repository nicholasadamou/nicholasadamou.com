import chalk from "chalk";
import type {
  ConfigOptions,
  EnvironmentCheckResult,
  ImageData,
} from "../types";

/**
 * @fileoverview Utilities for consistent console output and formatting across
 * the CLI. Methods here should not modify program state; they only write to
 * stdout/stderr.
 */
export class OutputFormatter {
  constructor() {
    // Initialize formatter
  }

  /**
   * Display CLI header with title
   * @param title Section or application title
   */
  displayHeader(title: string): void {
    console.log(chalk.bold.blue(`🎭 ${title}\n`));
  }

  /**
   * Display configuration summary
   * @param options Normalized options
   */
  displayConfiguration(options: Partial<ConfigOptions>): void {
    console.log(chalk.blue("📋 Configuration:"));

    const configItems = [
      { label: "Headless mode", value: options.headless },
      { label: "Debug mode", value: options.debug },
      { label: "Timeout", value: `${options.timeout}ms` },
      { label: "Retries", value: options.retries },
      { label: "Preferred size", value: options.preferredSize },
      {
        label: "Image limit",
        value: options.limit ? options.limit : "No limit",
      },
    ];

    configItems.forEach((item) => {
      console.log(chalk.gray(`   • ${item.label}: ${item.value}`));
    });
  }

  /**
   * Display dry run notice
   */
  displayDryRunNotice(): void {
    console.log(
      chalk.yellow("\n🧪 DRY RUN MODE - No files will be downloaded\n")
    );
  }

  /**
   * Display environment check results
   */
  displayEnvironmentCheck(checkResult: EnvironmentCheckResult): void {
    console.log(chalk.bold.blue("🔍 Environment Check\n"));

    // Display each check
    checkResult.checks.forEach((check) => {
      console.log(`${check.status} ${check.name}: ${check.displayValue}`);
      console.log(chalk.gray(`   ${check.description}`));
    });

    // Display summary
    this.displayEnvironmentSummary(checkResult);

    // Display notes
    this.displayEnvironmentNotes();

    // Display final status
    this.displayEnvironmentStatus(checkResult.isValid);
  }

  /**
   * Display environment check summary
   */
  displayEnvironmentSummary(checkResult: EnvironmentCheckResult): void {
    const { summary } = checkResult;

    console.log(chalk.blue("\n📊 Summary:"));
    console.log(chalk.gray(`   • Total variables: ${summary.total}`));
    console.log(
      chalk.gray(`   • Variables set: ${summary.set}/${summary.total}`)
    );
    console.log(
      chalk.gray(
        `   • Required set: ${summary.requiredSet}/${summary.required}`
      )
    );
    console.log(
      chalk.gray(
        `   • Optional set: ${summary.optionalSet}/${summary.optional}`
      )
    );
  }

  /**
   * Display environment check notes
   */
  displayEnvironmentNotes(): void {
    const notes = [
      "UNSPLASH_EMAIL and UNSPLASH_PASSWORD are optional but enable auto-login",
      "Without credentials, you may need to login manually in non-headless mode",
      "UNSPLASH_ACCESS_KEY is required for API access",
      "PLAYWRIGHT_* variables are optional and can be overridden by CLI arguments",
      "Environment variables are used as defaults when CLI arguments are not provided",
    ];

    console.log(chalk.blue("\n📝 Notes:"));
    notes.forEach((note) => {
      console.log(chalk.gray(`   • ${note}`));
    });
  }

  /**
   * Display environment status
   */
  displayEnvironmentStatus(isValid: boolean): void {
    if (isValid) {
      console.log(chalk.green("\n🎉 Environment looks good!"));
    } else {
      console.log(
        chalk.red("\n❌ Please set the required environment variables")
      );
    }
  }

  /**
   * Display image list header
   */
  displayImageListHeader(
    imageCount: number,
    manifestPath: string,
    generatedAt: string
  ): void {
    console.log(chalk.bold.blue("📋 Image List\n"));
    console.log(chalk.blue(`📊 Found ${imageCount} images in manifest:`));
    console.log(chalk.gray(`   • Manifest: ${manifestPath}`));
    console.log(chalk.gray(`   • Generated: ${generatedAt}\n`));
  }

  /**
   * Display individual image entry
   */
  displayImageEntry(
    index: number,
    photoId: string,
    imageData: ImageData
  ): void {
    const paddedIndex = (index + 1).toString().padStart(3, " ");

    console.log(`${paddedIndex}. ${chalk.cyan(photoId)}`);
    console.log(`     ${chalk.gray("Author:")} ${imageData.image_author}`);
    console.log(
      `     ${chalk.gray("Description:")} ${imageData.description || "No description"}`
    );

    const sizeInfo =
      imageData.width && imageData.height
        ? `${imageData.width}x${imageData.height}`
        : "Size not available";
    console.log(`     ${chalk.gray("Size:")} ${sizeInfo}`);
    console.log("");
  }

  /**
   * Display error message
   */
  displayError(message: string, details: string | null = null): void {
    console.error(chalk.red(`❌ ${message}`));
    if (details) {
      console.error(chalk.gray(details));
    }
  }

  /**
   * Display success message
   */
  displaySuccess(message: string): void {
    console.log(chalk.green(`✅ ${message}`));
  }

  /**
   * Display warning message
   */
  displayWarning(message: string): void {
    console.log(chalk.yellow(`⚠️ ${message}`));
  }

  /**
   * Display info message
   */
  displayInfo(message: string): void {
    console.log(chalk.blue(`ℹ️ ${message}`));
  }

  /**
   * Display shutdown message
   */
  displayShutdown(): void {
    console.log(chalk.yellow("\n🛑 Shutting down..."));
  }

  /**
   * Display section header
   */
  displaySectionHeader(title: string, icon: string | null = null): void {
    const displayIcon = icon || "📋";
    console.log(chalk.blue(`\n${displayIcon} ${title}:`));
  }

  /**
   * Display bulleted list
   */
  displayList(items: string[], indent = "   "): void {
    items.forEach((item) => {
      console.log(chalk.gray(`${indent}• ${item}`));
    });
  }

  /**
   * Display key-value pairs
   */
  displayKeyValue(
    pairs: Array<{
      key: string;
      value: string;
      color?: "gray" | "red" | "green" | "blue" | "yellow";
    }>,
    indent = "   "
  ): void {
    pairs.forEach(({ key, value, color = "gray" }) => {
      const colorFunc = chalk[color];
      console.log(colorFunc(`${indent}• ${key}: ${value}`));
    });
  }

  /**
   * Display progress message
   */
  displayProgress(current: number, total: number, message: string): void {
    const percentage = Math.round((current / total) * 100);
    console.log(
      chalk.blue(`[${current}/${total}] (${percentage}%) ${message}`)
    );
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  /**
   * Format duration for display
   */
  formatDuration(seconds: number): string {
    if (seconds < 60) {
      return `${seconds.toFixed(2)}s`;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}m ${remainingSeconds.toFixed(0)}s`;
  }
}
