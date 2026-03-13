FILE: /docs/routing

# Routing

Astra provides an expressive, fluent routing API built on top of the battle-tested `go-chi/chi` router. It adds a thin layer of ergonomics, including automatic parameter binding, centralized error handling, and resource-based routing.

## Basic Routing

Routes map an HTTP method and a URL pattern to a handler. All standard HTTP methods are supported:

```go
func RegisterRoutes(r *http.Router) {
    r.Get("/", func(c *http.Context) error {
        return c.SendString("Hello World")
    })

    r.Post("/users", UserController{}.Store)
    r.Put("/users/{id}", UserController{}.Update)
    r.Delete("/users/{id}", UserController{}.Destroy)
}
```

## Route Parameters

Patterns can include dynamic segments using curly braces. These parameters are easily accessible via the `Context`.

```go
r.Get("/posts/{slug}", func(c *http.Context) error {
    slug := c.Param("slug")
    return c.JSON(map[string]string{"post_slug": slug})
})
```

## Route Groups

Groups allow you to share path prefixes and middleware across multiple routes, keeping your routing definitions clean and organized.

```go
r.Group("/api", func(r *http.Router) {
    r.Use(AuthMiddleware) // Applied only to this group
    
    r.Get("/profile", ProfileController{}.Show)
    
    r.Group("/v1", func(r *http.Router) {
        r.Get("/settings", SettingsController{}.Index)
    })
})
```

## Named Routes

Naming your routes allows you to generate URLs dynamically, which makes your application more resilient to URL structure changes.

```go
r.Get("/dashboard", DashboardHandler).Name("user.dashboard")

// In another handler or template
url := r.Route("user.dashboard") // returns "/dashboard"
```

### Routes with Parameters
```go
r.Get("/users/{id}", UserHandler).Name("users.show")

url := r.Route("users.show", 123) // returns "/users/123"
```

## Resource Routing

Astra can automatically generate RESTful routes for a controller that implements standard methods: `Index`, `Store`, `Show`, `Update`, and `Destroy`.

```go
type UserController struct {}

func (u UserController) Index(c *http.Context) error { /* ... */ }
func (u UserController) Store(c *http.Context) error { /* ... */ }
// ... other methods

// In your router:
r.Resource("users", UserController{})
```

This single line registers:
- `GET /users` -> `Index`
- `POST /users` -> `Store`
- `GET /users/{id}` -> `Show`
- `PUT/PATCH /users/{id}` -> `Update`
- `DELETE /users/{id}` -> `Destroy`

## API Versioning

Astra has built-in helpers for versioned route groups, commonly used in API development.

```go
r.V1(func(r *http.Router) {
    r.Get("/posts", PostController{}.Index) // GET /v1/posts
})

r.V2(func(r *http.Router) {
    r.Get("/posts", PostController{}.V2Index) // GET /v2/posts
})
```

## Middleware on Routes

Middleware can be applied globally, to groups, or to individual routes.

```go
// Group middleware
r.Group("/admin", func(r *http.Router) {
    r.Use(AdminGuard)
    r.Get("/stats", StatsHandler)
})
```

## Next Steps

- [HTTP Context](/docs/http-context) — Learn more about request/response handling.
- [Middleware](/docs/middleware) — Explore built-in and custom middleware.
- [Controllers](/docs/folder-structure) — See how to structure your handler logic.
