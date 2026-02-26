# Technical Design Document: Vibe Prompt MVP

**App:** Vibe Prompt — "Plain English in. Perfect AI prompts out."
**Approach:** Vibe-coded (AI builds it, you guide and test)
**Estimated Time to MVP:** 14 days
**Estimated Monthly Cost:** $0 (free tier stack)
**Last Updated:** February 2026

---

## How We'll Build It

### Recommended Approach: Lovable.dev → Vercel → Supabase

Based on your 2-week timeline, solo founder status, and zero-budget constraint, **Lovable.dev** is the right primary build tool. Here's why it beats the alternatives for this specific app:

**Why Lovable for Vibe Prompt:**
- Generates clean React + Tailwind code you can see and export (no lock-in like Bubble)
- Handles the exact component pattern you need: text area → API call → formatted output
- Has a Supabase integration built-in — one click to connect your database
- Produces a deployable app directly to Vercel
- Free tier is generous enough to build the full MVP before paying anything

**Key limitation to know:** Lovable's free tier has a monthly "token" limit for AI-generated code. If you hit it, switch to Bolt.new (same approach, separate limit). Keep both accounts ready.

### Alternatives Compared

| Option | Pros | Cons | Cost | Days to MVP |
|--------|------|------|------|-------------|
| **Lovable.dev** ✅ | Cleanest code output, Supabase native, React = easy to extend | Free tier token limit | Free → $20/mo | 5–7 |
| **Bolt.new** | Fastest initial generation, great for one-page apps | Less polished, harder to extend | Free → $20/mo | 3–5 |
| **Webflow + Make** | Most beautiful no-code result | Make automation is fragile; hard to customize AI logic | Free → $32/mo | 7–10 |
| **Bubble** | All-in-one | Exports nothing, performance issues, locked in forever | Free → $32/mo | 10–14 |
| **v0.dev + manual coding** | Maximum control | Requires real coding knowledge | Free | 14–21 |

**Verdict:** Start with Lovable. If you hit the token limit mid-build, continue in Bolt.new using the same exported codebase.

---

## Project Setup Checklist

### Step 1: Create Accounts (Day 1 — takes ~45 minutes)
- [ ] **Google AI Studio** → aistudio.google.com → Get Gemini API key (free, no credit card)
- [ ] **Groq Console** → console.groq.com → Get Groq API key (free, no credit card) — this is your fallback
- [ ] **Supabase** → supabase.com → Create project "vibe-prompt" (free tier)
- [ ] **Vercel** → vercel.com → Sign up with GitHub (free tier)
- [ ] **Lovable.dev** → lovable.dev → Sign up (free tier)
- [ ] **Bolt.new** → bolt.new → Sign up as backup (free tier)
- [ ] **Plausible Analytics** (self-hosted) OR **Umami** → umami.is → Sign up (free)

### Step 2: Gather Your Keys (Day 1 — 15 minutes)
Have these ready before you write a single prompt in Lovable:
```
GEMINI_API_KEY=        ← From aistudio.google.com
GROQ_API_KEY=          ← From console.groq.com
NEXT_PUBLIC_SUPABASE_URL=     ← From Supabase project settings
NEXT_PUBLIC_SUPABASE_ANON_KEY= ← From Supabase project settings
```

Store these in a private notes app. You'll paste them into Vercel's environment variables on deploy day.

### Step 3: Initialize the Project (Day 1 — 30 minutes)

Open Lovable.dev and paste this exact prompt to generate your starting point:

