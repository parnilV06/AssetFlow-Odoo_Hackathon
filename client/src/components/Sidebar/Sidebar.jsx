import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, Users, HardDrive, Share2, Calendar, 
  Wrench, ClipboardCheck, BarChart2, Bell, Settings,
  ChevronDown, ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
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
      { name: 'Categories', path: '/organization/categories' },
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
  const { user, logout } = useAuth();
  
  // By default, expand Organization if we are on an organization route
  const isOrgActive = location.pathname.startsWith('/organization');
  const [expanded, setExpanded] = React.useState({
    'Organization': isOrgActive
  });
  
  const [showDropdown, setShowDropdown] = React.useState(false);

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

  const handleLogout = async () => {
    await logout();
    navigate('/login');
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
        <div className="user-profile-container" style={{ position: 'relative' }}>
          <div className="user-profile" onClick={() => setShowDropdown(!showDropdown)} style={{ cursor: 'pointer' }}>
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=0052cc&color=fff`} 
              alt="User Avatar" 
              className="user-avatar" 
            />
            <div className="user-info">
              <div className="user-name">{user?.name || 'User'}</div>
              <div className="user-role" style={{textTransform: 'capitalize'}}>{user?.role?.toLowerCase().replace('_', ' ') || 'Employee'}</div>
            </div>
            <ChevronDown size={16} className="text-tertiary" style={{ color: 'var(--text-tertiary)' }} />
          </div>
          
          {showDropdown && (
            <div className="user-dropdown-menu" style={{ position: 'absolute', bottom: '100%', left: 0, right: 0, background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.5rem', marginBottom: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
              <button 
                onClick={handleLogout}
                style={{ width: '100%', padding: '0.5rem', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f43f5e', fontSize: '0.875rem', fontWeight: 500 }}
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
