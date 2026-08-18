'use client';

import React, { useState, useEffect } from 'react';
import { getDosenData, createDosen, updateDosen, deleteDosen } from './actions';

interface DosenWithCount {
  id: string;
  nip: string;
  nama: string;
  _count?: {
    matkul: number;
  };
}

export default function DataDosenPage() {
  const [dosenList, setDosenList] = useState<DosenWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    nip: '',
    nama: '',
  });

  const loadData = async () => {
    setLoading(true);
    const res = await getDosenData();
    if (res.success && res.data) {
      setDosenList(res.data as unknown as DosenWithCount[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Modal Handlers
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({ nip: '', nama: '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: DosenWithCount) => {
    setEditingId(item.id);
    setFormData({ nip: item.nip, nama: item.nama });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nip || !formData.nama) {
      alert('NIP dan Nama Dosen wajib diisi!');
      return;
    }

    setSubmitting(true);
    if (editingId) {
      const res = await updateDosen(editingId, formData);
      if (res.success) {
        setIsModalOpen(false);
        loadData();
      } else {
        alert(res.error);
      }
    } else {
      const res = await createDosen(formData);
      if (res.success) {
        setIsModalOpen(false);
        loadData();
      } else {
        alert(res.error);
      }
    }
    setSubmitting(false);
  };

  const handleDelete = async (id: string, nama: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus dosen "${nama}"?`)) {
      const res = await deleteDosen(id);
      if (res.success) {
        loadData();
      } else {
        alert(res.error);
      }
    }
  };

  return (
    <div className="space-y-6 font-sans relative">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Data Dosen</h1>
        <p className="text-sm text-slate-500 mt-1 font-normal">
          Daftar dosen pengampu mata kuliah
        </p>
      </div>

      {/* Main Card Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Action Top */}
        <div className="p-6 pb-4 flex items-center justify-between">
          <div></div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0F388A] hover:bg-[#0c2d6e] text-white font-bold text-sm rounded-xl transition-all shadow-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Tambah Dosen
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50/50 text-slate-400 text-xs font-semibold">
                <th className="py-4 px-6 font-semibold">NIP</th>
                <th className="py-4 px-6 font-semibold">Nama Dosen</th>
                <th className="py-4 px-6 font-semibold">Jumlah Mata Kuliah</th>
                <th className="py-4 px-6 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 text-sm">
                    Memuat data dosen dari database...
                  </td>
                </tr>
              ) : dosenList.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400 text-sm">
                    Belum ada data dosen.
                  </td>
                </tr>
              ) : (
                dosenList.map((item) => {
                  const totalMatkul = item._count?.matkul || 0;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 text-slate-500 font-normal">{item.nip}</td>
                      <td className="py-4 px-6 font-semibold text-slate-800">{item.nama}</td>
                      <td className="py-4 px-6 text-slate-600 font-normal">
                        {totalMatkul} mata kuliah
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
                          >
                            <svg
                              className="w-3.5 h-3.5 text-slate-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                              />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.nama)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-all"
                          >
                            <svg
                              className="w-3.5 h-3.5 text-rose-600"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah / Edit Dosen */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-[#F8FAFC] w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-100 relative">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-slate-800">
                {editingId ? 'Edit Dosen' : 'Tambah Dosen'}
              </h3>
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

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  NIP
                </label>
                <input
                  type="text"
                  placeholder="Masukkan NIP Dosen"
                  value={formData.nip}
                  onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F388A]/20 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Nama Dosen
                </label>
                <input
                  type="text"
                  placeholder="Nama lengkap beserta gelar"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F388A]/20 transition-all"
                  required
                />
              </div>

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
                  {submitting ? 'Memproses...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}