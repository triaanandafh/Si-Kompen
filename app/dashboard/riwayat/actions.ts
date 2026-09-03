'use server';

import { prisma } from '@/lib/prisma';

export async function getRiwayatPengajuan(identifier: string) {
  try {
    const data = await prisma.pengajuanKompen.findMany({
      where: {
        OR: [
          { mahasiswaId: identifier },            // jika identifier adalah Mahasiswa.id
          { mahasiswa: { userId: identifier } },  // jika identifier adalah User.id (dari session login)
        ],
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