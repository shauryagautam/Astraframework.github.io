
# Quickstart

Get a complete Astra application running in less than five minutes. This guide covers the fastest path from a clean terminal to your first working API endpoint.

## Step 1: Install the Astra CLI

The Astra CLI is the primary companion for development. It handles project scaffolding, the dev server, and migration management.

```bash
go install github.com/astraframework/astra/cli@latest
```

Verify your installation by running:

```bash
astra --version
```

## Step 2: Create Your Project

Scaffold a new application using the `new` command. This will create a fresh directory with the official Astra project structure.

```bash
astra new my-app
cd my-app
```

## Step 3: Run the Development Server

Astra includes a powerful development server with hot-reloading. This means as you save your Go files, the application automatically recompiles and restarts.

```bash
astra dev
```

The server should now be running at `http://localhost:8080`.

## Step 4: Your First Route

Astra routes are typically registered in the `routes/` directory. Open the generated `routes/api.go` file (or equivalent) and add a new GET endpoint:

```go
package routes

import (
	"github.com/astraframework/astra/http"
)

func RegisterRoutes(r *http.Router) {
	r.Get("/hello", func(c *http.Context) error {
		return c.JSON(map[string]any{
			"message": "Hello from Astra!",
		})
	})
}
```

## Step 5: Test the Response

Since the `astra dev` server is running, you can immediately test your new endpoint using `curl` or your browser:

```bash
curl http://localhost:8080/api/hello
```

**Output:**
```json
{
  "message": "Hello from Astra!"
}
```

## Step 6: Query Patterns

Try a more interactive route that reads from the query string. Astra's `Context` makes this trivial:

```go
r.Get("/greet", func(c *http.Context) error {
    name := c.QueryDefault("name", "Gopher")
    return c.JSON(map[string]any{
        "greeting": "Hello, " + name + "!",
    })
})
```

Test it with a parameter:
`curl http://localhost:8080/api/greet?name=Astra`

::: summary
## What just happened?

- You installed the **Astra CLI**.
- You used the **Standard Project Layout**.
- You started a **Hot-Reloading** server.
- You used the **Ergonomic Context** to return JSON and read queries.
:::

## Next Steps

Now that you've got the basics down, it's time to dive deeper into how Astra works.

- [Installation Guide](/docs/introduction/installation) — Learn more about requirements and configuration.
- [Folder Structure](/docs/introduction/folder-structure) — Explore the anatomy of an Astra app.
- [Routing](/docs/core-concepts/routing) — Master groups, params, and named routes.
- [Database & ORM](/docs/database/orm) — Seamlessly connect to your data.
