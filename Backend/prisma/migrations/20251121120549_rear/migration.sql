/*
  Warnings:

  - You are about to drop the column `camera` on the `Mobile` table. All the data in the column will be lost.
  - Added the required column `frontCamera` to the `Mobile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rearCamera` to the `Mobile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mobile" DROP COLUMN "camera",
ADD COLUMN     "frontCamera" INTEGER NOT NULL,
ADD COLUMN     "rearCamera" INTEGER NOT NULL;
