# Project Brief (Persistent Rules)

## Product Vision
Vibe Prompt is the fastest way for non-technical builders to write prompts that work. Plain English in, expert prompt out. Free, instant, no sign-up required.

## The Most Important Principle
Zero friction is the entire value proposition. If anything creates friction before a user gets their first transformed prompt, we're failing.

---

## Key Commands
Since this is a Lovable-built project, there's no local dev server. Your commands are:
- **Build:** Type instructions in Lovable's chat interface
- **Preview:** Use Lovable's built-in preview window or share link
- **Deploy:** Click "Deploy" in Lovable → connects to GitHub → auto-deploys to Vercel
- **Debug:** Open browser DevTools (F12) → Console tab for errors
- **Test performance:** webpagetest.org with your Vercel URL
- **Monitor API:** Supabase dashboard → Table Editor → `api_events` table

---

## Coding Conventions (for Lovable prompts)
- Component names: PascalCase (e.g., `PromptTransformer`, `EditorSelector`)
- Functions: camelCase (e.g., `buildSystemPrompt`, `handleCopy`)
- CSS: Tailwind utility classes only — no custom CSS unless absolutely needed
- Colors: use the CSS variables defined in `agent_docs/tech_stack.md`
- Mobile-first: always style mobile layout first, then add `sm:` and `md:` prefixes for larger screens

---

## What Makes This App's Quality
1. **The system prompt quality** — This is the product. If output isn't impressive, iterate the `buildSystemPrompt` function before building other features.
2. **Speed perception** — Skeleton loader must appear instantly on button click. Users judge speed by visual feedback, not actual time.
3. **Mobile experience** — A large portion of the target audience will use this on their phone mid-project. Test constantly.

---

## When to Export from Lovable
Export your code to GitHub **by Day 3** — don't wait until you need it. Steps:
1. In Lovable: click the GitHub icon → Connect → push to new private repo
2. Keep this in sync — Lovable can pull/push to GitHub
3. This protects you if you hit the Lovable token limit

---

## Backup Plan: Switching to Bolt.new
If you hit Lovable's monthly token limit:
1. Export current codebase from Lovable to GitHub
2. Open Bolt.new → import from GitHub
3. Continue building with the same prompting style

---

## Privacy Rules (Non-Negotiable)
- Never store the actual text of user prompts server-side for anonymous users
- Only store: template_category, ai_editor, model_used, input_length (character count), output_length, was_copied, feedback
- Never expose API keys in browser DevTools → Network tab should show no keys in URLs or headers visible to the user

---

## Monitoring Cadence
Check these weekly (set a calendar reminder):
1. **aistudio.google.com** → API quota page (Gemini free limits can change without warning — this happened in Dec 2025)
2. **Supabase dashboard** → `api_events` table (if >10% of events are Groq fallbacks, add Gemini paid billing)
3. **Umami** → Which template categories are used most → double down on those in Month 2
4. **`was_copied` rate** → If below 70%, the output quality needs iteration

---

## Launch Sequence (Don't Skip Steps)
1. Day 14: Soft launch — share with 10 vibe coders privately, collect feedback for 48 hours
2. Day 16–17: Public launch — post to r/vibecoding, r/cursor, r/ClaudeAI, Cursor Discord, Windsurf Discord
3. Following week: Product Hunt launch (Tuesday or Wednesday for maximum visibility)
4. Ongoing: Ship improvements every 2–3 days based on usage data
