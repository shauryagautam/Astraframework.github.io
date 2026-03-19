
# HTTP Context

Every Astra handler receives a `*http.Context` object. This context is the Swiss Army knife of your application, providing a unified interface for interacting with the HTTP request, generating responses, managing authentication, and much more.

## Accessing the Request

The `Context` provides several methods to retrieve data from the incoming request.

### Path Parameters
Retrieve parameters defined in your route pattern:
```go
id := c.Param("id")
```

### Query Strings
Retrieve values from the URL query string:
```go
// Returns "" if not found
search := c.Query("q")

// Returns "1" if not found or empty
page := c.QueryDefault("page", "1")

// Returns 10 (int) if not found or invalid
limit := c.QueryInt("limit", 10)
```

### Headers
```go
userAgent := c.Header("User-Agent")
c.SetHeader("X-Framework", "Astra")
```

## Binding & Validation

Astra simplifies handling JSON payloads with built-in binding and validation. Under the hood, it uses **ByteDance Sonic** for maximum performance.

### JSON Binding
```go
type CreateUser struct {
    Email string `json:"email"`
    Name  string `json:"name"`
}

func Store(c *http.Context) error {
    var input CreateUser
    if err := c.Bind(&input); err != nil {
        return err // Automatically returns 400 Bad Request
    }
    // ...
}
```

### Binding with Validation
Combine binding with declarative validation using struct tags:
```go
type RegisterRequest struct {
    Email string `json:"email" validate:"required,email"`
    Age   int    `json:"age" validate:"gte=18"`
}

func Register(c *http.Context) error {
    var input RegisterRequest
    if err := c.BindAndValidate(&input); err != nil {
        return c.ValidationError(err) // Returns 422 with structured errors
    }
    // ...
}
```

## Generating Responses

Astra encourages returning errors directly from handlers. If a handler returns `nil`, Astra assumes you have handled the response manually.

### JSON Responses
```go
return c.JSON(map[string]any{"status": "ok"})

// With custom status code
return c.JSON(data, http.StatusCreated)
```

### Plain Text & HTML
```go
return c.SendString("Job started")
return c.HTML("<h1>Welcome</h1>")
```

### Redirects
```go
return c.Redirect("/login")
```

### Files & Downloads
```go
return c.File("./reports/annual.pdf")
return c.Download("./reports/annual.pdf", "YourReport.pdf")
```

## Cookies

Astra enforces secure defaults for cookies (HttpOnly and SameSite=Lax).

```go
c.SetCookie(&http.Cookie{
    Name:     "theme",
    Value:    "dark",
    Expires:  time.Now().Add(24 * time.Hour),
})
```

## Authentication Helpers

If you are using Astra's Auth middleware, the `Context` provides easy access to the current user.

```go
if c.IsAuthenticated() {
    user := c.AuthUser()
    fmt.Println(user.UserID)
}

// Authorization check
if c.Can("edit", post) {
    // ...
}
```

## Pagination Helpers

Quickly extract pagination parameters from the request:

```go
page := c.Page()             // ?page=n (default 1)
limit := c.PerPage(50)      // ?per_page=n (default 15, max 50)
```

## Next Steps

- [Middleware](/docs/middleware) — Learn how to intercept requests before they reach your handler.
- [Validation Patterns](/docs/validation) — Deep dive into complex validation rules.
- [Auth Integration](/docs/auth) — Secure your routes with ease.
