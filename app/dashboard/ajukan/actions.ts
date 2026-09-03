'use server';

import { prisma } from '@/lib/prisma';

interface AjukanInput {
  userId: string;
  mataKuliah: string;
  semester: string;
  kelas: string;
  pekerjaan: string;
  jumlahJam: number;
  keterangan?: string;
}

export async function buatPengajuanKompen(input: AjukanInput) {
  try {
    // 1. Dapatkan data mahasiswa terkait userId
    const mhs = await prisma.mahasiswa.findFirst({
      where: {
        OR: [{ id: input.userId }, { userId: input.userId }],
      },
    });

    if (!mhs) {
      return { success: false, message: 'Data mahasiswa tidak ditemukan.' };
    }

    // Parsing semester agar menjadi Int murni (misal: "semester-6" -> 6)
    const semesterNumber =
      typeof input.semester === 'number'
        ? input.semester
        : parseInt(input.semester.replace(/\D/g, ''), 10) || 1;

    // 2. Simpan record baru ke tabel pengajuan_kompen
    const res = await prisma.pengajuanKompen.create({
      data: {
        mahasiswaId: mhs.id,
        matkulId: input.mataKuliah,               // Wajib ada
        semester: semesterNumber,               // Wajib Int
        kelas: input.kelas,                     // Wajib String
        pekerjaan: input.pekerjaan,             // Wajib String
        // Jika matkul memiliki tabel relasi tersendiri:
        // matkulId: input.mataKuliah,
        jumlahJam: Number(input.jumlahJam),
        status: 'MENUNGGU_TTD_DOSEN',
        // Tambahkan kolom lain sesuai skema schema.prisma kamu
      },
    });

    return { success: true, data: res };
  } catch (err) {
    console.error('Gagal simpan pengajuan:', err);
    return { success: false, message: 'Gagal menyimpan ke database Supabase.' };
  }
}