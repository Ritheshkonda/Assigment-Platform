import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function StudentAnalytics() {
  const data = [
    { name: 'Alice', score: 2500, solved: 50 },
    { name: 'Bob', score: 2350, solved: 48 },
    { name: 'Charlie', score: 2200, solved: 45 }
  ];
  return (
    <div className="faculty-card">
      <div className="faculty-card-header">
        <span style={{ fontWeight: 700, fontSize: '1.14em' }}>Student Analytics</span>
      </div>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data} margin={{ top: 12, right: 40, left: 8, bottom: 16 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="score" fill="#7b61ff" />
          <Bar dataKey="solved" fill="#fdc23e" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
