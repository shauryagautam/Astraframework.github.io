
# Background Jobs & Queues

For tasks that are slow or resource-intensive (like sending emails, processing uploads, or calling external APIs), Astra provides a robust, Redis-backed queue system. Offloading these tasks to background jobs ensures your HTTP responses remain fast and responsive.

## Core Concepts

-   **Job**: A discrete unit of work that implements the `Job` interface.
-   **Dispatcher**: The service responsible for pushing jobs onto the queue.
-   **Worker**: A long-running process that pulls jobs from the queue and executes them.
-   **Failed Jobs**: A persistent store (usually database or Redis) that tracks jobs that failed after all retry attempts.

## Defining a Job

Jobs are structs that implement the `Handle` method.

```go
package jobs

import (
    "context"
    "github.com/astraframework/astra/core"
)

type SendWelcomeEmail struct {
    UserID uint
    Email  string
}

func (j *SendWelcomeEmail) Handle(ctx context.Context, app *core.App) error {
    // Logic to send email using app.Get("mailer")
    return nil
}

// Optional: Customize retries
func (j *SendWelcomeEmail) Retries() int {
    return 3
}
```

## Dispatching Jobs

You can dispatch jobs from anywhere in your application (controllers, services, or other jobs) using the `Dispatcher`.

```go
func Register(c *http.Context) error {
    // ... logic ...
    
    // Dispatch immediately
    dispatcher := c.App.Get("queue.dispatcher").(queue.Dispatcher)
    err := dispatcher.Dispatch(c.Ctx(), &jobs.SendWelcomeEmail{
        UserID: user.ID,
        Email: user.Email,
    })
    
    return c.JSON(user)
}
```

### Delayed Jobs
Schedule a job to run after a specific duration:

```go
err := dispatcher.Delay(c.Ctx(), &jobs.ProcessVideo{ID: 123}, 5 * time.Minute)
```

## Running Workers

In development, the `astra dev` command automatically starts a background worker. In production, you typically run workers as separate processes or inside your main application container.

To start a worker manually:
```bash
astra worker:start --queue=default --concurrency=10
```

## Failed Jobs & Retries

Astra automatically handles job failures. If a job returns an error:

1.  **Retry**: The worker will re-queue the job if `Retries()` is greater than 0.
2.  **Backoff**: Astra uses an exponential backoff strategy (e.g., 5s, 10s, 20s) between retries.
3.  **Failed**: If all retries fail, the job is moved to the "Failed Jobs" table for manual inspection and retrying.

### Manually Retrying Failed Jobs
```bash
astra queue:retry {job_id}
astra queue:retry all
```

## The Task Scheduler (Cron)

Astra includes a built-in scheduler for running jobs on a regular interval (crontab-style).

```go
// In your AppProvider
func (p *AppProvider) Boot(a *core.App) error {
    scheduler := a.Get("scheduler").(*queue.Scheduler)
    
    // Run every day at midnight
    scheduler.Schedule("0 0 * * *", &jobs.CleanupTempFiles{})
    
    return nil
}
```

## Operational Guidance

> [!TIP]
> **Use Redis Persistence**: Ensure your Redis instance is configured with persistence (RDB or AOF) so that queued jobs are not lost if the Redis server restarts.

-   **Monitor Queue Depth**: Use `astra queue:status` to monitor the number of pending and failed jobs.
-   **Graceful Shutdown**: Astra workers listen for SIGINT/SIGTERM and will attempt to finish the current job before exiting.
-   **Unique Jobs**: If you need to prevent the same job from being queued multiple times, implement the `Unique()` method on your job struct.

## Next Steps

-   [Events](/docs/events) — Learn how to trigger jobs automatically when something happens in your app.
-   [Observability](/docs/observability) — See how to trace background job execution in OpenTelemetry.
-   [Production Deployment](/docs/deployment) — Best practices for running workers at scale.
