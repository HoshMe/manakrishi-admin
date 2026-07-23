'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function LeadPartnersPage() {
  const [dealers, setDealers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getUsers('dealer').then((data) => { setDealers(data.results || data || []); setLoading(false); });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Lead Partners</h1>
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
            ) : dealers.length === 0 ? (
              <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">No lead partners found</td></tr>
            ) : dealers.map((d: any) => (
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
