import type { Metadata } from 'next';
import './globals.css';
import LayoutWrapper from '@/components/LayoutWrapper';

export const metadata: Metadata = {
  title: 'ManaKrishi Admin',
  description: 'Admin Dashboard for ManaKrishi Agri Services',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
