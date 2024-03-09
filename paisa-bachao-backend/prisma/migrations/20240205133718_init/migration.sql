/*
  Warnings:

  - You are about to drop the column `debit` on the `Account` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "debit",
ADD COLUMN     "debt" DECIMAL(65,30) NOT NULL DEFAULT 0,
ALTER COLUMN "credit" SET DEFAULT 0;
