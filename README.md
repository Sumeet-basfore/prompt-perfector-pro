<div align="center">
  <img src="public/logo.png" alt="Vibe Prompt Logo" width="120" />
  <h1>✨ Vibe Prompt ✨</h1>
  <p><strong>Plain English in. Perfect AI prompts out.</strong></p>
  <p>Free. Instant. No sign-up required. Built for vibe coders.</p>
</div>

---

## 🚀 Overview

Transform plain-English descriptions into structured, expert-level prompts for Cursor, Claude Code, Windsurf, Lovable, and more. Stop wasting hours on back-and-forth prompt engineering and get structured prompts your AI assistant actually understands in seconds.

## ✨ Features

- **Instant Enhancement**: Describe what you want, get a perfect prompt back.
- **Multiple Targets**: Optimized output for UI/Frontend, Backend, APIs, or specific editors.
- **AI Models**: Powered by Gemini 2.0 Flash and Groq Llama 3.3.
- **Project History**: Automatically saves your prompts to a sidebar so you can resume your tasks anytime.
- **Gorgeous UI**: Built with React, Tailwind CSS, Shadcn UI, Framer Motion, and Magic UI.

## 🛠️ Tech Stack

- **Frontend**: Vite, React 18, React Router, Tailwind CSS, Shadcn UI
- **API (Edge Functions)**: Supabase Edge Functions (`/supabase/functions/enhance-prompt`)
- **Database**: Supabase (transformations + API events tracking)
- **Deployment**: Vercel-ready

## 🚦 Quick Start

### 1. Environment Variables
Copy the `.env.example` file to `.env` or `.env.local` and fill in your API keys.

```bash
cp .env.example .env.local
```
Add:
- `GEMINI_API_KEY` (from aistudio.google.com)
- `GROQ_API_KEY` (from console.groq.com)
- `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (from Supabase Project settings)

### 2. Supabase Setup
In your Supabase Dashboard → SQL Editor, run the contents of `supabase/schema.sql` (if available) to create the `transformations` and `api_events` tables and RLS policies.

### 3. Run Locally
Install dependencies and start the Vite dev server:
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) (or whichever port Vite gives you).

### 4. Deploy
You can easily deploy the frontend to Vercel or any static host. Remember to configure the Environment Variables in your hosting provider as well!

## 📚 Project Documentation

- `AGENTS.md` — Master plan and current phase
- `agents_doc/` — Tech stack, PRD, code patterns, testing
- `docs/` — PRD and tech design
- `projects_implementation_guide.md` — Guide on project history sidebar

---
<div align="center">
  Made with 💜 for developers who want to vibe code.
</div>
