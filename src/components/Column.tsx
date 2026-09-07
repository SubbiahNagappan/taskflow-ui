import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface ColumnProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export const Column: React.FC<ColumnProps> = ({ id, title, children }) => {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{
        flex: 1,
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        padding: '16px',
        minHeight: '400px',
      }}
    >
      <h3 style={{ marginTop: 0, color: '#334155' }}>{title}</h3>
      {children}
    </div>
  );
};