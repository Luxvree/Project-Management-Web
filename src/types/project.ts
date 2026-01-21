export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';
export type UserRole = 'admin' | 'member' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  createdAt: Date;
}

export interface ActivityLog {
  id: string;
  action: string;
  userId: string;
  taskId?: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId?: string;
  dueDate?: Date;
  projectId: string;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  ownerId: string;
  memberIds: string[];
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}
