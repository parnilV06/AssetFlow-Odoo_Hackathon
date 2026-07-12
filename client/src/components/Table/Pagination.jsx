import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Pagination.css';

const Pagination = ({ 
  currentPage = 1, 
  totalPages = 1, 
  totalResults = 0,
  resultsPerPage = 6,
  onPageChange 
}) => {
  return (
    <div className="pagination-wrapper">
      <div className="pagination-info">
        Showing 1 to {Math.min(resultsPerPage, totalResults)} of {totalResults} results
      </div>
      <div className="pagination-controls">
        <button 
          className="page-btn page-nav" 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={16} />
        </button>
        
        {/* Simplified for demo: assuming 1 page for now */}
        <button className="page-btn page-num active">
          {currentPage}
        </button>
        
        <button 
          className="page-btn page-nav" 
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
