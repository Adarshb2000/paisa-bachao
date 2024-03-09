/*
  Warnings:

  - You are about to drop the column `from` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `to` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `fromAccountID` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toAccountID` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Made the column `temporalStamp` on table `Transaction` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_from_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_to_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "from",
DROP COLUMN "to",
ADD COLUMN     "fromAccountID" TEXT NOT NULL,
ADD COLUMN     "toAccountID" TEXT NOT NULL,
ALTER COLUMN "temporalStamp" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_fromAccountID_fkey" FOREIGN KEY ("fromAccountID") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_toAccountID_fkey" FOREIGN KEY ("toAccountID") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
