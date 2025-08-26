import chalk from "chalk";
import type { Config } from "../config/Config.js";
import type { BrowserManager } from "../browser/BrowserManager.js";

/**
 * Login credentials interface
 */
interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * @fileoverview Authentication service for Unsplash. Provides automatic and
 * manual login flows using Playwright, tracks session state, and exposes
 * helpers to query/reset authentication.
 *
 * Key Features:
 * - Automatic login with environment credentials
 * - Manual login flow in non-headless mode
 * - Session state tracking
 * - Credential validation
 * - Graceful fallback handling
 *
 * Authentication Flow:
 * 1. Check if already logged in
 * 2. Attempt automatic login with credentials
 * 3. Fall back to manual login if needed
 * 4. Handle missing credentials gracefully
 *
 * @example
 * ```javascript
 * const config = new Config();
 * const browserManager = new BrowserManager(config);
 * const authService = new AuthenticationService(config, browserManager);
 *
 * await browserManager.initialize();
 * const success = await authService.attemptLogin();
 * console.log('Authenticated:', success);
 * ```
 */

/**
 * Authentication service for Unsplash login operations.
 * Follows Single Responsibility Principle by handling only authentication concerns.
 * Manages both automatic and manual login workflows with proper error handling.
 */
export class AuthenticationService {
  private readonly config: Config;
  private readonly browserManager: BrowserManager;
  private isLoggedIn: boolean;

  /**
   * Create a new authentication service instance.
   *
   * @param config - Configuration instance
   * @param browserManager - Browser manager instance
   * @example
   * ```javascript
   * const config = new Config();
   * const browserManager = new BrowserManager(config);
   * const authService = new AuthenticationService(config, browserManager);
   * ```
   */
  constructor(config: Config, browserManager: BrowserManager) {
    this.config = config;
    this.browserManager = browserManager;
    this.isLoggedIn = false;
  }

  /**
   * Check if the user is already authenticated in the current session.
   * Returns the internal authentication state without performing any checks.
   *
   * @returns true if authentication was successful, false otherwise
   * @example
   * ```javascript
   * const authService = new AuthenticationService(config, browserManager);
   * console.log(authService.isAuthenticated()); // false initially
   * await authService.attemptLogin();
   * console.log(authService.isAuthenticated()); // true if login succeeded
   * ```
   */
  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  /**
   * Attempt to log in to Unsplash using the configured authentication strategy.
   *
   * This method orchestrates the entire login flow:
   * 1. Skip if already authenticated
   * 2. Check if the session is already logged in
   * 3. Attempt automatic login with environment credentials
   * 4. Fall back to manual login in non-headless mode
   * 5. Handle missing credentials gracefully
   *
   * @returns true if authenticated by the end of the routine
   * @example
   * ```javascript
   * const authService = new AuthenticationService(config, browserManager);
   * await browserManager.initialize();
   *
   * const success = await authService.attemptLogin();
   * if (success) {
   *   console.log('Ready to download images');
   * } else {
   *   console.log('Downloads may be limited');
   * }
   * ```
   */
  async attemptLogin(): Promise<boolean> {
    if (this.isLoggedIn) {
      console.log(chalk.gray("⏭️  Already logged in, skipping authentication"));
      return true;
    }

    console.log(chalk.blue("🔐 Attempting to login to Unsplash..."));

    try {
      // Check if already logged in by visiting homepage first
      await this.browserManager.navigateToUrl("https://unsplash.com");

      // Check if we're already logged in
      if (await this.checkIfAlreadyLoggedIn()) {
        console.log(chalk.green("✅ Already logged in"));
        this.isLoggedIn = true;
        return true;
      }

      console.log(chalk.yellow("🔐 Login required..."));

      const credentials = this.config.getAuthCredentials();

      if (!this.config.hasAuthCredentials()) {
        return await this.handleMissingCredentials();
      }

      return await this.performAutomaticLogin(credentials as LoginCredentials);
    } catch (error) {
      console.error(
        chalk.red("❌ Error during login attempt:"),
        (error as Error).message
      );
      return false;
    }
  }

  /**
   * Check if a user is already logged in by examining page elements.
   * Looks for the presence/absence of login links to determine authentication status.
   *
   * @returns true if already logged in, false otherwise
   * @private
   */
  private async checkIfAlreadyLoggedIn(): Promise<boolean> {
    try {
      const page = await this.browserManager.getPage();

      // Check if we're already logged in by looking for the specific login/signup link
      const loginSignupLink = page.locator(
        'a[aria-label="Log in / Sign up"][href="/login"]'
      );

      return !(await loginSignupLink
        .isVisible({ timeout: 3000 })
        .catch(() => false));
    } catch (error) {
      console.log(
        chalk.yellow(
          `Warning checking login status: ${(error as Error).message}`
        )
      );
      return false;
    }
  }

