import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchWorkspaceAnalytics } from '../api/services';

export const AnalyticsDashboard: React.FC = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['workspace-analytics'],
    queryFn: fetchWorkspaceAnalytics,
  });

  if (isLoading) return <div>Loading analytics pipeline...</div>;
  if (isError) return <div>Error loading analytics: {(error as Error).message}</div>;

  return (
    <div style={{ padding: '24px', fontFamily: 'sans-serif' }}>
      <h2>Workspace Analytics Dashboard</h2>

      {/* Task Status Overview Section */}
      <section style={{ marginBottom: '32px' }}>
        <h3>Task Status Breakdown</h3>
        <div style={{ display: 'flex', gap: '16px' }}>
          {data?.statusBreakdown.map((item) => (
            <div
              key={item.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '16px',
                minWidth: '150px',
              }}
            >
              <span style={{ fontWeight: 'bold' }}>{item.id}</span>
              <p>Total Tasks: {item.count}</p>
              <p>Estimated Effort: {item.totalEstimatedHours} hrs</p>
            </div>
          ))}
        </div>
      </section>

      {/* Assignee Performance Table Section */}
      <section>
        <h3>Developer Productivity</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #333' }}>
              <th style={{ padding: '8px' }}>Developer</th>
              <th style={{ padding: '8px' }}>Assigned</th>
              <th style={{ padding: '8px' }}>Completed</th>
              <th style={{ padding: '8px' }}>Completion Rate</th>
            </tr>
          </thead>
          <tbody>
            {data?.assigneePerformance.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{ padding: '8px' }}>
                  <strong>{user.name}</strong> <br />
                  <small>{user.email}</small>
                </td>
                <td style={{ padding: '8px' }}>{user.assignedTasks}</td>
                <td style={{ padding: '8px' }}>{user.completedTasks}</td>
                <td style={{ padding: '8px' }}>{user.completionRate.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};