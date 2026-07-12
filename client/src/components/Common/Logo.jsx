import React from 'react';

const Logo = ({ width = 140, className = '', style = {} }) => {
  return (
    <img
      src="/logo.png"
      alt="AssetFlow Logo"
      className={`brand-logo-img ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: 'auto',
        display: 'block',
        maxWidth: '100%',
        ...style
      }}
    />
  );
};

export default Logo;
