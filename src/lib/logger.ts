/**
 * Logger utility for consistent logging across the application.
 * In development, logs to console. In production, only errors are logged.
 */

const isDevelopment = process.env.NODE_ENV === "development";

export const logger = {
  /**
   * Log informational messages (development only)
   */
  log: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.log(message, ...args);
    }
  },

  /**
   * Log warning messages (development only)
   */
  warn: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.warn(message, ...args);
    }
  },

  /**
   * Log error messages (always logged)
   * In production, this could be extended to send to error tracking service
   */
  error: (message: string, error?: Error | unknown, ...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.error(message, error, ...args);

    // In production, you could send to error tracking service like Sentry
    // if (!isDevelopment && error instanceof Error) {
    //   sendToErrorTracking(error, message);
    // }
  },

  /**
   * Log debug messages (development only)
   */
  debug: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      // eslint-disable-next-line no-console
      console.debug(message, ...args);
    }
  },
};
