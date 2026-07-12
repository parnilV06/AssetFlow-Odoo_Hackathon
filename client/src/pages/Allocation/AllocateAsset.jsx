import React, { useState } from 'react';
import Button from '../../components/Button/Button';
import StatusBadge from '../../components/Status/StatusBadge';
import './AllocateAsset.css';

const AllocateAsset = () => {
  const [allocateType, setAllocateType] = useState('employee');

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Allocate Asset</h1>
          <p className="page-subtitle">Assign an asset to an employee or department.</p>
        </div>
      </div>

      <div className="page-content allocate-page">
        <div className="allocation-grid">
          
          {/* Left Panel - Asset Details */}
          <div className="allocation-card">
            <h3 className="card-heading">Asset Details</h3>
            
            <div className="asset-preview">
              <img 
                src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=250&h=200" 
                alt="Dell XPS 13 Laptop" 
              />
            </div>
            
            <div className="asset-info-list">
              <div className="info-item">
                <span className="info-value">AF-0012</span>
                <span className="info-value">Dell XPS 13 Laptop</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Category</span>
                <span className="info-value" style={{fontWeight: 400}}>Electronics</span>
              </div>

              <div className="info-item">
                <span className="info-label">Status</span>
                <div style={{marginTop: '4px'}}>
                  <StatusBadge status="Available" />
                </div>
              </div>

              <div className="info-item">
                <span className="info-label">Location</span>
                <span className="info-value" style={{fontWeight: 400}}>IT Room</span>
              </div>

              <div className="info-item">
                <span className="info-label">Condition</span>
                <span className="info-value" style={{fontWeight: 400}}>Excellent</span>
              </div>
            </div>
          </div>

          {/* Center Panel - Allocation Form */}
          <div className="allocation-card">
            <h3 className="card-heading">Allocation Details</h3>
            
            <div className="allocation-form">
              <div className="form-group">
                <label className="form-label">Allocate To</label>
                <select 
                  className="form-select"
                  value={allocateType}
                  onChange={(e) => setAllocateType(e.target.value)}
                >
                  <option value="employee">Employee</option>
                  <option value="department">Department</option>
                </select>
              </div>

              {allocateType === 'employee' ? (
                <div className="form-group">
                  <label className="form-label">Employee</label>
                  <select className="form-select">
                    <option value="">Select Employee...</option>
                    <option value="1">Priya Singh</option>
                    <option value="2">Rahul Sharma</option>
                    <option value="3">Amit Patil</option>
                  </select>
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select className="form-select">
                    <option value="">Select Department...</option>
                    <option value="1">Information Technology</option>
                    <option value="2">Human Resources</option>
                    <option value="3">Finance</option>
                  </select>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Expected Return Date</label>
                <input type="date" className="form-input" defaultValue="2025-06-15" />
              </div>

              <div className="form-group">
                <label className="form-label">Notes (Optional)</label>
                <textarea 
                  className="form-textarea" 
                  placeholder="Enter details here..."
                ></textarea>
              </div>

              <div className="form-actions">
                <Button variant="secondary">Cancel</Button>
                <Button variant="primary">Allocate Asset</Button>
              </div>
            </div>
          </div>

          {/* Right Panel - Allocation History */}
          <div className="allocation-card history-panel">
            <h3 className="card-heading">Allocation History</h3>
            
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-date">10 May 2025</div>
                <div className="timeline-action">Allocated to</div>
                <div className="timeline-user">Aman Verma</div>
                <div className="timeline-status">In Excellent condition</div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot returned"></div>
                <div className="timeline-date">05 Apr 2025</div>
                <div className="timeline-action">Returned by</div>
                <div className="timeline-user">Neha Gupta</div>
                <div className="timeline-status">In Good condition</div>
              </div>

              <div className="timeline-item">
                <div className="timeline-dot"></div>
                <div className="timeline-date">01 Feb 2025</div>
                <div className="timeline-action">Allocated to</div>
                <div className="timeline-user">Neha Gupta</div>
                <div className="timeline-status">by Rahul Sharma</div>
              </div>
            </div>

            <a className="view-history-link">View full history</a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AllocateAsset;
