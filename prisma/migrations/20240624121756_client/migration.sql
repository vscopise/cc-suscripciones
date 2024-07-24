-- CreateEnum
CREATE TYPE "IdentificationType" AS ENUM ('Cédula', 'Pasaporte');

-- CreateTable
CREATE TABLE "Client" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT '',
    "lastName" TEXT NOT NULL DEFAULT '',
    "identification" INTEGER NOT NULL DEFAULT 0,
    "identificationType" "IdentificationType" NOT NULL DEFAULT 'Cédula',
    "phone" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "address" TEXT DEFAULT '',
    "city" TEXT DEFAULT '',
    "state" TEXT DEFAULT '',

    CONSTRAINT "Client_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Client_email_key" ON "Client"("email");
