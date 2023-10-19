import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import prisma from '../../../shared/prisma'

const findReview = async (id: string, serviceId: string) => {
  const reviewExistOrNot = await prisma.reviewsRating.findFirst({
    where: {
      serviceId,
      userId: id,
    },
  })
  // if (reviewExistOrNot) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, 'User already reviewed')
  // }
  return reviewExistOrNot ? true : false
}

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
  if (reviewExistOrNot) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already reviewed')
  }

  reviewData['userId'] = id
  reviewData['serviceId'] = serviceId
  const result = await prisma.reviewsRating.create({
    data: reviewData,
  })
  return result
}

export const ReviewRatingService = { insertReview, findReview }
