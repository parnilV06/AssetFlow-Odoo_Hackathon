import React, { useState } from 'react';
import { Plus, Pencil, MoreVertical } from 'lucide-react';
import SearchInput from '../../components/Input/SearchInput';
import Button from '../../components/Button/Button';
import StatusBadge from '../../components/Status/StatusBadge';
import { Table, TableHeader, TableRow } from '../../components/Table/Table';
import Pagination from '../../components/Table/Pagination';
import './Departments.css';

const MOCK_DEPARTMENTS = [
  { id: 1, name: 'Information Technology', head: 'Priya Singh', parent: '—', status: 'Active' },
  { id: 2, name: 'Human Resources', head: 'Amit Patil', parent: '—', status: 'Active' },
  { id: 3, name: 'Finance', head: 'Neha Gupta', parent: '—', status: 'Active' },
  { id: 4, name: 'Marketing', head: 'Rohit Mehta', parent: '—', status: 'Active' },
  { id: 5, name: 'Operations', head: 'Vikram Joshi', parent: '—', status: 'Active' },
  { id: 6, name: 'Administration', head: 'Sneha Iyer', parent: '—', status: 'Inactive' },
];

const Departments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="primary" icon={Plus}>
          Add Department
        </Button>
      </div>

      <Table>
        <TableHeader>
          <th>Department</th>
          <th>Department Head</th>
          <th>Parent Department</th>
          <th>Status</th>
          <th>Actions</th>
        </TableHeader>
        <tbody>
          {MOCK_DEPARTMENTS.map((dept) => (
            <TableRow key={dept.id}>
              <td>
                <span className="font-medium text-main">{dept.name}</span>
              </td>
              <td>{dept.head}</td>
              <td>{dept.parent}</td>
              <td>
                <StatusBadge status={dept.status} />
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
        totalResults={6}
        resultsPerPage={6}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default Departments;
