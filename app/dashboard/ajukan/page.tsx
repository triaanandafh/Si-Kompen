'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import CustomSelect from '@/components/CustomSelect';
import Modal from '@/components/Modal'; 

export default function AjukanKompenPage() {
  const [user, setUser] = useState<{ name: string; role: string }>({
    name: '',
    role: '',
  });

  //State untuk kontrol Modal Notifikasi
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    mataKuliah: '',
    semester: 'semester-6',
    kelas: 'TI-3B',
    jenisPekerjaan: '',
    jumlahJam: '4',
    pekerjaanLain: '',
    keterangan: '',
  });

  // Options Data
  const matkulOptions = [
    { label: 'Pemrograman Web Lanjut', value: 'pemrograman-web-lanjut' },
    { label: 'Basis Data Terdistribusi', value: 'basis-data-terdistribusi' },
    { label: 'Jaringan Komputer', value: 'jaringan-komputer' },
    { label: 'Analisis Proses Bisnis', value: 'analisis-proses-bisnis' },
    { label: 'Manajemen Proyek TI', value: 'manajemen-proyek-ti' },
  ];

  const semesterOptions = [
    { label: 'Semester 1', value: 'semester-1' },
    { label: 'Semester 2', value: 'semester-2' },
    { label: 'Semester 3', value: 'semester-3' },
    { label: 'Semester 4', value: 'semester-4' },
    { label: 'Semester 5', value: 'semester-5' },
    { label: 'Semester 6', value: 'semester-6' },
  ];

  const jenisPekerjaanOptions = [
    { label: 'Pembersihan Lab', value: 'pembersihan-lab' },
    { label: 'Update Dokumentasi Aplikasi', value: 'update-dokumentasi' },
    { label: 'Bantuan Administrasi Prodi', value: 'bantuan-admin' },
    { label: 'Lain-lain', value: 'lain-lain' },
  ];

  const isFormValid =
  formData.mataKuliah.trim() !== '' &&
  formData.semester.trim() !== '' &&
  formData.kelas.trim() !== '' &&
  formData.jenisPekerjaan.trim() !== '' &&
  formData.jumlahJam.trim() !== '' &&
  Number(formData.jumlahJam) > 0;

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      setUser({
        name: 'Tria Ananda',
        role: 'Mahasiswa',
      });
    }
  }, []);

  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalPekerjaan =
    formData.jenisPekerjaan === 'lain-lain'
    ? formData.pekerjaanLain
    : formData.jenisPekerjaan;

    const payload = {
    ...formData,
    jenisPekerjaan: finalPekerjaan, 
  };

    console.log('Data Pengajuan:', formData);
    // Di sini nantinya tinggal dipanggil API Prisma / Supabase
    setShowModal(true);
    setFormData({
      mataKuliah: '',
      semester: 'semester-6',
      kelas: 'TI-3B',
      jenisPekerjaan: '',
      jumlahJam: '4',
      pekerjaanLain: '',
      keterangan: '',
    });
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
            <h1 className="text-2xl font-bold text-slate-800">Ajukan Kompen</h1>
            <p className="text-sm text-slate-500">
              Lengkapi formulir pengajuan kompensasi presensi
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

        {/* Form Container */}
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mata Kuliah */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Mata Kuliah
              </label>
              <CustomSelect
                options={matkulOptions}
                placeholder="Pilih mata kuliah"
                value={formData.mataKuliah}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, mataKuliah: val }))
                }
              />
            </div>

            {/* Semester & Kelas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Semester */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Semester
                </label>
                <CustomSelect
                  options={semesterOptions}
                  placeholder="Pilih semester"
                  value={formData.semester}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, semester: val }))
                  }
                />
              </div>

              {/* Kelas */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Kelas
                </label>
                <input
                  type="text"
                  name="kelas"
                  value={formData.kelas}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0F388A]/20 focus:border-[#0F388A] transition-all"
                  placeholder="TI-3B"
                />
              </div>
            </div>

            {/* Jenis Pekerjaan */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Jenis Pekerjaan
              </label>
              <CustomSelect
                options={jenisPekerjaanOptions}
                placeholder="Pilih jenis pekerjaan kompensasi"
                value={formData.jenisPekerjaan}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, jenisPekerjaan: val }))
                }
              />
            </div>

            {/* Input Manual untuk Opsi Lain-lain */}
              {formData.jenisPekerjaan === 'Lain-lain' && (
                <div className="mt-3">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Detail Kegiatan Kompensasi (Input Manual)
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan detail kegiatan kompensasi..."
                    value={formData.pekerjaanLain || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, pekerjaanLain: e.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-[#0F388A]/20 transition-all"
                    required
                  />
                </div>
              )}

            {/* Jumlah Jam */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Jumlah Jam
              </label>
              <input
                type="number"
                name="jumlahJam"
                value={formData.jumlahJam}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0F388A]/20 focus:border-[#0F388A] transition-all"
                placeholder="4"
              />
            </div>

            {/* Keterangan (opsional) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Keterangan (opsional)
              </label>
              <textarea
                name="keterangan"
                rows={4}
                value={formData.keterangan}
                onChange={handleChange}
                placeholder="Alasan ketidakhadiran atau catatan tambahan"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0F388A]/20 focus:border-[#0F388A] transition-all resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
  disabled={!isFormValid}
  className={`w-full font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-sm ${
    isFormValid
      ? 'bg-[#0F388A] hover:bg-blue-900 text-white cursor-pointer'
      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
  }`}>
              Kirim Pengajuan
            </button>
          </form>
        </div>
      </main>

      {/* 4. Render Komponen Modal Custom */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Pengajuan Berhasil!"
        message="Formulir pengajuan kompensasi presensi Anda telah berhasil dikirim."
        type="success"
      />
    </div>
  );
}