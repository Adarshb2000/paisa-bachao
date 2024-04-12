/*
  Warnings:

  - A unique constraint covering the columns `[userID,name]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Account_name_idx";

-- DropIndex
DROP INDEX "Account_userID_name_accountGroupID_key";

-- DropIndex
DROP INDEX "AccountGroup_name_idx";

-- DropIndex
DROP INDEX "Tag_name_idx";

-- CreateIndex
CREATE INDEX "Account_userID_name_idx" ON "Account"("userID", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Account_userID_name_key" ON "Account"("userID", "name");

-- CreateIndex
CREATE INDEX "AccountGroup_name_userID_idx" ON "AccountGroup"("name", "userID");

-- CreateIndex
CREATE INDEX "Tag_name_userID_idx" ON "Tag"("name", "userID");
