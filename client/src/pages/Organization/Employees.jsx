import React, { useState } from 'react';
import { Plus, Pencil, MoreVertical } from 'lucide-react';
import SearchInput from '../../components/Input/SearchInput';
import Button from '../../components/Button/Button';
import StatusBadge from '../../components/Status/StatusBadge';
import RoleBadge from '../../components/Status/RoleBadge';
import { Table, TableHeader, TableRow } from '../../components/Table/Table';
import Pagination from '../../components/Table/Pagination';
import './Employees.css';

const MOCK_EMPLOYEES = [
  { 
    id: 1, 
    name: 'Priya Singh', 
    email: 'priya.singh@assetflow.local', 
    department: 'Information Technology', 
    role: 'Department Head', 
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  { 
    id: 2, 
    name: 'Amit Patil', 
    email: 'amit.patil@assetflow.local', 
    department: 'Human Resources', 
    role: 'Department Head', 
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?img=11'
  },
  { 
    id: 3, 
    name: 'Jane Employee', 
    email: 'employee@assetflow.local', 
    department: 'Information Technology', 
    role: 'Employee', 
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?img=9'
  },
  { 
    id: 4, 
    name: 'Rahul Sharma', 
    email: 'rahul.sharma@assetflow.local', 
    department: 'Operations', 
    role: 'Asset Manager', 
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?img=12'
  },
  { 
    id: 5, 
    name: 'Sneha Iyer', 
    email: 'sneha.iyer@assetflow.local', 
    department: 'Administration', 
    role: 'Employee', 
    status: 'Inactive',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
];

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="primary" icon={Plus}>
          Add Employee
        </Button>
      </div>

      <Table>
        <TableHeader>
          <th>Employee</th>
          <th>Department</th>
          <th>Role</th>
          <th>Status</th>
          <th>Actions</th>
        </TableHeader>
        <tbody>
          {MOCK_EMPLOYEES.map((emp) => (
            <TableRow key={emp.id}>
              <td>
                <div className="employee-cell">
                  <img src={emp.avatar} alt={emp.name} className="employee-avatar" />
                  <div className="employee-info">
                    <span className="font-medium text-main">{emp.name}</span>
                    <span className="employee-email">{emp.email}</span>
                  </div>
                </div>
              </td>
              <td>{emp.department}</td>
              <td>
                <RoleBadge role={emp.role} />
              </td>
              <td>
                <StatusBadge status={emp.status} />
              </td>
              <td>
                <div className="table-actions">
                  <button className="action-btn" aria-label="Edit">
                    <Pencil size={16} />
                  </button>
                  <button className="action-btn" aria-label="More options">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </td>
            </TableRow>
          ))}
        </tbody>
      </Table>

      <Pagination 
        currentPage={currentPage}
        totalPages={1}
        totalResults={5}
        resultsPerPage={5}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Employees;
