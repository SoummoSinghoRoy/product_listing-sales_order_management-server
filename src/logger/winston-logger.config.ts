import * as winston from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, label, printf } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const transport: DailyRotateFile = new DailyRotateFile({
  filename: 'logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'info'
});

export const winstonLogger = winston.createLogger({
  level: 'info',
  format: combine(
    label({label: `Request log!`}),
    timestamp(),
    myFormat
  ),
  // for development mode
  // transports: [new winston.transports.Console({
  //   level: 'info',
  //   format: winston.format.combine(
  //     winston.format.colorize(),
  //     winston.format.simple()
  //   )
  // })]
  transports: [
    transport
  ]
});


