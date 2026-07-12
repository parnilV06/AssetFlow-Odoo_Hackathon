import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../../components/Button/Button';
import StatusBadge from '../../components/Status/StatusBadge';
import { assetService } from '../../services/asset';
import { employeeService } from '../../services/employee';
import { allocationService } from '../../services/allocation';
import './AllocateAsset.css';

const AllocateAsset = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialAssetId = searchParams.get('assetId') || '';

  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedAssetId, setSelectedAssetId] = useState(initialAssetId);
  const [assetDetails, setAssetDetails] = useState(null);
  const [history, setHistory] = useState([]);

  // Form states
  const [actionType, setActionType] = useState('allocate'); // 'allocate', 'return', 'transfer'
  const [targetEmployeeId, setTargetEmployeeId] = useState('');
  const [expectedReturn, setExpectedReturn] = useState('');
  const [conditionNotes, setConditionNotes] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Load available assets and employees for dropdowns
    Promise.all([
      assetService.getAll({ limit: 500 }), // In a real app, use an autocomplete search
      employeeService.getAll({ limit: 500 })
    ]).then(([assetsRes, empRes]) => {
      if (assetsRes.success) setAssets(assetsRes.data.assets);
      if (empRes.success) setEmployees(empRes.data.employees);
    }).catch(err => console.error("Error loading dropdown data", err));
  }, []);

  useEffect(() => {
    if (selectedAssetId) {
      loadAssetData(selectedAssetId);
      // Update URL silently
      setSearchParams({ assetId: selectedAssetId }, { replace: true });
    } else {
      setAssetDetails(null);
      setHistory([]);
    }
  }, [selectedAssetId]);

  const loadAssetData = async (id) => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const [assetRes, historyRes] = await Promise.all([
        assetService.getById(id),
        allocationService.getAssetHistory(id)
      ]);
      if (assetRes.success) {
        setAssetDetails(assetRes.data);
        
        // Auto-select action based on status
        if (assetRes.data.status === 'AVAILABLE') setActionType('allocate');
        else if (assetRes.data.status === 'ALLOCATED') setActionType('return');
        else setActionType('allocate');
      }
      if (historyRes.success) {
        setHistory(historyRes.data);
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to load asset data' });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setMessage({ type: '', text: '' });

    try {
      let res;
      if (actionType === 'allocate') {
        res = await allocationService.allocate({
          assetId: selectedAssetId,
          employeeId: targetEmployeeId,
          expectedReturn: expectedReturn || undefined,
          conditionNotes: conditionNotes || undefined
        });
      } else if (actionType === 'return') {
        res = await allocationService.returnAsset({
          assetId: selectedAssetId,
          conditionNotes: conditionNotes || undefined
        });
      } else if (actionType === 'transfer') {
        res = await allocationService.transfer({
          assetId: selectedAssetId,
          newEmployeeId: targetEmployeeId,
          expectedReturn: expectedReturn || undefined
        });
      }

      if (res.success) {
        setMessage({ type: 'success', text: `Asset successfully ${actionType}d!` });
        setTargetEmployeeId('');
        setExpectedReturn('');
        setConditionNotes('');
        // Reload asset data to show new status and history
        loadAssetData(selectedAssetId);
      } else {
        setMessage({ type: 'error', text: res.message || 'Action failed' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Server error occurred' });
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Allocate Asset</h1>
          <p className="page-subtitle">Assign, return, or transfer an asset.</p>
        </div>
      </div>

      <div className="page-content allocate-page">
        {/* Top bar for asset selection */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
          <label className="form-label">Select Asset to Manage</label>
          <select 
            className="form-select" 
            style={{ maxWidth: '400px' }}
            value={selectedAssetId}
            onChange={(e) => setSelectedAssetId(e.target.value)}
          >
            <option value="">-- Choose an asset --</option>
            {assets.map(a => (
              <option key={a.id} value={a.id}>
                {a.assetTag} - {a.name} ({a.status})
              </option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="p-8 text-center">Loading asset details...</div>
        ) : !assetDetails ? (
          <div className="p-8 text-center text-secondary">Please select an asset above to manage allocations.</div>
        ) : (
          <div className="allocation-grid">
            
            {/* Left Panel - Asset Details */}
            <div className="allocation-card">
              <h3 className="card-heading">Asset Details</h3>
              
              <div className="asset-info-list" style={{ marginTop: '1rem' }}>
                <div className="info-item">
                  <span className="info-value font-bold">{assetDetails.assetTag}</span>
                  <span className="info-value">{assetDetails.name}</span>
                </div>
                
                <div className="info-item">
                  <span className="info-label">Category</span>
                  <span className="info-value" style={{fontWeight: 400}}>{assetDetails.category?.name || '—'}</span>
                </div>

                <div className="info-item">
                  <span className="info-label">Status</span>
                  <div style={{marginTop: '4px'}}>
                    <StatusBadge status={assetDetails.status} />
                  </div>
                </div>

                <div className="info-item">
                  <span className="info-label">Location (Dept)</span>
                  <span className="info-value" style={{fontWeight: 400}}>{assetDetails.department?.name || '—'}</span>
                </div>
              </div>
            </div>

            {/* Center Panel - Allocation Form */}
            <div className="allocation-card">
              <h3 className="card-heading">Manage Allocation</h3>
              
              <form className="allocation-form" onSubmit={handleAction}>
                {message.text && (
                  <div className={`p-3 rounded mb-4 text-sm ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-600 border border-green-200'}`}>
                    {message.text}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Action</label>
                  <select 
                    className="form-select"
                    value={actionType}
                    onChange={(e) => setActionType(e.target.value)}
                  >
                    <option value="allocate" disabled={assetDetails.status !== 'AVAILABLE'}>Allocate New</option>
                    <option value="return" disabled={assetDetails.status !== 'ALLOCATED'}>Return Asset</option>
                    <option value="transfer" disabled={assetDetails.status !== 'ALLOCATED'}>Transfer Asset</option>
                  </select>
                </div>

                {(actionType === 'allocate' || actionType === 'transfer') && (
                  <div className="form-group">
                    <label className="form-label">{actionType === 'transfer' ? 'Transfer To Employee' : 'Allocate To Employee'}</label>
                    <select 
                      className="form-select"
                      value={targetEmployeeId}
                      onChange={(e) => setTargetEmployeeId(e.target.value)}
                      required
                    >
                      <option value="">Select Employee...</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name} ({emp.department?.name})</option>
                      ))}
                    </select>
                  </div>
                )}

                {(actionType === 'allocate' || actionType === 'transfer') && (
                  <div className="form-group">
                    <label className="form-label">Expected Return Date</label>
                    <input 
                      type="date" 
                      className="form-input" 
                      value={expectedReturn}
                      onChange={(e) => setExpectedReturn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]} // today
                    />
                  </div>
                )}

                {(actionType === 'allocate' || actionType === 'return') && (
                  <div className="form-group">
                    <label className="form-label">Condition Notes</label>
                    <textarea 
                      className="form-textarea" 
                      placeholder="Condition at time of transaction..."
                      value={conditionNotes}
                      onChange={(e) => setConditionNotes(e.target.value)}
                    ></textarea>
                  </div>
                )}

                <div className="form-actions">
                  <Button variant="primary" type="submit" disabled={formLoading}>
                    {formLoading ? 'Processing...' : 
                      actionType === 'allocate' ? 'Allocate Asset' : 
                      actionType === 'return' ? 'Return Asset' : 'Transfer Asset'}
                  </Button>
                </div>
              </form>
            </div>

            {/* Right Panel - Allocation History */}
            <div className="allocation-card history-panel">
              <h3 className="card-heading">Allocation History</h3>
              
              <div className="timeline" style={{ marginTop: '1rem', flex: 1, overflowY: 'auto' }}>
                {history.length === 0 ? (
                  <div className="text-secondary text-sm">No history available for this asset.</div>
                ) : (
                  history.map((record) => (
                    <div className="timeline-item" key={record.id}>
                      <div className={`timeline-dot ${record.returnedAt ? 'returned' : ''}`}></div>
                      <div className="timeline-date">{new Date(record.allocatedAt).toLocaleDateString()}</div>
                      <div className="timeline-action">
                        {record.returnedAt ? 'Returned by' : 'Allocated to'}
                      </div>
                      <div className="timeline-user">{record.user?.name || 'Unknown'}</div>
                      <div className="timeline-status text-xs mt-1 text-secondary">
                        {record.conditionNotes ? `Notes: ${record.conditionNotes}` : 'No notes'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default AllocateAsset;
