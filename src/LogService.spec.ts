import { Category, ErrorCode, Level } from "./enum";
import { ILogEntry, ILogErrorEntry } from "./interfaces";
import { ErrorCodeDefaultDesciption, LogService } from "./LogService";
import { testCases } from "./__mocks__/data";

const mockedPrivateLogger = {
  log: jest.fn(),
};

const mockCreateLogger = jest.fn((config: unknown) => {
  return mockedPrivateLogger;
});

jest.mock("winston", () => {
  return {
    ...jest.requireActual("winston"),
    createLogger: jest
      .fn()
      .mockImplementation((args) => mockCreateLogger(args)),
  };
});

const mockedCorrelationId = "135f5dc6-428e-42cd-af57-17d8d5bd215f";

jest.mock("express-correlation-id", () => {
  return {
    // getId: jest.fn().mockReturnValue("135f5dc6-428e-42cd-af57-17d8d5bd215f"),
    getId: jest
      .fn()
      .mockImplementation(() => "135f5dc6-428e-42cd-af57-17d8d5bd215f"),
  };
});

describe("LogService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetModules();
    jest.resetAllMocks();
  });

  describe("constructor", () => {
    it("should call createLogger on new LogService(level)", () => {
      const level = Level.error;
      new LogService(level);
      expect(mockCreateLogger).toBeCalledTimes(1);
      expect(mockCreateLogger).toBeCalledWith({
        level,
        format: expect.any(Object),
        transports: expect.any(Object),
      });
    });

    it("should call createLogger on new LogService() [default params]", () => {
      new LogService();
      expect(mockCreateLogger).toBeCalledTimes(1);
      expect(mockCreateLogger).toBeCalledWith({
        level: Level.verbose,
        format: expect.any(Object),
        transports: expect.any(Object),
      });
    });
  });

  describe("_transformData", () => {
    it.each(testCases._transformData)(
      "should return the expected string",
      (params) => {
        const { info, expectedResult } = params;
        const logger = new LogService();
        const result = logger["_transformData"](info);
        expect(result).toEqual(expectedResult);
      }
    );
  });

  describe("_parseMetadata", () => {
    it.each(testCases._parseMetadata)(
      "should return the metadata object stringified",
      (params) => {
        const { metadata, expectedResult } = params;
        const logger = new LogService();
        const result = logger["_parseMetadata"](metadata);
        expect(result).toBe(expectedResult);
      }
    );
  });

  describe("exception", () => {
    it("should log logEntry", () => {
      const logger = new LogService();
      const logEntry: ILogErrorEntry = {
        context: "testing.context",
        errorCode: ErrorCode.INVALID_BODY,
        metadata: {
          data: "TEST",
          description: "Testing Metadata",
          value: 12,
        },
      };
      logger.exception(logEntry);
      expect(mockedPrivateLogger.log).toHaveBeenCalledTimes(1);
      expect(mockedPrivateLogger.log).toHaveBeenCalledWith({
        ...logEntry,
        level: Level.warn,
        category: Category.EXCEPTION,
        message: ErrorCodeDefaultDesciption[ErrorCode.INVALID_BODY],
        correlationId: mockedCorrelationId,
      });
    });
  });

  describe("operational", () => {
    it("should log logEntry", () => {
      const logger = new LogService();
      const logEntry: ILogEntry = {
        message: "Message of operational log",
        context: "testing.context",
      };
      logger.operational(logEntry);
      expect(mockedPrivateLogger.log).toHaveBeenCalledTimes(1);
      expect(mockedPrivateLogger.log).toHaveBeenCalledWith({
        ...logEntry,
        level: Level.info,
        category: Category.OPERATIONAL,
        correlationId: mockedCorrelationId,
        metadata: undefined,
      });
    });
  });

  describe("request", () => {
    it("should log logEntry", () => {
      const logger = new LogService();
      const logEntry: ILogEntry = {
        context: "testing.context",
        metadata: {
          data: "TEST",
          description: "Testing Metadata",
          value: 12,
        },
      };
      logger.request(logEntry);
      expect(mockedPrivateLogger.log).toHaveBeenCalledTimes(1);
      expect(mockedPrivateLogger.log).toHaveBeenCalledWith({
        ...logEntry,
        level: Level.http,
        category: Category.REQUEST,
        correlationId: mockedCorrelationId,
        message: "",
      });
    });
  });

  describe("response", () => {
    it("should log logEntry", () => {
      const logger = new LogService();
      const logEntry: ILogEntry = {
        context: "testing.context",
        metadata: {
          data: "TEST",
          description: "Testing Metadata",
          value: 12,
        },
      };
      logger.response(logEntry);
      expect(mockedPrivateLogger.log).toHaveBeenCalledTimes(1);
      expect(mockedPrivateLogger.log).toHaveBeenCalledWith({
        ...logEntry,
        level: Level.http,
        category: Category.RESPONSE,
        correlationId: mockedCorrelationId,
        message: "",
      });
    });
  });

  describe("serviceRequest", () => {
    it("should log logEntry", () => {
      const logger = new LogService();
      const logEntry: ILogEntry = {
        context: "testing.context",
      };
      logger.serviceRequest(logEntry);
      expect(mockedPrivateLogger.log).toHaveBeenCalledTimes(1);
      expect(mockedPrivateLogger.log).toHaveBeenCalledWith({
        ...logEntry,
        level: Level.http,
        category: Category.SERVICE_REQUEST,
        correlationId: mockedCorrelationId,
        message: "",
        metadata: undefined,
      });
    });
  });

  describe("serviceResponse", () => {
    it("should log logEntry", () => {
      const logger = new LogService();
      const logEntry: ILogEntry = {
        metadata: [1, 2, 3],
      };
      logger.serviceResponse(logEntry);
      expect(mockedPrivateLogger.log).toHaveBeenCalledTimes(1);
      expect(mockedPrivateLogger.log).toHaveBeenCalledWith({
        ...logEntry,
        level: Level.http,
        category: Category.SERVICE_RESPONSE,
        correlationId: mockedCorrelationId,
        message: "",
        context: undefined,
      });
    });
  });

  describe("system", () => {
    it("should log logEntry", () => {
      const logger = new LogService();
      const logEntry: ILogEntry = {
        message: "This is a SYSTEM MESSAGE",
        context: "testing.context",
        metadata: {},
      };
      logger.system(logEntry);
      expect(mockedPrivateLogger.log).toHaveBeenCalledTimes(1);
      expect(mockedPrivateLogger.log).toHaveBeenCalledWith({
        ...logEntry,
        level: Level.verbose,
        category: Category.SYSTEM,
        correlationId: mockedCorrelationId,
      });
    });
  });

  describe("debug", () => {
    it("should log logEntry", () => {
      const logger = new LogService();
      const logEntry: ILogEntry = {
        message: "This is a message",
        context: "testing.context",
      };
      logger.debug(logEntry);
      expect(mockedPrivateLogger.log).toHaveBeenCalledTimes(1);
      expect(mockedPrivateLogger.log).toHaveBeenCalledWith({
        ...logEntry,
        level: Level.debug,
        category: Category.DEBUG,
        correlationId: mockedCorrelationId,
      });
    });
  });
});
