import { useState, useRef, lazy, Suspense, useReducer, useCallback } from "react";
import { Sparkles, Copy, Check, RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TEMPLATES, type TemplateId, type EditorId } from "@/lib/constants";
import { streamEnhancePrompt } from "@/lib/stream";
import { TemplateSelector } from "@/components/TemplateSelector";
import { EditorSelector } from "@/components/EditorSelector";
import { InteractiveHoverButton } from "@/components/ui/interactive-hover-button";
import { TextShimmer } from "@/components/ui/text-shimmer";
import { toast } from "sonner";
import { useSearchParams } from 'react-router-dom';
import { useProjects } from '@/lib/contexts/ProjectsContext';
import { useOnboarding } from "@/hooks/useOnboarding";
import { OnboardingTooltip } from "@/components/ui/onboarding-tooltip";

const PromptOutput = lazy(() =>
  import("@/components/PromptOutput").then((m) => ({ default: m.PromptOutput }))
);

type TransformerState =
  | { status: "idle" }
  | { status: "typing" }
  | { status: "loading" }
  | { status: "success"; output: string }
  | { status: "error"; message: string }
  | { status: "copied"; output: string };

type TransformerAction =
  | { type: "INPUT_CHANGE" }
  | { type: "START_ENHANCE" }
  | { type: "STREAM_CHUNK"; chunk: string }
  | { type: "ENHANCE_SUCCESS"; output: string }
  | { type: "ENHANCE_ERROR"; error: string }
  | { type: "COPY_TO_CLIPBOARD" }
  | { type: "COPY_TIMEOUT" }
  | { type: "RESET" };

function transformerReducer(state: TransformerState, action: TransformerAction): TransformerState {
  switch (action.type) {
    case "INPUT_CHANGE":
      return state.status === "idle" ? { status: "typing" } : state;
    case "START_ENHANCE":
      return { status: "loading" };
    case "STREAM_CHUNK":
      if (state.status === "loading" || state.status === "success") {
        const newOutput = state.status === "success" ? state.output + action.chunk : action.chunk;
        return { status: "success", output: newOutput };
      }
      return state;
    case "ENHANCE_SUCCESS":
      return { status: "success", output: action.output };
    case "ENHANCE_ERROR":
      return { status: "error", message: action.error };
    case "COPY_TO_CLIPBOARD":
      if (state.status === "success") {
        return { status: "copied", output: state.output };
      }
      return state;
    case "COPY_TIMEOUT":
      if (state.status === "copied") {
        return { status: "success", output: state.output };
      }
      return state;
    case "RESET":
      return { status: "idle" };
    default:
      return state;
  }
}

function PromptOutputSkeleton() {
  return (
    <div className="space-y-2">
      <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
      <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
      <div className="h-4 bg-muted rounded animate-pulse w-5/6" />
    </div>
  );
}

