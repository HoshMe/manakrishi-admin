'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const roles = ['all', 'farmer', 'operator', 'dealer', 'manager'];
const roleColors: Record<string, string> = {
  farmer: 'bg-green-50 text-green-700',
  operator: 'bg-blue-50 text-blue-700',
  dealer: 'bg-purple-50 text-purple-700',
  manager: 'bg-orange-50 text-orange-700',
};

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [role, setRole] = useState('all');
  const [loading, setLoading] = useState(true);
  const [editingRole, setEditingRole] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => { fetchUsers(); }, [role]);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await api.getUsers(role === 'all' ? '' : role);
    setUsers(data.results || data || []);
    setLoading(false);
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    setUpdatingId(userId);
    const res = await api.updateUserRole(userId, newRole);
    if (res.status === 'updated') {
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
    setUpdatingId(null);
    setEditingRole(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <span className="text-sm text-gray-500">{users.length} users</span>
      </div>

      <div className="flex gap-2 mb-6">
        {roles.map((r) => (
          <button key={r} onClick={() => setRole(r)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${role === r ? 'bg-green-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {r}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">District</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">No users found</td></tr>
            ) : users.map((u: any) => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{u.first_name} {u.last_name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{u.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{u.district || '—'}</td>
                <td className="px-6 py-4">
                  {editingRole === u.id ? (
                    <select
                      defaultValue={u.role}
                      autoFocus
                      disabled={updatingId === u.id}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                      onBlur={() => setEditingRole(null)}
                      className="px-2 py-1 border border-green-400 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      {['farmer', 'operator', 'dealer', 'manager'].map(r => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  ) : (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${roleColors[u.role] || 'bg-gray-50 text-gray-700'}`}>
                      {updatingId === u.id ? '...' : u.role}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">{u.is_verified ? <span className="text-green-600">✓ Verified</span> : <span className="text-gray-400">Pending</span>}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => setEditingRole(u.id)}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium border border-blue-200 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    Change Role
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
