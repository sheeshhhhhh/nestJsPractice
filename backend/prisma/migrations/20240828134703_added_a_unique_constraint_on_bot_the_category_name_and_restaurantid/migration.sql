/*
  Warnings:

  - A unique constraint covering the columns `[CategoryName,restaurantId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Category_CategoryName_restaurantId_key" ON "Category"("CategoryName", "restaurantId");
