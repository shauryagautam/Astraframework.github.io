# 08. Deployment

Shipping Astra to production is about producing one runnable artifact that already contains the frontend assets, the compiled Go binary, and a clean shutdown path.

## Why deployment needs to be planned early

If you wait until the end to think about build steps and shutdown signals, you usually end up with a release process that is fragile, slow, or both. Astra’s deployment story is intentionally boring: build the frontend, build the binary, package them together, and let the app stop itself cleanly when the platform asks.

## Build the frontend and backend together

The frontend build generates the manifest and fingerprinted assets that the Go app uses in production. The Go build compiles the server with the same code path you use locally, just with production flags.

The important part is the order:

1. Build frontend assets first.
2. Build the Go binary with `-trimpath` and stripped symbols.
3. Copy both artifacts into the final runtime image.

## Environment-Driven Configuration

Astra follows Twelve-Factor App principles by favoring environment variables for production configuration. This ensures that the same binary can be deployed across multiple environments (staging, production, DR) without recompilation.

### Best Practices
- **Never Hardcode Secrets**: Use environment variables for API keys, database credentials, and session secrets.
- **Provide Sensible Defaults**: Use a `config.MustLoad()` pattern that falls back to safe defaults for local development.
- **Validation at Boot**: The app kernel should validate that all required production environment variables are present before starting.

## Multi-stage Dockerfile

Astra works well with a multi-stage Dockerfile because the final image only needs the compiled binary and the frontend output. This results in lean, secure production images.

```dockerfile
# Stage 1: Build the frontend
FROM node:22-alpine AS frontend
WORKDIR /src/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Build the Go binary
FROM golang:1.25-alpine AS builder
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . ./
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/astra ./cmd/myapp

# Stage 3: Final runtime image
FROM alpine:3.21
RUN apk add --no-cache ca-certificates
WORKDIR /app
COPY --from=builder /out/astra ./astra
COPY --from=frontend /src/frontend/dist ./frontend/dist

# Use a non-root user for security
RUN adduser -D astrauser
USER astrauser

EXPOSE 3333
ENTRYPOINT ["/app/astra"]
```

## Graceful shutdowns

Astra’s `App` listens for `SIGINT` and `SIGTERM`, then runs `OnStop` hooks in reverse order. This is critical for zero-downtime deployments on platforms like Kubernetes or AWS ECS.

1. **Stop Accepting Requests**: The HTTP server stops accepting new connections but drains existing ones.
2. **Close Resource Pools**: Database and Redis pools are closed safely.
3. **Flush Telemetry**: OpenTelemetry exporters are flushed to ensure no data loss.
4. **Stop Background Jobs**: Long-running workers are signaled to finish their current task and stop.

## Copy-Paste Example

```bash
#!/bin/sh
set -e

./astra db:migrate
exec ./astra
```

```go
app.OnStop(func(ctx context.Context) error {
	return db.Close()
})
```
