# 04. Persistence

Astra’s data layer is built for type safety, long-lived transactions, and real database behavior. The goal is not just fluent queries. The goal is to make the database layer predictable under load and composable in tests.

## Why the ORM is generic

Astra’s `QueryBuilder[T]` leverages Go’s generics to provide a type-safe interface for database operations. This removes the need for `interface{}`-heavy APIs and provides compile-time safety for your model types.

### Key Advantages
- **Type Propagation**: The model type `T` is preserved through the entire query chain, including filters, joins, and terminal operations.
- **Fluent Interface**: Compose complex queries using a readable, method-chained API.
- **Lazy Execution**: Queries are only executed when a terminal method like `Get`, `All`, or `First` is called.

```go
// Example of a complex type-safe query
users, err := database.NewQueryBuilder[User](db).
    With("Profile").
    Where("active", "=", true).
    WhereIn("role", []string{"admin", "editor"}).
    Limit(10).
    Get(ctx)
```

## Migrations

Database schema evolution is handled by the Astra Migration Runner. It ensures that your schema stays in sync across development, staging, and production environments.

### Features
- **Deterministic Order**: Migrations are executed in alphabetical/numerical order based on their filename prefix (e.g., `0001_initial.sql`).
- **Atomic Migrations**: Astra wraps each migration in a transaction (where supported by the database) to ensure that partial failures don't leave your schema in an inconsistent state.
- **Checksum Validation**: Astra records the checksum of applied migrations to prevent accidental modifications to the history.

```bash
# Generating a new migration
astra migrate create add_users_table

# Applying pending migrations
astra migrate up
```

> [!CAUTION]
> Never modify a migration file once it has been applied to production. If you need to change the schema, create a new "roll-forward" migration instead.

## Multiple database instances

Astra supports multiple open database instances in the same process. That is useful when you are separating transactional data from analytics, or when a service still has to talk to a legacy database while introducing a new one.

The rule is simple: use explicit connections for explicit concerns. Do not hide the active database behind global state.

## Copy-Paste Example

```go
package main

import (
    "context"
    "fmt"

    "github.com/shauryagautam/Astra/pkg/database"
)

type User struct {
    ID     int64
    Email  string
    Status string
}

func main() {
    db, err := database.Open(database.Config{
        Driver: "postgres",
        DSN:    "postgres://astra:astra@localhost:5432/astra?sslmode=disable",
    })
    if err != nil {
        panic(err)
    }

    ctx := context.Background()
    users, err := database.NewQueryBuilder[User](db).
        Where("status", "=", "active").
        With("profile").
        Get(ctx)
    if err != nil {
        panic(err)
    }

    _ = users

    for user, err := range database.NewQueryBuilder[User](db).All(ctx) {
        if err != nil {
            panic(err)
        }
        fmt.Println(user.Email)
    }

    err = db.Transaction(ctx, func(txCtx context.Context) error {
        return db.Transaction(txCtx, func(innerCtx context.Context) error {
            _ = innerCtx
            return nil
        })
    })
    if err != nil {
        panic(err)
    }

}
```
