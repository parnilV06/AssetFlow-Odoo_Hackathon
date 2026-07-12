import React, { useState, useEffect } from 'react';
import { Plus, Pencil, MoreVertical, Shield } from 'lucide-react';
import SearchInput from '../../components/Input/SearchInput';
import Button from '../../components/Button/Button';
import StatusBadge from '../../components/Status/StatusBadge';
import RoleBadge from '../../components/Status/RoleBadge';
import { Table, TableHeader, TableRow } from '../../components/Table/Table';
import Pagination from '../../components/Table/Pagination';
import Modal from '../../components/Common/Modal';
import { employeeService } from '../../services/employee';
import { departmentService } from '../../services/department';
import { useAuth } from '../../context/AuthContext';
import './Employees.css';

const Employees = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' | 'edit' | 'role'
  
  const [formData, setFormData] = useState({ id: '', name: '', email: '', departmentId: '', status: 'ACTIVE', role: 'EMPLOYEE' });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, [currentPage, searchTerm]);

  useEffect(() => {
    departmentService.getAll({ limit: 100 })
      .then(res => {
        if (res.success) setDepartments(res.data.departments || []);
      })
      .catch(err => console.error("Failed to load departments", err));
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await employeeService.getAll({ page: currentPage, limit: 10, search: searchTerm });
      if (res.success) {
        setEmployees(res.data.employees);
        setPagination(res.data.pagination);
      } else {
        setError('Failed to load employees');
      }
    } catch (err) {
      setError(err.message || 'Error loading employees');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setModalMode('add');
    setFormData({ id: '', name: '', email: '', departmentId: '', status: 'ACTIVE', role: 'EMPLOYEE' });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (emp) => {
    setModalMode('edit');
    setFormData({
      id: emp.id,
      name: emp.name,
      email: emp.email, // read-only in edit usually
      departmentId: emp.departmentId || '',
      status: emp.status,
      role: emp.role
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openRoleModal = (emp) => {
    setModalMode('role');
    setFormData({ id: emp.id, role: emp.role });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      let res;
      if (modalMode === 'add') {
        res = await employeeService.create({
          name: formData.name,
          email: formData.email,
          departmentId: formData.departmentId
        });
      } else if (modalMode === 'edit') {
        res = await employeeService.update(formData.id, {
          name: formData.name,
          departmentId: formData.departmentId,
          status: formData.status
        });
      } else if (modalMode === 'role') {
        res = await employeeService.updateRole(formData.id, formData.role);
      }

      if (res.success) {
        setIsModalOpen(false);
        fetchEmployees();
      } else {
        setFormError(res.message || 'Failed to save employee');
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Server error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  // UI helper for Role Dropdown menu
  const ActionMenu = ({ emp }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <div className="table-actions" style={{ position: 'relative' }}>
        <button className="action-btn" aria-label="Edit" onClick={() => openEditModal(emp)}>
          <Pencil size={16} />
        </button>
        <button className="action-btn" aria-label="Change Role" onClick={() => openRoleModal(emp)}>
          <Shield size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className="page-container card">
      <div className="page-header">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">Manage employee directory and roles.</p>
        </div>
      </div>

      <div className="page-actions">
        <SearchInput 
          placeholder="Search employees..." 
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        {isAdmin && (
          <Button variant="primary" icon={Plus} onClick={openAddModal}>
            Add Employee
          </Button>
        )}
      </div>

      {error && <div className="p-4 text-red-500">{error}</div>}

      <Table>
        <TableHeader>
          <th>Employee</th>
          <th>Department</th>
          <th>Role</th>
          <th>Status</th>
          {isAdmin && <th>Actions</th>}
        </TableHeader>
        <tbody>
          {loading ? (
            <tr><td colSpan={isAdmin ? 5 : 4} className="text-center p-4">Loading...</td></tr>
          ) : employees.length === 0 ? (
            <tr><td colSpan={isAdmin ? 5 : 4} className="text-center p-4">No employees found.</td></tr>
          ) : (
            employees.map((emp) => (
              <TableRow key={emp.id}>
                <td>
                  <div className="employee-cell">
                    <div className="employee-info">
                      <span className="font-medium text-main">{emp.name}</span>
                      <span className="employee-email">{emp.email}</span>
                    </div>
                  </div>
                </td>
                <td>{emp.department?.name || '—'}</td>
                <td>
                  <RoleBadge role={emp.role} />
                </td>
                <td>
                  <StatusBadge status={emp.status} />
                </td>
                {isAdmin && (
                  <td>
                    <ActionMenu emp={emp} />
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
        title={
          modalMode === 'add' ? 'Add Employee' : 
          modalMode === 'edit' ? 'Edit Employee' : 
          'Change Employee Role'
        }
      >
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {formError && (
            <div style={{ color: '#f43f5e', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              {formError}
            </div>
          )}
          
          {modalMode !== 'role' && (
            <>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="empName">Full Name</label>
                <input
                  id="empName"
                  type="text"
                  className="input-field"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              {modalMode === 'add' && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="empEmail">Email Address</label>
                  <input
                    id="empEmail"
                    type="email"
                    className="input-field"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              )}

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" htmlFor="empDept">Department</label>
                <select
                  id="empDept"
                  className="input-field"
                  value={formData.departmentId}
                  onChange={(e) => setFormData({...formData, departmentId: e.target.value})}
                  required
                >
                  <option value="">-- Select Department --</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>

              {modalMode === 'edit' && (
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" htmlFor="empStatus">Status</label>
                  <select
                    id="empStatus"
                    className="input-field"
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              )}
            </>
          )}

          {modalMode === 'role' && (
             <div className="form-group" style={{ marginBottom: 0 }}>
               <label className="form-label" htmlFor="empRole">System Role</label>
               <select
                 id="empRole"
                 className="input-field"
                 value={formData.role}
                 onChange={(e) => setFormData({...formData, role: e.target.value})}
               >
                 <option value="EMPLOYEE">Employee</option>
                 <option value="DEPARTMENT_HEAD">Department Head</option>
                 <option value="ASSET_MANAGER">Asset Manager</option>
                 <option value="ADMIN">Admin</option>
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

export default Employees;
