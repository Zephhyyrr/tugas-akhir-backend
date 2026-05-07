/*
  Warnings:

  - You are about to drop the column `rmse` on the `Prediction` table. All the data in the column will be lost.
  - You are about to drop the column `wmape` on the `Prediction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Prediction" DROP COLUMN "rmse",
DROP COLUMN "wmape";
