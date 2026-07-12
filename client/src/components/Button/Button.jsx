import React from 'react';
import './Button.css';

const Button = ({ 
  children, 
  variant = 'primary', 
  icon: Icon, 
  className = '', 
  ...props 
}) => {
  return (
    <button 
      className={`btn btn-${variant} ${className}`} 
      {...props}
    >
      {Icon && <Icon size={16} className="btn-icon" />}
      {children}
    </button>
  );
};

export default Button;
