FILE: /docs/observability

# Observability & Monitoring

Astra provides world-class observability features built directly into the framework core. It follows the principle that you shouldn't have to "plug in" monitoring—it should be a first-class citizen that works from day one.

## The Three Pillars of Astra Observability

Astra integrates the three pillars of observability into every layer of the framework:

1.  **Logging**: Structured, context-aware logs with `slog`.
2.  **Tracing**: Distributed tracing via OpenTelemetry (OTEL).
3.  **Metrics**: Automated performance monitoring for HTTP, DB, and Queues.

## Structured Logging

Astra uses Go's standard `log/slog` library. When a request enters the application, Astra automatically injects metadata into the logger, including the Request ID, User ID (if authenticated), and Trace ID.

### Using the Contextual Logger
Always use the logger provided by the `Context` to ensure your logs are properly correlated.

```go
func Handle(c *http.Context) error {
    c.Logger().Info("processing donation", 
        slog.Float64("amount", 50.0),
        slog.String("currency", "USD"),
    )
    return nil
}
```

## Distributed Tracing (OpenTelemetry)

Astra is "OTEL-Native." If you configure an OpenTelemetry collector, Astra will automatically emit spans for:
- Every incoming HTTP request.
- Every database query (including parameters, if enabled).
- Every background job execution.
- Every external API call (via Astra's HTTP client).

### Configuration
Enable tracing in `astra.config.yaml`:

```yaml
telemetry:
  tracing:
    enabled: true
    endpoint: "otel-collector:4317"
    service_name: "my-astra-app"
```

## Health Checks

As discussed in the [Deployment Guide](/docs/deployment), Astra provides endpoints for automated health monitoring.

-   **Liveness (`/health`)**: Indicates if the binary is running.
-   **Readiness (`/health/ready`)**: Indicates if the app is ready to serve traffic (database is up, migrations are current).

## Request Correlation

Astra automatically generates or propagates a **Request ID** for every incoming request. This ID is:
1.  Returned in the `X-Request-ID` response header.
2.  Injected into every log line during that request.
3.  Passed to any background jobs dispatched by that request.

This allows you to trace a single user action from an HTTP click, through the database, and into a background email job by searching for one ID.

## Audit Logs

For security-sensitive applications, Astra provides an `audit` service that tracks critical actions (login, password change, data deletion).

```go
func SuspendUser(c *http.Context) error {
    // ...
    audit.Log(c.Ctx(), "user.suspended", map[string]any{
        "target_id": user.ID,
        "reason":    "violation",
    })
    // ...
}
```

## Production Tips

-   **Sample Your Traces**: In high-traffic environments, logging 100% of traces can be expensive. Astra allows you to set a sampling rate (e.g., 10%) in your config.
-   **Context Propagation**: When starting your own goroutines, always pass the `context.Context` from the Astra handler to ensure tracing and logging metadata is preserved.
-   **Alert on Error Rates**: Use your monitoring tool (Grafana, Datadog) to alert when the rate of `level=ERROR` logs or 5xx HTTP responses spikes.

## Next Steps

-   [Deployment Checklist](/docs/deployment) — Ensure your observability stack is production-ready.
-   [Testing Integration](/docs/testing) — See how to verify trace emission in your test suite.
-   [HTTP Context](/docs/http-context) — Review all available telemetry helpers on the context.
