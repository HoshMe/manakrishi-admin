'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function CommissionPage() {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCommissions().then((data) => { setCommissions(data.results || data.history || data || []); setLoading(false); });
  }, []);

  const filtered = commissions.filter(c => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.dealer_name?.toLowerCase().includes(q) ||
      c.booking_id?.toLowerCase().includes(q) ||
      c.amount?.toString().includes(q)
    );
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Commission</h1>
        <span className="text-sm text-gray-500">{filtered.length} records</span>
      </div>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by dealer, booking ID, amount..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dealer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Booking</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Withdrawn</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No commissions yet</td></tr>
            ) : filtered.map((c: any, i: number) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{c.dealer_name || '-'}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{c.booking_id || '-'}</td>
                <td className="px-6 py-4 text-sm font-medium text-green-700">₹{c.amount}</td>
                <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${c.is_withdrawn ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{c.is_withdrawn ? 'Yes' : 'Pending'}</span></td>
                <td className="px-6 py-4 text-sm text-gray-600">{c.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
