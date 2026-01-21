import { motion } from 'framer-motion';
import { Mail, Shield, MoreHorizontal } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { mockUsers } from '@/data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const roleConfig = {
  admin: { label: 'Admin', className: 'bg-primary/10 text-primary border-primary/20' },
  member: { label: 'Member', className: 'bg-status-in-progress/10 text-status-in-progress border-status-in-progress/20' },
  viewer: { label: 'Viewer', className: 'bg-muted text-muted-foreground border-border' },
};

const Team = () => {
  return (
    <AppLayout title="Team">
      <div className="space-y-6">
        {/* Team Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">
              Manage your team members and their access levels
            </p>
          </div>
          <Button>
            Invite Member
          </Button>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockUsers.map((user, index) => {
            const role = roleConfig[user.role];
            
            return (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl border border-border shadow-card p-6 card-hover"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-foreground">{user.name}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Badge variant="outline" className={cn('text-xs', role.className)}>
                    <Shield className="w-3 h-3 mr-1" />
                    {role.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    3 active projects
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Roles Legend */}
        <div className="bg-card rounded-xl border border-border shadow-card p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Role Permissions</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-4">
              <Badge variant="outline" className={cn('text-xs w-20 justify-center', roleConfig.admin.className)}>
                Admin
              </Badge>
              <p className="text-sm text-muted-foreground">
                Full access to all projects, team management, and settings
              </p>
            </div>
            <div className="flex items-start gap-4">
              <Badge variant="outline" className={cn('text-xs w-20 justify-center', roleConfig.member.className)}>
                Member
              </Badge>
              <p className="text-sm text-muted-foreground">
                Can create, edit, and manage tasks in assigned projects
              </p>
            </div>
            <div className="flex items-start gap-4">
              <Badge variant="outline" className={cn('text-xs w-20 justify-center', roleConfig.viewer.className)}>
                Viewer
              </Badge>
              <p className="text-sm text-muted-foreground">
                Can view projects and tasks, but cannot make changes
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Team;
