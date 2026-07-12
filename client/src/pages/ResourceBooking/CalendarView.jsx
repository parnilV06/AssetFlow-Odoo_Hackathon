import React from 'react';
import './CalendarView.css';

const DAYS = [
  { name: 'Mon 12', date: '12' },
  { name: 'Tue 13', date: '13' },
  { name: 'Wed 14', date: '14' },
  { name: 'Thu 15', date: '15' },
  { name: 'Fri 16', date: '16' },
  { name: 'Sat 17', date: '17' }
];

const HOURS = [
  '8 AM', '9 AM', '10 AM', '11 AM', '12 PM', 
  '1 PM', '2 PM', '3 PM', '4 PM', '5 PM', '6 PM'
];

const MOCK_EVENTS = [
  { id: 1, title: 'Team Sync', resource: 'Meeting Room A', start: 9, end: 11, dayIndex: 0, type: 'booked' },
  { id: 2, title: 'Product Review', resource: 'Meeting Room B', start: 14, end: 16, dayIndex: 0, type: 'booked' },
  { id: 3, title: 'Client Meeting', resource: 'Conference Hall', start: 11, end: 13, dayIndex: 1, type: 'your-booking' },
  { id: 4, title: 'Design Discussion', resource: 'Meeting Room B', start: 13, end: 15, dayIndex: 2, type: 'booked' },
  { id: 5, title: 'Weekly Review', resource: 'Conference Hall', start: 10, end: 12, dayIndex: 3, type: 'your-booking' },
  { id: 6, title: 'Presentation Prep', resource: 'Projector 1', start: 13, end: 15, dayIndex: 3, type: 'overlapping' },
  { id: 7, title: 'Budget Review', resource: 'Meeting Room A', start: 16, end: 18, dayIndex: 4, type: 'booked' },
];

const formatTimeRange = (start, end) => {
  const formatHour = (h) => (h > 12 ? `${h-12}:00` : `${h}:00`);
  return `${formatHour(start)} - ${formatHour(end)}`;
};

const CalendarView = () => {
  return (
    <div className="calendar-card card">
      {/* Calendar Header / Actions */}
      <div className="calendar-controls">
        <div className="calendar-nav">
          <button className="nav-btn today-btn">Today</button>
          <div className="nav-arrows">
            <button className="nav-btn">&lt;</button>
            <button className="nav-btn">&gt;</button>
          </div>
          <span className="current-date-range">May 2025 <span className="chevron-down-small"></span></span>
        </div>
        
        <div className="view-switcher">
          <button className="view-btn">Day</button>
          <button className="view-btn active">Week</button>
          <button className="view-btn">Month <span className="chevron-down-small"></span></button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-container">
        <div className="calendar-grid">
          {/* Top Left Empty Cell */}
          <div className="calendar-cell header-cell time-col-header"></div>
          
          {/* Day Headers */}
          {DAYS.map((day, i) => (
            <div key={i} className="calendar-cell header-cell day-header">
              <span className="day-name">{day.name.split(' ')[0]} {day.name.split(' ')[1]}</span>
              <span className="day-date">{day.date}</span>
            </div>
          ))}

          {/* Time Rows and Grid Cells */}
          {HOURS.map((hour, rowIdx) => (
            <React.Fragment key={hour}>
              {/* Time Label */}
              <div className="calendar-cell time-cell">
                <span>{hour}</span>
              </div>
              
              {/* Day Columns for this hour */}
              {DAYS.map((_, colIdx) => (
                <div key={`${rowIdx}-${colIdx}`} className="calendar-cell grid-cell"></div>
              ))}
            </React.Fragment>
          ))}

          {/* Absolute Positioned Events */}
          <div className="events-layer">
            {MOCK_EVENTS.map(event => {
              // Calculate positioning
              // Base hour is 8 AM (start = 8 -> offset 0)
              const startOffset = event.start - 8;
              const duration = event.end - event.start;
              
              // CSS grid starts at row 2 for data (row 1 is header)
              const rowStart = startOffset + 2; 
              // Day index 0 is Monday (col 2 in grid)
              const colStart = event.dayIndex + 2;

              return (
                <div 
                  key={event.id}
                  className={`event-card event-${event.type}`}
                  style={{
                    gridColumn: colStart,
                    gridRow: `${rowStart} / span ${duration}`
                  }}
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

      {/* Legend */}
      <div className="calendar-legend">
        <div className="legend-item"><span className="legend-dot booked"></span> Booked</div>
        <div className="legend-item"><span className="legend-dot your-booking"></span> Your Booking</div>
        <div className="legend-item"><span className="legend-dot overlapping"></span> Overlapping</div>
        <div className="legend-item"><span className="legend-dot maintenance"></span> Maintenance</div>
      </div>
    </div>
  );
};

export default CalendarView;
