-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_accountGroupID_fkey";

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_accountGroupID_fkey" FOREIGN KEY ("accountGroupID") REFERENCES "AccountGroup"("id") ON DELETE SET NULL ON UPDATE SET NULL;
