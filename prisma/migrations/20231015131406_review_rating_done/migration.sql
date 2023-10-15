-- CreateTable
CREATE TABLE "ReviewsRating" (
    "id" TEXT NOT NULL,
    "comments" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "ReviewsRating_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReviewsRating" ADD CONSTRAINT "ReviewsRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewsRating" ADD CONSTRAINT "ReviewsRating_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
