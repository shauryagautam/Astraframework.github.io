FILE: /docs/folder-structure

# Folder Structure

Astra follows a "Structure by Purpose" philosophy. It provides a consistent, predictable layout that helps teams stay organized as applications grow from small prototypes to large-scale systems.

## The Default Layout

When you create a new Astra project, you are greeted with the following directory structure:

```text
.
├── app/                # Core business logic
│   ├── controllers/    # HTTP Handlers
│   ├── models/         # Database Models
│   ├── providers/      # Service Registration
│   ├── jobs/           # Background Jobs
│   ├── events/         # Event Listeners
│   └── services/       # Domain/Feature Logic
├── config/             # Framework and custom config YAMLs
├── database/           
│   └── migrations/     # SQL or Go schema migrations
├── infra/              # Infrastructure code (Docker, K8s, etc.)
├── public/             # Static assets (images, fonts)
├── routes/             # Route registration files
├── storage/            # Local file storage (logs, temp uploads)
├── tests/              # Integration and End-to-End tests
├── .env.example        # Environment variable template
├── go.mod              # Go dependencies
├── main.go             # Application entry point
└── astra.config.yaml   # Main framework configuration
```

## Detailed Explanations

### `app/` Directory
The `app` folder is the heart of your application.
- **Controllers**: Handle incoming HTTP requests, interact with services, and return responses.
- **Models**: Define your database schema and business objects using the Astra ORM.
- **Providers**: The "glue" of the framework. Use these to register services into the App Container or initialize third-party libraries.

### `config/` Directory
Astra uses a centralized configuration system. Files in this directory are typically YAML or TOML. The framework automatically loads `astra.config.yaml` to configure core services like the Database, Queue, and Auth.

### `database/migrations/`
All schema changes are tracked here. Astra supports both raw SQL migrations and Go-based migrations for complex schema evolutions.

### `routes/`
Instead of having one giant `main.go`, Astra encourages separating routes by concern (e.g., `web.go` and `api.go`). These files are where you map URLs to your Controllers.

### `storage/`
Used for local file operations. By default, Astra stores runtime logs and temporary file uploads here. In production, you might mount this as a persistent volume or swap the driver for S3.

## How to Think About Organization

As a developer, you should follow these rules of thumb:

1.  **Logic belongs in Services/Models**: Keep your Controllers thin. If a piece of logic is used in both an API and a Background Job, it belongs in a Service or Model.
2.  **Explicit Registration**: If you add a new service (like a PDF generator), create a `Provider` in `app/providers/` to initialize it. This makes your application's dependencies clear and testable.
3.  **Route Separation**: Keep your API routes and Web/SSR routes in separate files within the `routes/` folder to maintain clean middleware separation.

## Project Tree (Sample App)

Here is how a real-world Astra app might look as it matures:

```text
app/
  controllers/
    auth_controller.go
    user_controller.go
  models/
    user.go
    post.go
  providers/
    app_provider.go
    auth_provider.go
  jobs/
    send_welcome_email.go
  events/
    user_registered.go
routes/
  api.go
  web.go
```

## Next Steps

- [Routing](/docs/routing) — Start mapping requests to your code.
- [Service Providers](/docs/installation) — Learn how to extend Astra with your own services.
- [ORM & Models](/docs/orm) — Define your data structures.
