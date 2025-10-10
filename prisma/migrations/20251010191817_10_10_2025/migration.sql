-- DropIndex
DROP INDEX "CreditCard_number_key";

-- AlterTable
ALTER TABLE "CreditCard" ALTER COLUMN "number" SET DATA TYPE TEXT,
ALTER COLUMN "expiration" SET DATA TYPE TEXT,
ALTER COLUMN "cvv" SET DATA TYPE TEXT;
