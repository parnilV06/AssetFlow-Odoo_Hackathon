import React from 'react';
import Logo from '../Common/Logo';

const Sidebar = () => {
  return (
    <div className="sidebar" style={{ padding: '20px', borderRight: '1px solid #e2e8f0', height: '100%', boxSizing: 'border-box' }}>
      <a href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
        <Logo width={120} />
      </a>
      <div style={{ marginTop: '30px', color: '#64748b', fontSize: '14px' }}>Sidebar Navigation</div>
    </div>
  );
};

export default Sidebar;
