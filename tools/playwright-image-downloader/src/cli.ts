#!/usr/bin/env node

/**
 * @fileoverview CLI entry point for the Playwright Image Downloader.
 * Wires together the CLI application, option parsing, environment checks,
 * output formatting, and individual command handlers. This script is intended
 * to be executed directly (via Node shebang) and does not export any symbols.
 *
 * Responsibilities:
 * - Construct dependencies and inject them into commands
 * - Register commands in the CLI application
 * - Run the command parsing and dispatch flow
 */

// Import CLI components
import { OptionParser } from "./cli/OptionParser.js";
import { EnvironmentChecker } from "./cli/EnvironmentChecker.js";
import { OutputFormatter } from "./cli/OutputFormatter.js";
import { CliApplication } from "./cli/CliApplication.js";

// Import command handlers
import { MainCommand } from "./cli/commands/MainCommand.js";
import { CheckCommand } from "./cli/commands/CheckCommand.js";
import { ListCommand } from "./cli/commands/ListCommand.js";

/**
 * Main CLI entry point that initializes and coordinates all services.
 * Uses dependency injection to wire up the application components.
 *
 * @returns {Promise<void>} Resolves when CLI completes execution. The process
 * may exit with a non-zero code on failure via internal handlers.
 */
async function main() {
  try {
    // Initialize services (Dependency Injection)
    const optionParser = new OptionParser();
    const environmentChecker = new EnvironmentChecker();
    const outputFormatter = new OutputFormatter();

    // Create CLI application orchestrator
    const cliApp = new CliApplication(outputFormatter);

    // Initialize command handlers with their dependencies
    const mainCommand = new MainCommand(optionParser, outputFormatter);
    const checkCommand = new CheckCommand(environmentChecker, outputFormatter);
    const listCommand = new ListCommand(optionParser, outputFormatter);

    // Register all command handlers
    cliApp.registerCommand(mainCommand);
    cliApp.registerCommand(checkCommand);
    cliApp.registerCommand(listCommand);

    // Set up error handling
    cliApp.setupErrorHandling();

    // Run the application
    await cliApp.run();
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Fatal CLI error:", errorMessage);
    process.exit(1);
  }
}

// Execute main function
main();
