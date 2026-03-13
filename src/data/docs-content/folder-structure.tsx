import { Link } from 'react-router-dom';
import { CodeBlock } from '../../components/docs/CodeBlock';

export const FolderStructureContent = () => (
  <>
    <p>
      Astra follows a "Structure by Purpose" philosophy. It provides a consistent, predictable layout that helps teams stay organized as applications grow from small prototypes to large-scale systems.
    </p>

    <h2>The Default Layout</h2>
    <p>When you create a new Astra project, you are greeted with the following directory structure:</p>
    <CodeBlock 
      language="text" 
      code={`.
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
└── astra.config.yaml   # Main framework configuration`} 
    />

    <h2>Detailed Explanations</h2>

    <h3><code>app/</code> Directory</h3>
    <p>The <code>app</code> folder is the heart of your application.</p>
    <ul>
      <li><strong>Controllers</strong>: Handle incoming HTTP requests, interact with services, and return responses.</li>
      <li><strong>Models</strong>: Define your database schema and business objects using the Astra ORM.</li>
      <li><strong>Providers</strong>: The "glue" of the framework. Use these to register services into the App Container or initialize third-party libraries.</li>
    </ul>

    <h3><code>config/</code> Directory</h3>
    <p>Astra uses a centralized configuration system. Files in this directory are typically YAML or TOML. The framework automatically loads <code>astra.config.yaml</code> to configure core services like the Database, Queue, and Auth.</p>

    <h3><code>database/migrations/</code></h3>
    <p>All schema changes are tracked here. Astra supports both raw SQL migrations and Go-based migrations for complex schema evolutions.</p>

    <h3><code>routes/</code></h3>
    <p>Instead of having one giant <code>main.go</code>, Astra encourages separating routes by concern (e.g., <code>web.go</code> and <code>api.go</code>). These files are where you map URLs to your Controllers.</p>

    <h3><code>storage/</code></h3>
    <p>Used for local file operations. By default, Astra stores runtime logs and temporary file uploads here. In production, you might mount this as a persistent volume or swap the driver for S3.</p>

    <h2>How to Think About Organization</h2>
    <p>As a developer, you should follow these rules of thumb:</p>
    <ol>
      <li><strong>Logic belongs in Services/Models</strong>: Keep your Controllers thin. If a piece of logic is used in both an API and a Background Job, it belongs in a Service or Model.</li>
      <li><strong>Explicit Registration</strong>: If you add a new service (like a PDF generator), create a <code>Provider</code> in <code>app/providers/</code> to initialize it. This makes your application's dependencies clear and testable.</li>
      <li><strong>Route Separation</strong>: Keep your API routes and Web/SSR routes in separate files within the <code>routes/</code> folder to maintain clean middleware separation.</li>
    </ol>

    <h2>Project Tree (Sample App)</h2>
    <p>Here is how a real-world Astra app might look as it matures:</p>
    <CodeBlock 
      language="text" 
      code={`app/
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
  web.go`} 
    />

    <div className="mt-12 py-8 border-t border-[var(--t-border)]">
      <h2 className="mt-0">Next Steps</h2>
      <ul className="list-none pl-0 space-y-2">
        <li>
          <Link to="/docs/core-concepts/routing" className="text-[var(--t-accent)] no-underline hover:underline font-bold">
            Routing &rarr;
          </Link>
          <span className="text-[var(--t-text-muted)] ml-2">— Start mapping requests to your code.</span>
        </li>
        <li>
          <Link to="/docs/introduction/installation" className="text-[var(--t-accent)] no-underline hover:underline font-bold">
            Service Providers &rarr;
          </Link>
          <span className="text-[var(--t-text-muted)] ml-2">— Learn how to extend Astra with your own services.</span>
        </li>
        <li>
          <Link to="/docs/database/orm" className="text-[var(--t-accent)] no-underline hover:underline font-bold">
            ORM &amp; Models &rarr;
          </Link>
          <span className="text-[var(--t-text-muted)] ml-2">— Define your data structures.</span>
        </li>
      </ul>
    </div>
  </>
);
