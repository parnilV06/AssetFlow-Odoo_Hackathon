import React, { useState } from 'react';
import { Edit2, MoreVertical, Search, ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react';
import Button from '../../components/Button/Button';
import SearchInput from '../../components/Input/SearchInput';
import StatusBadge from '../../components/Status/StatusBadge';
import { Table, TableHeader, TableRow } from '../../components/Table/Table';
import Pagination from '../../components/Table/Pagination';
import './AuditCycle.css';

// Mock Data
const auditAssets = [
  { id: 'AF-0012', name: 'Dell XPS 13 Laptop', dept: 'IT', auditor: 'Rahul Sharma', status: 'Verified', remarks: 'Good condition' },
  { id: 'AF-0045', name: 'Epson Projector', dept: 'IT', auditor: 'Priya Singh', status: 'Missing', remarks: 'Not found' },
  { id: 'AF-0078', name: 'Ergonomic Chair', dept: 'HR', auditor: 'Amit Patil', status: 'Verified', remarks: '-' },
  { id: 'AF-0102', name: 'Toyota Innova', dept: 'Operations', auditor: 'Vikram Joshi', status: 'Damaged', remarks: 'Front bumper damaged' },
  { id: 'AF-0251', name: 'Meeting Room B', dept: 'Administration', auditor: 'Sneha Iyer', status: 'Verified', remarks: '-' }
];

const AuditCycle = () => {
  const [activeTab, setActiveTab] = useState('Assets');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="page-container">
      <div className="audit-page">
        
        {/* Header Row */}
        <div className="page-header">
          <div className="page-actions" style={{ marginBottom: 0 }}>
            <div className="audit-title-section" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h1 className="page-title" style={{ margin: 0 }}>Audit Cycle: May 2025</h1>
              <StatusBadge status="In Progress" />
            </div>
            <div>
              <Button variant="secondary" icon={Edit2}>Edit Cycle</Button>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="audit-kpi-grid">
          <div className="audit-kpi-card">
            <div className="kpi-title-row">
              <span className="kpi-name" style={{color: '#3b82f6'}}>Total Assets</span>
            </div>
            <div className="kpi-value-row">
              <span className="kpi-number">256</span>
            </div>
            <div className="kpi-trend blue">
              <ArrowRight size={14} /> 256/256
            </div>
          </div>

          <div className="audit-kpi-card">
            <div className="kpi-title-row">
              <span className="kpi-name" style={{color: '#22c55e'}}>Verified</span>
            </div>
            <div className="kpi-value-row">
              <span className="kpi-number">198</span>
              <span className="kpi-percent">77%</span>
            </div>
            <div className="kpi-trend green">
              <ArrowUpRight size={14} /> 15 today
            </div>
          </div>

          <div className="audit-kpi-card">
            <div className="kpi-title-row">
              <span className="kpi-name" style={{color: '#ef4444'}}>Missing</span>
            </div>
            <div className="kpi-value-row">
              <span className="kpi-number">12</span>
              <span className="kpi-percent">5%</span>
            </div>
            <div className="kpi-trend red">
              <ArrowUpRight size={14} /> 2 new
            </div>
          </div>

          <div className="audit-kpi-card">
            <div className="kpi-title-row">
              <span className="kpi-name" style={{color: '#f97316'}}>Damaged</span>
            </div>
            <div className="kpi-value-row">
              <span className="kpi-number">8</span>
              <span className="kpi-percent">3%</span>
            </div>
            <div className="kpi-trend orange">
              <ArrowUpRight size={14} /> 1 new
            </div>
          </div>

          <div className="audit-kpi-card">
            <div className="kpi-title-row">
              <span className="kpi-name" style={{color: '#64748b'}}>Pending</span>
            </div>
            <div className="kpi-value-row">
              <span className="kpi-number">38</span>
              <span className="kpi-percent">15%</span>
            </div>
            <div className="kpi-trend" style={{color: '#64748b'}}>
              <ArrowDownRight size={14} /> 15 done
            </div>
          </div>
        </div>

        {/* Lower Main Content Card */}
        <div className="card" style={{ padding: '24px 32px' }}>
          {/* Navigation Tabs */}
          <div className="audit-tabs">
            {['Assets', 'Auditors', 'Discrepancies', 'Activity'].map(tab => (
              <button 
                key={tab} 
                className={`audit-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="audit-controls">
            <SearchInput 
              placeholder="Search assets..." 
              width="300px" 
            />
            <div>
              <select className="filter-dropdown">
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="missing">Missing</option>
                <option value="damaged">Damaged</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* Audit Table */}
          <Table>
            <TableHeader>
              <th>Asset Tag</th>
              <th>Asset Name</th>
              <th>Department</th>
              <th>Auditor</th>
              <th>Status</th>
              <th>Remarks</th>
              <th style={{ width: '50px' }}></th>
            </TableHeader>
            <tbody>
              {auditAssets.map((asset, index) => (
                <TableRow key={index}>
                  <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{asset.id}</td>
                  <td style={{ fontWeight: 500 }}>{asset.name}</td>
                  <td>{asset.dept}</td>
                  <td>{asset.auditor}</td>
                  <td><StatusBadge status={asset.status} /></td>
                  <td style={{ color: 'var(--text-secondary)' }}>{asset.remarks}</td>
                  <td>
                    <div className="table-actions">
                      <button className="action-btn" aria-label="More actions">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </TableRow>
              ))}
            </tbody>
          </Table>

          {/* Pagination */}
          <div style={{ marginTop: 'var(--spacing-xl)' }}>
            <Pagination 
              currentPage={currentPage}
              totalPages={52}
              totalResults={256}
              resultsPerPage={5}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default AuditCycle;
