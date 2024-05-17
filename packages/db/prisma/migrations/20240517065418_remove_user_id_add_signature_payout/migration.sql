/*
  Warnings:

  - You are about to drop the column `userId` on the `Payout` table. All the data in the column will be lost.
  - Added the required column `signature` to the `Payout` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Payout" DROP CONSTRAINT "Payout_userId_fkey";

-- AlterTable
ALTER TABLE "Payout" DROP COLUMN "userId",
ADD COLUMN     "signature" TEXT NOT NULL;
