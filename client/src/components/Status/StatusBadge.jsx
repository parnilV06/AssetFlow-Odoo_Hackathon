import React from 'react';
import './StatusBadge.css';

const StatusBadge = ({ status }) => {
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'available':
      case 'approved':
      case 'verified':
      case 'completed':
        return 'status-active';
      case 'inactive':
      case 'rejected':
        return 'status-inactive';
      case 'pending':
        return 'status-pending';
      case 'allocated':
      case 'in progress':
        return 'status-allocated';
      case 'reserved':
      case 'damaged':
        return 'status-reserved';
      case 'under maintenance':
        return 'status-maintenance';
      case 'lost':
      case 'missing':
        return 'status-lost';
      case 'scheduled':
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
