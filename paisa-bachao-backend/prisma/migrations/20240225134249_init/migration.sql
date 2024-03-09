/*
  Warnings:

  - You are about to drop the column `passbookID` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `primary` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `Passbook` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_passbookID_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "passbookID",
DROP COLUMN "primary",
ADD COLUMN     "motherTransactionId" TEXT,
ADD COLUMN     "place" TEXT;

-- DropTable
DROP TABLE "Passbook";

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_motherTransactionId_fkey" FOREIGN KEY ("motherTransactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
