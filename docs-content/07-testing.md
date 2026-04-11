# 07. Testing

Testing in Astra is built around the same principle as the runtime: explicit dependencies, visible behavior, and as little hidden magic as possible.

## Why testing is a first-class concern

The fastest tests are the ones that do not need to guess how the app was assembled. Astra’s dependency graph is explicit, which means you can replace a real provider with a fake provider, then exercise the app through the same boundaries production uses.

## HTTP testing with `NewTestApp`

The `astratest.NewTestApp` helper is the core of Astra’s testing strategy. It allows you to spin up a fully wired application kernel in memory, register only the handlers you want to test, and execute HTTP requests against them without needing to start a network listener.

### Fluent Assertions
The test client provides a powerful chaining API for verifying responses:
- **`ExpectStatus(code)`**: Assert that the HTTP response code matches.
- **`ExpectJSON(path, value)`**: Verify specific keys within a JSON body.
- **`ExpectHeader(key, value)`**: Assert that a response header is present and correct.
- **`ExpectBodyContains(substring)`**: A quick way to verify HTML or text content.

```go
app.GET("/health").
    ExpectStatus(200).
    ExpectJSON("status", "ok")
```

## Mocking and Dependency Replacement

Astra’s static dependency injection (via Google Wire) makes mocking remarkably clean. Because you pass interfaces to your constructors, you can easily provide a "fake" implementation during testing.

### Guidelines for Mocking
1. **Mock at the Boundary**: Mock external services like Email gateways, SMS providers, or Payment processors.
2. **Avoid Mocking Internals**: Don't mock your own internal domain services if you can use the real thing. It ensures your tests are more resilient to refactoring.
3. **Use the `Instance` Override**: Astra allows you to manually inject an instance into the kernel during `NewTestApp` setup, bypassing the normal provider logic.

## Integration Testing with Testcontainers

When you need to test logic that depends on specific database behavior (like Postgres exclusion constraints or Redis lua scripts), Astra recommends using real containers.

- **Isolation**: Each test suite gets a fresh database instance.
- **Consistency**: The same container image is used in development and CI.
- **Automatic Cleanup**: Astra’s `Suite` handles the lifecycle of the container, ensuring it stopped and removed even if a test panics.

> [!WARNING]
> While integration tests are more accurate, they are also significantly slower than unit tests. Balance your test suite to ensure fast feedback loops during local development.

## Copy-Paste Example

```go
package users_test

import (
	"testing"

	"github.com/shauryagautam/Astra/internal/engine"
	astrahttp "github.com/shauryagautam/Astra/internal/engine/http"
	astratest "github.com/shauryagautam/Astra/test_util"
)

func TestCreateUser(t *testing.T) {
	app := astratest.NewTestApp(t, func(app *engine.App, r *astrahttp.Router) {
		r.Post("/users", func(c *astrahttp.Context) error {
			return c.JSON(map[string]any{"name": "John"}, 201)
		})
	})

	app.POST("/users", map[string]string{"name": "John"}).
		ExpectStatus(201).
		ExpectJSON("name", "John")
}

func TestRepositoryWithContainers(t *testing.T) {
	var suite astratest.Suite
	suite.SetupSuite()
	defer suite.TearDownSuite()
	_ = suite
}
```
