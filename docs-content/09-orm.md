FILE: /docs/orm

# ORM & Data Layer

Astra features a powerful, schema-first ORM that leverages Go's generic system to provide a type-safe and highly expressive way to interact with your database. Whether you are using PostgreSQL, MySQL, or SQLite, Astra's query builder ensures consistent performance and clean code.

## Defining Models

In Astra, models are standard Go structs. You use struct tags to map fields to database columns and define constraints.

```go
package models

import (
    "time"
    "github.com/astraframework/astra/orm"
)

type User struct {
    ID        uint      `orm:"pk,auto"`
    Email     string    `orm:"column:email,unique"`
    Name      string    `orm:"column:name"`
    CreatedAt time.Time `orm:"column:created_at"`
    UpdatedAt time.Time `orm:"column:updated_at"`
    DeletedAt *time.Time `orm:"column:deleted_at,soft_delete"` // Optional Soft Deletes
}
```

## Querying Data

Astra provides a fluent, generic query builder that makes reading data intuitive.

### Fetching All Records
```go
users, err := orm.Query[models.User](db).All(ctx)
```

### Filtering with Wheres
```go
user, err := orm.Query[models.User](db).
    Where("email", "=", "john@example.com").
    First(ctx)
```

### Complex Queries
```go
activeUsers, err := orm.Query[models.User](db).
    Where("status", "=", "active").
    WhereIn("role", []any{"admin", "editor"}).
    OrderBy("created_at", "DESC").
    Limit(10).
    Get(ctx)
```

## CRUD Operations

### Creating Records
```go
user = models.User{Name: "Alice", Email: "alice@example.com"}
newUser, err := orm.Query[models.User](db).Create(user, ctx)
```

### Updating Records
```go
// Direct update
err := orm.Query[models.User](db).
    Where("id", "=", 1).
    Update(map[string]any{"name": "New Name"}, ctx)

// Saving a model instance
user.Name = "Updated Name"
err := orm.Query[models.User](db).Save(&user, ctx)
```

### Deleting Records
```go
// Soft delete (if DeletedAt is defined)
err := orm.Query[models.User](db).Where("id", "=", 1).Delete(ctx)

// Permanent delete
err := orm.Query[models.User](db).Where("id", "=", 1).ForceDelete(ctx)
```

## Relationships

Astra handles standard database relationships with eager loading to prevent N+1 query problems.

### Defining Relations
```go
type Post struct {
    ID      uint   `orm:"pk,auto"`
    Title   string `orm:"column:title"`
    UserID  uint   `orm:"column:user_id"`
    // Relations
    Author  *User  `orm:"belongs_to,field:UserID"`
    Comments []Comment `orm:"has_many,foreign_key:PostID"`
}
```

### Eager Loading
Use the `With` method to load related models in a single optimized pass.
```go
posts, err := orm.Query[models.Post](db).
    With("Author", "Comments").
    Get(ctx)
```

## Pagination

Astra includes built-in pagination that works seamlessly with the `Context` pagination helpers.

```go
results, err := orm.Query[models.User](db).
    Paginate(c.Page(), c.PerPage(50), ctx)

// access results.Data, results.Total, results.LastPage
```

## Model Hooks

You can define hooks on your models to perform actions automatically during the lifecycle.

```go
func (u *User) BeforeCreate(ctx context.Context, db *orm.DB) error {
    u.CreatedAt = time.Now()
    return nil
}

func (u *User) AfterFind(ctx context.Context, db *orm.DB) error {
    // Perform post-fetch logic
    return nil
}
```

## Scopes & Repositories

For reusable query logic, Astra encourages using "Scopes".

```go
func Active(q *orm.QueryBuilder[models.User]) *orm.QueryBuilder[models.User] {
    return q.Where("status", "=", "active")
}

// Usage
users, _ := orm.Query[models.User](db).Scope(Active).Get(ctx)
```

## Next Steps

- [Migrations](/docs/migrations) — Learn how to evolve your schema.
- [Validation](/docs/validation) — Connect your ORM models to request validation.
- [Testing](/docs/testing) — See how to test your data layer with real containers.
