import React, { useState } from 'react';
import { 
  User, 
  Building, 
  Shield, 
  Bell, 
  Paintbrush, 
  Globe, 
  Cloud, 
  Package, 
  Database, 
  Settings as SettingsIcon, 
  Key, 
  Lock, 
  Folder, 
  HardDrive,
  CheckCircle,
  Download,
  AlertTriangle,
  RefreshCw,
  Plus
} from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const [activeCategory, setActiveCategory] = useState('profile');
  const [showToast, setShowToast] = useState(false);

  const handleSaveChanges = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleResetChanges = () => {
    setProfileName('Rahul Sharma');
    setProfileEmail('rahul@company.com');
    setProfilePhone('+91 98765 43210');
    setProfileTitle('Lead Architect');
    setProfileLocation('New Delhi Hub');
    setProfileBio('Enterprise custodian managing connected hardware platforms and security policies.');
    setOrgName('AssetFlow Corp');
    setOrgAddress('Plot 12, Sector 4, Tech Zone, New Delhi');
    setOrgTimezone('GMT+05:30 (India Standard Time)');
    setOrgWorkingHours('09:00 - 18:00');
    setOrgCurrency('INR (₹)');
    setOrgFiscalYear('April - March');
    setOrgDateFormat('DD-MM-YYYY');
    setTwoFactorEnabled(true);
    setThemeMode('light');
    setAccentColor('blue');
    alert('Settings form inputs have been reset to default values.');
  };

  // 1. Profile Form States
  const [profileName, setProfileName] = useState('Rahul Sharma');
  const [profileEmail, setProfileEmail] = useState('rahul@company.com');
  const [profilePhone, setProfilePhone] = useState('+91 98765 43210');
  const [profileEmpId, setProfileEmpId] = useState('EMP-1024');
  const [profileDept, setProfileDept] = useState('Engineering');
  const [profileRole, setProfileRole] = useState('Asset Manager');
  const [profileTitle, setProfileTitle] = useState('Lead Architect');
  const [profileLocation, setProfileLocation] = useState('New Delhi Hub');
  const [profileBio, setProfileBio] = useState('Enterprise custodian managing connected hardware platforms and security policies.');

  // 2. Org Settings States
  const [orgName, setOrgName] = useState('AssetFlow Corp');
  const [orgAddress, setOrgAddress] = useState('Plot 12, Sector 4, Tech Zone, New Delhi');
  const [orgTimezone, setOrgTimezone] = useState('GMT+05:30 (India Standard Time)');
  const [orgWorkingHours, setOrgWorkingHours] = useState('09:00 - 18:00');
  const [orgCurrency, setOrgCurrency] = useState('INR (₹)');
  const [orgFiscalYear, setOrgFiscalYear] = useState('April - March');
  const [orgDateFormat, setOrgDateFormat] = useState('DD-MM-YYYY');

  // 3. Security Settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState('60 minutes');
  const [activeSessions, setActiveSessions] = useState([
    { id: 1, device: 'Chrome on macOS (14-inch MacBook)', ip: '192.168.1.45', location: 'New Delhi, India', current: true },
    { id: 2, device: 'Firefox on Windows Desktop', ip: '103.44.52.12', location: 'Mumbai, India', current: false }
  ]);

  // 4. Notifications Toggles
  const [notifSwitches, setNotifSwitches] = useState({
    email: true,
    push: false,
    desktop: true,
    sms: false,
    maintenance: true,
    audit: true,
    booking: true,
    overdue: true,
    transfer: true,
    system: false
  });

  const handleToggleNotif = (key) => {
    setNotifSwitches(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // 5. Appearance Selection
  const [themeMode, setThemeMode] = useState('light');
  const [accentColor, setAccentColor] = useState('blue');
  const [cardDensity, setCardDensity] = useState('comfortable');
  const [sidebarStyle, setSidebarStyle] = useState('expanded');
  const [enableAnimations, setEnableAnimations] = useState(true);

  React.useEffect(() => {
    if (themeMode === 'dark') {
      document.body.classList.add('dark-theme');
    } else if (themeMode === 'light') {
      document.body.classList.remove('dark-theme');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    }
  }, [themeMode]);

  // 6. Language & Region
  const [langRegion, setLangRegion] = useState({
    lang: 'English (United States)',
    timeFormat: '12 Hours',
    numberFormat: '1,234,567.89',
    region: 'India'
  });

  // 7. Integration Cards State
  const [integrationsList, setIntegrationsList] = useState([
    { id: 'teams', name: 'Microsoft Teams', logo: '💬', desc: 'Sync asset maintenance requests and warnings directly into Teams channels.', status: 'Connected' },
    { id: 'slack', name: 'Slack', logo: '🟢', desc: 'Notify asset managers immediately when audits starts or returns go overdue.', status: 'Connected' },
    { id: 'workspace', name: 'Google Workspace', logo: '🌐', desc: 'Auto provision user profiles and departments directly from directory logs.', status: 'Disconnected' },
    { id: 'outlook', name: 'Outlook Calendar', logo: '📅', desc: 'Inject upcoming resource booking schedules directly into Outlook planners.', status: 'Connected' },
    { id: 'azure', name: 'Microsoft Azure', logo: '☁️', desc: 'Sync virtual machine configurations and inventory catalogs automatically.', status: 'Disconnected' }
  ]);

  const handleToggleIntegration = (id) => {
    setIntegrationsList(integrationsList.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: item.status === 'Connected' ? 'Disconnected' : 'Connected'
        };
      }
      return item;
    }));
  };

  // 8. Asset Preferences
  const [autoGenTags, setAutoGenTags] = useState(true);
  const [defaultCategory, setDefaultCategory] = useState('IT Hardware');
  const [defaultMaintenanceCycle, setDefaultMaintenanceCycle] = useState('90 Days');
  const [qrGeneration, setQrGeneration] = useState(true);
  const [barcodeGeneration, setBarcodeGeneration] = useState(false);
  const [defaultAssetStatus, setDefaultAssetStatus] = useState('Active');

  // 9. Dashboard Preferences
  const [defaultLanding, setDefaultLanding] = useState('/dashboard');
  const [refreshInterval, setRefreshInterval] = useState('5 minutes');
  const [enableAnalytics, setEnableAnalytics] = useState(true);

  // 10. User Permissions matrix
  const [permissionGrid, setPermissionGrid] = useState([
    { role: 'Admins', read: true, create: true, update: true, delete: true, approve: true, export: true },
    { role: 'Asset Managers', read: true, create: true, update: true, delete: false, approve: true, export: true },
    { role: 'Department Heads', read: true, create: false, update: false, delete: false, approve: true, export: false },
    { role: 'Employees', read: true, create: false, update: false, delete: false, approve: false, export: false }
  ]);

  const handleTogglePermission = (roleIndex, field) => {
    const updatedGrid = [...permissionGrid];
    updatedGrid[roleIndex][field] = !updatedGrid[roleIndex][field];
    setPermissionGrid(updatedGrid);
  };

  // 11. Backup History Data
  const backupHistory = [
    { time: '12 July 2026 - 03:00 AM', size: '14.2 GB', status: 'Success', id: 'BK-1092' },
    { time: '11 July 2026 - 03:00 AM', size: '14.1 GB', status: 'Success', id: 'BK-1091' }
  ];

  // 12. Advanced / Developer mode
  const [developerMode, setDeveloperMode] = useState(false);
  const [auditLogging, setAuditLogging] = useState(true);

  const categories = [
    { id: 'profile', name: 'Profile', desc: 'Configure account credentials', icon: User },
    { id: 'organization', name: 'Organization', desc: 'Business and office defaults', icon: Building },
    { id: 'security', name: 'Security', desc: 'Passwords and authentication', icon: Shield },
    { id: 'notifications', name: 'Notifications', desc: 'Configure alert switches', icon: Bell },
    { id: 'appearance', name: 'Appearance', desc: 'Select styling colors', icon: Paintbrush },
    { id: 'region', name: 'Language & Region', desc: 'Timezones and locale', icon: Globe },
    { id: 'integrations', name: 'Integrations', desc: 'Connect Slack, Outlook, Teams', icon: Cloud },
    { id: 'assets', name: 'Asset Preferences', desc: 'Generate codes and tags', icon: Package },
    { id: 'permissions', name: 'User Permissions', desc: 'Edit role matrices', icon: UsersIcon },
    { id: 'backup', name: 'Backup & Recovery', desc: 'Download system databases', icon: Database },
    { id: 'advanced', name: 'Advanced Settings', desc: 'Developer console mode', icon: SettingsIcon }
  ];

  // Simple Helper for custom Lucide icons (Since we can\'t import Users from Lucide React on the fly safely, let\'s map Users to hardcoded custom SVG or hardcode it)
  function UsersIcon(props) {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }

  const handleTerminateAllSessions = () => {
    setActiveSessions(activeSessions.filter(s => s.current));
    alert('All other active device sessions have been terminated.');
  };

  return (
    <div className="settings-page-container">
      {/* 1. PAGE HEADER */}
      <div className="settings-page-header">
        <div className="settings-header-info">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">
            Manage your account, organization preferences, notifications, security, integrations, and application appearance.
          </p>
        </div>

        <div className="settings-header-actions">
          <button className="btn-settings-action primary" onClick={handleSaveChanges}>
            <CheckCircle size={16} />
            Save Changes
          </button>
          <button className="btn-settings-action secondary" onClick={handleResetChanges} title="Reset Changes">
            Reset
          </button>
        </div>
      </div>

      {/* 2. SPLIT LAYOUT GRID */}
      <div className="settings-layout-grid">
        {/* Left Sticky Navigation */}
        <aside className="settings-sticky-nav">
          {categories.map(cat => {
            const Icon = cat.icon;
            return (
              <div 
                key={cat.id} 
                className={`settings-nav-item ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                <Icon className="settings-nav-icon" />
                <div className="settings-nav-details">
                  <span className="settings-nav-title">{cat.name}</span>
                  <span className="settings-nav-desc">{cat.desc}</span>
                </div>
              </div>
            );
          })}
        </aside>

        {/* Right Content Section Forms */}
        <main className="settings-content-pane">
          {/* PROFILE SECTION */}
          {activeCategory === 'profile' && (
            <div className="settings-card-section">
              <h3 className="settings-card-title">Profile Settings</h3>
              
              <div className="profile-photo-row">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100" 
                  alt="Avatar" 
                  className="profile-avatar-frame"
                />
                <div className="upload-button-group">
                  <button className="btn-settings-action secondary">Upload Photo</button>
                  <button className="btn-settings-action secondary" style={{ color: '#ef4444' }}>Remove</button>
                </div>
              </div>

              <div className="settings-form-grid">
                <div className="settings-form-group">
                  <label className="settings-label">Full Name</label>
                  <input type="text" className="settings-input" value={profileName} onChange={e => setProfileName(e.target.value)} />
                </div>
                <div className="settings-form-group">
                  <label className="settings-label">Email Address</label>
                  <input type="email" className="settings-input" value={profileEmail} onChange={e => setProfileEmail(e.target.value)} />
                </div>
                <div className="settings-form-group">
                  <label className="settings-label">Phone Number</label>
                  <input type="text" className="settings-input" value={profilePhone} onChange={e => setProfilePhone(e.target.value)} />
                </div>
                <div className="settings-form-group">
                  <label className="settings-label">Employee ID</label>
                  <input type="text" className="settings-input" value={profileEmpId} disabled />
                </div>
                <div className="settings-form-group">
                  <label className="settings-label">Department</label>
                  <input type="text" className="settings-input" value={profileDept} disabled />
                </div>
                <div className="settings-form-group">
                  <label className="settings-label">System Role</label>
                  <input type="text" className="settings-input" value={profileRole} disabled />
                </div>
                <div className="settings-form-group">
                  <label className="settings-label">Job Title</label>
                  <input type="text" className="settings-input" value={profileTitle} onChange={e => setProfileTitle(e.target.value)} />
                </div>
                <div className="settings-form-group">
                  <label className="settings-label">Location</label>
                  <input type="text" className="settings-input" value={profileLocation} onChange={e => setProfileLocation(e.target.value)} />
                </div>
                <div className="settings-form-group full-width">
                  <label className="settings-label">Biography</label>
                  <textarea className="settings-textarea" value={profileBio} onChange={e => setProfileBio(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* ORGANIZATION SETTINGS */}
          {activeCategory === 'organization' && (
            <div className="settings-card-section">
              <h3 className="settings-card-title">Organization Preferences</h3>
              
              <div className="settings-form-grid">
                <div className="settings-form-group">
                  <label className="settings-label">Organization Name</label>
                  <input type="text" className="settings-input" value={orgName} onChange={e => setOrgName(e.target.value)} />
                </div>
                <div className="settings-form-group">
                  <label className="settings-label">Company Address</label>
                  <input type="text" className="settings-input" value={orgAddress} onChange={e => setOrgAddress(e.target.value)} />
                </div>
                <div className="settings-form-group">
                  <label className="settings-label">TimeZone</label>
                  <select className="settings-select" value={orgTimezone} onChange={e => setOrgTimezone(e.target.value)}>
                    <option value="GMT+05:30 (India Standard Time)">GMT+05:30 (India Standard Time)</option>
                    <option value="GMT+00:00 (UTC)">GMT+00:00 (UTC)</option>
                    <option value="GMT-05:00 (Eastern Time)">GMT-05:00 (Eastern Time)</option>
                  </select>
                </div>
                <div className="settings-form-group">
                  <label className="settings-label">Working Hours</label>
                  <input type="text" className="settings-input" value={orgWorkingHours} onChange={e => setOrgWorkingHours(e.target.value)} />
                </div>
                <div className="settings-form-group">
                  <label className="settings-label">Currency Symbol</label>
                  <select className="settings-select" value={orgCurrency} onChange={e => setOrgCurrency(e.target.value)}>
                    <option value="INR (₹)">INR (₹)</option>
                    <option value="USD ($)">USD ($)</option>
                    <option value="EUR (€)">EUR (€)</option>
                  </select>
                </div>
                <div className="settings-form-group">
                  <label className="settings-label">Fiscal Year Calendar</label>
                  <input type="text" className="settings-input" value={orgFiscalYear} onChange={e => setOrgFiscalYear(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* SECURITY SECTION */}
          {activeCategory === 'security' && (
            <div className="settings-card-section">
              <h3 className="settings-card-title">Security & Authentications</h3>

              <div className="settings-form-grid">
                <div className="settings-form-group full-width">
                  <div className="toggle-switch-row">
                    <div className="toggle-label-block">
                      <span className="toggle-label-title">Enable Two-Factor Authentication (2FA)</span>
                      <span className="toggle-label-desc">Protect your account with an extra verification code dispatched to your trusted mobile device.</span>
                    </div>
                    <label className="switch-box">
                      <input 
                        type="checkbox" 
                        checked={twoFactorEnabled} 
                        onChange={() => setTwoFactorEnabled(!twoFactorEnabled)} 
                      />
                      <span className="switch-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="settings-form-group">
                  <label className="settings-label">Idle Session Timeout</label>
                  <select className="settings-select" value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)}>
                    <option value="30 minutes">30 minutes</option>
                    <option value="60 minutes">60 minutes</option>
                    <option value="120 minutes">120 minutes</option>
                  </select>
                </div>
              </div>

              {/* Active Sessions List */}
              <div style={{ marginTop: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>Active Device Sessions</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {activeSessions.map(sess => (
                    <div key={sess.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#f8fafc' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: '#e2e8f0' }}>
                          <Lock size={16} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
                          <span style={{ fontSize: '13.5px', fontWeight: '600' }}>
                            {sess.device} {sess.current && <span style={{ color: '#2563eb', fontSize: '11px', fontWeight: '700', marginLeft: '6px' }}>(Current Session)</span>}
                          </span>
                          <span style={{ fontSize: '11.5px', color: '#6b7280' }}>IP: {sess.ip} • {sess.location}</span>
                        </div>
                      </div>
                      {!sess.current && (
                        <button style={{ color: '#ef4444', fontSize: '12.5px', fontWeight: '600' }}>Revoke Access</button>
                      )}
                    </div>
                  ))}
                </div>
                <button 
                  className="btn-settings-action secondary" 
                  onClick={handleTerminateAllSessions}
                  style={{ marginTop: '16px', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                >
                  Terminate All Other Sessions
                </button>
              </div>
            </div>
          )}

          {/* NOTIFICATION SETTINGS */}
          {activeCategory === 'notifications' && (
            <div className="settings-card-section">
              <h3 className="settings-card-title">Notification Channels</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="toggle-switch-row">
                  <div className="toggle-label-block">
                    <span className="toggle-label-title">Email Notifications</span>
                    <span className="toggle-label-desc">Receive security audits and reports directly in your inbox.</span>
                  </div>
                  <label className="switch-box">
                    <input type="checkbox" checked={notifSwitches.email} onChange={() => handleToggleNotif('email')} />
                    <span className="switch-slider"></span>
                  </label>
                </div>

                <div className="toggle-switch-row">
                  <div className="toggle-label-block">
                    <span className="toggle-label-title">Desktop Push Notifications</span>
                    <span className="toggle-label-desc">Display real-time desktop toast reminders for overdue returns.</span>
                  </div>
                  <label className="switch-box">
                    <input type="checkbox" checked={notifSwitches.desktop} onChange={() => handleToggleNotif('desktop')} />
                    <span className="switch-slider"></span>
                  </label>
                </div>

                <div className="toggle-switch-row">
                  <div className="toggle-label-block">
                    <span className="toggle-label-title">Maintenance Ticket Alerts</span>
                    <span className="toggle-label-desc">Notify whenever a request is approved, closed, or raised.</span>
                  </div>
                  <label className="switch-box">
                    <input type="checkbox" checked={notifSwitches.maintenance} onChange={() => handleToggleNotif('maintenance')} />
                    <span className="switch-slider"></span>
                  </label>
                </div>

                <div className="toggle-switch-row">
                  <div className="toggle-label-block">
                    <span className="toggle-label-title">Resource Booking Reminders</span>
                    <span className="toggle-label-desc">Receive confirmation of Room bookings or cancellations.</span>
                  </div>
                  <label className="switch-box">
                    <input type="checkbox" checked={notifSwitches.booking} onChange={() => handleToggleNotif('booking')} />
                    <span className="switch-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* APPEARANCE SECTION */}
          {activeCategory === 'appearance' && (
            <div className="settings-card-section">
              <h3 className="settings-card-title">Appearance & Customizations</h3>
              
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '14px' }}>Visual Theme Mode</h4>
                <div className="appearance-grid">
                  <div className={`theme-card-option ${themeMode === 'light' ? 'active' : ''}`} onClick={() => setThemeMode('light')}>
                    <div className="theme-mock-window">
                      <div className="theme-mock-sidebar"></div>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>Light Mode</span>
                  </div>
                  
                  <div className={`theme-card-option ${themeMode === 'dark' ? 'active' : ''}`} onClick={() => setThemeMode('dark')}>
                    <div className="theme-mock-window dark">
                      <div className="theme-mock-sidebar"></div>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>Dark Mode</span>
                  </div>

                  <div className={`theme-card-option ${themeMode === 'system' ? 'active' : ''}`} onClick={() => setThemeMode('system')}>
                    <div className="theme-mock-window" style={{ background: 'linear-gradient(90deg, #ffffff 50%, #0f172a 50%)' }}></div>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>System Default</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>Branding Accent Color</h4>
                <div className="theme-color-picker">
                  {['blue', 'cyan', 'purple', 'green'].map(color => {
                    let hex = '#2563eb';
                    if (color === 'cyan') hex = '#06b6d4';
                    if (color === 'purple') hex = '#8b5cf6';
                    if (color === 'green') hex = '#10b981';

                    return (
                      <div 
                        key={color}
                        className={`accent-picker-dot ${accentColor === color ? 'active' : ''}`}
                        style={{ backgroundColor: hex }}
                        onClick={() => setAccentColor(color)}
                      >
                        {accentColor === color && '✓'}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* LANGUAGE & REGION */}
          {activeCategory === 'region' && (
            <div className="settings-card-section">
              <h3 className="settings-card-title">Language & Regional Formats</h3>
              
              <div className="settings-form-grid">
                <div className="settings-form-group">
                  <label className="settings-label">Primary Language</label>
                  <select className="settings-select" value={langRegion.lang} onChange={e => setLangRegion({ ...langRegion, lang: e.target.value })}>
                    <option value="English (United States)">English (United States)</option>
                    <option value="English (United Kingdom)">English (United Kingdom)</option>
                    <option value="Hindi (India)">Hindi (India)</option>
                  </select>
                </div>
                <div className="settings-form-group">
                  <label className="settings-label">Time Format</label>
                  <select className="settings-select" value={langRegion.timeFormat} onChange={e => setLangRegion({ ...langRegion, timeFormat: e.target.value })}>
                    <option value="12 Hours">12 Hours (e.g. 02:00 PM)</option>
                    <option value="24 Hours">24 Hours (e.g. 14:00)</option>
                  </select>
                </div>
                <div className="settings-form-group">
                  <label className="settings-label">Number Formatting</label>
                  <select className="settings-select" value={langRegion.numberFormat} onChange={e => setLangRegion({ ...langRegion, numberFormat: e.target.value })}>
                    <option value="1,234,567.89">1,234,567.89</option>
                    <option value="1.234.567,89">1.234.567,89</option>
                  </select>
                </div>
                <div className="settings-form-group">
                  <label className="settings-label">Target Region</label>
                  <input type="text" className="settings-input" value={langRegion.region} onChange={e => setLangRegion({ ...langRegion, region: e.target.value })} />
                </div>
              </div>
            </div>
          )}

          {/* INTEGRATIONS SECTION */}
          {activeCategory === 'integrations' && (
            <div className="settings-card-section">
              <h3 className="settings-card-title">Connected Integrations</h3>
              
              <div className="integrations-cards-grid">
                {integrationsList.map(item => (
                  <div key={item.id} className="integration-item-card">
                    <div className="integration-card-logo-box">
                      {item.logo}
                    </div>
                    <div className="integration-card-content">
                      <h4 className="integration-card-title">{item.name}</h4>
                      <p className="integration-card-desc">{item.desc}</p>
                      
                      <div className="integration-status-btn-row">
                        <span className={`integration-status-indicator ${item.status === 'Connected' ? 'connected' : 'disconnected'}`}>
                          <span className="integration-status-dot"></span>
                          {item.status}
                        </span>
                        
                        <button 
                          className={`btn-integration ${item.status === 'Connected' ? 'disconnect' : 'connect'}`}
                          onClick={() => handleToggleIntegration(item.id)}
                        >
                          {item.status === 'Connected' ? 'Disconnect' : 'Connect'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ASSET PREFERENCES */}
          {activeCategory === 'assets' && (
            <div className="settings-card-section">
              <h3 className="settings-card-title">Asset Control Preferences</h3>
              
              <div className="settings-form-grid">
                <div className="settings-form-group full-width">
                  <div className="toggle-switch-row">
                    <div className="toggle-label-block">
                      <span className="toggle-label-title">Auto Generate Asset Tags</span>
                      <span className="toggle-label-desc">Auto provision tags on registration using template structure (e.g. AF-LAP-001).</span>
                    </div>
                    <label className="switch-box">
                      <input type="checkbox" checked={autoGenTags} onChange={() => setAutoGenTags(!autoGenTags)} />
                      <span className="switch-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="settings-form-group">
                  <label className="settings-label">Default Asset Category</label>
                  <select className="settings-select" value={defaultCategory} onChange={e => setDefaultCategory(e.target.value)}>
                    <option value="IT Hardware">IT Hardware</option>
                    <option value="Furniture">Office Furniture</option>
                    <option value="Vehicles">Company Vehicles</option>
                  </select>
                </div>

                <div className="settings-form-group">
                  <label className="settings-label">Default Maintenance Cycle</label>
                  <select className="settings-select" value={defaultMaintenanceCycle} onChange={e => setDefaultMaintenanceCycle(e.target.value)}>
                    <option value="90 Days">90 Days</option>
                    <option value="180 Days">180 Days</option>
                    <option value="360 Days">360 Days</option>
                  </select>
                </div>

                <div className="settings-form-group">
                  <div className="toggle-switch-row">
                    <div className="toggle-label-block">
                      <span className="toggle-label-title">QR Code Automation</span>
                      <span className="toggle-label-desc">Render dynamic QR codes for easy mobile scanning.</span>
                    </div>
                    <label className="switch-box">
                      <input type="checkbox" checked={qrGeneration} onChange={() => setQrGeneration(!qrGeneration)} />
                      <span className="switch-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="settings-form-group">
                  <div className="toggle-switch-row">
                    <div className="toggle-label-block">
                      <span className="toggle-label-title">Barcode Generation</span>
                      <span className="toggle-label-desc">Render barcode tags for standard scanning equipment.</span>
                    </div>
                    <label className="switch-box">
                      <input type="checkbox" checked={barcodeGeneration} onChange={() => setBarcodeGeneration(!barcodeGeneration)} />
                      <span className="switch-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* USER PERMISSIONS */}
          {activeCategory === 'permissions' && (
            <div className="settings-card-section">
              <h3 className="settings-card-title">User Permissions Matrix</h3>
              
              <div className="permission-matrix-card">
                <table className="permission-table">
                  <thead>
                    <tr>
                      <th>System Role</th>
                      <th style={{ textAlign: 'center' }}>Read</th>
                      <th style={{ textAlign: 'center' }}>Create</th>
                      <th style={{ textAlign: 'center' }}>Update</th>
                      <th style={{ textAlign: 'center' }}>Delete</th>
                      <th style={{ textAlign: 'center' }}>Approve</th>
                      <th style={{ textAlign: 'center' }}>Export</th>
                    </tr>
                  </thead>
                  <tbody>
                    {permissionGrid.map((row, rIndex) => (
                      <tr key={row.role}>
                        <td className="permission-role-cell">{row.role}</td>
                        <td className="permission-checkbox-cell">
                          <input 
                            type="checkbox" 
                            className="permission-custom-checkbox"
                            checked={row.read} 
                            onChange={() => handleTogglePermission(rIndex, 'read')}
                          />
                        </td>
                        <td className="permission-checkbox-cell">
                          <input 
                            type="checkbox" 
                            className="permission-custom-checkbox"
                            checked={row.create} 
                            disabled={row.role === 'Admins' ? true : false}
                            onChange={() => handleTogglePermission(rIndex, 'create')}
                          />
                        </td>
                        <td className="permission-checkbox-cell">
                          <input 
                            type="checkbox" 
                            className="permission-custom-checkbox"
                            checked={row.update} 
                            disabled={row.role === 'Admins' ? true : false}
                            onChange={() => handleTogglePermission(rIndex, 'update')}
                          />
                        </td>
                        <td className="permission-checkbox-cell">
                          <input 
                            type="checkbox" 
                            className="permission-custom-checkbox"
                            checked={row.delete} 
                            disabled={row.role === 'Admins' ? true : false}
                            onChange={() => handleTogglePermission(rIndex, 'delete')}
                          />
                        </td>
                        <td className="permission-checkbox-cell">
                          <input 
                            type="checkbox" 
                            className="permission-custom-checkbox"
                            checked={row.approve} 
                            disabled={row.role === 'Admins' ? true : false}
                            onChange={() => handleTogglePermission(rIndex, 'approve')}
                          />
                        </td>
                        <td className="permission-checkbox-cell">
                          <input 
                            type="checkbox" 
                            className="permission-custom-checkbox"
                            checked={row.export} 
                            disabled={row.role === 'Admins' ? true : false}
                            onChange={() => handleTogglePermission(rIndex, 'export')}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BACKUP & RECOVERY */}
          {activeCategory === 'backup' && (
            <div className="settings-card-section">
              <h3 className="settings-card-title">Backup & System Recovery</h3>
              
              <div style={{ display: 'flex', gap: '16px' }}>
                <button className="btn-settings-action primary">
                  <Database size={16} />
                  Initiate Instant Backup
                </button>
                <button className="btn-settings-action secondary">
                  <Download size={16} />
                  Download Latest Schema
                </button>
              </div>

              <div style={{ marginTop: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>Database Backup History</h4>
                <div className="backup-history-panel">
                  {backupHistory.map(bk => (
                    <div key={bk.id} className="backup-history-item">
                      <div className="backup-item-left">
                        <span className="backup-item-title">{bk.time} ({bk.id})</span>
                        <span className="backup-item-meta">Storage: {bk.size} • Server Node: IN-WEST-1</span>
                      </div>
                      <span className="backup-status-pill">
                        {bk.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ADVANCED SETTINGS */}
          {activeCategory === 'advanced' && (
            <div className="settings-card-section">
              <h3 className="settings-card-title">Advanced Developer Configuration</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div className="toggle-switch-row">
                  <div className="toggle-label-block">
                    <span className="toggle-label-title">Enable Developer API Mode</span>
                    <span className="toggle-label-desc">Generates workspace tokens to integrate third-party audit crawlers.</span>
                  </div>
                  <label className="switch-box">
                    <input type="checkbox" checked={developerMode} onChange={() => setDeveloperMode(!developerMode)} />
                    <span className="switch-slider"></span>
                  </label>
                </div>

                <div className="toggle-switch-row">
                  <div className="toggle-label-block">
                    <span className="toggle-label-title">Audit Logging</span>
                    <span className="toggle-label-desc">Enable tracking on every database fetch, allocation status change, and user login logs.</span>
                  </div>
                  <label className="switch-box">
                    <input type="checkbox" checked={auditLogging} onChange={() => setAuditLogging(!auditLogging)} />
                    <span className="switch-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Floating Right Information Panel */}
        <aside className="settings-sidebar-right">
          <div className="sidebar-status-card">
            <h4 className="sidebar-heading">System status Overview</h4>
            
            <div className="status-grid">
              <div className="status-grid-item">
                <span className="status-item-label">Server Status</span>
                <span className="status-item-value">
                  <span className="status-green-dot"></span>
                  Operational
                </span>
              </div>
              <div className="status-grid-item">
                <span className="status-item-label">Database Health</span>
                <span className="status-item-value">
                  <span className="status-green-dot"></span>
                  Healthy (99.9%)
                </span>
              </div>
              <div className="status-grid-item">
                <span className="status-item-label">API Gateway</span>
                <span className="status-item-value">
                  <span className="status-green-dot"></span>
                  Operational
                </span>
              </div>
              <div className="status-grid-item">
                <span className="status-item-label">License Key</span>
                <span className="status-item-value" style={{ color: '#2563eb' }}>
                  Enterprise Active
                </span>
              </div>
              <div className="status-grid-item">
                <span className="status-item-label">System Version</span>
                <span className="status-item-value">
                  v2.4.0-stable
                </span>
              </div>
              <div className="status-grid-item">
                <span className="status-item-label">Last Sync Logs</span>
                <span className="status-item-value" style={{ fontSize: '11.5px', color: '#6b7280' }}>
                  2 minutes ago
                </span>
              </div>
            </div>
          </div>

          <div className="sidebar-status-card">
            <h4 className="sidebar-heading">Storage Consumption</h4>
            <div className="storage-usage-meter-box">
              <div className="storage-usage-bar-frame">
                <div className="storage-usage-bar-fill" style={{ width: '28.4%' }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#6b7280' }}>Used: 14.2 GB</span>
                <span style={{ fontWeight: '600' }}>Limit: 50.0 GB</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* 3. SUCCESS TOAST POP-UP */}
      {showToast && (
        <div className="toast-success-banner">
          <CheckCircle size={18} />
          Changes saved successfully!
        </div>
      )}
    </div>
  );
};

export default Settings;
