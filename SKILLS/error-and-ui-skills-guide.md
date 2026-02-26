# Error & UI Design Skills — Vibe Prompt Reference

---

## 🔴 ERROR-RELATED SKILLS

### 1. `error-detective` ⭐ Best for: finding bugs fast
> Searches logs and codebases for error patterns, stack traces, and anomalies. Correlates errors across systems and identifies root causes. Use PROACTIVELY when something breaks.

**Best for:** When you've got a weird bug and don't know where to start — this skill hunts across your whole codebase and Supabase logs to find the root cause.

**Prompt:**
```
Use the error-detective skill to investigate a bug in Vibe Prompt.

The symptom: [describe what's going wrong — e.g., "the copy button
sometimes doesn't copy anything on mobile Safari"]

Please search:
1. The component handling the copy button logic
2. The clipboard API call and its error handling
3. Any console errors that might be getting swallowed silently

Correlate any patterns and identify the root cause before suggesting a fix.
```

---

### 2. `error-handling-patterns` ⭐ Best for: building resilient code
> Masters error handling across languages — exceptions, Result types, error propagation, and graceful degradation to build resilient applications.

**Best for:** Making sure the Gemini → Groq fallback, rate limit errors, and clipboard failures all fail gracefully with good user messages — not silent crashes.

**Prompt:**
```
Use the error-handling-patterns skill to audit and improve error handling
in Vibe Prompt. The app has three critical failure points:

1. Gemini API call — can return 429 (rate limit), 503 (overload), or
   generic network errors
2. Groq fallback — should trigger on Gemini failures but can also fail
3. Clipboard API — can fail silently on mobile Safari

For each failure point, review the current handling and suggest
improvements. The user should always see a clear, friendly message —
never a blank screen or silent failure. Show me the improved code
for each case.
```

---

### 3. `systematic-debugging` ⭐ Best for: any unknown bug
> Use when encountering any bug, test failure, or unexpected behavior — before proposing any fixes.

**Best for:** Your go-to skill for any debugging session. Forces root-cause analysis before jumping to patches — critical when you're vibe-coding and can't afford to break things.

**Prompt:**
```
Use the systematic-debugging skill to help me diagnose this issue:

Error: [paste the exact error from browser DevTools console]

Steps to reproduce:
1. [what you clicked/did]
2. [what happened next]

Expected: [what should have happened]
Actual: [what actually happened]

Stack: React + Tailwind, Supabase, Gemini API, deployed on Vercel.

Do NOT jump to a fix yet. First walk me through:
- What layer is likely causing this (frontend, API call, Supabase, state)
- What you'd check first and why
- The most likely root cause
Then propose a fix only after diagnosis is complete.
```

---

### 4. `debugging-strategies` ⭐ Best for: systematic bug hunts
> Masters systematic debugging techniques, profiling tools, and root cause analysis to efficiently track down bugs across any codebase or technology stack.

**Best for:** When you need a disciplined multi-step approach — especially useful for bugs that only appear intermittently (like rate limit timing issues).

**Prompt:**
```
Use the debugging-strategies skill to help me track down an intermittent
bug in Vibe Prompt. The issue: [describe the bug — e.g., "the Groq
fallback sometimes triggers even when Gemini isn't rate-limited,
causing slower responses for no reason"].

This only happens sometimes, making it hard to reproduce consistently.
Walk me through a systematic approach to:
1. Reproduce it reliably
2. Isolate which condition triggers it
3. Add temporary logging to capture the state when it occurs
4. Fix it without breaking the normal Gemini-first flow
```

---

### 5. `react-ui-patterns` ⭐ Best for: loading, error & empty states in React
> Modern React UI patterns for loading states, error handling, and data fetching. Use when building UI components, handling async data, or managing UI states.

**Best for:** The skeleton loader, error messages, and empty states are all React UI state problems — this skill covers exactly that.

**Prompt:**
```
Use the react-ui-patterns skill to improve the UI state handling in
Vibe Prompt's main transformer component. I need proper patterns for:

1. Loading state — skeleton loader that appears instantly when the
   "Enhance My Prompt" button is clicked (before the API responds)
2. Error state — friendly message when both Gemini AND Groq fail
   ("Our AI is taking a quick break — try again in 60 seconds 🌿")
3. Empty state — the before/after section should be hidden on load
   and only appear after the first successful transformation
4. Success state — result appears with a fade-in animation

Show me the React component patterns and state management approach
for handling all four states cleanly.
```

