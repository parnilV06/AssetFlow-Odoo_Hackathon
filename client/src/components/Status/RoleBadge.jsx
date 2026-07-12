import React from 'react';
import './StatusBadge.css';

const RoleBadge = ({ role }) => {
  return (
    <span className="status-badge role-badge">
      {role}
    </span>
  );
};

export default RoleBadge;
