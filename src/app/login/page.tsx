'use client';
import { useState } from 'react';
import { Leaf } from 'lucide-react';
import { api } from '@/lib/api';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    if (phone.length < 10) { setError('Enter valid phone number'); return; }
    setLoading(true);
    setError('');
    const result = await api.sendOtp(`+91${phone}`);
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    setOtpSent(true);
    if (result.debug_otp) setError(`DEV OTP: ${result.debug_otp}`);
  };

  const handleVerify = async () => {
    if (otp.length < 4) { setError('Enter OTP'); return; }
    setLoading(true);
    setError('');
    const result = await api.verifyOtp(`+91${phone}`, otp);
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    if (result.user?.role !== 'admin' && result.user?.role !== 'manager') {
      setError('Access denied. Admin/Manager role required.');
      return;
    }
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
            <div className="flex gap-2">
              <span className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-600">+91</span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                maxLength={10}
                disabled={otpSent}
                className="flex-1 px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {otpSent && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          <button
            onClick={otpSent ? handleVerify : handleSendOtp}
            disabled={loading}
            className="w-full bg-green-700 text-white py-3 rounded-xl font-medium hover:bg-green-800 transition-colors disabled:opacity-50"
          >
            {loading ? '...' : otpSent ? 'Verify & Login' : 'Send OTP'}
          </button>
        </div>
      </div>
    </div>
  );
}
