import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProjects } from '@/lib/contexts/ProjectsContext';
import { Settings, Search, Plus, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PromptCard } from '@/components/projects/PromptCard';
import { MovingBorderButton } from '@/components/ui/moving-border';

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
        <div className="-mt-2 mb-1">
          <Link to="/">
            <MovingBorderButton
              borderRadius="0.5rem"
              containerClassName="h-8"
              className="bg-secondary/90 backdrop-blur-sm text-foreground hover:bg-secondary/100 h-full px-3 text-sm font-medium border-none"
            >
              <Home className="w-4 h-4 mr-2" />
              Prompt Builder
            </MovingBorderButton>
          </Link>
        </div>
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
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
