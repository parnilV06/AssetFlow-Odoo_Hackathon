import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell } from 'lucide-react';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  return (
    <header className="header">
      <div className="breadcrumb">
        {pathSegments.length > 0 ? (
          pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            const text = segment.charAt(0).toUpperCase() + segment.slice(1);
            
            return (
              <React.Fragment key={segment}>
                {index > 0 && <span className="breadcrumb-separator">/</span>}
                <span className={isLast ? "breadcrumb-current" : "breadcrumb-link"}>
                  {text}
                </span>
              </React.Fragment>
            );
          })
        ) : (
          <span className="breadcrumb-current">Dashboard</span>
        )}
      </div>

      <div className="header-actions">
        <button className="notification-btn">
          <Bell size={20} />
          <span className="notification-badge">3</span>
        </button>
        <img 
          src="https://i.pravatar.cc/150?img=11" 
          alt="User Profile" 
          className="header-avatar" 
        />
      </div>
    </header>
  );
};

export default Header;
