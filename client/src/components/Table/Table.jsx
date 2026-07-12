import React from 'react';
import './Table.css';

export const Table = ({ children }) => {
  return (
    <div className="table-container">
      <table className="af-table">
        {children}
      </table>
    </div>
  );
};

export const TableHeader = ({ children }) => {
  return (
    <thead className="table-header">
      <tr>
        {children}
      </tr>
    </thead>
  );
};

export const TableRow = ({ children }) => {
  return (
    <tr className="table-row">
      {children}
    </tr>
  );
};
