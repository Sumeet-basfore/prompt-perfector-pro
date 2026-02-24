export const TEMPLATES = [
  {
    id: "ui-frontend",
    label: "UI & Frontend",
    icon: "🎨",
    description: "Components, layouts, responsive design, animations",
    example: "Build a dashboard that shows my team's tasks",
  },
  {
    id: "database-design",
    label: "Database Design",
    icon: "🗄️",
    description: "Tables, relationships, migrations, queries",
    example: "Set up a database for a blog with comments",
  },
  {
    id: "authentication",
    label: "Authentication",
    icon: "🔐",
    description: "Login, signup, roles, protected routes",
    example: "Add a login page with email and Google sign-in",
  },
  {
    id: "api-backend",
    label: "API & Backend",
    icon: "⚡",
    description: "Endpoints, validation, error handling",
    example: "Create an API endpoint to process payments",
  },
  {
    id: "error-debugging",
    label: "Error Handling",
    icon: "🐛",
    description: "Debugging, error states, logging, recovery",
    example: "Fix this error: TypeError: Cannot read properties of undefined",
  },
  {
    id: "deployment-devops",
    label: "Deployment",
    icon: "🚀",
    description: "CI/CD, hosting, environment config",
    example: "Deploy my Next.js app to Vercel with a custom domain",
  },
  {
    id: "performance-optimization",
    label: "Performance",
    icon: "⚡",
    description: "Speed, bundle size, caching, Core Web Vitals",
    example: "My app loads slowly — optimize the initial load time",
  },
  {
    id: "feature-addition",
    label: "Feature Addition",
    icon: "✨",
    description: "Adding to existing code, backward compatibility",
    example: "Add dark mode toggle to my existing React app",
  },
] as const;

export const EDITORS = [
  { id: "cursor", label: "Cursor", icon: "⌨️" },
  { id: "claude-code", label: "Claude Code", icon: "🤖" },
  { id: "windsurf", label: "Windsurf", icon: "🏄" },
  { id: "gemini-cli", label: "Gemini CLI", icon: "♊" },
  { id: "bolt", label: "Bolt.new", icon: "⚡" },
  { id: "lovable", label: "Lovable", icon: "💜" },
  { id: "opencode", label: "OpenCode", icon: "📟" },
  { id: "codex", label: "Codex", icon: "🧠" },
  { id: "antigravity", label: "Antigravity", icon: "🪐" },
] as const;

export type TemplateId = (typeof TEMPLATES)[number]["id"];
export type EditorId = (typeof EDITORS)[number]["id"];
