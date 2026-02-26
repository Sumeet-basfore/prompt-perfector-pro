# Product Requirements Document: Vibe Prompt MVP

**App Name:** Vibe Prompt  
**Tagline:** Plain English in. Perfect AI prompts out.  
**Launch Goal:** 500+ active users within 30 days of launch  
**Target Launch:** Within 2 weeks  
**Status:** Draft — Ready for Technical Design

---

## Who It's For

### Primary User: The Vibe Coder

A non-technical founder or early-stage builder who has discovered AI code editors (Cursor, Claude Code, Windsurf) and is blown away by what they can build — but keeps getting mediocre results because their prompts aren't structured correctly. They know what they want to build; they just can't translate it into language the AI understands deeply.

**Their Current Pain:**
- They type something like "add a login page" and the AI builds something generic that misses half the requirements
- They don't know how to specify edge cases, error states, or tech stack context
- They waste hours going back and forth with the AI fixing things that a better prompt would have prevented
- Every tool they've found is either too generic, requires an account just to try it, or is buried in a paid plan

**What They Need:**
- A fast, friendly tool that meets them where they are — plain English in, expert prompt out
- A starting point (templates) so they're not staring at a blank box
- Something that works on their phone when inspiration strikes
- Zero friction — no account, no credit card, just results

### Example User Story

"Meet Jordan, a 28-year-old with a SaaS idea who just discovered Claude Code. They're building a task management app and type 'make a dashboard that shows my team's tasks.' The AI generates something functional but misses role-based access, mobile layout, and loading states. Jordan spends two hours debugging. The next day they find Vibe Prompt, paste in the same request, pick the 'UI & Frontend' template, select Claude Code — and get a structured 400-word prompt that handles every edge case. The AI nails it first try."

---

## The Problem We're Solving

Vibe coding has exploded in 2025–2026. Andrej Karpathy coined the term and it's now a mainstream development paradigm — but the tools to do it *well* haven't caught up. AI code editors are powerful, but they're only as good as the prompts they receive. Most vibe coders are leaving 80% of the value on the table because they don't know how to prompt effectively.

**Why Existing Solutions Fall Short:**

- **PromptDC:** Closest competitor but limited template library, less awareness, and small team moving slowly
- **PromptPerfect / Cabina.AI:** General-purpose tools with no understanding of coding context, AI editor differences, or vibe coder workflows
- **AI editor built-ins:** Cursor and Windsurf have basic suggestions but no structured transformation or template library
- **Doing it manually:** Time-consuming and requires expertise most vibe coders don't have yet

**The gap:** No free, mobile-friendly tool combines vibe-coder focus + template library + beginner-friendly plain-language input. That's the moat.

---

## User Journey

### Discovery → First Use → Success

**1. Discovery**
- Reddit (r/vibecoding, r/cursor, r/ClaudeAI), Twitter/X, Product Hunt
- Hook: "Finally — a free tool that writes your AI coding prompts for you"
- Decision trigger: It's free, no sign-up required, takes 10 seconds to try

**2. Onboarding (First 60 Seconds)**
- Land on homepage with a single, clear input box and a friendly headline
- Pick a template category that matches what they're trying to build
- Select their AI editor from a dropdown
- Hit "Enhance My Prompt" — see a structured, professional prompt appear instantly
- One-click copy. Done.

**3. Core Usage Loop**
- **Trigger:** Starting a new feature or hitting a wall with their AI editor
- **Action:** Paste their rough idea, pick template + editor, transform
- **Reward:** A prompt that actually works — saves real time
- **Investment:** Saves their best prompts (with optional account), comes back next session

**4. Success Moment**
- "Aha!" moment: First time the AI code editor nails a complex task on the first try
- Share trigger: "Wait, how did you get it to do that so cleanly?" → "I used Vibe Prompt"

---

## MVP Features

### Must Have for Launch

#### 1. Prompt Transformation Engine
- **What:** User types plain-language description → AI returns a structured, detailed prompt
- **User Story:** As a vibe coder, I want to describe what I want in plain English so that I get a prompt that actually makes my AI editor do it right the first time
- **Success Criteria:**
  - [ ] Input accepts free-form text up to 1,000 characters
  - [ ] Output is a structured prompt using SPEC format (Situation → Purpose → Explicit Constraints → Checklist)
  - [ ] Transformation completes in under 5 seconds
  - [ ] Output adapts based on selected AI editor
- **Priority:** P0 — Critical

#### 2. Template Category Selector (8 Categories)
- **What:** Pre-built starting points so users aren't facing a blank box
- **Categories:** UI & Frontend, Database Design, Authentication, API & Backend Logic, Error Handling & Debugging, Deployment & DevOps, Performance Optimization, Feature Addition to Existing Code
- **User Story:** As a vibe coder building a login page, I want to pick an "Authentication" template so the tool already knows what constraints and edge cases to include
- **Success Criteria:**
  - [ ] All 8 categories available at launch
  - [ ] Each category pre-fills structural context into the system prompt
  - [ ] Selecting a template shows a short description of what it's for
