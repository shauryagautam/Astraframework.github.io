import { Link } from 'react-router-dom';
import { CodeBlock } from '../../components/shared/CodeBlock';

export const RoutingContent = () => (
  <>
    <p>
      Astra provides an expressive, fluent routing API built on top of the battle-tested <code>go-chi/chi</code> router. It adds a thin layer of ergonomics, including automatic parameter binding, centralized error handling, and resource-based routing.
    </p>

    <h2>Basic Routing</h2>
    <p>Routes map an HTTP method and a URL pattern to a handler. All standard HTTP methods are supported:</p>
    <CodeBlock 
      language="go" 
      code={`func RegisterRoutes(r *http.Router) {
    r.Get("/", func(c *http.Context) error {
        return c.SendString("Hello World")
    })

    r.Post("/users", UserController{}.Store)
    r.Put("/users/{id}", UserController{}.Update)
    r.Delete("/users/{id}", UserController{}.Destroy)
}`} 
    />

    <h2>Route Parameters</h2>
    <p>Patterns can include dynamic segments using curly braces. These parameters are easily accessible via the <code>Context</code>.</p>
    <CodeBlock 
      language="go" 
      code={`r.Get("/posts/{slug}", func(c *http.Context) error {
    slug := c.Param("slug")
    return c.JSON(map[string]string{"post_slug": slug})
})`} 
    />

    <h2>Route Groups</h2>
    <p>Groups allow you to share path prefixes and middleware across multiple routes, keeping your routing definitions clean and organized.</p>
    <CodeBlock 
      language="go" 
      code={`r.Group("/api", func(r *http.Router) {
    r.Use(AuthMiddleware) // Applied only to this group
    
    r.Get("/profile", ProfileController{}.Show)
    
    r.Group("/v1", func(r *http.Router) {
        r.Get("/settings", SettingsController{}.Index)
    })
})`} 
    />

    <h2>Named Routes</h2>
    <p>Naming your routes allows you to generate URLs dynamically, which makes your application more resilient to URL structure changes.</p>
    <CodeBlock 
      language="go" 
      code={`r.Get("/dashboard", DashboardHandler).Name("user.dashboard")

// In another handler or template
url := r.Route("user.dashboard") // returns "/dashboard"`} 
    />

    <h3>Routes with Parameters</h3>
    <CodeBlock 
      language="go" 
      code={`r.Get("/users/{id}", UserHandler).Name("users.show")

url := r.Route("users.show", 123) // returns "/users/123"`} 
    />

    <h2>Resource Routing</h2>
    <p>Astra can automatically generate RESTful routes for a controller that implements standard methods: <code>Index</code>, <code>Store</code>, <code>Show</code>, <code>Update</code>, and <code>Destroy</code>.</p>
    <CodeBlock 
      language="go" 
      code={`type UserController struct {}

func (u UserController) Index(c *http.Context) error { /* ... */ }
func (u UserController) Store(c *http.Context) error { /* ... */ }
// ... other methods

// In your router:
r.Resource("users", UserController{})`} 
    />
    <p>This single line registers:</p>
    <ul>
      <li><code>GET /users</code> &rarr; <code>Index</code></li>
      <li><code>POST /users</code> &rarr; <code>Store</code></li>
      <li><code>GET /users/{"{id}"}</code> &rarr; <code>Show</code></li>
      <li><code>PUT/PATCH /users/{"{id}"}</code> &rarr; <code>Update</code></li>
      <li><code>DELETE /users/{"{id}"}</code> &rarr; <code>Destroy</code></li>
    </ul>

    <h2>API Versioning</h2>
    <p>Astra has built-in helpers for versioned route groups, commonly used in API development.</p>
    <CodeBlock 
      language="go" 
      code={`r.V1(func(r *http.Router) {
    r.Get("/posts", PostController{}.Index) // GET /v1/posts
})

r.V2(func(r *http.Router) {
    r.Get("/posts", PostController{}.V2Index) // GET /v2/posts
})`} 
    />

    <h2>Middleware on Routes</h2>
    <p>Middleware can be applied globally, to groups, or to individual routes.</p>
    <CodeBlock 
      language="go" 
      code={`// Group middleware
r.Group("/admin", func(r *http.Router) {
    r.Use(AdminGuard)
    r.Get("/stats", StatsHandler)
})`} 
    />

    <div className="mt-12 py-8 border-t border-[var(--t-border)]">
      <h2 className="mt-0">Next Steps</h2>
      <ul className="list-none pl-0 space-y-2">
        <li>
          <Link to="/docs/core-concepts/http-context" className="text-[var(--t-accent)] no-underline hover:underline font-bold">
            HTTP Context &rarr;
          </Link>
          <span className="text-[var(--t-text-muted)] ml-2">— Learn more about request/response handling.</span>
        </li>
        <li>
          <Link to="/docs/core-concepts/middleware" className="text-[var(--t-accent)] no-underline hover:underline font-bold">
            Middleware &rarr;
          </Link>
          <span className="text-[var(--t-text-muted)] ml-2">— Explore built-in and custom middleware.</span>
        </li>
        <li>
          <Link to="/docs/introduction/folder-structure" className="text-[var(--t-accent)] no-underline hover:underline font-bold">
            Controllers &rarr;
          </Link>
          <span className="text-[var(--t-text-muted)] ml-2">— See how to structure your handler logic.</span>
        </li>
      </ul>
    </div>
  </>
);
