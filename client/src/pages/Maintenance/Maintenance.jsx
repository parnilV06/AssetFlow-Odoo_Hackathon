import React, { useState } from 'react';
import SearchInput from '../../components/Input/SearchInput';
import Button from '../../components/Button/Button';
import PriorityBadge from '../../components/Status/PriorityBadge';
import { MoreVertical, Calendar, User, ChevronDown } from 'lucide-react';
import './Maintenance.css';

// Mock Data matching the reference image closely
const MOCK_DATA = {
  pending: [
    {
      id: '#M-1001',
      title: 'AC Not Cooling',
      asset: 'Meeting Room A',
      priority: 'High',
      date: '02 May 2025',
      user: 'Rahul Sharma',
      datePrefix: 'Requested on'
    },
    {
      id: '#M-1002',
      title: 'Projector Issue',
      asset: 'Training Room 1',
      priority: 'Medium',
      date: '03 May 2025',
      user: 'Priya Singh',
      datePrefix: 'Requested on'
    },
    {
      id: '#M-1003',
      title: 'Light Flickering',
      asset: 'Corridor - 2nd Floor',
      priority: 'Low',
      date: '03 May 2025',
      user: 'Amit Patil',
      datePrefix: 'Requested on'
    }
  ],
  approved: [
    {
      id: '#M-1004',
      title: 'Conference Table',
      asset: 'Conference Room',
      priority: 'Medium',
      date: '01 May 2025',
      user: 'Neha Gupta',
      datePrefix: 'Approved on'
    },
    {
      id: '#M-1005',
      title: 'Printer Jam',
      asset: 'Office - 2nd Floor',
      priority: 'High',
      date: '01 May 2025',
      user: 'Rohit Mehta',
      datePrefix: 'Approved on'
    },
    {
      id: '#M-1006',
      title: 'Door Handle Loose',
      asset: 'Main Entrance',
      priority: 'Low',
      date: '02 May 2025',
      user: 'Vikram Joshi',
      datePrefix: 'Approved on'
    }
  ],
  inProgress: [
    {
      id: '#M-1007',
      title: 'Server Overheat',
      asset: 'Server Room',
      technician: 'Karan',
      priority: 'Medium',
      date: '02 May 2025',
      datePrefix: 'Started on'
    },
    {
      id: '#M-1008',
      title: 'Chair Broken',
      asset: 'Workstation 12',
      technician: 'Suresh',
      priority: 'High',
      date: '02 May 2025',
      datePrefix: 'Started on'
    },
    {
      id: '#M-1009',
      title: 'Water Leakage',
      asset: 'Pantry Area',
      technician: 'Imran',
      priority: 'Medium',
      date: '03 May 2025',
      datePrefix: 'Started on'
    }
  ],
  resolved: [
    {
      id: '#M-1010',
      title: 'Wi-Fi Connectivity',
      asset: 'Meeting Room B',
      date: '01 May 2025',
      user: 'Rajesh Kumar',
      datePrefix: 'Resolved on'
    },
    {
      id: '#M-1011',
      title: 'Scanner Not Working',
      asset: 'Admin Office',
      date: '30 Apr 2025',
      user: 'Sneha Iyer',
      datePrefix: 'Resolved on'
    },
    {
      id: '#M-1012',
      title: 'Air Purifier Noise',
      asset: 'HR Cabin',
      date: '29 Apr 2025',
      user: 'Amit Patil',
      datePrefix: 'Resolved on'
    }
  ]
};

const MaintenanceCard = ({ data }) => {
  return (
    <div className="maintenance-card">
      <div className="mc-header">
        <span className="mc-id">{data.id}</span>
        <MoreVertical size={16} className="mc-actions" />
      </div>
      
      <div className="mc-body">
        <div className="mc-title">{data.title}</div>
        <div className="mc-asset">{data.asset}</div>
        
        {data.technician && (
          <div className="mc-technician">Technician: {data.technician}</div>
        )}
        
        {data.priority && (
          <div style={{ marginTop: '10px' }}>
            <PriorityBadge priority={data.priority} />
          </div>
        )}
      </div>

      <div className="mc-footer">
        <div className="mc-date">
          <Calendar size={14} />
          {data.datePrefix} {data.date}
        </div>
        {data.user && (
          <div className="mc-user">
            <User size={14} />
            {data.user}
          </div>
        )}
      </div>
    </div>
  );
};

const Maintenance = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Maintenance Requests</h1>
          <p className="page-subtitle">Track and manage maintenance requests for organizational assets.</p>
        </div>
      </div>

      <div className="page-content maintenance-page">
        <div className="maintenance-controls">
          <div className="controls-left">
            <SearchInput 
              placeholder="Search requests..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              width="250px"
            />
            
            {/* Simple dropdown mock for status filter */}
            <div className="select-wrapper" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--radius-md)',
              padding: '8px 12px',
              fontSize: '0.875rem',
              backgroundColor: 'white',
              cursor: 'pointer',
              color: 'var(--text-main)',
              gap: '8px'
            }}>
              <span>All Status</span>
              <ChevronDown size={16} color="var(--text-secondary)" />
            </div>
          </div>

          <div className="controls-right">
            <Button variant="primary">
              + New Request
            </Button>
          </div>
        </div>

        <div className="kanban-board">
          {/* Pending Column */}
          <div className="kanban-column">
            <div className="column-header">
              <span className="status-dot pending"></span>
              Pending (8)
            </div>
            <div className="kanban-cards">
              {MOCK_DATA.pending.map(item => (
                <MaintenanceCard key={item.id} data={item} />
              ))}
              <div className="load-more">+ 5 more requests</div>
            </div>
          </div>

          {/* Approved Column */}
          <div className="kanban-column">
            <div className="column-header">
              <span className="status-dot approved"></span>
              Approved (5)
            </div>
            <div className="kanban-cards">
              {MOCK_DATA.approved.map(item => (
                <MaintenanceCard key={item.id} data={item} />
              ))}
              <div className="load-more">+ 2 more requests</div>
            </div>
          </div>

          {/* In Progress Column */}
          <div className="kanban-column">
            <div className="column-header">
              <span className="status-dot in-progress"></span>
              In Progress (6)
            </div>
            <div className="kanban-cards">
              {MOCK_DATA.inProgress.map(item => (
                <MaintenanceCard key={item.id} data={item} />
              ))}
              <div className="load-more">+ 3 more requests</div>
            </div>
          </div>

          {/* Resolved Column */}
          <div className="kanban-column">
            <div className="column-header">
              <span className="status-dot resolved"></span>
              Resolved (3)
            </div>
            <div className="kanban-cards">
              {MOCK_DATA.resolved.map(item => (
                <MaintenanceCard key={item.id} data={item} />
              ))}
              <div className="load-more">+ 0 more requests</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