- **Priority:** P0 — Critical

#### 3. AI Editor Selector
- **What:** Dropdown to choose Cursor, Claude Code, Windsurf, Gemini CLI, Bolt.new, or Lovable — output format adapts per tool
- **User Story:** As a Claude Code user, I want my prompt formatted with markdown structure and explicit file references, not Cursor's @-mention style
- **Success Criteria:**
  - [ ] 6 editors available at launch
  - [ ] System prompt adapts formatting style per editor (Claude Code: markdown-heavy; Cursor: @-mention style; Windsurf: outcome-focused)
  - [ ] Selected editor persists during the session
- **Priority:** P0 — Critical

#### 4. Before / After Display + Copy Button
- **What:** Show the user's original input alongside the enhanced output; one-click copy to clipboard
- **User Story:** As a user, I want to see how my prompt improved so I learn over time and can copy it instantly
- **Success Criteria:**
  - [ ] Side-by-side (desktop) or stacked (mobile) before/after layout
  - [ ] Copy button changes to "Copied!" for 2 seconds on click
  - [ ] Output is selectable/highlightable text
- **Priority:** P0 — Critical

#### 5. No Sign-Up Required
- **What:** Full core functionality available without creating an account
- **User Story:** As a first-time visitor, I want to try the tool immediately without giving my email so there's zero friction
- **Success Criteria:**
  - [ ] Transformation works with zero auth
  - [ ] No email gate, no "free trial" wall
  - [ ] Optional "Save this prompt" CTA appears post-transformation (leads to account creation)
- **Priority:** P0 — Critical

#### 6. Mobile-Responsive Design
- **What:** Full functionality on iPhone and Android — not just "it works," but it feels good
- **User Story:** As a user on my phone, I want to quickly enhance a prompt idea before I forget it
- **Success Criteria:**
  - [ ] Input, template selector, editor selector, and output all usable on 375px+ screens
  - [ ] Copy button works on mobile
  - [ ] No horizontal scrolling
- **Priority:** P0 — Critical

---

### Nice to Have (If Time Allows in Week 2)

- **Saved Prompt History:** Requires optional account — save up to 10 prompts free
- **Share Link:** Generate a shareable URL for any enhanced prompt (viral growth driver)

---

### NOT in MVP — Saving for Later

- **Community Prompt Library:** After launch, once there's content to show — Month 2
- **VS Code / Cursor Extension:** High value but high complexity — Month 2–3
- **Prompt Quality Score:** Explains why the output is better — Month 2
- **Multi-step Prompt Chains:** Complex tasks in sequential steps — Month 3
- **API Access / Team Workspaces:** B2B opportunity — Month 4+
- **Native iOS/Android Apps:** PWA covers mobile needs for now

*Why we're waiting: Two weeks to launch means ruthless cuts. These features would triple the build time without meaningfully improving the first-use experience.*

---

## How We'll Know It's Working

### Launch Success Metrics (First 30 Days)

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Total unique visitors | 2,000+ | Plausible Analytics |
| Prompt transformations completed | 1,000+ | Supabase event log |
| Active users (2+ sessions) | 500+ | Plausible Analytics |
| Copy button clicks | 70%+ of transformations | Click event tracking |
| Bounce rate | Under 60% | Plausible Analytics |

### Growth Metrics (Months 2–3)

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Returning users | 200+/week | Plausible Analytics |
| Optional account signups | 5% of active users | Supabase auth |
| Most-used template category | Identify top 2 | Supabase event log |
| Pro plan conversions (if launched) | 2% of active users | Stripe |

---

## Look & Feel

**Design Vibe:** Friendly, fast, approachable — the anti-enterprise dev tool

**Visual Principles:**
1. **Feels instant** — animations are snappy, transformations feel fast even if they take 3 seconds (streaming output or skeleton loader)
2. **Warm, not cold** — not another dark-gray developer dashboard. Friendly colors, rounded corners, encouraging microcopy ("Let's make that prompt shine ✨")
3. **Clarity over cleverness** — every element has one job; nothing decorative that doesn't help the user

**Key Screens:**
1. **Homepage / Transformer:** The product IS the homepage — input, selectors, output, copy button. No marketing fluff above the fold.
2. **Template Gallery:** Browse all 8 categories with short descriptions and example inputs
3. **Result Screen:** Before/after with copy button, optional "Save" CTA, share link

### Approximate Layout (Homepage)

