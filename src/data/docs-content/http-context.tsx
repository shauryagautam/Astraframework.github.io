import { Link } from 'react-router-dom';
import { CodeBlock } from '../../components/shared/CodeBlock';

export const HttpContextContent = () => (
  <>
    <p>
      Every Astra handler receives a <code>*http.Context</code> object. This context is the Swiss Army knife of your application, providing a unified interface for interacting with the HTTP request, generating responses, managing authentication, and much more.
    </p>

    <h2>Accessing the Request</h2>
    <p>The <code>Context</code> provides several methods to retrieve data from the incoming request.</p>

    <h3>Path Parameters</h3>
    <p>Retrieve parameters defined in your route pattern:</p>
    <CodeBlock language="go" code={`id := c.Param("id")`} />

    <h3>Query Strings</h3>
    <p>Retrieve values from the URL query string:</p>
    <CodeBlock 
      language="go" 
      code={`// Returns "" if not found
search := c.Query("q")

// Returns "1" if not found or empty
page := c.QueryDefault("page", "1")

// Returns 10 (int) if not found or invalid
limit := c.QueryInt("limit", 10)`} 
    />

    <h3>Headers</h3>
    <CodeBlock 
      language="go" 
      code={`userAgent := c.Header("User-Agent")
c.SetHeader("X-Framework", "Astra")`} 
    />

    <h2>Binding &amp; Validation</h2>
    <p>Astra simplifies handling JSON payloads with built-in binding and validation. Under the hood, it uses <strong>ByteDance Sonic</strong> for maximum performance.</p>

    <h3>JSON Binding</h3>
    <CodeBlock 
      language="go" 
      code={`type CreateUser struct {
    Email string \`json:"email"\`
    Name  string \`json:"name"\`
}

func Store(c *http.Context) error {
    var input CreateUser
    if err := c.Bind(&input); err != nil {
        return err // Automatically returns 400 Bad Request
    }
    // ...
}`} 
    />

    <h3>Binding with Validation</h3>
    <p>Combine binding with declarative validation using struct tags:</p>
    <CodeBlock 
      language="go" 
      code={`type RegisterRequest struct {
    Email string \`json:"email" validate:"required,email"\`
    Age   int    \`json:"age" validate:"gte=18"\`
}

func Register(c *http.Context) error {
    var input RegisterRequest
    if err := c.BindAndValidate(&input); err != nil {
        return c.ValidationError(err) // Returns 422 with structured errors
    }
    // ...
}`} 
    />

    <h2>Generating Responses</h2>
    <p>Astra encourages returning errors directly from handlers. If a handler returns <code>nil</code>, Astra assumes you have handled the response manually.</p>

    <h3>JSON Responses</h3>
    <CodeBlock 
      language="go" 
      code={`return c.JSON(map[string]any{"status": "ok"})

// With custom status code
return c.JSON(data, http.StatusCreated)`} 
    />

    <h3>Plain Text &amp; HTML</h3>
    <CodeBlock 
      language="go" 
      code={`return c.SendString("Job started")
return c.HTML("<h1>Welcome</h1>")`} 
    />

    <h3>Redirects</h3>
    <CodeBlock language="go" code={`return c.Redirect("/login")`} />

    <h3>Files &amp; Downloads</h3>
    <CodeBlock 
      language="go" 
      code={`return c.File("./reports/annual.pdf")
return c.Download("./reports/annual.pdf", "YourReport.pdf")`} 
    />

    <h2>Cookies</h2>
    <p>Astra enforces secure defaults for cookies (HttpOnly and SameSite=Lax).</p>
    <CodeBlock 
      language="go" 
      code={`c.SetCookie(&http.Cookie{
    Name:     "theme",
    Value:    "dark",
    Expires:  time.Now().Add(24 * time.Hour),
})`} 
    />

    <h2>Authentication Helpers</h2>
    <p>If you are using Astra's Auth middleware, the <code>Context</code> provides easy access to the current user.</p>
    <CodeBlock 
      language="go" 
      code={`if c.IsAuthenticated() {
    user := c.AuthUser()
    fmt.Println(user.UserID)
}

// Authorization check
if c.Can("edit", post) {
    // ...
}`} 
    />

    <h2>Pagination Helpers</h2>
    <p>Quickly extract pagination parameters from the request:</p>
    <CodeBlock 
      language="go" 
      code={`page := c.Page()             // ?page=n (default 1)
limit := c.PerPage(50)      // ?per_page=n (default 15, max 50)`} 
    />

    <div className="mt-12 py-8 border-t border-(--t-border)">
      <h2 className="mt-0">Next Steps</h2>
      <ul className="list-none pl-0 space-y-2">
        <li>
          <Link to="/docs/core-concepts/middleware" className="text-(--t-accent) no-underline hover:underline font-bold">
            Middleware &rarr;
          </Link>
          <span className="text-(--t-text-muted) ml-2">— Learn how to intercept requests before they reach your handler.</span>
        </li>
        <li>
          <Link to="/docs/auth/validation" className="text-(--t-accent) no-underline hover:underline font-bold">
            Validation Patterns &rarr;
          </Link>
          <span className="text-(--t-text-muted) ml-2">— Deep dive into complex validation rules.</span>
        </li>
        <li>
          <Link to="/docs/auth/auth" className="text-(--t-accent) no-underline hover:underline font-bold">
            Auth Integration &rarr;
          </Link>
          <span className="text-(--t-text-muted) ml-2">— Secure your routes with ease.</span>
        </li>
      </ul>
    </div>
  </>
);
