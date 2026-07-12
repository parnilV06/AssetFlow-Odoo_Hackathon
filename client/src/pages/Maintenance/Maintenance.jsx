import React, { useState, useEffect } from 'react';
import SearchInput from '../../components/Input/SearchInput';
import Button from '../../components/Button/Button';
import PriorityBadge from '../../components/Status/PriorityBadge';
import { MoreVertical, Calendar, User, ChevronDown } from 'lucide-react';
import Modal from '../../components/Common/Modal';
import { maintenanceService } from '../../services/maintenance';
import { assetService } from '../../services/asset';
import { employeeService } from '../../services/employee';
import { useAuth } from '../../context/AuthContext';
import './Maintenance.css';

const MaintenanceCard = ({ data, onClickAction }) => {
  return (
    <div className="maintenance-card" onClick={() => onClickAction(data)} style={{ cursor: 'pointer' }}>
      <div className="mc-header">
        <span className="mc-id">#{data.id.substring(0, 8).toUpperCase()}</span>
        <MoreVertical size={16} className="mc-actions" />
      </div>
      
      <div className="mc-body">
        <div className="mc-title" style={{ fontWeight: 'bold' }}>{data.issueDescription}</div>
        <div className="mc-asset">{data.asset?.name || 'Unknown Asset'} ({data.asset?.assetTag})</div>
        
        {data.technician && (
          <div className="mc-technician">Technician: {data.technician.name}</div>
        )}
        
        <div style={{ marginTop: '10px' }}>
          <PriorityBadge priority={data.priority} />
        </div>
      </div>

      <div className="mc-footer">
        <div className="mc-date">
          <Calendar size={14} />
          {new Date(data.updatedAt || data.createdAt).toLocaleDateString()}
        </div>
        {data.requester && (
          <div className="mc-user">
            <User size={14} />
            {data.requester.name}
          </div>
        )}
      </div>
    </div>
  );
};

