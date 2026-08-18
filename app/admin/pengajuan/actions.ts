'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { StatusPengajuan } from '../../generated/prisma';

// Fetch pengajuan masuk
export async function getPengajuanData() {
  try {
    const data = await prisma.pengajuanKompen.findMany({
      include: {
        mahasiswa: true, // Ambil data mahasiswa
        matkul: true,    // Ambil data mata kuliah
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching pengajuan:', error);
    return { success: false, error: 'Gagal mengambil data pengajuan' };
  }
}

// Update status pengajuan
export async function updateStatusPengajuan(id: string, newStatus: string) {
  try {
    await prisma.pengajuanKompen.update({
      where: { id },
      data: {
        status: newStatus as StatusPengajuan, // Cast ke Enum StatusPengajuan
      },
    });
    
    revalidatePath('/admin/pengajuan');
    revalidatePath('/admin/dashboard');
    return { success: true, message: 'Status pengajuan berhasil diperbarui' };
  } catch (error) {
    console.error('Error updating status:', error);
    return { success: false, error: 'Gagal memperbarui status pengajuan' };
  }
}