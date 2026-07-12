import React from 'react';
import Logo from '../Common/Logo';

const Navbar = () => {
  return (
    <div className="navbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid #e2e8f0', background: '#ffffff', boxSizing: 'border-box' }}>
      <a href="/" style={{ textDecoration: 'none' }}>
        <Logo width={110} />
      </a>
      <div style={{ color: '#64748b', fontSize: '14px' }}>Navbar Controls</div>
    </div>
  );
};

export default Navbar;