```
Build a single-page React web app called "Vibe Prompt" with this layout:

HEADER: Logo text "Vibe Prompt" on the left, a "Templates" button on the right.

HERO (above the fold): 
- Headline: "Plain English in. Perfect AI prompts out."
- Subheadline: "Free. Instant. No sign-up required."

MAIN TOOL (the entire page is the product):
1. A large textarea (placeholder: "Describe what you want to build...") 
   - Max 1000 characters with a live character counter
2. Two side-by-side dropdowns:
   - Left: "Template Category" with 8 options: UI & Frontend, Database Design, 
     Authentication, API & Backend Logic, Error Handling & Debugging, 
     Deployment & DevOps, Performance Optimization, Feature Addition to Existing Code
   - Right: "AI Editor" with 6 options: Claude Code, Cursor, Windsurf, Gemini CLI, 
     Bolt.new, Lovable
3. A prominent CTA button: "✨ Enhance My Prompt" — full width, warm purple color
4. A loading skeleton that appears while the API call processes
5. A BEFORE/AFTER result section (hidden until first use):
   - Side by side on desktop, stacked on mobile
   - Left panel: "Your Input" — shows original text in a styled box
   - Right panel: "Enhanced Prompt" — shows AI output with a "📋 Copy Prompt" button
     that changes to "✓ Copied!" for 2 seconds after click
6. Below the result: a "👍 Useful?" / "👎 Not quite" feedback row

DESIGN: Warm, friendly, non-enterprise. White background. Rounded corners (12px). 
Primary color: warm purple #7C3AED. Accent: soft amber #F59E0B. 
Body font: Inter. Large, breathing whitespace. Mobile-first responsive layout.
No horizontal scrolling on 375px screens.

The app should be built with React + Tailwind CSS. 
Connect to Supabase for future auth. Use environment variables for API keys.
```

---

## Building Your Features

### Feature 1: Prompt Transformation Engine (P0 — Critical)

**Complexity:** Medium
**Build Day:** 2

This is the entire product. The AI call is a straightforward `fetch()` to Gemini's API endpoint.

#### The API Call Logic

When the user clicks "Enhance My Prompt," your app needs to:
1. Take their input text
2. Take their selected template category
3. Take their selected AI editor
4. Send all three to Gemini
5. Display the result

**Prompt to give Lovable to build this:**
```
Add the API call logic for the Enhance My Prompt button.

When clicked, it should call the Google Gemini API 
(https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent)
with the user's API key from environment variable GEMINI_API_KEY.

The request body should look like this:
{
  "contents": [
    {
      "parts": [
        {"text": "[SYSTEM_PROMPT]" + "\n\nUser Input: " + userInput}
      ]
    }
  ]
}

Handle these states:
- Loading: show skeleton loader, disable button, change text to "Enhancing..."
- Success: reveal the before/after section with the output text
- Error (rate limit): automatically retry with Groq API instead
  (Groq endpoint: https://api.groq.com/openai/v1/chat/completions, 
   model: llama-3.3-70b-versatile)
- Error (other): show friendly message "Something went wrong — try again in a moment"

The transformation should complete within 5 seconds. 
Use streaming if available to make it feel faster.
```

#### The System Prompt — Your Secret Sauce

This is the most important file you'll write. Create it as a constant in your code:

```javascript
// The system prompt template — customize per editor and category
const buildSystemPrompt = (templateCategory, aiEditor) => `
You are an expert prompt engineer specializing in AI-assisted software development. 
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

TEMPLATE CATEGORY INSTRUCTIONS for ${templateCategory}:
${getCategoryContext(templateCategory)}
`;
```

**For the `getCategoryContext` function**, add this to Lovable as a follow-up prompt:

```
Add a getCategoryContext function that returns extra context 
based on the template category:

"UI & Frontend" → Remind about: responsive layout, accessibility (ARIA), 
  loading states, error states, mobile-first, design system matching.

"Database Design" → Remind about: foreign key constraints, indexes on 
  queried columns, ON DELETE behavior, explain relationships.

"Authentication" → Remind about: OAuth flow, session management, 
  CSRF protection, error handling for failed auth, user profile creation.

"API & Backend Logic" → Remind about: input validation, rate limiting, 
  error response format, logging, confirmation emails.

"Error Handling & Debugging" → Remind about: the exact error message, 
  likely causes in order of probability, defensive fix to prevent recurrence.

"Deployment & DevOps" → Remind about: environment variables, 
  rollback plan, health check endpoint.

"Performance Optimization" → Remind about: Core Web Vitals targets, 
  caching strategy, what NOT to break.

"Feature Addition to Existing Code" → Remind about: analyzing existing 
  patterns before adding, not breaking current behavior, 
  localStorage persistence if needed.
```

