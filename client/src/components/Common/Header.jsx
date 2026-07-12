import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, Settings } from 'lucide-react';
import SearchInput from '../Input/SearchInput';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const isDashboard = pathSegments.length === 0 || pathSegments[0] === 'dashboard';

  return (
    <header className="header">
      <div className="breadcrumb">
        {isDashboard ? (
          <div className="welcome-section">
            <h1 className="welcome-title">Welcome back, Rahul 👋</h1>
            <p className="welcome-subtitle">Here's what's happening with your assets today.</p>
          </div>
        ) : pathSegments.length > 0 ? (
          pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            let text = segment.charAt(0).toUpperCase() + segment.slice(1);
            
            return (
              <React.Fragment key={segment}>
                {index > 0 && <span className="breadcrumb-separator">/</span>}
                <span className={isLast && location.pathname !== '/audit' ? "breadcrumb-current" : "breadcrumb-link"}>
                  {text}
                </span>
                {location.pathname === '/audit' && isLast && (
                  <>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">Active Cycles</span>
                  </>
                )}
              </React.Fragment>
            );
          })
        ) : (
          <span className="breadcrumb-current">Dashboard</span>
        )}
      </div>

      <div className="header-actions">
        {isDashboard && (
          <SearchInput 
            placeholder="Search assets, employees, requests..." 
            className="global-search"
            width="350px"
          />
        )}
        <button className="icon-btn" aria-label="Settings">
          <Settings size={20} />
        </button>
        <button className="notification-btn" aria-label="Notifications">
          <Bell size={20} />
          <span className="notification-badge">5</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
