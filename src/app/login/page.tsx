'use client';
import { useState } from 'react';
import { Leaf } from 'lucide-react';
import { api } from '@/lib/api';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (phone.length < 10) { setError('Enter valid phone number'); return; }
    if (!password) { setError('Enter password'); return; }
    setLoading(true);
    setError('');
    const result = await api.adminLogin(phone, password);
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    api.setToken(result.tokens.access);
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Leaf className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">ManaKrishi Admin</h1>
          <p className="text-gray-500 mt-1">Login to admin panel</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter phone number"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-green-700 text-white py-3 rounded-xl font-medium hover:bg-green-800 transition-colors disabled:opacity-50"
          >
            {loading ? '...' : 'Login'}
          </button>
        </div>
      </div>
    </div>
  );
}
