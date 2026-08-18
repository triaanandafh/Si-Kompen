'use server';

import { prisma } from '@/lib/prisma';

export async function getUserProfile(studentId: string) {
  try {
    const data = await prisma.mahasiswa.findUnique({
      where: { id: studentId },
    });

    if (!data) {
      return { success: false, error: 'Data mahasiswa tidak ditemukan' };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { success: false, error: 'Gagal mengambil data profil' };
  }
}