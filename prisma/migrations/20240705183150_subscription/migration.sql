/*
  Warnings:

  - You are about to drop the column `active` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `dateLastPay` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `dateStart` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `delivery` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `period` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `planId` on the `Subscription` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_clientId_fkey";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "active",
DROP COLUMN "clientId",
DROP COLUMN "dateLastPay",
DROP COLUMN "dateStart",
DROP COLUMN "delivery",
DROP COLUMN "paymentMethod",
DROP COLUMN "period",
DROP COLUMN "planId";
