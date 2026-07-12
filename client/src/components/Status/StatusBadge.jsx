import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'available':
      case 'approved':
        return 'status-active';
      case 'inactive':
      case 'rejected':
        return 'status-inactive';
      case 'pending':
        return 'status-pending';
      default:
        return 'status-default';
    }
  };

  return (
    <span className={`status-badge ${getStatusClass(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
