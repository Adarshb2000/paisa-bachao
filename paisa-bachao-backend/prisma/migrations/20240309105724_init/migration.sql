-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_from_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_to_fkey";

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_from_fkey" FOREIGN KEY ("from") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_to_fkey" FOREIGN KEY ("to") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
