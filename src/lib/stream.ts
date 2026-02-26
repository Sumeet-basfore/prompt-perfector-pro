const TEMPLATE_CONTEXT: Record<string, string> = {
  "ui-frontend":
    "Focus on component architecture, responsive design, accessibility (WCAG AA), loading/error/empty states, animations, mobile layout, color contrast, and semantic HTML.",
  "database-design":
    "Focus on table relationships, indexing strategy, data types, constraints, migrations, seed data, normalization vs denormalization tradeoffs, and query performance.",
  authentication:
    "Focus on auth flows (signup, login, password reset, email verification), session management, role-based access control, protected routes, token handling, and security best practices.",
  "api-backend":
    "Focus on endpoint design, request/response schemas, error handling, validation, rate limiting, middleware, authentication integration, and RESTful conventions.",
  "error-debugging":
    "Focus on error identification, stack trace analysis, edge case handling, logging strategy, error boundaries, fallback UI, retry logic, and graceful degradation.",
  "deployment-devops":
    "Focus on CI/CD pipeline, environment variables, build optimization, hosting configuration, domain setup, SSL, monitoring, and rollback strategy.",
  "performance-optimization":
    "Focus on bundle size, lazy loading, caching strategy, database query optimization, image optimization, Core Web Vitals (LCP, CLS, INP), and profiling.",
  "feature-addition":
    "Focus on integrating with existing codebase, maintaining code style consistency, backward compatibility, migration path, feature flags, and testing strategy.",
};

const EDITOR_INSTRUCTIONS: Record<string, string> = {
  "cursor":
    "Format for Cursor AI: Use @-mention style references for files (@filename), be explicit about file paths, use concise instructions with clear action verbs, and structure with numbered steps.",
  "claude-code":
    "Format for Claude Code: Use markdown structure with headers and code blocks, specify exact file paths, include explicit file references, provide context about the project structure, and be thorough with edge cases.",
  "windsurf":
    "Format for Windsurf (Codeium): Focus on desired outcomes rather than implementation details, describe the end state clearly, use natural language descriptions, and specify acceptance criteria.",
  "gemini-cli":
    "Format for Gemini CLI: Use clear, structured instructions with explicit commands, specify file operations directly, use markdown formatting, and include expected outputs.",
  "bolt":
    "Format for Bolt.new: Describe the full feature in a single comprehensive prompt, include UI layout descriptions, specify tech stack preferences, mention responsive design requirements, and describe the complete user flow.",
  "lovable":
    "Format for Lovable: Describe features conversationally, specify design preferences and color schemes, mention responsive behavior, include user stories, and describe the desired look and feel.",
  "opencode":
    "Format for OpenCode: Use clear markdown structure, specify file paths explicitly, include step-by-step instructions, focus on code-level details, and provide context about the existing codebase.",
  "codex":
    "Format for Codex CLI: Be concise and direct, use imperative instructions, specify exact file changes needed, include expected behavior descriptions, and mention test cases.",
  "antigravity":
    "Format for Antigravity: Use structured natural language, describe the desired outcome clearly, include UI/UX details, specify responsive behavior, and mention integration requirements.",
};

export async function streamEnhancePrompt({
  userPrompt,
  template,
  editor,
  onDelta,
  onDone,
  onError,
}: {
  userPrompt: string;
  template: string;
  editor: string;
  onDelta: (text: string) => void;
  onDone: () => void;
  onError: (error: string) => void;
}) {
  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    onError("VITE_GEMINI_API_KEY is not configured in your .env.local file.");
    return;
  }

  const templateContext = TEMPLATE_CONTEXT[template] || "";
  const editorInstructions = EDITOR_INSTRUCTIONS[editor] || "";

  const systemPrompt = `You are an expert AI prompt engineer specializing in "vibe coding" — helping non-technical builders write perfect prompts for AI code editors.

Your job: Take the user's plain-English description and transform it into a structured, comprehensive prompt using the SPEC format:

**S — Situation**: Set the context (tech stack, project state, role of the AI)
**P — Purpose**: Define what needs to be built and why
**E — Explicit Constraints**: List specific requirements, edge cases, error states, responsive behavior, accessibility needs
**C — Checklist**: Provide a verification checklist the AI should confirm before finishing

Rules:
- Output ONLY the enhanced prompt — no meta-commentary, no "here's your prompt", no wrapper text
- Be specific and actionable — don't be vague
- Include edge cases the user likely forgot (loading states, error handling, empty states, mobile)
- Keep the user's intent front and center — don't over-engineer or add unnecessary complexity
- Aim for 200-500 words — comprehensive but not overwhelming
- Use the user's language style — if they're casual, stay approachable
${templateContext ? `\nTemplate context (${template}): ${templateContext}` : ""}
${editorInstructions ? `\n${editorInstructions}` : ""}`;

  const payload = {
    system_instruction: {
      parts: { text: systemPrompt },
    },
    contents: [
      {
        parts: [{ text: userPrompt }],
      },
    ],
  };

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`;

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const data = await resp.json().catch(() => ({ error: { message: "Something went wrong" } }));
      onError(data.error?.message || `Error ${resp.status}`);
      return;
    }

    if (!resp.body) {
      onError("No response body");
      return;
    }

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let textBuffer = "";
    let streamDone = false;

    while (!streamDone) {
      const { done, value } = await reader.read();
      if (done) break;
      textBuffer += decoder.decode(value, { stream: true });

      let newlineIndex: number;
      while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
        let line = textBuffer.slice(0, newlineIndex);
        textBuffer = textBuffer.slice(newlineIndex + 1);

        if (line.endsWith("\r")) line = line.slice(0, -1);
        if (line.startsWith(":") || line.trim() === "") continue;
        if (!line.startsWith("data: ")) continue;

        const jsonStr = line.slice(6).trim();
        if (jsonStr === "[DONE]") {
          streamDone = true;
          break;
        }

        try {
          const parsed = JSON.parse(jsonStr);
          const candidates = parsed.candidates || [];
          if (candidates.length > 0) {
            const parts = candidates[0].content?.parts || [];
            for (const part of parts) {
              if (part.text) {
                onDelta(part.text);
              }
            }
          }
        } catch {
          // If JSON parse fails, put line back in buffer and wait for more data
          textBuffer = line + "\n" + textBuffer;
          break;
        }
      }
    }

    onDone();
  } catch (e) {
    console.error("Stream error:", e);
    onError("Connection failed. Please check your internet or API key.");
  }
}