---

### Feature 2: Template Category Selector (P0)

**Complexity:** Low (UI only — the logic is in the system prompt above)
**Build Day:** 2–3

Each category dropdown selection should:
1. Update the system prompt via `getCategoryContext`
2. Show a short helper text below the dropdown explaining what it's for

**Helper text for each category** (paste into Lovable):
```
"UI & Frontend" → "Builds forms, layouts, and components with 
  accessibility and responsive design baked in"
"Database Design" → "Creates schemas with proper relationships, 
  constraints, and indexes"
"Authentication" → "Handles login, OAuth, sessions, and security edge cases"
"API & Backend Logic" → "Structures endpoints with validation, 
  rate limiting, and error handling"
"Error Handling & Debugging" → "Turns your error message into a 
  structured debugging plan"
"Deployment & DevOps" → "Configures CI/CD, environment variables, 
  and deployment pipelines"
"Performance Optimization" → "Targets load time, Core Web Vitals, 
  and database query speed"
"Feature Addition to Existing Code" → "Adds new features without 
  breaking what's already built"
```

---

### Feature 3: AI Editor Selector (P0)

**Complexity:** Low (just changes formatting rules in system prompt)
**Build Day:** 3

The editor selection changes the `aiEditor` parameter passed to `buildSystemPrompt`. No additional API logic needed.

**Session persistence** — add to Lovable:
```
Remember the user's selected AI editor using localStorage so it 
persists across page refreshes. Key: "vibePrompt_lastEditor"
```

---

### Feature 4: Before/After Display + Copy Button (P0)

**Complexity:** Low
**Build Day:** 2 (built alongside the API call)

**Copy button logic** — if Lovable doesn't get it right, give it this:
```
The copy button should:
1. Call navigator.clipboard.writeText(outputText)
2. Change button text to "✓ Copied!" and turn green
3. After 2 seconds, revert back to "📋 Copy Prompt"

On mobile Safari (which blocks clipboard API without user gesture), 
fall back to selecting the text and showing "Text selected — 
long press to copy"
```

---

### Feature 5: Gemini → Groq Fallback (P0)

**Complexity:** Medium — but critical for launch
**Build Day:** 4

When Gemini returns a 429 (rate limit) error, automatically retry with Groq:

**Prompt for Lovable:**
```
Add automatic fallback logic for the API calls:

1. Try Gemini first (model: gemini-2.0-flash)
2. If response status is 429 or 503, immediately try Groq instead
   - Groq endpoint: https://api.groq.com/openai/v1/chat/completions
   - Model: llama-3.3-70b-versatile
   - Use the same system prompt
   - Use GROQ_API_KEY environment variable
3. If BOTH fail, show: "Our AI is taking a quick break — 
   try again in 60 seconds 🌿"
4. Add a small "Powered by Gemini" / "Powered by Groq" 
   badge in the result area so users see which model ran
5. Log each fallback to Supabase for monitoring 
   (table: api_events, columns: timestamp, model_used, success)
```

---

### Feature 6: Mobile-Responsive Design (P0)

**Complexity:** Low (Tailwind handles most of it)
**Build Day:** 3–4 (testing pass)

After initial build, run this test checklist on your phone:

**Mobile Test Checklist:**
- [ ] Load on iPhone Safari — does it fit without horizontal scroll?
- [ ] Tap the textarea — does keyboard appear and not cover the input?
- [ ] Select both dropdowns with thumbs (44px minimum tap target)
- [ ] Tap "Enhance My Prompt" — does the button respond immediately?
- [ ] Does the result stack vertically (not side by side) on 375px?
- [ ] Does the copy button work on mobile Chrome and Safari?

