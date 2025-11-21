/*
  Warnings:

  - You are about to drop the column `camera` on the `Prediction` table. All the data in the column will be lost.
  - Added the required column `frontCamera` to the `Prediction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rearCamera` to the `Prediction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Prediction" DROP COLUMN "camera",
ADD COLUMN     "frontCamera" INTEGER NOT NULL,
ADD COLUMN     "rearCamera" INTEGER NOT NULL;
