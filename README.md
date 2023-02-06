# @cliengo/logger

Log library. It provides methods for logging information with different levels of criticality  in a structured fashion. It's based on [winston](https://github.com/winstonjs/winston#readme), so if [new-relic](https://docs.newrelic.com/docs/apm/agents/nodejs-agent/getting-started/introduction-new-relic-nodejs/) is configured, it will automatically forward the logs.

## Installation

Run `npm install @cliengo/logger`.

## Usage

A new instance of the LogService has to be created to log data:

```typescript
import { LogService, Level, ErrorCode } from '@cliengo/logger'

// The log level can be set on creation. By default: Leve.verbose 
const logger = new LogService(Level.info)

export async function getEvents() {
  try {
    // some business logic here
  } catch (error) {
    logger.exception({
      context: "GoogleCalendarService.getEvents",
      errorCode: ErrorCode.UNCAUGHT_EXCEPTION,
      message: "Cannot retreive events for Calendar.",
      metadata: { error },
    });
  }
}
```

The usage of [Singleton pattern](https://refactoring.guru/design-patterns/singleton/typescript/example) is one alternative to create one instance for the entire application.

Logs will be logged in the console and to new-relic (in case it is configured). In case of an error, the previous code will log:

* **Level**: `SILLY | DEBUG | VERBOSE | HTTP | INFO | WARN | ERROR`

* **Category**: `DEBUG | SYSTEM| REQUEST | RESPONSE | SERVICE_REQUEST | SERVICE_RESPONSE | OPERATIONAL | ERROR`

* **errorCode**: Used to categorize errors.

* **CorrelationId**: Used to track a HTTP request through more than one service.

* **Context**: Class and method or function where the data is logged.

* **Message**: description of the error/information logged.

* **Metadata**: object for giving further information.

`[ERROR] | [EXCEPTION] | [errorCode]: UNCAUGHT_EXCEPTION |  [CorrelationId]: oki-e484-iejndfewu2 | [Context]: GoogleCalendarService.getEvents | [Message]: Cannot retreive events for Calendar. | [Metadata]: { message: "Reached the max retries per request limit (which is 0). Refer to "maxRetriesPerRequest" option for details" }`

The following `LogService` class methods are provided for logging information. They are sorted the in descending order of criticality:

```typescript
import { LogService } from '@cliengo/logger'
const logger = new LogService()

// logs a handled business error
logger.exception({
  errorCode: ErrorCode.DUPLICATE_ENTRY,
  context: "GoogleCalendarService.inserEvent",
  message: "Cannot save object in database.",
  metadata: { id; 12 }
})

// logs an operation, like database access
logger.operational({
  context: "GoogleCalendarService.inserEvent",
  message: "Object saved in database",
  metadata: { id; 12 }
})

// logs a incoming http request
logger.request({
  context: "Request.handleRequest",
  message: "Incoming Http Request",
  metadata: { 
    method: req.method,
    path: req.path,
    body: req.body,
    params: req.params
  }
})

// logs a http response from this service
logger.response({
  context: "ResponseModule.buildResponse",
  message: "HTTP Response",
  metadata: { 
    method: res.method,
    path: res.path,
    body: res.body,
    params: res.params
  }
})

//logs a http request to external services
logger.serviceRequest({
  context: "HttpClient",
  message: "Outgoing Http Request",
  metadata: { 
    method: req.method,
    path: req.path,
    body: req.body,
    params: req.params
  }
})

// logs a http response from external services
logger.serviceResponse({
  context: "HttpClient",
  message: "Service response",
  metadata: { 
    result
  }
})

//logs system events, like listen port number or configuration details
logger.system({
  context: 'server.listen',
  message: `Server running at port ${environment.PORT} in ${env}`
})

// logs information for debuggin purposes
logger.debug({
  message: "THIS SHOULD NOT BE LOGGINGG!!!! SHUSH "
})
```

### Levels

Logs level in order of criticality are the following:

```javascript
{
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
}
```

The corresponding Level ⇆ provided logging method:

| Level     | method                                                                       |
| --------- | ---------------------------------------------------------------------------- |
| `ERROR`   | `exception()`                                                                |
| `INFO`    | `operational()`                                                              |
| `HTTP`    | `request()`<br>`response()`<br>`serviceRequest()`<br>`serviceResponse()`<br> |
| `VERBOSE` | `system()`                                                                   |
| `DEBUG`   | `debug()`                                                                    |

Logs will be logged on depending on the level set at the moment of creation:

```typescript
import { LogService, Level } from '@cliengo/logger'

const logger = new LogService(Level.http)

// This will be logged
logger.request({
  context: "Request.handleRequest",
  message: "Incoming Http Request",
  metadata: { 
    method: req.method,
    path: req.path,
    body: req.body,
    params: req.params
  }
})

// This will not be logged
logger.system({
  context: 'server.listen',
  message: `Server running at port ${environment.PORT} in ${env}`
})
```

The usage of an environment variable is recommended to set loggin level throught different environments:

```properties
LOG_LEVEL='debug'
```

```typescript
import { LogService } from '@cliengo/logger'
const logger = new LogService(process.env.LOG_LEVEL)
```

### Correlation id

The `correlation-id` is a unique Id generated on every incoming HTTP request. It's useful to track a request that makes use of several services in a microservices environment.

In case the incoming request has a header named `x-correlation-id`, this data will be used as correlation-id. Otherwise `@cliengo/logger` will generate it.

The following example shows a service that get googleCalendar events and return them to the client:

1. `[HTTP] | [REQUEST] | [CorrelationId]: 062cfc27-1126-453a-9ed9-726f6959b4f6 | [Context]: loggerRequestMiddleware | [Metadata]: {"path":"/company/621637b4fbab760026487fa9/calendar-services/2/available-date-times","params":{},"body":{}}`

2. `[HTTP] | [SERVICE_REQUEST] | [CorrelationId]: 062cfc27-1126-453a-9ed9-726f6959b4f6 | [Context]: GoogleCalendarService.getEvents | [Metadata]: {"path":"calendar.events.list","body":{"calendarId":"c_2lg52eq7kk2bu8dq3ieoeb9g5k@group.calendar.google.com","timeMin":"2023-02-20T10:00:00-03:00","timeMax":"2023-02-21T10:00:00-03:00"}}`

3. `[HTTP] | [SERVICE_RESPONSE] | [CorrelationId]: 062cfc27-1126-453a-9ed9-726f6959b4f6 | [Context]: GoogleCalendarService.getEvents | [Metadata]: {"path":"calendar.events.list","data":{"kind":"calendar#events","etag":"\"p33c8fftngaovo0g\"","summary":"Google Calendar Demo","description":"Google Calendar Demo (30/08/2022)","updated":"2023-01-05T18:05:54.647Z","timeZone":"America/Argentina/Buenos_Aires","accessRole":"writer","defaultReminders":[],"nextSyncToken":"CNiHv7eCsfwCENiHv7eCsfwCGAQghfra8AE=","items":[]}}`

4. `[HTTP] | [RESPONSE] | [CorrelationId]: 062cfc27-1126-453a-9ed9-726f6959b4f6 | [Context]: Company | [Message]: The request has been successful | [Metadata]: {"data":{"dateAvailability":true,"availableDateTimes":[{"startDateTime":"2023-02-20T10:00:00-03:00","endDateTime":"2023-02-20T11:00:00-03:00"},{"startDateTime":"2023-02-20T11:00:00-03:00","endDateTime":"2023-02-20T12:00:00-03:00"}],"utcOffset":-3},"message":"Estos son los horarios disponibles para el Lunes 20/02/2023"}`

#### Usage of correlation-id

To propagate the correlation id to other microservices, it should be sent as `x-correlation-id` header in the outgoing HTTP request.

```typescript
import { correlator } from "@cliengo/logger";
import axios from "axios";

const result = await axios.get("https://catfact.ninja/fact", {
  headers: { "x-correlation-id": correlator.getId() },
});
```

## Forwarding to new-relic

Install the [package](https://github.com/newrelic/node-newrelic) and configure the tool. Usage of [environment variables](https://docs.newrelic.com/docs/apm/agents/nodejs-agent/installation-configuration/nodejs-agent-configuration/#environment) is recommended.

Example:

```properties
NEW_RELIC_APP_NAME="name_of_the_app_here"
NEW_RELIC_LICENSE_KEY="the_numeric_key_here"

NEW_RELIC_LOG="stdout"
NEW_RELIC_LOG_ENABLED=true
NEW_RELIC_NO_CONFIG_FILE=true

#To disable forwarding logs to new relic, set this to false
NEW_RELIC_ENABLED=true
```

Since `@cliengo/logger` is based on winston, the forwarding will be automatic.
