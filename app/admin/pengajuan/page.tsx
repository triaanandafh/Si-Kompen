'use client';

import React, { useState, useEffect } from 'react';
import { getPengajuanData, updateStatusPengajuan } from './actions';

interface PengajuanItem {
  id: string;
  kode?: string;
  status: string;
  mahasiswa?: {
    nama: string;
    nim: string;
  } | null;
  matkul?: {
    namaMatkul: string;
  } | null;
  // Fallback field jika tersimpan langsung
  namaMahasiswa?: string;
  nimMahasiswa?: string;
  namaMatkul?: string;
}

export default function PengajuanMasukPage() {
  const [submissions, setSubmissions] = useState<PengajuanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PengajuanItem | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const statusOptions = [
    { label: 'Menunggu TTD Dosen', value: 'MENUNGGU_TTD_DOSEN' },
    { label: 'Verifikasi KPS', value: 'VERIFIKASI_KPS' },
    { label: 'Disetujui', value: 'DISETUJUI' },
    { label: 'Ditolak', value: 'DITOLAK' },
  ];

  const loadData = async () => {
    setLoading(true);
    const res = await getPengajuanData();
    if (res.success && res.data) {
      setSubmissions(res.data as unknown as PengajuanItem[]);
    } else {
      // Mock data awal jika DB masih kosong/testing
      setSubmissions([
        {
          id: '1',
          kode: 'KMP-0451',
          namaMahasiswa: 'Aurora Rahmadani',
          nimMahasiswa: '2141720123',
          namaMatkul: 'Pemrograman Web Lanjut',
          status: 'Menunggu TTD Dosen',
        },
        {
          id: '2',
          kode: 'KMP-0450',
          namaMahasiswa: 'Bagas Prakoso',
          nimMahasiswa: '2141720098',
          namaMatkul: 'Basis Data Terdistribusi',
          status: 'Diproses KPS',
        },
        {
          id: '3',
          kode: 'KMP-0447',
          namaMahasiswa: 'Dimas Anggara',
          nimMahasiswa: '2141762045',
          namaMatkul: 'Manajemen Proyek TI',
          status: 'Diproses KPS',
        },
      ]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Helper Style Badge
  // Helper Style Badge & Label
  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'MENUNGGU_TTD_DOSEN':
      case 'Menunggu TTD Dosen':
        return {
          label: 'Menunggu TTD Dosen',
          badgeStyle: 'bg-amber-100 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
        };
      case 'VERIFIKASI_KPS':
      case 'Diproses KPS':
        return {
          label: 'Verifikasi KPS',
          badgeStyle: 'bg-sky-100 text-sky-800 border-sky-200',
          dot: 'bg-sky-500',
        };
      case 'DISETUJUI':
      case 'Selesai':
        return {
          label: 'Disetujui',
          badgeStyle: 'bg-emerald-100 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
        };
      case 'DITOLAK':
      case 'Ditolak':
        return {
          label: 'Ditolak',
          badgeStyle: 'bg-rose-100 text-rose-800 border-rose-200',
          dot: 'bg-rose-500',
        };
      default:
        return {
          label: status,
          badgeStyle: 'bg-slate-100 text-slate-800 border-slate-200',
          dot: 'bg-slate-500',
        };
    }
  };

  // Open Modal
  const handleOpenUpdateModal = (item: PengajuanItem) => {
    setSelectedItem(item);
    setSelectedStatus(item.status);
    setIsModalOpen(true);
  };

  // Submit Status Change
  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    setSubmitting(true);
    const res = await updateStatusPengajuan(selectedItem.id, selectedStatus);

    if (res.success) {
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub.id === selectedItem.id ? { ...sub, status: selectedStatus } : sub
        )
      );
      setIsModalOpen(false);
    } else {
      alert((res as any).error || 'Gagal menyimpan perubahan ke database!');
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Pengajuan Masuk</h1>
        <p className="text-sm text-slate-500 mt-1 font-normal">
          Pengajuan yang menunggu tindak lanjut
        </p>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-slate-400 text-xs font-semibold">
                <th className="py-4 px-6 font-semibold">Kode</th>
                <th className="py-4 px-6 font-semibold">Nama Mahasiswa</th>
                <th className="py-4 px-6 font-semibold">NIM</th>
                <th className="py-4 px-6 font-semibold">Mata Kuliah</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-sm">
                    Memuat data pengajuan...
                  </td>
                </tr>
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400 text-sm">
                    Tidak ada pengajuan masuk.
                  </td>
                </tr>
              ) : (
                submissions.map((item) => {
                  const style = getBadgeStyle(item.status);
                  const namaMhs = item.mahasiswa?.nama || item.namaMahasiswa || '-';
                  const nimMhs = item.mahasiswa?.nim || item.nimMahasiswa || '-';
                  const matkul = item.matkul?.namaMatkul || item.namaMatkul || '-';
                  const kode = item.kode || `KMP-${item.id.substring(0, 4)}`;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      {/* Kode */}
                      <td className="py-4 px-6 text-slate-400 font-mono text-xs">
                        {kode}
                      </td>

                      {/* Nama Mahasiswa */}
                      <td className="py-4 px-6 font-bold text-slate-800">
                        {namaMhs}
                      </td>

                      {/* NIM */}
                      <td className="py-4 px-6 text-slate-500 font-medium">
                        {nimMhs}
                      </td>

                      {/* Mata Kuliah */}
                      <td className="py-4 px-6 text-slate-600 font-normal">
                        {matkul}
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.badgeStyle}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`}></span>
                          {item.status}
                        </span>
                      </td>

                      {/* Action Button Update Status */}
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleOpenUpdateModal(item)}
                          className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL UPDATE STATUS ================= */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-[#F8FAFC] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-slate-100 relative">
            {/* Header Modal */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-800">Update Status</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content Info */}
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 mb-5 space-y-1 text-sm">
              <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                Mahasiswa
              </p>
              <p className="font-bold text-slate-800">
                {selectedItem.mahasiswa?.nama || selectedItem.namaMahasiswa}
              </p>
              <p className="text-xs text-slate-500">
                {selectedItem.matkul?.namaMatkul || selectedItem.namaMatkul}
              </p>
            </div>

            {/* Form Form Select Status */}
            <form onSubmit={handleSaveStatus} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Pilih Status Baru
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F388A]/20 transition-all font-semibold"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-sm font-bold text-white bg-[#0F388A] hover:bg-[#0c2d6e] rounded-xl transition-all shadow-sm disabled:opacity-50"
                >
                  {submitting ? 'Memproses...' : 'Simpan Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}