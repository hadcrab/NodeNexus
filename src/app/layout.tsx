import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export const metadata: Metadata = {
  title: 'NodeNexus',
  description: 'Личное хранилище знаний с графами',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100">
        <Sidebar />
        <div className="flex-1">
          <Header />
          <main className="p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}