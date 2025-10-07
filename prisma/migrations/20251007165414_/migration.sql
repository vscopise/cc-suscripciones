/*
  Warnings:

  - The values [Paypal_WesternUnion] on the enum `PaymentMethod` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMethod_new" AS ENUM ('AbitabNet', 'BrouDebito', 'CobroYa', 'Efectivo', 'FirstData', 'Gentileza', 'MercadoPago', 'Multipago', 'Passcard', 'PaypalWesternUnion', 'Stripe', 'TransferenciaBancaria', 'Visa');
ALTER TABLE "Subscription" ALTER COLUMN "paymentMethod" DROP DEFAULT;
ALTER TABLE "Subscription" ALTER COLUMN "paymentMethod" TYPE "PaymentMethod_new" USING ("paymentMethod"::text::"PaymentMethod_new");
ALTER TYPE "PaymentMethod" RENAME TO "PaymentMethod_old";
ALTER TYPE "PaymentMethod_new" RENAME TO "PaymentMethod";
DROP TYPE "PaymentMethod_old";
ALTER TABLE "Subscription" ALTER COLUMN "paymentMethod" SET DEFAULT 'MercadoPago';
COMMIT;
