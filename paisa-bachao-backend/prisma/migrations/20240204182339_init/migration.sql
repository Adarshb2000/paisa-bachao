/*
  Warnings:

  - You are about to drop the column `totalBalance` on the `Account` table. All the data in the column will be lost.
  - Added the required column `credit` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `debt` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Account" DROP COLUMN "totalBalance",
ADD COLUMN     "credit" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "debt" DECIMAL(65,30) NOT NULL;
