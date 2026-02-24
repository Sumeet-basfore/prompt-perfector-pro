import { useState, useRef } from "react";
import { Sparkles, Copy, Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TEMPLATES, EDITORS, type TemplateId, type EditorId } from "@/lib/constants";
import { streamEnhancePrompt } from "@/lib/stream";
import { TemplateSelector } from "@/components/TemplateSelector";
import { EditorSelector } from "@/components/EditorSelector";
import { PromptOutput } from "@/components/PromptOutput";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [input, setInput] = useState("");
  const [template, setTemplate] = useState<TemplateId>("ui-frontend");
  const [editor, setEditor] = useState<EditorId>("claude-code");
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const handleEnhance = async () => {
    if (!input.trim() || isLoading) return;

    setIsLoading(true);
    setOutput("");
    setHasResult(true);

    let accumulated = "";

    await streamEnhancePrompt({
      userPrompt: input.trim(),
      template,
      editor,
      onDelta: (chunk) => {
        accumulated += chunk;
        setOutput(accumulated);
      },
      onDone: () => {
        setIsLoading(false);
      },
      onError: (error) => {
        setIsLoading(false);
        setHasResult(false);
        toast({
          title: "Oops!",
          description: error,
          variant: "destructive",
        });
      },
    });
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Couldn't copy", description: "Please select and copy manually.", variant: "destructive" });
    }
  };

  const handleReset = () => {
    setInput("");
    setOutput("");
    setHasResult(false);
    setIsLoading(false);
    textareaRef.current?.focus();
  };

  const selectedTemplate = TEMPLATES.find((t) => t.id === template)!;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
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
            <Button
              onClick={hasResult ? handleReset : handleEnhance}
              disabled={!hasResult && (!input.trim() || isLoading)}
              className={`w-full h-12 rounded-xl text-base font-semibold transition-all duration-200 ${
                hasResult
                  ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  : "bg-accent text-accent-foreground hover:brightness-110 shadow-accent-glow"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                  Enhancing…
                </span>
              ) : hasResult ? (
                <span className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Start Over
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Enhance My Prompt
                </span>
              )}
            </Button>
          </div>

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
                      className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-secondary"
                      aria-label="Copy enhanced prompt"
                    >
                      {copied ? (
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
                <PromptOutput text={output} isStreaming={isLoading} />
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