**Fix common mobile issues with this Lovable prompt:**
```
Fix these mobile layout issues:
1. Ensure the two dropdowns (Template, AI Editor) stack vertically 
   on screens under 640px wide, not side by side
2. Ensure the before/after panels stack vertically on mobile 
   with "Your Input" on top
3. Add viewport meta tag if not present: 
   <meta name="viewport" content="width=device-width, initial-scale=1">
4. Ensure all interactive elements have minimum 44px touch targets
5. Test and fix any layout issues at 375px width (iPhone SE size)
```

---

## Design Implementation

### Matching the PRD Vision: "Warm, fast, approachable"

**Color System:**
```css
/* Paste these into your Tailwind config or CSS variables */
--primary: #7C3AED;        /* Warm purple — main CTA */
--primary-hover: #6D28D9;  /* Slightly darker on hover */
--accent: #F59E0B;         /* Warm amber — highlights */
--success: #10B981;        /* Green — copy success state */
--background: #FAFAFA;     /* Off-white — warmer than pure white */
--surface: #FFFFFF;        /* Card backgrounds */
--text-primary: #111827;   /* Near-black */
--text-secondary: #6B7280; /* Gray for helper text */
--border: #E5E7EB;         /* Subtle borders */
```

**Typography:**
- Font: Inter (already on Google Fonts, load with `@import`)
- Headline: 32px / weight 700
- Body: 16px / weight 400
- Helper text: 14px / weight 400 / color: `--text-secondary`

**Spacing:** Use Tailwind's 4-unit base (p-4, gap-4) consistently. Breathing room is part of the "friendly" feel.

**Animations to add:**
- Button hover: `transition-all duration-200`
- Result reveal: fade in from bottom (`opacity-0 translate-y-4 → opacity-100 translate-y-0`)
- Copy success: color transition on button

---

## Database & Analytics Setup

### Supabase Schema (Minimal for MVP)

You don't need much at launch — just enough to track key events and prepare for optional accounts in Week 2.

**In your Supabase dashboard → SQL Editor, run:**
```sql
-- Track transformations for analytics (no PII stored for anon users)
CREATE TABLE transformations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  template_category TEXT,
  ai_editor TEXT,
  model_used TEXT,         -- 'gemini' or 'groq'
  input_length INTEGER,    -- Character count only, not the actual input
  output_length INTEGER,
  was_copied BOOLEAN DEFAULT FALSE,
  feedback TEXT            -- 'useful' | 'not_useful' | NULL
);

-- API event log for monitoring fallbacks
CREATE TABLE api_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT NOW(),
  model_attempted TEXT,
  success BOOLEAN,
  error_code INTEGER
);

-- Optional: saved prompts (for Week 2 if you add accounts)
-- Only create this table when you're ready to build that feature
```

**Row Level Security for `transformations`:**
```sql
ALTER TABLE transformations ENABLE ROW LEVEL SECURITY;
-- Allow anonymous inserts (no auth required)
CREATE POLICY "Allow anon inserts" ON transformations 
  FOR INSERT WITH CHECK (true);
-- No reads from the client (only you can read via Supabase dashboard)
```

### Analytics (Plausible Self-Hosted or Umami)

For the fastest setup, use **Umami** (free cloud tier, privacy-first):
1. Sign up at umami.is
2. Get your tracking script
3. Add to Lovable: "Add this analytics script to the `<head>` of the app: [paste script]"
4. Set up these custom events in Umami:
   - `prompt_enhanced` (fires on successful transformation)
   - `copy_clicked` (fires on copy button click)
   - `feedback_positive` / `feedback_negative`

---

## AI Assistance Strategy

### Which Tool for Which Task

| Task | Best Tool | Example Prompt |
|------|-----------|----------------|
| Building components | Lovable | "Add a [component] with [behavior]" |
| Fixing layout bugs | Lovable | "The [element] overflows on mobile — fix it" |
| Writing system prompts | Claude (claude.ai) | "Help me write the system prompt for the [category] template" |
| Debugging API errors | ChatGPT | "[Error code] from Gemini API — what does this mean?" |
| Testing the output quality | You | Actually use the tool on real prompts |

### Prompt Templates for Building

