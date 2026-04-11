import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, Share2, Database, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from '../context/ThemeContext';
import { CopyButton } from './shared/CopyButton';

const examples = [
  {
    id: 'routing',
    label: 'Routing',
    icon: Code,
    title: 'Defining a Route',
    code: `Go
func TestUserRegistration(t *testing.T) {
    app := test_util.NewTestApp(t, func(app *engine.App, r *http.Router) {
        r.Post("/register", UserHandler{}.Store)
    })

    app.POST("/register", map[string]string{
        "email":    "naut@astra.dev",
        "password": "secret-password",
    }).
    ExpectStatus(201).
    ExpectJSON("message", "User created successfully")
}`
  },
  {
    id: 'database',
    label: 'Database',
    icon: Database,
    title: 'Model & Query',
    code: `type User struct {
    ID    int64  \`json:"id"\`
    Name  string \`json:"name"\`
    Email string \`json:"email"\`
}

func GetUser(c *astra.Context) error {
    id := c.Param("id")
    var user User
    
    // Astra's integrated ORM with pgx/v5
    err := astra.DB().Model(&user).Where("id = ?", id).First()
    if err != nil {
        return c.NotFound(err.Error())
    }
    
    return c.JSON(200, user)
}`
  },
  {
    id: 'realtime',
    label: 'Real-time',
    icon: Zap,
    title: 'WebSockets',
    code: `app.WS("/chat", func(ws *astra.WebSocket) {
    ws.On("message", func(data []byte) {
        // Broadcast to all clients in the room
        ws.Broadcast("new_message", data)
    })
    
    ws.On("join", func() {
        fmt.Println("Client joined the chat!")
    })
})`
  },
  {
    id: 'security',
    label: 'Auth',
    icon: ShieldCheck,
    title: 'JWT Middleware',
    code: `// Protect routes with built-in JWT middleware
admin := app.Group("/admin")
admin.Use(astra.AuthMiddleware(astra.AuthConfig{
    Secret: "your-super-secret",
}))

admin.Get("/dashboard", func(c *astra.Context) error {
    user := c.User() // Retrieve authenticated user
    return c.Render("dashboard", astra.M{
        "User": user,
    })
})`
  }
];

export const CodeExample = () => {
  const [activeTab, setActiveTab] = useState(examples[0].id);
  const activeExample = examples.find(e => e.id === activeTab)!;
  const { theme } = useTheme();
  const isGlass = theme === 'liquid-glass';

  return (
    <section id="showcase" className={cn(
      "px-6 py-24 text-white overflow-hidden relative",
      isGlass ? "bg-transparent" : "bg-black"
    )}>
      <div className="grid-background-dark absolute inset-0 opacity-10" />
      
      <div className="max-w-7xl mx-auto relative z-10 px-4 md:px-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 md:mb-16 gap-8">
          <div className="flex flex-col">
            <span className="text-[10px] text-[#8A8A8A] mb-2 uppercase tracking-widest">Showcase</span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl">BUILD WITH<br />GO.</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {examples.map((example) => (
              <button
                key={example.id}
                onClick={() => setActiveTab(example.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase transition-all tracking-tighter border",
                  activeTab === example.id 
                    ? "bg-white text-black border-white" 
                    : "border-white/10 hover:bg-white/5 text-[#8A8A8A]"
                )}
              >
                <example.icon size={14} />
                {example.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-4xl mb-6 font-display">{activeExample.title}</h3>
                <p className="text-[#8A8A8A] text-lg leading-relaxed mb-8">
                  Astra provides clear patterns and conventions for building web applications in Go, focusing on developer productivity and code maintainability.
                </p>
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-2xl font-display">Type-Safe</span>
                    <span className="text-[10px] uppercase opacity-50">Development</span>
                  </div>
                  <div className="w-px h-10 bg-white/10" />
                  <div className="flex flex-col">
                    <span className="text-2xl font-display">Structured</span>
                    <span className="text-[10px] uppercase opacity-50">Architecture</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <motion.div
              layout
              className={cn(
                "rounded-xl border overflow-hidden shadow-2xl",
                isGlass
                  ? "glass-panel-strong border-white/10"
                  : "bg-[#0a0a0a] border-white/10"
              )}
            >
              <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-4 text-xs font-mono text-white/40">
                  <span className="flex items-center gap-1"><Share2 size={12} /> main.go</span>
                </div>
                <CopyButton text={activeExample.code} className="px-3 py-1.5 h-auto text-xs font-medium" />
              </div>
              <div className="p-8 font-mono text-sm overflow-x-auto">
                <AnimatePresence mode="wait">
                  <motion.pre
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="text-white/80"
                  >
                    <code>{activeExample.code}</code>
                  </motion.pre>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
