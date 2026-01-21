import { motion } from 'framer-motion';
import { ListTodo, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { ProjectProgress } from '@/components/dashboard/ProjectProgress';
import { mockTasks } from '@/data/mockData';

const Dashboard = () => {
  const todoCount = mockTasks.filter((t) => t.status === 'todo').length;
  const inProgressCount = mockTasks.filter((t) => t.status === 'in-progress').length;
  const doneCount = mockTasks.filter((t) => t.status === 'done').length;
  const overdueCount = mockTasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length;

  return (
    <AppLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="To Do"
            value={todoCount}
            subtitle="Tasks waiting"
            icon={<ListTodo className="w-5 h-5" />}
          />
          <StatCard
            title="In Progress"
            value={inProgressCount}
            subtitle="Currently active"
            icon={<Clock className="w-5 h-5" />}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Completed"
            value={doneCount}
            subtitle="Tasks done"
            icon={<CheckCircle2 className="w-5 h-5" />}
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Overdue"
            value={overdueCount}
            subtitle="Need attention"
            icon={<AlertCircle className="w-5 h-5" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProjectProgress />
          </div>
          <div>
            <ActivityFeed />
          </div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-xl border border-border shadow-card p-6"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Overview</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockTasks.slice(0, 4).map((task) => (
              <div key={task.id} className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                <p className="text-xs text-muted-foreground mt-1 capitalize">
                  {task.status.replace('-', ' ')}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
