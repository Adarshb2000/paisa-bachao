/*
  Warnings:

  - You are about to drop the column `credit` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `debt` on the `Account` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[creditAccountID]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[debtAccountID]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `creditAccountID` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `debtAccountID` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "credit",
DROP COLUMN "debt",
ADD COLUMN     "creditAccountID" TEXT NOT NULL,
ADD COLUMN     "debtAccountID" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Account_creditAccountID_key" ON "Account"("creditAccountID");

-- CreateIndex
CREATE UNIQUE INDEX "Account_debtAccountID_key" ON "Account"("debtAccountID");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_creditAccountID_fkey" FOREIGN KEY ("creditAccountID") REFERENCES "SubAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_debtAccountID_fkey" FOREIGN KEY ("debtAccountID") REFERENCES "SubAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
