import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'IT', value: 476, percentage: '44%', color: '#3b82f6' },      // Blue
  { name: 'HR', value: 195, percentage: '18%', color: '#8b5cf6' },      // Purple
  { name: 'Finance', value: 125, percentage: '12%', color: '#f97316' }, // Orange
  { name: 'Operations', value: 190, percentage: '17%', color: '#f59e0b' },// Amber
  { name: 'Others', value: 95, percentage: '9%', color: '#0ea5e9' },    // Light Blue
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{ backgroundColor: 'white', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: data.color }}></span>
          {data.name}: {data.value}
        </p>
      </div>
    );
  }
  return null;
};

const DonutChart = () => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }}>
      <div style={{ flex: '1 1 50%', height: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Custom Legend to match image */}
      <div style={{ flex: '1 1 50%', display: 'flex', flexDirection: 'column', gap: '16px', paddingLeft: '20px' }}>
        {data.map((item, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color }}></span>
              <span style={{ color: '#111827', fontWeight: 500 }}>{item.name}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px', color: '#111827', fontWeight: 600 }}>
              <span>{item.value}</span>
              <span style={{ color: '#6b7280', fontWeight: 400 }}>({item.percentage})</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChart;
