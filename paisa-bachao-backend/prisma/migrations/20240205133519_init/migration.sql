/*
  Warnings:

  - You are about to drop the column `creditAccountID` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `debtAccountID` on the `Account` table. All the data in the column will be lost.
  - Added the required column `credit` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `debit` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('CATEGORISED', 'UNCATEGORISED');

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_creditAccountID_fkey";

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_debtAccountID_fkey";

-- DropIndex
DROP INDEX "Account_creditAccountID_key";

-- DropIndex
DROP INDEX "Account_debtAccountID_key";

-- AlterTable
ALTER TABLE "Account" DROP COLUMN "creditAccountID",
DROP COLUMN "debtAccountID",
ADD COLUMN     "credit" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "debit" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "type" "AccountType" NOT NULL;
