-- DropIndex
DROP INDEX "Client_email_key";

-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "email" SET DEFAULT '';
