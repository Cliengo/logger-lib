/* eslint-disable no-useless-escape */
import { Category, ErrorCode, Level } from "../enum";

export const testCases = {
  _transformData: [
    {
      info: {
        level: Level.verbose,
        category: Category.SYSTEM,
        context: "server.listen",
        message: "Server running at port 4000 in local",
      },
      expectedResult:
        "[VERBOSE] | [SYSTEM] | [Context]: server.listen | [Message]: Server running at port 4000 in local",
    },
    {
      info: {
        level: Level.http,
        category: Category.REQUEST,
        correlationId: "f96d1ca1-39ae-40ec-9a41-d46f30c27430",
        context: "loggerRequestMiddleware",
        message: null,
        metadata: {
          path: "/company/621637b4fbab760026487fa9/calendar-services/2/available-date-times",
          params: {},
          body: {},
        },
      },
      expectedResult:
        '[HTTP] | [REQUEST] | [CorrelationId]: f96d1ca1-39ae-40ec-9a41-d46f30c27430 | [Context]: loggerRequestMiddleware | [Metadata]: {"path":"/company/621637b4fbab760026487fa9/calendar-services/2/available-date-times","params":{},"body":{}}',
    },
    {
      info: {
        level: Level.error,
        category: Category.EXCEPTION,
        correlationId: "f96d1ca1-39ae-40ec-9a41-d46f30c27430",
        context: "Company",
        message: "Invalid body, query or params",
        metadata: {
          data: [
            {
              message:
                '"start-date" must be greater than or equal to "2023-01-28T00:00:00.000Z"',
              path: ["start-date"],
              type: "date.min",
              context: {
                limit: "2023-01-28T00:00:00.000Z",
                value: "2023-01-27T00:00:00.000Z",
                label: "start-date",
                key: "start-date",
              },
            },
          ],
        },
        errorCode: ErrorCode.INVALID_BODY,
      },
      expectedResult: `[ERROR] | [EXCEPTION] | [errorCode]: INVALID_BODY | [CorrelationId]: f96d1ca1-39ae-40ec-9a41-d46f30c27430 | [Context]: Company | [Message]: Invalid body, query or params | [Metadata]: {\"data\":[{\"message\":\"\\\"start-date\\\" must be greater than or equal to \\\"2023-01-28T00:00:00.000Z\\\"\",\"path\":[\"start-date\"],\"type\":\"date.min\",\"context\":{\"limit\":\"2023-01-28T00:00:00.000Z\",\"value\":\"2023-01-27T00:00:00.000Z\",\"label\":\"start-date\",\"key\":\"start-date\"}}]}`,
    },
  ],
  _parseMetadata: [
    {
      metadata: {
        path: "/company/621637b4fbab760026487fa9/calendar-services/2/available-date-times",
        params: {},
        body: {},
      },
      expectedResult:
        '{"path":"/company/621637b4fbab760026487fa9/calendar-services/2/available-date-times","params":{},"body":{}}',
    },
    {
      metadata: {
        data: [
          {
            message:
              '"start-date" must be greater than or equal to "2023-01-28T00:00:00.000Z"',
            path: ["start-date"],
            type: "date.min",
            context: {
              limit: "2023-01-28T00:00:00.000Z",
              value: "2023-01-27T00:00:00.000Z",
              label: "start-date",
              key: "start-date",
            },
          },
        ],
      },
      expectedResult: `{\"data\":[{\"message\":\"\\\"start-date\\\" must be greater than or equal to \\\"2023-01-28T00:00:00.000Z\\\"\",\"path\":[\"start-date\"],\"type\":\"date.min\",\"context\":{\"limit\":\"2023-01-28T00:00:00.000Z\",\"value\":\"2023-01-27T00:00:00.000Z\",\"label\":\"start-date\",\"key\":\"start-date\"}}]}`,
    },
    {
      metadata: "This is a Simple String",
      expectedResult: "This is a Simple String",
    },
    {
      metadata: 127,
      expectedResult: "127",
    },
    {
      metadata: [],
      expectedResult: "[]",
    },
    {
      metadata: {},
      expectedResult: "{}",
    },
    {
      metadata: "",
      expectedResult: "",
    },
    {
      metadata: null,
      expectedResult: null,
    },
    {
      metadata: undefined,
      expectedResult: undefined,
    },
  ],
};
