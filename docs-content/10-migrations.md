
# Database Migrations

Migrations are a type of version control for your database, allowing your team to modify and share the application's database schema. Astra's migration system is deeply integrated with the CLI and supports both raw SQL and type-safe Go schema builders.

## Creating Migrations

Use the `astra` CLI to generate a new migration file:

```bash
astra migrate:make create_users_table
```

This will create a new file in your `database/migrations/` directory with a timestamp prefix, such as `20240315103045_create_users_table.go`.

## Defining the Schema

Astra migrations consist of two methods: `Up` (to apply changes) and `Down` (to rollback changes).

### Using the Go Schema Builder
The schema builder provides a fluent API for defining tables and columns.

```go
package migrations

import (
    "github.com/astraframework/astra/orm/schema"
)

func CreateUsersTable(s *schema.Builder) {
    s.CreateTable("users", func(t *schema.Table) {
        t.Increments("id")
        t.String("email").Unique()
        t.String("password")
        t.String("name").Nullable()
        t.Timestamps() // Adds created_at and updated_at
        t.SoftDeletes() // Adds deleted_at
    })
}

func DownCreateUsersTable(s *schema.Builder) {
    s.DropTable("users")
}
```

### Supported Column Types
- `t.String(name)`
- `t.Integer(name)`
- `t.BigInt(name)`
- `t.Boolean(name)`
- `t.Text(name)`
- `t.Decimal(name, precision, scale)`
- `t.Timestamp(name)`
- `t.JSON(name)`

## Running Migrations

To apply all pending migrations to your database:

```bash
astra migrate
```

Astra tracks which migrations have already been run in a special `migrations` table in your database.

## Rolling Back Migrations

If you need to undo the last batch of migrations:

```bash
astra migrate:rollback
```

To rollback all migrations (wipe the database):

```bash
astra migrate:reset
```

## Schema Evolution Workflow

1.  **Generate**: Create a migration file with the CLI.
2.  **Define**: Write your `Up` and `Down` logic using the schema builder.
3.  **Apply**: Run `astra migrate` to update your local database.
4.  **Commit**: Check the migration file into version control.
5.  **Deploy**: Run `astra migrate` as part of your CI/CD pipeline.

## Advanced: Raw SQL Migrations

While the Go builder is recommended for portability, you can also use raw SQL if you need to use database-specific features:

```go
func CustomMigration(s *schema.Builder) {
    s.Raw("CREATE INDEX idx_user_email_lower ON users (LOWER(email))")
}
```

## Deployment Advice

> [!IMPORTANT]
> Always run your migrations as a pre-deployment step. Ensure your database user has the necessary permissions (CREATE, ALTER, DROP) to modify the schema.

- **Use Transactions**: Astra attempts to wrap migrations in transactions where the database driver supports it.
- **Backup Often**: Before running migrations on production, ensure you have a fresh backup of your data.
- **Test Rollbacks**: Periodically verify that your `Down` methods work as expected to ensure you can recover from a failed deployment.

## Next Steps

- [ORM & Models](/docs/orm) — Map your newly created tables to Go structs.
- [Validation](/docs/validation) — Ensure incoming data matches your schema constraints.
- [Deployment Checklist](/docs/deployment) — Best practices for managing database state in production.