```
┌─────────────────────────────────────┐
│  Vibe Prompt        [Try Templates] │
├─────────────────────────────────────┤
│                                     │
│  Plain English in. Perfect          │
│  AI prompts out. Free, instant.     │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Describe what you want to   │   │
│  │ build...                    │   │
│  └─────────────────────────────┘   │
│                                     │
│  [Template ▼]        [AI Editor ▼] │
│                                     │
│  [✨ Enhance My Prompt]             │
│                                     │
├─────────────────────────────────────┤
│  YOUR INPUT     │  ENHANCED PROMPT  │
│  ─────────────  │  ───────────────  │
│  "add a login   │  You are a senior │
│   page"         │  React developer  │
│                 │  working on...    │
│                 │                   │
│                 │  [📋 Copy Prompt] │
└─────────────────────────────────────┘
```

---

## Technical Considerations

**Platform:** Web (mobile-responsive PWA — no app store needed)  
**Recommended Stack:** Bolt.new or Lovable for MVP build → Vercel for hosting → Supabase for optional auth/storage  
**AI Engine:** Gemini 2.5 Flash (primary, free tier: 250 req/day) → Groq/Llama 3.3 70B (fallback)  
**Performance:** Transformation response under 5 seconds; page load under 2 seconds  
**Accessibility:** WCAG 2.1 AA minimum — proper labels, contrast, keyboard navigation  
**Security/Privacy:** No PII collected without consent; prompts are not stored server-side for anonymous users  
**Scalability:** Free tier handles up to ~200 DAU; Gemini paid tier activates at ~250+ DAU ($0.10/1M tokens)

---

## Budget & Constraints

| Item | Month 1 Cost |
|------|-------------|
| Gemini API (free tier) | $0 |
| Groq API (free tier) | $0 |
| Supabase (free tier) | $0 |
| Vercel (free tier) | $0 |
| Bolt.new / Lovable (free tier) | $0 |
| Plausible Analytics (self-hosted) | $0 |
| **Total** | **$0/month** |

Scales to ~$90–120/month at 500+ DAU — covered by first 10 Pro subscribers at $9/month.

**Team:** Solo founder  
**Timeline:** 2 weeks to launch

---

## Open Questions & Assumptions

- **Assumption:** Gemini 2.5 Flash free tier (250 req/day) is sufficient for the first 2 weeks post-launch; monitor closely and have Groq fallback ready
- **Assumption:** Vibe coders will prefer a friendly, warm aesthetic over a pure dark-mode dev tool look
- **Open Question:** Should the AI editor selector default to "Claude Code" or ask on first visit?
- **Open Question:** Should we surface example before/after transformations on the homepage to reduce the "blank page" problem before users type anything?
- **Flag:** AI API free tiers are volatile — Gemini cut limits 92% in Dec 2025 with no warning. Monitor aistudio.google.com pricing page weekly.

---

## Launch Strategy

**Soft Launch (Day 14):** Share URL privately with 5–10 vibe coders for 48-hour feedback cycle  
**Public Launch (Day 16–17):** Post to r/vibecoding, r/cursor, r/ClaudeAI, Cursor Discord, Windsurf Discord  
**Product Hunt Launch:** Tuesday or Wednesday the following week for maximum visibility  
**Feedback Collection:** Simple feedback button ("Was this prompt useful? 👍 👎") on every output  
**Iteration Cycle:** Ship improvements every 2–3 days in the first month based on usage data

---

## Definition of Done for MVP

The MVP is ready to launch when:

- [ ] All 6 P0 features are functional end-to-end
- [ ] Transformation works for all 8 template categories
- [ ] All 6 AI editor styles produce distinct, correct output formatting
- [ ] Copy button works on desktop and mobile
- [ ] Full user journey works on iPhone Safari and Chrome Android
- [ ] Page loads in under 2 seconds on a 4G connection
- [ ] Gemini → Groq fallback triggers automatically on rate limit errors
- [ ] Basic analytics are tracking (page views, transformations, copies)
- [ ] Tested with 5 real vibe coders who haven't seen it before
- [ ] No placeholder content anywhere in production

---

## Next Steps

1. ✅ **PRD approved** — this document
2. 🔲 **Day 1:** Get Gemini API key from aistudio.google.com + Groq key from console.groq.com
3. 🔲 **Day 1:** Open Bolt.new or Lovable and describe the MVP — use the system prompt template from Section 7 of your research report
4. 🔲 **Day 2:** Write and test the transformation system prompt (the secret sauce)
5. 🔲 **Days 3–10:** Build, test on mobile, add all 8 templates, add all 6 editor styles
6. 🔲 **Days 11–14:** Polish, fix bugs, test with friends, deploy to Vercel
7. 🔲 **Day 14+:** Launch!
8. 🔲 **Month 2:** Create Technical Design Document for saved prompts + Pro plan

---

*Document created: February 2026*  
*Status: Draft — Ready for Technical Design*  
*Owner: Vibe Prompt Founder*
