import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { mockProjects, mockTasks } from '@/data/mockData';

export function ProjectProgress() {
  const getProjectProgress = (projectId: string) => {
    const tasks = mockTasks.filter((t) => t.projectId === projectId);
    if (tasks.length === 0) return 0;
    const doneTasks = tasks.filter((t) => t.status === 'done').length;
    return Math.round((doneTasks / tasks.length) * 100);
  };

  const getTaskCount = (projectId: string) => {
    return mockTasks.filter((t) => t.projectId === projectId).length;
  };

  return (
    <div className="bg-card rounded-xl border border-border shadow-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Project Progress</h3>
      <div className="space-y-5">
        {mockProjects.map((project, index) => {
          const progress = getProjectProgress(project.id);
          const taskCount = getTaskCount(project.id);
          
          return (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <span className="text-sm font-medium text-foreground">
                    {project.name}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {taskCount} tasks
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={progress} className="h-2 flex-1" />
                <span className="text-sm font-medium text-foreground w-12 text-right">
                  {progress}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
