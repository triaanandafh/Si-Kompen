import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import TombolCetak from './TombolCetak';
import Image from 'next/image';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CetakKompenPage({ params }: PageProps) {
  const { id } = await params;

  const data = await prisma.pengajuanKompen.findUnique({
    where: { id },
    include: {
      mahasiswa: {
        include: {
          user: true,
        },
      },
      matkul: true,
      dosen: true,
    },
  });

  if (!data) notFound();

  // Helper konversi semester angka ke Romawi
  const romawiList = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8 print:p-0 print:bg-white text-black font-serif">
      {/* Tombol Navigasi & Print (Hanya tampil di layar) */}
      <div className="max-w-3xl mx-auto mb-6 flex justify-between items-center print:hidden font-sans">
        <a
          href="/dashboard/riwayat"
          className="text-sm text-slate-600 hover:text-slate-900 font-semibold"
        >
          ← Kembali ke Riwayat
        </a>
        <TombolCetak />
      </div>

      {/* Lembar A4 Berita Acara */}
      <div className="max-w-3xl mx-auto bg-white p-10 md:p-14 rounded-xl shadow-md print:shadow-none print:p-0 border border-slate-200 print:border-none">
        
        {/* 1. KOP SURAT POLINEMA */}
        <div className="flex items-center gap-4 pb-3 border-b-4 border-double border-black">
          <div className="w-24 h-24 relative flex-shrink-0">
            {/* Pastikan gambar ditaruh di public/Logo Polinema.png */}
            <img
              src="/Logo Polinema.png"
              alt="Logo Polinema"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-center flex-1 leading-tight">
            <h2 className="text-sm font-semibold tracking-wide uppercase">
              Kementerian Pendidikan, Sains, dan Teknologi
            </h2>
            <h1 className="text-lg font-bold uppercase">
              Politeknik Negeri Malang
            </h1>
            <h2 className="text-sm font-bold uppercase">
              Jurusan Teknologi Informasi
            </h2>
            <h3 className="text-xs font-bold uppercase tracking-wide">
              Program Studi {data.matkul?.prodi || 'D-IV Sistem Informasi Bisnis'}
            </h3>
            <p className="text-[11px] mt-1">
              Jalan Soekarno Hatta Nomor 9 Jatimulyo, Lowokwaru, Malang 65141
            </p>
            <p className="text-[10px]">
              Telepon (0341) 404424, 404425, Faksimile (0341) 404420
            </p>
            <p className="text-[10px] text-blue-700 underline">
              Laman www.polinema.ac.id
            </p>
          </div>
        </div>

        {/* 2. JUDUL BERITA ACARA */}
        <div className="text-center my-6">
          <h2 className="text-base md:text-lg font-bold uppercase tracking-wider underline">
            BERITA ACARA KOMPENSASI PRESENSI
          </h2>
        </div>

        {/* 3. IDENTITAS PENGAJAR */}
        <div className="space-y-1.5 text-sm mb-4">
          <div className="grid grid-cols-12">
            <span className="col-span-3 font-semibold">Nama Pengajar</span>
            <span className="col-span-9 border-b border-dotted border-black pb-0.5">
              : {data.dosen?.nama || '......................................................................'}
            </span>
          </div>
          <div className="grid grid-cols-12">
            <span className="col-span-3 font-semibold">NIP</span>
            <span className="col-span-9 border-b border-dotted border-black pb-0.5">
              : {data.dosen?.nip || '......................................................................'}
            </span>
          </div>
        </div>

        {/* 4. IDENTITAS MAHASISWA & KOMPENSASI */}
        <p className="text-sm font-semibold mb-3">
          Memberikan rekomendasi kompensasi kepada :
        </p>

        <div className="space-y-2 text-sm pl-2 mb-8">
          <div className="grid grid-cols-12">
            <span className="col-span-3">Nama Mahasiswa</span>
            <span className="col-span-9 font-semibold border-b border-dotted border-black pb-0.5">
              : {data.mahasiswa?.user?.nama || (data.mahasiswa as any)?.nama || '-'}
            </span>
          </div>

          <div className="grid grid-cols-12">
            <span className="col-span-3">NIM</span>
            <span className="col-span-9 font-mono border-b border-dotted border-black pb-0.5">
              : {data.mahasiswa?.nim || '-'}
            </span>
          </div>

          <div className="grid grid-cols-12">
            <span className="col-span-3">Kelas</span>
            <span className="col-span-9 border-b border-dotted border-black pb-0.5">
              : {data.kelas}
            </span>
          </div>

          {/* Opsi Semester Romawi (Dicoret / Dilingkari Sesuai Semester) */}
          <div className="grid grid-cols-12">
            <span className="col-span-3">Semester</span>
            <div className="col-span-9 flex items-center gap-2 border-b border-dotted border-black pb-0.5">
              <span>: (</span>
              {romawiList.map((sem, idx) => {
                const isSelected = data.semester === idx + 1;
                return (
                  <span key={sem} className="flex items-center">
                    <span
                      className={`px-1.5 py-0.2 rounded-full ${
                        isSelected
                          ? 'border border-black font-bold ring-1 ring-black'
                          : 'text-black'
                      }`}
                    >
                      {sem}
                    </span>
                    {idx < romawiList.length - 1 && <span className="mx-1">/</span>}
                  </span>
                );
              })}
              <span>)</span>
            </div>
          </div>

          <div className="grid grid-cols-12">
            <span className="col-span-3">Pekerjaan</span>
            <span className="col-span-9 border-b border-dotted border-black pb-0.5">
              : {data.pekerjaan}
            </span>
          </div>

          <div className="grid grid-cols-12">
            <span className="col-span-3">Jumlah Jam</span>
            <span className="col-span-9 font-semibold border-b border-dotted border-black pb-0.5">
              : {data.jumlahJam} Jam
            </span>
          </div>
        </div>

        {/* 5. TANDA TANGAN KPS & DOSEN */}
        <div className="grid grid-cols-2 text-sm mt-10 gap-8">
          {/* Kolom Kiri: Ka. Prodi */}
          <div>
            <p>Mengetahui</p>
            <p className="font-bold">Ka. Program Studi</p>
            
            {/* Tempat TTD / Stempel */}
            <div className="h-24 flex items-center">
              <span className="text-[11px] text-slate-400 italic print:hidden">
                [Tanda Tangan Ka. Prodi]
              </span>
            </div>

            <p className="font-bold underline">( Hendra Pradibta, S.E., M.Sc. )</p>
            <p className="text-xs">NIP. 198305212006041003</p>
          </div>

          {/* Kolom Kanan: Dosen Pengajar Rekomendasi */}
          <div className="text-left pl-8">
            <p>Malang, .............................. 20...</p>
            <p className="font-bold">Yang memberikan rekomendasi,</p>
            
            {/* Tempat TTD Pengajar */}
            <div className="h-24 flex items-center">
              <span className="text-[11px] text-slate-400 italic print:hidden">
                [Tanda Tangan Pengajar]
              </span>
            </div>

            <p className="font-bold">( ............................................ )</p>
            <p className="text-xs">NIP. ........................................</p>
          </div>
        </div>

        {/* 6. FOOTER FORMULIR */}
        <div className="mt-12 pt-4 border-t border-slate-300 text-xs text-black">
          <p className="font-bold font-mono">FRM.RTI.02.01.01</p>
          <p className="font-semibold italic">
            NB: Form ini wajib disimpan untuk keperluan bebas tanggungan
          </p>
        </div>

      </div>
    </div>
  );
}