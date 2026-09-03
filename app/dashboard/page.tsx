'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import { getRiwayatPengajuan } from './riwayat/actions';

interface UserProfile {
  id?: string;
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
      const savedUserStr = localStorage.getItem('session_user') || localStorage.getItem('user');
      if (savedUserStr) {
        try {
          const parsed = JSON.parse(savedUserStr);
          setUser({
            id: parsed.id,
            name: parsed.nama || parsed.name || '',
            nim: parsed.nim || '',
            role: parsed.role || 'Mahasiswa',
            kelas: parsed.kelas || '',
            semester: parsed.semester || '',
            prodi: parsed.prodi || '',
          });

          if (parsed.id) {
            const res = await getRiwayatPengajuan(parsed.id);
            if (res.success && res.data) {
              setRecentHistory((res.data as unknown as HistoryItem[]).slice(0, 3));
            }
          }
        } catch (err) {
          console.error('Error parsing user data:', err);
        }
      }
      setLoading(false);
    }
    fetchDashboardData();
  }, []);

  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'MENUNGGU_TTD_DOSEN':
      case 'Menunggu TTD Dosen':
        return (
          <span className="text-amber-700 text-xs font-medium bg-amber-50 px-2.5 py-1 rounded-md">
            Menunggu TTD Dosen
          </span>
        );
      case 'DIPROSES_KPS':
      case 'VERIFIKASI_KPS':
        return (
          <span className="text-blue-700 text-xs font-medium bg-blue-50 px-2.5 py-1 rounded-md">
            Verifikasi KPS
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

  const getStepProgress = (status?: string) => {
    switch (status) {
      case 'MENUNGGU_TTD_DOSEN':
      case 'Menunggu TTD Dosen':
        return {
          widthClass: 'w-1/2',
          barColor: 'bg-amber-400',
          currentStep: 2,
        };
      case 'DIPROSES_KPS':
      case 'VERIFIKASI_KPS':
        return {
          widthClass: 'w-3/4',
          barColor: 'bg-blue-500',
          currentStep: 3,
        };
      case 'SELESAI':
      case 'Selesai':
        return {
          widthClass: 'w-full',
          barColor: 'bg-emerald-500',
          currentStep: 3,
        };
      case 'DITOLAK':
      case 'Ditolak':
        return {
          widthClass: 'w-full',
          barColor: 'bg-rose-500',
          currentStep: 0,
        };
      default:
        return {
          widthClass: 'w-1/3',
          barColor: 'bg-slate-300',
          currentStep: 1,
        };
    }
  };

  const latestItem = recentHistory[0];
  const progress = getStepProgress(latestItem?.status);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-sm text-slate-500">Ringkasan kompensasi presensi Anda</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800">{user.name || '-'}</p>
              <p className="text-xs text-slate-400">{user.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0F388A] font-semibold flex items-center justify-center text-sm">
              {initial}
            </div>
          </div>
        </header>

        <div className="bg-[#0F388A] rounded-2xl p-8 text-white mb-8 relative overflow-hidden shadow-sm">
          <p className="text-sm text-blue-200 mb-1">Selamat datang kembali,</p>
          <h2 className="text-3xl font-extrabold mb-3">{user.name || 'Mahasiswa'}</h2>
          <p className="text-sm text-blue-100 max-w-xl leading-relaxed">
            Selesaikan kompensasi presensi Anda tepat waktu agar tidak mengganggu penilaian akhir semester.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-start">
            <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
              <div className="w-14 h-14 rounded-full bg-blue-100 text-[#0F388A] text-lg font-bold flex items-center justify-center">
                {initial}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">{user.name || '-'}</h3>
                <p className="text-sm text-slate-400">{user.nim || '-'}</p>
              </div>
            </div>

            <div className="space-y-4 pt-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Kelas</span>
                <span className="font-semibold text-slate-800">{user.kelas || '-'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Semester</span>
                <span className="font-semibold text-slate-800">{user.semester || '-'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Program Studi</span>
                <span className="font-semibold text-slate-800">{user.prodi || '-'}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-slate-800 mb-4">Status Pengajuan Terbaru</h3>

              <div className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 mb-6">
                {loading ? (
                  <p className="text-sm text-slate-400 py-4 text-center">Memuat status pengajuan...</p>
                ) : !latestItem ? (
                  <p className="text-sm text-slate-400 py-4 text-center">Belum ada pengajuan aktif saat ini.</p>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h4 className="font-bold text-slate-800 text-base">
                          {latestItem.matkul?.namaMatkul || '-'}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          KMP-{latestItem.id?.slice(0, 4).toUpperCase()} ·{' '}
                          {new Date(latestItem.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}{' '}
                          · {latestItem.jumlahJam} jam
                        </p>
                      </div>
                      {renderStatusBadge(latestItem.status)}
                    </div>

                    <div className="relative pt-2">
                      <div className="h-1.5 bg-slate-200 rounded-full w-full overflow-hidden flex">
                        <div
                          className={`h-full transition-all duration-500 ${progress.widthClass} ${progress.barColor}`}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs mt-3 font-medium">
                        <span className={progress.currentStep >= 1 ? 'text-slate-800 font-bold' : 'text-slate-400'}>
                          Diajukan
                        </span>
                        <span className={progress.currentStep >= 2 ? 'text-slate-800 font-bold' : 'text-slate-400'}>
                          TTD Dosen
                        </span>
                        <span className={progress.currentStep >= 3 ? 'text-slate-800 font-bold' : 'text-slate-400'}>
                          Verifikasi KPS
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            <Link
              href="/dashboard/ajukan"
              className="w-full bg-[#0F388A] hover:bg-blue-900 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-colors text-center block"
            >
              Ajukan Kompen Baru
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-800">Riwayat Pengajuan</h3>
            <Link href="/dashboard/riwayat" className="text-xs font-semibold text-[#0F388A] hover:underline">
              Lihat semua
            </Link>
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