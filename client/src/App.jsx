import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import Departments from './pages/Organization/Departments';
import Employees from './pages/Organization/Employees';
import AssetDirectory from './pages/Assets/AssetDirectory';
import AllocateAsset from './pages/Allocation/AllocateAsset';
import AuditCycle from './pages/Audit/AuditCycle';
import Reports from './pages/Reports/Reports';
import ResourceBooking from './pages/ResourceBooking/ResourceBooking';
import Maintenance from './pages/Maintenance/Maintenance';
import Login from './pages/Login/Login';
import Notifications from './pages/Notifications/Notifications';
import Settings from './pages/Settings/Settings';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route path="/" element={<DashboardLayout />}>
          {/* Default redirect to dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Home Dashboard Route */}
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Organization Routes */}
          <Route path="organization">
            <Route index element={<Navigate to="departments" replace />} />
            <Route path="departments" element={<Departments />} />
            <Route path="employees" element={<Employees />} />
          </Route>
          
          {/* Assets Route */}
          <Route path="assets" element={<AssetDirectory />} />
          
          {/* Allocation Route */}
          <Route path="allocation" element={<AllocateAsset />} />

          {/* Audit Route */}
          <Route path="audit" element={<AuditCycle />} />
          
          {/* Reports Route */}
          <Route path="reports" element={<Reports />} />
          
          {/* Maintenance Route */}
          <Route path="maintenance" element={<Maintenance />} />
          
          {/* Resource Booking Route */}
          <Route path="resource-booking" element={<ResourceBooking />} />

          {/* Notifications Route */}
          <Route path="notifications" element={<Notifications />} />

          {/* Settings Route */}
          <Route path="settings" element={<Settings />} />
          
          {/* Catch all redirect */}
          <Route path="*" element={<Navigate to="/organization/departments" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
