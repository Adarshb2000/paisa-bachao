/*
  Warnings:

  - You are about to drop the column `credit` on the `AccountGroup` table. All the data in the column will be lost.
  - You are about to drop the column `debt` on the `AccountGroup` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AccountGroup" DROP COLUMN "credit",
DROP COLUMN "debt";

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "temporalStamp" DROP NOT NULL;
