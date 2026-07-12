import React from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'May 1', value: 50 },
  { name: 'May 4', value: 58 },
  { name: 'May 8', value: 62 },
  { name: 'May 11', value: 48 },
  { name: 'May 15', value: 60 },
  { name: 'May 18', value: 71 },
  { name: 'May 22', value: 76 },
  { name: 'May 25', value: 60 },
  { name: 'May 29', value: 69 },
  { name: 'Jun 1', value: 58 },
  { name: 'Jun 4', value: 67 },
  { name: 'Jun 8', value: 56 },
  { name: 'Jun 11', value: 65 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ backgroundColor: 'white', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <p style={{ margin: 0, fontSize: '0.75rem', color: '#6b7280', marginBottom: '4px' }}>{label}</p>
        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#111827', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#0052cc' }}></span>
          Utilization: {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

const LineChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: '#6b7280' }} 
          minTickGap={30}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fontSize: 12, fill: '#6b7280' }} 
          tickFormatter={(val) => `${val}%`}
          domain={[0, 100]}
          ticks={[0, 25, 50, 75, 100]}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e7eb', strokeWidth: 1, strokeDasharray: '4 4' }} />
        <Line 
          type="monotone" 
          dataKey="value" 
          stroke="#0052cc" 
          strokeWidth={3} 
          dot={{ r: 4, strokeWidth: 2, fill: '#0052cc', stroke: '#fff' }} 
          activeDot={{ r: 6, strokeWidth: 2, stroke: '#fff' }} 
        />
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;
