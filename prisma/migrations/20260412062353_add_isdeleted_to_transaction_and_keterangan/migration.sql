-- AlterTable
ALTER TABLE "KeteranganTransaksi" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;
