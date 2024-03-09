/*
  Warnings:

  - You are about to drop the column `credit` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `debt` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `fromID` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `fromSubID` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `toID` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `toSubID` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `SubAccount` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `from` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SubAccount" DROP CONSTRAINT "SubAccount_accountID_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_fromID_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_fromSubID_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_toID_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_toSubID_fkey";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "credit",
DROP COLUMN "debt",
DROP COLUMN "type",
ADD COLUMN     "accountGroupID" TEXT,
ADD COLUMN     "balance" DECIMAL(65,30) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "fromID",
DROP COLUMN "fromSubID",
DROP COLUMN "toID",
DROP COLUMN "toSubID",
ADD COLUMN     "from" TEXT NOT NULL,
ADD COLUMN     "to" TEXT NOT NULL;

-- DropTable
DROP TABLE "SubAccount";

-- DropEnum
DROP TYPE "AccountType";

-- CreateTable
CREATE TABLE "AccountGroup" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AccountGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AccountGroup_name_key" ON "AccountGroup"("name");

-- CreateIndex
CREATE INDEX "AccountGroup_name_idx" ON "AccountGroup"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Account_name_key" ON "Account"("name");

-- CreateIndex
CREATE INDEX "Account_name_idx" ON "Account"("name");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_from_fkey" FOREIGN KEY ("from") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_to_fkey" FOREIGN KEY ("to") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_accountGroupID_fkey" FOREIGN KEY ("accountGroupID") REFERENCES "AccountGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
