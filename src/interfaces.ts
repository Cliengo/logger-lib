// istanbul ignore file
import { ErrorCode } from "./enum";

/** Interface for a single log register */
export type ILogEntry = {
  /** name of class+method or function where the log is called */
  context?: string;

  /** description of the logged action */
  message?: string;

  /** object for giving further information */
  metadata?: unknown;
};

/** Interface for a single error log register */
export type ILogErrorEntry = {
  /** name of class+method or function where the log is called */
  context?: string;

  /** description of the logged action */
  message?: string;

  /** object for giving further information */
  metadata?: unknown;

  /** standard code of the error */
  errorCode: ErrorCode | string;
};

/** Interface that expose LogService */
export interface ILogger {
  /** logs a handled business error
   * @param {string} [entry.context] name of class+method or function where the log is called (optional)
   * @param {string} [entry.message] string description of the logged action (optional)
   * @param {unknown} [entry.metadata] object for giving further information (optional)
   * @param {ErrorCode} entry.errorCode standard code of the error
   */
  exception(entry: ILogErrorEntry): void;

  /** logs a handled server error
   * @param {string} [entry.context] name of class+method or function where the log is called (optional)
   * @param {string} [entry.message] string description of the logged action (optional)
   * @param {unknown} [entry.metadata] object for giving further information (optional)
   * @param {ErrorCode} entry.errorCode standard code of the error
   */
  serverError(entry: ILogErrorEntry): void;

  /** logs an operation, like database access
   * @param {string} [entry.context] name of class+method or function where the log is called (optional)
   * @param {string} [entry.message] string description of the logged action (optional)
   * @param {unknown} [entry.metadata] object for giving further information (optional)
   */
  operational(entry: ILogEntry): void;

  /** logs a incoming http request
   * @param {string} [entry.context] name of class+method or function where the log is called (optional)
   * @param {string} [entry.message] string description of the logged action (optional)
   * @param {unknown} [entry.metadata] object for giving further information (optional)
   */
  request(entry: ILogEntry): void;

  /** logs a http response from this service
   * @param {string} [entry.context] name of class+method or function where the log is called (optional)
   * @param {string} [entry.message] string description of the logged action (optional)
   * @param {unknown} [entry.metadata] object for giving further information (optional)
   */
  response(entry: ILogEntry): void;

  /** logs a http request to external services
   * @param {string} [entry.context] name of class+method or function where the log is called (optional)
   * @param {string} [entry.message] string description of the logged action (optional)
   * @param {unknown} [entry.metadata] object for giving further information (optional)
   */
  serviceRequest(entry: ILogEntry): void;

  /** logs a http response from external services
   * @param {string} [entry.context] name of class+method or function where the log is called (optional)
   * @param {string} [entry.message] string description of the logged action (optional)
   * @param {unknown} [entry.metadata] object for giving further information (optional)
   */
  serviceResponse(entry: ILogEntry): void;

  /** logs system events, like listen port number or configuration details
   * @param {string} [entry.context] name of class+method or function where the log is called (optional)
   * @param {string} [entry.message] string description of the logged action (optional)
   * @param {unknown} [entry.metadata] object for giving further information (optional)
   */
  system(entry: ILogEntry): void;

  /** logs information for debuggin purposes"
   * @param {string} [entry.context] name of class+method or function where the log is called (optional)
   * @param {string} [entry.message] string description of the logged action (optional)
   * @param {unknown} [entry.metadata] object for giving further information (optional)
   */
  debug(entry: ILogEntry): void;
}
