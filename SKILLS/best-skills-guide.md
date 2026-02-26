# Best Skills by Field — Vibe Prompt Reference Guide

A curated pick of the highest-impact skill from each of the 9 catalog categories,
plus a ready-to-paste prompt you can use to activate it in Claude Code or Cursor.

---

## 1. 🏛️ Architecture

**Best Skill:** `production-code-audit`

> Autonomously deep-scans an entire codebase line-by-line, understands architecture and patterns, then systematically transforms it to production-grade quality.

**Why it's the best:** It's the most comprehensive single skill in the category — combining architecture review, refactoring, and quality enforcement in one pass. Perfect for when your Lovable-generated code needs hardening before launch.

**Your Prompt:**

```
Use the production-code-audit skill to scan my entire Vibe Prompt codebase.
Identify any architecture issues, anti-patterns, or areas that aren't
production-grade. Prioritize issues by severity and give me a ranked
fix list, starting with anything that could cause failures at launch.
```

---

## 2. 💼 Business

**Best Skill:** `startup-business-analyst-business-case`

> Generates a comprehensive investor-ready business case document with market analysis, solution description, financials, and strategy.

**Why it's the best:** Covers the full picture — TAM/SAM/SOM, competitive landscape, financial projections, and go-to-market — in one document. Everything you'd need for a Product Hunt launch post, an investor deck, or a co-founder pitch.

**Your Prompt:**

```
Use the startup-business-analyst-business-case skill to generate a
comprehensive business case for Vibe Prompt. App: AI-powered prompt
enhancement tool for vibe coders. Stack: React, Gemini API, Supabase,
Vercel. Target: non-technical founders using AI code editors (Cursor,
Claude Code, Windsurf). Revenue: freemium with $9/mo Pro plan.
Timeline: launched in 14 days, targeting 500 active users in 30 days.
Format it as investor-ready with market sizing, competitive analysis,
and 12-month financial projections.
```

---

## 3. 🤖 Data & AI

**Best Skill:** `prompt-engineering`

> Expert guide on prompt engineering patterns, best practices, and optimization techniques. Use when improving prompts, learning prompting strategies, or debugging agent behavior.

**Why it's the best:** Since Vibe Prompt's core value IS the system prompt, this skill directly helps you iterate the most important piece of your product. It's also the most universally applicable skill in a 159-skill category.

**Your Prompt:**

```
Use the prompt-engineering skill to review and improve my Vibe Prompt
system prompt. Here is the current buildSystemPrompt function:

[You are an expert prompt engineer specializing in AI-assisted software development.
Your job is to transform a user's plain-language description into a detailed,
structured prompt optimized for ${aiEditor}.

The user's selected template category is: ${templateCategory}

TRANSFORMATION RULES:
1. Output ONLY the enhanced prompt. No explanation, no preamble,
   no "Here is your enhanced prompt:" — just the prompt itself.
2. Start with a clear role/context statement
   (e.g., "You are a senior React developer working on...")
3. Use SPEC format:
   Situation (what exists) → Purpose (what to achieve) →
   Explicit Constraints (non-negotiables) → Checklist (definition of done)
4. Include specific error states and edge cases to handle
5. Specify output format (single file? multiple files? which files to modify?)
6. Add a quality check: "Before finishing, verify: [checklist]"
7. Keep the prompt under 800 words — detailed but not overwhelming

FORMATTING RULES BY EDITOR:
- Claude Code: Use markdown headers (##), explicit file paths,
  numbered steps. Reference files like "In /src/components/LoginForm.tsx..."
- Cursor: Use @-mention style for files. "In @LoginForm.tsx..."
  Use bullet points. Enable Plan Mode context.
- Windsurf: Outcome-focused. Don't list specific files —
  describe the end state and let Cascade find context.
- Gemini CLI: Leverage large context. Include more detail.
  State explicitly which files should and shouldn't be modified.
- Bolt.new / Lovable: Very explicit about UI — describe colors,
  spacing, layout, interactions. These need visual guidance.
- Antigravity: Clear, concise instructions with explicit file paths when relevant.
  Use bullet points and numbered steps. Focus on intent and expected outcome;
  Antigravity will infer implementation details from context.]

I want the output to be more structured, more specific to each AI
editor's style, and produce results that feel genuinely expert-level —
not just slightly expanded versions of the user's input. Identify the
weakest parts and give me an improved version with an explanation of
each change.
```

---

## 4. 💻 Development

**Best Skill:** `senior-fullstack`

> Comprehensive fullstack development skill for building complete web applications with React, Next.js, Node.js, and PostgreSQL. Includes project scaffolding and architecture guidance.

**Why it's the best:** Matches the Vibe Prompt stack almost exactly (React + APIs + database) and covers the full journey from scaffolding to deployment patterns. The Swiss Army knife of the development category.

**Your Prompt:**

```
Use the senior-fullstack skill to review my Vibe Prompt app architecture.
The app is React + Tailwind built on Cursor/Antigravity, deployed to Vercel,
using Supabase for the database, and calling the Gemini/Groq APIs for
prompt transformation. Review the component structure, API call patterns,
state management approach, and Supabase integration. Flag anything that
won't scale past 500 DAU and suggest the most important improvements
to make before public launch.
```

---

## 5. 🌐 General

**Best Skill:** `web-performance-optimization`

> Optimize website and web application performance including loading speed, Core Web Vitals, bundle size, caching strategies, and runtime performance.

**Why it's the best:** Directly maps to Vibe Prompt's Definition of Done: page load under 2 seconds on 4G, and Core Web Vitals are an explicit success criterion. This skill closes the gap between "it works" and "it's fast."

**Your Prompt:**

