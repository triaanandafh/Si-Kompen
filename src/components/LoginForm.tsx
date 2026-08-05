'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push('/dashboard');
    setLoading(true);
    
    // TODO: Panggil API login di sini
    console.log({ identifier, password });
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
        
        {/* Logo & Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-900 rounded-xl flex items-center justify-center text-white shadow-md">
              {/* Toga Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zM5 13.18v4l7 3.82 7-3.82v-4L12 17l-7-3.82z"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-blue-900 tracking-tight">Si-Kompen</span>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 mb-2">Masuk ke akun Anda</h1>
          <p className="text-sm text-slate-500 text-center">
            Gunakan NIM (mahasiswa) atau email institusi (admin/KPS).
          </p>
        </div>

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input Email / NIM */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Email / NIM
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="2141720123 atau nama@polinema.ac.id"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all placeholder:text-slate-400 text-slate-700 text-sm"
            />
          </div>

          {/* Input Password */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Kata Sandi
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent transition-all placeholder:text-slate-400 text-slate-700 text-sm"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-blue-900 hover:bg-blue-950 text-white font-medium rounded-xl transition-colors duration-200 shadow-sm text-sm disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>

          {/* Navigasi ke Halaman Register */}
          <p className="text-center text-sm text-slate-500 mt-6">
            Belum punya akun?{' '}
            <Link
              href="/register"
              className="text-[#0F388A] font-bold hover:underline transition-all"
            >
              Daftar di sini
            </Link>
          </p>
        </form>

        {/* Footer Info */}
        <p className="mt-8 text-xs text-center text-slate-400">
          Peran akun terdeteksi otomatis saat masuk.
        </p>

      </div>
    </div>
  );
}