import React, { useState, useEffect } from 'react';
import { Plus, Pencil, MoreVertical } from 'lucide-react';
import SearchInput from '../../components/Input/SearchInput';
import Button from '../../components/Button/Button';
import StatusBadge from '../../components/Status/StatusBadge';
import { Table, TableHeader, TableRow } from '../../components/Table/Table';
import Pagination from '../../components/Table/Pagination';
import Modal from '../../components/Common/Modal';
import { departmentService } from '../../services/department';
import { employeeService } from '../../services/employee';
import { useAuth } from '../../context/AuthContext';
import './Departments.css';

const Departments = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit'
  const [formData, setFormData] = useState({ id: '', name: '', parentDepartmentId: '', headId: '', status: 'ACTIVE' });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, [currentPage, searchTerm]);

  useEffect(() => {
    // Fetch employees for "Head" dropdown (maybe only if Admin, but everyone can see employees generally)
    employeeService.getAll({ limit: 100 }) // Adjust limit for a real app, maybe autocomplete
      .then(res => {
        if (res.success) setEmployees(res.data.employees);
      })
      .catch(err => console.error("Failed to load employees", err));
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const res = await departmentService.getAll({ page: currentPage, limit: 10, search: searchTerm });
      if (res.success) {
        setDepartments(res.data.departments);
        setPagination(res.data.pagination);
      } else {
        setError('Failed to load departments');
      }
    } catch (err) {
      setError(err.message || 'Error loading departments');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ id: '', name: '', parentDepartmentId: '', headId: '', status: 'ACTIVE' });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (dept) => {
    setModalMode('edit');
    setFormData({
      id: dept.id,
      name: dept.name,
      parentDepartmentId: dept.parentDepartmentId || '',
      headId: dept.headId || '',
      status: dept.status
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
        parentDepartmentId: formData.parentDepartmentId || null,
        headId: formData.headId || null
      };

      let res;
      if (modalMode === 'add') {
        res = await departmentService.create(payload);
      } else {
        payload.status = formData.status;
        res = await departmentService.update(formData.id, payload);
      }

      if (res.success) {
        setIsModalOpen(false);
        fetchDepartments(); // Refresh list
      } else {
        setFormError(res.message || 'Failed to save department');
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Server error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="page-container card">
      <div className="page-header">
        <div>
          <h1 className="page-title">Departments</h1>
          <p className="page-subtitle">Manage all departments within the organization.</p>
        </div>
      </div>

      <div className="page-actions">
        <SearchInput 
          placeholder="Search department..." 
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to page 1 on search
          }}
        />
        {isAdmin && (
          <Button variant="primary" icon={Plus} onClick={openAddModal}>
            Add Department
          </Button>
        )}
      </div>

      {error && <div className="p-4 text-red-500">{error}</div>}

      <Table>
        <TableHeader>
          <th>Department</th>
          <th>Department Head</th>
          <th>Parent Department</th>
          <th>Status</th>
          {isAdmin && <th>Actions</th>}
        </TableHeader>
        <tbody>
          {loading ? (
            <tr><td colSpan={isAdmin ? 5 : 4} className="text-center p-4">Loading...</td></tr>
          ) : departments.length === 0 ? (
            <tr><td colSpan={isAdmin ? 5 : 4} className="text-center p-4">No departments found.</td></tr>
          ) : (
            departments.map((dept) => (
              <TableRow key={dept.id}>
                <td>
                  <span className="font-medium text-main">{dept.name}</span>
                </td>
                <td>{dept.head?.name || '—'}</td>
                <td>{dept.parentDepartment?.name || '—'}</td>
                <td>
                  <StatusBadge status={dept.status} />
                </td>
                {isAdmin && (
                  <td>
                    <div className="table-actions">
                      <button className="action-btn" aria-label="Edit" onClick={() => openEditModal(dept)}>
                        <Pencil size={16} />
                      </button>
                    </div>
                  </td>
                )}
              </TableRow>
            ))
          )}
        </tbody>
      </Table>

      <Pagination 
        currentPage={currentPage}
        totalPages={pagination.pages}
        totalResults={pagination.total}
        resultsPerPage={10}
        onPageChange={setCurrentPage}
      />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !formLoading && setIsModalOpen(false)}
        title={modalMode === 'add' ? 'Add Department' : 'Edit Department'}
      >
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {formError && (
            <div style={{ color: '#f43f5e', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              {formError}
            </div>
          )}
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="deptName">Department Name</label>
            <input
              id="deptName"
              type="text"
              className="input-field"
              placeholder="e.g. Information Technology"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="headId">Department Head</label>
            <select
              id="headId"
              className="input-field"
              value={formData.headId}
              onChange={(e) => setFormData({...formData, headId: e.target.value})}
            >
              <option value="">-- Select Head --</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="parentDept">Parent Department</label>
            <select
              id="parentDept"
              className="input-field"
              value={formData.parentDepartmentId}
              onChange={(e) => setFormData({...formData, parentDepartmentId: e.target.value})}
            >
              <option value="">-- Select Parent --</option>
              {departments.filter(d => d.id !== formData.id).map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          {modalMode === 'edit' && (
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" htmlFor="status">Status</label>
              <select
                id="status"
                className="input-field"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
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

export default Departments;
