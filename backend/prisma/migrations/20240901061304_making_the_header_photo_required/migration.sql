/*
  Warnings:

  - Made the column `HeaderPhoto` on table `Restaurant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Restaurant" ALTER COLUMN "HeaderPhoto" SET NOT NULL;
