import { ZoneContextManager } from "@opentelemetry/context-zone";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { DocumentLoadInstrumentation } from "@opentelemetry/instrumentation-document-load";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-base";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

import { SITE, TRACES } from "$lib/consts.ts";

const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: "ecliptic_client",
});

const exporter = new OTLPTraceExporter({
  url: `${SITE}/otel/v1/traces`,
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

// Registering instrumentations
if (TRACES) {
  registerInstrumentations({
    instrumentations: [new DocumentLoadInstrumentation()],
  });
}
