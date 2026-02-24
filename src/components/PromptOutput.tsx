interface Props {
  text: string;
  isStreaming: boolean;
}

export function PromptOutput({ text, isStreaming }: Props) {
  if (!text && isStreaming) {
    return (
      <div className="space-y-2">
        <div className="h-3 rounded animate-shimmer w-full" />
        <div className="h-3 rounded animate-shimmer w-5/6" />
        <div className="h-3 rounded animate-shimmer w-4/6" />
      </div>
    );
  }

  return (
    <div className={`text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed ${isStreaming ? "animate-cursor" : ""}`}>
      {text}
    </div>
  );
}
