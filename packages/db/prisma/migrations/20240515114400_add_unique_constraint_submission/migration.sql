/*
  Warnings:

  - A unique constraint covering the columns `[taskId,workerId]` on the table `Submission` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Submission" ALTER COLUMN "amount" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Submission_taskId_workerId_key" ON "Submission"("taskId", "workerId");
