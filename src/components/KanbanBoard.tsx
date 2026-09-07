import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { TaskCard } from './TaskCard';
import { Column } from './Column';
import { useSocket } from '../hooks/useSocket';
import { type Task, type TaskStatus } from '../types/api';
import { fetchTasks } from '../api/services';
import { api } from '../api/axiosClient';

const INITIAL_TASKS: Task[] = [
  { id: '1', title: 'Setup JWT Auth Controller', status: 'DONE' },
  { id: '2', title: 'Design Aggregation Pipeline', status: 'IN_PROGRESS' },
  { id: '3', title: 'Build React Task Board', status: 'TODO' },
];

const getTaskKey = (task: Task) => task.id ?? task.id ?? '';

export const KanbanBoard: React.FC<{ tenantId: string }> = ({ tenantId }) => {
  const queryClient = useQueryClient();
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['workspace-tasks'],
    queryFn: fetchTasks,
    refetchOnWindowFocus: true,
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (data && data.length) {
      setTasks(data);
    }
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor)
  );

  const socket = useSocket(tenantId);

  // Listen for real-time task movement from other users in workspace
  useEffect(() => {
    if (!socket) return;

    socket.on('task-status-updated', (payload: { taskId: string; newStatus: TaskStatus }) => {
      // Update the query data optimistically
      console.log('Received task status update:', payload);
      queryClient.setQueryData(['workspace-tasks'], (oldData: Task[] | undefined) =>
        oldData?.map((t) =>
          t.id === payload.taskId ? { ...t, status: payload.newStatus } : t
        ) ?? []
      );
    });

    return () => {
      socket.off('task-status-updated');
    };
  }, [socket]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = String(active.id);
    const newStatus = over.id as TaskStatus;

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        getTaskKey(task) === taskId ? { ...task, status: newStatus } : task
      )
    );

    queryClient.setQueryData(['workspace-tasks'], (oldData: Task[] | undefined) =>
      (oldData ?? tasks).map((task) =>
        getTaskKey(task) === taskId ? { ...task, status: newStatus } : task
      )
    );
console.log('tenantId', tenantId);
    try {
      await api.put(`/tasks/${taskId}`, {
        status: newStatus,
        tenantId,
      });

      socket?.emit('task-moved', {
        taskId,
        newStatus,
        tenantId,
      });
    } catch (error) {
      console.error('Failed to update task status:', error);
      queryClient.invalidateQueries({ queryKey: ['workspace-tasks'] });
    }
  };

  const columns: { id: TaskStatus; title: string }[] = [
    { id: 'TODO', title: 'To Do' },
    { id: 'IN_PROGRESS', title: 'In Progress' },
    { id: 'DONE', title: 'Completed' },
  ];

  if (isLoading) return <div>Loading analytics pipeline...</div>;
  if (isError) return <div>Error loading analytics: {(error as Error).message}</div>;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div style={{ display: 'flex', gap: '16px', padding: '24px' }}>
        {columns.map((col) => (
          <Column key={col.id} id={col.id} title={col.title}>
            {tasks
              .filter((t) => t.status === col.id)
              .map((t) => (
                <TaskCard key={`${col.id}-${getTaskKey(t)}`} id={getTaskKey(t)} title={t.title} />
              ))}
          </Column>
        ))}
      </div>
    </DndContext>
  );
};