**Adding a new template category:**
```
Add a new system prompt context for the "[Category Name]" template category.
When this category is selected, the system prompt should additionally remind 
the AI to consider: [list requirements from research doc Section 4].
Add the corresponding helper text: "[short description]"
```

**When something breaks:**
```
Error in [feature name]:
[Paste exact error from browser console]
This happens when: [describe what you clicked/did]
Expected behavior: [what should happen]
My stack: React, Tailwind, Supabase, Gemini API
Please fix and explain what went wrong.
```

---

## Deployment Plan

### Recommended Platform: Vercel

Lovable deploys directly to Vercel — it's one click from inside Lovable once you connect your GitHub account.

**Why Vercel:**
- Free tier is extremely generous (100GB bandwidth/month)
- Automatic HTTPS
- Automatic deployments on every code push
- Edge network means fast loads globally

**Deployment Steps:**
1. In Lovable, click "Deploy" → "Connect GitHub" → push to repo
2. In Vercel dashboard → Import project from GitHub
3. Add Environment Variables:
   ```
   GEMINI_API_KEY=your-key-here
   GROQ_API_KEY=your-key-here
   NEXT_PUBLIC_SUPABASE_URL=your-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
   ```
4. Click Deploy — your app is live in ~3 minutes
5. Add custom domain later: Settings → Domains (buy domain at Namecheap for ~$12/year)

**Critical:** Never put API keys in your frontend code directly. Always use environment variables. Vercel handles this securely.

---

## Cost Breakdown

### Month 1: Development + Launch

| Service | Free Tier Limit | You Need | Cost |
|---------|----------------|----------|------|
| Google Gemini API | 250 req/day | Free for <200 DAU | **$0** |
| Groq API | ~14,400 req/day | Free (fallback) | **$0** |
| Supabase | 500MB DB, 50k MAU | More than enough | **$0** |
| Vercel | 100GB bandwidth | Enough for 2,000 visitors | **$0** |
| Lovable.dev | Token limit (monthly) | Free for the build | **$0** |
| Umami Analytics | Free cloud | Free | **$0** |
| **Total Month 1** | | | **$0** |

### When You'll Need to Pay (Scale Triggers)

| Trigger | What to Upgrade | New Monthly Cost |
|---------|----------------|-----------------|
| 250+ DAU hitting Gemini limit | Gemini paid tier | ~$10–30/mo |
| 500+ DAU | Supabase Pro | $25/mo |
| 10,000 visitors/month | Vercel still free | $0 |
| Custom domain | Namecheap domain | $1/mo (~$12/yr) |
| **At 500+ DAU total** | | **~$36–56/mo** |

Revenue covers this: **6 Pro subscribers at $9/month = $54/month → profitable.**

---

## Scaling Path

### Week 1–2: Build Phase (0 users)
- Current stack handles everything on free tiers
- Focus: get all 6 P0 features working

### Post-Launch: 0–200 DAU
- Gemini free tier (250 req/day) handles this
- Supabase free tier handles this
- No cost, no action needed

### 200–500 DAU
- Watch Gemini rate limit errors in Supabase `api_events` table
- Groq fallback covers spikes
- Add Gemini paid billing when free tier hits limits daily

### 500+ DAU
- Add Pro plan (Stripe integration via Lovable: "Add Stripe checkout for $9/month Pro plan")
- Upgrade Supabase to Pro ($25/mo) for no pause risk
- Revenue should exceed costs at this point

---

## Important Limitations

### What This Approach CAN'T Do Well:

**1. Real-time streaming output**
- Gemini supports streaming responses but Lovable may not wire it correctly
- *Workaround:* Add a skeleton loader animation that runs during the API call to make it feel fast. Users perceive "instant" if there's visual feedback.

**2. High concurrent load (spike traffic)**
- If you get front-paged on Product Hunt and 500 people hit it simultaneously, Gemini's 10 RPM limit will cause errors for some users
- *Workaround:* Add Groq fallback (already planned). Show friendly "We're popular right now — try again in 30 seconds" message.

**3. Exporting your code from Lovable**
- Unlike Bubble, Lovable lets you export and own your code — but the export may need cleanup
- *Workaround:* Export to GitHub early (Day 3) and keep it in sync. Don't get locked in.

