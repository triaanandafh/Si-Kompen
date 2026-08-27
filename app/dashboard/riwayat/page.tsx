'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { getRiwayatPengajuan } from './actions';

interface HistoryItem {
  id: string;
  createdAt: string;
  jumlahJam: number;
  status: string;
  matkul?: {
    namaMatkul: string;
  } | null;
}

export default function RiwayatPengajuanPage() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; role: string }>({
    name: '',
    role: 'Mahasiswa',
  });

  // Mock Data Riwayat Pengajuan
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);

  useEffect(() => {
    async function fetchRiwayat() {
      setLoading(true);
      const savedUserStr = localStorage.getItem('user');

      if (savedUserStr) {
        try {
          const parsedUser = JSON.parse(savedUserStr);
          setUser({
            name: parsedUser.nama || parsedUser.name || 'Mahasiswa',
            role: parsedUser.role || 'Mahasiswa',
          });

          // 3. Panggil Server Action dengan ID User dari localStorage
          if (parsedUser.id) {
            const res = await getRiwayatPengajuan(parsedUser.id);
            if (res.success && res.data) {
              setHistoryList(res.data as unknown as HistoryItem[]);
            }
          }
        } catch (err) {
          console.error('Error loading riwayat:', err);
        }
      }
      setLoading(false);
    }

    fetchRiwayat();
  }, []);

 const initial = user.name ? user.name.charAt(0).toUpperCase() : 'M';

  // Helper Badge Color berdasarkan Enum Status DB
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'Menunggu TTD Dosen':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Menunggu TTD Dosen
          </span>
        );
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Selesai
          </span>
        );
      case 'Ditolak':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Ditolak
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Top Header */}
        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Riwayat Pengajuan
            </h1>
            <p className="text-sm text-slate-500">
              Seluruh pengajuan kompen yang pernah Anda buat
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-400">{user.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0F388A] font-semibold flex items-center justify-center text-sm">
              {initial}
            </div>
          </div>
        </header>

        {/* Table Container */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-medium text-xs">
                  <th className="py-4 px-6 font-medium">Kode</th>
                  <th className="py-4 px-6 font-medium">Mata Kuliah</th>
                  <th className="py-4 px-6 font-medium">Tanggal</th>
                  <th className="py-4 px-6 font-medium">Jam</th>
                  <th className="py-4 px-6 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      Memuat riwayat pengajuan...
                    </td>
                  </tr>
                ) : historyList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400">
                      Belum ada riwayat pengajuan kompen.
                    </td>
                  </tr>
                ) : (
                  historyList.map((item) => {
                    const dateFormatted = new Date(item.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    });

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="py-5 px-6 text-slate-400 font-mono text-xs">
                          KMP-{item.id.slice(0, 4).toUpperCase()}
                        </td>
                        <td className="py-5 px-6 font-semibold text-slate-800">
                          {item.matkul?.namaMatkul || '-'}
                        </td>
                        <td className="py-5 px-6 text-slate-500">
                          {dateFormatted}
                        </td>
                        <td className="py-5 px-6 text-slate-500">
                          {item.jumlahJam} jam
                        </td>
                        <td className="py-5 px-6">
                          {renderStatusBadge(item.status)}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}