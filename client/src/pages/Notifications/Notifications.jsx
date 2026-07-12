import React, { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  Calendar, 
  ClipboardCheck, 
  Laptop, 
  Package, 
  ArrowLeftRight, 
  ShieldCheck, 
  Building, 
  Clock, 
  User, 
  Settings, 
  Search, 
  Trash2, 
  Archive, 
  CheckCircle2, 
  X,
  Download,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import './Notifications.css';

const Notifications = () => {
  // Rich Enterprise Mock Notifications List
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      category: 'critical',
      title: 'Overdue Return',
      description: 'Laptop AF-102 assigned to Priya Sharma is overdue by 5 days.',
      assetId: 'AF-102',
      assetName: 'ThinkPad L14 Gen 4',
      department: 'Human Resources',
      employee: 'Priya Sharma',
      priority: 'high',
      time: '10 July 2026',
      timeDiff: '5 days ago',
      sender: 'Asset Auditor System',
      read: false,
      btnLabel: 'View Allocation',
      details: 'This asset was due for return on 10 July 2026. Multiple reminder emails have been dispatched to the employee. Auditor intervention or manual return override required.',
      history: [
        { text: 'Asset Overdue Flagged', time: '10 July 2026 - 06:00 PM' },
        { text: 'Automatic Return Reminder Email Sent', time: '08 July 2026 - 09:00 AM' },
        { text: 'Allocated to Priya Sharma', time: '10 January 2026 - 10:30 AM' }
      ]
    },
    {
      id: 'notif-2',
      category: 'maintenance',
      title: 'Maintenance Request Approved',
      description: 'Dell Latitude AF-220 maintenance request has been approved.',
      assetId: 'AF-220',
      assetName: 'Dell Latitude 7440',
      department: 'Operations',
      employee: 'Rohan Sen',
      priority: 'medium',
      time: '12 July 2026',
      timeDiff: 'Today at 11:30 AM',
      sender: 'Facilities Admin',
      read: false,
      btnLabel: 'Open Request',
      details: 'The repair request filed for keyboard failure has been validated and approved. A hardware ticket is dispatched to the technician.',
      history: [
        { text: 'Maintenance Ticket Approved', time: '12 July 2026 - 11:30 AM' },
        { text: 'Diagnostics Check Performed', time: '11 July 2026 - 04:00 PM' },
        { text: 'Request Submitted by Rohan Sen', time: '11 July 2026 - 09:15 AM' }
      ]
    },
    {
      id: 'notif-3',
      category: 'booking',
      title: 'Conference Room B Booked',
      description: 'Conference Room B successfully booked for tomorrow.',
      assetId: 'ROOM-B',
      assetName: 'Conference Room B (8 Seats)',
      department: 'Information Technology',
      employee: 'Rahul Sharma',
      priority: 'low',
      time: '12 July 2026',
      timeDiff: 'Today at 09:00 AM',
      sender: 'Calendar Scheduler',
      read: true,
      btnLabel: 'View Booking',
      details: 'Room booking request for "Q3 Tech Alignment" is locked. VC equipment and smart display initialized.',
      history: [
        { text: 'Room Booking Confirmed', time: '12 July 2026 - 09:00 AM' },
        { text: 'Scheduling Grid Allocated', time: '12 July 2026 - 08:55 AM' }
      ]
    },
    {
      id: 'notif-4',
      category: 'allocation',
      title: 'Asset Allocated',
      description: 'Laptop AF-405 has been allocated to Aman Verma.',
      assetId: 'AF-405',
      assetName: 'MacBook Air M2',
      department: 'Information Technology',
      employee: 'Aman Verma',
      priority: 'medium',
      time: '11 July 2026',
      timeDiff: 'Yesterday at 04:15 PM',
      sender: 'Rahul Sharma (IT Hub)',
      read: false,
      btnLabel: 'View Asset',
      details: 'MacBook Air M2 (Serial C02XX89A) setup complete with enterprise profiles. Physical asset handed over to Aman Verma.',
      history: [
        { text: 'Asset Allocated & Provisioned', time: '11 July 2026 - 04:15 PM' },
        { text: 'Security Compliance Profiles Implemented', time: '11 July 2026 - 02:00 PM' }
      ]
    },
    {
      id: 'notif-5',
      category: 'transfer',
      title: 'Transfer Request Approved',
      description: 'Projector AF-018 has been transferred from HR to Marketing.',
      assetId: 'AF-018',
      assetName: 'Epson Wireless Projector',
      department: 'Marketing',
      employee: 'Neha Gupta',
      priority: 'low',
      time: '10 July 2026',
      timeDiff: '2 days ago',
      sender: 'Department Custodian',
      read: true,
      btnLabel: 'View Transfer',
      details: 'Transfer request #TR-9942 signed off by Priya Singh (HR) and Neha Gupta (Marketing). Financial depreciation center updated.',
      history: [
        { text: 'Transfer Custody Completed', time: '10 July 2026 - 03:00 PM' },
        { text: 'Transfer Request Approved by HR Head', time: '09 July 2026 - 11:00 AM' }
      ]
    },
    {
      id: 'notif-6',
      category: 'audit',
      title: 'Audit Cycle Starts Tomorrow',
      description: 'Q3 Asset Verification cycle starts tomorrow. Verify allocated devices.',
      assetId: 'AUD-Q3',
      assetName: 'Q3 Asset Verification',
      department: 'Compliance',
      employee: 'All Staff',
      priority: 'high',
      time: '12 July 2026',
      timeDiff: 'Today at 08:00 AM',
      sender: 'Compliance Officer',
      read: false,
      btnLabel: 'Open Audit',
      details: 'Annual Q3 Compliance and asset verification audit cycle goes live. All department heads are requested to complete physically verified equipment counters.',
      history: [
        { text: 'Audit Schedule Released', time: '12 July 2026 - 08:00 AM' },
        { text: 'Auditor Team Assigned', time: '10 July 2026 - 10:00 AM' }
      ]
    }
  ]);

  // Sidebar List Data
  const sidebarEvents = {
    maintenance: [
      { id: 'm1', name: 'Printer AF-993 Calibration', date: 'Due Today - 4:00 PM', status: 'Pending', type: 'warning' },
      { id: 'm2', name: 'Server Rack 2 A/C Overhaul', date: 'Due Tomorrow - 10:00 AM', status: 'Approved', type: 'info' }
    ],
    bookings: [
      { id: 'b1', name: 'Boardroom A (Q3 Presentation)', date: 'Today, 2:00 PM - 3:30 PM', status: 'Confirmed', type: 'success' },
      { id: 'b2', name: 'Training Lab (New Hire Induction)', date: 'July 15, 9:00 AM', status: 'Scheduled', type: 'info' }
    ],
    approvals: [
      { id: 'a1', name: 'Priya Sharma - iPhone 15 Request', date: 'Submitted 3 hrs ago', status: 'Pending Approval', type: 'amber' },
      { id: 'a2', name: 'Rohan Sen - UPS Replacement', date: 'Submitted Yesterday', status: 'Review Needed', type: 'warning' }
    ],
    updates: [
      { id: 'u1', name: 'Depreciation Rules Update', date: 'Released July 11', status: 'v2.4.0', type: 'success' },
      { id: 'u2', name: 'Asset Logs Auto-backup Enabled', date: 'Released July 10', status: 'Active', type: 'info' }
    ]
  };

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [deptFilter, setDeptFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  // Selected Notification & Drawer State
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Counter Totals (KPI statistics)
  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalCount = notifications.filter(n => n.category === 'critical').length;
  const pendingCount = notifications.filter(n => n.category === 'maintenance' && !n.read).length + 3; // Mocked buffer
  const todayCount = notifications.filter(n => n.timeDiff.includes('Today')).length + 28; // Mocked buffer

  // Action methods
  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const handleToggleRead = (id, e) => {
    e.stopPropagation();
    setNotifications(notifications.map(n => {
      if (n.id === id) {
        return { ...n, read: !n.read };
      }
      return n;
    }));
  };

  const handleArchive = (id, e) => {
    if (e) e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
    if (selectedNotif && selectedNotif.id === id) {
      setIsDrawerOpen(false);
    }
  };

  const handleDelete = (id, e) => {
    if (e) e.stopPropagation();
    setNotifications(notifications.filter(n => n.id !== id));
    if (selectedNotif && selectedNotif.id === id) {
      setIsDrawerOpen(false);
    }
  };

  const handleCardClick = (notif) => {
    setSelectedNotif(notif);
    setIsDrawerOpen(true);
    // Mark as read when opening details
    setNotifications(notifications.map(n => {
      if (n.id === notif.id) {
        return { ...n, read: true };
      }
      return n;
    }));
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'critical': return <AlertTriangle size={18} />;
      case 'maintenance': return <Settings size={18} />;
      case 'booking': return <Calendar size={18} />;
      case 'allocation': return <Laptop size={18} />;
      case 'transfer': return <ArrowLeftRight size={18} />;
      case 'audit': return <ShieldCheck size={18} />;
      default: return <Bell size={18} />;
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setFilterType('all');
    setPriorityFilter('all');
    setDeptFilter('all');
    setSortBy('newest');
  };

  const exportNotifications = () => {
    const rawData = JSON.stringify(notifications, null, 2);
    const blob = new Blob([rawData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assetflow-notifications.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter & Sort computation
  const getFilteredNotifications = () => {
    let result = [...notifications];

    // Global Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(n => 
        n.title.toLowerCase().includes(q) || 
        n.description.toLowerCase().includes(q) ||
        (n.assetId && n.assetId.toLowerCase().includes(q))
      );
    }

    // Category / Read Toggles
    if (filterType !== 'all') {
      if (filterType === 'unread') {
        result = result.filter(n => !n.read);
      } else if (filterType === 'read') {
        result = result.filter(n => n.read);
      } else if (filterType === 'today') {
        result = result.filter(n => n.timeDiff.includes('Today'));
      } else if (filterType === 'this-week') {
        result = result.filter(n => n.timeDiff.includes('Today') || n.timeDiff.includes('Yesterday') || n.timeDiff.includes('days ago'));
      } else {
        result = result.filter(n => n.category === filterType);
      }
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      result = result.filter(n => n.priority === priorityFilter);
    }

    // Department filter
    if (deptFilter !== 'all') {
      result = result.filter(n => n.department && n.department.toLowerCase().includes(deptFilter.toLowerCase()));
    }

    // Sort order
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return b.id.localeCompare(a.id); // Simple mock order
      } else if (sortBy === 'oldest') {
        return a.id.localeCompare(b.id);
      } else if (sortBy === 'unread') {
        return (a.read === b.read) ? 0 : a.read ? 1 : -1;
      }
      return 0;
    });

    return result;
  };

  const filteredList = getFilteredNotifications();

  return (
    <div className="notifications-container">
      {/* 1. PAGE HEADER */}
      <div className="notif-page-header">
        <div className="notif-header-info">
          <h1 className="notif-title">Notifications</h1>
          <p className="notif-subtitle">
            Stay informed about assets, maintenance requests, bookings, audits, transfers, approvals, and organization updates.
          </p>
        </div>

        <div className="notif-header-actions">
          <button className="btn-notif-action primary" onClick={handleMarkAllRead}>
            <CheckCircle2 size={16} />
            Mark All as Read
          </button>
          <button className="btn-notif-action secondary" onClick={exportNotifications} title="Export Data">
            <Download size={16} />
            Export
          </button>
          <button className="btn-notif-action secondary" title="Notification Settings">
            <Settings size={16} />
            Settings
          </button>
        </div>
      </div>

      {/* 2. HEADER SUMMARY (4 KPI Cards) */}
      <div className="notif-kpi-grid">
        <div className="kpi-card blue" onClick={() => setFilterType('unread')}>
          <div className="kpi-content">
            <h3 className="kpi-number">{unreadCount}</h3>
            <p className="kpi-desc">Unread Notifications</p>
          </div>
          <div className="kpi-icon-wrapper">
            <Bell size={20} />
          </div>
        </div>

        <div className="kpi-card red" onClick={() => setFilterType('critical')}>
          <div className="kpi-content">
            <h3 className="kpi-number">{criticalCount}</h3>
            <p className="kpi-desc">Critical Alerts</p>
          </div>
          <div className="kpi-icon-wrapper">
            <AlertTriangle size={20} />
          </div>
        </div>

        <div className="kpi-card amber" onClick={() => setFilterType('maintenance')}>
          <div className="kpi-content">
            <h3 className="kpi-number">{pendingCount}</h3>
            <p className="kpi-desc">Pending Approvals</p>
          </div>
          <div className="kpi-icon-wrapper">
            <Clock size={20} />
          </div>
        </div>

        <div className="kpi-card green" onClick={() => setFilterType('today')}>
          <div className="kpi-content">
            <h3 className="kpi-number">{todayCount}</h3>
            <p className="kpi-desc">Today's Notifications</p>
          </div>
          <div className="kpi-icon-wrapper">
            <CheckCircle2 size={20} />
          </div>
        </div>
      </div>

      {/* 3. FILTER BAR */}
      <div className="notif-filter-bar">
        <div className="filter-left">
          {/* Search bar */}
          <div className="notif-search-box">
            <Search className="notif-search-icon" />
            <input
              type="text"
              placeholder="Search notifications..."
              className="notif-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Type dropdown */}
          <select 
            className="notif-select-filter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Notifications</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="critical">Critical Alerts</option>
            <option value="today">Today</option>
            <option value="this-week">This Week</option>
            <option value="maintenance">Maintenance</option>
            <option value="booking">Bookings</option>
            <option value="transfer">Transfers</option>
            <option value="audit">Audits</option>
            <option value="allocation">Asset Allocation</option>
          </select>

          {/* Priority filter */}
          <select 
            className="notif-select-filter"
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* Department Filter */}
          <select 
            className="notif-select-filter"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="all">All Departments</option>
            <option value="information technology">Information Technology</option>
            <option value="human resources">Human Resources</option>
            <option value="operations">Operations</option>
            <option value="marketing">Marketing</option>
            <option value="compliance">Compliance</option>
          </select>

          {/* Clear button */}
          {(searchQuery || filterType !== 'all' || priorityFilter !== 'all' || deptFilter !== 'all') && (
            <button className="btn-clear-filters" onClick={handleClearFilters}>
              <X size={14} />
              Clear Filters
            </button>
          )}
        </div>

        {/* Sort Select */}
        <select 
          className="notif-select-filter"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="unread">Unread First</option>
        </select>
      </div>

      {/* 4. SPLIT BODY SECTION */}
      <div className="notif-page-body">
        {/* Left Side: Notification feed list */}
        <div className="notif-feed-list">
          {filteredList.length > 0 ? (
            filteredList.map((notif) => (
              <div className="notif-card-wrapper" key={notif.id}>
                <div 
                  className={`notif-feed-card ${!notif.read ? 'unread' : ''}`}
                  onClick={() => handleCardClick(notif)}
                >
                  {/* Read / Unread Indicator dot */}
                  {!notif.read ? (
                    <div 
                      className="notif-dot-indicator" 
                      onClick={(e) => handleToggleRead(notif.id, e)}
                      title="Mark as Read"
                    />
                  ) : (
                    <div 
                      className="notif-dot-placeholder" 
                      onClick={(e) => handleToggleRead(notif.id, e)}
                      title="Mark as Unread"
                    />
                  )}

                  {/* Icon */}
                  <div className={`notif-icon-circle ${notif.category}`}>
                    {getCategoryIcon(notif.category)}
                  </div>

                  {/* Body Content */}
                  <div className="notif-card-details">
                    <div className="notif-card-top-row">
                      <h4 className="notif-card-title">{notif.title}</h4>
                      <span className="meta-item-time">
                        <Clock size={11} />
                        {notif.timeDiff}
                      </span>
                    </div>

                    <p className="notif-card-desc">{notif.description}</p>

                    {/* Metadata pills */}
                    <div className="notif-card-meta-row">
                      {notif.assetId && (
                        <span className="meta-item-tag code">{notif.assetId}</span>
                      )}
                      {notif.department && (
                        <span className="meta-item-tag">{notif.department}</span>
                      )}
                      <span className={`notif-priority-pill ${notif.priority}`}>
                        {notif.priority}
                      </span>
                      <span className="notif-card-sender">by {notif.sender}</span>
                    </div>
                  </div>

                  {/* Quick Action Controls */}
                  <div className="notif-card-right">
                    <button className="btn-card-action">
                      {notif.btnLabel}
                    </button>

                    <div className="notif-quick-actions-hover">
                      <button 
                        className="notif-hover-btn archive" 
                        title="Archive" 
                        onClick={(e) => handleArchive(notif.id, e)}
                      >
                        <Archive size={14} />
                      </button>
                      <button 
                        className="notif-hover-btn delete" 
                        title="Delete" 
                        onClick={(e) => handleDelete(notif.id, e)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            /* EMPTY STATE */
            <div className="notif-empty-state">
              <div className="empty-state-icon-wrapper">
                <Bell size={36} />
              </div>
              <h3 className="empty-state-title">You're all caught up!</h3>
              <p className="empty-state-desc">
                No new notifications at the moment matching your selected filters.
              </p>
              <button 
                className="btn-notif-action primary" 
                onClick={() => onNavigate ? onNavigate('dashboard') : window.history.back()}
                style={{ alignSelf: 'center', marginTop: '10px' }}
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Event Schedules Sidebar */}
        <aside className="notif-sidebar-right">
          {/* Section: Today's Maintenance */}
          <div className="notif-sidebar-card">
            <h4 className="sidebar-section-title">Today's Maintenance</h4>
            <div className="sidebar-list">
              {sidebarEvents.maintenance.map(item => (
                <div className="sidebar-list-item" key={item.id}>
                  <div className={`sidebar-item-icon ${item.type}`}>
                    <Settings size={14} />
                  </div>
                  <div className="sidebar-item-content">
                    <span className="sidebar-item-name">{item.name}</span>
                    <span className="sidebar-item-date">{item.date}</span>
                  </div>
                  <span className="sidebar-badge-dot" />
                </div>
              ))}
            </div>
          </div>

          {/* Section: Upcoming Bookings */}
          <div className="notif-sidebar-card">
            <h4 className="sidebar-section-title">Upcoming Bookings</h4>
            <div className="sidebar-list">
              {sidebarEvents.bookings.map(item => (
                <div className="sidebar-list-item" key={item.id}>
                  <div className={`sidebar-item-icon ${item.type}`}>
                    <Calendar size={14} />
                  </div>
                  <div className="sidebar-item-content">
                    <span className="sidebar-item-name">{item.name}</span>
                    <span className="sidebar-item-date">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Pending Approvals */}
          <div className="notif-sidebar-card">
            <h4 className="sidebar-section-title">Pending Approvals</h4>
            <div className="sidebar-list">
              {sidebarEvents.approvals.map(item => (
                <div className="sidebar-list-item" key={item.id}>
                  <div className={`sidebar-item-icon ${item.type}`}>
                    <User size={14} />
                  </div>
                  <div className="sidebar-item-content">
                    <span className="sidebar-item-name">{item.name}</span>
                    <span className="sidebar-item-date">{item.date}</span>
                  </div>
                  <span className="sidebar-badge-dot" />
                </div>
              ))}
            </div>
          </div>

          {/* Section: Recent System Updates */}
          <div className="notif-sidebar-card">
            <h4 className="sidebar-section-title">Recent System Updates</h4>
            <div className="sidebar-list">
              {sidebarEvents.updates.map(item => (
                <div className="sidebar-list-item" key={item.id}>
                  <div className={`sidebar-item-icon ${item.type}`}>
                    <Building size={14} />
                  </div>
                  <div className="sidebar-item-content">
                    <span className="sidebar-item-name">{item.name}</span>
                    <span className="sidebar-item-date">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* 5. NOTIFICATION DETAILS SLIDE-OVER DRAWER */}
      <div 
        className={`notif-drawer-backdrop ${isDrawerOpen ? 'open' : ''}`}
        onClick={() => setIsDrawerOpen(false)}
      />

      <div className={`notif-drawer-panel ${isDrawerOpen ? 'open' : ''}`}>
        <div className="drawer-header-row">
          <h3 className="drawer-title-main">Alert Details</h3>
          <button className="drawer-close" onClick={() => setIsDrawerOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {selectedNotif && (
          <div className="drawer-body-scroll">
            {/* Title / Description */}
            <div className="drawer-title-block">
              <span className={`notif-priority-pill ${selectedNotif.priority}`} style={{ alignSelf: 'flex-start' }}>
                {selectedNotif.priority}
              </span>
              <h2 className="drawer-notif-title">{selectedNotif.title}</h2>
              <span className="meta-item-time" style={{ justifyContent: 'flex-start' }}>
                <Clock size={12} />
                Received {selectedNotif.timeDiff} ({selectedNotif.time})
              </span>
            </div>

            <p className="drawer-desc-block">{selectedNotif.description}</p>

            {/* Asset profile detail */}
            {selectedNotif.assetId && (
              <div>
                <h4 className="drawer-section-header">Asset Reference</h4>
                <div className="drawer-asset-item">
                  <div className="drawer-asset-left">
                    <span className="drawer-asset-name">{selectedNotif.assetName || 'Hardware Asset'}</span>
                    <span className="drawer-asset-tag">{selectedNotif.assetId}</span>
                  </div>
                  <div className="meta-item-tag">Tracked</div>
                </div>
              </div>
            )}

            {/* Department info */}
            <div>
              <h4 className="drawer-section-header">Compliance Details</h4>
              <div className="drawer-grid-details">
                <div className="drawer-grid-cell">
                  <span className="drawer-grid-label">Department</span>
                  <span className="drawer-grid-value">{selectedNotif.department || 'All Departments'}</span>
                </div>
                <div className="drawer-grid-cell">
                  <span className="drawer-grid-label">Employee</span>
                  <span className="drawer-grid-value">{selectedNotif.employee || 'System'}</span>
                </div>
                <div className="drawer-grid-cell" style={{ marginTop: '10px' }}>
                  <span className="drawer-grid-label">Source Dispatcher</span>
                  <span className="drawer-grid-value">{selectedNotif.sender}</span>
                </div>
                <div className="drawer-grid-cell" style={{ marginTop: '10px' }}>
                  <span className="drawer-grid-label">Event Category</span>
                  <span className="drawer-grid-value" style={{ textTransform: 'capitalize' }}>{selectedNotif.category}</span>
                </div>
              </div>
            </div>

            {/* Extended logs & description details */}
            <div>
              <h4 className="drawer-section-header">Description Details</h4>
              <p style={{ fontSize: '13.5px', color: '#4b5563', lineHeight: '1.6', margin: 0, textAlign: 'left' }}>
                {selectedNotif.details}
              </p>
            </div>

            {/* Timeline */}
            {selectedNotif.history && (
              <div>
                <h4 className="drawer-section-header">Event Timeline</h4>
                <div className="timeline-list-nest">
                  {selectedNotif.history.map((hist, idx) => (
                    <div className={`timeline-nest-node ${idx === 0 ? 'active' : ''}`} key={idx}>
                      <span className="timeline-nest-dot" />
                      <span className="timeline-nest-title">{hist.text}</span>
                      <span className="timeline-nest-time">{hist.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Drawer actions footer */}
        {selectedNotif && (
          <div className="drawer-footer-actions">
            <button 
              className="btn-drawer-act danger-text" 
              onClick={() => handleDelete(selectedNotif.id)}
            >
              <Trash2 size={14} />
              Delete
            </button>
            <button 
              className="btn-drawer-act outline" 
              onClick={() => handleArchive(selectedNotif.id)}
            >
              <Archive size={14} />
              Archive
            </button>
            <button 
              className="btn-drawer-act primary" 
              onClick={() => setIsDrawerOpen(false)}
            >
              Close Alert
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
