'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function loginUser(identifier: string, passwordPlain: string) {
  try {
    // 1. Cari user di Supabase berdasarkan Email atau NIM (lewat relasi mahasiswa)
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { mahasiswa: { nim: identifier } },
        ],
      },
      include: {
        mahasiswa: true,
      },
    });

    if (!user) {
      return { success: false, message: 'Akun tidak ditemukan di database!' };
    }

    // 2. Cek kesesuaian kata sandi hash bcrypt
    const isPasswordMatch = await bcrypt.compare(passwordPlain, user.password);
    if (!isPasswordMatch) {
      return { success: false, message: 'Kata sandi salah!' };
    }

    // 3. Kembalikan data profil akun yang berhasil login
    return {
      success: true,
      user: {
        id: user.id,
        name: user.nama,
        email: user.email,
        role: user.role,
        nim: user.mahasiswa?.nim || '',
        kelas: user.mahasiswa?.kelas || '',
        prodi: user.mahasiswa?.prodi || '',
      },
    };
  } catch (error) {
    console.error('Error saat login:', error);
    return { success: false, message: 'Terjadi kesalahan pada koneksi server.' };
  }
}