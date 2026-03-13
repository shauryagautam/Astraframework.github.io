FILE: /docs/installation

# Installation

This guide covers the requirements and various ways to set up an Astra development environment.

## Requirements

Before you begin, ensure your machine meets the following criteria:

- **Go 1.21+**: Astra leverages modern Go features like `slog` and generic query builders.
- **Operating System**: macOS, Linux, or Windows (WSL2 recommended).
- **Database**: PostgreSQL (recommended), MySQL, or SQLite for local development.
- **Redis**: Required for the built-in Queue and Token Revocation features.

## Installing the CLI

The `astra` CLI is the official tool for managing Astra projects. It is installed via `go install`:

```bash
go install github.com/astraframework/astra/cli@latest
```

Ensure your `GOBIN` directory (usually `$HOME/go/bin`) is in your system's `PATH`.

### Verifying CLI Installation

```bash
astra --help
```

## Creating a New Project

Once the CLI is installed, you can bootstrap a new project:

```bash
astra new [project-name]
```

### Options

- `--git`: Initialize a git repository automatically.
- `--db [driver]`: Set the starting database driver (postgres, mysql, sqlite).

## Environment Setup

Astra uses `.env` files for configuration. A `.env.example` is generated with every new project.

```bash
cp .env.example .env
```

### Essential Environment Variables

| Variable | Description | Default |
| :--- | :--- | :--- |
| `APP_ENV` | environment name (`development`, `production`) | `development` |
| `APP_PORT` | The port the HTTP server binds to | `8080` |
| `DATABASE_URL` | Connection string for your DB | - |
| `REDIS_URL` | Connection string for Redis | `localhost:6379` |
| `JWT_SECRET` | Secret used for signing tokens | - |

## Running Locally

To start your application in development mode with hot-reloading:

```bash
astra dev
```

The CLI will watch for file changes in your project and restart the server automatically. For production builds, use standard Go building tools or the `astra build` command.

## Common Setup Issues

### 1. Database Connection Failures
Ensure your database server is running and the `DATABASE_URL` in your `.env` correctly reflects your credentials.

> [!TIP]
> Astra uses `pgx` for PostgreSQL, which supports both DSN and URL formats.

### 2. Redis Missing
If you see errors related to `queue` or `auth` during startup, check that Redis is accessible. Astra requires Redis for these services by default.

### 3. Missing Dependencies
If the project fails to compile, run `go mod tidy` to ensure all framework dependencies are downloaded.

## Next Steps

- [Folder Structure](/docs/folder-structure) — Understand where to put your code.
- [Routing](/docs/routing) — Set up your first real application routes.
- [App Configuration](/docs/deployment) — Learn more about customizing `astra.config.yaml`.
