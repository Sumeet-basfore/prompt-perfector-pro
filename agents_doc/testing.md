# Testing Strategy — Vibe Prompt

## Philosophy
Since this is a vibe-coded app (no test framework), all verification is manual. Test after every feature. Don't move to the next feature until the current one passes all checks.

---

## Feature Verification Checklist

### After Building the App Shell (Day 1)
- [ ] Page loads in Lovable preview without errors
- [ ] All 3 sections visible: header, hero, tool area
- [ ] Both dropdowns populate with correct options (8 categories, 6 editors)
- [ ] Textarea accepts text and shows character counter
- [ ] "Enhance My Prompt" button is visible and styled correctly
- [ ] Result section is hidden on load

### After Adding the API Call (Day 2)
- [ ] Type "add a login page" → select "Authentication" → select "Claude Code" → click Enhance
- [ ] Skeleton loader appears immediately (don't wait — it must be instant)
- [ ] Result appears within 5 seconds
- [ ] Output is NOT empty
- [ ] Output starts with a role statement ("You are a senior...")
- [ ] Before/after section reveals correctly
- [ ] "Powered by Gemini" or "Powered by Groq" badge appears
- [ ] Open browser DevTools → Network tab → confirm API key NOT visible in request URLs

### After Adding All 8 Templates (Day 3)
Test each category with a realistic input:
- [ ] UI & Frontend: "add a dashboard that shows analytics"
- [ ] Database Design: "create a users table with posts"
- [ ] Authentication: "add Google login"
- [ ] API & Backend Logic: "create an endpoint that sends emails"
- [ ] Error Handling: "getting 500 error on my fetch call"
- [ ] Deployment: "deploy my app to Vercel with env variables"
- [ ] Performance: "my page loads slowly on mobile"
- [ ] Feature Addition: "add dark mode to my existing app"

For each: does the output mention category-specific concerns (e.g., ARIA for UI, OAuth for Auth)?

### After Adding All 6 Editor Styles (Day 3)
Test same input ("add a login page") with each editor:
- [ ] Claude Code: output uses ## headers and /file/path references
- [ ] Cursor: output uses @filename mentions
- [ ] Windsurf: output describes end state, no specific file paths
- [ ] Gemini CLI: output is more detailed, specifies which files to skip
- [ ] Bolt.new: output describes UI in detail (colors, spacing, interactions)
- [ ] Lovable: same as Bolt.new

Are the 6 outputs clearly different from each other? If they look similar, the system prompt formatting rules need strengthening.

### After Adding Groq Fallback (Day 4)
To test without waiting for an actual rate limit:
- Temporarily change GEMINI_API_KEY to an invalid key
- Click Enhance — it should fall back to Groq and show "Powered by Groq"
- Check Supabase `api_events` table → should show a new row with `success: false` for gemini and `success: true` for groq
- Restore the real GEMINI_API_KEY

### After Adding Supabase Tracking (Day 4)
- Complete one transformation → check Supabase `transformations` table → new row should appear
- Click copy button → refresh Supabase → `was_copied` should be `true`
- Click 👍 feedback → `feedback` column should be `'useful'`
- Verify: no actual prompt text stored in the table (only lengths)

---

## Mobile Testing Checklist (Day 5 — Real Device, Not Browser Emulator)

Run this on a real iPhone (Safari) AND real Android (Chrome):

**Layout:**
- [ ] Page loads without horizontal scrolling
- [ ] Both dropdowns stack vertically (not side by side)
- [ ] Before/after panels stack vertically (not side by side)
- [ ] All text is readable without zooming
- [ ] "Enhance My Prompt" button is full width and easy to tap

**Interaction:**
- [ ] Tapping textarea brings up keyboard without covering the input
- [ ] Character counter updates as you type
- [ ] Dropdown selections work with thumbs
- [ ] Copy button works (text gets copied to clipboard)
- [ ] If copy fails (Safari): "Text selected — long press to copy" message appears

**Performance:**
- [ ] Page feels fast on 4G (test with phone data, not WiFi)
- [ ] Skeleton loader appears immediately when button is tapped

---

## Quality Pass (Days 8–11) — Most Important Test

Find 5 people who have never seen Vibe Prompt. Don't explain anything. Just give them the URL and say "try it."

Watch for:
- [ ] Do they understand what to type without instructions?
- [ ] Do they get confused by the dropdowns?
- [ ] Does the output impress them ("whoa, that's much better")?
- [ ] Do they click the copy button?
- [ ] Do they ask how to save it or come back?

Fix whatever confuses or doesn't impress them before public launch.

---

## Pre-Launch Checklist (Day 14)
- [ ] All 6 P0 features work end-to-end
- [ ] No console errors in DevTools
- [ ] No API keys visible in DevTools Network tab
- [ ] Page loads under 2 seconds at webpagetest.org
- [ ] No "Lorem ipsum" or placeholder text anywhere
- [ ] Feedback buttons (👍👎) are tracked in Supabase
- [ ] Umami shows events firing: `prompt_enhanced`, `copy_clicked`
- [ ] App runs without crashing for 48 hours straight
- [ ] 5 test users successfully copied a prompt they found genuinely useful

---

## When Something Breaks — Debugging Template

Give this to Lovable when you hit errors:

```
Error in [feature name]:
[Paste exact error from browser console — copy it completely]
This happens when: [describe what you clicked/did]
Expected behavior: [what should happen]
My stack: React, Tailwind, Supabase, Gemini API
Please fix and explain what went wrong.
```
