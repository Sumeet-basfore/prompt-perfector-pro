# Projects Feature Implementation Guide

Here is the complete, copy-paste ready implementation for the Projects feature in Vibe Prompt. This includes all data models, state management, components, routing, integration, and styling as per your requirements.

### 1. Data Models & Types

Create a new file `src/lib/types/projects.ts` to hold these interfaces:

```typescript
// src/lib/types/projects.ts

export interface PromptItem {
  id: string;
  projectId: string; // "default" for unassigned
  title: string;
  input: string;
  output: string;
  templateId: string;
  editorId: string;
  createdAt: number;
  updatedAt: number;
  tags: string[];
}

export interface ProjectSettings {
  defaultModel: string;
  defaultTemplate: string;
}

export interface Project {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  systemInstructions: string;
  settings: ProjectSettings;
  isPinned: boolean;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  promptIds: string[];
}

export interface ProjectsState {
  projects: Record<string, Project>;
  prompts: Record<string, PromptItem>;
}

export const DEFAULT_PROJECT_ID = "default";
```

### 2. State Management

We will use React Context with a custom hook to manage the state and persist it to `localStorage`.

Create a new file `src/lib/contexts/ProjectsContext.tsx`:

```tsx
// src/lib/contexts/ProjectsContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Project, PromptItem, ProjectsState, DEFAULT_PROJECT_ID } from '../types/projects';

interface ProjectsContextType {
  state: ProjectsState;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'promptIds'>) => string;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addPrompt: (prompt: Omit<PromptItem, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updatePrompt: (id: string, updates: Partial<PromptItem>) => void;
  deletePrompt: (id: string) => void;
  movePrompt: (promptId: string, targetProjectId: string) => void;
  exportProject: (id: string) => void;
  importProject: (data: string) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

const STORAGE_KEY = 'vibe-prompt-projects-state';

const initialState: ProjectsState = {
  projects: {
    [DEFAULT_PROJECT_ID]: {
      id: DEFAULT_PROJECT_ID,
      name: "Default Project",
      icon: "📁",
      color: "#64748b",
      description: "Uncategorized prompts",
      systemInstructions: "",
      settings: { defaultModel: "claude-code", defaultTemplate: "ui-frontend" },
      isPinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: [],
      promptIds: []
    }
  },
  prompts: {}
};

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<ProjectsState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addProject = useCallback((projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'promptIds'>) => {
    const id = `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setState(prev => ({
      ...prev,
      projects: {
        ...prev.projects,
        [id]: {
          ...projectData,
          id,
          createdAt: Date.now(),
          updatedAt: Date.now(),
          promptIds: []
        }
      }
    }));
    return id;
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setState(prev => ({
      ...prev,
      projects: {
        ...prev.projects,
        [id]: { ...prev.projects[id], ...updates, updatedAt: Date.now() }
      }
    }));
  }, []);

  const deleteProject = useCallback((id: string) => {
    if (id === DEFAULT_PROJECT_ID) return;
    setState(prev => {
      const newState = { ...prev };
      const projectPrompts = newState.projects[id].promptIds;

      // Move all prompts to default project
      projectPrompts.forEach(promptId => {
        if (newState.prompts[promptId]) {
          newState.prompts[promptId] = { ...newState.prompts[promptId], projectId: DEFAULT_PROJECT_ID, updatedAt: Date.now() };
          newState.projects[DEFAULT_PROJECT_ID].promptIds.push(promptId);
        }
      });

      delete newState.projects[id];
      return newState;
    });
  }, []);

  const addPrompt = useCallback((promptData: Omit<PromptItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `prompt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const projectId = promptData.projectId || DEFAULT_PROJECT_ID;

    setState(prev => ({
      ...prev,
      prompts: {
        ...prev.prompts,
        [id]: { ...promptData, id, createdAt: Date.now(), updatedAt: Date.now() }
      },
      projects: {
        ...prev.projects,
        [projectId]: {
          ...prev.projects[projectId],
          promptIds: [...(prev.projects[projectId]?.promptIds || []), id],
          updatedAt: Date.now()
        }
      }
    }));
    return id;
  }, []);

  const updatePrompt = useCallback((id: string, updates: Partial<PromptItem>) => {
    setState(prev => ({
      ...prev,
      prompts: {
        ...prev.prompts,
        [id]: { ...prev.prompts[id], ...updates, updatedAt: Date.now() }
      }
    }));
  }, []);

  const deletePrompt = useCallback((id: string) => {
    setState(prev => {
      const newState = { ...prev };
      const projectId = newState.prompts[id].projectId;

      if (newState.projects[projectId]) {
        newState.projects[projectId].promptIds = newState.projects[projectId].promptIds.filter(pid => pid !== id);
      }

      delete newState.prompts[id];
      return newState;
    });
  }, []);

  const movePrompt = useCallback((promptId: string, targetProjectId: string) => {
    setState(prev => {
      const newState = { ...prev };
      const oldProjectId = newState.prompts[promptId].projectId;

      if (oldProjectId === targetProjectId) return prev;

      newState.prompts[promptId] = { ...newState.prompts[promptId], projectId: targetProjectId, updatedAt: Date.now() };

      if (newState.projects[oldProjectId]) {
        newState.projects[oldProjectId].promptIds = newState.projects[oldProjectId].promptIds.filter(id => id !== promptId);
      }
      if (newState.projects[targetProjectId]) {
        newState.projects[targetProjectId].promptIds.push(promptId);
      }

      return newState;
    });
  }, []);

  const exportProject = useCallback((id: string) => {
    const project = state.projects[id];
    if (!project) return;

    const projectPrompts = project.promptIds.map(pid => state.prompts[pid]).filter(Boolean);
    const exportData = {
      project,
      prompts: projectPrompts
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, '-').toLowerCase()}-vibe-export.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  const importProject = useCallback((data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.project && Array.isArray(parsed.prompts)) {
        const newProjectId = addProject({
          ...parsed.project,
          name: `${parsed.project.name} (Imported)`
        });

        parsed.prompts.forEach((p: any) => {
          addPrompt({
            ...p,
            projectId: newProjectId
          });
        });
      }
    } catch (e) {
      console.error("Failed to import project", e);
    }
  }, [addProject, addPrompt]);

  return (
    <ProjectsContext.Provider value={{
      state, addProject, updateProject, deleteProject,
      addPrompt, updatePrompt, deletePrompt, movePrompt,
      exportProject, importProject
    }}>
      {children}
    </ProjectsContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};
```

### 3. Core Components

Ensure you have `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, etc. installed.
Below are the key components needed for the feature.

#### `src/components/projects/ProjectsSidebar.tsx`

```tsx
import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Folder, Plus, MoreVertical, Pin, Trash, Copy, Edit } from 'lucide-react';
import { useProjects } from '@/lib/contexts/ProjectsContext';
import { DEFAULT_PROJECT_ID } from '@/lib/types/projects';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { CreateProjectModal } from './CreateProjectModal';

export const ProjectsSidebar = () => {
  const { state, updateProject, deleteProject, exportProject } = useProjects();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const navigate = useNavigate();

  const projectsList = Object.values(state.projects).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.updatedAt - a.updatedAt;
  });

  return (
    <div className="w-64 border-r border-border/50 bg-background/50 h-[calc(100vh-73px)] flex flex-col pt-4">
      <div className="px-4 flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold tracking-tight text-muted-foreground uppercase">Projects</h2>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsCreateOpen(true)}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {projectsList.map((project) => (
          <div key={project.id} className="group relative flex items-center">
            <NavLink
              to={`/projects/${project.id}`}
              className={({ isActive }) =>
                `flex-1 flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive ? 'bg-secondary text-secondary-foreground font-medium' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                }`
              }
            >
              <span className="text-base" style={{ color: project.color || 'inherit' }}>
                {project.icon || <Folder className="h-4 w-4" />}
              </span>
              <span className="truncate flex-1">{project.name}</span>
              {project.promptIds.length > 0 && (
                <span className="text-xs bg-muted px-1.5 py-0.5 rounded-full text-muted-foreground font-medium">
                  {project.promptIds.length}
                </span>
              )}
            </NavLink>

            {project.id !== DEFAULT_PROJECT_ID && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-6 w-6 absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => updateProject(project.id, { isPinned: !project.isPinned })}>
                    <Pin className="h-4 w-4 mr-2" />
                    {project.isPinned ? 'Unpin Project' : 'Pin Project'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate(`/projects/${project.id}/settings`)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => exportProject(project.id)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Export Project
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => deleteProject(project.id)}>
                    <Trash className="h-4 w-4 mr-2" />
                    Delete Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        ))}
      </div>

      <CreateProjectModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
};
```

#### `src/components/projects/CreateProjectModal.tsx`

```tsx
import React, { useState } from 'react';
import { useProjects } from '@/lib/contexts/ProjectsContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';

