import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Users, HardDrive, Share2, Calendar, 
  Wrench, ClipboardCheck, BarChart2, Bell, Settings,
  ChevronDown, ChevronRight
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { name: 'Dashboard', icon: Home, path: '/dashboard' },
  { 
    name: 'Organization', 
    icon: Users, 
    path: '/organization', 
    hasSubmenu: true,
    submenu: [
      { name: 'Departments', path: '/organization/departments' },
      { name: 'Employees', path: '/organization/employees' },
    ]
  },
  { name: 'Assets', icon: HardDrive, path: '/assets' },
  { name: 'Allocation', icon: Share2, path: '/allocation' },
  { name: 'Resource Booking', icon: Calendar, path: '/resource-booking' },
  { name: 'Maintenance', icon: Wrench, path: '/maintenance' },
  { name: 'Audit', icon: ClipboardCheck, path: '/audit' },
  { name: 'Reports', icon: BarChart2, path: '/reports' },
  { name: 'Notifications', icon: Bell, path: '/notifications', badge: 3 },
  { name: 'Settings', icon: Settings, path: '/settings' },
];

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // By default, expand Organization if we are on an organization route
  const isOrgActive = location.pathname.startsWith('/organization');
  const [expanded, setExpanded] = React.useState({
    'Organization': isOrgActive
  });

  const toggleSubmenu = (e, name) => {
    e.preventDefault();
    setExpanded(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const handleNavClick = (e, item) => {
    if (item.hasSubmenu) {
      e.preventDefault();
      setExpanded(prev => ({ ...prev, [item.name]: true })); // ensure it's open
      if (item.submenu && item.submenu.length > 0) {
        navigate(item.submenu[0].path);
      }
    }
  };

  return (
    <aside className="sidebar">
      <NavLink to="/" className="sidebar-logo">
        <img src="/logo.png" alt="AssetFlow Logo" className="logo-image" />
      </NavLink>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isItemActive = location.pathname === item.path || 
                               (item.hasSubmenu && location.pathname.startsWith(item.path));
          
          return (
            <div key={item.name} className="nav-item-wrapper">
              <NavLink
                to={item.path}
                onClick={(e) => handleNavClick(e, item)}
                className={`nav-item ${isItemActive ? 'active' : ''}`}
              >
                <item.icon className="nav-icon" />
                <span>{item.name}</span>
                
                {(item.hasSubmenu || item.badge) && (
                  <div className="nav-right-element">
                    {item.badge && <span className="nav-badge">{item.badge}</span>}
                    {item.hasSubmenu && (
                      <div onClick={(e) => toggleSubmenu(e, item.name)} style={{ display: 'flex', alignItems: 'center' }}>
                        {expanded[item.name] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </div>
                    )}
                  </div>
                )}
              </NavLink>
              
              {/* Submenu rendering */}
              {item.hasSubmenu && item.submenu && expanded[item.name] && (
                <div className="submenu">
                  {item.submenu.map(sub => (
                    <NavLink
                      key={sub.name}
                      to={sub.path}
                      className={({ isActive }) => `submenu-item ${isActive ? 'active' : ''}`}
                    >
                      {sub.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <img 
            src="https://i.pravatar.cc/150?img=11" 
            alt="User Avatar" 
            className="user-avatar" 
          />
          <div className="user-info">
            <div className="user-name">Rahul Sharma</div>
            <div className="user-role">Asset Manager</div>
          </div>
          <ChevronDown size={16} className="text-tertiary" style={{ color: 'var(--text-tertiary)' }} />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