---

### 6. `distributed-debugging-debug-trace` ⭐ Best for: tracing API call failures
> Debugging expert for setting up comprehensive debugging environments, distributed tracing, and diagnostic tools across systems.

**Best for:** Tracing exactly what happens in the Gemini → Groq → Supabase logging chain when something goes wrong in production.

**Prompt:**
```
Use the distributed-debugging-debug-trace skill to help me add
lightweight tracing to Vibe Prompt's API call chain.

The chain is:
User clicks "Enhance" → Gemini API call → (on 429/503) Groq fallback
→ Supabase logs the event → Result shown to user

I want to be able to see in my Supabase api_events table exactly:
- Which step failed
- What the HTTP status code was
- How long each step took
- Whether the fallback was triggered

Give me the tracing/logging code to add at each step, and a sample
Supabase query I can run to investigate failures after the fact.
```

---

### 7. `sharp-edges` ⭐ Best for: catching dangerous code before launch
> Identifies error-prone APIs and dangerous configurations before they cause problems in production.

**Best for:** Pre-launch safety check — finds the parts of your code most likely to blow up under real traffic.

**Prompt:**
```
Use the sharp-edges skill to identify error-prone APIs and dangerous
configurations in Vibe Prompt before public launch.

Focus on:
1. The Gemini and Groq API calls — are there edge cases in the
   response parsing that could throw unexpected errors?
2. The Supabase client initialization — could it fail silently if
   environment variables are missing?
3. The localStorage usage for editor preference — what happens on
   browsers with localStorage disabled?
4. The clipboard API — is there any case where it throws an
   uncaught exception?

List each sharp edge with its risk level and the safest way to handle it.
```

---

### 8. `github-issue-creator` ⭐ Best for: turning bugs into trackable issues
> Converts raw notes, error logs, or screenshots into crisp GitHub-flavored markdown issue reports.

**Best for:** When you find a bug during testing and want to properly document it before fixing it — keeps your GitHub Issues clean and searchable.

**Prompt:**
```
Use the github-issue-creator skill to turn this bug report into a
clean GitHub issue for the Vibe Prompt repo:

Raw notes: [paste your messy bug description, error log, or just
describe what went wrong in plain English]

The issue should include:
- A clear title
- Steps to reproduce
- Expected vs actual behavior
- Device/browser where it was found
- Severity label suggestion (critical / high / medium / low)
- Any relevant error messages formatted as code blocks
```

---

---

## 🎨 UI DESIGN SKILLS

### 1. `ui-ux-pro-max` ⭐ Best for: overall UI/UX elevation
> UI/UX design intelligence with 50 styles, 21 palettes, 50 font pairings, 20 chart types, and 9 tech stacks including React, Next.js, Tailwind, and SwiftUI.

**Best for:** The biggest, most capable UI skill in the whole catalog. Use this when you want Vibe Prompt to go from "it works" to "it looks genuinely impressive." Covers design system, visual hierarchy, and interaction patterns all at once.

**Prompt:**
```
Use the ui-ux-pro-max skill to elevate the visual design of Vibe Prompt.

Current design spec:
- Primary color: #7C3AED (warm purple)
- Accent: #F59E0B (warm amber)
- Font: Inter
- Background: #FAFAFA (off-white)
- Rounded corners: 12px
- Stack: React + Tailwind

Design vibe from PRD: "Friendly, fast, approachable — the anti-enterprise
dev tool. Warm, not cold. Clarity over cleverness."

Suggest improvements to:
1. Typography hierarchy — headline, subhead, body, helper text sizing
2. The main CTA button ("✨ Enhance My Prompt") — make it feel exciting to click
3. The before/after result panels — make the contrast between input and
   output feel dramatic and rewarding
4. Micro-interactions — what small animations would make this feel polished?
5. Mobile layout — what changes when dropping below 640px?

Give me specific Tailwind classes for each suggestion.
```

---

### 2. `tailwind-design-system` ⭐ Best for: building a consistent design system
> Build scalable design systems with Tailwind CSS, design tokens, component libraries, and responsive patterns.

