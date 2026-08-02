'use client';

import React, { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';

export default function DashboardPage() {
    const [user, setUser] = useState<{ name: string; nim: string; role: string }>({
    name: '',
    nim: '',
    role: '',
  });

  useEffect(() => {
    // Simulasi mengambil data user dari LocalStorage atau Session
    // Nanti bagian ini dihubungkan ke API / Supabase Auth kamu
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // Data default/fallback jika belum ada data login
      setUser({
        name: 'Tria Ananda',
        nim: '2141720000',
        role: 'Mahasiswa',
      });
    }
  }, []);
  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';
  
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
                <span className="font-semibold text-slate-800">TI-3B</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Semester</span>
                <span className="font-semibold text-slate-800">6</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Program Studi</span>
                <span className="font-semibold text-slate-800">D-IV Teknik Informatika</span>
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
                  <span className="bg-amber-100/80 text-amber-800 text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Menunggu TTD Dosen
                  </span>
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
                <tr>
                  <td className="py-4 font-medium text-slate-800">Pemrograman Web Lanjut</td>
                  <td className="py-4 text-slate-500">18 Maret 2024</td>
                  <td className="py-4">
                    <span className="text-amber-700 text-xs font-medium bg-amber-50 px-2.5 py-1 rounded-md">
                      Menunggu TTD Dosen
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}