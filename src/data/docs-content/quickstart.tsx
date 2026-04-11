import { Link } from 'react-router-dom';
import { CodeBlock } from '../../components/shared/CodeBlock';

export const QuickstartContent = () => (
  <>
    <p>
      Get a complete Astra application running in less than five minutes. This guide covers the fastest path from a clean terminal to your first working API endpoint.
    </p>

    <h2>Step 1: Install the Astra CLI</h2>
    <p>
      The Astra CLI is the primary companion for development. It handles project scaffolding, the dev server, and migration management.
    </p>
    <CodeBlock 
      language="bash" 
      code="go install github.com/astraframework/astra/cli@latest" 
    />
    <p>Verify your installation by running:</p>
    <CodeBlock 
      language="bash" 
      code="astra --version" 
    />

    <h2>Step 2: Create Your Project</h2>
    <p>
      Scaffold a new application using the <code>new</code> command. This will create a fresh directory with the official Astra project structure.
    </p>
    <CodeBlock 
      language="bash" 
      code={"astra new my-app\ncd my-app"} 
    />

    <h2>Step 3: Run the Development Server</h2>
    <p>
      Astra includes a powerful development server with hot-reloading. This means as you save your Go files, the application automatically recompiles and restarts.
    </p>
    <CodeBlock 
      language="bash" 
      code="astra dev" 
    />
    <p>The server should now be running at <code>http://localhost:8080</code>.</p>

    <h2>Step 4: Your First Route</h2>
    <p>
      Astra routes are typically registered in the <code>routes/</code> directory. Open the generated <code>routes/api.go</code> file (or equivalent) and add a new GET endpoint:
    </p>
    <CodeBlock 
      language="go" 
      filename="routes/api.go"
      code={`package routes

import (
	"github.com/astraframework/astra/http"
)

func RegisterRoutes(r *http.Router) {
	r.Get("/hello", func(c *http.Context) error {
		return c.JSON(map[string]any{
			"message": "Hello from Astra!",
		})
	})
}`} 
    />

    <h2>Step 5: Test the Response</h2>
    <p>
      Since the <code>astra dev</code> server is running, you can immediately test your new endpoint using <code>curl</code> or your browser:
    </p>
    <CodeBlock 
      language="bash" 
      code="curl http://localhost:8080/api/hello" 
    />
    <p><strong>Output:</strong></p>
    <CodeBlock 
      language="json" 
      code={`{
  "message": "Hello from Astra!"
}`} 
    />

    <h2>Step 6: Query Patterns</h2>
    <p>
      Try a more interactive route that reads from the query string. Astra's <code>Context</code> makes this trivial:
    </p>
    <CodeBlock 
      language="go" 
      code={`r.Get("/greet", func(c *http.Context) error {
    name := c.QueryDefault("name", "Gopher")
    return c.JSON(map[string]any{
        "greeting": "Hello, " + name + "!",
    })
})`} 
    />
    <p>Test it with a parameter:</p>
    <CodeBlock 
      language="bash" 
      code="curl http://localhost:8080/api/greet?name=Astra" 
    />

    <div className="mt-12 p-8 bg-(--t-accent)/5 rounded-2xl border border-(--t-accent)/10">
      <h2 className="mt-0">What just happened?</h2>
      <ul>
        <li>You installed the <strong>Astra CLI</strong>.</li>
        <li>You used the <strong>Standard Project Layout</strong>.</li>
        <li>You started a <strong>Hot-Reloading</strong> server.</li>
        <li>You used the <strong>Ergonomic Context</strong> to return JSON and read queries.</li>
      </ul>
    </div>

    <div className="mt-12 py-8 border-t border-(--t-border)">
      <h2 className="mt-0">Next Steps</h2>
      <ul className="list-none pl-0 space-y-2">
        <li>
          <Link to="/docs/introduction/installation" className="text-(--t-accent) no-underline hover:underline font-bold">
            Installation Guide &rarr;
          </Link>
          <span className="text-(--t-text-muted) ml-2">— Learn more about requirements and configuration.</span>
        </li>
        <li>
          <Link to="/docs/introduction/folder-structure" className="text-(--t-accent) no-underline hover:underline font-bold">
            Folder Structure &rarr;
          </Link>
          <span className="text-(--t-text-muted) ml-2">— Explore the anatomy of an Astra app.</span>
        </li>
        <li>
          <Link to="/docs/core-concepts/routing" className="text-(--t-accent) no-underline hover:underline font-bold">
            Routing &rarr;
          </Link>
          <span className="text-(--t-text-muted) ml-2">— Master groups, params, and named routes.</span>
        </li>
        <li>
          <Link to="/docs/database/orm" className="text-(--t-accent) no-underline hover:underline font-bold">
            Database &amp; ORM &rarr;
          </Link>
          <span className="text-(--t-text-muted) ml-2">— Seamlessly connect to your data.</span>
        </li>
      </ul>
    </div>
  </>
);
