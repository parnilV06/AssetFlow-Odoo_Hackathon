import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './KPICard.css';

const KPICard = ({ title, value, icon: Icon, trend, trendValue, trendText, color = 'blue' }) => {
  const isPositive = trend === 'up';

  return (
    <div className="card kpi-card">
      <div className="kpi-header">
        <div className="kpi-title-section">
          <span className="kpi-title">{title}</span>
          <div className="kpi-value">{value}</div>
        </div>
        <div className={`kpi-icon-wrapper bg-${color}`}>
          <Icon className={`kpi-icon text-${color}`} size={24} />
        </div>
      </div>
      
      {(trendValue || trendText) && (
        <div className="kpi-footer">
          {trendValue && (
            <span className={`kpi-trend ${isPositive ? 'trend-up' : 'trend-down'}`}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {trendValue}
            </span>
          )}
          {trendText && <span className="kpi-trend-text">{trendText}</span>}
        </div>
      )}
    </div>
  );
};

export default KPICard;
