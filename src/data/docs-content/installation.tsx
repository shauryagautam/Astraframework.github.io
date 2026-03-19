import { Link } from 'react-router-dom';
import { CodeBlock } from '../../components/shared/CodeBlock';

export const InstallationContent = () => (
  <>
    <p>
      This guide covers the requirements and various ways to set up an Astra development environment.
    </p>

    <h2>Requirements</h2>
    <p>Before you begin, ensure your machine meets the following criteria:</p>
    <ul>
      <li><strong>Go 1.21+</strong>: Astra leverages modern Go features like <code>slog</code> and generic query builders.</li>
      <li><strong>Operating System</strong>: macOS, Linux, or Windows (WSL2 recommended).</li>
      <li><strong>Database</strong>: PostgreSQL (recommended), MySQL, or SQLite for local development.</li>
      <li><strong>Redis</strong>: Required for the built-in Queue and Token Revocation features.</li>
    </ul>

    <h2>Installing the CLI</h2>
    <p>
      The <code>astra</code> CLI is the official tool for managing Astra projects. It is installed via <code>go install</code>:
    </p>
    <CodeBlock 
      language="bash" 
      code="go install github.com/astraframework/astra/cli@latest" 
    />
    <p>Ensure your <code>GOBIN</code> directory (usually <code>$HOME/go/bin</code>) is in your system's <code>PATH</code>.</p>

    <h3>Verifying CLI Installation</h3>
    <CodeBlock 
      language="bash" 
      code="astra --help" 
    />

    <h2>Creating a New Project</h2>
    <p>Once the CLI is installed, you can bootstrap a new project:</p>
    <CodeBlock 
      language="bash" 
      code="astra new [project-name]" 
    />
    <h3>Options</h3>
    <ul>
      <li><code>--git</code>: Initialize a git repository automatically.</li>
      <li><code>--db [driver]</code>: Set the starting database driver (postgres, mysql, sqlite).</li>
    </ul>

    <h2>Environment Setup</h2>
    <p>Astra uses <code>.env</code> files for configuration. A <code>.env.example</code> is generated with every new project.</p>
    <CodeBlock 
      language="bash" 
      code="cp .env.example .env" 
    />

    <h3>Essential Environment Variables</h3>
    <div className="overflow-x-auto my-8">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[var(--t-border-strong)]">
            <th className="py-2 font-bold uppercase text-[10px] tracking-widest text-[var(--t-text-muted)]">Variable</th>
            <th className="py-2 font-bold uppercase text-[10px] tracking-widest text-[var(--t-text-muted)]">Description</th>
            <th className="py-2 font-bold uppercase text-[10px] tracking-widest text-[var(--t-text-muted)]">Default</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          <tr className="border-b border-[var(--t-border)]">
            <td className="py-2 font-mono">APP_ENV</td>
            <td className="py-2 text-[var(--t-text-secondary)]">environment name (<code>development</code>, <code>production</code>)</td>
            <td className="py-2"><code>development</code></td>
          </tr>
          <tr className="border-b border-[var(--t-border)]">
            <td className="py-2 font-mono">APP_PORT</td>
            <td className="py-2 text-[var(--t-text-secondary)]">The port the HTTP server binds to</td>
            <td className="py-2"><code>8080</code></td>
          </tr>
          <tr className="border-b border-[var(--t-border)]">
            <td className="py-2 font-mono">DATABASE_URL</td>
            <td className="py-2 text-[var(--t-text-secondary)]">Connection string for your DB</td>
            <td className="py-2">—</td>
          </tr>
          <tr className="border-b border-[var(--t-border)]">
            <td className="py-2 font-mono">REDIS_URL</td>
            <td className="py-2 text-[var(--t-text-secondary)]">Connection string for Redis</td>
            <td className="py-2"><code>localhost:6379</code></td>
          </tr>
          <tr className="border-b border-[var(--t-border)]">
            <td className="py-2 font-mono">JWT_SECRET</td>
            <td className="py-2 text-[var(--t-text-secondary)]">Secret used for signing tokens</td>
            <td className="py-2">—</td>
          </tr>
        </tbody>
      </table>
    </div>

    <h2>Running Locally</h2>
    <p>To start your application in development mode with hot-reloading:</p>
    <CodeBlock 
      language="bash" 
      code="astra dev" 
    />
    <p>The CLI will watch for file changes in your project and restart the server automatically. For production builds, use standard Go building tools or the <code>astra build</code> command.</p>

    <h2>Common Setup Issues</h2>
    <h3>1. Database Connection Failures</h3>
    <p>Ensure your database server is running and the <code>DATABASE_URL</code> in your <code>.env</code> correctly reflects your credentials.</p>
    <div className="p-6 bg-[var(--t-accent)]/5 rounded-2xl border border-[var(--t-accent)]/10 my-8">
      <p className="m-0 text-sm text-[var(--t-text-secondary)]">
        <strong>Tip:</strong> Astra uses <code>pgx</code> for PostgreSQL, which supports both DSN and URL formats.
      </p>
    </div>

    <h3>2. Redis Missing</h3>
    <p>If you see errors related to <code>queue</code> or <code>auth</code> during startup, check that Redis is accessible. Astra requires Redis for these services by default.</p>

    <h3>3. Missing Dependencies</h3>
    <p>If the project fails to compile, run <code>go mod tidy</code> to ensure all framework dependencies are downloaded.</p>

    <div className="mt-12 py-8 border-t border-[var(--t-border)]">
      <h2 className="mt-0">Next Steps</h2>
      <ul className="list-none pl-0 space-y-2">
        <li>
          <Link to="/docs/introduction/folder-structure" className="text-[var(--t-accent)] no-underline hover:underline font-bold">
            Folder Structure &rarr;
          </Link>
          <span className="text-[var(--t-text-muted)] ml-2">— Understand where to put your code.</span>
        </li>
        <li>
          <Link to="/docs/core-concepts/routing" className="text-[var(--t-accent)] no-underline hover:underline font-bold">
            Routing &rarr;
          </Link>
          <span className="text-[var(--t-text-muted)] ml-2">— Set up your first real application routes.</span>
        </li>
        <li>
          <Link to="/docs/development/deployment" className="text-[var(--t-accent)] no-underline hover:underline font-bold">
            App Configuration &rarr;
          </Link>
          <span className="text-[var(--t-text-muted)] ml-2">— Learn more about customizing <code>astra.config.yaml</code>.</span>
        </li>
      </ul>
    </div>
  </>
);
