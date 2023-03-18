import correlator from "express-correlation-id";
import { TransformableInfo } from "logform";
import util from "util";
import {
  createLogger,
  format,
  Logger,
  LoggerOptions,
  transports,
} from "winston";

import { Category, ErrorCode, Level } from "./enum";
import { ILogEntry, ILogErrorEntry, ILogger } from "./interfaces";

/**
 * Map of default message used in case a message in LogErrorEntry is not provided
 */
const ErrorCodeDefaultDesciption: Record<ErrorCode, string> = {
  [ErrorCode.CONFLICT]: "Conflict with server current state",
  [ErrorCode.DB_DUPLICATED_ENTRY]: "Cannot save duplicated entry in database",
  [ErrorCode.DB_INVALID_PARAMS]:
    "It is not possible to connect to the database, invalid parameters",
  [ErrorCode.EXPIRED_TOKEN]: "Token provided is expired",
  [ErrorCode.INVALID_BODY]: "Invalid body for HTTP request",
  [ErrorCode.INVALID_PASSWORD]: "Invalid provided password",
  [ErrorCode.INVALID_QUERY]: "Invalid query",
  [ErrorCode.NOT_ALLOWED]: "User is not authorized",
  [ErrorCode.NOT_FOUND]: "Cannot find requested resource",
  [ErrorCode.TOKEN_INVALID]: "Invalid provided token",
  [ErrorCode.UNAUTHORIZED]: "Client is not authorized to access resource",
  [ErrorCode.UNCAUGHT_EXCEPTION]: "Uncaught exception",
  [ErrorCode.UNPROCESSED_MESSAGE]: "Unprocessed message",
};

/**
 * Logger class. Contains methods to log structured information in standard output (Console).
 * @see https://www.notion.so/equipoldk/Guia-de-Logging-101-Propuesta-b0bd0053a3064836af31f4f45455f4c0
 */
class LogService implements ILogger {
  private readonly logger: Logger;
  private readonly level: Level;

  /**
   * Creates a new Logger
   * @param {Level} [level] maximum level of messages that will be logged (verbose by default).
   */
  constructor(level: Level = Level.verbose) {
    this.level = level;
    this.logger = this._create();
  }

  private _create(): Logger {
    const config: LoggerOptions = this._getCreationOptions();

    return createLogger(config);
  }

  private _getCreationOptions(): LoggerOptions {
    return {
      level: this.level,
      format: format.printf((info) => this._transformData(info)),
      transports: [new transports.Console()],
    };
  }

  private _transformData(info: TransformableInfo): string {
    const { level } = info;
    const category = info.category ? ` | [${info.category}]` : "";
    const correlationId = info.correlationId
      ? ` | [CorrelationId]: ${info.correlationId}`
      : "";
    const context = info.context ? ` | [Context]: ${info.context}` : "";
    const message = info.message ? ` | [Message]: ${info.message}` : "";
    const metadata = info.metadata
      ? ` | [Metadata]: ${this._parseMetadata(info.metadata)}`
      : "";
    const errorCode = info.errorCode ? ` | [errorCode]: ${info.errorCode}` : "";
    return `[${level.toUpperCase()}]${category}${errorCode}${correlationId}${context}${message}${metadata}`;
  }

  private _parseMetadata(meta: unknown): unknown {
    if (meta && typeof meta === "object") {
      return JSON.stringify(meta, (_name, value) => {
        if (value instanceof Error) {
          return util.format(value);
        }
        return value;
      });
    }
    return meta ? String(meta) : meta;
  }

  /** logs a handled business error
   * @param {string} [entry.context] name of class+method or function where the log is called (optional)
   * @param {string} [entry.message] string description of the logged action (optional)
   * @param {unknown} [entry.metadata] object for giving further information (optional)
   * @param {ErrorCode} entry.errorCode standard code of the error
   */
  public exception(entry: ILogErrorEntry): void {
    const { context, message, metadata, errorCode } = entry;
    this.logger.log({
      level: Level.warn,
      message: message || ErrorCodeDefaultDesciption[errorCode],
      category: Category.EXCEPTION,
      context,
      correlationId: correlator.getId(),
      errorCode,
      metadata,
    });
  }

