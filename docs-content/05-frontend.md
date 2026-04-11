# 05. Frontend

Astra treats the frontend as part of the application, not as a disconnected asset folder. The goal is to make development fast, production predictable, and realtime behavior first-class.

## Why this integration exists

The frontend story has to work in two modes at the same time:

1. During development, the browser should talk to Vite for HMR.
2. In production, the Go application should serve fingerprinted assets from a manifest.

That dual-mode behavior keeps development fluid without making production depend on a dev server.

## Vite asset pipeline

Astra’s Vite integration is built around a manifest manager and a template helper registration path. In development, the template helper emits Vite client scripts directly from the dev server. In production, Astra reads the manifest and resolves the hashed asset filenames.

This is the right tradeoff because the Go app always knows where the final asset lives, while the frontend developer still gets HMR.

> [!NOTE]
> The manifest is a production concern. Do not hardcode output filenames in templates if the app is going to change builds over time.

## Server-side rendering

Astra’s SSR layer uses the standard template engine pattern with helper functions for assets and app data. The important point is not the template engine itself. The important point is that the server owns rendering, so you can stream pages, control defaults, and keep the initial payload consistent.

Use SSR when the page needs fast first paint, SEO-friendly HTML, or server-rendered state that should be visible before the client bundle runs.

## Realtime with SSE and WebSockets

Use SSE when you need one-way streaming: job progress, notifications, dashboard updates, or append-only event feeds.

Use WebSockets when the client and server both need to talk frequently: chat, collaborative editing, or a room-based realtime feature.

SSE stays simple because it rides on plain HTTP. WebSockets are the right choice only when the protocol really needs full duplex communication.

> [!TIP]
> Start with SSE when you can. It is easier to operate, easier to debug, and usually enough for live updates.

## Copy-Paste Example

```go
package main

import (
    "html/template"
    "fmt"

    "github.com/shauryagautam/Astra/assets"
    "github.com/shauryagautam/Astra/internal/engine"
    astrahttp "github.com/shauryagautam/Astra/internal/engine/http"
    "github.com/shauryagautam/Astra/pkg/realtime"
)

func setupFrontend() {
    assetsPipeline := assets.New(assets.Config{
        Entrypoints: []string{"frontend/src/main.tsx"},
        OutputDir:    "frontend/dist",
        PublicPath:   "/build/",
    })
    _ = assetsPipeline.Build()

    templateEngine := astrahttp.NewTemplateEngine("frontend/views", astrahttp.WithFuncMap(template.FuncMap(assetsPipeline.TemplateHelpers())))
    _ = templateEngine
}

func registerRealtime(r *astrahttp.Router, app *engine.App) {
    roomManager := realtime.NewRoomManager()
    ws := astrahttp.NewWebSocketHandler(roomManager, app)

    r.Get("/events", func(c *astrahttp.Context) error {
        w := c.Writer
        w.Header().Set("Content-Type", "text/event-stream")
        _, _ = fmt.Fprintf(w, "data: hello\n\n")
        return nil
    })

    r.Get("/ws", ws.Connect)
}
```
