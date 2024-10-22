/*
  Warnings:

  - A unique constraint covering the columns `[userID,tagId,frequency]` on the table `Budget` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Budget_userID_tagId_frequency_key" ON "Budget"("userID", "tagId", "frequency");
