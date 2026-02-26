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
