-- AlterTable
ALTER TABLE "account_groups" ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "accounts" ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "tags" ALTER COLUMN "user_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "transactions" ALTER COLUMN "user_id" DROP NOT NULL;
