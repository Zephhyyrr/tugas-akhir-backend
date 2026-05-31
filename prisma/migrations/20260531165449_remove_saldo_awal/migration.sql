/*
  Warnings:

  - The values [saldo_awal] on the enum `TipeTransaksi` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TipeTransaksi_new" AS ENUM ('uang_masuk', 'uang_keluar');
ALTER TABLE "Transaction" ALTER COLUMN "tipe" TYPE "TipeTransaksi_new" USING ("tipe"::text::"TipeTransaksi_new");
ALTER TYPE "TipeTransaksi" RENAME TO "TipeTransaksi_old";
ALTER TYPE "TipeTransaksi_new" RENAME TO "TipeTransaksi";
DROP TYPE "public"."TipeTransaksi_old";
COMMIT;
