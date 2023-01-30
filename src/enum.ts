// istanbul ignore file
// WHY?: Nothing to test.

/** @see https://github.com/winstonjs/winston#logging */
// This values can't be at UpperCase, otherwise winston wont recognise them
export enum Level {
  error = "error",
  warn = "warn",
  info = "info",
  http = "http",
  verbose = "verbose",
  debug = "debug",
  silly = "silly",
}

export enum Category {
  DEBUG = "DEBUG",
  SYSTEM = "SYSTEM",
  REQUEST = "REQUEST",
  RESPONSE = "RESPONSE",
  SERVICE_REQUEST = "SERVICE_REQUEST",
  SERVICE_RESPONSE = "SERVICE_RESPONSE",
  OPERATIONAL = "OPERATIONAL",
  EXCEPTION = "EXCEPTION",
}

export enum ErrorCode {
  CONFLICT = "CONFLICT",
  DB_DUPLICATED_ENTRY = "DUPLICATE_ENTRY",
  DB_INVALID_PARAMS = "DB_INVALID_PARAMS",
  EXPIRED_TOKEN = "EXPIRED_TOKEN",
  INVALID_BODY = "INVALID_BODY",
  INVALID_PASSWORD = "INVALID_PASSWORD",
  INVALID_QUERY = "INVALID_QUERY",
  NOT_ALLOWED = "NOT_ALLOWED",
  NOT_FOUND = "NOT_FOUND",
  TOKEN_INVALID = "TOKEN_INVALID",
  UNAUTHORIZED = "UNAUTHORIZED",
  UNCAUGHT_EXCEPTION = "UNCAUGHT_EXCEPTION",
  UNPROCESSED_MESSAGE = "UNPROCESSED_MESSAGE",
}
