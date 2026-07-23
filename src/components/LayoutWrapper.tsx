'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const isLoginPage = pathname === '/login' || pathname === '/login/';

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token && !isLoginPage) {
      router.replace('/login');
    } else {
      setChecked(true);
    }
  }, [pathname]);

  if (!checked && !isLoginPage) return null;

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar />
      <main className="ml-64 min-h-screen p-8">{children}</main>
    </>
  );
}
