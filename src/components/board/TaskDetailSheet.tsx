import { useState } from 'react';
import { Task, TaskStatus, TaskPriority, Comment } from '@/types/project';
import { format } from 'date-fns';
import { Calendar, Flag, User, MessageSquare, Clock, Edit2, Save, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { mockUsers } from '@/data/mockData';

interface TaskDetailSheetProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (task: Task) => void;
}

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  high: { label: 'High', className: 'bg-priority-high/10 text-priority-high border-priority-high/20' },
  medium: { label: 'Medium', className: 'bg-priority-medium/10 text-priority-medium border-priority-medium/20' },
  low: { label: 'Low', className: 'bg-priority-low/10 text-priority-low border-priority-low/20' },
};

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  'todo': { label: 'To Do', className: 'bg-status-todo text-white' },
  'in-progress': { label: 'In Progress', className: 'bg-status-in-progress text-white' },
  'review': { label: 'Review', className: 'bg-status-review text-white' },
  'done': { label: 'Done', className: 'bg-status-done text-white' },
};

export function TaskDetailSheet({ task, open, onOpenChange, onUpdate }: TaskDetailSheetProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState('');

  if (!task) return null;

  const currentTask = isEditing && editedTask ? editedTask : task;
  const assignee = currentTask.assigneeId ? mockUsers.find((u) => u.id === currentTask.assigneeId) : null;

  const handleEdit = () => {
    setEditedTask({ ...task });
    setIsEditing(true);
  };

  const handleSave = () => {
    if (editedTask) {
      onUpdate({ ...editedTask, updatedAt: new Date() });
      setIsEditing(false);
      setEditedTask(null);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTask(null);
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: `c${Date.now()}`,
      content: newComment,
      authorId: '1', // Current user
      createdAt: new Date(),
    };

    const updatedTask = {
      ...task,
      comments: [...task.comments, comment],
      updatedAt: new Date(),
    };

    onUpdate(updatedTask);
    setNewComment('');
  };

  const updateField = <K extends keyof Task>(field: K, value: Task[K]) => {
    if (editedTask) {
      setEditedTask({ ...editedTask, [field]: value });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {isEditing ? (
                <Input
                  value={editedTask?.title || ''}
                  onChange={(e) => updateField('title', e.target.value)}
                  className="text-lg font-semibold"
                />
              ) : (
                <SheetTitle className="text-xl">{currentTask.title}</SheetTitle>
              )}
              <SheetDescription className="mt-1">
                Created {format(currentTask.createdAt, 'MMM d, yyyy')}
              </SheetDescription>
            </div>
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button size="sm" variant="ghost" onClick={handleCancel}>
                    <X className="w-4 h-4" />
                  </Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                </>
              ) : (
                <Button size="sm" variant="ghost" onClick={handleEdit}>
                  <Edit2 className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
          </div>
        </SheetHeader>

        <div className="space-y-6">
          {/* Status & Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Status</Label>
              {isEditing ? (
                <Select
                  value={editedTask?.status}
                  onValueChange={(value) => updateField('status', value as TaskStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(statusConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={cn('text-xs', statusConfig[currentTask.status].className)}>
                  {statusConfig[currentTask.status].label}
                </Badge>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Priority</Label>
              {isEditing ? (
                <Select
                  value={editedTask?.priority}
                  onValueChange={(value) => updateField('priority', value as TaskPriority)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorityConfig).map(([key, config]) => (
                      <SelectItem key={key} value={key}>
                        {config.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant="outline" className={cn('text-xs', priorityConfig[currentTask.priority].className)}>
                  <Flag className="w-3 h-3 mr-1" />
                  {priorityConfig[currentTask.priority].label}
                </Badge>
              )}
            </div>
          </div>

          {/* Assignee & Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <User className="w-3 h-3" />
                Assignee
              </Label>
              {isEditing ? (
                <Select
                  value={editedTask?.assigneeId || 'unassigned'}
                  onValueChange={(value) => updateField('assigneeId', value === 'unassigned' ? undefined : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {mockUsers.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : assignee ? (
                <div className="flex items-center gap-2">
                  <Avatar className="w-6 h-6">
                    <AvatarImage src={assignee.avatar} alt={assignee.name} />
                    <AvatarFallback className="text-xs">{assignee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{assignee.name}</span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">Unassigned</span>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Due Date
              </Label>
              {isEditing ? (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      {editedTask?.dueDate ? format(editedTask.dueDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={editedTask?.dueDate}
                      onSelect={(date) => updateField('dueDate', date)}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              ) : currentTask.dueDate ? (
                <span className="text-sm">{format(currentTask.dueDate, 'PPP')}</span>
              ) : (
                <span className="text-sm text-muted-foreground">No due date</span>
              )}
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Description</Label>
            {isEditing ? (
              <Textarea
                value={editedTask?.description || ''}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Add a description..."
                rows={4}
              />
            ) : (
              <p className="text-sm text-foreground">
                {currentTask.description || <span className="text-muted-foreground">No description</span>}
              </p>
            )}
          </div>

          <Separator />

          {/* Comments */}
          <div className="space-y-4">
            <Label className="text-xs text-muted-foreground flex items-center gap-1">
              <MessageSquare className="w-3 h-3" />
              Comments ({task.comments.length})
            </Label>

            {/* Comment List */}
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {task.comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No comments yet</p>
              ) : (
                task.comments.map((comment) => {
                  const author = mockUsers.find((u) => u.id === comment.authorId);
                  return (
                    <div key={comment.id} className="flex gap-3 p-3 bg-muted/50 rounded-lg">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={author?.avatar} alt={author?.name} />
                        <AvatarFallback className="text-xs">{author?.name?.charAt(0) || '?'}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{author?.name || 'Unknown'}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(comment.createdAt, 'MMM d, h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm mt-1">{comment.content}</p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Add Comment */}
            <div className="flex gap-2">
              <Input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
              />
              <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                Post
              </Button>
            </div>
          </div>

          {/* Activity */}
          <div className="pt-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              Last updated {format(currentTask.updatedAt, 'MMM d, yyyy h:mm a')}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
