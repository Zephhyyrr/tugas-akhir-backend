/// <reference types="node" />
import "dotenv/config";
import { PrismaClient, RoleUser } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashing } from "../../src/utils/bcrypt";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("🌱 Memulai seeding database...");

    // Clear existing data
    await prisma.transaction.deleteMany();
    await prisma.content.deleteMany();
    await prisma.userToken.deleteMany();
    await prisma.keteranganTransaksi.deleteMany();
    await prisma.prediction.deleteMany();
    await prisma.user.deleteMany();

    console.log("🗑️  Database cleared");

    // 1. Create Keterangan Transaksi (Transaction Types)
    const keteranganTransaksi = await prisma.keteranganTransaksi.createMany({
        data: [
            {
                nama: "Uang Masuk",
                isDeleted: false,
            },
            {
                nama: "Uang Keluar",
                isDeleted: false,
            },
        ],
    });

    console.log(`✅ Seeded ${keteranganTransaksi.count} Keterangan Transaksi`);

    // Get the created keterangan
    const uangMasuk = await prisma.keteranganTransaksi.findFirst({
        where: { nama: "Uang Masuk", isDeleted: false },
    });

    const uangKeluar = await prisma.keteranganTransaksi.findFirst({
        where: { nama: "Uang Keluar", isDeleted: false },
    });

    if (!uangMasuk || !uangKeluar) {
        throw new Error("Failed to create Keterangan Transaksi");
    }

    // 2. Create Admin Users
    const adminPassword = await hashing("admin123456");
    const adminUser = await prisma.user.create({
        data: {
            email: "admin@masjid.com",
            nama: "Admin Masjid",
            password: adminPassword!,
            role: RoleUser.superadmin,
            isVerified: true,
            fotoProfile: null,
        },
    });

    const treasurer = await prisma.user.create({
        data: {
            email: "bendahara@masjid.com",
            nama: "Bendahara Masjid",
            password: adminPassword!,
            role: RoleUser.admin,
            isVerified: true,
            fotoProfile: null,
        },
    });

    console.log(`✅ Seeded 2 Admin Users`);

    // 3. Create Content (Articles/Info)
    const contents = await prisma.content.createMany({
        data: [
            {
                judul: "Laporan Donasi Masjid - Januari 2026",
                isi: "Laporan lengkap donasi masjid untuk bulan Januari 2026. Total donasi yang masuk adalah Rp 50.000.000 dari berbagai donatur. Dana ini digunakan untuk pembangunan dan perawatan masjid.",
                status: "published",
                userId: adminUser.id,
                gambarUrl: null,
                videoUrl: null,
                isDeleted: false,
            },
            {
                judul: "Program Renovasi Masjid 2026",
                isi: "Kami mengumumkan program renovasi masjid yang akan dilaksanakan pada tahun 2026. Renovasi akan mencakup perbaikan atap, pengecatan dinding, dan pembaruan sistem AC. Target dana yang dibutuhkan adalah Rp 100.000.000.",
                status: "published",
                userId: adminUser.id,
                gambarUrl: null,
                videoUrl: null,
                isDeleted: false,
            },
            {
                judul: "Cara Berdonasi ke Masjid",
                isi: "Donasi Anda sangat berarti untuk kemajuan masjid. Anda dapat berdonasi melalui transfer bank, tunai, atau aplikasi ini. Setiap donasi akan dicatat dan dilaporkan secara transparan.",
                status: "published",
                userId: adminUser.id,
                gambarUrl: null,
                videoUrl: null,
                isDeleted: false,
            },
            {
                judul: "Update Keuangan Triwulan I 2026",
                isi: "Berikut adalah laporan keuangan triwulan pertama tahun 2026. Total pendapatan dari donasi mencapai Rp 150.000.000 dan pengeluaran untuk operasional masjid Rp 80.000.000.",
                status: "published",
                userId: treasurer.id,
                gambarUrl: null,
                videoUrl: null,
                isDeleted: false,
            },
        ],
    });

    console.log(`✅ Seeded ${contents.count} Konten`);

    // 4. Create Transactions (Income)
    const transactionsIncome = await prisma.transaction.createMany({
        data: [
            {
                saldo: 50000000,
                kredit: 5000000,
                debet: 0,
                uraian: "Donasi dari pengurus DKM",
                tanggal: new Date("2026-01-05"),
                userId: adminUser.id,
                keteranganTransaksiId: uangMasuk.id,
                isDeleted: false,
            },
            {
                saldo: 55000000,
                kredit: 10000000,
                debet: 0,
                uraian: "Donasi dari jamaah saat Jum'at",
                tanggal: new Date("2026-01-10"),
                userId: adminUser.id,
                keteranganTransaksiId: uangMasuk.id,
                isDeleted: false,
            },
            {
                saldo: 65000000,
                kredit: 15000000,
                debet: 0,
                uraian: "Donasi dari acara qurban",
                tanggal: new Date("2026-01-15"),
                userId: adminUser.id,
                keteranganTransaksiId: uangMasuk.id,
                isDeleted: false,
            },
            {
                saldo: 80000000,
                kredit: 8000000,
                debet: 0,
                uraian: "Donasi dari komunitas bisnis Islam",
                tanggal: new Date("2026-02-01"),
                userId: adminUser.id,
                keteranganTransaksiId: uangMasuk.id,
                isDeleted: false,
            },
            {
                saldo: 88000000,
                kredit: 12000000,
                debet: 0,
                uraian: "Donasi Ramadan Kareem",
                tanggal: new Date("2026-02-20"),
                userId: adminUser.id,
                keteranganTransaksiId: uangMasuk.id,
                isDeleted: false,
            },
            {
                saldo: 100000000,
                kredit: 5000000,
                debet: 0,
                uraian: "Donasi khusus renovasi",
                tanggal: new Date("2026-03-10"),
                userId: treasurer.id,
                keteranganTransaksiId: uangMasuk.id,
                isDeleted: false,
            },
        ],
    });

    console.log(`✅ Seeded ${transactionsIncome.count} Transaksi Masuk`);

    // 5. Create Transactions (Expenses)
    const transactionsExpense = await prisma.transaction.createMany({
        data: [
            {
                saldo: 97000000,
                kredit: 0,
                debet: 3000000,
                uraian: "Pembayaran gaji imam dan muadzin",
                tanggal: new Date("2026-01-20"),
                userId: treasurer.id,
                keteranganTransaksiId: uangKeluar.id,
                isDeleted: false,
            },
            {
                saldo: 94500000,
                kredit: 0,
                debet: 2500000,
                uraian: "Pembelian perlengkapan ibadah",
                tanggal: new Date("2026-01-25"),
                userId: treasurer.id,
                keteranganTransaksiId: uangKeluar.id,
                isDeleted: false,
            },
            {
                saldo: 91000000,
                kredit: 0,
                debet: 3500000,
                uraian: "Biaya listrik dan air PDAM",
                tanggal: new Date("2026-02-05"),
                userId: treasurer.id,
                keteranganTransaksiId: uangKeluar.id,
                isDeleted: false,
            },
            {
                saldo: 87000000,
                kredit: 0,
                debet: 4000000,
                uraian: "Perbaikan atap masjid",
                tanggal: new Date("2026-02-15"),
                userId: treasurer.id,
                keteranganTransaksiId: uangKeluar.id,
                isDeleted: false,
            },
            {
                saldo: 84500000,
                kredit: 0,
                debet: 2500000,
                uraian: "Pembelian hadiah lomba qur'an",
                tanggal: new Date("2026-03-05"),
                userId: treasurer.id,
                keteranganTransaksiId: uangKeluar.id,
                isDeleted: false,
            },
            {
                saldo: 81000000,
                kredit: 0,
                debet: 3500000,
                uraian: "Gaji pekerja dan maintenance",
                tanggal: new Date("2026-03-20"),
                userId: treasurer.id,
                keteranganTransaksiId: uangKeluar.id,
                isDeleted: false,
            },
        ],
    });

    console.log(`✅ Seeded ${transactionsExpense.count} Transaksi Keluar`);

    // 6. Create Predictions (ARIMA forecast data)
    const predictions = await prisma.prediction.createMany({
        data: [
            {
                prediksiPemasukan: 75000000,
                prediksiPengeluaran: 35000000,
                tanggalTarget: new Date("2026-04-30"),
                rmse: 2500000,
                wmape: 0.08,
            },
            {
                prediksiPemasukan: 85000000,
                prediksiPengeluaran: 40000000,
                tanggalTarget: new Date("2026-05-31"),
                rmse: 2800000,
                wmape: 0.09,
            },
            {
                prediksiPemasukan: 120000000,
                prediksiPengeluaran: 45000000,
                tanggalTarget: new Date("2026-06-30"),
                rmse: 3200000,
                wmape: 0.1,
            },
            {
                prediksiPemasukan: 95000000,
                prediksiPengeluaran: 38000000,
                tanggalTarget: new Date("2026-07-31"),
                rmse: 2900000,
                wmape: 0.085,
            },
        ],
    });

    console.log(`✅ Seeded ${predictions.count} Prediksi`);

    console.log("🎉 Database seeding completed successfully!");
}

main()
    .catch((e) => {
        console.error("❌ Seeding error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
