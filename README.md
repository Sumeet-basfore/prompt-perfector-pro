# Vibe Prompt

**Plain English in. Perfect AI prompts out.**  
Free. Instant. No sign-up required.

Transform plain-English descriptions into structured, expert-level prompts for Cursor, Claude Code, Windsurf, and more.

## Quick start

1. **Env**
   - Copy `.env.example` to `.env.local`
   - Add `GEMINI_API_KEY` (aistudio.google.com), `GROQ_API_KEY` (console.groq.com), `NEXT_PUBLIC_SUPABASE_URL`, and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase project → Settings → API)

2. **Supabase**
   - In Supabase Dashboard → SQL Editor, run the contents of `supabase/schema.sql` to create `transformations` and `api_events` (and RLS policies).

3. **Run**
   ```bash
   npm install
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

4. **Deploy**
   - Push to GitHub, connect the repo in Vercel, add the same env vars in Vercel → Settings → Environment Variables, then deploy.

## Stack

- **Frontend:** Next.js 14 (App Router), React, Tailwind CSS
- **API:** `/api/enhance` — Gemini 2.0 Flash first, Groq Llama 3.3 70B on 429/503
- **DB:** Supabase (transformations + api_events; no PII stored)
- **Hosting:** Vercel-ready

## Project docs

- `AGENTS.md` — Master plan and current phase
- `agents_doc/` — Tech stack, PRD, code patterns, testing
- `docs/` — PRD and tech design
