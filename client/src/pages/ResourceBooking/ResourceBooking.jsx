import React from 'react';
import { Plus } from 'lucide-react';
import Button from '../../components/Button/Button';
import ResourcesPanel from './ResourcesPanel';
import CalendarView from './CalendarView';
import './ResourceBooking.css';

const ResourceBooking = () => {
  return (
    <div className="booking-page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Resource Booking</h1>
          <p className="page-subtitle">Book shared resources like rooms, vehicles, and equipment.</p>
        </div>
        <div className="booking-actions">
          <Button variant="primary" icon={Plus}>
            New Booking
          </Button>
        </div>
      </div>

      <div className="booking-layout">
        <ResourcesPanel />
        <CalendarView />
      </div>
    </div>
  );
};

export default ResourceBooking;
