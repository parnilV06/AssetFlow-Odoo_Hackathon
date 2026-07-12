import React from 'react';
import { Download, Calendar as CalendarIcon, Package, PieChart, Clock, Wrench, CalendarDays } from 'lucide-react';
import Button from '../../components/Button/Button';
import KPICard from '../../components/Cards/KPICard';
import ChartCard from '../../components/Cards/ChartCard';
import LineChart from '../../components/Charts/LineChart';
import DonutChart from '../../components/Charts/DonutChart';
import BarChart from '../../components/Charts/BarChart';
import HeatMap from '../../components/Charts/HeatMap';
import './Reports.css';

const Reports = () => {
  return (
    <div className="reports-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports & Analytics</h1>
          <p className="page-subtitle">Insights and analytics about your assets</p>
        </div>
        <div className="reports-actions">
          <div className="date-picker-btn">
            <CalendarIcon size={16} className="text-secondary" />
            <span>01 May, 2024 - 31 May, 2024</span>
            <span className="chevron-down"></span>
          </div>
          <Button variant="secondary" icon={Download}>
            Export
          </Button>
        </div>
      </div>

      <div className="kpi-grid">
        <KPICard 
          title="Total Assets" 
          value="1,081" 
          icon={Package} 
          color="blue"
          trend="up" 
          trendValue="8.4%" 
          trendText="vs last month" 
        />
        <KPICard 
          title="Utilization Rate" 
          value="65%" 
          icon={PieChart} 
          color="green"
          trend="up" 
          trendValue="12.6%" 
          trendText="vs last month" 
        />
        <KPICard 
          title="Avg. Turnaround Time" 
          value="2.4 days" 
          icon={Clock} 
          color="purple"
          trend="up" 
          trendValue="0.6 days" 
        />
        <KPICard 
          title="Total Maintenance" 
          value="48" 
          icon={Wrench} 
          color="orange"
          trend="up" 
          trendValue="9%" 
        />
        {/* The reference image shows 5 cards, but 4 fit perfectly in a grid. I will add the 5th based on the description "Total Bookings" but the image only shows 5. The image actually shows 5 cards in one row, which is a bit crowded. Let's do a 5-column grid or adjust for 4. I'll add the 5th and use flex/grid to fit them. */}
        <KPICard 
          title="Total Bookings" 
          value="156" 
          icon={CalendarDays} 
          color="blue"
          trend="up" 
          trendValue="18%" 
        />
      </div>

      <div className="charts-grid">
        <ChartCard title="Asset Utilization Trend">
          <LineChart />
        </ChartCard>
        
        <ChartCard title="Assets by Department">
          <DonutChart />
        </ChartCard>

        <ChartCard title="Maintenance Frequency by Category">
          <BarChart />
        </ChartCard>

        <ChartCard title="Resource Booking Heatmap">
          <HeatMap />
        </ChartCard>
      </div>
    </div>
  );
};

export default Reports;
