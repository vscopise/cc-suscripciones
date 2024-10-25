-- AlterEnum
ALTER TYPE "PaymentMethod" ADD VALUE 'Efectivo';

-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "clientNumber" SERIAL NOT NULL;
