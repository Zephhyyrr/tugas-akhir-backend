-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN "saldo" DOUBLE PRECISION;

-- Backfill existing rows
UPDATE "Transaction"
SET "saldo" = "kredit" - "debet"
WHERE "saldo" IS NULL;

-- Make column required
ALTER TABLE "Transaction" ALTER COLUMN "saldo" SET NOT NULL;
