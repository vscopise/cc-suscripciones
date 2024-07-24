-- CreateTable
CREATE TABLE "CreditCard" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "expiration" TIMESTAMP(3) NOT NULL,
    "cvv" INTEGER NOT NULL,
    "clientId" TEXT NOT NULL,

    CONSTRAINT "CreditCard_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CreditCard" ADD CONSTRAINT "CreditCard_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
