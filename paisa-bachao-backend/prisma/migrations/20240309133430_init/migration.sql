-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "fromName" TEXT,
ADD COLUMN     "toName" TEXT,
ALTER COLUMN "fromAccountID" DROP NOT NULL,
ALTER COLUMN "toAccountID" DROP NOT NULL;
