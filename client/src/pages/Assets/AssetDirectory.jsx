import React, { useState, useEffect } from 'react';
import { ChevronDown, MoreVertical, Plus } from 'lucide-react';
import SearchInput from '../../components/Input/SearchInput';
import Button from '../../components/Button/Button';
import StatusBadge from '../../components/Status/StatusBadge';
import Pagination from '../../components/Table/Pagination';
import Modal from '../../components/Common/Modal';
import { assetService } from '../../services/asset';
import { categoryService } from '../../services/category';
import { departmentService } from '../../services/department';
import { useAuth } from '../../context/AuthContext';
import './AssetDirectory.css';

const AssetCard = ({ asset, onEdit, isAdmin }) => {
  return (
    <div className="asset-card">
      {isAdmin && (
        <button className="card-menu" onClick={() => onEdit(asset)}>
          <MoreVertical size={16} />
        </button>
      )}
      
      <div className="card-image-container" style={{ backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={asset.imageUrl || 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=250&h=200'} alt={asset.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
      
      <div className="card-details">
        <span className="card-id">{asset.assetTag}</span>
        <h3 className="card-title">{asset.name}</h3>
        <span className="card-category">{asset.category?.name || 'Uncategorized'}</span>
      </div>
      
      <div className="card-footer">
        <div>
          <StatusBadge status={asset.status} />
        </div>
        <span className="card-location" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          {asset.department?.name || 'No Dept'}
        </span>
      </div>
    </div>
  );
};

const FilterDropdown = ({ label, options, value, onChange }) => (
  <div className="filter-dropdown" style={{ position: 'relative' }}>
    <select 
      value={value} 
      onChange={onChange}
      style={{
        appearance: 'none',
        background: 'transparent',
        border: 'none',
        paddingRight: '20px',
        color: 'var(--text-main)',
        fontWeight: '500',
        cursor: 'pointer',
        outline: 'none',
        width: '100%'
      }}
    >
      <option value="">{label}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    <ChevronDown size={16} color="var(--text-secondary)" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
  </div>
);

const AssetDirectory = () => {
  const { user } = useAuth();
  const isAdmin = ['ADMIN', 'ASSET_MANAGER'].includes(user?.role);

  const [assets, setAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [formData, setFormData] = useState({ id: '', name: '', categoryId: '', departmentId: '', purchaseCost: 0, status: 'AVAILABLE' });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchMetadata();
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [currentPage, searchTerm, statusFilter, categoryFilter, departmentFilter]);

  const fetchMetadata = async () => {
    try {
      const [catRes, deptRes] = await Promise.all([
        categoryService.getAll({ limit: 100 }),
        departmentService.getAll({ limit: 100 })
      ]);
      if (catRes.success) setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data.categories || []);
      if (deptRes.success) setDepartments(Array.isArray(deptRes.data) ? deptRes.data : deptRes.data.departments || []);
    } catch (err) {
      console.error("Failed to load metadata", err);
    }
  };

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 8,
        search: searchTerm,
        ...(statusFilter && { status: statusFilter }),
        ...(categoryFilter && { categoryId: categoryFilter }),
        ...(departmentFilter && { departmentId: departmentFilter })
      };
      
      const res = await assetService.getAll(params);
      if (res.success) {
        setAssets(res.data || []);
        setPagination({ total: (res.data || []).length, pages: 1 });
      } else {
        setError('Failed to load assets');
      }
    } catch (err) {
      setError(err.message || 'Error loading assets');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ id: '', name: '', categoryId: '', departmentId: '', purchaseCost: 0, status: 'AVAILABLE' });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (asset) => {
    setModalMode('edit');
    setFormData({
      id: asset.id,
      name: asset.name,
      categoryId: asset.categoryId || '',
      departmentId: asset.departmentId || '',
      purchaseCost: asset.purchaseCost || 0,
      status: asset.status
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      const payload = {
        name: formData.name,
        categoryId: formData.categoryId,
        departmentId: formData.departmentId,
        purchaseCost: parseFloat(formData.purchaseCost) || 0
      };

      let res;
      if (modalMode === 'add') {
        res = await assetService.create(payload);
      } else {
        payload.status = formData.status;
        res = await assetService.update(formData.id, payload);
      }

      if (res.success) {
        setIsModalOpen(false);
        fetchAssets();
      } else {
        setFormError(res.message || 'Failed to save asset');
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Server error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  const statusOptions = [
    { label: 'Available', value: 'AVAILABLE' },
    { label: 'Allocated', value: 'ALLOCATED' },
    { label: 'Reserved', value: 'RESERVED' },
    { label: 'Under Maintenance', value: 'UNDER_MAINTENANCE' },
    { label: 'Disposed', value: 'DISPOSED' }
  ];

  return (
    <div className="page-container card">
      <div className="page-header">
        <div>
          <h1 className="page-title">Asset Directory</h1>
          <p className="page-subtitle">View and manage all assets across your organization.</p>
        </div>
      </div>

      <div className="asset-directory">
        <div className="filters-section">
          <div className="asset-search-row">
            <SearchInput 
              placeholder="Search by Asset Tag, Name..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              width="400px"
            />
            {isAdmin && (
              <Button variant="primary" icon={Plus} onClick={openAddModal}>
                Register Asset
              </Button>
            )}
          </div>
          
          <div className="filters-row">
            <FilterDropdown 
              label="All Statuses" 
              options={statusOptions}
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            />
            <FilterDropdown 
              label="All Categories" 
              options={categories.map(c => ({ label: c.name, value: c.id }))}
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
            />
            <FilterDropdown 
              label="All Departments" 
              options={departments.map(d => ({ label: d.name, value: d.id }))}
              value={departmentFilter}
              onChange={(e) => { setDepartmentFilter(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>

        {error && <div className="p-4 text-red-500">{error}</div>}

        <div className="asset-grid">
          {loading ? (
            <div className="p-4 w-full text-center">Loading assets...</div>
          ) : assets.length === 0 ? (
            <div className="p-4 w-full text-center">No assets found matching filters.</div>
          ) : (
            assets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} onEdit={openEditModal} isAdmin={isAdmin} />
            ))
          )}
        </div>

        {assets.length > 0 && (
          <div className="pagination-container">
            <span className="pagination-text">Showing {assets.length} of {pagination.total} assets</span>
            <Pagination 
              currentPage={currentPage}
              totalPages={pagination.pages}
              totalResults={pagination.total}
              resultsPerPage={8}
              onPageChange={setCurrentPage}
              hideDetails={true}
            />
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !formLoading && setIsModalOpen(false)}
        title={modalMode === 'add' ? 'Register Asset' : 'Edit Asset'}
      >
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {formError && (
            <div style={{ color: '#f43f5e', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              {formError}
            </div>
          )}
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="assetName">Asset Name</label>
            <input
              id="assetName"
              type="text"
              className="input-field"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="categoryId">Category</label>
            <select
              id="categoryId"
              className="input-field"
              value={formData.categoryId}
              onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
              required
            >
              <option value="">-- Select Category --</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="departmentId">Department (Location)</label>
            <select
              id="departmentId"
              className="input-field"
              value={formData.departmentId}
              onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
              required
            >
              <option value="">-- Select Department --</option>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="purchaseCost">Purchase Cost ($)</label>
            <input
              id="purchaseCost"
              type="number"
              step="0.01"
              min="0"
              className="input-field"
              value={formData.purchaseCost}
              onChange={(e) => setFormData({...formData, purchaseCost: e.target.value})}
            />
          </div>

          {modalMode === 'edit' && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="assetStatus">Status</label>
              <select
                id="assetStatus"
                className="input-field"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} disabled={formLoading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={formLoading}>
              {formLoading ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AssetDirectory;
