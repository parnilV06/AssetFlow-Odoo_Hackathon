import React from 'react';
import Logo from '../../components/Common/Logo';

const Dashboard = () => {
  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
      <div style={{ marginBottom: '30px' }}>
        <Logo width={160} />
      </div>
      <h1>Dashboard</h1>
      <p style={{ color: '#64748b' }}>Enterprise Asset and Resource Management Dashboard Overview</p>
    </div>
  );
};

export default Dashboard;
