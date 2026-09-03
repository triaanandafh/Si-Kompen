'use server';

import { prisma } from '@/lib/prisma';

export async function getDashboardData(prodiFilter: string = 'Semua Prodi') {
  try {
    // Filter kondisi berdasarkan Prodi jika bukan 'Semua Prodi'
    const prodiCondition =
      prodiFilter !== 'Semua Prodi'
        ? {
            matkul: {
              prodi: {
                contains: prodiFilter,
                mode: 'insensitive' as const,
              },
            },
          }
        : {};

    // 1. Hitung Statistik (Gunakan field 'status', bukan 'StatusPengajuan')
    const totalPengajuan = await prisma.pengajuanKompen.count({
      where: prodiCondition,
    });

    const menungguTtdCount = await prisma.pengajuanKompen.count({
      where: {
        status: 'MENUNGGU_TTD_DOSEN',
        ...prodiCondition,
      },
    });

    const verifikasiKpsCount = await prisma.pengajuanKompen.count({
      where: {
        status: 'VERIFIKASI_KPS',
        ...prodiCondition,
      },
    });

    const disetujuiCount = await prisma.pengajuanKompen.count({
      where: {
        status: 'DISETUJUI',
        ...prodiCondition,
      },
    });

    // 2. Ambil 10 Data Pengajuan Terbaru (Join ke Mahasiswa -> User dan Matkul)
    const submissions = await prisma.pengajuanKompen.findMany({
      where: prodiCondition,
      include: {
        mahasiswa: {
          include: {
            user: true, // Agar nama mahasiswa terbaca
          },
        },
        matkul: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    return {
      success: true,
      stats: {
        total: totalPengajuan,
        menunggu: menungguTtdCount,
        diproses: verifikasiKpsCount,
        selesai: disetujuiCount,
      },
      submissions,
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return {
      success: false,
      error: 'Gagal mengambil data dashboard',
      stats: { total: 0, menunggu: 0, diproses: 0, selesai: 0 },
      submissions: [],
    };
  }
}