/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `CreditCard` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CreditCard_number_key" ON "CreditCard"("number");
