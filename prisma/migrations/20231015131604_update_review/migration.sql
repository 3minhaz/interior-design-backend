/*
  Warnings:

  - You are about to drop the `ReviewsRating` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ReviewsRating" DROP CONSTRAINT "ReviewsRating_serviceId_fkey";

-- DropForeignKey
ALTER TABLE "ReviewsRating" DROP CONSTRAINT "ReviewsRating_userId_fkey";

-- DropTable
DROP TABLE "ReviewsRating";

-- CreateTable
CREATE TABLE "reviewsRating" (
    "id" TEXT NOT NULL,
    "comments" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "reviewsRating_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reviewsRating" ADD CONSTRAINT "reviewsRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviewsRating" ADD CONSTRAINT "reviewsRating_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
