import { Link } from 'react-router-dom';

export const OverviewContent = () => (
  <>
    <p>
      Astra is a modern, structured Go web framework designed for developers who value productivity, type safety, and clean architecture. It provides a batteries-included experience, offering a comprehensive suite of integrated tools—from routing and ORM to authentication and event-driven backgrounds—without the fragmentation of the typical Go micro-library ecosystem.
    </p>

    <h2>What kind of framework is Astra?</h2>
    <p>
      Astra is a <strong>full-stack, batteries-included framework</strong>. Unlike many Go "routers" or "toolkits," Astra provides a high-level, opinionated architecture that handles the complexities of modern application development. It is built for building scaleable APIs, robust Server-Side Rendered (SSR) applications, and complex event-driven systems.
    </p>

    <h2>Core Philosophy</h2>
    <p>Astra's design is guided by four primary pillars:</p>
    <ul>
      <li><strong>Convention over Configuration</strong>: Astra provides sensible defaults for project structure and component behavior, reducing "decision fatigue" while remaining fully extensible.</li>
      <li><strong>Provider-Based Architecture</strong>: Every major component is a "Provider," allowing for clear separation of concerns, explicit initialization, and easy mocking during tests.</li>
      <li><strong>Type-Safe &amp; Ergonomic</strong>: Leverages Go's type system to provide a fluent API that feels natural to Go developers, with minimal interface{} and high-performance JSON handling via ByteDance Sonic.</li>
      <li><strong>Production-First</strong>: Built-in support for OpenTelemetry (OTEL), structured logging (slog), health checks, and security headers is standard, not an afterthought.</li>
    </ul>

    <h2>Official Development Paths</h2>
    <p>Astra is versatile and supports various architectural styles:</p>
    <ol>
      <li><strong>API Development</strong>: The primary path for modern backends. Includes automatic JSON binding, declarative validation, and first-class JWT support.</li>
      <li><strong>SSR Applications</strong>: Build traditional web apps with server-side rendering, integrated flash messages, and session-based authentication.</li>
      <li><strong>Hybrid Applications</strong>: Seamlessly combine RESTful APIs with interactive web pages in a single, unified codebase.</li>
      <li><strong>Event-Driven Systems</strong>: Utilize Astra's built-in event dispatcher and Redis-backed queues to build resilient, asynchronous microservices.</li>
    </ol>

    <h2>Why Astra Exists</h2>
    <p>
      The Go ecosystem is rich with excellent libraries, but building a production application often requires stitching together dozens of incompatible packages. This leads to inconsistent patterns, repetitive boilerplate, and security vulnerabilities.
    </p>
    <p>
      Astra solves this by providing <strong>one official story</strong>. We’ve done the hard work of integrating the best patterns for routing, data access, and security into a cohesive unit. When you use Astra, you’re not just using a library; you’re using a foundation built for engineers who want to ship software.
    </p>

    <h2>What’s Included?</h2>
    <p>Astra comes with everything you need to go from an idea to production:</p>
    <ul>
      <li><strong>HTTP Layer</strong>: High-performance routing built on <code>chi</code>, with an ergonomic <code>Context</code> wrapper.</li>
      <li><strong>Data Layer</strong>: A schema-first ORM with fluent queries, relations, and robust migrations.</li>
      <li><strong>Auth &amp; Guarding</strong>: Comprehensive JWT and Cookie-based authentication with fine-grained authorization policies.</li>
      <li><strong>Background Jobs</strong>: A Redis-backed queue system with support for delayed jobs, retries, and failed job management.</li>
      <li><strong>Testing Suite</strong>: Integration testing helpers that use Testcontainers to give you real Redis and Postgres environments for every test.</li>
      <li><strong>Observability</strong>: First-class integration with OpenTelemetry, structured logging, and automated request tracing.</li>
    </ul>

    <div className="mt-12 py-8 border-t border-(--t-border)">
      <h2 className="mt-0">Next Steps</h2>
      <p>Ready to build your first application?</p>
      <ul className="list-none pl-0 space-y-2">
        <li>
          <Link to="/docs/introduction/quickstart" className="text-(--t-accent) no-underline hover:underline font-bold">
            Quickstart &rarr;
          </Link>
          <span className="text-(--t-text-muted) ml-2">— Get up and running in under 5 minutes.</span>
        </li>
        <li>
          <Link to="/docs/introduction/installation" className="text-(--t-accent) no-underline hover:underline font-bold">
            Installation &rarr;
          </Link>
          <span className="text-(--t-text-muted) ml-2">— Deep dive into requirements and CLI setup.</span>
        </li>
        <li>
          <Link to="/docs/introduction/folder-structure" className="text-(--t-accent) no-underline hover:underline font-bold">
            Architecture &amp; Folder Structure &rarr;
          </Link>
          <span className="text-(--t-text-muted) ml-2">— Understand how Astra organizes your code.</span>
        </li>
      </ul>
    </div>
  </>
);
