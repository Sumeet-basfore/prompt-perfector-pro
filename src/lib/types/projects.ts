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
