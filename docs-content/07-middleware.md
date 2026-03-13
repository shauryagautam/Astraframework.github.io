FILE: /docs/middleware

# Middleware

Middleware provides a convenient mechanism for filtering and intercepting HTTP requests entering your application. For example, Astra includes middleware that verifies whether the user of your application is authenticated.

## Understanding Middleware

In Astra, middleware are functions that wrap a `HandlerFunc`. They have access to the `Context` and can perform actions before or after the main handler runs, or even prevent the handler from running entirely.

```go
type MiddlewareFunc func(next HandlerFunc) HandlerFunc
```

## Built-in Middleware

Astra comes with a robust set of built-in middleware to handle common infrastructure concerns.

### Recovery
Automatically recovers from panics in your handlers and logs the stack trace. This is enabled by default in new projects.

### Request IDs
Adds a unique `X-Request-ID` header to every request and injects it into the context for log correlation.

### Logging
Structured logging of every request, including method, path, status, and duration.

### Secure Headers
Sets sensible security headers (HSTS, CSP, XSS protection, etc.) to keep your application safe.

### CORS
Configures Cross-Origin Resource Sharing.

### Rate Limiting
Built-in support for Redis-backed rate limiting to protect your API endpoints.

## Registering Middleware

### Global Middleware
Global middleware runs on every request to your application. These are usually registered in your `routes/` or `main.go` file.

```go
r.Use(http.Logging())
r.Use(http.SecureHeaders())
```

### Group Middleware
Middleware applied to a group only runs for routes within that group.

```go
r.Group("/api", func(r *http.Router) {
    r.Use(AuthMiddleware)
    r.Get("/user", UserHandler)
})
```

## Writing Custom Middleware

Creating your own middleware is straightforward. Here’s a simple example of a middleware that checks for a specific "Admin" header:

```go
func AdminOnly() http.MiddlewareFunc {
    return func(next http.HandlerFunc) http.HandlerFunc {
        return func(c *http.Context) error {
            if c.Header("X-Admin-Role") != "superuser" {
                return c.Forbidden("Admin access only")
            }
            return next(c)
        }
    }
}
```

## Composing Middleware

You can compose middleware into reusable "stacks" to keep your routing logic clean.

```go
func ApiStack(r *http.Router) {
    r.Use(http.Logger())
    r.Use(http.RequestID())
    r.Use(AuthMiddleware)
}

// In routes:
r.Group("/v1", func(r *http.Router) {
    ApiStack(r)
    r.Get("/data", DataHandler)
})
```

## Middleware Execution Order

Middleware is executed in the order it is registered. For global middleware, this means the first `Use()` call wraps the second, and so on.

1.  GLOBAL Middleware
2.  BEFORE Hooks
3.  GROUP Middleware
4.  ROUTE Middleware
5.  **Main Handler**
6.  AFTER Hooks

## Next Steps

- [Authentication](/docs/auth) — Use the built-in auth middleware to secure your app.
- [Observability](/docs/observability) — See how middleware handles request tracing and monitoring.
- [Error Handling](/docs/http-context) — Learn how middleware interacts with Astra's error responses.
