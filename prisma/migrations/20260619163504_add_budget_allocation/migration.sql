/*
  Warnings:

  - You are about to drop the column `prediksiPemasukan` on the `Prediction` table. All the data in the column will be lost.
  - You are about to drop the column `prediksiPengeluaran` on the `Prediction` table. All the data in the column will be lost.
  - Added the required column `nominal` to the `Prediction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipe` to the `Prediction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Prediction" DROP COLUMN "prediksiPemasukan",
DROP COLUMN "prediksiPengeluaran",
ADD COLUMN     "nominal" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "tipe" "TipeTransaksi" NOT NULL;

-- CreateTable
CREATE TABLE "BudgetAllocation" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "persentase" DOUBLE PRECISION NOT NULL,
    "nominal" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "predictionId" INTEGER NOT NULL,

    CONSTRAINT "BudgetAllocation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BudgetAllocation" ADD CONSTRAINT "BudgetAllocation_predictionId_fkey" FOREIGN KEY ("predictionId") REFERENCES "Prediction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
