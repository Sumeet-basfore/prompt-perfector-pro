# Vibe Prompt — Design System Reference

> Tailwind CSS v3.4 · Next.js 14 · Plus Jakarta Sans

---

## 1. Color Tokens

| Token | Hex | Tailwind class | Usage |
|---|---|---|---|
| Primary | `#7C3AED` | `bg-primary` / `text-primary` | CTA buttons, links, key UI |
| Primary hover | `#6D28D9` | `hover:bg-primary-hover` | Button hover state |
| Primary light | `#A78BFA` | `bg-primary-light` | Tags, highlights |
| Accent | `#F59E0B` | `bg-accent` | Secondary actions, warnings |
| Accent hover | `#D97706` | `hover:bg-accent-hover` | Accent hover state |
| Success | `#10B981` | `text-success` | Positive feedback |
| Background | `#FAFAFA` | `bg-background` | Page background |
| Surface | `#FFFFFF` | `bg-surface` | Cards, panels, inputs |
| Text primary | `#111827` | `text-text-primary` | Headings, body |
| Text secondary | `#6B7280` | `text-text-secondary` | Captions, help text |
| Border | `#E5E7EB` | `border-border` | Dividers, input borders |

---

## 2. Component Classes

All classes live in `globals.css` → `@layer components`.

### Buttons

```html
<!-- Primary (violet fill) -->
<button class="btn-primary">Generate Prompt</button>

<!-- Secondary (outlined) -->
<button class="btn-secondary">Copy to Clipboard</button>

<!-- Ghost (no background) -->
<button class="btn-ghost">Cancel</button>
```

**Tailwind equivalent (if you skip the class)**
```
btn-primary  → inline-flex items-center justify-center font-semibold text-sm
                rounded-btn px-5 py-2.5 bg-primary text-white
                hover:bg-primary-hover active:scale-[0.98]
                focus-visible:ring-2 focus-visible:ring-primary
                transition-all duration-200

btn-secondary → …same base… bg-surface text-primary border border-primary
                hover:bg-primary/5

btn-ghost     → …same base… bg-transparent text-text-secondary
                hover:bg-border/40 hover:text-text-primary
```

### Card / Panel

```html
<div class="card">
  <h3 class="text-lg font-semibold text-text-primary">Section Title</h3>
  <p class="mt-2 text-sm text-text-secondary">Description text.</p>
</div>
```

Tailwind string: `bg-surface rounded-card border border-border p-card-pad shadow-card hover:shadow-card-hover`

### Dropdown

```html
<div class="dropdown">
  <button class="dropdown-item">Cursor</button>
  <button class="dropdown-item">Claude Code</button>
  <button class="dropdown-item">Windsurf</button>
</div>
```

### Textarea

```html
<textarea class="textarea" rows="6" placeholder="Describe your app idea…"></textarea>
```

### Badge

```html
<span class="badge">Powered by Gemini</span>
<span class="badge-accent">Pro</span>
```

---

## 3. Spacing System

Built on Tailwind's 4 px grid. Custom aliases added in `tailwind.config.ts`:

| Alias | Value | Class | Use for |
|---|---|---|---|
| section | 48 px | `gap-section`, `py-section` | Between page sections |
| card-pad | 24 px | `p-card-pad` | Inside cards / panels |
| input-pad | 12 px | `p-input-pad` | Inside inputs / textareas |

**Standard spacings to prefer:**

| Scale | px | Class examples |
|---|---|---|
| 1 | 4 | `gap-1`, `p-1` |
| 2 | 8 | `gap-2`, `p-2` |
| 3 | 12 | `gap-3`, `px-3` |
| 4 | 16 | `gap-4`, `p-4` |
| 5 | 20 | `py-5` |
| 6 | 24 | `gap-6`, `p-6` *(≈ card-pad)* |
| 8 | 32 | `gap-8`, `p-8` |
| 12 | 48 | `gap-12` *(≈ section)* |
| 16 | 64 | `py-16` — hero top/bottom |

**Rule of thumb:** inner spacing uses 3–4, component gaps use 4–6, section gaps use 8–12.

---

## 4. Responsive Breakpoints

| Breakpoint | Min-width | What changes |
|---|---|---|
| **Base** (mobile-first) | 0 – 639 px | Single column. Textarea full width. Section padding `px-4 py-6`. Font sizes base. |
| **sm** (640 px) | ≥ 640 px | Side margins increase (`px-6`). Card padding bumps up. Buttons can sit side-by-side. |
| **md** (768 px) | ≥ 768 px | Max-width container (`max-w-2xl mx-auto`). Section padding `px-8 py-12`. Larger headings. Badge may move inline. |

### Example responsive pattern

```html
<main class="px-4 py-6 sm:px-6 md:px-8 md:py-12 max-w-2xl mx-auto">
  <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold">
    Vibe Prompt
  </h1>
  <div class="mt-4 sm:mt-6 md:mt-8 flex flex-col sm:flex-row gap-3">
    <button class="btn-primary w-full sm:w-auto">Generate</button>
    <button class="btn-secondary w-full sm:w-auto">Copy</button>
  </div>
</main>
```

---

## 5. Quick-Reference Table

| Component | Class string |
|---|---|
| Page wrapper | `px-4 py-6 sm:px-6 md:px-8 md:py-12 max-w-2xl mx-auto` |
| Primary button | `btn-primary` |
| Secondary button | `btn-secondary` |
| Ghost button | `btn-ghost` |
| Card | `card` |
| Dropdown menu | `dropdown` |
| Dropdown item | `dropdown-item` |
| Textarea | `textarea` |
| Badge (default) | `badge` |
| Badge (accent) | `badge-accent` |
| Section gap | `gap-section` or `gap-12` |
| Card padding | `p-card-pad` or `p-6` |
| Input padding | `p-input-pad` or `p-3` |
