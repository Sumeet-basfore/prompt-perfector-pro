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
