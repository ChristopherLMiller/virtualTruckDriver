import { createLogger, format, transports } from 'winston';

// Format of the log file
const { combine, timestamp, label, printf } = format;
const logFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

export const logger = createLogger({
  level: 'info',
  format: combine(label({ label: 'Event' }), timestamp(), logFormat),
  transports: [
    new transports.Console(),
    new transports.File({ filename: __dirname + '/logs/app.log' }),
  ],
});
