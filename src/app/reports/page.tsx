'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ReportsPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => { api.getStats().then(setStats); }, []);

  const data = [
    { name: 'Bookings', value: stats?.total_bookings || 0 },
    { name: 'Completed', value: stats?.completed || 0 },
    { name: 'In Progress', value: stats?.in_progress || 0 },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="value" fill="#2E7D32" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Metrics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">Total Revenue</span>
              <span className="text-lg font-bold text-gray-900">₹{(stats?.total_revenue || 0).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">Total Bookings</span>
              <span className="text-lg font-bold text-gray-900">{stats?.total_bookings || 0}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">Completion Rate</span>
              <span className="text-lg font-bold text-green-700">{stats?.total_bookings ? Math.round((stats.completed / stats.total_bookings) * 100) : 0}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
