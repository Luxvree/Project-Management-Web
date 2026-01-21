import { useState } from 'react';
import { Project } from '@/types/project';
import { FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (project: Project) => void;
}

const colorOptions = [
  { value: '#3B82F6', label: 'Blue' },
  { value: '#8B5CF6', label: 'Purple' },
  { value: '#10B981', label: 'Green' },
  { value: '#F59E0B', label: 'Yellow' },
  { value: '#EF4444', label: 'Red' },
  { value: '#EC4899', label: 'Pink' },
  { value: '#6366F1', label: 'Indigo' },
  { value: '#14B8A6', label: 'Teal' },
];

export function AddProjectDialog({ open, onOpenChange, onAdd }: AddProjectDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3B82F6');

  const resetForm = () => {
    setName('');
    setDescription('');
    setColor('#3B82F6');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) return;

    const newProject: Project = {
      id: `p${Date.now()}`,
      name: name.trim(),
      description: description.trim() || undefined,
      color,
      ownerId: '1', // Current user
      memberIds: ['1'],
      tasks: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onAdd(newProject);
    resetForm();
    onOpenChange(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="w-5 h-5" />
            Create New Project
          </DialogTitle>
          <DialogDescription>
            Add a new project to organize your tasks.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name *</Label>
            <Input
              id="project-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter project name..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="project-description">Description</Label>
            <Textarea
              id="project-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a description..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label>Project Color</Label>
            <div className="flex gap-2 flex-wrap">
              {colorOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setColor(option.value)}
                  className={`w-8 h-8 rounded-full transition-all ${
                    color === option.value ? 'ring-2 ring-offset-2 ring-foreground' : ''
                  }`}
                  style={{ backgroundColor: option.value }}
                  title={option.label}
                />
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              Create Project
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
