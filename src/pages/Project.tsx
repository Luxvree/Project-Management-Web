import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { Plus, ArrowLeft, Users, Calendar } from 'lucide-react';
import { Task, TaskStatus, Project as ProjectType } from '@/types/project';
import { TaskCard } from '@/components/board/TaskCard';
import { TaskDetailSheet } from '@/components/board/TaskDetailSheet';
import { AddTaskDialog } from '@/components/board/AddTaskDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AppLayout } from '@/components/layout/AppLayout';
import { cn } from '@/lib/utils';
import { mockProjects, mockTasks, mockUsers } from '@/data/mockData';
import { format } from 'date-fns';

interface Column {
  id: TaskStatus;
  title: string;
  color: string;
}

const columns: Column[] = [
  { id: 'todo', title: 'To Do', color: 'bg-status-todo' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-status-in-progress' },
  { id: 'review', title: 'Review', color: 'bg-status-review' },
  { id: 'done', title: 'Done', color: 'bg-status-done' },
];

const Project = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectType | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [addTaskStatus, setAddTaskStatus] = useState<TaskStatus>('todo');

  useEffect(() => {
    const foundProject = mockProjects.find((p) => p.id === projectId);
    if (foundProject) {
      setProject(foundProject);
      // Filter tasks for this project
      const projectTasks = mockTasks.filter((t) => t.projectId === projectId);
      setTasks(projectTasks);
    }
  }, [projectId]);

  if (!project) {
    return (
      <AppLayout title="Project Not Found">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground">This project doesn't exist.</p>
          <Button onClick={() => navigate('/board')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Board
          </Button>
        </div>
      </AppLayout>
    );
  }

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }

    const updatedTasks = tasks.map((task) => {
      if (task.id === draggableId) {
        return {
          ...task,
          status: destination.droppableId as TaskStatus,
          updatedAt: new Date(),
        };
      }
      return task;
    });

    setTasks(updatedTasks);
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDetailOpen(true);
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setSelectedTask(updatedTask);
  };

  const handleAddTask = (newTask: Task) => {
    setTasks([...tasks, newTask]);
  };

  const openAddTaskDialog = (status: TaskStatus) => {
    setAddTaskStatus(status);
    setIsAddTaskOpen(true);
  };

  const projectMembers = mockUsers.filter((u) => project.memberIds.includes(u.id));
  const completedTasks = tasks.filter((t) => t.status === 'done').length;
  const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  return (
    <AppLayout title={project.name}>
      {/* Project Header */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/board')} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          All Projects
        </Button>
        
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <div>
              <h1 className="text-2xl font-bold">{project.name}</h1>
              {project.description && (
                <p className="text-muted-foreground mt-1">{project.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{projectMembers.length} members</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Created {format(project.createdAt, 'MMM d, yyyy')}</span>
            </div>
            <Badge variant="secondary">
              {progress}% Complete
            </Badge>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column, columnIndex) => (
            <motion.div
              key={column.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: columnIndex * 0.1 }}
              className="flex-shrink-0 w-72"
            >
              {/* Column Header */}
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className={cn('w-2 h-2 rounded-full', column.color)} />
                <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {getTasksByStatus(column.id).length}
                </span>
              </div>

              {/* Droppable Area */}
              <Droppable droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      'min-h-[200px] rounded-lg p-2 transition-colors',
                      'bg-muted/30 border border-transparent',
                      snapshot.isDraggingOver && 'bg-primary/5 border-primary/20'
                    )}
                  >
                    <div className="space-y-3">
                      {getTasksByStatus(column.id).map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={provided.draggableProps.style}
                              className={cn(
                                snapshot.isDragging && 'rotate-2 shadow-lg'
                              )}
                            >
                              <TaskCard task={task} onClick={() => handleTaskClick(task)} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>

                    {/* Add Task Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full mt-3 text-muted-foreground hover:text-foreground"
                      onClick={() => openAddTaskDialog(column.id)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add task
                    </Button>
                  </div>
                )}
              </Droppable>
            </motion.div>
          ))}
        </div>
      </DragDropContext>

      {/* Task Detail Sheet */}
      <TaskDetailSheet
        task={selectedTask}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        onUpdate={handleTaskUpdate}
      />

      {/* Add Task Dialog */}
      <AddTaskDialog
        open={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
        onAdd={handleAddTask}
        defaultStatus={addTaskStatus}
        projectId={project.id}
      />
    </AppLayout>
  );
};

export default Project;