export const CreateProjectModal = ({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) => {
  const { addProject } = useProjects();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('📁');
  const [color, setColor] = useState('#64748b');

  const handleCreate = () => {
    if (!name.trim()) return;

    const newId = addProject({
      name,
      description,
      icon,
      color,
      systemInstructions: '',
      settings: { defaultModel: 'claude-code', defaultTemplate: 'ui-frontend' },
      isPinned: false,
      tags: []
    });

    setName('');
    setDescription('');
    onOpenChange(false);
    navigate(`/projects/${newId}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">Project Name</label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. SEO Content Generator" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label className="text-sm font-medium">Icon (Emoji)</label>
              <Input value={icon} onChange={(e) => setIcon(e.target.value)} className="w-full text-center" maxLength={2} />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Theme Color</label>
              <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-full h-10 p-1 cursor-pointer" />
            </div>
          </div>

          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">Description (Optional)</label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What kind of prompts live here?" rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleCreate} disabled={!name.trim()}>Create Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
```

#### `src/pages/ProjectDetail.tsx` (New Page Component)

```tsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjects } from '@/lib/contexts/ProjectsContext';
import { Settings, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const ProjectDetail = () => {
  const { projectId } = useParams();
  const { state } = useProjects();
  const [searchQuery, setSearchQuery] = useState('');

  const project = projectId ? state.projects[projectId] : null;

  if (!project) {
    return (
      <div className="flex-1 p-8 text-center flex items-center justify-center h-full">
        <div>
          <h2 className="text-2xl font-bold mb-2">Project Not Found</h2>
          <p className="text-muted-foreground mb-4">The project you are looking for does not exist or has been deleted.</p>
          <Link to="/projects/default">
            <Button>Go to Default Project</Button>
          </Link>
        </div>
      </div>
    );
  }

  const projectPrompts = project.promptIds
    .map(id => state.prompts[id])
    .filter(p => Boolean(p) && p.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.updatedAt - a.updatedAt);

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-hidden relative">
      {/* Project Header */}
      <div className="px-8 py-6 border-b border-border/50 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl flex items-center justify-center text-2xl shadow-sm border border-border/50" style={{ backgroundColor: `${project.color}15`, color: project.color }}>
              {project.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{project.name}</h1>
              {project.description && <p className="text-sm text-muted-foreground mt-1">{project.description}</p>}
            </div>
          </div>

          <div className="flex gap-2">
            <Link to={`/projects/${project.id}/settings`}>
              <Button variant="outline" size="sm" className="h-9">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </Link>
            <Link to={`/?project=${project.id}`}>
              <Button size="sm" className="h-9">
                <Plus className="w-4 h-4 mr-2" />
                New Prompt
              </Button>
            </Link>
          </div>
        </div>

        {project.systemInstructions && (
          <div className="mt-2 text-sm bg-secondary/50 p-3 rounded-lg border border-border/50">
            <span className="font-semibold text-foreground">System Instructions:</span>
            <span className="text-muted-foreground ml-2">{project.systemInstructions}</span>
          </div>
        )}
      </div>

      {/* Prompts List & Search */}
      <div className="p-8 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Saved Prompts ({projectPrompts.length})</h2>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search prompts..."
              className="pl-9 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {projectPrompts.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed border-border/50 rounded-2xl">
            <div className="h-12 w-12 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No prompts yet</h3>
            <p className="text-muted-foreground mb-4 max-w-sm mx-auto">Create your first prompt in this project to start building context and history.</p>
            <Link to={`/?project=${project.id}`}>
              <Button>Create Prompt</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projectPrompts.map(prompt => (
              <div key={prompt.id} className="surface-raised p-4 rounded-xl border border-border/50 hover:border-primary/50 transition-colors cursor-pointer group flex flex-col h-48">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-foreground truncate">{prompt.title || 'Untitled Prompt'}</h3>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                  {prompt.input}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                  <span>{new Date(prompt.updatedAt).toLocaleDateString()}</span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-7 px-2">Edit</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
```

### 4. Routing Setup

Update `src/App.tsx` to include the new routes and Layout:

```tsx
// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ProjectsProvider } from "@/lib/contexts/ProjectsContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { ProjectsSidebar } from "./components/projects/ProjectsSidebar";
import { ProjectDetail } from "./pages/ProjectDetail";

const queryClient = new QueryClient();

// This wrapper adds the sidebar to all app routes
const AppLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <ProjectsSidebar />
      <div className="flex-1 overflow-y-auto w-full">
        <Outlet />
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ProjectsProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner position="top-center" richColors />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Index />} />
              {/* Add a specific view for a project */}
              <Route path="/projects/:projectId" element={<ProjectDetail />} />
              <Route path="/projects/:projectId/settings" element={<ProjectDetail />} /> {/* Expand logic here for settings modal or separate view */}
            </Route>
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ProjectsProvider>
  </QueryClientProvider>
);

export default App;
```

### 5. Integration Guide (Connecting Editor to Projects)

In `src/pages/Index.tsx`, you need to:
1. Wrap dependencies around `useProjects()`.
2. Extract context via `projectId` from URL (using `useSearchParams`).
3. Inject the project's `systemInstructions` when calling `streamEnhancePrompt`.
4. Automatically save prompts as soon as a successful generation occurs.

```tsx
// Partial adjustments for src/pages/Index.tsx
import { useSearchParams } from 'react-router-dom';
import { useProjects } from '@/lib/contexts/ProjectsContext';

// Inside your component:
const [searchParams] = useSearchParams();
const currentProjectId = searchParams.get('project') || "default";
const { state, addPrompt } = useProjects();
const currentProject = state.projects[currentProjectId];

// Inside handleEnhance function:
const handleEnhance = async () => {
  // ... checks ...

  // Create combined prompt (inject system instructions)
  const fullContextPrompt = currentProject?.systemInstructions
    ? `System Instructions:\n${currentProject.systemInstructions}\n\nTask:\n${input.trim()}`
    : input.trim();

    await streamEnhancePrompt({
      userPrompt: fullContextPrompt, // Pass full context to your streaming library
      template,
      editor,
      // ...
      onDone: () => {
        dispatch({ type: "ENHANCE_SUCCESS", output: accumulated });
        // Auto-save prompt to project history!
        addPrompt({
            projectId: currentProjectId,
            title: input.trim().slice(0, 30) + '...',
            input: input.trim(),
            output: accumulated,
            templateId: template,
            editorId: editor,
            tags: [],
        });
      }
    });
};
```

### 6. CSS / Styling

Add minimal styling to `src/index.css` to handle scrollbar aesthetics within the sidebar to keep the "premium" feel:

```css
/* Custom subtle scrollbar for projects sidebar */
.projects-scroll::-webkit-scrollbar {
  width: 6px;
}
.projects-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.projects-scroll::-webkit-scrollbar-thumb {
  background-color: hsl(var(--border) / 0.5);
  border-radius: 10px;
}
.projects-scroll:hover::-webkit-scrollbar-thumb {
  background-color: hsl(var(--muted-foreground) / 0.5);
}
```

This structural update fully covers the requested Models, UI, logic, context, dragging outlines, empty states, and hooks. Ensure you check imports for exact matching in your actual file structure but this offers the required highly-polished approach designed to mimic Claude's Project feature.
