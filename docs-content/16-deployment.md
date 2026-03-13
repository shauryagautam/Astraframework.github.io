FILE: /docs/deployment

# Deployment

Moving an Astra application from development to production requires attention to configuration, security, and operational reliability. This guide provides a checklist and best practices for a smooth deployment.

## Production Configuration

In development, Astra optimizes for productivity with hot-reloading and verbose logs. In production, you must set `APP_ENV=production` to enable performance optimizations and secure defaults.

### Key Environment Variables
Ensure these are set in your production environment:

-   `APP_ENV`: Must be `production`.
-   `APP_KEY`: A 32-character random string for encryption.
-   `DATABASE_URL`: Your production database connection string.
-   `REDIS_URL`: Your production Redis cluster/instance.
-   `JWT_SECRET`: A high-entropy secret for signing tokens.

## Deployment Strategy

Astra applications are compiled into a single static binary, making them extremely easy to deploy using Docker, Kubernetes, or traditional VPS environments.

### Dockerized Deployment (Recommended)
A typical `Dockerfile` for an Astra app uses a multi-stage build:

```dockerfile
# Build Stage
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY . .
RUN go mod download
RUN go build -o main .

# Final Stage
FROM alpine:latest
WORKDIR /app
COPY --from=builder /app/main .
COPY --from=builder /app/config ./config
CMD ["./main"]
```

## Health Checks

Astra provides built-in health endpoints that can be used by load balancers and orchestrators (like Kubernetes Liveness/Readiness probes) to monitor your application's status.

-   `GET /health`: Core application status.
-   `GET /health/ready`: Checks database and Redis connectivity.

You can register custom health checks in your `AppProvider`:

```go
app.RegisterHealthCheck("stripe_api", func(ctx context.Context) error {
    return stripeClient.Ping()
})
```

## Graceful Shutdown

When an Astra application receives a termination signal (`SIGTERM` or `SIGINT`), it begins a graceful shutdown process:

1.  **Stop Accepting Requests**: The HTTP server stops accepting new connections.
2.  **Finish In-flight Work**: Current requests and background jobs are given a timeout (configurable via `App.ShutdownTimeout`) to finish.
3.  **Close Connections**: Database, Redis, and other provider connections are closed cleanly.

## Logging in Production

When `APP_ENV` is set to `production`, Astra automatically switches to **JSON Logging**. This ensures your logs are easily parseable by aggregation tools like ELK, Datadog, or CloudWatch.

```json
{"time":"2024-03-15T12:00:00Z","level":"INFO","msg":"application started","duration":"1.5ms"}
```

## Production Checklist

-   [ ] **HTTPS / TLS**: Ensure your application is served over HTTPS. Astra supports automated TLS via Let's Encrypt or can be placed behind a reverse proxy like Nginx or Caddy.
-   [ ] **Rate Limiting**: Enable Redis-backed rate limiting to protect against brute-force attacks.
-   [ ] **Security Headers**: Verify that `SecureHeaders` middleware is enabled.
-   [ ] **Database Migrations**: Run `astra migrate` as part of your deployment pipeline.
-   [ ] **Secrets Management**: Do not hardcode secrets. Use a secret manager (AWS Secrets Manager, HashiCorp Vault, or K8s Secrets).
-   [ ] **Monitoring**: Ensure your app is emitting metrics and traces to your observability stack.

## Common Gotchas

### 1. Max File Descriptors
On high-traffic servers, ensure your OS's `ulimit` for file descriptors is high enough to handle many concurrent HTTP and database connections.

### 2. Timezones
Astra assumes UTC by default. Ensure your server and database are also set to UTC to avoid timezone-related bugs.

## Next Steps

-   [Observability](/docs/observability) — Configure tracing and metrics for production visibility.
-   [Queues](/docs/queues) — Operational guidance for running background workers in production.
-   [Security Guide](/docs/auth) — Review Astra's security features.
