FILE: /docs/events

# Events & Listeners

Astra's event system provides a simple implementation of the Observer pattern, allowing you to subscribe to and listen for various events that occur in your application. This promotes loose coupling, as a single event can have multiple listeners that do not depend on each other.

## Defining Events

In Astra, an event can be any type, but it is typically a struct that holds the data associated with the event.

```go
package events

type UserRegistered struct {
    UserID    uint
    Email     string
    RegisteredAt time.Time
}
```

## Emitting Events

To broadcast an event, use the `Emit` method provided by the default emitter.

```go
func Register(c *http.Context) error {
    // ... user registration logic ...
    
    events.Emit(c.Ctx(), &events.UserRegistered{
        UserID: user.ID,
        Email:  user.Email,
        RegisteredAt: time.Now(),
    })
    
    return c.JSON(user)
}
```

## Listening for Events

Listeners are typically registered in your `AppProvider`. A listener is a function that receives the event data and can perform any necessary actions.

```go
func (p *AppProvider) Boot(a *core.App) error {
    // Synchronous listener
    events.Listen(&events.UserRegistered{}, func(event any) {
        e := event.(*events.UserRegistered)
        fmt.Printf("User registered: %s\n", e.Email)
    })
    
    return nil
}
```

### Async Listeners

If a listener performs a slow operation (like calling a third-party API), you should run it asynchronously. You can do this by wrapping the logic in a background job or using the `ListenAsync` helper if supported.

> [!TIP]
> **Best Practice**: For maximum reliability, use a Listener to dispatch a [Background Job](/docs/queues). This ensures the task is retried if it fails.

```go
events.Listen(&events.UserRegistered{}, func(event any) {
    e := event.(*events.UserRegistered)
    // Dispatch a job instead of doing work directly
    dispatcher.Dispatch(ctx, &jobs.SendWelcomeEmail{Email: e.Email})
})
```

## Wildcard Listeners

You can listen for all events by using the asterisk (`*`) wildcard. This is particularly useful for audit logging or debugging.

```go
events.Listen("*", func(name string, event any) {
    logger.Info("Event emitted", "name", name, "data", event)
})
```

## Event Discovery

Astra can automatically discover listeners if they follow the naming convention and are placed in the `app/listeners` directory, depending on your project configuration.

## Real-World Examples

-   **User Signup**: Emit `UserRegistered` -> Listeners send a welcome email, create a default profile, and notify the sales team via Slack.
-   **Order Placed**: Emit `OrderPlaced` -> Listeners update inventory, generate an invoice PDF, and trigger a shipment job.
-   **System Health**: Emit `HighCPUUsage` -> Listeners send an alert to PagerDuty.

## Next Steps

-   [Queues](/docs/queues) — Combine events with background jobs for resilient processing.
-   [Observability](/docs/observability) — See how emitted events are tracked in system logs.
-   [Folder Structure](/docs/folder-structure) — Best practices for organizing your events and listeners.