const Maintenance = () => {
  const { user } = useAuth();
  const isAdmin = ['ADMIN', 'ASSET_MANAGER'].includes(user?.role);
  
  const [requests, setRequests] = useState([]);
  const [assets, setAssets] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // create, approve, assign, start, resolve
  const [selectedRequest, setSelectedRequest] = useState(null);
  
  const [formData, setFormData] = useState({
    assetId: '',
    issueDescription: '',
    priority: 'LOW',
    expectedCost: '',
    technicianId: '',
    actualCost: '',
    notes: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchRequests();
    
    // Load dropdown data
    assetService.getAll({ limit: 500 }).then(res => {
      if (res.success) setAssets(res.data.assets);
    }).catch(console.error);

    if (isAdmin) {
      employeeService.getAll({ limit: 500 }).then(res => {
        if (res.success) setTechnicians(res.data || []);
      }).catch(console.error);
    }
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await maintenanceService.getAll();
      if (res.success) {
        setRequests(res.data);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const pending = requests.filter(r => r.status === 'PENDING' && (r.issueDescription.toLowerCase().includes(searchTerm.toLowerCase()) || r.asset?.name.toLowerCase().includes(searchTerm.toLowerCase())));
  const approved = requests.filter(r => r.status === 'APPROVED' && (r.issueDescription.toLowerCase().includes(searchTerm.toLowerCase()) || r.asset?.name.toLowerCase().includes(searchTerm.toLowerCase())));
  const inProgress = requests.filter(r => r.status === 'IN_PROGRESS' && (r.issueDescription.toLowerCase().includes(searchTerm.toLowerCase()) || r.asset?.name.toLowerCase().includes(searchTerm.toLowerCase())));
  const resolved = requests.filter(r => r.status === 'RESOLVED' && (r.issueDescription.toLowerCase().includes(searchTerm.toLowerCase()) || r.asset?.name.toLowerCase().includes(searchTerm.toLowerCase())));

  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ assetId: '', issueDescription: '', priority: 'LOW', expectedCost: '', technicianId: '', actualCost: '', notes: '' });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleActionClick = (req) => {
    setSelectedRequest(req);
    setFormData({ ...formData, notes: '' });
    setFormError('');
    if (req.status === 'PENDING') setModalMode(isAdmin ? 'approve' : 'view');
    else if (req.status === 'APPROVED') setModalMode(isAdmin ? 'assign' : 'view');
    else if (req.status === 'IN_PROGRESS') setModalMode(isAdmin ? 'resolve' : 'view');
    else setModalMode('view');
    
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    
    try {
      let res;
      if (modalMode === 'create') {
        res = await maintenanceService.create({
          assetId: formData.assetId,
          issueDescription: formData.issueDescription,
          priority: formData.priority
        });
      } else if (modalMode === 'approve') {
        res = await maintenanceService.approve(selectedRequest.id, {
          expectedCost: parseFloat(formData.expectedCost) || undefined,
          notes: formData.notes
        });
      } else if (modalMode === 'assign') {
        res = await maintenanceService.assign(selectedRequest.id, {
          technicianId: formData.technicianId,
          notes: formData.notes
        });
        // We'll also call start since in Kanban it moves straight to In Progress? Wait, assign moves it to assigned, then it can be started. Actually API has /start.
        // Let's just do assign here. If they want to start, they do it next.
      } else if (modalMode === 'start') {
        res = await maintenanceService.start(selectedRequest.id, { notes: formData.notes });
      } else if (modalMode === 'resolve') {
        res = await maintenanceService.resolve(selectedRequest.id, {
          actualCost: parseFloat(formData.actualCost) || undefined,
          resolutionNotes: formData.notes
        });
      }

      if (res && res.success) {
        setIsModalOpen(false);
        fetchRequests();
      } else {
        setFormError(res?.message || 'Operation failed');
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Server error occurred');
    } finally {
      setFormLoading(false);
    }
  };

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
          </div>

          <div className="controls-right">
            <Button variant="primary" onClick={openCreateModal}>
              + New Request
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">Loading maintenance board...</div>
        ) : (
          <div className="kanban-board">
            <div className="kanban-column">
              <div className="column-header"><span className="status-dot pending"></span> Pending ({pending.length})</div>
              <div className="kanban-cards">
                {pending.map(item => <MaintenanceCard key={item.id} data={item} onClickAction={handleActionClick} />)}
              </div>
            </div>

            <div className="kanban-column">
              <div className="column-header"><span className="status-dot approved"></span> Approved ({approved.length})</div>
              <div className="kanban-cards">
                {approved.map(item => <MaintenanceCard key={item.id} data={item} onClickAction={handleActionClick} />)}
              </div>
            </div>

            <div className="kanban-column">
              <div className="column-header"><span className="status-dot in-progress"></span> In Progress ({inProgress.length})</div>
              <div className="kanban-cards">
                {inProgress.map(item => <MaintenanceCard key={item.id} data={item} onClickAction={handleActionClick} />)}
              </div>
            </div>

            <div className="kanban-column">
              <div className="column-header"><span className="status-dot resolved"></span> Resolved ({resolved.length})</div>
              <div className="kanban-cards">
                {resolved.map(item => <MaintenanceCard key={item.id} data={item} onClickAction={handleActionClick} />)}
              </div>
            </div>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !formLoading && setIsModalOpen(false)}
        title={
          modalMode === 'create' ? 'New Maintenance Request' : 
          modalMode === 'approve' ? 'Approve Request' :
          modalMode === 'assign' ? 'Assign Technician' :
          modalMode === 'resolve' ? 'Resolve Maintenance' : 'View Request'
        }
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {formError && (
            <div style={{ color: '#f43f5e', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              {formError}
            </div>
          )}

          {modalMode === 'create' && (
            <>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Asset</label>
                <select className="form-select" value={formData.assetId} onChange={e => setFormData({...formData, assetId: e.target.value})} required>
                  <option value="">Select Asset...</option>
                  {assets.map(a => <option key={a.id} value={a.id}>{a.assetTag} - {a.name}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Issue Description</label>
                <textarea className="form-textarea" required value={formData.issueDescription} onChange={e => setFormData({...formData, issueDescription: e.target.value})}></textarea>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Priority</label>
                <select className="form-select" value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </>
          )}

          {modalMode === 'approve' && (
            <>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Expected Cost ($)</label>
                <input type="number" step="0.01" className="form-input" value={formData.expectedCost} onChange={e => setFormData({...formData, expectedCost: e.target.value})} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Notes</label>
                <textarea className="form-textarea" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
              </div>
            </>
          )}

          {modalMode === 'assign' && (
            <>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Technician</label>
                <select className="form-select" value={formData.technicianId} onChange={e => setFormData({...formData, technicianId: e.target.value})} required>
                  <option value="">Select Technician...</option>
                  {technicians.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Notes</label>
                <textarea className="form-textarea" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}></textarea>
              </div>
            </>
          )}

          {modalMode === 'resolve' && (
             <>
             <div className="form-group" style={{ marginBottom: 0 }}>
               <label className="form-label">Actual Cost ($)</label>
               <input type="number" step="0.01" className="form-input" value={formData.actualCost} onChange={e => setFormData({...formData, actualCost: e.target.value})} />
             </div>
             <div className="form-group" style={{ marginBottom: 0 }}>
               <label className="form-label">Resolution Notes</label>
               <textarea className="form-textarea" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} required></textarea>
             </div>
           </>
          )}

          {modalMode === 'view' && selectedRequest && (
            <div className="p-4 bg-gray-50 rounded text-sm">
              <p><strong>Description:</strong> {selectedRequest.issueDescription}</p>
              <p><strong>Asset:</strong> {selectedRequest.asset?.name}</p>
              <p><strong>Status:</strong> {selectedRequest.status}</p>
              <p><strong>Priority:</strong> {selectedRequest.priority}</p>
              <p>Only Admins/Managers can progress this request.</p>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} disabled={formLoading}>
              {modalMode === 'view' ? 'Close' : 'Cancel'}
            </Button>
            {modalMode !== 'view' && (
              <Button variant="primary" type="submit" disabled={formLoading}>
                {formLoading ? 'Processing...' : 'Submit'}
              </Button>
            )}
            
            {modalMode === 'assign' && (
              <Button variant="secondary" type="button" onClick={async () => {
                setFormLoading(true);
                try {
                  const res = await maintenanceService.start(selectedRequest.id, { notes: formData.notes });
                  if (res.success) { setIsModalOpen(false); fetchRequests(); }
                } catch(e){} finally { setFormLoading(false); }
              }}>
                Start Work Directly
              </Button>
            )}
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Maintenance;