### When You'll Need a Real Developer:
- VS Code/Cursor browser extension (Month 2–3)
- Complex saved prompt sync across devices
- Custom API with team workspace support

---

## Day-by-Day Build Plan

### Days 1–3: Foundation
- [ ] Day 1: Create all accounts, get all API keys, set up Supabase
- [ ] Day 1: Paste the initial Lovable prompt — get the shell working
- [ ] Day 2: Add the Gemini API call, write the system prompt
- [ ] Day 2: Test with 20 real inputs — iterate the system prompt until it's good
- [ ] Day 3: Add all 8 template categories with context functions
- [ ] Day 3: Add all 6 AI editor formatting rules
- [ ] Day 3: Deploy to Vercel — share URL with yourself on mobile

### Days 4–7: Core Features + Mobile
- [ ] Day 4: Add Groq fallback logic
- [ ] Day 4: Add Supabase event tracking
- [ ] Day 5: Mobile testing pass — fix all layout issues on real devices
- [ ] Day 6: Add analytics (Umami)
- [ ] Day 7: Buffer day — polish copy, fix rough edges, test again

### Days 8–11: Quality Pass
- [ ] Test all 8 template categories with real prompts — is the output genuinely good?
- [ ] Test all 6 editor styles — are the formatting differences clear and correct?
- [ ] Find 5 people who've never seen it and watch them use it (don't explain anything)
- [ ] Fix whatever they get confused by

### Days 12–14: Launch Prep
- [ ] Final bug fixes from user testing
- [ ] Add "Share" link generation (optional — nice to have)
- [ ] Write Reddit posts for each community
- [ ] Soft launch Day 14: share with 10 vibe coders privately
- [ ] Public launch Day 16–17

---

## Success Checklist

### Before Going Public
- [ ] All 6 P0 features work end-to-end without errors
- [ ] Transformation works for all 8 template categories
- [ ] All 6 AI editor styles produce distinct output formatting
- [ ] Copy button works on iPhone Safari AND Chrome Android
- [ ] No horizontal scroll on 375px width
- [ ] Page loads in under 2 seconds (test at webpagetest.org)
- [ ] Gemini → Groq fallback triggers automatically
- [ ] Supabase event tracking is logging transformations
- [ ] Analytics are tracking page views
- [ ] No API keys are visible in browser developer tools
- [ ] Tested with 5 real vibe coders who've never seen the product
- [ ] No placeholder content ("Lorem ipsum", "coming soon") visible

### Definition of Technical Success
Your implementation is successful when:
- It runs without crashing for 48 hours straight
- The 5 test users successfully copy a prompt they find genuinely useful
- Transformation completes in under 5 seconds 95% of the time
- Monthly cost is $0 during Week 1–2

---

## Open Questions from PRD — Technical Answers

**"Should the AI editor selector default to 'Claude Code' or ask on first visit?"**
→ Default to "Claude Code" (it's the most popular in your target communities right now). Store in localStorage so returning users see their last choice. No modal needed.

**"Should we surface example before/after transformations on the homepage?"**
→ Yes — add 3 hardcoded example transformations that display before the user types anything. Show them rotating every 5 seconds. This removes the blank-page anxiety and demonstrates the value instantly. Add to Lovable: "Add 3 example before/after cards that auto-rotate every 5 seconds and disappear once the user starts typing."

---

## Key Things to Monitor Weekly

1. **aistudio.google.com** → API quota usage (Gemini free limits change without warning)
2. **Supabase dashboard** → `api_events` table (watch for Gemini → Groq fallback frequency)
3. **Umami** → Which template categories get used most (double down on those)
4. **Copy rate** → If under 70% of transformations result in a copy click, the output quality needs work

---

*Technical Design for: Vibe Prompt*
*Approach: Vibe-coded (Lovable → Vercel → Supabase)*
*Estimated Time to MVP: 14 days*
*Estimated Cost: $0/month at launch*
*Next Review: After soft launch (Day 14)*
