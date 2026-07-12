import React, { useState } from 'react';
import { ChevronDown, MoreVertical, Plus } from 'lucide-react';
import SearchInput from '../../components/Input/SearchInput';
import Button from '../../components/Button/Button';
import StatusBadge from '../../components/Status/StatusBadge';
import Pagination from '../../components/Table/Pagination';
import './AssetDirectory.css';

const MOCK_ASSETS = [
  {
    id: 'AF-0012',
    name: 'Dell XPS 15 Laptop',
    category: 'Electronics',
    status: 'Available',
    location: 'IT Room',
    image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=250&h=200'
  },
  {
    id: 'AF-0045',
    name: 'Epson Projector',
    category: 'Equipment',
    status: 'Reserved',
    location: 'Conference Hall',
    image: 'https://images.unsplash.com/photo-1577977461448-43d9d300eb06?auto=format&fit=crop&q=80&w=250&h=200'
  },
  {
    id: 'AF-0078',
    name: 'Ergonomic Chair',
    category: 'Furniture',
    status: 'Available',
    location: 'HR Department',
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=250&h=200'
  },
  {
    id: 'AF-0202',
    name: 'Toyota Innova',
    category: 'Vehicles',
    status: 'Under Maintenance',
    location: 'Parking Area',
    image: 'https://images.unsplash.com/photo-1550355291-bbee04a92027?auto=format&fit=crop&q=80&w=250&h=200'
  },
  {
    id: 'AF-0034',
    name: 'HP LaserJet Printer',
    category: 'Electronics',
    status: 'Available',
    location: 'Finance Dept',
    image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?auto=format&fit=crop&q=80&w=250&h=200'
  },
  {
    id: 'AF-0082',
    name: 'Meeting Room B',
    category: 'Electronics',
    status: 'Allocated',
    location: '2:00 PM - 3:00 PM',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=250&h=200'
  },
  {
    id: 'AF-0215',
    name: 'MacBook Air',
    category: 'Electronics',
    status: 'Allocated',
    location: 'Marketing Dept',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=250&h=200'
  },
  {
    id: 'AF-0405',
    name: 'Conference Table',
    category: 'Furniture',
    status: 'Available',
    location: 'Conference Hall',
    image: 'https://images.unsplash.com/photo-1581428982868-e410dd047a90?auto=format&fit=crop&q=80&w=250&h=200'
  }
];

const AssetCard = ({ asset }) => {
  return (
    <div className="asset-card">
      <button className="card-menu">
        <MoreVertical size={16} />
      </button>
      
      <div className="card-image-container">
        <img src={asset.image} alt={asset.name} />
      </div>
      
      <div className="card-details">
        <span className="card-id">{asset.id}</span>
        <h3 className="card-title">{asset.name}</h3>
        <span className="card-category">{asset.category}</span>
      </div>
      
      <div className="card-footer">
        <div>
          <StatusBadge status={asset.status} />
        </div>
        <span className="card-location">{asset.location}</span>
      </div>
    </div>
  );
};

const FilterDropdown = ({ label }) => (
  <div className="filter-dropdown">
    <span>{label}</span>
    <ChevronDown size={16} color="var(--text-secondary)" />
  </div>
);

const AssetDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

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
              placeholder="Search by Asset Tag, Name, Serial No..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              width="400px"
            />
            <Button variant="primary" icon={Plus}>
              Register Asset
            </Button>
          </div>
          
          <div className="filters-row">
            <FilterDropdown label="All Status" />
            <FilterDropdown label="All Categories" />
            <FilterDropdown label="All Departments" />
            <FilterDropdown label="All Locations" />
          </div>
        </div>

        <div className="asset-grid">
          {MOCK_ASSETS.map((asset) => (
            <AssetCard key={asset.id} asset={asset} />
          ))}
        </div>

        <div className="pagination-container">
          <span className="pagination-text">Showing 1 to 8 of 120 assets</span>
          <Pagination 
            currentPage={currentPage}
            totalPages={15}
            totalResults={120}
            resultsPerPage={8}
            onPageChange={setCurrentPage}
            hideDetails={true}
          />
        </div>
      </div>
    </div>
  );
};

export default AssetDirectory;
