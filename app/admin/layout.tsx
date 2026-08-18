import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import AdminHeader from '@/components/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar Kiri - Permanent */}
      <AdminSidebar />

      {/* Area Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header Atas - Permanent di semua route /admin */}
        <AdminHeader />

        {/* Dynamic Page Content */}
        <main className="p-8 flex-1">{children}</main>
      </div>
    </div>
  );
}