  /** logs a handled client error
   * @param {string} [entry.context] name of class+method or function where the log is called (optional)
   * @param {string} [entry.message] string description of the logged action (optional)
   * @param {unknown} [entry.metadata] object for giving further information (optional)
   * @param {ErrorCode} entry.errorCode standard code of the error
   */
  public serverError(entry: ILogErrorEntry): void {
    const { context, message, metadata, errorCode } = entry;
    this.logger.log({
      level: Level.error,
      message: message || ErrorCodeDefaultDesciption[errorCode],
      category: Category.EXCEPTION,
      context,
      correlationId: correlator.getId(),
      errorCode,
      metadata,
    });
  }

  /** logs an operation, like database access
   * @param {string} [entry.context] name of class+method or function where the log is called (optional)
   * @param {string} [entry.message] string description of the logged action (optional)
   * @param {unknown} [entry.metadata] object for giving further information (optional)
   */
  public operational(entry: ILogEntry): void {
    const { context, message, metadata } = entry;
    this.logger.log({
      level: Level.info,
      message: message || "",
      category: Category.OPERATIONAL,
      context,
      correlationId: correlator.getId(),
      metadata,
    });
  }

  /** logs a incoming http request
   * @param {string} [entry.context] name of class+method or function where the log is called (optional)
   * @param {string} [entry.message] string description of the logged action (optional)
   * @param {unknown} [entry.metadata] object for giving further information (optional)
   */
  public request(entry: ILogEntry): void {
    const { context, message, metadata } = entry;
    this.logger.log({
      level: Level.http,
      message: message || "",
      category: Category.REQUEST,
      context,
      correlationId: correlator.getId(),
      metadata,
    });
  }

  /** logs a http response from this service
   * @param {string} [entry.context] name of class+method or function where the log is called (optional)
   * @param {string} [entry.message] string description of the logged action (optional)
   * @param {unknown} [entry.metadata] object for giving further information (optional)
   */
  public response(entry: ILogEntry): void {
    const { context, message, metadata } = entry;
    this.logger.log({
      level: Level.http,
      message: message || "",
      category: Category.RESPONSE,
      context,
      correlationId: correlator.getId(),
      metadata,
    });
  }

  /** logs a http request to external services
   * @param {string} [entry.context] name of class+method or function where the log is called (optional)
   * @param {string} [entry.message] string description of the logged action (optional)
   * @param {unknown} [entry.metadata] object for giving further information (optional)
   */
  public serviceRequest(entry: ILogEntry): void {
    const { context, message, metadata } = entry;
    this.logger.log({
      level: Level.http,
      message: message || "",
      category: Category.SERVICE_REQUEST,
      context,
      correlationId: correlator.getId(),
      metadata,
    });
  }

  /** logs a http response from external services
   * @param {string} [entry.context] name of class+method or function where the log is called (optional)
   * @param {string} [entry.message] string description of the logged action (optional)
   * @param {unknown} [entry.metadata] object for giving further information (optional)
   */
  public serviceResponse(entry: ILogEntry): void {
    const { context, message, metadata } = entry;
    this.logger.log({
      level: Level.http,
      message: message || "",
      category: Category.SERVICE_RESPONSE,
      context,
      correlationId: correlator.getId(),
      metadata,
    });
  }

  /** logs system events, like listen port number or configuration details
   * @param {string} [entry.context] name of class+method or function where the log is called (optional)
   * @param {string} [entry.message] string description of the logged action (optional)
   * @param {unknown} [entry.metadata] object for giving further information (optional)
   */
  public system(entry: ILogEntry): void {
    const { context, message, metadata } = entry;
    this.logger.log({
      level: Level.verbose,
      message: message || "",
      category: Category.SYSTEM,
      context,
      correlationId: correlator.getId(),
      metadata,
    });
  }

  /** logs information for debuggin purposes"
   * @param {string} [entry.context] name of class+method or function where the log is called (optional)
   * @param {string} [entry.message] string description of the logged action (optional)
   * @param {unknown} [entry.metadata] object for giving further information (optional)
   */
  public debug(entry: ILogEntry): void {
    const { context, message, metadata } = entry;
    this.logger.log({
      level: Level.debug,
      message: message || "",
      category: Category.DEBUG,
      context,
      correlationId: correlator.getId(),
      metadata,
    });
  }
}

export { LogService, correlator, ErrorCodeDefaultDesciption };
