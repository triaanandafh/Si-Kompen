'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { getRiwayatPengajuan } from './riwayat/actions';

interface UserProfile {
  name: string;
  nim: string;
  role: string;
  kelas: string;
  semester: string | number;
  prodi: string;
}

interface HistoryItem {
  id: string;
  createdAt: string;
  jumlahJam: number;
  status: string;
  matkul?: {
    namaMatkul: string;
  } | null;
}

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<UserProfile>({
    name: '',
    nim: '',
    role: 'Mahasiswa',
    kelas: '',
    semester: '',
    prodi: '',
  });

  const [recentHistory, setRecentHistory] = useState<HistoryItem[]>([]);  

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true);
      const savedUserStr = localStorage.getItem('user');
    if (savedUserStr) {
      try {
        const parsed = JSON.parse(savedUserStr);
        setUser({
          name: parsed.nama || parsed.name || '',
          nim: parsed.nim || '',
          role: parsed.role || 'Mahasiswa',
          kelas: parsed.kelas || '',
          semester: parsed.semester || '',
          prodi: parsed.prodi || '',
        });
        // Fetch riwayat pengajuan dari server jika ada ID user
          if (parsed.id) {
            const res = await getRiwayatPengajuan(parsed.id);
            if (res.success && res.data) {
              // Ambil 3 data pengajuan terbaru saja untuk ringkasan di Dashboard
              setRecentHistory((res.data as unknown as HistoryItem[]).slice(0, 3));
            }}
      } catch (err) {
        console.error('Error parsing user data:', err);
      }
    }
    setLoading(false);
  }
  fetchDashboardData();
  }, []);
  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
  
  // Helper Badge Color
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'MENUNGGU_TTD_DOSEN':
      case 'Menunggu TTD Dosen':
        return (
          <span className="text-amber-700 text-xs font-medium bg-amber-50 px-2.5 py-1 rounded-md">
            Menunggu TTD Dosen
          </span>
        );
      case 'SELESAI':
      case 'Selesai':
        return (
          <span className="text-emerald-700 text-xs font-medium bg-emerald-50 px-2.5 py-1 rounded-md">
            Selesai
          </span>
        );
      case 'DITOLAK':
      case 'Ditolak':
        return (
          <span className="text-rose-700 text-xs font-medium bg-rose-50 px-2.5 py-1 rounded-md">
            Ditolak
          </span>
        );
      default:
        return (
          <span className="text-slate-700 text-xs font-medium bg-slate-100 px-2.5 py-1 rounded-md">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Sidebar */}
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Top Header */}
        <header className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-sm text-slate-500">Ringkasan kompensasi presensi Anda</p>
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

        {/* Hero Banner */}
        <div className="bg-[#0F388A] rounded-2xl p-8 text-white mb-8 relative overflow-hidden shadow-sm">
          <p className="text-sm text-blue-200 mb-1">Selamat datang kembali,</p>
          <h2 className="text-3xl font-extrabold mb-3">{user.name}</h2>
          <p className="text-sm text-blue-100 max-w-xl leading-relaxed">
            Selesaikan kompensasi presensi Anda tepat waktu agar tidak mengganggu penilaian akhir semester.
          </p>
        </div>

        {/* Info Grid: Profile Card & Recent Status */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Card Profil Mahasiswa (4 cols) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-start">
            <div className="flex items-center gap-4 pb-6 border-b border-b border-slate-100">
              <div className="w-14 h-14 rounded-full bg-blue-100 text-[#0F388A] text-lg font-bold flex items-center justify-center">
                {initial}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">{user.name}</h3>
                <p className="text-sm text-slate-400">{user.nim}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Kelas</span>
                <span className="font-semibold text-slate-800">{user.kelas}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Semester</span>
                <span className="font-semibold text-slate-800">{user.semester}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Program Studi</span>
                <span className="font-semibold text-slate-800">{user.prodi}</span>
              </div>
            </div>
          </div>

          {/* Card Status Pengajuan Terbaru (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-800 mb-4">Status Pengajuan Terbaru</h3>
              
              {/* Stepper Status Box */}
              <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 mb-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="font-bold text-slate-800 text-base">Pemrograman Web Lanjut</h4>
                    <p className="text-xs text-slate-400 mt-0.5">KMP-0451 · 18 Maret 2024 · 4 jam</p>
                  </div>
                  {renderStatusBadge('MENUNGGU_TTD_DOSEN')}
                </div>

                {/* Progress Bar / Stepper */}
                <div className="relative pt-2">
                  <div className="h-1.5 bg-slate-200 rounded-full w-full overflow-hidden flex">
                    <div className="w-1/3 bg-amber-400 h-full"></div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mt-3 font-medium">
                    <span className="text-slate-700">Diajukan</span>
                    <span>TTD Dosen</span>
                    <span>Verifikasi KPS</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Button */}
            <button className="w-full bg-[#0F388A] hover:bg-blue-900 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
              <span className="text-base"></span> Ajukan Kompen Baru
            </button>
          </div>
        </div>

        {/* Section: Riwayat Pengajuan Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Riwayat Pengajuan</h3>
            <button className="text-xs font-semibold text-[#0F388A] hover:underline">
              Lihat semua
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-400 font-medium text-xs border-b border-slate-100">
                <tr>
                  <th className="pb-3 font-normal">Mata Kuliah</th>
                  <th className="pb-3 font-normal">Tanggal</th>
                  <th className="pb-3 font-normal">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-600">
              {loading ? (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-slate-400">
                    Memuat ringkasan riwayat...
                  </td>
                </tr>
              ) : recentHistory.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-slate-400">
                    Belum ada riwayat pengajuan kompen.
                  </td>
                </tr>
              ) : (
                recentHistory.map((item) => {
                  const dateFormatted = new Date(item.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  });

                  return (
                    <tr key={item.id}>
                      <td className="py-4 font-medium text-slate-800">
                        {item.matkul?.namaMatkul || '-'}
                      </td>
                      <td className="py-4 text-slate-500">{dateFormatted}</td>
                      <td className="py-4">{renderStatusBadge(item.status)}</td>
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