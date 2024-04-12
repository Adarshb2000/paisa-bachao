/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `AccountGroup` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Account_name_userID_key";

-- DropIndex
DROP INDEX "AccountGroup_name_userID_key";

-- CreateIndex
CREATE UNIQUE INDEX "Account_name_key" ON "Account"("name");

-- CreateIndex
CREATE UNIQUE INDEX "AccountGroup_name_key" ON "AccountGroup"("name");
