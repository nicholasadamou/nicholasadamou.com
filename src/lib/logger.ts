/**
 * Production-ready logging utility
 * Uses appropriate log levels and minimizes logging in production
 */

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

interface LoggerConfig {
  minLevel: LogLevel;
  enabledInProduction: boolean;
}

class Logger {
  private config: LoggerConfig;

  constructor() {
    // In production, only log errors and warnings
    const isProduction = process.env.NODE_ENV === "production";

    this.config = {
      minLevel: isProduction ? LogLevel.WARN : LogLevel.DEBUG,
      enabledInProduction: true, // Allow errors/warnings even in production
    };
  }

  private shouldLog(level: LogLevel): boolean {
    const isProduction = process.env.NODE_ENV === "production";

    // In production, only allow errors and warnings
    if (isProduction && level > LogLevel.WARN) {
      return false;
    }

    return level <= this.config.minLevel;
  }

  private formatMessage(
    level: string,
    message: string,
    meta?: unknown
  ): string {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : "";
    return `[${timestamp}] ${level}: ${message}${metaStr}`;
  }

  error(message: string, error?: unknown): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(this.formatMessage("ERROR", message), error || "");
    }
  }

  warn(message: string, meta?: unknown): void {
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(this.formatMessage("WARN", message, meta));
    }
  }

  info(message: string, meta?: unknown): void {
    if (this.shouldLog(LogLevel.INFO)) {
      console.info(this.formatMessage("INFO", message, meta));
    }
  }

  debug(message: string, meta?: unknown): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(this.formatMessage("DEBUG", message, meta));
    }
  }
}

// Export singleton instance
export const logger = new Logger();
