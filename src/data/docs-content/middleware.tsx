import { Link } from 'react-router-dom';
import { CodeBlock } from '../../components/shared/CodeBlock';

export const MiddlewareContent = () => (
  <>
    <p>
      Middleware provides a convenient mechanism for filtering and intercepting HTTP requests entering your application. For example, Astra includes middleware that verifies whether the user of your application is authenticated.
    </p>

    <h2>Understanding Middleware</h2>
    <p>
      In Astra, middleware are functions that wrap a <code>HandlerFunc</code>. They have access to the <code>Context</code> and can perform actions before or after the main handler runs, or even prevent the handler from running entirely.
    </p>
    <CodeBlock 
      language="go" 
      code={`type MiddlewareFunc func(next HandlerFunc) HandlerFunc`} 
    />

    <h2>Built-in Middleware</h2>
    <p>Astra comes with a robust set of built-in middleware to handle common infrastructure concerns.</p>

    <h3>Recovery</h3>
    <p>Automatically recovers from panics in your handlers and logs the stack trace. This is enabled by default in new projects.</p>

    <h3>Request IDs</h3>
    <p>Adds a unique <code>X-Request-ID</code> header to every request and injects it into the context for log correlation.</p>

    <h3>Logging</h3>
    <p>Structured logging of every request, including method, path, status, and duration.</p>

    <h3>Secure Headers</h3>
    <p>Sets sensible security headers (HSTS, CSP, XSS protection, etc.) to keep your application safe.</p>

    <h3>CORS</h3>
    <p>Configures Cross-Origin Resource Sharing.</p>

    <h3>Rate Limiting</h3>
    <p>Built-in support for Redis-backed rate limiting to protect your API endpoints.</p>

    <h2>Registering Middleware</h2>

    <h3>Global Middleware</h3>
    <p>Global middleware runs on every request to your application. These are usually registered in your <code>routes/</code> or <code>main.go</code> file.</p>
    <CodeBlock 
      language="go" 
      code={`r.Use(http.Logging())
r.Use(http.SecureHeaders())`} 
    />

    <h3>Group Middleware</h3>
    <p>Middleware applied to a group only runs for routes within that group.</p>
    <CodeBlock 
      language="go" 
      code={`r.Group("/api", func(r *http.Router) {
    r.Use(AuthMiddleware)
    r.Get("/user", UserHandler)
})`} 
    />

    <h2>Writing Custom Middleware</h2>
    <p>Creating your own middleware is straightforward. Here’s a simple example of a middleware that checks for a specific "Admin" header:</p>
    <CodeBlock 
      language="go" 
      code={`func AdminOnly() http.MiddlewareFunc {
    return func(next http.HandlerFunc) http.HandlerFunc {
        return func(c *http.Context) error {
            if c.Header("X-Admin-Role") != "superuser" {
                return c.Forbidden("Admin access only")
            }
            return next(c)
        }
    }
}`} 
    />

    <h2>Composing Middleware</h2>
    <p>You can compose middleware into reusable "stacks" to keep your routing logic clean.</p>
    <CodeBlock 
      language="go" 
      code={`func ApiStack(r *http.Router) {
    r.Use(http.Logger())
    r.Use(http.RequestID())
    r.Use(AuthMiddleware)
}

// In routes:
r.Group("/v1", func(r *http.Router) {
    ApiStack(r)
    r.Get("/data", DataHandler)
})`} 
    />

    <h2>Middleware Execution Order</h2>
    <p>Middleware is executed in the order it is registered. For global middleware, this means the first <code>Use()</code> call wraps the second, and so on.</p>
    <ol>
      <li>GLOBAL Middleware</li>
      <li>BEFORE Hooks</li>
      <li>GROUP Middleware</li>
      <li>ROUTE Middleware</li>
      <li><strong>Main Handler</strong></li>
      <li>AFTER Hooks</li>
    </ol>

    <div className="mt-12 py-8 border-t border-[var(--t-border)]">
      <h2 className="mt-0">Next Steps</h2>
      <ul className="list-none pl-0 space-y-2">
        <li>
          <Link to="/docs/auth/auth" className="text-[var(--t-accent)] no-underline hover:underline font-bold">
            Authentication &rarr;
          </Link>
          <span className="text-[var(--t-text-muted)] ml-2">— Use the built-in auth middleware to secure your app.</span>
        </li>
        <li>
          <Link to="/docs/development/observability" className="text-[var(--t-accent)] no-underline hover:underline font-bold">
            Observability &rarr;
          </Link>
          <span className="text-[var(--t-text-muted)] ml-2">— See how middleware handles request tracing and monitoring.</span>
        </li>
        <li>
          <Link to="/docs/core-concepts/http-context" className="text-[var(--t-accent)] no-underline hover:underline font-bold">
            Error Handling &rarr;
          </Link>
          <span className="text-[var(--t-text-muted)] ml-2">— Learn how middleware interacts with Astra's error responses.</span>
        </li>
      </ul>
    </div>
  </>
);
