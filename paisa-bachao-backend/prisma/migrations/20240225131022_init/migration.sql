-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "datetime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT;
