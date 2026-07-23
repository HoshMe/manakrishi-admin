'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const statusColor: any = {
  confirmed: 'bg-green-100 text-green-700',
  in_progress: 'bg-amber-100 text-amber-700',
  on_the_way: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
  pending: 'bg-gray-100 text-gray-600',
};

const filters = ['all', 'confirmed', 'in_progress', 'on_the_way', 'completed', 'cancelled'];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchBookings(); }, [filter]);

  const fetchBookings = async () => {
    setLoading(true);
    const params = filter === 'all' ? '' : `?status=${filter}`;
    const data = await api.getBookings(params);
    setBookings(data.results || data || []);
    setLoading(false);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Bookings</h1>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === f ? 'bg-green-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {f.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
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
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">Loading...</td></tr>
              ) : bookings.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">No bookings found</td></tr>
              ) : bookings.map((b: any) => (
                <tr key={b.booking_id || b.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{b.booking_id}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">{b.service?.replace(/_/g, ' ')}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{b.farmer_detail?.first_name} {b.farmer_detail?.last_name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{b.location_address}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{b.scheduled_date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">₹{b.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${statusColor[b.status] || 'bg-gray-100 text-gray-600'}`}>
                      {b.status?.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
