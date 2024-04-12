/*
  Warnings:

  - A unique constraint covering the columns `[name,userID]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,userID]` on the table `AccountGroup` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `usage` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Account_name_key";

-- DropIndex
DROP INDEX "AccountGroup_name_key";

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "userID" TEXT;

-- AlterTable
ALTER TABLE "AccountGroup" ADD COLUMN     "userID" TEXT;

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "usage" INTEGER NOT NULL,
ADD COLUMN     "userID" TEXT;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "userID" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Account_name_userID_key" ON "Account"("name", "userID");

-- CreateIndex
CREATE UNIQUE INDEX "AccountGroup_name_userID_key" ON "AccountGroup"("name", "userID");

-- CreateIndex
CREATE INDEX "Tag_name_idx" ON "Tag"("name");
