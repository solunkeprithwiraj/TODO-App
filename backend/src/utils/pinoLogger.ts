import pino from "pino";

// Create logger instance
// In development, use pretty printing. In production, use JSON logging.
const pinoLoggerConfig = pino({
  level: process.env.LOG_LEVEL || "info",
  transport:
    process.env.NODE_ENV === "production"
      ? undefined
      : {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "HH:MM:ss Z",
            ignore: "pid,hostname",
            singleLine: false,
            hideObject: false,
          },
        },
});

export const pinoLogger = {
  warn(message: string, data?: any): void {
    if (data) {
      pinoLoggerConfig.warn({ ...data }, message);
    } else {
      pinoLoggerConfig.warn(message);
    }
  },

  error(message: string, data?: any): void {
    if (data) {
      pinoLoggerConfig.error({ ...data }, message);
    } else {
      pinoLoggerConfig.error(message);
    }
  },

  success(message: string, data?: any): void {
    // Pino doesn't have a "success" level, so we use info with a success indicator
    if (data) {
      pinoLoggerConfig.info({ ...data, success: true }, message);
    } else {
      pinoLoggerConfig.info({ success: true }, message);
    }
  },

  info(message: string, data?: any): void {
    if (data) {
      pinoLoggerConfig.info({ ...data }, message);
    } else {
      pinoLoggerConfig.info(message);
    }
  },

  debug(message: string, data?: any): void {
    if (data) {
      pinoLoggerConfig.debug({ ...data }, message);
    } else {
      pinoLoggerConfig.debug(message);
    }
  },
};
