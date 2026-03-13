FILE: /docs/auth

# Authentication

Astra provides a multi-strategy authentication system out of the box. Whether you are building a modern stateless API or a traditional session-based web application, Astra has you covered with built-in **JWT** and **Cookie** guards.

## The Core Concept: Guards

Authentication in Astra is handled by **Guards**. A guard is responsible for verifying the user's identity for a given request.

- **JWT Guard**: Ideal for APIs and mobile backends. It verifies tokens in the `Authorization` header.
- **Cookie Guard**: Ideal for SSR applications. It uses secure, session-based cookies stored in Redis.

## JWT Authentication

Astra's JWT implementation is built for production, featuring automatic token rotation and revocation via Redis.

### Issuing Tokens

When a user logs in, you use the `JWTManager` to issue a token pair:

```go
func Login(c *http.Context) error {
    // 1. Verify user credentials
    // 2. Issue tokens
    tokens, err := auth.Manager.IssueTokenPair(c.Ctx(), user.ID, nil)
    if err != nil {
        return err
    }
    
    return c.JSON(tokens)
}
```

### Protecting Routes

Apply the `JWTGuard` middleware to your routes:

```go
r.Group("/api", func(r *http.Router) {
    r.Use(auth.JWTAuth()) // Middleware that triggers JWTGuard.Attempt
    r.Get("/me", func(c *http.Context) error {
        user := c.AuthUser()
        return c.JSON(user)
    })
})
```

## Cookie Authentication

For web applications, session-based cookies are often preferred. Astra’s `CookieGuard` handles session lifecycle, including rotation and regeneration to prevent session fixation.

### Logging In

```go
func WebLogin(c *http.Context) error {
    // ... verify credentials ...
    
    // Login and issue secure cookie
    if err := auth.Guard.Login(c, user.ID); err != nil {
        return err
    }
    
    return c.Redirect("/dashboard")
}
```

### Registering the Guard

Register the session middleware globally or on specific groups:

```go
r.Use(auth.SessionAuth())
```

## Authorization & Guards

Once an identity is established, you can use **Guards** and **Policies** to authorize actions.

### Basic Checks

```go
func Update(c *http.Context) error {
    if !c.IsAuthenticated() {
        return c.Forbidden("")
    }
    
    user := c.AuthUser()
    // ...
}
```

### Declarative Authorization

Astra supports a familiar "Gate" pattern for complex authorization logic:

```go
// In an authorized handler
if c.Denies("edit", post) {
    return c.Forbidden("You do not own this post")
}

// Or use the shorthand
if err := c.Authorize("delete", comment); err != nil {
    return err // Returns 403 automatically
}
```

## Password Hashing

Astra includes a production-ready hasher using **Argon2id** (the industry standard) or Bcrypt as a fallback.

```go
// Hash a password
hashed, _ := auth.HashPassword("secret")

// Verify a password
match := auth.CheckPasswordHash("secret", hashed)
```

## TOTP & MFA (Support Pending)

> [!NOTE]
> TOTP (Time-based One-Time Password) support is currently in the experimental phase. Check the [latest release notes](https://github.com/astraframework/astra/releases) for integration updates.

## Secure Best Practices

1.  **Always use HTTPS**: Astra's handlers will automatically set the `Secure` flag on cookies when HTTPS is detected.
2.  **Rotate Secrets**: Ensure your `JWT_SECRET` is at least 32 characters and rotated regularly.
3.  **Use Revocation**: Astra’s Redis integration allows you to revoke refresh tokens immediately if a user's account is compromised.

## Next Steps

- [ORM & Models](/docs/orm) — Learn how to link Auth users to your database.
- [HTTP Context](/docs/http-context) — Explore more Auth-related helpers on the context.
- [Security Headers](/docs/middleware) — Complement your auth with robust security headers.
