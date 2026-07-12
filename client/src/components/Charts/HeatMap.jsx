import React from 'react';
import './HeatMap.css';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const times = ['8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM'];

// Mock data representing booking intensity (0 to 1)
const heatData = [
  [0.2, 0.3, 0.1, 0.4, 0.2, 0.1, 0.1], // 8 AM
  [0.3, 0.4, 0.2, 0.5, 0.3, 0.1, 0.1], // 10 AM
  [0.6, 0.8, 0.7, 0.9, 0.6, 0.2, 0.1], // 12 PM
  [0.8, 0.9, 0.8, 0.8, 0.7, 0.3, 0.1], // 2 PM
  [0.4, 0.5, 0.8, 0.6, 0.5, 0.1, 0.1], // 4 PM
  [0.2, 0.3, 0.4, 0.3, 0.2, 0.1, 0.1], // 6 PM
];

// Helper to get color based on intensity (0 to 1)
// using the primary blue color #0052cc
const getColor = (intensity) => {
  if (intensity === 0) return '#f8f9fa';
  // Use rgba to control opacity based on intensity
  return `rgba(0, 82, 204, ${intensity})`;
};

const HeatMap = () => {
  return (
    <div className="heatmap-container">
      <div className="heatmap-grid">
        {/* Top-left empty cell */}
        <div className="heatmap-cell label-cell"></div>
        
        {/* Day labels (columns) */}
        {days.map((day) => (
          <div key={day} className="heatmap-cell label-cell col-label">
            {day}
          </div>
        ))}
        
        {/* Rows with Time label and data cells */}
        {times.map((time, rowIndex) => (
          <React.Fragment key={time}>
            <div className="heatmap-cell label-cell row-label">
              {time}
            </div>
            {days.map((_, colIndex) => {
              const intensity = heatData[rowIndex][colIndex];
              return (
                <div 
                  key={`${rowIndex}-${colIndex}`} 
                  className="heatmap-cell data-cell"
                  style={{ backgroundColor: getColor(intensity) }}
                  title={`${time} on ${days[colIndex]}`}
                ></div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default HeatMap;