**Best for:** Locking in consistent spacing, colors, and component styles across the whole app so nothing looks mismatched after multiple Lovable build sessions.

**Prompt:**
```
Use the tailwind-design-system skill to create a mini design system
for Vibe Prompt using Tailwind CSS.

Define reusable patterns for:
1. Color tokens — primary (#7C3AED), accent (#F59E0B), success (#10B981),
   background (#FAFAFA), surface (#FFFFFF), text-primary (#111827),
   text-secondary (#6B7280), border (#E5E7EB)
2. Component classes — button variants (primary, secondary, ghost),
   card/panel, dropdown, textarea, badge ("Powered by Gemini")
3. Spacing system — consistent padding and gap values to use everywhere
4. Responsive breakpoints — what changes at sm (640px) and md (768px)?

Give me a tailwind.config.js snippet that codifies the tokens, plus
example Tailwind class strings for each component type.
```

---

### 3. `tailwind-patterns` ⭐ Best for: modern Tailwind v4 techniques
> Tailwind CSS v4 principles — CSS-first configuration, container queries, modern patterns, and design token architecture.

**Best for:** Making sure your Tailwind usage is modern and efficient, especially container queries for the before/after panels that need to reflow based on available space.

**Prompt:**
```
Use the tailwind-patterns skill to modernize the Vibe Prompt UI using
Tailwind CSS v4 patterns.

Specifically help me with:
1. Container queries for the before/after result panels — they should
   be side-by-side when the container is wide enough, stacked when not,
   independent of the viewport width
2. CSS-first configuration — move color tokens to CSS custom properties
   instead of tailwind.config.js
3. The skeleton loader animation — implement it using Tailwind's
   animate-pulse or a custom keyframe, keeping it smooth at 60fps
4. The result reveal animation — fade + slide up using Tailwind's
   built-in transition utilities

Show me the exact implementation for each.
```

---

### 4. `radix-ui-design-system` ⭐ Best for: accessible, polished dropdowns & UI primitives
> Build accessible design systems with Radix UI primitives — headless component customization, theming strategies, and compound component patterns.

**Best for:** The template category and AI editor dropdowns need to be accessible, keyboard-navigable, and look good. Radix UI handles all that with zero custom ARIA work.

**Prompt:**
```
Use the radix-ui-design-system skill to replace the basic HTML select
dropdowns in Vibe Prompt with accessible Radix UI Select components.

Requirements:
- Template Category dropdown (8 options) — should show a short
  description below the selected item when open
- AI Editor dropdown (6 options) — should show the editor name clearly
- Both should work with keyboard navigation (arrow keys, enter, escape)
- Both should close properly on mobile when an option is selected
- Styled with Tailwind to match our design: #7C3AED focus rings,
  rounded-xl, Inter font

Give me the complete Radix Select component code with Tailwind styling
for both dropdowns.
```

---

### 5. `scroll-experience` ⭐ Best for: making the result reveal feel magical
> Expert in building immersive scroll-driven experiences — parallax storytelling, scroll animations, interactive narratives, and cinematic web experiences.

**Best for:** The moment the enhanced prompt appears is the "aha!" moment of Vibe Prompt. This skill makes that reveal feel satisfying and memorable — which directly drives the "share" impulse.

**Prompt:**
```
Use the scroll-experience skill to design a memorable result reveal
animation for Vibe Prompt.

When the "Enhance My Prompt" button is clicked and the API returns:
1. The before/after section should appear with a scroll-triggered or
   physics-based animation that feels rewarding, not generic
2. The enhanced prompt text should ideally appear in a way that feels
   like it's "being written" or revealed (streaming effect or stagger)
3. The "📋 Copy Prompt" button should draw the eye after the result
   appears — maybe a subtle pulse or glow

Keep it under 300ms total and make sure it doesn't feel gimmicky.
This is a productivity tool, not a portfolio site. The animation should
amplify the value, not distract from it.

Give me the CSS/Tailwind + React code for the reveal sequence.
```

---

### 6. `wcag-audit-patterns` ⭐ Best for: accessibility compliance
> Conduct WCAG 2.2 accessibility audits with automated testing, manual verification, and remediation guidance.

**Best for:** The PRD explicitly requires WCAG 2.1 AA compliance. This skill runs the full audit and gives you a fix list — critical before public launch.

