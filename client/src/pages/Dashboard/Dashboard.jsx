import React, { useState, useEffect } from 'react';
import { Laptop, Printer, Wrench, Calendar, ChevronDown, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { dashboardService } from '../../services/dashboard';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

const COLORS = ['#3b82f6', '#06b6d4', '#a855f7', '#eab308', '#ec4899', '#8b5cf6'];

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
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardService.getDashboard();
        if (res.success) {
          setData(res.data);
        } else {
          setError('Failed to load dashboard data');
        }
      } catch (err) {
        setError(err.message || 'Error fetching dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <div className="p-8">Loading dashboard...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
  if (!data) return null;

  const isEmployee = user?.role === 'EMPLOYEE';

  if (isEmployee) {
    const { summary, myAllocations, myBookings, myMaintenance } = data;
    return (
      <div className="dashboard-page">
        <div className="kpi-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <KPICard title="My Active Allocations" value={summary.activeAllocations} trendColor="trend-neutral" />
          <KPICard title="My Active Bookings" value={summary.activeBookings} trendColor="trend-neutral" />
          <KPICard title="My Pending Maintenance" value={summary.pendingMaintenance} trendColor="trend-neutral" />
        </div>
        
        <div className="dashboard-row bottom" style={{ marginTop: '2rem' }}>
          <div className="dashboard-card">
            <div className="card-header"><h3 className="card-title">My Allocations</h3></div>
            <div className="activity-list">
              {myAllocations?.length > 0 ? myAllocations.map(a => (
                <div key={a.id} className="activity-item">
                  <Laptop size={16} className="activity-icon" />
                  <div className="activity-content">{a.asset.name} (Tag: {a.asset.assetTag})</div>
                </div>
              )) : <div className="text-secondary text-sm">No active allocations.</div>}
            </div>
          </div>
          
          <div className="dashboard-card">
            <div className="card-header"><h3 className="card-title">My Bookings</h3></div>
            <div className="activity-list">
              {myBookings?.length > 0 ? myBookings.map(b => (
                <div key={b.id} className="activity-item">
                  <Calendar size={16} className="activity-icon" />
                  <div className="activity-content">{b.asset.name} (Tag: {b.asset.assetTag})</div>
                </div>
              )) : <div className="text-secondary text-sm">No active bookings.</div>}
            </div>
          </div>
          
          <div className="dashboard-card">
            <div className="card-header"><h3 className="card-title">My Maintenance Requests</h3></div>
            <div className="activity-list">
              {myMaintenance?.length > 0 ? myMaintenance.map(m => (
                <div key={m.id} className="activity-item">
                  <Wrench size={16} className="activity-icon" />
                  <div className="activity-content">{m.asset.name} (Tag: {m.asset.assetTag})</div>
                </div>
              )) : <div className="text-secondary text-sm">No pending maintenance.</div>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MANAGER/ADMIN VIEW
  const { summary, assetAnalytics, bookingAnalytics, maintenance, recentData } = data;

  // Process data for charts
  const utilizedTotal = summary.allocatedAssets + summary.reservedAssets + summary.underMaintenance;
  const utilizationData = [
    { name: 'Utilized', value: utilizedTotal, color: '#3b82f6' },
    { name: 'Available', value: summary.availableAssets, color: '#06b6d4' }
  ];
  const utilizedPercent = summary.totalAssets > 0 ? Math.round((utilizedTotal / summary.totalAssets) * 100) : 0;

  const categoryData = assetAnalytics.categoryDistribution.map((cat, i) => ({
    name: cat.name,
    value: cat.count,
    percent: Math.round((cat.count / summary.totalAssets) * 100) + '%',
    color: COLORS[i % COLORS.length]
  }));

  const trendData = bookingAnalytics.monthlyTrend.map(m => {
    const [year, month] = m.month.split('-');
    const date = new Date(year, month - 1, 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    return { date, requests: m.count };
  });

  return (
    <div className="dashboard-page">
      {/* Top KPI Row */}
      <div className="kpi-grid">
        <KPICard 
          title="Assets Available" 
          value={summary.availableAssets} 
          trend={`${summary.totalAssets} Total`}
          trendColor="trend-neutral"
        />
        <KPICard 
          title="Assets Allocated" 
          value={summary.allocatedAssets} 
          trend="" 
          trendColor="trend-up"
        />
        <KPICard 
          title="Under Maintenance" 
          value={summary.underMaintenance} 
          trend={`${maintenance.pending} pending`}
          trendColor="trend-down"
        />
        <KPICard 
          title="Active Bookings" 
          value={summary.activeBookings} 
          trend={`${bookingAnalytics.upcomingBookings} upcoming`}
          trendColor="trend-up"
        />
        <KPICard 
          title="Upcoming Returns" 
          value={recentData.upcomingReturns?.length || 0} 
          trend="In next 7 days" 
          trendColor="trend-neutral"
        />
        <KPICard 
          title="Disposed Assets" 
          value={summary.disposedAssets} 
          trend="" 
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
                <div className="doughnut-percent">{utilizedPercent}%</div>
                <div className="doughnut-label">Utilized</div>
              </div>
            </div>
            <div className="custom-legend" style={{ flex: 1 }}>
              {utilizationData.map(item => (
                <div className="legend-item" key={item.name}>
                  <span className="legend-dot" style={{ backgroundColor: item.color }}></span>
                  <span>{item.name}</span>
                  <span className="legend-value">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Booking Trend Line Chart */}
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Booking Trend</h3>
              <span className="kpi-title" style={{fontSize: '0.75rem'}}>Last 6 Months</span>
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
            <h3 className="card-title">Action Items</h3>
          </div>
          <div className="alerts-list">
            {maintenance.pending > 0 && (
              <div className="alert-item">
                <div className="alert-icon orange"><Clock size={14}/></div>
                <div className="alert-content">{maintenance.pending} Maintenance requests pending approval</div>
              </div>
            )}
            {bookingAnalytics.upcomingBookings > 0 && (
              <div className="alert-item">
                <div className="alert-icon blue"><Calendar size={14}/></div>
                <div className="alert-content">{bookingAnalytics.upcomingBookings} Upcoming bookings</div>
              </div>
            )}
            {recentData.upcomingReturns?.length > 0 && (
              <div className="alert-item">
                <div className="alert-icon red"><AlertCircle size={14}/></div>
                <div className="alert-content">{recentData.upcomingReturns.length} Allocations to be returned soon</div>
              </div>
            )}
            {maintenance.pending === 0 && bookingAnalytics.upcomingBookings === 0 && recentData.upcomingReturns?.length === 0 && (
               <div className="text-secondary text-sm p-2">You are all caught up!</div>
            )}
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
          <div className="activity-list" style={{ flex: 1, overflowY: 'auto' }}>
            {recentData.recentActivity?.length > 0 ? recentData.recentActivity.map(act => (
              <div key={act.id} className="activity-item">
                <CheckCircle size={16} className="activity-icon text-blue-500" />
                <div className="activity-content">{act.action} - {act.entity} #{act.entityId} ({act.user?.name})</div>
                <div className="activity-time">{new Date(act.createdAt).toLocaleDateString()}</div>
              </div>
            )) : <div className="text-secondary text-sm p-2">No recent activity.</div>}
          </div>
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
              {categoryData.length > 0 ? categoryData.map(item => (
                <div className="legend-item" key={item.name}>
                  <span className="legend-dot" style={{ backgroundColor: item.color }}></span>
                  <span>{item.name}</span>
                  <span className="legend-value">{item.value} ({item.percent})</span>
                </div>
              )) : <div className="text-secondary text-sm">No data</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
