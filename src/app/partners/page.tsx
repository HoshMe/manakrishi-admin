'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function PartnersPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getUsers('operator').then((data) => { setPartners(data.results || data || []); setLoading(false); });
  }, []);

  const filtered = partners.filter(p => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      p.first_name?.toLowerCase().includes(q) ||
      p.last_name?.toLowerCase().includes(q) ||
      p.phone?.toLowerCase().includes(q) ||
      p.district?.toLowerCase().includes(q) ||
      (p.services || []).join(' ').toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Service Partners</h1>
        <span className="text-sm text-gray-500">{filtered.length} partners</span>
      </div>

      <div className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name, phone, district, service..."
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">No partners found</td></tr>
            ) : filtered.map((p: any) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.first_name} {p.last_name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{p.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{p.address || '-'}</td>
                <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.is_active !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{p.is_active !== false ? 'Active' : 'Inactive'}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
