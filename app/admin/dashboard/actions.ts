'use server';

import { prisma } from '@/lib/prisma';

export async function getDashboardData(prodiFilter: string = 'Semua Prodi') {
  try {
    // Filter kondisi berdasarkan Prodi melalui relasi Mata Kuliah (matkul.prodi)
    const prodiCondition = prodiFilter !== 'Semua Prodi' ? { matkul: { prodi: prodiFilter } } : {};

    // 1. Hitung Statistik (Total, Menunggu TTD, Diproses KPS, Selesai)
    const totalPengajuan = await prisma.pengajuanKompen.count({
      where: prodiCondition,
    });

    const menungguTtdCount = await prisma.pengajuanKompen.count({
      where: {
        StatusPengajuan: 'MENUNGGU_TTD_DOSEN',
        ...prodiCondition,
      },
    });

    const diprosesKpsCount = await prisma.pengajuanKompen.count({
      where: {
        StatusPengajuan: 'DIPROSES_KPS',
        ...prodiCondition,
      },
    });

    const selesaiCount = await prisma.pengajuanKompen.count({
      where: {
        StatusPengajuan: 'SELESAI',
        ...prodiCondition,
      },
    });

    // 2. Ambil Data Pengajuan Terbaru (Join ke Mahasiswa dan Matkul)
    const submissions = await prisma.pengajuanKompen.findMany({
      where: prodiCondition,
      include: {
        mahasiswa: true,
        matkul: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10, // Batasi 10 data terbaru di dashboard
    });

    return {
      success: true,
      stats: {
        total: totalPengajuan,
        menunggu: menungguTtdCount,
        diproses: diprosesKpsCount,
        selesai: selesaiCount,
      },
      submissions,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return { success: false, error: 'Gagal mengambil data dashboard' };
  }
}