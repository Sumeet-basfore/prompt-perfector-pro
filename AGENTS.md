# AGENTS.md — Master Plan for Vibe Prompt

## Project Overview

**App:** Vibe Prompt
**Goal:** Transform plain-English descriptions into structured, expert-level prompts optimized for AI coding editors
**Tagline:** Plain English in. Perfect AI prompts out.
**Stack:** React + Tailwind CSS → Vercel (hosting) + Supabase (DB/auth) + Gemini 2.5 Flash API (primary) + Groq/Llama 3.3 70B (fallback)
**Build Tool:** Lovable.dev (primary), Bolt.new (backup if token limit hit)
**Current Phase:** Phase 1 — Foundation

---

## How I Should Think

1. **Understand Intent First**: Before answering, identify what the user actually needs
2. **Ask If Unsure**: If critical information is missing, ask before proceeding
3. **Plan Before Coding**: Propose a plan, ask for approval, then implement
4. **Verify After Changes**: Run tests/manual checks after each change
5. **Explain Trade-offs**: When recommending something, mention alternatives
6. **Vibe-Coder Friendly**: This is a solo founder build — explain what things mean, don't just do them

---

## Plan → Execute → Verify

1. **Plan:** Outline a brief approach and ask for approval before coding
2. **Execute:** Implement one small feature at a time — never two things at once
3. **Verify:** Manually test in browser (desktop + mobile) after each feature; fix issues before moving on

---

## Context Files

Load these when relevant (don't load all at once):

- `agent_docs/tech_stack.md` — Stack details, API endpoints, environment variables
- `agent_docs/product_requirements.md` — Full PRD, user stories, success criteria
- `agent_docs/code_patterns.md` — System prompt logic, component patterns, copy button behavior
- `agent_docs/project_brief.md` — Persistent rules, naming conventions, commands
- `agent_docs/testing.md` — Mobile checklist, launch checklist, how to verify each feature

---

## Current State (Update This After Each Session!)

**Last Updated:** February 2026
**Working On:** Ready for you to add API keys and run Supabase schema
**Recently Completed:** Phase 1 MVP implemented in this repo: Next.js + Tailwind app shell, `/api/enhance` (Gemini → Groq fallback), `buildSystemPrompt` + all 8 categories and 6 editors, Supabase logging (transformations + api_events), copy button + 👍/👎 feedback, localStorage for editor selection
**Blocked By:** Need API keys (GEMINI_API_KEY, GROQ_API_KEY) and Supabase URL/anon key; run `supabase/schema.sql` in Supabase SQL Editor

---

## Roadmap

### Phase 1: Foundation (Days 1–3)

- [ ] Create accounts: Google AI Studio, Groq, Supabase, Vercel, Lovable, Bolt.new, Umami
- [ ] Get all API keys: GEMINI_API_KEY, GROQ_API_KEY, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
- [x] App shell and API implemented in this repo (no Lovable required for core flow)
- [ ] Run `supabase/schema.sql` in Supabase SQL Editor to create `transformations` and `api_events`
- [ ] Copy `.env.example` to `.env.local`, fill in keys, then `npm install && npm run dev`
- [ ] Deploy to Vercel (connect repo → add env vars → deploy)

### Phase 2: Core Engine (Days 2–4)

- [ ] Add Gemini API call with loading state and result display
- [ ] Write the `buildSystemPrompt` function (the secret sauce)
- [ ] Add all 8 template categories with `getCategoryContext` function
- [ ] Add all 6 AI editor formatting rules
- [ ] Add Groq fallback (triggers on Gemini 429/503 errors)

### Phase 3: Polish + Mobile (Days 4–7)

- [ ] Add Supabase event tracking (transformations + api_events tables)
- [ ] Add Umami analytics script + custom events
- [ ] Full mobile testing pass (iPhone Safari + Chrome Android)
- [ ] Add 3 rotating before/after examples on homepage
- [ ] Add localStorage persistence for AI editor selection
- [ ] Add 👍/👎 feedback row below results

### Phase 4: Launch Prep (Days 8–14)

- [ ] Quality pass: test all 8 templates × 6 editors = 48 combinations
- [ ] Test with 5 real vibe coders who haven't seen the product
- [ ] Fix whatever confuses them
- [ ] Soft launch Day 14: share privately with 10 vibe coders
- [ ] Public launch Day 16–17: r/vibecoding, r/cursor, r/ClaudeAI

### Phase 5: Nice-to-Have (Week 2 if time allows)

- [ ] Saved Prompt History (requires optional Supabase auth)
- [ ] Share Link generation (viral growth driver)

---

## What NOT To Do

- Do NOT add features not in the current phase
- Do NOT put API keys directly in frontend code — always use environment variables
- Do NOT export from Lovable without first connecting to GitHub (Day 3)
- Do NOT skip mobile testing — it's a P0 success criterion
- Do NOT store user prompt content server-side for anonymous users (privacy requirement)
- Do NOT build the Community Prompt Library, VS Code extension, or multi-step chains — these are Month 2+
- Do NOT add a sign-up gate to the core transformation feature — zero friction is the entire value prop

---

## Key Success Metrics to Keep in Mind

- Transformation completes in under 5 seconds
- Copy button clicked on 70%+ of transformations
- Page loads in under 2 seconds on 4G
- Works on iPhone Safari and Chrome Android with no horizontal scroll
- Gemini → Groq fallback triggers automatically on rate limit errors
