// import { SeverityNumber } from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from "@opentelemetry/sdk-logs";
import { ATTR_SERVICE_NAME } from "@opentelemetry/semantic-conventions";

// Determine if logs are enabled via localStorage override, fallback to build-time flag
const defaultLogs = import.meta.env.PUBLIC_LOGS === "true";
let logsOverride = typeof window !== "undefined"
  ? localStorage.getItem("logsEnabled")
  : undefined;

export const LOGS = logsOverride !== undefined
  ? logsOverride === "true"
  : defaultLogs;

const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: "ecliptic_client",
});

const collectorOptions = {
  url: location.href + `otel/v1/logs/`,
  headers: {},
  concurrencyLimit: 1,
};

const logExporter = new OTLPLogExporter(collectorOptions);
const loggerProvider = new LoggerProvider({ resource });

loggerProvider.addLogRecordProcessor(new BatchLogRecordProcessor(logExporter));

export const logger = loggerProvider.getLogger("default", "1.0.0");

// Emit a log
// logger.emit({
//   severityNumber: SeverityNumber.INFO,
//   severityText: "info",
//   body: "this is a log body",
//   attributes: { "log.type": "custom" },
// });
