'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { getUserProfile } from './actions';

interface UserProfile {
  id?: string;
  nama: string;
  nim: string;
  kelas: string;
  semester: string | number;
  prodi: string;
  jurusan: string;
  email: string;
  role: string;
}

export default function ProfilPage() {
  const [loading, setLoading] = useState(true);
  
  // Default fallback data agar UI tidak kosong melompong saat DB/localStorage belum terisi
  const [user, setUser] = useState<UserProfile>({
  nama: 'Tria Ananda',
  nim: '2141720000',
  kelas: 'SIB-2E',
  semester: 4,
  prodi: 'D-IV Sistem Informasi Bisnis',
  jurusan: 'Teknologi Informasi',
  email: 'tria@student.polinema.ac.id',
  role: 'Mahasiswa',
});

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      const savedUserStr = localStorage.getItem('user');

      if (savedUserStr) {
        try {
          const parsed = JSON.parse(savedUserStr);

          // Jika ada ID di localStorage, fetch data paling update dari Prisma DB
          if (parsed.id) {
            const res = await getUserProfile(parsed.id);
            if (res.success && res.data) {
              const profileData = res.data as Record<string, any>;

              setUser((prev) => ({
                ...prev,
                ...profileData,
                nama: profileData.nama || parsed.nama || parsed.name || prev.nama,
                nim: profileData.nim || parsed.nim || prev.nim,
                kelas: profileData.kelas || parsed.kelas || prev.kelas,
                semester: profileData.semester || parsed.semester || prev.semester,
                prodi: profileData.prodi || parsed.prodi || prev.prodi,
                email: profileData.email || parsed.email || prev.email,
                jurusan: 'Teknologi Informasi',
                role: 'Mahasiswa',
              }));
              setLoading(false);
              return;
            }
          }

          // Fallback ke data localStorage jika query DB tidak mengembalikan data
          setUser((prev) => ({
            ...prev,
            ...parsed,
            nama: parsed.nama || parsed.name || prev.nama,
          }));
        } catch (err) {
          console.error('Error parsing user from localStorage:', err);
        }
      }

      setLoading(false);
    }

    loadProfile();
  }, []);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const headerInitial = user.nama ? user.nama.charAt(0).toUpperCase() : 'M';

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
      <Sidebar />

      <main className="flex-1 p-8 overflow-y-auto">
        {/* Top Header */}
        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Profil</h1>
            <p className="text-sm text-slate-500 mt-1">
              Data diri dan informasi akademik
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-bold text-slate-800">
                {loading ? '...' : user.nama}
              </p>
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
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#D8E8F8] text-[#0F388A] font-bold text-2xl flex items-center justify-center shrink-0">
              {getInitials(user.nama)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {loading ? 'Memuat...' : user.nama}
              </h2>
              <p className="text-sm text-slate-400 mt-0.5 font-medium">
                {user.nim} &middot; {user.kelas}
              </p>
            </div>
          </div>

          {/* Card 2: Informasi Akademik Detail */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 mb-6">
              Informasi Akademik
            </h3>

            {loading ? (
              <p className="text-sm text-slate-400 py-4 text-center">
                Memuat informasi profil dari database...
              </p>
            ) : (
              <div className="divide-y divide-slate-100 text-sm">
                <div className="py-4 flex justify-between items-center">
                  <span className="text-slate-400">Nama Lengkap</span>
                  <span className="font-semibold text-slate-800">{user.nama}</span>
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
                  <span className="font-semibold text-slate-800">{user.semester}</span>
                </div>

                <div className="py-4 flex justify-between items-center">
                  <span className="text-slate-400">Program Studi</span>
                  <span className="font-semibold text-slate-800">{user.prodi}</span>
                </div>

                <div className="py-4 flex justify-between items-center">
                  <span className="text-slate-400">Jurusan</span>
                  <span className="font-semibold text-slate-800">{user.jurusan}</span>
                </div>

                <div className="py-4 flex justify-between items-center">
                  <span className="text-slate-400">Email</span>
                  <span className="font-semibold text-slate-800">{user.email}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}