import { Command } from "commander";
import type { OutputFormatter } from "./OutputFormatter.js";

/**
 * Command option configuration
 */
export interface CommandOptionConfig {
  /** CLI flag definition (e.g., "-t, --timeout <number>") */
  flag: string;
  /** Human-readable description for the option */
  description: string;
  /** Optional default value passed to Commander */
  defaultValue?: any;
}

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
}

/**
 * Command handler interface
 */
export interface CommandHandler {
  /** Returns the command name */
  getName(): string;
  /** Returns the command description */
  getDescription(): string;
  /** Returns option configs */
  getOptionsConfig(): CommandOptionConfig[];
  /** Executes the command */
  execute(options: Record<string, any>): Promise<any>;
  /** Handles result */
  handleResult(result: any, options: Record<string, any>): void;
  /** Validates prerequisites */
  validatePrerequisites?(
    options: Record<string, any>
  ): Promise<ValidationResult>;
}

/**
 * CLI application orchestrator that coordinates all CLI services and command handlers.
 * Manages command registration, option parsing, and execution workflow.
 *
 * @example
 * ```javascript
 * const outputFormatter = new OutputFormatter();
 * const cliApp = new CliApplication(outputFormatter);
 *
 * // Register commands
 * const mainCommand = new MainCommand(optionParser, outputFormatter);
 * cliApp.registerCommand(mainCommand);
 *
 * // Set up error handling and run
 * cliApp.setupErrorHandling();
 * await cliApp.run();
 * ```
 */
export class CliApplication {
  private readonly outputFormatter: OutputFormatter;
  private readonly commands: Map<string, CommandHandler>;
  private readonly program: Command;

  /**
   * Create a new CLI application instance.
   */
  constructor(outputFormatter: OutputFormatter) {
    this.outputFormatter = outputFormatter;
    this.commands = new Map();
    this.program = new Command();
    this.setupProgram();
  }

  /**
   * Set up the main program configuration with name, description, and version.
   * This configures the root Commander.js program instance.
   */
  private setupProgram(): void {
    this.program
      .name("playwright-image-downloader")
      .description(
        "Download images from Unsplash using Playwright for better authentication and reliability"
      )
      .version("1.0.0");
  }

  /**
   * Register a command handler with the CLI application.
   * Determines whether to set up as main command or sub-command based on name.
   */
  public registerCommand(commandHandler: CommandHandler): void {
    const name = commandHandler.getName();
    this.commands.set(name, commandHandler);

    if (name === "main") {
      // Main command is the default action
      this.setupMainCommand(commandHandler);
      return;
    }

    // Sub-commands
    this.setupSubCommand(commandHandler);
  }

  /**
   * Set up the main (default) command by adding options and action handler.
   * The main command is executed when no sub-command is specified.
   */
  private setupMainCommand(commandHandler: CommandHandler): void {
    const optionsConfig = commandHandler.getOptionsConfig();

    // Add options to the main program
    optionsConfig.forEach((config) => {
      if (config.defaultValue !== undefined) {
        this.program.option(
          config.flag,
          config.description,
          config.defaultValue
        );
        return;
      }

      this.program.option(config.flag, config.description);
    });

    // Set action for main command
    this.program.action(async (options) => {
      await this.executeCommand("main", options);
    });
  }

  /**
   * Set up a sub-command by creating a new Commander command with options and action.
   * Sub-commands are accessed via `program-name command-name`.
   */
  private setupSubCommand(commandHandler: CommandHandler): void {
    const name = commandHandler.getName();
    const description = commandHandler.getDescription();
    const optionsConfig = commandHandler.getOptionsConfig();

    const command = this.program.command(name).description(description);

    // Add options specific to this command
    optionsConfig.forEach((config) => {
      if (config.defaultValue !== undefined) {
        command.option(config.flag, config.description, config.defaultValue);
      } else {
        command.option(config.flag, config.description);
      }
    });

    // Set action for sub-command
    command.action(async (options) => {
      await this.executeCommand(name, options);
    });
  }

  /**
   * Execute a command by name with comprehensive error handling and validation.
   * Handles prerequisite validation, command execution, and result processing.
   */
  public async executeCommand(
    commandName: string,
    options: Record<string, any>
  ): Promise<any> {
    try {
      const commandHandler = this.commands.get(commandName);

      if (!commandHandler) {
        this.outputFormatter.displayError(`Unknown command: ${commandName}`);
        process.exit(1);
      }

      // Validate prerequisites if the command supports it
      if (typeof commandHandler.validatePrerequisites === "function") {
        const validation = await commandHandler.validatePrerequisites(options);
        if (!validation.valid) {
          this.outputFormatter.displayError(
            validation.error || "Prerequisites not met"
          );
          process.exit(1);
        }
      }

      // Execute the command
      const result = await commandHandler.execute(options);

      // Handle the result
      commandHandler.handleResult(result, options);

      return result;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.outputFormatter.displayError("Unexpected error", errorMessage);

      if (options.debug && error instanceof Error) {
        console.error(error.stack);
      }

      process.exit(1);
    }
  }

  /**
   * Parse command line arguments and execute the appropriate command.
   * This is the main entry point for CLI execution.
   */
  public async run(args: string[] = process.argv): Promise<void> {
    try {
      await this.program.parseAsync(args);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.outputFormatter.displayError("CLI parsing error", errorMessage);
      process.exit(1);
    }
  }

  /**
   * Set up global error handling for uncaught exceptions and unhandled rejections.
   * This ensures graceful error reporting and process termination.
   */
  public setupErrorHandling(): void {
    process.on("uncaughtException", (error: Error) => {
      this.outputFormatter.displayError("Uncaught Exception", error.message);
      console.error(error.stack);
      process.exit(1);
    });

    process.on("unhandledRejection", (reason: unknown) => {
      const errorMessage =
        reason instanceof Error ? reason.message : String(reason);
      this.outputFormatter.displayError("Unhandled Rejection", errorMessage);
      process.exit(1);
    });
  }
}
