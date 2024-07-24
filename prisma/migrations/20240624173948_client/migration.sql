/*
  Warnings:

  - Made the column `address` on table `Client` required. This step will fail if there are existing NULL values in that column.
  - Made the column `city` on table `Client` required. This step will fail if there are existing NULL values in that column.
  - Made the column `state` on table `Client` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Client" ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "city" SET NOT NULL,
ALTER COLUMN "state" SET NOT NULL;
