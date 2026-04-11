# 03. Security

Security in Astra is layered. Authentication tells you who the caller is. Authorization tells you what that caller may do. Password hashing protects credentials at rest. Policies keep resource-level decisions out of your handlers.

## Why this split matters

If you mix authentication and authorization together, every handler becomes a special case. Astra keeps the surface area explicit: guards identify users, middleware enforces coarse permissions, and policies handle resource-specific decisions.

## The unified guard API

Astra uses the `auth.Guard` interface to abstract how a user authenticates. This ensures that your business logic remains decoupled from the transport mechanism (cookies, headers, tokens).

### Available Guards
- **`JWTGuard`**: Best for stateless microservices and mobile apps. It uses signed tokens to carry identity information.
- **`CookieGuard`**: Recommended for traditional web applications. It handles session persistence, CSRF protection, and server-side session stores (Redis, Database).

```go
// Registering multiple guards for different entry points
auth.Register("api", auth.NewJWTGuard("api", jwtManager))
auth.Register("web", auth.NewCookieGuard("web", sessionStore))

// Resolving a guard dynamically based on application state
guard := auth.Resolve("web")
```

> [!TIP]
> Always use `auth.Resolve()` instead of hard-dependency on a specific guard type. This makes it easier to swap authentication strategies (e.g., migrating from JWT to OIDC) without touching your handlers.

## Password hashing

Security is only as strong as its weakest link. Astra enforces best-in-class password hashing using Argon2id or Bcrypt.

- **Argon2id (Recommended)**: Memory-hard and time-hard, designed to resist GPU/ASIC cracking.
- **Bcrypt**: The industry standard, optimized for CPU-bound hashing.

Astra’s `auth.CheckPasswordHash` performs constant-time comparisons to prevent timing attacks, a common pitfall in hand-rolled authentication systems.

## RBAC middleware

Role-Based Access Control (RBAC) in Astra is implemented as high-performance middleware. It allows you to define coarse-grained permissions that protect entire routes or groups of routes.

### Design Principles
1. **Explicit Permissions**: Define roles and permissions in your domain services.
2. **Fail Fast**: The RBAC middleware rejects unauthorized requests before they even reach your handler, saving database cycles and improving security posture.
3. **Hierarchy Support**: Astra supports role nesting, allowing "admin" roles to inherit permissions from "editor" or "viewer" roles.

```go
// Protecting a route group with RBAC
r.Group(func(r *astrahttp.Router) {
    r.Use(astrahttp.RBAC("admin", "editor"))
    r.Post("/content/publish", contentHandler.Publish)
})
```

## Policies and resource-level authorization

RBAC is not enough for rules like “a user can edit only their own post.” For that, Astra’s `pkg/policy` package provides policy functions and scope functions.

Use `policy.Register` to answer yes/no questions for a resource. Use `policy.RegisterScope` to inject resource-scoping into query builders so the data layer enforces the same rule consistently.

This is the right place for resource ownership checks, tenant isolation, and query-level filtering.

## Why policies are better than ad hoc checks

Policy rules belong at the boundary because they should be reused by handlers, background jobs, and query scopes. If the same rule appears in five handlers, it is already a shared policy and should be treated like one.

> [!WARNING]
> Deny by default. If no policy is registered, the request should not be treated as implicitly safe.

## Copy-Paste Example

```go
package main

import (
    "context"
    "log/slog"

    "github.com/shauryagautam/Astra/internal/engine/http"
    "github.com/shauryagautam/Astra/pkg/identity/auth"
    "github.com/shauryagautam/Astra/pkg/policy"
)

type Post struct {
    ID     string
    UserID string
}

type User struct {
    ID    string
    Roles []string
}

func main() {
    logger := slog.Default()
    _ = logger

    jwtGuard := auth.NewJWTGuard("api", mustJWTManager())
    cookieGuard := auth.NewCookieGuard("web", mustSessionStore())
    auth.Register(jwtGuard.Name(), jwtGuard)
    auth.Register(cookieGuard.Name(), cookieGuard)

    policy.Register("update", (*Post)(nil), func(user any, subject any) bool {
        u := user.(*User)
        p := subject.(*Post)
        return u.ID == p.UserID || hasRole(u.Roles, "admin")
    })

    policy.RegisterScope((*Post)(nil), func(ctx context.Context, builder any) {
        _ = ctx
        _ = builder
        // Inject tenant or ownership filters here.
    })

    _ = auth.HashPassword
    _ = http.RateLimit
}

func hasRole(roles []string, role string) bool {
    for _, item := range roles {
        if item == role {
            return true
        }
    }
    return false
}

func mustJWTManager() *auth.JWTManager { return nil }
func mustSessionStore() auth.SessionDriver { return nil }
```
