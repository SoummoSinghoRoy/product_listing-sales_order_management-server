import { LoggerService, Injectable, LogLevel } from "@nestjs/common";
import { winstonLogger } from "./winston-logger.config";

@Injectable()
export class WinstonLogger implements LoggerService {
  log(message: any, ...optionalParams: any[]) {
    winstonLogger.info( message)
  };

  error(message: any, ...optionalParams: any[]) {
    winstonLogger.error(message)
  };

  warn(message: any, ...optionalParams: any[]) {
    throw new Error("Method not implemented.");
  };

  debug?(message: any, ...optionalParams: any[]) {
    throw new Error("Method not implemented.");
  };

  verbose?(message: any, ...optionalParams: any[]) {
    throw new Error("Method not implemented.");
  };

  fatal?(message: any, ...optionalParams: any[]) {
    throw new Error("Method not implemented.");
  };

  setLogLevels?(levels: LogLevel[]) {
    throw new Error("Method not implemented.");
  };
}