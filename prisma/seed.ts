import { PrismaClient } from "../app/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Admin
  const adminPassword = await bcrypt.hash("admin123", 10);
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@polinema.ac.id" },
    create: {
      nama: "Admin Jurusan TI",
      email: "admin@polinema.ac.id",
      password: adminPassword,
      role: "ADMIN",
      admin: { create: {} },
    },
    update: {
      
    },
  });

  // Mahasiswa contoh
  const mhsPassword = await bcrypt.hash("mahasiswa123", 10);
  const mhsUser = await prisma.user.upsert({
    where: { email: "tria@student.polinema.ac.id" },
    create: {
      nama: "Tria Ananda Fodillah",
      email: "tria@student.polinema.ac.id",
      password: mhsPassword,
      role: "MAHASISWA",
      mahasiswa: {
        create: {
          nim: "2441070601099",
          kelas: "SIB 26",
          prodi: "SIB",
        },
      },
    },
    update: {
      
    },
  });

  // Dosen contoh
  const dosen1 = await prisma.dosen.upsert({
    where: { nip: "198902102019031020" },
    create: { nama: "Moch. Zawaruddin Abdullah", nip: "198902102019031020" },
    update: {},
  });
  const dosen2 = await prisma.dosen.upsert({
    where: { nip: "198305212006041003" },
    create: { nama: "Hendra Pradibta, S.E., M.Sc.", nip: "198305212006041003" },
    update: {},
  });

  // Matkul contoh
const existingMatkul1 = await prisma.matkul.findFirst({
    where: { namaMatkul: "Basis Data", prodi: "SIB" }
  });
  if (!existingMatkul1) {
    await prisma.matkul.create({
      data: { namaMatkul: "Basis Data", dosenId: dosen1.id, prodi: "SIB" },
    });
  }

  const existingMatkul2 = await prisma.matkul.findFirst({
    where: { namaMatkul: "Pemrograman Web", prodi: "SIB" }
  });
  if (!existingMatkul2) {
    await prisma.matkul.create({
      data: { namaMatkul: "Pemrograman Web", dosenId: dosen2.id, prodi: "SIB" },
    });
  }

  console.log("Seed selesai:", { adminUser: adminUser.email, mhsUser: mhsUser.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });