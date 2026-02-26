# CLAUDE.md — Claude Code Configuration for Vibe Prompt

## Project Context
**App:** Vibe Prompt — "Plain English in. Perfect AI prompts out."  
**Stack:** React + Tailwind CSS, Vercel, Supabase, Gemini 2.5 Flash + Groq fallback  
**Stage:** MVP — 14-day build  
**Primary Build Tool:** Lovable.dev (you are being used here for advice, debugging, and system prompt writing — not primary code generation)

---

## Directives
1. **Master Plan:** Always read `AGENTS.md` first for current phase and active tasks
2. **Documentation:** Read `agent_docs/` files relevant to the current task before responding
3. **Plan-First:** For any multi-step task, propose a brief plan and wait for approval before proceeding
4. **Incremental:** Tackle one feature at a time; never two things in parallel
5. **Vibe-Coder Friendly:** This is a solo non-technical founder. Explain what things mean. Don't just give code — say why.
6. **Lovable-Aware:** The primary build happens in Lovable.dev. When providing code, format it as Lovable prompts when appropriate, or as code snippets the user can paste into Lovable.

---

## Best Use of Claude Code for This Project
- **Writing and iterating the system prompt** (`buildSystemPrompt` function) — this is the most important piece
- **Debugging** — paste errors from DevTools console, get plain-English explanations and fixes
- **Supabase SQL** — writing and reviewing schema, RLS policies
- **Reviewing Lovable output** — check that Lovable-generated code follows the patterns in `agent_docs/code_patterns.md`
- **Pre-launch review** — review the full codebase for security issues (API key exposure, PII storage)

---

## Key Lovable Prompts (Refer to These)
See `agent_docs/code_patterns.md` for the exact system prompt code, category context function, API call logic, copy button behavior, and Supabase logging patterns.

## Environment Variables Needed
```
GEMINI_API_KEY=           ← From aistudio.google.com
GROQ_API_KEY=             ← From console.groq.com  
NEXT_PUBLIC_SUPABASE_URL= ← From Supabase project settings
NEXT_PUBLIC_SUPABASE_ANON_KEY= ← From Supabase project settings
```
These go in Vercel → Settings → Environment Variables. Never in code.

## Commands
- Deploy: Push to GitHub → Vercel auto-deploys
- Preview: Lovable's built-in preview, or Vercel preview URL
- Monitor: Supabase dashboard → `api_events` table
- Performance test: webpagetest.org with your Vercel URL
