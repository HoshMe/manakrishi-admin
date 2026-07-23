const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.manakrishi.in/api';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'mk-admin-67c30638d2b7b3764d1c42162d7c7930';

class AdminApi {
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') localStorage.setItem('admin_token', token);
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') return localStorage.getItem('admin_token');
    return null;
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') localStorage.removeItem('admin_token');
  }

  async request(endpoint: string, options: any = {}) {
    const headers: any = { 'Content-Type': 'application/json', 'X-API-Key': API_KEY, ...options.headers };
    const token = this.getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      });
      return res.json();
    } catch (e) {
      return { error: 'Network error', results: [] };
    }
  }

  // Auth
  sendOtp(phone: string) { return this.request('/auth/send-otp/', { method: 'POST', body: { phone } }); }
  verifyOtp(phone: string, otp: string) { return this.request('/auth/verify-otp/', { method: 'POST', body: { phone, otp } }); }
  adminLogin(phone: string, password: string) { return this.request('/auth/admin-login/', { method: 'POST', body: { phone, password } }); }

  // Dashboard stats
  getStats() { return this.request('/bookings/stats/'); }

  // Bookings
  getBookings(params = '') { return this.request(`/bookings/${params}`); }
  updateBookingStatus(id: number, status: string) { return this.request(`/bookings/${id}/update_status/`, { method: 'POST', body: { status } }); }
  assignOperator(id: number, operatorId: number) { return this.request(`/bookings/${id}/assign_operator/`, { method: 'POST', body: { operator_id: operatorId } }); }

  // Users
  getUsers(role = '') { return this.request(`/auth/all-users/${role ? `?role=${role}` : ''}`); }

  // Payments
  getPayments() { return this.request('/payments/transactions/'); }
  getCommissions() { return this.request('/payments/commissions/'); }

  // KYC
  getKYCPending() { return this.request('/auth/kyc/pending/'); }
  reviewKYC(docId: number, action: string, remarks = '') { return this.request('/auth/kyc/review/', { method: 'POST', body: { doc_id: docId, action, remarks } }); }

  // Service Pricing
  getServicePricing() { return this.request('/bookings/pricing/'); }
  updateServicePricing(pricing: Record<string, number>) { return this.request('/bookings/pricing/', { method: 'POST', body: pricing }); }

  // User Role
  updateUserRole(userId: number, role: string) { return this.request('/bookings/update-user-role/', { method: 'POST', body: { user_id: userId, role } }); }

  // Generic helpers
  get(endpoint: string) { return this.request(endpoint); }
  post(endpoint: string, body: any = {}) { return this.request(endpoint, { method: 'POST', body }); }
}

export const api = new AdminApi();
export const apiClient = api;
