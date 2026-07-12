import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Departments from './pages/Organization/Departments';
import Employees from './pages/Organization/Employees';
import Reports from './pages/Reports/Reports';
import ResourceBooking from './pages/ResourceBooking/ResourceBooking';
import Login from './pages/Login/Login';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route path="/" element={<DashboardLayout />}>
          {/* Default redirect to departments for this demo */}
          <Route index element={<Navigate to="/organization/departments" replace />} />
          
          {/* Organization Routes */}
          <Route path="organization">
            <Route index element={<Navigate to="departments" replace />} />
            <Route path="departments" element={<Departments />} />
            <Route path="employees" element={<Employees />} />
          </Route>
          
          {/* Reports Route */}
          <Route path="reports" element={<Reports />} />
          
          {/* Resource Booking Route */}
          <Route path="resource-booking" element={<ResourceBooking />} />
          
          {/* Catch all redirect */}
          <Route path="*" element={<Navigate to="/organization/departments" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
