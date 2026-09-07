import React from 'react';
import { useDraggable } from '@dnd-kit/core';

interface TaskCardProps {
  id: string;
  title: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({ id, title }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style: React.CSSProperties = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    padding: '12px',
    margin: '8px 0',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    cursor: 'grab',
    touchAction: 'none',
    userSelect: 'none',
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <p style={{ margin: 0, fontWeight: 500 }}>{title}</p>
    </div>
  );
};