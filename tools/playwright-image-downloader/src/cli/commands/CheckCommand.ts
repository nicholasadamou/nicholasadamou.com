import type { EnvironmentChecker } from "../EnvironmentChecker.js";
import type { OutputFormatter } from "../OutputFormatter.js";
import type {
  CommandOptionConfig,
  ValidationResult,
} from "../CliApplication.js";

/**
 * @fileoverview Check command handler for environment validation.
 * Implements the Command pattern by encapsulating the environment check operation
 * and providing detailed validation of system configuration.
 *
 * The check command validates:
 * - Environment variable configuration
 * - Required vs. optional settings
 * - Authentication credentials availability
 * - Playwright configuration status
 * - API access configuration
 */

/**
 * Environment check result interface
 */
export interface EnvironmentCheckResult {
  success: boolean;
  result?: {
    checks: Array<any>;
    isValid: boolean;
    requiredMissing: Array<string>;
    summary: any;
  };
  error?: string;
  stack?: string | undefined;
}

/**
 * Check the command handler for environment validation.
 * Follows a Command pattern by encapsulating the environment check operation.
 * Provides comprehensive validation of environment configuration and setup.
 */
export class CheckCommand {
  private readonly environmentChecker: EnvironmentChecker;
  private readonly outputFormatter: OutputFormatter;

  /**
   * Create a new check command instance.
   */
  constructor(
    environmentChecker: EnvironmentChecker,
    outputFormatter: OutputFormatter
  ) {
    this.environmentChecker = environmentChecker;
    this.outputFormatter = outputFormatter;
  }

  /**
   * Execute the environment check command.
   * Performs comprehensive validation of environment configuration and displays results.
   */
  public async execute(
    options: Record<string, any> = {}
  ): Promise<EnvironmentCheckResult> {
    try {
      const checkResult = this.environmentChecker.checkEnvironment();

      // Display the environment check results
      this.outputFormatter.displayEnvironmentCheck(checkResult);

      return {
        success: true,
        result: checkResult,
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
   * Handle command execution result and manage process exit codes.
   * Exits with code 1 if environment validation fails, ensuring CI/CD integration.
   */
  public handleResult(
    result: EnvironmentCheckResult,
    options: Record<string, any>
  ): void {
    if (result.success) {
      // Exit with error code if environment is not valid
      if (result.result && !result.result.isValid) {
        process.exit(1);
      }
      return;
    }

    this.outputFormatter.displayError(
      "Environment Check Error",
      result.error || "Unknown error"
    );

    if (options?.debug) {
      console.error(result.stack);
    }

    process.exit(1);
  }

  /**
   * Get a human-readable command description for help text.
   */
  public getDescription(): string {
    return "Check if the environment is properly configured";
  }

  /**
   * Get command options configuration.
   * The check command doesn't require any specific options.
   */
  public getOptionsConfig(): CommandOptionConfig[] {
    return [];
  }
  /**
   * Validate command prerequisites before execution.
   * Check command has no prerequisites - it's designed to validate the environment.
   */
  public async validatePrerequisites(
    options: Record<string, any>
  ): Promise<ValidationResult> {
    return { valid: true };
  }

  /**
   * Get the command name used for CLI registration.
   */
  public getName(): string {
    return "check";
  }

  /**
   * Check if this command handles the given command name.
   * Used by the CLI framework for command routing.
   */
  public handles(commandName: string): boolean {
    return commandName === "check";
  }
}
