# Code Patterns — Vibe Prompt

## The System Prompt (Most Important Code in the App)

This function is the core of Vibe Prompt. Give Lovable the exact code below.

```javascript
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

---

## Category Context Function

```javascript
const getCategoryContext = (category) => {
  const contexts = {
    "UI & Frontend": 
      "Remind about: responsive layout (mobile-first), accessibility (ARIA labels, color contrast), loading states, error states, design system consistency.",
    
    "Database Design": 
      "Remind about: foreign key constraints, indexes on queried columns, ON DELETE behavior, explain all relationships, data types.",
    
    "Authentication": 
      "Remind about: OAuth flow, session management, CSRF protection, error handling for failed auth, user profile creation on first login.",
    
    "API & Backend Logic": 
      "Remind about: input validation, rate limiting, error response format, logging, idempotency for mutations.",
    
    "Error Handling & Debugging": 
      "Remind about: the exact error message, likely causes in order of probability, defensive fix to prevent recurrence, how to verify the fix.",
    
    "Deployment & DevOps": 
      "Remind about: environment variables, rollback plan, health check endpoint, zero-downtime deployment.",
    
    "Performance Optimization": 
      "Remind about: Core Web Vitals targets (LCP <2.5s, FID <100ms, CLS <0.1), caching strategy, what NOT to break in the process.",
    
    "Feature Addition to Existing Code": 
      "Remind about: analyzing existing patterns before adding, not breaking current behavior, localStorage persistence if needed, backward compatibility."
  };
  return contexts[category] || "Apply general best practices for the user's request.";
};
```

---

## API Call Logic

### Gemini (Primary) → Groq (Fallback)

```javascript
const enhancePrompt = async (userInput, templateCategory, aiEditor) => {
  const systemPrompt = buildSystemPrompt(templateCategory, aiEditor);
  
  // Try Gemini first
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: systemPrompt + "\n\nUser Input: " + userInput }]
          }]
        })
      }
    );
    
    if (response.status === 429 || response.status === 503) {
      throw new Error('RATE_LIMIT');
    }
    
    const data = await response.json();
    await logApiEvent('gemini', true, null); // Log success to Supabase
    return { text: data.candidates[0].content.parts[0].text, model: 'gemini' };
    
  } catch (error) {
    // Fallback to Groq
    if (error.message === 'RATE_LIMIT' || error.name === 'TypeError') {
      try {
        const groqResponse = await fetch(
          'https://api.groq.com/openai/v1/chat/completions',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
            },
            body: JSON.stringify({
              model: 'llama-3.3-70b-versatile',
              messages: [{ role: 'user', content: systemPrompt + "\n\nUser Input: " + userInput }]
            })
          }
        );
        
        const groqData = await groqResponse.json();
        await logApiEvent('groq', true, null); // Log fallback to Supabase
        return { text: groqData.choices[0].message.content, model: 'groq' };
        
      } catch (groqError) {
        await logApiEvent('groq', false, 500);
        return { error: "Our AI is taking a quick break — try again in 60 seconds 🌿" };
      }
    }
  }
};
```

---

## Copy Button Behavior

```javascript
const handleCopy = async (outputText) => {
  try {
    await navigator.clipboard.writeText(outputText);
    setCopyState('copied'); // Change button to "✓ Copied!" + green
    
    // Track copy event in Supabase
    await supabase.from('transformations').update({ was_copied: true }).eq('id', currentTransformationId);
    
    setTimeout(() => setCopyState('idle'), 2000); // Revert after 2 seconds
    
  } catch (err) {
    // Mobile Safari fallback — select the text
    const el = document.getElementById('output-text');
    const range = document.createRange();
    range.selectNodeContents(el);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    setCopyState('selected'); // Show "Text selected — long press to copy"
  }
};
```

---

## Supabase Event Logging

```javascript
// Log each API call (for monitoring Gemini → Groq fallback frequency)
const logApiEvent = async (model, success, errorCode) => {
  await supabase.from('api_events').insert({
    model_attempted: model,
    success: success,
    error_code: errorCode
  });
};

// Log transformation (no PII — character counts only)
const logTransformation = async (input, output, templateCategory, aiEditor, modelUsed) => {
  const { data } = await supabase.from('transformations').insert({
    template_category: templateCategory,
    ai_editor: aiEditor,
    model_used: modelUsed,
    input_length: input.length,
    output_length: output.length
  }).select('id');
  
  return data[0].id; // Store this to update was_copied later
};
```

---

## localStorage Persistence

```javascript
// On load: restore last selected editor
const savedEditor = localStorage.getItem('vibePrompt_lastEditor') || 'Claude Code';

// On editor change: save selection
const handleEditorChange = (editor) => {
  setSelectedEditor(editor);
  localStorage.setItem('vibePrompt_lastEditor', editor);
};
```

---

## Template Helper Text (Show Below Dropdown on Selection)

```javascript
const categoryHelperText = {
  "UI & Frontend": "Builds forms, layouts, and components with accessibility and responsive design baked in",
  "Database Design": "Creates schemas with proper relationships, constraints, and indexes",
  "Authentication": "Handles login, OAuth, sessions, and security edge cases",
  "API & Backend Logic": "Structures endpoints with validation, rate limiting, and error handling",
  "Error Handling & Debugging": "Turns your error message into a structured debugging plan",
  "Deployment & DevOps": "Configures CI/CD, environment variables, and deployment pipelines",
  "Performance Optimization": "Targets load time, Core Web Vitals, and database query speed",
  "Feature Addition to Existing Code": "Adds new features without breaking what's already built"
};
```

---

## Rotating Example Cards (Pre-fill before user types)

Show 3 hardcoded before/after examples that rotate every 5 seconds. They disappear once the user starts typing.

```
Example 1 — UI & Frontend
Before: "add a login page"
After: "You are a senior React developer working on a web application. ## Situation..."

Example 2 — Authentication  
Before: "make my dashboard show team tasks"
After: "You are a senior React developer. ## Situation: A dashboard component needs..."

Example 3 — Error Handling
Before: "my API call keeps failing with 500 error"  
After: "You are debugging a server-side error. ## Situation: An API endpoint is returning..."
```
