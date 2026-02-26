import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Folder, Plus, MoreVertical, Pin, Trash, Copy, Edit, PanelLeftClose } from 'lucide-react';
import { useProjects } from '@/lib/contexts/ProjectsContext';
import { DEFAULT_PROJECT_ID } from '@/lib/types/projects';
import { Button } from '@/components/ui/button';
import { AnimatedDropdown } from '@/components/ui/animated-dropdown';
import { CreateProjectModal } from './CreateProjectModal';

export const ProjectsSidebar = ({ isOpen, setIsOpen, overlay = false }: { isOpen: boolean; setIsOpen: (val: boolean) => void; overlay?: boolean }) => {
  const { state, updateProject, deleteProject, exportProject } = useProjects();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const navigate = useNavigate();

  const projectsList = Object.values(state.projects).sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.updatedAt - a.updatedAt;
  });

  return (
    <>
      {/* Backdrop (only in overlay mode) */}
      {overlay && isOpen && (
        <div
          className="absolute inset-0 bg-background/20 backdrop-blur-sm z-30 transition-opacity duration-300 ease-in-out"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <div
        className={`${
          overlay ? 'absolute left-0 top-0 z-40 h-screen shadow-2xl' : 'relative z-10 h-full'
        } border-r border-border/50 bg-background/80 backdrop-blur-xl flex flex-col pt-4 transition-all duration-300 ease-in-out overflow-hidden
          ${isOpen ? 'translate-x-0 w-64 opacity-100' : (overlay ? '-translate-x-full w-0 opacity-0' : 'w-0 opacity-0')}`
        }
      >
        <div className="w-64 flex flex-col h-full">
          <div className="px-4 flex items-center justify-between mb-3 mt-8 md:mt-6">
            <h2 className="text-sm font-semibold tracking-tight text-muted-foreground uppercase flex items-center gap-2">
              <img src="/logo.png" alt="Vibe Prompt Logo" className="h-5 w-5 object-contain" />
              Projects
            </h2>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsCreateOpen(true)} aria-label="Create Project">
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)} aria-label="Close Sidebar">
                <PanelLeftClose className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 space-y-1 projects-scroll">
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
                  <div className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <AnimatedDropdown
                      showChevron={false}
                      triggerClassName="h-6 w-6 p-0 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md flex items-center justify-center"
                      menuClassName="right-0 w-48 shadow-2xl"
                      options={[
                        {
                          label: project.isPinned ? 'Unpin Project' : 'Pin Project',
                          onClick: () => updateProject(project.id, { isPinned: !project.isPinned }),
                          Icon: <Pin className="h-4 w-4" />
                        },
                        {
                          label: 'Settings',
                          onClick: () => navigate(`/projects/${project.id}/settings`),
                          Icon: <Edit className="h-4 w-4" />
                        },
                        {
                          label: 'Export Project',
                          onClick: () => exportProject(project.id),
                          Icon: <Copy className="h-4 w-4" />
                        },
                        {
                          label: 'Delete Project',
                          onClick: () => deleteProject(project.id),
                          Icon: <Trash className="h-4 w-4" />,
                          destructive: true
                        }
                      ]}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </AnimatedDropdown>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <CreateProjectModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      </div>
    </>
  );
};
