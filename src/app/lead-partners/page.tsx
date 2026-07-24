'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function LeadPartnersPage() {
  const [dealers, setDealers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getUsers('dealer').then((data) => { setDealers(data.results || data || []); setLoading(false); });
  }, []);

  const filtered = dealers.filter(d => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      d.first_name?.toLowerCase().includes(q) ||
      d.last_name?.toLowerCase().includes(q) ||
      d.phone?.toLowerCase().includes(q) ||
      d.email?.toLowerCase().includes(q) ||
      d.address?.toLowerCase().includes(q) ||
      d.district?.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lead Partners</h1>
        <span className="text-sm text-gray-500">{filtered.length} dealers</span>
      </div>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name, phone, email, district..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No lead partners found</td></tr>
            ) : filtered.map((d: any) => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{d.first_name} {d.last_name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{d.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{d.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{d.address || '-'}</td>
                <td className="px-6 py-4"><span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
