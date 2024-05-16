/*
  Warnings:

  - The `amount` column on the `Submission` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `amount` column on the `Task` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Submission" DROP COLUMN "amount",
ADD COLUMN     "amount" INTEGER;

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "amount",
ADD COLUMN     "amount" INTEGER NOT NULL DEFAULT 0;
