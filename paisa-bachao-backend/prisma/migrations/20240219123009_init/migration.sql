-- AlterTable
ALTER TABLE "AccountGroup" ADD COLUMN     "credit" DECIMAL(65,30) NOT NULL DEFAULT 0,
ADD COLUMN     "debt" DECIMAL(65,30) NOT NULL DEFAULT 0;
