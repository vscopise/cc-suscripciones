-- CreateEnum
CREATE TYPE "Period" AS ENUM ('Mensual', 'Trimestral', 'Semestral', 'Anual');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('MercadoPago', 'FirstData', 'Visa', 'Stripe', 'Multipago', 'CobroYa', 'TransferenciaBancaria', 'AbitabNet');

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL,
    "dateStart" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateLastPay" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL,
    "period" "Period" NOT NULL DEFAULT 'Mensual',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'MercadoPago',
    "delivery" TEXT NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);
