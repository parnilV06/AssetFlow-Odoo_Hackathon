import React from 'react';
import { Search } from 'lucide-react';
import './SearchInput.css';

const SearchInput = ({ placeholder = 'Search...', className = '', ...props }) => {
  return (
    <div className={`search-container ${className}`}>
      <Search className="search-icon" size={18} />
      <input 
        type="text" 
        className="search-input" 
        placeholder={placeholder} 
        {...props} 
      />
    </div>
  );
};

export default SearchInput;