const Index = () => {
  const [searchParams] = useSearchParams();
  const currentProjectId = searchParams.get('project') || "default";
  const { state, addPrompt } = useProjects();
  const currentProject = state.projects[currentProjectId];

  // Onboarding Hooks
  const { hasSeenEditorTooltip, hasSeenSaveTooltip, markEditorTooltipSeen } = useOnboarding();
  const [showEditorTooltip, setShowEditorTooltip] = useState(false);

  const [input, setInput] = useState("");
  const [template, setTemplate] = useState<TemplateId>("ui-frontend");
  const [editor, setEditor] = useState<EditorId>("claude-code");
  const [transformerState, dispatch] = useReducer(transformerReducer, { status: "idle" });
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isLoading = transformerState.status === "loading";
  const hasResult = transformerState.status === "success" || transformerState.status === "copied" || transformerState.status === "error";
  const output = (transformerState.status === "success" || transformerState.status === "copied") ? transformerState.output : "";
  const isCopied = transformerState.status === "copied";
  const errorMessage = transformerState.status === "error" ? transformerState.message : null;

  const handleInputChange = useCallback((value: string) => {
    const trimmed = value.slice(0, 1000);
    setInput(trimmed);

    if (trimmed.length > 0 && !hasSeenEditorTooltip) {
      setShowEditorTooltip(true);
    }

    if (trimmed.length > 0 && transformerState.status === "idle") {
      dispatch({ type: "INPUT_CHANGE" });
    }
  }, [transformerState.status, hasSeenEditorTooltip]);

  const handleEnhance = async () => {
    if (!input.trim() || isLoading) return;

    dispatch({ type: "START_ENHANCE" });

    let accumulated = "";

    const userPromptText = input.trim();
    const fullContextPrompt = currentProject?.systemInstructions
      ? `System Instructions:\n${currentProject.systemInstructions}\n\nTask:\n${userPromptText}`
      : userPromptText;

    // Approximate token limit check (100k tokens ~400k chars)
    // We'll be conservative and use 350,000 chars to leave room for system prompts
    if (fullContextPrompt.length > 350000) {
      toast.error("Context Too Large", {
        description: "Your project's system instructions and prompt combined are too large for the AI to process. Please reduce the text length.",
      });
      dispatch({ type: "RESET" });
      return;
    }

    await streamEnhancePrompt({
      userPrompt: fullContextPrompt,
      template,
      editor,
      onDelta: (chunk) => {
        accumulated += chunk;
        dispatch({ type: "STREAM_CHUNK", chunk });
      },
      onDone: () => {
        dispatch({ type: "ENHANCE_SUCCESS", output: accumulated });

        if (!hasSeenSaveTooltip) {
          window.dispatchEvent(new Event('vibe-prompt:success'));
        }

        addPrompt({
            projectId: currentProjectId,
            title: userPromptText.slice(0, 30) + (userPromptText.length > 30 ? '...' : ''),
            input: userPromptText,
            output: accumulated,
            templateId: template,
            editorId: editor,
            tags: [],
        });
      },
      onError: (error) => {
        dispatch({ type: "ENHANCE_ERROR", error });
        toast.error("Oops!", { description: error });
      },
    });
  };

  const handleCopy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      dispatch({ type: "COPY_TO_CLIPBOARD" });
      setTimeout(() => dispatch({ type: "COPY_TIMEOUT" }), 2000);
    } catch {
      toast.error("Couldn't copy", { description: "Please select and copy manually." });
    }
  };

  const handleReset = () => {
    setInput("");
    dispatch({ type: "RESET" });
    textareaRef.current?.focus();
  };

  const selectedTemplate = TEMPLATES.find((t) => t.id === template) ?? TEMPLATES[0];

  const buttonState = {
    idle: {
      disabled: !input.trim(),
      className: "bg-accent text-accent-foreground hover:brightness-110 shadow-accent-glow",
      icon: Sparkles,
      label: "Enhance My Prompt",
    },
    typing: {
      disabled: !input.trim(),
      className: "bg-accent text-accent-foreground hover:brightness-110 shadow-accent-glow",
      icon: Sparkles,
      label: "Enhance My Prompt",
    },
    loading: {
      disabled: true,
      className: "bg-accent/70 text-accent-foreground/70 cursor-wait",
      icon: null,
      label: "Enhancing...",
    },
    success: {
      disabled: false,
      className: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      icon: RotateCcw,
      label: "Start Over",
    },
    error: {
      disabled: false,
      className: "bg-accent text-accent-foreground hover:brightness-110 shadow-accent-glow",
      icon: Sparkles,
      label: "Try Again",
    },
    copied: {
      disabled: false,
      className: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      icon: RotateCcw,
      label: "Start Over",
    },
  }[transformerState.status];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Vibe Prompt Logo" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold tracking-tight text-foreground">
              Vibe<span className="text-gradient-primary">Prompt</span>
            </span>
          </div>
        </div>
      </header>

      <main className="container py-8 md:py-16">
        {/* Hero */}
        <div className="mx-auto max-w-2xl text-center mb-10 animate-fade-up">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
            Plain English in.{" "}
            <span className="text-gradient-primary">Perfect AI prompts</span> out.
          </h1>
          <p className="text-lg text-muted-foreground">
            Stop wasting hours on back-and-forth. Get structured prompts your AI editor actually understands.
          </p>
        </div>

        {/* Main Card */}
        <div className="mx-auto max-w-2xl">
          <div className="surface-raised rounded-2xl border border-border/60 p-6 md:p-8 animate-scale-in">
            {/* Input */}
            <div className="mb-5">
              <label htmlFor="prompt-input" className="block text-sm font-semibold text-foreground mb-2">
                Describe what you want to build
              </label>
              <textarea
                ref={textareaRef}
                id="prompt-input"
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, 1000))}
                placeholder={selectedTemplate.example}
                rows={4}
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary transition-all resize-none text-sm md:text-base"
                disabled={isLoading}
              />
              <div className="flex justify-end mt-1">
                <span className="text-xs text-muted-foreground">{input.length}/1000</span>
              </div>
            </div>

            {/* Selectors Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              <TemplateSelector value={template} onChange={setTemplate} />
              <EditorSelector value={editor} onChange={setEditor} />
            </div>

            {/* Action Button */}
            <div className="flex justify-center mt-4 w-full relative">
              <OnboardingTooltip
                isOpen={showEditorTooltip}
                onClose={() => {
                  setShowEditorTooltip(false);
                  markEditorTooltipSeen();
                }}
                position="top"
                title="Ready to perfect it?"
              >
                Click here when you're done typing to let AI structure and polish your prompt.
              </OnboardingTooltip>
              <InteractiveHoverButton
                onClick={hasResult ? handleReset : handleEnhance}
                disabled={buttonState.disabled}
                className={`w-full h-12 text-base font-semibold transition-all duration-200 ${
                  buttonState.className.includes("bg-accent")
                    ? "border-accent/30 text-accent bg-accent/5 hover:border-accent"
                    : "border-secondary text-secondary-foreground bg-secondary/50"
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                    <TextShimmer duration={1.2} className="text-base font-semibold">
                      {buttonState.label}
                    </TextShimmer>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    {buttonState.icon && <buttonState.icon className="h-4 w-4" />}
                    {buttonState.label}
                  </span>
                )}
              </InteractiveHoverButton>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 animate-fade-up">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <p className="text-sm">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Result */}
          {hasResult && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-up" style={{ animationDelay: "100ms" }}>
              {/* Before */}
              <div className="rounded-xl border border-border bg-background p-5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Your Input
                </h3>
                <p className="text-sm text-foreground whitespace-pre-wrap">{input}</p>
              </div>

              {/* After */}
              <div className="rounded-xl border border-primary/20 bg-background p-5 relative">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">
                    Enhanced Prompt
                  </h3>
                  {output && !isLoading && (
                    <button
                      onClick={handleCopy}
                      className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md transition-colors ${
                        isCopied
                          ? "text-green-600 bg-green-50"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                      aria-label="Copy enhanced prompt"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-accent" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
                <Suspense fallback={<PromptOutputSkeleton />}>
                  <PromptOutput text={output} isStreaming={isLoading} />
                </Suspense>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16">
        <div className="container py-6 text-center">
          <p className="text-sm text-muted-foreground">
            Free forever. No sign-up required. Built for vibe coders. ✨
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
