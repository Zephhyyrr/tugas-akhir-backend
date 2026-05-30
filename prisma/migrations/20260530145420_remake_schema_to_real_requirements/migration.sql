/*
  Warnings:

  - You are about to drop the column `isi` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `videoUrl` on the `Content` table. All the data in the column will be lost.
  - You are about to drop the column `debet` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `keteranganTransaksiId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `kredit` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `saldo` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `KeteranganTransaksi` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `jenis` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Made the column `gambarUrl` on table `Content` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `jenisKasId` to the `Prediction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jenisKasId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mediaPembayaranId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nominal` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipe` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipeTransaksi" AS ENUM ('uang_masuk', 'uang_keluar', 'saldo_awal');

-- CreateEnum
CREATE TYPE "TipeKurban" AS ENUM ('individu_sapi', 'individu_kambing', 'kelompok');

-- CreateEnum
CREATE TYPE "JenisKonten" AS ENUM ('berita', 'pengurus', 'imsakiyah');

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_keteranganTransaksiId_fkey";

-- AlterTable
ALTER TABLE "Content" DROP COLUMN "isi",
DROP COLUMN "status",
DROP COLUMN "videoUrl",
ADD COLUMN     "isTampil" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "jenis" "JenisKonten" NOT NULL,
ALTER COLUMN "gambarUrl" SET NOT NULL;

-- AlterTable
ALTER TABLE "Prediction" ADD COLUMN     "jenisKasId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "debet",
DROP COLUMN "keteranganTransaksiId",
DROP COLUMN "kredit",
DROP COLUMN "saldo",
ADD COLUMN     "jenisKasId" INTEGER NOT NULL,
ADD COLUMN     "mediaPembayaranId" INTEGER NOT NULL,
ADD COLUMN     "nominal" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "tipe" "TipeTransaksi" NOT NULL;

-- DropTable
DROP TABLE "KeteranganTransaksi";

-- CreateTable
CREATE TABLE "KelompokKurban" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KelompokKurban_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PesertaKurban" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "nominal" DOUBLE PRECISION NOT NULL,
    "tipe" "TipeKurban" NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "mediaPembayaranId" INTEGER NOT NULL,
    "kelompokKurbanId" INTEGER,

    CONSTRAINT "PesertaKurban_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JenisKas" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JenisKas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaPembayaran" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MediaPembayaran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FavoriteTransaksi" (
    "id" SERIAL NOT NULL,
    "uraian" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FavoriteTransaksi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "JenisKas_nama_key" ON "JenisKas"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "MediaPembayaran_nama_key" ON "MediaPembayaran"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteTransaksi_uraian_key" ON "FavoriteTransaksi"("uraian");

-- AddForeignKey
ALTER TABLE "PesertaKurban" ADD CONSTRAINT "PesertaKurban_mediaPembayaranId_fkey" FOREIGN KEY ("mediaPembayaranId") REFERENCES "MediaPembayaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PesertaKurban" ADD CONSTRAINT "PesertaKurban_kelompokKurbanId_fkey" FOREIGN KEY ("kelompokKurbanId") REFERENCES "KelompokKurban"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_jenisKasId_fkey" FOREIGN KEY ("jenisKasId") REFERENCES "JenisKas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_mediaPembayaranId_fkey" FOREIGN KEY ("mediaPembayaranId") REFERENCES "MediaPembayaran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_jenisKasId_fkey" FOREIGN KEY ("jenisKasId") REFERENCES "JenisKas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
