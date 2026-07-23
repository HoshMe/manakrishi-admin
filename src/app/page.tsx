'use client';
import { useEffect, useState } from 'react';
import { CalendarCheck, IndianRupee, Handshake, Users } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { api } from '@/lib/api';

const COLORS = ['#2E7D32', '#66BB6A', '#FFC107', '#FF7043', '#78909C'];

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [s, b] = await Promise.all([api.getStats(), api.getBookings('?page_size=5')]);
      setStats(s);
      setBookings(b.results || b || []);
    } catch (e) {}
  };

  // Chart data
  const monthlyData = [
    { month: 'Jan', bookings: 120 },
    { month: 'Feb', bookings: 180 },
    { month: 'Mar', bookings: 240 },
    { month: 'Apr', bookings: 310 },
    { month: 'May', bookings: 420 },
    { month: 'Jun', bookings: stats?.total_bookings || 500 },
  ];

  const serviceData = [
    { name: 'Drone Spraying', value: 35 },
    { name: 'Tractor Rental', value: 25 },
    { name: 'Harvester', value: 18 },
    { name: 'Rotavator', value: 12 },
    { name: 'Others', value: 10 },
  ];

  const metricCards = [
    { label: 'Total Bookings', value: stats?.total_bookings || 0, icon: CalendarCheck, color: 'bg-green-50 text-green-700', iconBg: 'bg-green-100' },
    { label: 'Total Revenue', value: `₹${(stats?.total_revenue || 0).toLocaleString()}`, icon: IndianRupee, color: 'bg-blue-50 text-blue-700', iconBg: 'bg-blue-100' },
    { label: 'Total Partners', value: stats?.total_partners || 0, icon: Handshake, color: 'bg-amber-50 text-amber-700', iconBg: 'bg-amber-100' },
    { label: 'Total Farmers', value: stats?.total_farmers || 0, icon: Users, color: 'bg-purple-50 text-purple-700', iconBg: 'bg-purple-100' },
  ];

  const statusColor: any = {
    confirmed: 'bg-green-100 text-green-700',
    in_progress: 'bg-amber-100 text-amber-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metricCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${card.iconBg} flex items-center justify-center`}>
                <card.icon className={`w-6 h-6 ${card.color.split(' ')[1]}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bookings Over Time */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Bookings Over Time</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#9e9e9e" fontSize={12} />
              <YAxis stroke="#9e9e9e" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="bookings" stroke="#2E7D32" strokeWidth={3} dot={{ fill: '#2E7D32', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bookings By Service */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Bookings By Service</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={serviceData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {serviceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Farmer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.map((b: any) => (
                <tr key={b.booking_id || b.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{b.booking_id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">{b.service?.replace(/_/g, ' ')}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{b.farmer_detail?.first_name || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{b.location_address || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{b.scheduled_date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{b.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor[b.status] || 'bg-gray-100 text-gray-600'}`}>
                      {b.status?.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">No bookings yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
