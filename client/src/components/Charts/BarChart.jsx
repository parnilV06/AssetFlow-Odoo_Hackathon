import React from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Electronics', count: 78 },
  { name: 'Furniture', count: 50 },
  { name: 'Vehicles', count: 35 },
  { name: 'Equipment', count: 58 },
  { name: 'Others', count: 25 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: 'white', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>{label}</p>
        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '2px', backgroundColor: '#0052cc' }}></span>
          Count: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const BarChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barSize={32}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: '#6b7280' }} 
          dy={10}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: '#6b7280' }} 
          domain={[0, 100]}
          ticks={[0, 20, 40, 60, 80, 100]}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f3f4f6' }} />
        <Bar dataKey="count" fill="#0052cc" radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;
