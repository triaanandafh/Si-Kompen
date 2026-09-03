import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import TombolCetak from './TombolCetak';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CetakKompenPage({ params }: PageProps) {
  const { id } = await params;

  // 1. Ambil data lengkap pengajuan, mahasiswa, dan matkul
  const data = await prisma.pengajuanKompen.findUnique({
    where: { id },
    include: {
      mahasiswa: {
        include: {
          user: true,
        },
      },
      matkul: true,
    },
  });

  if (!data) notFound();

  const tanggalPengajuan = new Date(data.createdAt).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 print:p-0 print:bg-white text-slate-900 font-sans">
      {/* Tombol Cetak / Kembali (disembunyikan saat dicetak) */}
      <div className="max-w-3xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <a
          href="/dashboard/riwayat"
          className="text-sm text-slate-600 hover:text-slate-900 font-semibold"
        >
          ← Kembali ke Riwayat
        </a>
        <TombolCetak />
      </div>

      {/* Lembar Dokumen Kompen (Ukuran Standar A4) */}
      <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm print:shadow-none print:p-0 border border-slate-200 print:border-none">
        {/* Kop Surat Sederhana */}
        <div className="text-center pb-4 border-b-2 border-slate-900 mb-6">
          <h2 className="text-lg font-bold uppercase tracking-wide">
            KEMENTERIAN PENDIDIKAN, KEBUDAYAAN, RISET, DAN TEKNOLOGI
          </h2>
          <h3 className="text-base font-bold uppercase">
            JURUSAN TEKNOLOGI INFORMASI
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            FORMULIR BUKTI PENYELESAIAN KOMPENSASI PRESENSI MAHASISWA
          </p>
        </div>

        {/* Nomor Surat / Kode */}
        <div className="text-right text-xs text-slate-500 mb-6 font-mono">
          No: KMP-{data.id.slice(0, 8).toUpperCase()}
        </div>

        {/* Identitas Mahasiswa */}
        <div className="mb-6 space-y-2 text-sm">
          <p className="font-semibold text-slate-800 border-b pb-1">Identitas Mahasiswa:</p>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-slate-600">Nama</span>
            <span className="col-span-2 font-semibold">
              : {data.mahasiswa?.user?.nama || data.mahasiswa?.id || '-'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-slate-600">NIM</span>
            <span className="col-span-2">: {data.mahasiswa?.nim || '-'}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-slate-600">Kelas / Semester</span>
            <span className="col-span-2">: {data.kelas} / Semester {data.semester}</span>
          </div>
        </div>

        {/* Detail Kompensasi */}
        <div className="mb-8 space-y-2 text-sm">
          <p className="font-semibold text-slate-800 border-b pb-1">Detail Kompensasi:</p>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-slate-600">Mata Kuliah</span>
            <span className="col-span-2 font-medium">: {data.matkul?.namaMatkul || '-'}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-slate-600">Jenis Pekerjaan</span>
            <span className="col-span-2">: {data.pekerjaan}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-slate-600">Jumlah Jam</span>
            <span className="col-span-2 font-semibold">: {data.jumlahJam} Jam</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <span className="text-slate-600">Status Pengajuan</span>
            <span className="col-span-2 font-bold text-emerald-700">: {data.status}</span>
          </div>
        </div>

        {/* Kolom Tanda Tangan */}
        <div className="mt-14 grid grid-cols-2 text-center text-sm gap-8 pt-6">
          <div>
            <p className="text-slate-500">Mengetahui,</p>
            <p className="font-semibold text-slate-800">Dosen Pengampu / Pembimbing</p>
            <div className="h-20 flex items-center justify-center">
              <span className="text-xs text-slate-300 italic">[Tanda Tangan & Cap]</span>
            </div>
            <p className="font-medium text-slate-800">( _________________________ )</p>
            <p className="text-xs text-slate-500">NIP.</p>
          </div>
          <div>
            <p className="text-slate-500">Malang, {tanggalPengajuan}</p>
            <p className="font-semibold text-slate-800">Ketua Program Studi</p>
            <div className="h-20 flex items-center justify-center">
              <span className="text-xs text-slate-300 italic">[Verifikasi Digital / Cap]</span>
            </div>
            <p className="font-medium text-slate-800">( _________________________ )</p>
            <p className="text-xs text-slate-500">NIP.</p>
          </div>
        </div>
      </div>
    </div>
  );
}