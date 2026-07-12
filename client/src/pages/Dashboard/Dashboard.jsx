import React from 'react';
import { ArrowUpRight, ArrowDownRight, Laptop, Printer, Wrench, Calendar, ChevronDown } from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import './Dashboard.css';

// Data for charts
const utilizationData = [
  { name: 'Utilized', value: 65, color: '#3b82f6' },
  { name: 'Available', value: 35, color: '#06b6d4' }
];

const categoryData = [
  { name: 'Electronics', value: 412, percent: '38%', color: '#3b82f6' },
  { name: 'Furniture', value: 256, percent: '24%', color: '#a855f7' },
  { name: 'Vehicles', value: 152, percent: '14%', color: '#eab308' },
  { name: 'Equipment', value: 168, percent: '16%', color: '#ec4899' },
  { name: 'Others', value: 100, percent: '9%', color: '#8b5cf6' }
];

const trendData = [
  { date: 'Apr 29', requests: 5 },
  { date: 'May 6', requests: 10 },
  { date: 'May 13', requests: 7 },
  { date: 'May 20', requests: 11 },
  { date: 'May 27', requests: 16 }
];

const KPICard = ({ title, value, trend, trendIcon: TrendIcon, trendColor, trendText }) => (
  <div className="dashboard-card kpi-card">
    <div className="kpi-title">{title}</div>
    <div className="kpi-value">{value}</div>
    <div className={`kpi-trend ${trendColor}`}>
      {TrendIcon && <TrendIcon size={14} />}
      <span>{trend} {trendText}</span>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      {/* Top KPI Row */}
      <div className="kpi-grid">
        <KPICard 
          title="Assets Available" 
          value="425" 
          trend="↑ 12" 
          trendText="this week"
          trendColor="trend-up"
        />
        <KPICard 
          title="Assets Allocated" 
          value="278" 
          trend="↑ 8" 
          trendText="this week"
          trendColor="trend-up"
        />
        <KPICard 
          title="Maintenance Today" 
          value="7" 
          trend="↓ 2" 
          trendText="this week"
          trendColor="trend-down"
        />
        <KPICard 
          title="Active Bookings" 
          value="13" 
          trend="↑ 3" 
          trendText="today"
          trendColor="trend-up"
        />
        <KPICard 
          title="Upcoming Returns" 
          value="18" 
          trend="Due in next 7 days" 
          trendText=""
          trendColor="trend-neutral"
        />
        <KPICard 
          title="Overdue Returns" 
          value="5" 
          trend="Overdue" 
          trendText=""
          trendColor="trend-down"
        />
      </div>

      {/* Middle Analytics Row */}
      <div className="dashboard-row">
        {/* Asset Utilization Doughnut */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Asset Utilization</h3>
          </div>
          <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
            <div className="chart-container" style={{ flex: 1.2 }}>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={utilizationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {utilizationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="doughnut-center">
                <div className="doughnut-percent">65%</div>
                <div className="doughnut-label">Utilized</div>
              </div>
            </div>
            <div className="custom-legend" style={{ flex: 1 }}>
              {utilizationData.map(item => (
                <div className="legend-item" key={item.name}>
                  <span className="legend-dot" style={{ backgroundColor: item.color }}></span>
                  <span>{item.name}</span>
                  <span className="legend-value">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Maintenance Trend Line Chart */}
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Maintenance Trend</h3>
              <span className="kpi-title" style={{fontSize: '0.75rem'}}>This Month</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)', cursor: 'pointer'}}>
              This Month <ChevronDown size={14} />
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="requests" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }} 
                  activeDot={{ r: 6 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Important Alerts */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Important Alerts</h3>
          </div>
          <div className="alerts-list">
            <div className="alert-item">
              <div className="alert-icon red">O</div>
              <div className="alert-content">5 Returns are overdue</div>
              <a href="#" className="alert-action">View all</a>
            </div>
            <div className="alert-item">
              <div className="alert-icon orange">A</div>
              <div className="alert-content">2 Maintenance requests pending approval</div>
              <a href="#" className="alert-action">View all</a>
            </div>
            <div className="alert-item">
              <div className="alert-icon green">A</div>
              <div className="alert-content">Audit cycle 'May 2025' starts tomorrow</div>
              <a href="#" className="alert-action">View details</a>
            </div>
            <div className="alert-item">
              <div className="alert-icon blue">R</div>
              <div className="alert-content">Room B1 booking starts in 30 mins</div>
              <a href="#" className="alert-action">View booking</a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="dashboard-row bottom">
        {/* Recent Activity */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Recent Activity</h3>
          </div>
          <div className="activity-list">
            <div className="activity-item">
              <Laptop size={16} className="activity-icon" />
              <div className="activity-content">Laptop AF-1004 allocated to Priya Singh</div>
              <div className="activity-time">2 min ago</div>
            </div>
            <div className="activity-item">
              <Printer size={16} className="activity-icon" />
              <div className="activity-content">Projector AF-045 returned by Aman Verma</div>
              <div className="activity-time">15 min ago</div>
            </div>
            <div className="activity-item">
              <Wrench size={16} className="activity-icon" />
              <div className="activity-content">Maintenance request for AF-098 approved</div>
              <div className="activity-time">45 min ago</div>
            </div>
            <div className="activity-item">
              <Calendar size={16} className="activity-icon" />
              <div className="activity-content">Meeting Room B booked by HR Department</div>
              <div className="activity-time">1 hr ago</div>
            </div>
          </div>
          <div className="view-all">View all activity</div>
        </div>

        {/* Assets by Category */}
        <div className="dashboard-card">
          <div className="card-header">
            <h3 className="card-title">Assets by Category</h3>
          </div>
          <div style={{ display: 'flex', height: '100%', alignItems: 'center' }}>
            <div className="chart-container" style={{ flex: 1 }}>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="custom-legend" style={{ flex: 1.5 }}>
              {categoryData.map(item => (
                <div className="legend-item" key={item.name}>
                  <span className="legend-dot" style={{ backgroundColor: item.color }}></span>
                  <span>{item.name}</span>
                  <span className="legend-value">{item.value} ({item.percent})</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
