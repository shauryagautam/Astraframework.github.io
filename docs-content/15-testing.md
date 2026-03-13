FILE: /docs/testing

# Testing

Astra believes that testing is not an optional extra, but a fundamental part of the development process. The framework provides a rich set of testing utilities and an opinionated testing suite that uses **Testcontainers** to give you real, pristine environments for every single test.

## The Astra Test Suite

Most Astra tests should inherit from the `testing.Suite`. This base suite automatically handles starting Docker containers for Postgres and Redis, managing database transactions, and cleaning up after each test.

```go
package tests

import (
    "github.com/astraframework/astra/testing"
    "github.com/stretchr/testify/suite"
)

type UserTestSuite struct {
    testing.Suite
}

func TestUserSuite(t *testing.T) {
    suite.Run(t, new(UserTestSuite))
}
```

## Transactional Testing

By default, every test in an Astra suite runs inside a database transaction. When the test finishes, the transaction is **automatically rolled back**. This ensures that your tests are completely isolated and do not pollute the database for subsequent tests.

```go
func (s *UserTestSuite) TestCanCreateUser() {
    user := &models.User{Name: "Test User", Email: "test@example.com"}
    err := orm.Query[models.User](s.App.DB()).Create(user, s.Ctx)
    
    s.NoError(err)
    s.NotZero(user.ID)
    
    // Even if we don't delete the user here, it will be gone 
    // from the DB once this function returns!
}
```

## HTTP Integration Testing

Astra provides a fluent HTTP helper to test your API endpoints. It automatically handles setting up the request, recording the response, and parsing JSON.

```go
func (s *UserTestSuite) TestGetProfile() {
    // 1. Create a user and authenticate
    user := s.CreateUser()
    s.AuthAs(user)

    // 2. Perform request
    resp := s.HTTP().
        Get("/api/me").
        Execute()

    // 3. Assertions
    resp.AssertStatus(200)
    resp.AssertJSON(map[string]any{
        "id":    user.ID,
        "email": user.Email,
    })
}
```

## Mocking Services

Astra’s Provider-based architecture makes it easy to swap real services with mocks or fakes during tests.

```go
func (s *UserTestSuite) SetupTest() {
    s.Suite.SetupTest()
    
    // Replace real mailer with a mock
    s.App.Register("mailer", &testing.MockMailer{})
}
```

### Built-in Mocks
- `testing.MockMailer`: Track sent emails and verify contents.
- `testing.MockDispatcher`: Verify background jobs were dispatched without actually running them.
- `testing.MemoryStorage`: Test file uploads using an in-memory filesystem.

## Background Job Testing

You can test that jobs are dispatched correctly or test the job logic in isolation.

```go
func (s *UserTestSuite) TestRegistrationDispatchesEmail() {
    dispatcher := s.App.Get("queue.dispatcher").(*testing.MockDispatcher)
    
    // Trigger registration logic...
    
    // Verify job was queued
    dispatcher.AssertDispatched(&jobs.SendWelcomeEmail{})
}
```

## Running Your Tests

Standard Go testing tools work perfectly with Astra:

```bash
go test ./tests/...
```

> [!IMPORTANT]
> Because Astra uses Testcontainers, you must have **Docker** installed and running on your machine or CI runner to execute integration tests.

## Best Practices

1.  **Use Real Databases**: Avoid using SQL mounters where possible. Real containers are slightly slower but prevent "works in test, fails in prod" bugs related to database specific SQL.
2.  **Factory Pattern**: Create helper methods in your suite (e.g., `s.CreateUser()`) to quickly generate test data.
3.  **No Global State**: Ensure your tests do not rely on or modify global variables, as tests may run in parallel.

## Next Steps

- [Deployment](/docs/deployment) — How to run tests in a CI/CD environment.
- [Observability](/docs/observability) — Trace test execution using the built-in logging.
- [ORM](/docs/orm) — Review safe data manipulation patterns.
