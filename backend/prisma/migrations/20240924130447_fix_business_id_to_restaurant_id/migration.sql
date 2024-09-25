/*
  Warnings:

  - You are about to drop the column `businessId` on the `Review` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,restaurantId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `restaurantId` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_businessId_fkey";

-- DropIndex
DROP INDEX "Review_userId_businessId_key";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "businessId",
ADD COLUMN     "restaurantId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Review_userId_restaurantId_key" ON "Review"("userId", "restaurantId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
