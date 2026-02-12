// ===========================================
// Logger - Winston structured logging
// ===========================================

const { createLogger, format, transports } = require('winston');
const config = require('./config');

const logger = createLogger({
  level: config.env === 'production' ? 'info' : 'debug',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.errors({ stack: true }),
    format.json()
  ),
  defaultMeta: { service: 'flowbase-api' },
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(({ timestamp, level, message, ...meta }) => {
          const metaStr = Object.keys(meta).length > 1
            ? ` ${JSON.stringify(meta)}`
            : '';
          return `${timestamp} [${level}]: ${message}${metaStr}`;
        })
      ),
    }),
  ],
});

// In production, also log to file
if (config.env === 'production') {
  logger.add(new transports.File({ filename: 'logs/error.log', level: 'error' }));
  logger.add(new transports.File({ filename: 'logs/combined.log' }));
}

module.exports = logger;
