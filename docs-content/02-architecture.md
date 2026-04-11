# 02. Architecture

This chapter explains how Astra composes an application without runtime service lookup and how the router stays compatible with the Go standard library instead of competing with it.

## Why the architecture looks this way

The design goal is simple: if the dependency graph is wrong, the build should fail. If the route tree is wrong, the router should still feel like `net/http`. Astra rejects the service locator style of architecture because it hides dependencies, weakens testability, and turns wiring mistakes into runtime failures.

## Static dependency injection

Astra uses Google Wire for compile-time composition. You declare constructors, Wire generates code, and the result is plain Go. There is no reflective container resolving services behind your back.

That choice gives you three practical benefits:

1. Missing dependencies fail at build time.
2. Constructor signatures describe exactly what a component needs.
3. The generated code is readable and debuggable because it is just Go.

> [!TIP]
> Use constructors that accept concrete dependencies. The narrower the constructor, the easier it is to test and replace later.

## Service providers

Service providers are Astra’s composition boundary. They are responsible for registering services into the application container and then booting any long-lived behavior once the kernel is ready.

The `Provider` interface in the engine has two phases:

```go
type Provider interface {
    Register(a *App) error
    Boot(a *App) error
}
```

Use `Register` to bind things like database pools, mailers, session stores, or domain services. Use `Boot` for work that depends on those bindings being available, such as route registration, event listeners, health checks, or background workers.

> [!NOTE]
> Providers are not factories with side effects hidden in `init()`. Keep construction explicit so the app remains predictable.

## Router and standard library compatibility

Astra’s router wraps `http.ServeMux`. That matters because the router inherits the standard library’s path pattern behavior and stays compatible with normal `http.Handler` values.

The practical consequence is that you can use Astra’s convenience methods when you want them, or register a standard handler when you already have one.

### Why this is useful

1. Existing Go handlers can be mounted without adapters.
2. New routes use the Go 1.22+ pattern syntax with `{id}`-style segments.
3. Middleware sits around the handler chain without changing the underlying `net/http` contract.

The router methods mirror the standard library mindset:

```go
 r := astrahttp.NewRouter(cfg, logger)
 r.Get("/users/{id}", userHandler.Show)
 r.Handle("GET", "/health", http.HandlerFunc(healthHandler.ServeHTTP))
```

### gRPC lives one layer below

The router is HTTP-specific. If you want to serve gRPC and HTTP on the same TCP port, that is handled by the server layer with `cmux`, not by the router. This keeps the routing story clean: the router handles HTTP semantics, while the server decides how to multiplex transports.

## Wiring routes and providers together

Wire should build the application graph, then your providers should attach routes and services to the kernel. A good mental model is:

1. Wire builds the graph.
2. Providers register infrastructure.
3. Providers boot runtime behavior.
4. Routes attach to the already-wired application.

> [!WARNING]
> Do not turn the container into an implicit registry of everything. If a handler needs a dependency, pass it in through the constructor.

## Middleware

Middleware in Astra is designed to be standard-library compatible while providing the ergonomic benefits of a modern framework. A middleware is a function that takes an `http.Handler` and returns an `http.Handler`.

Astra provides several built-in middlewares for common tasks:
- **Logging**: Structured JSON logging for every request.
- **Recovery**: Automatic recovery from panics with stack traces.
- **Rate Limiting**: Redis-backed sliding window rate limiting.
- **RBAC**: Role-based access control (see Security chapter).

```go
func CustomMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // Pre-processing
        next.ServeHTTP(w, r)
        // Post-processing
    })
}
```

> [!TIP]
> Use `r.Use(middleware)` to apply a middleware to all routes in a router instance, or wrap specific handlers for granular control.

## HTTP Context

The `astrahttp.Context` type is a wrapper around the standard `http.ResponseWriter` and `*http.Request`. It provides a fluent API for reading request data and sending responses without boilerplate.

Key features of `astrahttp.Context`:
- **JSON Binding**: Automatically parse JSON request bodies into Go structs.
- **Response Helpers**: Send JSON, HTML, or String responses with a single call.
- **Context Access**: Access request-scoped values and the underlying Go `context.Context`.

```go
func(c *astrahttp.Context) error {
    var input struct {
        Name string `json:"name"`
    }
    
    // Bind JSON body
    if err := c.BindJSON(&input); err != nil {
        return c.JSON(400, map[string]string{"error": "invalid input"})
    }
    
    return c.JSON(200, map[string]string{"message": "Hello " + input.Name})
}
```

## Request Validation

Astra promotes contract-driven development. For the frontend, Astra generates Zod schemas from your Go structs to ensure that what you send from the browser is exactly what the server expects.

On the server side, you can use the `Validate` helper or any standard Go validation library. When combined with the `astrahttp.Context.BindJSON` method, validation becomes a single-line concern.

```go
// Example using a hypothetical validation helper
if err := c.BindAndValidateJSON(&input); err != nil {
    return c.ValidationError(err)
}
```

> [!NOTE]
> By keeping validation logic tied to the struct tags or explicit schemas, you maintain a single source of truth for both your API documentation and your runtime checks.

## Copy-Paste Example

```go
//go:build wireinject

package main

import (
    "github.com/google/wire"
    "github.com/shauryagautam/Astra/internal/engine"
    astrahttp "github.com/shauryagautam/Astra/internal/engine/http"
)

type UserProvider struct {
    handler *UserHandler
    router  *astrahttp.Router
}

func NewUserProvider(handler *UserHandler, router *astrahttp.Router) *UserProvider {
    return &UserProvider{handler: handler, router: router}
}

func (p *UserProvider) Register(a *engine.App) error {
    engine.Instance(a, p.handler)
    return nil
}

func (p *UserProvider) Boot(a *engine.App) error {
    p.router.Get("/users/{id}", p.handler.Show)
    return nil
}

func InitializeApp() (*engine.App, error) {
    wire.Build(
        NewConfig,
        NewLogger,
        engine.New,
        NewUserProvider,
    )
    return nil, nil
}
```
