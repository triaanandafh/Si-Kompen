'use client';

import React, { useState, useEffect } from 'react';
import { getDashboardData } from './actions';

interface SubmissionItem {
  id: string;
  semester: number;
  kelas: string;
  status: string;
  createdAt: string;
  mahasiswa?: {
    nama: string;
    nim: string;
  } | null;
  matkul?: {
    namaMatkul: string;
    prodi: string;
  } | null;
}

export default function AdminDashboardPage() {
  const [selectedProdi, setSelectedProdi] = useState('Semua Prodi');
  const [loading, setLoading] = useState(true);

  // State Data dari Database
  const [statsData, setStatsData] = useState({
    total: 0,
    menunggu: 0,
    diproses: 0,
    selesai: 0,
  });
  const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);

  // Fetch data ketika komponen dimuat atau filter prodi berubah
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const res = await getDashboardData(selectedProdi);
      if (res.success && res.stats && res.submissions) {
        setStatsData(res.stats);
        setSubmissions(res.submissions as unknown as SubmissionItem[]);
      }
      setLoading(false);
    }
    loadData();
  }, [selectedProdi]);

  // Konfigurasi Stat Cards dinamis
  const stats = [
    { title: 'Total Pengajuan', value: statsData.total, valueColor: 'text-blue-900' },
    { title: 'Menunggu TTD Dosen', value: statsData.menunggu, valueColor: 'text-amber-600' },
    { title: 'Diproses KPS', value: statsData.diproses, valueColor: 'text-blue-600' },
    { title: 'Selesai', value: statsData.selesai, valueColor: 'text-emerald-600' },
  ];

  // Helper pemetaan status database ke teks & warna badge UI
  const formatStatusInfo = (statusEnum: string) => {
    switch (statusEnum) {
      case 'MENUNGGU_TTD_DOSEN':
        return {
          label: 'Menunggu TTD Dosen',
          badgeStyle: 'bg-amber-100 text-amber-700 border-amber-200',
          dotColor: 'bg-amber-500',
        };
      case 'DIPROSES_KPS':
        return {
          label: 'Diproses KPS',
          badgeStyle: 'bg-blue-100 text-blue-700 border-blue-200',
          dotColor: 'bg-blue-500',
        };
      case 'SELESAI':
        return {
          label: 'Selesai',
          badgeStyle: 'bg-emerald-100 text-emerald-700 border-emerald-200',
          dotColor: 'bg-emerald-500',
        };
      case 'DITOLAK':
        return {
          label: 'Ditolak',
          badgeStyle: 'bg-rose-100 text-rose-700 border-rose-200',
          dotColor: 'bg-rose-500',
        };
      default:
        return {
          label: statusEnum,
          badgeStyle: 'bg-slate-100 text-slate-700 border-slate-200',
          dotColor: 'bg-slate-500',
        };
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1 font-normal">
          Rekap pengajuan kompen Jurusan Teknologi Informasi
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => (
          <div
            key={idx}
            className="p-5 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex flex-col justify-between"
          >
            <span className="text-sm font-medium text-slate-500">{item.title}</span>
            <div className="mt-3">
              <span className={`text-3xl lg:text-4xl font-extrabold ${item.valueColor}`}>
                {loading ? '...' : item.value}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Section Header & Filter Toggle */}
        <div className="p-6 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-800">Pengajuan Terbaru</h2>

          <div className="inline-flex p-1 bg-slate-100 rounded-xl self-start sm:self-auto">
            {['Semua Prodi', 'TI', 'SIB'].map((prodi) => (
              <button
                key={prodi}
                onClick={() => setSelectedProdi(prodi)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  selectedProdi === prodi
                    ? 'bg-[#0F388A] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 font-medium'
                }`}
              >
                {prodi}
              </button>
            ))}
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50/50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-6">Nama Mahasiswa</th>
                <th className="py-3.5 px-6">NIM</th>
                <th className="py-3.5 px-6">Mata Kuliah</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Memuat data dashboard...
                  </td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    Belum ada data pengajuan kompen.
                  </td>
                </tr>
              ) : (
                submissions.map((item) => {
                  const statusInfo = formatStatusInfo(item.status);
                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-800">
                        {item.mahasiswa?.nama || 'Mahasiswa'}
                      </td>
                      <td className="py-4 px-6 text-slate-500 font-medium">
                        {item.mahasiswa?.nim || '-'}
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-normal">
                        {item.matkul?.namaMatkul || '-'}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.badgeStyle}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotColor}`}></span>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <a
                          href="/admin/pengajuan"
                          className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all inline-block"
                        >
                          Periksa
                        </a>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}