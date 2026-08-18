'use server';

import { prisma } from '@/lib/prisma'; // Sesuaikan path prisma kamu
import { revalidatePath } from 'next/cache';

// 1. GET DATA MATKUL
export async function getMatkulData() {
  try {
    const data = await prisma.matkul.findMany({
      include: {
        dosen: true,
      },
      orderBy: {
        namaMatkul: 'asc',
      },
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching matkul:', error);
    return { success: false, error: 'Gagal mengambil data mata kuliah' };
  }
}

// 2. GET LIST DOSEN (Untuk Dropdown Pilihan Dosen di Modal)
export async function getDosenOptions() {
  try {
    const data = await prisma.dosen.findMany({
      select: {
        id: true,
        nama: true, // Sesuaikan jika di schema nama field-nya nama/namaDosen
      },
      orderBy: {
        nama: 'asc',
      },
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching dosen options:', error);
    return { success: false, data: [] };
  }
}

// 3. CREATE MATKUL
export async function createMatkul(formData: {
  namaMatkul: string;
  prodi: string;
  dosen_id: string;
}) {
  try {
    await prisma.matkul.create({
      data: {
        namaMatkul: formData.namaMatkul,
        prodi: formData.prodi,
        dosenId: formData.dosen_id,
      },
    });
    revalidatePath('/admin/matkul');
    return { success: true, message: 'Mata kuliah berhasil ditambahkan' };
  } catch (error) {
    console.error('Error creating matkul:', error);
    return { success: false, error: 'Gagal menambahkan mata kuliah' };
  }
}

// 4. UPDATE MATKUL
export async function updateMatkul(
  id: string,
  formData: {
    namaMatkul: string;
    prodi: string;
    dosen_id: string;
  }
) {
  try {
    await prisma.matkul.update({
      where: { id },
      data: {
        namaMatkul: formData.namaMatkul,
        prodi: formData.prodi,
        dosen_id: formData.dosen_id,
      },
    });
    revalidatePath('/admin/matkul');
    return { success: true, message: 'Mata kuliah berhasil diperbarui' };
  } catch (error) {
    console.error('Error updating matkul:', error);
    return { success: false, error: 'Gagal memperbarui mata kuliah' };
  }
}

// 5. DELETE MATKUL
export async function deleteMatkul(id: string) {
  try {
    await prisma.matkul.delete({
      where: { id },
    });
    revalidatePath('/admin/matkul');
    return { success: true, message: 'Mata kuliah berhasil dihapus' };
  } catch (error) {
    console.error('Error deleting matkul:', error);
    return { success: false, error: 'Gagal menghapus mata kuliah' };
  }
}