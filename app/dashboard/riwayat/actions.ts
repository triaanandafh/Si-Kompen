'use server';

import { prisma } from '@/lib/prisma';

export async function getRiwayatPengajuan(mahasiswaId: string) {
  try {
    const data = await prisma.pengajuanKompen.findMany({
      where: {
        mahasiswaId: mahasiswaId,
      },
      include: {
        matkul: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { success: true, data };
  } catch (error) {
    console.error('Error fetching riwayat pengajuan:', error);
    return { success: false, error: 'Gagal mengambil riwayat pengajuan' };
  }
}