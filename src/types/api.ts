export type Role = 'OWNER' | 'ADMIN' | 'MEMBER' | 'GUEST';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  tenantId: string;
}

export interface Task {
  id?: string;
  title: string;
  status: TaskStatus;
  tenantId?: string;
  assigneeId?: string;
  description?: string;
  estimatedHours?: number;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  token: string;
}

export interface StatusBreakdown {
  id: TaskStatus;
  count: number;
  totalEstimatedHours: number;
}

export interface AssigneePerformance {
  id: string;
  name: string;
  email: string;
  assignedTasks: number;
  completedTasks: number;
  completionRate: number;
}

export interface AnalyticsData {
  statusBreakdown: StatusBreakdown[];
  assigneePerformance: AssigneePerformance[];
}

export interface AnalyticsResponse {
  success: boolean;
  data: AnalyticsData;
}