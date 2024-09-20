/*
  Warnings:

  - You are about to drop the column `items` on the `Order` table. All the data in the column will be lost.
  - Added the required column `latitude` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('NotPaid', 'Paid');

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "items",
ADD COLUMN     "deliveryInstructions" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'NotPaid';
