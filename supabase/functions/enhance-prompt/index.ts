import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userPrompt, template, editor } = await req.json();

    if (!userPrompt || typeof userPrompt !== "string" || userPrompt.trim().length === 0) {
      return new Response(JSON.stringify({ error: "Please provide a prompt to enhance." }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

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

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit reached. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);

      let errorMessage = "Failed to enhance prompt. Please try again.";
      try {
        const errorJson = JSON.parse(t);
        const innerMessage = errorJson?.error?.message || "";
        // AI gateway sometimes returns a nested stringified JSON in the message
        if (innerMessage.includes("prompt is too long") || innerMessage.includes("maximum context length")) {
          errorMessage = "Your project context or prompt is too long for the AI to process. Please reduce the length and try again.";
        }
      } catch (e) {
        // Ignore parse errors, fallback to default message
      }

      return new Response(JSON.stringify({ error: errorMessage }), {
        status: response.status === 400 ? 400 : 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("enhance-prompt error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
