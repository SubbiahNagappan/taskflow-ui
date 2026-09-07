import { api } from './axiosClient';
import {
  type AuthResponse,
  type AnalyticsResponse,
  type AnalyticsData,
  type Task,
} from '../types/api';

export const loginUser = async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};

export const fetchWorkspaceAnalytics = async (): Promise<AnalyticsData> => {
  const response = await api.get<AnalyticsResponse>('/analytics');
  const data = response.data.data;

  return {
    statusBreakdown: data.statusBreakdown.map((item) => ({
      ...item,
      id: item.id ?? (item as { _id?: string })._id ?? '',
    })),
    assigneePerformance: data.assigneePerformance.map((user) => ({
      ...user,
      id: user.id ?? (user as { _id?: string })._id ?? '',
    })),
  };
};

type TaskResponse = Task & { _id?: string };

export const fetchTasks = async (): Promise<Task[]> => {
  const response = await api.get<{ data?: TaskResponse[]; tasks?: TaskResponse[] } | TaskResponse[]>('/tasks');

  const payload = Array.isArray(response.data)
    ? response.data
    : response.data?.data ?? response.data?.tasks ?? [];

  return payload.map((task) => {
    const { _id, ...rest } = task;
    return {
      ...rest,
      id: task.id ?? _id ?? '',
    };
  });
};