'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CalendarCheck, Users, Handshake, Store, Percent, CreditCard, BarChart3, Settings, LogOut, Leaf, Shield } from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/' },
  { label: 'Bookings', icon: CalendarCheck, href: '/bookings' },
  { label: 'Users', icon: Users, href: '/users' },
  { label: 'Partners', icon: Handshake, href: '/partners' },
  { label: 'KYC Verification', icon: Shield, href: '/kyc' },
  { label: 'Lead Partners', icon: Store, href: '/lead-partners' },
  { label: 'Commission', icon: Percent, href: '/commission' },
  { label: 'Payments', icon: CreditCard, href: '/payments' },
  { label: 'Reports', icon: BarChart3, href: '/reports' },
  { label: 'Settings', icon: Settings, href: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    window.location.href = '/login';
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-700 rounded-xl flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-green-800">ManaKrishi</h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all ${
                isActive
                  ? 'bg-green-50 text-green-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-green-700' : 'text-gray-400'}`} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-red-500 hover:bg-red-50 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
