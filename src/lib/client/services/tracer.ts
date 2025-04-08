import { ZoneContextManager } from "@opentelemetry/context-zone";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { DocumentLoadInstrumentation } from "@opentelemetry/instrumentation-document-load";
// import { UserInteractionInstrumentation } from "@opentelemetry/instrumentation-user-interaction";
import { resourceFromAttributes } from "@opentelemetry/resources";
// import { LoggerProvider } from "@opentelemetry/sdk-logs";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

import { BASE, SITE, TRACES } from "$lib/client/consts.ts";

const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: "ecliptic_client",
});

const exporter = new OTLPTraceExporter({
  url: `${SITE + BASE}otel/v1/traces/`,
});

const provider = new WebTracerProvider({
  resource,
  spanProcessors: [
    new BatchSpanProcessor(exporter),
    // new SimpleSpanProcessor(new ConsoleSpanExporter()),
  ],
});

provider.register({
  // Changing default contextManager to use ZoneContextManager - supports asynchronous operations - optional
  contextManager: new ZoneContextManager(),
});

// const loggerProvider = new LoggerProvider({ resource });

// Registering instrumentations
if (TRACES) {
  registerInstrumentations({
    // loggerProvider: loggerProvider,
    instrumentations: [
      new DocumentLoadInstrumentation(),
      // new UserInteractionInstrumentation(),
    ],
  });
}
