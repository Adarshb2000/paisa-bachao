/*
  Warnings:

  - You are about to drop the column `datetime` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "datetime",
ADD COLUMN     "temporalStamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
