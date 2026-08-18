'use client';

import React from 'react';

export default function AdminHeader() {
  return (
    <header className="bg-white border-b border-slate-200/80 px-8 py-4 flex items-center justify-between sticky top-0 z-10 font-sans">
      {/* Kiri: Kosong atau judul dinamis jika dibutuhkan */}
      <div></div>

      {/* Kanan: Profile Admin KPS */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-bold text-slate-800 leading-tight">Admin KPS</p>
          <p className="text-xs text-slate-400 font-medium">Administrator</p>
        </div>
        
        {/* Avatar Circle */}
        <div className="w-10 h-10 rounded-full bg-sky-200/70 text-[#0F388A] font-bold text-sm flex items-center justify-center border border-sky-300/50 shadow-sm">
          A
        </div>
      </div>
    </header>
  );
}