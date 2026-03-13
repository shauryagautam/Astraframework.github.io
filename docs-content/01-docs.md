FILE: /docs

# Introduction

Astra is a modern, structured Go web framework designed for developers who value productivity, type safety, and clean architecture. It provides a batteries-included experience, offering a comprehensive suite of integrated tools—from routing and ORM to authentication and event-driven backgrounds—without the fragmentation of the typical Go micro-library ecosystem.

## What kind of framework is Astra?

Astra is a **full-stack, batteries-included framework**. Unlike many Go "routers" or "toolkits," Astra provides a high-level, opinionated architecture that handles the complexities of modern application development. It is built for building scaleable APIs, robust Server-Side Rendered (SSR) applications, and complex event-driven systems.

## Core Philosophy

Astra's design is guided by four primary pillars:

- **Convention over Configuration**: Astra provides sensible defaults for project structure and component behavior, reducing "decision fatigue" while remaining fully extensible.
- **Provider-Based Architecture**: Every major component is a "Provider," allowing for clear separation of concerns, explicit initialization, and easy mocking during tests.
- **Type-Safe & Ergonomic**: Leverages Go's type system to provide a fluent API that feels natural to Go developers, with minimal interface{} and high-performance JSON handling via ByteDance Sonic.
- **Production-First**: Built-in support for OpenTelemetry (OTEL), structured logging (slog), health checks, and security headers is standard, not an afterthought.

## Official Development Paths

Astra is versatile and supports various architectural styles:

1.  **API Development**: The primary path for modern backends. Includes automatic JSON binding, declarative validation, and first-class JWT support.
2.  **SSR Applications**: Build traditional web apps with server-side rendering, integrated flash messages, and session-based authentication.
3.  **Hybrid Applications**: Seamlessly combine RESTful APIs with interactive web pages in a single, unified codebase.
4.  **Event-Driven Systems**: Utilize Astra's built-in event dispatcher and Redis-backed queues to build resilient, asynchronous microservices.

## Why Astra Exists

The Go ecosystem is rich with excellent libraries, but building a production application often requires stitching together dozens of incompatible packages. This leads to inconsistent patterns, repetitive boilerplate, and security vulnerabilities.

Astra solves this by providing **one official story**. We’ve done the hard work of integrating the best patterns for routing, data access, and security into a cohesive unit. When you use Astra, you’re not just using a library; you’re using a foundation built for engineers who want to ship software.

## What’s Included?

Astra comes with everything you need to go from an idea to production:

- **HTTP Layer**: High-performance routing built on `chi`, with an ergonomic `Context` wrapper.
- **Data Layer**: A schema-first ORM with fluent queries, relations, and robust migrations.
- **Auth & Guarding**: Comprehensive JWT and Cookie-based authentication with fine-grained authorization policies.
- **Background Jobs**: A Redis-backed queue system with support for delayed jobs, retries, and failed job management.
- **Testing Suite**: Integration testing helpers that use Testcontainers to give you real Redis and Postgres environments for every test.
- **Observability**: First-class integration with OpenTelemetry, structured logging, and automated request tracing.

## Next Steps

Ready to build your first application?

- [Quickstart](/docs/quickstart) — Get up and running in under 5 minutes.
- [Installation](/docs/installation) — Deep dive into requirements and CLI setup.
- [Architecture & Folder Structure](/docs/folder-structure) — Understand how Astra organizes your code.
