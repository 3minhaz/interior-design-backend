import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import prisma from '../../../shared/prisma'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const insertReview = async (id: string, serviceId: string, reviewData: any) => {
  const isBookedOrNot = await prisma.booking.findFirst({
    where: {
      userId: id,
    },
  })

  if (!isBookedOrNot) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Need to book the service first')
  }
  const reviewExistOrNot = await prisma.reviewsRating.findFirst({
    where: {
      serviceId,
      userId: id,
    },
  })
  // console.log(reviewExistOrNot, 'checking review exist or not')
  reviewData['userId'] = id
  reviewData['serviceId'] = serviceId
  // console.log(reviewData)
  if (reviewExistOrNot) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already reviewed')
  }
  const result = await prisma.reviewsRating.create({
    data: reviewData,
  })
  return result
}

export const ReviewRatingService = { insertReview }
