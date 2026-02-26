# Product Requirements — Vibe Prompt MVP

## One-Line Description
Transform plain-English descriptions into structured, expert-level prompts optimized for AI coding editors. Free. Instant. No sign-up required.

## Primary User Story
"As a vibe coder, I want to describe what I want to build in plain English so that I get a prompt that actually makes my AI editor do it right the first time."

---

## P0 Must-Have Features (All Required for Launch)

### 1. Prompt Transformation Engine
- Input: free-form text up to 1,000 characters (live character counter)
- Output: structured prompt in SPEC format (Situation → Purpose → Explicit Constraints → Checklist)
- Transformation completes in under 5 seconds
- Output adapts based on selected AI editor
- Loading skeleton visible during API call

### 2. Template Category Selector (8 categories)
All 8 must be available at launch:
1. **UI & Frontend** — responsive layout, accessibility (ARIA), loading/error states, mobile-first
2. **Database Design** — foreign key constraints, indexes, ON DELETE behavior, relationships
3. **Authentication** — OAuth flow, session management, CSRF protection, user profile creation
4. **API & Backend Logic** — input validation, rate limiting, error response format, logging
5. **Error Handling & Debugging** — exact error message, likely causes, defensive fix
6. **Deployment & DevOps** — environment variables, rollback plan, health check endpoint
7. **Performance Optimization** — Core Web Vitals targets, caching strategy, what NOT to break
8. **Feature Addition to Existing Code** — analyze existing patterns, don't break current behavior

Each category shows a short helper text description when selected.

### 3. AI Editor Selector (6 editors)
All 6 must produce distinct output formatting:
- **Claude Code** — markdown headers (##), explicit file paths (/src/components/...), numbered steps
- **Cursor** — @-mention style for files (@LoginForm.tsx), bullet points, Plan Mode context
- **Windsurf** — outcome-focused, don't list specific files, describe end state
- **Gemini CLI** — more detail, large context, explicit about which files should/shouldn't be modified
- **Bolt.new** — very explicit UI guidance (colors, spacing, layout, interactions)
- **Lovable** — very explicit UI guidance (same as Bolt.new)

Default: Claude Code. Persist selection in localStorage (key: `vibePrompt_lastEditor`).

### 4. Before/After Display + Copy Button
- Side-by-side on desktop, stacked vertically on mobile (≤640px)
- "Your Input" panel on left (desktop) / top (mobile)
- "Enhanced Prompt" panel on right / bottom
- Copy button: calls `navigator.clipboard.writeText()`, changes to "✓ Copied!" + green for 2 seconds, then reverts
- Mobile Safari fallback: select text + show "Text selected — long press to copy"
- Output text must be selectable/highlightable

### 5. No Sign-Up Required
- Full transformation works with zero authentication
- No email gate, no "free trial" wall
- After transformation, show optional "Save this prompt" CTA (leads to account creation)

### 6. Mobile-Responsive Design
- Full functionality on 375px+ screens (iPhone SE minimum)
- No horizontal scrolling at any screen width
- Both dropdowns stack vertically on mobile (not side by side)
- All tap targets minimum 44px
- Copy button works on mobile Chrome and iPhone Safari
- Viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1">`

---

## Nice-to-Have Features (Week 2 if time allows)
- **Saved Prompt History**: optional account (Supabase auth), save up to 10 prompts free
- **Share Link**: generate shareable URL for any enhanced prompt (viral growth driver)

---

## NOT in MVP — Build These Later
- Community Prompt Library → Month 2
- VS Code / Cursor Extension → Month 2–3
- Prompt Quality Score → Month 2
- Multi-step Prompt Chains → Month 3
- API Access / Team Workspaces → Month 4+
- Native iOS/Android Apps → PWA covers mobile for now

---

## Success Metrics (First 30 Days)
| Metric | Target | How to Measure |
|--------|--------|----------------|
| Unique visitors | 2,000+ | Umami Analytics |
| Prompt transformations completed | 1,000+ | Supabase `transformations` table |
| Active users (2+ sessions) | 500+ | Umami Analytics |
| Copy button clicks | 70%+ of transformations | `was_copied` in transformations table |
| Bounce rate | Under 60% | Umami Analytics |

---

## Design Requirements
- **Vibe:** Friendly, fast, approachable — the anti-enterprise dev tool
- **Feels instant** — skeleton loader during API calls, animations are snappy
- **Warm, not cold** — white/off-white background, rounded corners, encouraging microcopy ("Let's make that prompt shine ✨")
- **Clarity over cleverness** — every element has one job
- No marketing fluff above the fold — the product IS the homepage

### Homepage Layout
```
┌─────────────────────────────────────┐
│  Vibe Prompt        [Try Templates] │
├─────────────────────────────────────┤
│  Plain English in. Perfect          │
│  AI prompts out. Free, instant.     │
│                                     │
│  [Describe what you want to build]  │
│                                     │
│  [Template ▼]        [AI Editor ▼] │
│                                     │
│  [✨ Enhance My Prompt]             │
│                                     │
├─────────────────────────────────────┤
│  YOUR INPUT     │  ENHANCED PROMPT  │
│  "add a login   │  You are a senior │
│   page"         │  React developer  │
│                 │  [📋 Copy Prompt] │
└─────────────────────────────────────┘
```

---

## Technical Constraints
- No PII stored server-side for anonymous users
- API keys never visible in browser developer tools (environment variables only)
- Gemini → Groq fallback triggers automatically on 429/503 errors
- Page load under 2 seconds on 4G
- WCAG 2.1 AA accessibility (labels, contrast, keyboard navigation)
- Budget: $0/month at launch (all free tiers)

---

## Definition of Done — MVP is Ready When:
- [ ] All 6 P0 features work end-to-end without errors
- [ ] All 8 template categories produce distinct, useful output
- [ ] All 6 AI editor styles produce distinct formatting
- [ ] Copy button works on iPhone Safari AND Chrome Android
- [ ] No horizontal scroll on 375px width
- [ ] Page loads under 2 seconds (check at webpagetest.org)
- [ ] Gemini → Groq fallback triggers automatically
- [ ] Supabase tracking logs transformations and API events
- [ ] Umami analytics tracks page views and custom events
- [ ] No API keys visible in browser DevTools
- [ ] Tested with 5 real vibe coders who've never seen the product
- [ ] Zero placeholder content ("Lorem ipsum", "Coming soon") in production
