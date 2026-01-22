import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Task, TaskStatus } from '@/types/project';
import { TaskCard } from './TaskCard';
import { TaskDetailSheet } from './TaskDetailSheet';
import { AddTaskDialog } from './AddTaskDialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { mockTasks } from '@/data/mockData';

interface Column {
  id: TaskStatus;
  title: string;
  color: string;
}

const columns: Column[] = [
  { id: 'todo', title: 'Opti', color: 'bg-status-todo' },
  { id: 'in-progress', title: 'In Progress', color: 'bg-status-in-progress' },
  { id: 'review', title: 'Review', color: 'bg-status-review' },
  { id: 'done', title: 'Done', color: 'bg-status-done' },
];

export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [addTaskStatus, setAddTaskStatus] = useState<TaskStatus>('todo');

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

  return (
    <>
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
        projectId="p1"
      />
    </>
  );
}
