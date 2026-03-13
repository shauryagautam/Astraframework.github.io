import { Link } from 'react-router-dom';
import { CodeBlock } from '../../components/docs/CodeBlock';

export const AuthContent = () => (
  <>
    <p>
      Astra provides a multi-strategy authentication system out of the box. Whether you are building a modern stateless API or a traditional session-based web application, Astra has you covered with built-in <strong>JWT</strong> and <strong>Cookie</strong> guards.
    </p>

    <h2>The Core Concept: Guards</h2>
    <p> Authentication in Astra is handled by <strong>Guards</strong>. A guard is responsible for verifying the user's identity for a given request. </p>
    <ul>
      <li><strong>JWT Guard</strong>: Ideal for APIs and mobile backends. It verifies tokens in the <code>Authorization</code> header.</li>
      <li><strong>Cookie Guard</strong>: Ideal for SSR applications. It uses secure, session-based cookies stored in Redis.</li>
    </ul>

    <h2>JWT Authentication</h2>
    <p>Astra's JWT implementation is built for production, featuring automatic token rotation and revocation via Redis.</p>

    <h3>Issuing Tokens</h3>
    <p>When a user logs in, you use the <code>JWTManager</code> to issue a token pair:</p>
    <CodeBlock 
      language="go" 
      code={`func Login(c *http.Context) error {
    // 1. Verify user credentials
    // 2. Issue tokens
    tokens, err := auth.Manager.IssueTokenPair(c.Ctx(), user.ID, nil)
    if err != nil {
        return err
    }
    
    return c.JSON(tokens)
}`} 
    />

    <h3>Protecting Routes</h3>
    <p>Apply the <code>JWTGuard</code> middleware to your routes:</p>
    <CodeBlock 
      language="go" 
      code={`r.Group("/api", func(r *http.Router) {
    r.Use(auth.JWTAuth()) // Middleware that triggers JWTGuard.Attempt
    r.Get("/me", func(c *http.Context) error {
        user := c.AuthUser()
        return c.JSON(user)
    })
})`} 
    />

    <h2>Cookie Authentication</h2>
    <p>For web applications, session-based cookies are often preferred. Astra’s <code>CookieGuard</code> handles session lifecycle, including rotation and regeneration to prevent session fixation.</p>

    <h3>Logging In</h3>
    <CodeBlock 
      language="go" 
      code={`func WebLogin(c *http.Context) error {
    // ... verify credentials ...
    
    // Login and issue secure cookie
    if err := auth.Guard.Login(c, user.ID); err != nil {
        return err
    }
    
    return c.Redirect("/dashboard")
}`} 
    />

    <h3>Registering the Guard</h3>
    <p>Register the session middleware globally or on specific groups:</p>
    <CodeBlock 
      language="go" 
      code={`r.Use(auth.SessionAuth())`} 
    />

    <h2>Authorization &amp; Guards</h2>
    <p>Once an identity is established, you can use <strong>Guards</strong> and <strong>Policies</strong> to authorize actions.</p>

    <h3>Basic Checks</h3>
    <CodeBlock 
      language="go" 
      code={`func Update(c *http.Context) error {
    if !c.IsAuthenticated() {
        return c.Forbidden("")
    }
    
    user := c.AuthUser()
    // ...
}`} 
    />

    <h3>Declarative Authorization</h3>
    <p>Astra supports a familiar "Gate" pattern for complex authorization logic:</p>
    <CodeBlock 
      language="go" 
      code={`// In an authorized handler
if c.Denies("edit", post) {
    return c.Forbidden("You do not own this post")
}

// Or use the shorthand
if err := c.Authorize("delete", comment); err != nil {
    return err // Returns 403 automatically
}`} 
    />

    <h2>Password Hashing</h2>
    <p>Astra includes a production-ready hasher using <strong>Argon2id</strong> (the industry standard) or Bcrypt as a fallback.</p>
    <CodeBlock 
      language="go" 
      code={`// Hash a password
hashed, _ := auth.HashPassword("secret")

// Verify a password
match := auth.CheckPasswordHash("secret", hashed)`} 
    />

    <div className="p-6 bg-[var(--t-accent)]/5 rounded-2xl border border-[var(--t-accent)]/10 my-8">
      <p className="m-0 text-sm text-[var(--t-text-secondary)]">
        <strong>Note:</strong> TOTP (Time-based One-Time Password) support is currently in the experimental phase. Check the <a href="https://github.com/astraframework/astra/releases" target="_blank" className="text-[var(--t-accent)] hover:underline">latest release notes</a> for integration updates.
      </p>
    </div>

    <h2>Secure Best Practices</h2>
    <ol>
      <li><strong>Always use HTTPS</strong>: Astra's handlers will automatically set the <code>Secure</code> flag on cookies when HTTPS is detected.</li>
      <li><strong>Rotate Secrets</strong>: Ensure your <code>JWT_SECRET</code> is at least 32 characters and rotated regularly.</li>
      <li><strong>Use Revocation</strong>: Astra’s Redis integration allows you to revoke refresh tokens immediately if a user's account is compromised.</li>
    </ol>

    <div className="mt-12 py-8 border-t border-[var(--t-border)]">
      <h2 className="mt-0">Next Steps</h2>
      <ul className="list-none pl-0 space-y-2">
        <li>
          <Link to="/docs/database/orm" className="text-[var(--t-accent)] no-underline hover:underline font-bold">
            ORM &amp; Models &rarr;
          </Link>
          <span className="text-[var(--t-text-muted)] ml-2">— Learn how to link Auth users to your database.</span>
        </li>
        <li>
          <Link to="/docs/core-concepts/http-context" className="text-[var(--t-accent)] no-underline hover:underline font-bold">
            HTTP Context &rarr;
          </Link>
          <span className="text-[var(--t-text-muted)] ml-2">— Explore more Auth-related helpers on the context.</span>
        </li>
        <li>
          <Link to="/docs/core-concepts/middleware" className="text-[var(--t-accent)] no-underline hover:underline font-bold">
            Security Headers &rarr;
          </Link>
          <span className="text-[var(--t-text-muted)] ml-2">— Complement your auth with robust security headers.</span>
        </li>
      </ul>
    </div>
  </>
);
