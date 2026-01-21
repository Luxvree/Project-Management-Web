import { Task, TaskStatus, TaskPriority } from '@/types/project';
import { format } from 'date-fns';
import { Calendar, Flag, MoreHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { mockUsers } from '@/data/mockData';

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
}

const priorityConfig: Record<TaskPriority, { label: string; className: string }> = {
  high: { label: 'High', className: 'bg-priority-high/10 text-priority-high border-priority-high/20' },
  medium: { label: 'Medium', className: 'bg-priority-medium/10 text-priority-medium border-priority-medium/20' },
  low: { label: 'Low', className: 'bg-priority-low/10 text-priority-low border-priority-low/20' },
};

export function TaskCard({ task, onClick }: TaskCardProps) {
  const assignee = task.assigneeId ? mockUsers.find((u) => u.id === task.assigneeId) : null;
  const priority = priorityConfig[task.priority];

  return (
    <div
      onClick={onClick}
      className={cn(
        'bg-card rounded-lg border border-border p-4 cursor-pointer',
        'shadow-card hover:shadow-md transition-all duration-200',
        'hover:border-primary/30'
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h4 className="text-sm font-medium text-foreground line-clamp-2">{task.title}</h4>
        <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0 -mr-1 -mt-1">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </div>

      {task.description && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center gap-2 mb-3">
        <Badge variant="outline" className={cn('text-xs', priority.className)}>
          <Flag className="w-3 h-3 mr-1" />
          {priority.label}
        </Badge>
      </div>

      <div className="flex items-center justify-between">
        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{format(task.dueDate, 'MMM d')}</span>
          </div>
        )}
        
        {assignee && (
          <Avatar className="w-6 h-6">
            <AvatarImage src={assignee.avatar} alt={assignee.name} />
            <AvatarFallback className="text-xs">{assignee.name.charAt(0)}</AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}
