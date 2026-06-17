/*
  Warnings:

  - The `gambarUrl` column on the `Content` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `isi` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tahun` to the `KelompokKurban` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tahun` to the `PesertaKurban` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "JenisKonten" ADD VALUE 'sejarah';

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "isi" TEXT NOT NULL,
ADD COLUMN     "videoUrl" TEXT,
DROP COLUMN "gambarUrl",
ADD COLUMN     "gambarUrl" TEXT[];

-- AlterTable
ALTER TABLE "KelompokKurban" ADD COLUMN     "tahun" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PesertaKurban" ADD COLUMN     "tahun" TEXT NOT NULL;