  /**
   * Handle the case when authentication credentials are missing from environment.
   * Provides different strategies based on headless mode:
   * - In non-headless mode: Navigate to login page and wait for manual login
   * - In headless mode: Warn user and continue without authentication
   *
   * @returns true if the flow ends with a logged-in session
   * @example
   * ```javascript
   * // Non-headless mode - user can log in manually
   * const config = new Config({ headless: false });
   * // ... browser will open for manual login
   *
   * // Headless mode - continues without authentication
   * const config = new Config({ headless: true });
   * // ... shows warning but continues
   * ```
   * @private
   */
  private async handleMissingCredentials(): Promise<boolean> {
    console.log(
      chalk.yellow("⚠️  No credentials found in environment variables.")
    );
    console.log(
      chalk.yellow(
        "⚠️  Set UNSPLASH_EMAIL and UNSPLASH_PASSWORD to enable auto-login."
      )
    );

    if (!this.config.get("headless")) {
      console.log(chalk.yellow("⚠️  Please log in manually in the browser..."));

      // In non-headless mode, navigate to login page for manual login
      await this.browserManager.navigateToUrl("https://unsplash.com/login");

      console.log(
        chalk.yellow("⏳ Waiting for manual login... (Press Enter when done)")
      );

      // Wait for user to complete login manually
      await this.waitForManualLogin();

      this.isLoggedIn = true;
      return true;
    } else {
      console.log(
        chalk.yellow("⚠️  Running in headless mode without credentials.")
      );
      console.log(chalk.yellow("⚠️  Downloads may be limited or fail."));
      return false;
    }
  }

  /**
   * Wait for the user to complete manual login and press Enter.
   * Creates a readline interface to pause execution until user confirms login completion.
   * Only used in non-headless mode when credentials are missing.
   *
   * @returns Resolves when user presses Enter
   * @private
   */
  private async waitForManualLogin(): Promise<void> {
    const readline = await import("readline");
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise<void>((resolve) => {
      rl.question("Press Enter after logging in...", () => {
        rl.close();
        resolve();
      });
    });
  }

  /**
   * Perform automatic login using provided email and password credentials.
   * Navigates to the login page, fills form fields, submits, and verifies success.
   *
   * @param credentials - Email and password for login
   * @returns true if login succeeds, false otherwise
   * @throws Does not throw - catches and logs errors internally
   * @example
   * ```javascript
   * const credentials = { email: 'user@example.com', password: 'secret' };
   * const success = await authService.performAutomaticLogin(credentials);
   * if (success) {
   *   console.log('Auto-login successful');
   * }
   * ```
   * @private
   */
  private async performAutomaticLogin(
    credentials: LoginCredentials
  ): Promise<boolean> {
    try {
      // Navigate directly to login page
      console.log(chalk.blue("🔗 Navigating to login page..."));
      await this.browserManager.navigateToUrl("https://unsplash.com/login");

      const page = await this.browserManager.getPage();

      // Wait for a login form to appear
      await page.waitForSelector('input[name="email"], input[type="email"]', {
        timeout: 10000,
      });

      console.log(chalk.blue("📝 Filling in credentials..."));

      // Fill in email
      await page.fill(
        'input[name="email"], input[type="email"]',
        credentials.email
      );

      // Wait for the password field and fill it
      await page.waitForSelector(
        'input[name="password"], input[type="password"]',
        { timeout: 5000 }
      );
      await page.fill(
        'input[name="password"], input[type="password"]',
        credentials.password
      );

      console.log(chalk.blue("🚀 Submitting login form..."));

      // Submit login form
      const loginSubmitButton = page
        .locator(
          'button:has-text("Login"), button[type="submit"]:has-text("Login"), input[type="submit"][value="Login"]'
        )
        .first();

      await loginSubmitButton.click();

      // Wait for navigation
      console.log(chalk.blue("⏳ Waiting for login to complete..."));

      // Wait a moment for the login to process
      await page.waitForTimeout(3000);

      // Navigate to homepage to ensure we're in the right place
      await this.browserManager.navigateToUrl("https://unsplash.com");

      // Verify login was successful
      const stillNeedsLogin = await page
        .locator('a[aria-label="Log in / Sign up"][href="/login"]')
        .isVisible({ timeout: 3000 })
        .catch(() => false);

      if (stillNeedsLogin) {
        throw new Error("Login did not complete successfully");
      }

      console.log(chalk.green("✅ Successfully logged in"));
      this.isLoggedIn = true;
      return true;
    } catch (error) {
      console.log(
        chalk.yellow("⚠️  Auto-login failed:", (error as Error).message)
      );
      console.log(chalk.yellow("⚠️  Continuing without authentication..."));
      return false;
    }
  }

  /**
   * Reset authentication state to unauthenticated.
   * Clears the internal login flag, useful for testing or when switching users.
   * Does not perform any browser operations - only resets internal state.
   *
   * @example
   * ```javascript
   * const authService = new AuthenticationService(config, browserManager);
   * await authService.attemptLogin();
   * console.log(authService.isAuthenticated()); // true
   *
   * authService.reset();
   * console.log(authService.isAuthenticated()); // false
   * ```
   */
  reset(): void {
    this.isLoggedIn = false;
  }
}
