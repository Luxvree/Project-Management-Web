import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { format, addDays, differenceInDays, startOfWeek, eachDayOfInterval } from 'date-fns';
import { AppLayout } from '@/components/layout/AppLayout';
import { mockTasks, mockUsers } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Timeline = () => {
  const today = new Date();
  const startDate = startOfWeek(today);
  const days = eachDayOfInterval({ start: startDate, end: addDays(startDate, 13) });

  const tasksWithDates = useMemo(() => {
    return mockTasks
      .filter((task) => task.dueDate)
      .map((task) => {
        const assignee = mockUsers.find((u) => u.id === task.assigneeId);
        const startDay = Math.max(0, differenceInDays(task.dueDate!, startDate) - 3);
        const endDay = differenceInDays(task.dueDate!, startDate);
        return { ...task, assignee, startDay, endDay };
      })
      .filter((task) => task.endDay >= 0 && task.startDay < 14)
      .sort((a, b) => a.startDay - b.startDay);
  }, [startDate]);

  const statusColors: Record<string, string> = {
    todo: 'bg-status-todo',
    'in-progress': 'bg-status-in-progress',
    review: 'bg-status-review',
    done: 'bg-status-done',
  };

  const statusBg: Record<string, string> = {
    todo: 'bg-status-todo/20 border-status-todo/30',
    'in-progress': 'bg-status-in-progress/20 border-status-in-progress/30',
    review: 'bg-status-review/20 border-status-review/30',
    done: 'bg-status-done/20 border-status-done/30',
  };

  const columnWidth = 80;
  const totalWidth = columnWidth * 14;

  return (
    <AppLayout title="Timeline">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {format(startDate, 'MMMM d')} - {format(addDays(startDate, 13), 'MMMM d, yyyy')}
          </p>
        </div>

        {/* Timeline Container */}
        <div className="bg-card rounded-xl border border-border shadow-card overflow-x-auto">
          <div style={{ minWidth: `${totalWidth}px` }}>
            {/* Days Header */}
            <div className="flex border-b border-border sticky top-0 bg-card z-10">
              {days.map((day, index) => {
                const isToday = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
                const isWeekend = [0, 6].includes(day.getDay());
                
                return (
                  <div
                    key={index}
                    className={cn(
                      'p-3 text-center border-r border-border last:border-r-0 flex-shrink-0',
                      isWeekend && 'bg-muted/30',
                      isToday && 'bg-primary/10'
                    )}
                    style={{ width: `${columnWidth}px` }}
                  >
                    <p className="text-xs text-muted-foreground">{format(day, 'EEE')}</p>
                    <p className={cn(
                      'text-sm font-medium',
                      isToday ? 'text-primary' : 'text-foreground'
                    )}>
                      {format(day, 'd')}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Task Rows */}
            <div className="relative min-h-[350px]">
              {/* Grid Background */}
              <div className="absolute inset-0 flex pointer-events-none">
                {days.map((day, index) => {
                  const isWeekend = [0, 6].includes(day.getDay());
                  const isToday = format(day, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
                  return (
                    <div
                      key={index}
                      className={cn(
                        'border-r border-border/50 last:border-r-0 h-full flex-shrink-0',
                        isWeekend && 'bg-muted/10',
                        isToday && 'bg-primary/5'
                      )}
                      style={{ width: `${columnWidth}px` }}
                    />
                  );
                })}
              </div>

              {/* Tasks */}
              <div className="relative py-4 space-y-2">
                {tasksWithDates.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    No tasks scheduled in this period
                  </div>
                ) : (
                  tasksWithDates.map((task, index) => {
                    const startCol = Math.max(0, task.startDay);
                    const endCol = Math.min(13, task.endDay);
                    const colSpan = endCol - startCol + 1;
                    const leftOffset = startCol * columnWidth;
                    const barWidth = colSpan * columnWidth - 8;

                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative h-14 px-1"
                      >
                        <div
                          className={cn(
                            'absolute rounded-lg p-3 flex items-center gap-3 h-12',
                            'border shadow-sm',
                            'hover:shadow-md transition-all cursor-pointer',
                            statusBg[task.status]
                          )}
                          style={{
                            left: `${leftOffset + 4}px`,
                            width: `${Math.max(barWidth, 180)}px`,
                          }}
                        >
                          <div className={cn('w-1 self-stretch rounded-full flex-shrink-0', statusColors[task.status])} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{task.title}</p>
                            <p className="text-xs text-muted-foreground">
                              Due {format(task.dueDate!, 'MMM d')}
                            </p>
                          </div>
                          {task.assignee && (
                            <Avatar className="w-6 h-6 flex-shrink-0">
                              <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                              <AvatarFallback className="text-xs">{task.assignee.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 flex-wrap">
          {Object.entries(statusColors).map(([status, color]) => (
            <div key={status} className="flex items-center gap-2">
              <div className={cn('w-3 h-3 rounded-full', color)} />
              <span className="text-sm text-muted-foreground capitalize">{status.replace('-', ' ')}</span>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
};

export default Timeline;
