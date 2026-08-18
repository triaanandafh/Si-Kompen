'use client';

import React, { useState, useEffect } from 'react';
import {
  getMatkulData,
  getDosenOptions,
  createMatkul,
  updateMatkul,
  deleteMatkul,
} from './actions';

interface DosenOption {
  id: string;
  nama: string;
}

interface MatkulWithDosen {
  id: string;
  namaMatkul: string;
  prodi: string;
  dosen_id: string;
  dosen?: {
    nama: string;
  } | null;
}

export default function DataMatkulPage() {
  const [matkulList, setMatkulList] = useState<MatkulWithDosen[]>([]);
  const [dosenList, setDosenList] = useState<DosenOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // State Form
  const [formData, setFormData] = useState({
    namaMatkul: '',
    prodi: 'TI',
    dosen_id: '',
  });

  // Load Data
  const loadData = async () => {
    setLoading(true);
    const resMatkul = await getMatkulData();
    if (resMatkul.success && resMatkul.data) {
      setMatkulList(resMatkul.data as unknown as MatkulWithDosen[]);
    }

    const resDosen = await getDosenOptions();
    if (resDosen.success && resDosen.data) {
      setDosenList(resDosen.data as unknown as DosenOption[]);
      if (resDosen.data.length > 0 && !formData.dosen_id) {
        setFormData((prev) => ({ ...prev, dosen_id: resDosen.data[0].id }));
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Buka Modal Tambah
  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      namaMatkul: '',
      prodi: 'TI',
      dosen_id: dosenList[0]?.id || '',
    });
    setIsModalOpen(true);
  };

  // Buka Modal Edit
  const handleOpenEdit = (item: MatkulWithDosen) => {
    setEditingId(item.id);
    setFormData({
      namaMatkul: item.namaMatkul,
      prodi: item.prodi,
      dosen_id: item.dosen_id,
    });
    setIsModalOpen(true);
  };

  // Handle Form Submit (Tambah / Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.namaMatkul || !formData.dosen_id) {
      alert('Harap isi semua bidang form!');
      return;
    }

    setSubmitting(true);
    if (editingId) {
      // Update
      const res = await updateMatkul(editingId, formData);
      if (res.success) {
        setIsModalOpen(false);
        loadData();
      } else {
        alert(res.error);
      }
    } else {
      // Create
      const res = await createMatkul(formData);
      if (res.success) {
        setIsModalOpen(false);
        loadData();
      } else {
        alert(res.error);
      }
    }
    setSubmitting(false);
  };

  // Handle Delete
  const handleDelete = async (id: string, nama: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus mata kuliah "${nama}"?`)) {
      const res = await deleteMatkul(id);
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
        <h1 className="text-2xl font-bold text-slate-800">Data Mata Kuliah</h1>
        <p className="text-sm text-slate-500 mt-1 font-normal">
          Mata kuliah dan dosen pengampu
        </p>
      </div>

      {/* Main Card Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Top Bar / Action */}
        <div className="p-6 pb-4 flex items-center justify-between">
          <div></div>

          {/* Button Tambah Mata Kuliah */}
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
            Tambah Mata Kuliah
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50/50 text-slate-400 text-xs font-semibold">
                <th className="py-4 px-6 font-semibold">Kode / ID</th>
                <th className="py-4 px-6 font-semibold">Mata Kuliah</th>
                <th className="py-4 px-6 font-semibold">Dosen Pengampu</th>
                <th className="py-4 px-6 font-semibold">Program Studi</th>
                <th className="py-4 px-6 font-semibold text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-sm">
                    Memuat data mata kuliah dari database...
                  </td>
                </tr>
              ) : matkulList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400 text-sm">
                    Belum ada data mata kuliah.
                  </td>
                </tr>
              ) : (
                matkulList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 text-slate-400 font-mono text-xs">
                      {item.id.substring(0, 8)}...
                    </td>

                    <td className="py-4 px-6 font-semibold text-slate-800">
                      {item.namaMatkul}
                    </td>

                    <td className="py-4 px-6 text-slate-600 font-normal">
                      {item.dosen?.nama || 'Belum diatur'}
                    </td>

                    <td className="py-4 px-6 text-slate-600 font-normal">
                      {item.prodi}
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2">
                        {/* Edit Button */}
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

                        {/* Hapus Button */}
                        <button
                          onClick={() => handleDelete(item.id, item.namaMatkul)}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL FORM MATAKULIAH ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-[#F8FAFC] w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-slate-100 relative">
            {/* Header Modal */}
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-bold text-slate-800">
                {editingId ? 'Edit Mata Kuliah' : 'Tambah Mata Kuliah'}
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

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nama Mata Kuliah Input */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Nama Mata Kuliah
                </label>
                <input
                  type="text"
                  placeholder="Misal: Pemrograman Web Lanjut"
                  value={formData.namaMatkul}
                  onChange={(e) => setFormData({ ...formData, namaMatkul: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F388A]/20 transition-all"
                  required
                />
              </div>

              {/* Dosen Pengampu Select */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Dosen Pengampu
                </label>
                <select
                  value={formData.dosen_id}
                  onChange={(e) => setFormData({ ...formData, dosen_id: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F388A]/20 transition-all"
                  required
                >
                  <option value="" disabled>
                    Select Dosen
                  </option>
                  {dosenList.map((dosen) => (
                    <option key={dosen.id} value={dosen.id}>
                      {dosen.nama}
                    </option>
                  ))}
                </select>
              </div>

              {/* Program Studi Select */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Program Studi
                </label>
                <select
                  value={formData.prodi}
                  onChange={(e) => setFormData({ ...formData, prodi: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F388A]/20 transition-all"
                >
                  <option value="TI">TI</option>
                  <option value="SIB">SIB</option>
                </select>
              </div>

              {/* Modal Actions */}
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