**Prompt:**
```
Use the wcag-audit-patterns skill to audit Vibe Prompt for WCAG 2.1 AA
compliance. The PRD requires this as a launch criterion.

Focus on:
1. Color contrast — does #7C3AED on #FAFAFA meet 4.5:1 for normal text?
   Does #F59E0B meet contrast requirements for the accent elements?
2. Keyboard navigation — can a user complete the full flow (type input,
   select dropdowns, click enhance, copy result) using only keyboard?
3. ARIA labels — does the textarea, both dropdowns, and the copy button
   have proper accessible labels?
4. Focus indicators — are focus rings visible on all interactive elements?
5. Mobile screen reader — does VoiceOver on iPhone Safari announce the
   result correctly when it appears?

Give me a prioritized list of issues and the exact HTML/JSX fixes for each.
```

---

### 7. `react-ui-patterns` ⭐ Best for: clean component state for all UI states
> Modern React UI patterns for loading states, error handling, and data fetching. Use when building UI components, handling async data, or managing UI states.

*(Also listed under Error skills — it bridges both worlds)*

**Prompt (UI focus):**
```
Use the react-ui-patterns skill to design the complete component state
architecture for Vibe Prompt's main transformer UI.

The component needs to handle these states cleanly:
- idle: textarea empty, result hidden, button enabled
- typing: character counter updating, template/editor selected
- loading: button disabled + text "Enhancing...", skeleton loader visible
- success: before/after panels revealed, copy button active
- error: friendly error message, button re-enabled for retry
- copied: copy button turns green + "✓ Copied!" for 2 seconds

Design the state machine (using useState or useReducer) and show me
how each UI state maps to component rendering. Include the Tailwind
class changes for each state.
```

---

### 8. `canvas-design` ⭐ Best for: marketing visuals and launch assets
> Create beautiful visual art in .png and .pdf documents using design philosophy. Use when creating posters, social media visuals, or marketing assets.

**Best for:** Product Hunt thumbnail, Reddit post preview image, Twitter/X launch card — all the visual assets you'll need for launch day.

**Prompt:**
```
Use the canvas-design skill to create a Product Hunt launch thumbnail
for Vibe Prompt.

Brand details:
- App name: "Vibe Prompt"
- Tagline: "Plain English in. Perfect AI prompts out."
- Colors: #7C3AED (warm purple), #F59E0B (amber), white background
- Font: Inter Bold for the name, Inter Regular for tagline
- Vibe: friendly, modern, not corporate

The thumbnail should:
- Be 1270x760px (Product Hunt standard)
- Show the app name and tagline prominently
- Include a simple visual metaphor for "plain text → structured prompt"
  (e.g., a before/after arrow, a magic wand icon, or a text transform visual)
- Feel warm and inviting, not like a dark-mode dev tool

Generate the image as a .png file.
```

---

## Quick Reference Tables

### Error Skills — When to Use Each

| Skill | Best Moment to Reach For It |
|---|---|
| `error-detective` | Something is broken and you don't know where |
| `error-handling-patterns` | Building/improving API error + fallback logic |
| `systematic-debugging` | Any bug — use this FIRST before anything else |
| `debugging-strategies` | Intermittent bugs that are hard to reproduce |
| `react-ui-patterns` | Loading, error, empty state UI not working right |
| `distributed-debugging-debug-trace` | Tracing the full Gemini → Groq → Supabase chain |
| `sharp-edges` | Pre-launch safety sweep for dangerous code |
| `github-issue-creator` | Turning a messy bug report into a clean GitHub issue |

### UI Design Skills — When to Use Each

| Skill | Best Moment to Reach For It |
|---|---|
| `ui-ux-pro-max` | Big visual upgrade — overall design elevation |
| `tailwind-design-system` | Locking in consistent tokens and component classes |
| `tailwind-patterns` | Modern Tailwind v4 techniques, container queries |
| `radix-ui-design-system` | Replacing basic dropdowns with accessible ones |
| `scroll-experience` | Making the result reveal feel magical |
| `wcag-audit-patterns` | WCAG 2.1 AA compliance before launch |
| `react-ui-patterns` | Component state machine (loading/success/error/copied) |
| `canvas-design` | Product Hunt thumbnail, launch social media assets |
