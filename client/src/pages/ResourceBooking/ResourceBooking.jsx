import React, { useState, useEffect } from 'react';
import { Plus, Users, Video, Car, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../../components/Button/Button';
import Modal from '../../components/Common/Modal';
import { bookingService } from '../../services/booking';
import { assetService } from '../../services/asset';
import { useAuth } from '../../context/AuthContext';
import './ResourceBooking.css';
import './ResourcesPanel.css';
import './CalendarView.css';

const DAYS = [
  { name: 'Mon 12', date: '12', offset: 0 },
  { name: 'Tue 13', date: '13', offset: 1 },
  { name: 'Wed 14', date: '14', offset: 2 },
  { name: 'Thu 15', date: '15', offset: 3 },
  { name: 'Fri 16', date: '16', offset: 4 },
  { name: 'Sat 17', date: '17', offset: 5 }
];

const HOURS = [
  '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', 
  '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM'
];

const formatTimeRange = (start, end) => {
  const formatHour = (h) => (h > 12 ? `${h-12}:00` : `${h}:00`);
  return `${formatHour(start)} - ${formatHour(end)}`;
};

const ResourceBooking = () => {
  const { user } = useAuth();
  
  const [assets, setAssets] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    assetId: '',
    date: new Date().toISOString().split('T')[0],
    startHour: '09:00',
    endHour: '10:00',
    purpose: ''
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  
  // To keep it simple, we use a fixed week for the calendar (since this is a demo)
  // We'll just map the incoming bookings to their day of the week if they fall in the current week.
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay() + 1); // Monday

  useEffect(() => {
    // Load Bookable assets
    assetService.getAll({ limit: 500 }).then(res => {
      if (res.success) {
        // filter bookable only or just take all for demo (assuming all are bookable if they are electronics/vehicles)
        setAssets(res.data.assets);
        if (res.data.assets.length > 0) setSelectedAssetId(res.data.assets[0].id);
      }
    });

    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await bookingService.getCalendar();
      if (res.success) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    
    try {
      const startTime = new Date(`${formData.date}T${formData.startHour}:00`).toISOString();
      const endTime = new Date(`${formData.date}T${formData.endHour}:00`).toISOString();
      
      const res = await bookingService.create({
        assetId: formData.assetId,
        startTime,
        endTime,
        purpose: formData.purpose
      });

      if (res.success) {
        setIsModalOpen(false);
        fetchBookings();
      } else {
        setFormError(res.message || 'Failed to create booking');
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Server error occurred. Check conflicts.');
    } finally {
      setFormLoading(false);
    }
  };

  // Convert real bookings into calendar events based on UI grid
  // Grid: 8 AM is row 0. 
  const mappedEvents = bookings.map(b => {
    const start = new Date(b.startTime);
    const end = new Date(b.endTime);
    const dayOfWeek = start.getDay(); // 0 is Sunday, 1 is Monday
    const startHour = start.getHours();
    const endHour = end.getHours();
    
    // Default to 'booked'. If user === current user, 'your-booking'. If cancelled 'maintenance' (hacky but visually works).
    const type = b.user?.id === user?.id ? 'your-booking' : 'booked';

    return {
      id: b.id,
      title: b.purpose || 'Booked',
      resource: b.asset?.name,
      assetId: b.assetId,
      start: startHour,
      end: endHour,
      dayIndex: dayOfWeek === 0 ? 6 : dayOfWeek - 1, // map Mon=0, Sun=6
      type
    };
  }).filter(e => e.start >= 8 && e.end <= 19 && e.dayIndex >= 0 && e.dayIndex <= 5); // Only show Mon-Sat 8-6 for grid

  // Filter events for selected asset (if selected) or show all
  const displayEvents = selectedAssetId ? mappedEvents.filter(e => e.assetId === selectedAssetId) : mappedEvents;

  return (
    <div className="booking-page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Resource Booking</h1>
          <p className="page-subtitle">Book shared resources like rooms, vehicles, and equipment.</p>
        </div>
        <div className="booking-actions">
          <Button variant="primary" icon={Plus} onClick={() => {
            setFormData({...formData, assetId: selectedAssetId});
            setIsModalOpen(true);
          }}>
            New Booking
          </Button>
        </div>
      </div>

      <div className="booking-layout">
        
        {/* Resources Panel */}
        <div className="resources-panel card">
          <div className="resources-header">
            <h3 className="resources-title">Resources</h3>
          </div>
          <div className="resources-list">
            <div 
              className={`resource-item ${!selectedAssetId ? 'selected' : ''}`}
              onClick={() => setSelectedAssetId('')}
            >
              <div className="resource-icon-wrapper"><Users size={18} /></div>
              <span className="resource-name">All Resources</span>
            </div>
            {assets.map((res) => {
              const Icon = res.category?.name?.includes('Vehicle') ? Car : res.category?.name?.includes('Electronics') ? Video : Users;
              const isSelected = selectedAssetId === res.id;
              
              return (
                <div 
                  key={res.id} 
                  className={`resource-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedAssetId(res.id)}
                >
                  <div className="resource-icon-wrapper">
                    <Icon size={18} />
                  </div>
                  <span className="resource-name">{res.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Calendar View */}
        <div className="calendar-card card">
          <div className="calendar-controls">
            <div className="calendar-nav">
              <button className="nav-btn today-btn">This Week</button>
            </div>
          </div>

          <div className="calendar-container">
            <div className="calendar-grid">
              <div className="calendar-cell header-cell time-col-header"></div>
              
              {DAYS.map((day, i) => {
                const d = new Date(weekStart);
                d.setDate(d.getDate() + day.offset);
                return (
                  <div key={i} className="calendar-cell header-cell day-header">
                    <span className="day-name">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    <span className="day-date">{d.getDate()}</span>
                  </div>
                );
              })}

              {HOURS.map((hour, rowIdx) => (
                <React.Fragment key={hour}>
                  <div className="calendar-cell time-cell"><span>{hour}</span></div>
                  {DAYS.map((_, colIdx) => (
                    <div key={`${rowIdx}-${colIdx}`} className="calendar-cell grid-cell"></div>
                  ))}
                </React.Fragment>
              ))}

              <div className="events-layer">
                {displayEvents.map(event => {
                  const startOffset = event.start - 8;
                  const duration = event.end - event.start;
                  const rowStart = startOffset + 2; 
                  const colStart = event.dayIndex + 2;

                  return (
                    <div 
                      key={event.id}
                      className={`event-card event-${event.type}`}
                      style={{ gridColumn: colStart, gridRow: `${rowStart} / span ${duration}` }}
                    >
                      <div className="event-indicator"></div>
                      <div className="event-content">
                        <div className="event-title">{event.title}</div>
                        <div className="event-time">{formatTimeRange(event.start, event.end)}</div>
                        <div className="event-resource">{event.resource}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="calendar-legend">
            <div className="legend-item"><span className="legend-dot booked"></span> Booked</div>
            <div className="legend-item"><span className="legend-dot your-booking"></span> Your Booking</div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => !formLoading && setIsModalOpen(false)} title="New Booking">
        <form onSubmit={handleCreateBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {formError && (
            <div style={{ color: '#f43f5e', fontSize: '0.875rem', marginBottom: '0.5rem' }}>{formError}</div>
          )}
          
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Asset</label>
            <select className="form-select" value={formData.assetId} onChange={e => setFormData({...formData, assetId: e.target.value})} required>
              <option value="">Select Asset...</option>
              {assets.map(a => <option key={a.id} value={a.id}>{a.assetTag} - {a.name}</option>)}
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Date</label>
            <input type="date" className="form-input" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} min={new Date().toISOString().split('T')[0]} required />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
              <label className="form-label">Start Time</label>
              <input type="time" className="form-input" value={formData.startHour} onChange={e => setFormData({...formData, startHour: e.target.value})} required />
            </div>
            <div className="form-group" style={{ marginBottom: 0, flex: 1 }}>
              <label className="form-label">End Time</label>
              <input type="time" className="form-input" value={formData.endHour} onChange={e => setFormData({...formData, endHour: e.target.value})} required />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Purpose</label>
            <input type="text" className="form-input" value={formData.purpose} onChange={e => setFormData({...formData, purpose: e.target.value})} required />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)} disabled={formLoading}>Cancel</Button>
            <Button variant="primary" type="submit" disabled={formLoading}>{formLoading ? 'Booking...' : 'Book'}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ResourceBooking;
