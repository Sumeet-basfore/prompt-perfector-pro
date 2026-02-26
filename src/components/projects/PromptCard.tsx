import React, { useState } from 'react';
import { Settings, Search, Plus, Copy, Check, Edit2, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useProjects } from '@/lib/contexts/ProjectsContext';
import { PromptItem } from '@/lib/types/projects';
import { toast } from 'sonner';

interface PromptCardProps {
  prompt: PromptItem;
}

export const PromptCard: React.FC<PromptCardProps> = ({ prompt }) => {
  const { updatePrompt } = useProjects();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(prompt.input);
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.output || prompt.input);
    setIsCopied(true);
    toast.success('Enhanced prompt copied to clipboard');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setEditValue(prompt.input);
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (!editValue.trim()) {
      toast.error('Prompt content cannot be empty');
      return;
    }

    updatePrompt(prompt.id, { input: editValue });
    setIsEditing(false);
    toast.success('Prompt updated successfully');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancelEdit();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSaveEdit();
    }
  };

  const isEdited = prompt.updatedAt > prompt.createdAt + 1000;

  if (isEditing) {
    return (
      <div className="surface-raised p-4 rounded-xl border border-primary/50 flex flex-col h-48 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-foreground truncate">{prompt.title || 'Untitled Prompt'}</h3>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 text-green-600 hover:text-green-700 hover:bg-green-100/50" onClick={handleSaveEdit} title="Save (Ctrl+Enter)">
              <CheckCircle2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={handleCancelEdit} title="Cancel (Esc)">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Textarea
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          autoFocus
          className="flex-1 resize-none border-none p-0 focus-visible:ring-0 text-sm text-foreground bg-transparent"
        />
        <div className="flex justify-between items-center text-xs text-muted-foreground mt-2">
          <span>Press {navigator.platform.includes('Mac') ? 'Cmd' : 'Ctrl'} + Enter to save</span>
        </div>
      </div>
    );
  }

  return (
    <div className="surface-raised p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-colors group flex flex-col h-48 relative">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-foreground truncate pr-6">{prompt.title || 'Untitled Prompt'}</h3>
        <div className="absolute right-3 top-3 flex gap-1 bg-background/80 backdrop-blur-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-sm" onClick={handleCopy} aria-label="Copy prompt">
            {isCopied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 rounded-sm" onClick={handleEdit} aria-label="Edit prompt">
            <Edit2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1 whitespace-pre-wrap">
        {prompt.input}
      </p>
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
        <div className="flex items-center gap-2">
          <span>{new Date(prompt.updatedAt).toLocaleDateString()}</span>
          {isEdited && <span className="bg-secondary px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider">Edited</span>}
        </div>
      </div>
    </div>
  );
};