```
Use the web-performance-optimization skill to audit Vibe Prompt's performance.
Key requirements from our PRD:
- Page load under 2 seconds on a 4G connection
- Transformation response under 5 seconds
- No blocking elements above the fold

The app is React + Tailwind, deployed on Vercel, with a Gemini API call
as the main user-triggered operation. Give me a prioritized list of
optimizations, starting with the ones that will have the biggest impact
on perceived load speed and Core Web Vitals scores.
```

---

## 6. ⚙️ Infrastructure

**Best Skill:** `application-performance-performance-optimization`

> Optimize end-to-end application performance with profiling, observability, and backend/frontend tuning across the full stack.

**Why it's the best:** Vibe Prompt's key infrastructure challenge is the API call chain (Gemini → Groq fallback) and rate limit handling. This skill addresses full-stack performance rather than just one layer, which is what a lean, serverless-deployed app needs.

**Your Prompt:**

```
Use the application-performance-performance-optimization skill to help me
design the infrastructure for Vibe Prompt's API layer. The app calls
Gemini 2.5 Flash (250 req/day free tier) with automatic fallback to
Groq/Llama 3.3 70B on 429 or 503 errors. Goals:
- Transformation completes in under 5 seconds 95% of the time
- Gemini → Groq fallback is invisible to users (no error flash)
- Rate limit errors are logged to Supabase api_events table
- System handles 250+ DAU without manual intervention
Review this design and suggest improvements, especially around fallback
timing, error UX, and monitoring strategy.
```

---

## 7. 🔒 Security

**Best Skill:** `backend-security-coder`

> Expert in secure backend coding practices specializing in input validation, authentication, and API security. Use proactively for backend security implementations.

**Why it's the best:** Vibe Prompt has two critical security concerns — API key exposure and user data privacy. This skill addresses both proactively, which matters for a solo founder without a dedicated security reviewer.

**Your Prompt:**

```
Use the backend-security-coder skill to audit Vibe Prompt's security posture.
Specifically check:
1. API key handling — Gemini and Groq keys should never appear in browser
   DevTools Network tab. Verify the current implementation is safe.
2. Supabase Row Level Security — anonymous users should only INSERT into
   the transformations table, never SELECT.
3. Input validation — the 1,000-character prompt input should be sanitized
   before being sent to Gemini.
4. Privacy — confirm no actual prompt text is stored server-side for
   anonymous users (only character counts).
Flag any issues and provide exact code fixes for each one.
```

---

## 8. 🧪 Testing

**Best Skill:** `systematic-debugging`

> Use when encountering any bug, test failure, or unexpected behavior — before proposing any fixes.

**Why it's the best:** Since Vibe Prompt is vibe-coded with no automated test suite, systematic debugging is the primary quality tool. This skill enforces root-cause analysis before jumping to fixes — preventing the "fix one thing, break two others" pattern common in AI-assisted builds.

**Your Prompt:**

```
Use the systematic-debugging skill to help me diagnose this issue
in Vibe Prompt:

[paste your exact error from the browser console]

This happens when: [describe what you clicked or did]
Expected behavior: [what should have happened]
Stack: React + Tailwind, Lovable-generated code, Gemini API calls,
Supabase client.

Walk me through root cause analysis before suggesting any fix.
I want to understand what went wrong, not just patch it.
```

---

## 9. 🔄 Workflow

**Best Skill:** `cicd-automation-workflow-automate`

> Expert in creating efficient CI/CD pipelines, GitHub Actions workflows, and automated development processes.

**Why it's the best:** Once your Lovable code is exported to GitHub and deploying to Vercel, a basic CI workflow catches broken builds before they go live. For a solo founder, automation replaces the human reviewer you don't have.

**Your Prompt:**

```
Use the cicd-automation-workflow-automate skill to set up a basic GitHub
Actions CI workflow for Vibe Prompt. The repo is React + Tailwind,
exported from Lovable to GitHub, deploying automatically to Vercel
on every push to main.

I need the workflow to:
1. Run on every push to main and every pull request
2. Verify the build compiles without errors
3. Run ESLint if configured
4. Block the Vercel deployment if the build fails

Keep it simple — solo founder project, not enterprise. Just enough
to catch broken builds before they go live.
```

---

## Quick Reference Table

| # | Field          | Best Skill                                           | When to Use                                        |
| - | -------------- | ---------------------------------------------------- | -------------------------------------------------- |
| 1 | Architecture   | `production-code-audit`                            | Before launch — harden Lovable-generated code     |
| 2 | Business       | `startup-business-analyst-business-case`           | Product Hunt prep, investor outreach               |
| 3 | Data & AI      | `prompt-engineering`                               | Iterating the system prompt (your core product)    |
| 4 | Development    | `senior-fullstack`                                 | Architecture review, pre-launch code quality       |
| 5 | General        | `web-performance-optimization`                     | Hit the 2-second load / 5-second transform targets |
| 6 | Infrastructure | `application-performance-performance-optimization` | API chain design, Gemini → Groq fallback tuning   |
| 7 | Security       | `backend-security-coder`                           | API key safety, Supabase RLS, input validation     |
| 8 | Testing        | `systematic-debugging`                             | Any time something breaks before or after launch   |
| 9 | Workflow       | `cicd-automation-workflow-automate`                | GitHub Actions after Lovable export to GitHub      |

---

## How to Activate a Skill

**In Claude Code:**

```bash
claude
# Then say: "Use the [skill-name] skill to [your task]"
```

**In Cursor:**
Open the chat panel and say:

> "Load the [skill-name] skill and [your task]"

**The prompts above are ready to copy-paste.** Fill in the bracketed placeholders with your actual content and send.
