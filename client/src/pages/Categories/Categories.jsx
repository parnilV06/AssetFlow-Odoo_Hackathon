import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import SearchInput from '../../components/Input/SearchInput';
import Button from '../../components/Button/Button';
import { Table, TableHeader, TableRow } from '../../components/Table/Table';
import Modal from '../../components/Common/Modal';
import { categoryService } from '../../services/category';
import { useAuth } from '../../context/AuthContext';
import '../Organization/Departments.css'; // Reuse table styling

const Categories = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [searchTerm]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await categoryService.getAll({ search: searchTerm });
      if (res.success) {
        setCategories(res.data); // Based on usual pattern, might be res.data or res.data.categories
      } else {
        setError('Failed to load categories');
      }
    } catch (err) {
      setError(err.message || 'Error loading categories');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setFormData({ name: '', description: '' });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    try {
      const res = await categoryService.create(formData);
      if (res.success) {
        setIsModalOpen(false);
        fetchCategories();
      } else {
        setFormError(res.message || 'Failed to create category');
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Server error occurred');
    } finally {
      setFormLoading(false);
    }
  };

  // Safe data extraction based on backend response shape
  const categoryList = Array.isArray(categories) ? categories : (categories?.categories || []);

  return (
    <div className="page-container card">
      <div className="page-header">
        <div>
          <h1 className="page-title">Asset Categories</h1>
          <p className="page-subtitle">Manage classification categories for all organizational assets.</p>
        </div>
      </div>

      <div className="page-actions">
        <SearchInput 
          placeholder="Search categories..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {isAdmin && (
          <Button variant="primary" icon={Plus} onClick={openAddModal}>
            Add Category
          </Button>
        )}
      </div>

      {error && <div className="p-4 text-red-500">{error}</div>}

      <Table>
        <TableHeader>
          <th>Category Name</th>
          <th>Description</th>
        </TableHeader>
        <tbody>
          {loading ? (
            <tr><td colSpan="2" className="text-center p-4">Loading...</td></tr>
          ) : categoryList.length === 0 ? (
            <tr><td colSpan="2" className="text-center p-4">No categories found.</td></tr>
          ) : (
            categoryList.map((cat) => (
              <TableRow key={cat.id}>
                <td><span className="font-medium text-main">{cat.name}</span></td>
                <td>{cat.description || '—'}</td>
              </TableRow>
            ))
          )}
        </tbody>
      </Table>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => !formLoading && setIsModalOpen(false)}
        title="Add Category"
      >
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {formError && (
            <div style={{ color: '#f43f5e', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
              {formError}
            </div>
          )}
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="catName">Category Name</label>
            <input
              id="catName"
              type="text"
              className="input-field"
              placeholder="e.g. Electronics"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label" htmlFor="catDesc">Description</label>
            <textarea
              id="catDesc"
              className="input-field"
              placeholder="Description of the category..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
            />
          </div>

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

export default Categories;
