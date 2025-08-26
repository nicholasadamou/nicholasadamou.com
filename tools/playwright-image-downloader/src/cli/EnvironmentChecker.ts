/**
 * @fileoverview Service for validating and reporting on environment variables
 * required/used by the Playwright Image Downloader. Includes helpers for
 * categorization, result summaries, and typed accessors.
 */

import type {
  EnvironmentCheck,
  EnvironmentCheckResult,
  EnvironmentSummary,
} from "../types";

/**
 * Environment variable check category
 */
export type EnvironmentCategory = "authentication" | "api" | "playwright";

/**
 * Validation result for specific variable
 */
export interface VariableValidationResult {
  valid: boolean;
  error?: string;
  result?: any;
}

/**
 * Environment checker service for validating environment variables.
 * Follows the Single Responsibility Principle by handling only environment validation.
 */
export class EnvironmentChecker {
  private readonly environmentChecks: EnvironmentCheck[];

  constructor() {
    this.environmentChecks = this.defineEnvironmentChecks();
  }

  /**
   * Define all environment variable checks
   */
  private defineEnvironmentChecks(): EnvironmentCheck[] {
    return [
      {
        name: "UNSPLASH_EMAIL",
        value: process.env.UNSPLASH_EMAIL,
        required: false,
        description: "Email for Unsplash authentication",
        category: "authentication",
      },
      {
        name: "UNSPLASH_PASSWORD",
        value: process.env.UNSPLASH_PASSWORD,
        required: false,
        description: "Password for Unsplash authentication",
        hideValue: true,
        category: "authentication",
      },
      {
        name: "UNSPLASH_ACCESS_KEY",
        value: process.env.UNSPLASH_ACCESS_KEY,
        required: true,
        description: "Unsplash API access key",
        category: "api",
      },
      {
        name: "PLAYWRIGHT_TIMEOUT",
        value: process.env.PLAYWRIGHT_TIMEOUT,
        required: false,
        description: "Timeout in milliseconds (default: 30000)",
        category: "playwright",
      },
      {
        name: "PLAYWRIGHT_RETRIES",
        value: process.env.PLAYWRIGHT_RETRIES,
        required: false,
        description: "Number of retry attempts (default: 3)",
        category: "playwright",
      },
      {
        name: "PLAYWRIGHT_HEADLESS",
        value: process.env.PLAYWRIGHT_HEADLESS,
        required: false,
        description: "Run in headless mode (default: true)",
        category: "playwright",
      },
      {
        name: "PLAYWRIGHT_DEBUG",
        value: process.env.PLAYWRIGHT_DEBUG,
        required: false,
        description: "Enable debug mode (default: false)",
        category: "playwright",
      },
      {
        name: "PLAYWRIGHT_PREFERRED_SIZE",
        value: process.env.PLAYWRIGHT_PREFERRED_SIZE,
        required: false,
        description: "Preferred image size (default: original)",
        category: "playwright",
      },
      {
        name: "PLAYWRIGHT_LIMIT",
        value: process.env.PLAYWRIGHT_LIMIT,
        required: false,
        description:
          "Limit the number of images to download (default: 0 = no limit)",
        category: "playwright",
      },
    ];
  }

  /**
   * Check all environment variables
   */
  public checkEnvironment(): EnvironmentCheckResult {
    const results = this.environmentChecks.map((check) => ({
      ...check,
      status: this.getCheckStatus(check),
      displayValue: this.getDisplayValue(check),
    }));

    const isValid = this.validateEnvironment(results);

    return {
      checks: results,
      isValid,
      requiredMissing: this.getRequiredMissing(results),
      summary: this.generateSummary(results),
    };
  }

  /**
   * Get the status for a check
   */
  private getCheckStatus(check: EnvironmentCheck): string {
    if (check.value) {
      return "✅";
    }
    return check.required ? "❌" : "⚠️";
  }

  /**
   * Get the display value for a check
   */
  private getDisplayValue(check: EnvironmentCheck): string {
    if (!check.value) {
      return "Not set";
    }

    if (check.hideValue) {
      return "***hidden***";
    }

    // Truncate long values for display
    return check.value.length > 20
      ? check.value.substring(0, 17) + "..."
      : check.value;
  }

  /**
   * Validate if the environment is properly configured
   */
  private validateEnvironment(results: EnvironmentCheck[]): boolean {
    return !results.some((result) => result.required && !result.value);
  }

  /**
   * Get a list of required missing environment variables
   */
  private getRequiredMissing(results: EnvironmentCheck[]): string[] {
    return results
      .filter((result) => result.required && !result.value)
      .map((result) => result.name);
  }

  /**
   * Generate a summary of environment check
   */
  private generateSummary(results: EnvironmentCheck[]): EnvironmentSummary {
    const total = results.length;
    const set = results.filter((r) => r.value).length;
    const required = results.filter((r) => r.required).length;
    const requiredSet = results.filter((r) => r.required && r.value).length;

    return {
      total,
      set,
      required,
      requiredSet,
      optional: total - required,
      optionalSet: set - requiredSet,
    };
  }

  /**
   * Check if a specific environment variable is set
   */
  public isEnvironmentVariableSet(name: string): boolean {
    return !!process.env[name];
  }

  /**
   * Get environment variable value safely
   */
  public getEnvironmentVariable(
    name: string,
    defaultValue: any = null
  ): string | null {
    return process.env[name] || defaultValue;
  }

  /**
   * Validate specific environment variable
   */
  public validateEnvironmentVariable(
    name: string,
    validator: (value: string) => any
  ): VariableValidationResult {
    const value = process.env[name];

    if (!value) {
      return { valid: false, error: "Variable not set" };
    }

    try {
      const result = validator(value);
      return { valid: true, result };
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return { valid: false, error: errorMessage };
    }
  }

  /**
   * Get checks by category
   */
  public getChecksByCategory(
    category: EnvironmentCategory
  ): EnvironmentCheck[] {
    return this.environmentChecks.filter(
      (check) => check.category === category
    );
  }

  /**
   * Get all available categories
   */
  public getCategories(): EnvironmentCategory[] {
    return [...new Set(this.environmentChecks.map((check) => check.category))];
  }

  /**
   * Get authentication status
   */
  public getAuthenticationStatus(): {
    hasCredentials: boolean;
    email: string | null;
    hasPassword: boolean;
  } {
    const email = process.env.UNSPLASH_EMAIL;
    const password = process.env.UNSPLASH_PASSWORD;

    return {
      hasCredentials: !!(email && password),
      email: email || null,
      hasPassword: !!password,
    };
  }

  /**
   * Get playwright configuration status
   */
  public getPlaywrightStatus(): {
    total: number;
    configured: number;
    variables: Array<{ name: string; set: boolean; value: string | null }>;
  } {
    const playwrightVars = this.getChecksByCategory("playwright");
    const setVars = playwrightVars.filter((check) => check.value);

    return {
      total: playwrightVars.length,
      configured: setVars.length,
      variables: playwrightVars.map((check) => ({
        name: check.name,
        set: !!check.value,
        value: check.hideValue ? null : check.value || null,
      })),
    };
  }

  /**
   * Get API configuration status
   */
  public getApiStatus(): { configured: boolean; missing: string[] } {
    const apiVars = this.getChecksByCategory("api");
    const requiredSet = apiVars.filter(
      (check) => check.required && check.value
    );
    const requiredTotal = apiVars.filter((check) => check.required);

    return {
      configured: requiredSet.length === requiredTotal.length,
      missing: apiVars
        .filter((check) => check.required && !check.value)
        .map((check) => check.name),
    };
  }
}
