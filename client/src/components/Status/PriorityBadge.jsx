import React from 'react';
import './StatusBadge.css';

const PriorityBadge = ({ priority }) => {
  const getPriorityClass = (level) => {
    switch (level?.toLowerCase()) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-default';
    }
  };

  return (
    <span className={`status-badge ${getPriorityClass(priority)}`}>
      Priority: {priority}
    </span>
  );
};

export default PriorityBadge;
