'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// 1. GET ALL DOSEN (dengan hitung matkul)
export async function getDosenData() {
  try {
    const data = await prisma.dosen.findMany({
      include: {
        _count: {
          select: { matkul: true }, // Menghitung otomatis berapa matkul yang diampu
        },
      },
      orderBy: {
        nama: 'asc',
      },
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching dosen:', error);
    return { success: false, error: 'Gagal mengambil data dosen' };
  }
}

// 2. CREATE DOSEN
export async function createDosen(formData: { nip: string; nama: string }) {
  try {
    await prisma.dosen.create({
      data: {
        nip: formData.nip,
        nama: formData.nama,
      },
    });
    revalidatePath('/admin/dosen');
    return { success: true, message: 'Dosen berhasil ditambahkan' };
  } catch (error) {
    console.error('Error creating dosen:', error);
    return { success: false, error: 'Gagal menambahkan dosen' };
  }
}

// 3. UPDATE DOSEN
export async function updateDosen(id: string, formData: { nip: string; nama: string }) {
  try {
    await prisma.dosen.update({
      where: { id },
      data: {
        nip: formData.nip,
        nama: formData.nama,
      },
    });
    revalidatePath('/admin/dosen');
    return { success: true, message: 'Data dosen berhasil diperbarui' };
  } catch (error) {
    console.error('Error updating dosen:', error);
    return { success: false, error: 'Gagal memperbarui data dosen' };
  }
}

// 4. DELETE DOSEN
export async function deleteDosen(id: string) {
  try {
    await prisma.dosen.delete({
      where: { id },
    });
    revalidatePath('/admin/dosen');
    return { success: true, message: 'Dosen berhasil dihapus' };
  } catch (error) {
    console.error('Error deleting dosen:', error);
    return { success: false, error: 'Gagal menghapus dosen' };
  }
}