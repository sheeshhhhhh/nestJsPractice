-- CreateEnum
CREATE TYPE "role" AS ENUM ('Customer', 'Admin', 'Business');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "role" "role" NOT NULL DEFAULT 'Customer';

-- CreateTable
CREATE TABLE "userInfo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "email" TEXT,
    "bio" TEXT,
    "profile" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "userInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "userInfo_userId_key" ON "userInfo"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "userInfo_email_key" ON "userInfo"("email");

-- AddForeignKey
ALTER TABLE "userInfo" ADD CONSTRAINT "userInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
