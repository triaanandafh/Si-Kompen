'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';

interface UserProfile {
  name: string;
  nim: string;
  kelas: string;
  semester: string | number;
  prodi: string;
  jurusan: string;
  email: string;
  role: string;
}

export default function ProfilPage() {
  const [user, setUser] = useState<UserProfile>({
    name: 'Aurora Rahmadani',
    nim: '2141720123',
    kelas: 'TI-3B',
    semester: 6,
    prodi: 'D-IV Teknik Informatika',
    jurusan: 'Teknologi Informasi',
    email: 'aurora@student.polinema.ac.id',
    role: 'Mahasiswa',
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser((prev) => ({
        ...prev,
        ...parsed,
      }));
    }
  }, []);

  // Helper untuk inisial nama
  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const headerInitial = user.name ? user.name.charAt(0).toUpperCase() : 'A';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Top Header */}
        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Profil</h1>
            <p className="text-sm text-slate-500">
              Data diri dan informasi akademik
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-400">{user.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 text-[#0F388A] font-semibold flex items-center justify-center text-sm">
              {headerInitial}
            </div>
          </div>
        </header>

        {/* Content Container */}
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Card 1: Avatar & Quick Info Header */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#D8E8F8] text-[#0F388A] font-bold text-2xl flex items-center justify-center shrink-0">
              {getInitials(user.name)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">{user.name}</h2>
              <p className="text-sm text-slate-400 mt-0.5">
                {user.nim} &middot; {user.kelas}
              </p>
            </div>
          </div>

          {/* Card 2: Informasi Akademik Detail */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-6">
              Informasi Akademik
            </h3>

            <div className="divide-y divide-slate-100 text-sm">
              <div className="py-4 flex justify-between items-center">
                <span className="text-slate-400">Nama Lengkap</span>
                <span className="font-semibold text-slate-800">{user.name}</span>
              </div>

              <div className="py-4 flex justify-between items-center">
                <span className="text-slate-400">NIM</span>
                <span className="font-semibold text-slate-800">{user.nim}</span>
              </div>

              <div className="py-4 flex justify-between items-center">
                <span className="text-slate-400">Kelas</span>
                <span className="font-semibold text-slate-800">{user.kelas}</span>
              </div>

              <div className="py-4 flex justify-between items-center">
                <span className="text-slate-400">Semester</span>
                <span className="font-semibold text-slate-800">
                  {user.semester}
                </span>
              </div>

              <div className="py-4 flex justify-between items-center">
                <span className="text-slate-400">Program Studi</span>
                <span className="font-semibold text-slate-800">{user.prodi}</span>
              </div>

              <div className="py-4 flex justify-between items-center">
                <span className="text-slate-400">Jurusan</span>
                <span className="font-semibold text-slate-800">
                  {user.jurusan}
                </span>
              </div>

              <div className="py-4 flex justify-between items-center">
                <span className="text-slate-400">Email</span>
                <span className="font-semibold text-slate-800">
                  {user.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}