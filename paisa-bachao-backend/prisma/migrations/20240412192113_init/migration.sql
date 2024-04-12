/*
  Warnings:

  - A unique constraint covering the columns `[userID,name,accountGroupID]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name,userID]` on the table `AccountGroup` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "AccountGroup_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "Account_userID_name_accountGroupID_key" ON "Account"("userID", "name", "accountGroupID");

-- CreateIndex
CREATE UNIQUE INDEX "AccountGroup_name_userID_key" ON "AccountGroup"("name", "userID");
