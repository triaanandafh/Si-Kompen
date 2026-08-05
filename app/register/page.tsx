'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import CustomSelect from '@/components/CustomSelect';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    nim: '',
    email: '',
    password: '',
    kelas: '',
    prodi: '',
    semester: 'semester-1',
  });

  const [emailError, setEmailError] = useState('');

  // Options Data
  const prodiOptions = [
    { label: 'D-IV Teknik Informatika (TI)', value: 'D-IV Teknik Informatika' },
    { label: 'D-IV Sistem Informasi Bisnis (SIB)', value: 'D-IV Sistem Informasi Bisnis' },
  ];

  const semesterOptions = [
    { label: 'Semester 1', value: '1' },
    { label: 'Semester 2', value: '2' },
    { label: 'Semester 3', value: '3' },
    { label: 'Semester 4', value: '4' },
    { label: 'Semester 5', value: '5' },
    { label: 'Semester 6', value: '6' },
    { label: 'Semester 7', value: '7' },
    { label: 'Semester 8', value: '8' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Realtime Email Domain Validation
    if (name === 'email') {
      if (value && !value.endsWith('@student.polinema.ac.id')) {
        setEmailError('Email harus menggunakan domain @student.polinema.ac.id');
      } else {
        setEmailError('');
      }
    }
  };

  // Validasi Form sebelum register
  const isFormValid =
    formData.name.trim() !== '' &&
    formData.nim.trim() !== '' &&
    formData.email.endsWith('@student.polinema.ac.id') &&
    formData.password.trim().length >= 6 &&
    formData.kelas.trim() !== '' &&
    formData.prodi !== '' &&
    formData.semester !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    // Simpan data pendaftaran ke LocalStorage untuk simulasi
    const newUser = {
      name: formData.name,
      nim: formData.nim,
      email: formData.email,
      kelas: formData.kelas,
      prodi: formData.prodi,
      semester: formData.semester,
      jurusan: 'Teknologi Informasi',
      role: 'Mahasiswa',
    };

    localStorage.setItem('user', JSON.stringify(newUser));
    alert('Registrasi berhasil! Silakan login.');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 font-sans">
      {/* Container Box */}
      <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-100 shadow-sm p-8 my-8">
        {/* Brand & Title Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-[#0F388A] rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-sm">
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4l7 3.82 7-3.82v-4L12 17l-7-3.82z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Buat Akun Si-Kompen</h1>
          <p className="text-sm text-slate-500 mt-1">
            Daftarkan diri Anda untuk mengakses layanan kompensasi
          </p>
        </div>

        {/* Form Register */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nama Lengkap */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0F388A]/20 focus:border-[#0F388A] transition-all"
            />
          </div>

          {/* NIM & Kelas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* NIM */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                NIM
              </label>
              <input
                type="text"
                name="nim"
                value={formData.nim}
                onChange={handleChange}
                placeholder="Contoh: 2141720000"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0F388A]/20 focus:border-[#0F388A] transition-all"
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
                placeholder="Contoh: SIB-2E"
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0F388A]/20 focus:border-[#0F388A] transition-all"
              />
            </div>
          </div>

          {/* Program Studi */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Program Studi
            </label>
            <CustomSelect
              options={prodiOptions}
              placeholder="Pilih program studi"
              value={formData.prodi}
              onChange={(val) => setFormData((prev) => ({ ...prev, prodi: val }))}
            />
          </div>

          {/* Semester */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Semester
            </label>
            <CustomSelect
              options={semesterOptions}
              placeholder="Pilih semester saat ini"
              value={formData.semester}
              onChange={(val) => setFormData((prev) => ({ ...prev, semester: val }))}
            />
          </div>

          {/* Email Polinema */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email Institusi
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="nim@student.polinema.ac.id"
              className={`w-full px-4 py-3 bg-white border rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 transition-all ${
                emailError
                  ? 'border-red-400 focus:ring-red-400/20 focus:border-red-500'
                  : 'border-slate-200 focus:ring-[#0F388A]/20 focus:border-[#0F388A]'
              }`}
            />
            {emailError && (
              <p className="text-xs text-red-500 mt-1.5 font-medium">{emailError}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Kata Sandi
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Minimal 6 karakter"
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0F388A]/20 focus:border-[#0F388A] transition-all"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-sm mt-2 ${
              isFormValid
                ? 'bg-[#0F388A] hover:bg-blue-900 text-white cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            Daftar Sekarang
          </button>
        </form>

        {/* Footer Navigation */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Sudah punya akun?{' '}
          <Link
            href="/"
            className="text-[#0F388A] font-bold hover:underline transition-all"
          >
            Masuk di sini
          </Link>
        </p>
      </div>
    </div>
  );
}