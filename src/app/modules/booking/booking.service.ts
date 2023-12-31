import { Booking, BookingStatus } from '@prisma/client'
import prisma from '../../../shared/prisma'
import ApiError from '../../../errors/ApiError'
import httpStatus from 'http-status'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { bookingSearchableFields } from './booking.constant'
import { paginationHelpers } from '../../../helpers/paginationHelper'

const createBooking = async (data: Booking) => {
  const checkAlreadyBookDate = await prisma.booking.findFirst({
    where: {
      date: data.date,
    },
  })

  if (checkAlreadyBookDate) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'On this day book already confirmed',
    )
  }

  const result = await prisma.booking.create({
    data,
    include: {
      service: true,
      user: true,
    },
  })
  return result
}

const getAllBooking = async (
  user: { role: string; id: string },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters: any,
  options: IPaginationOptions,
) => {
  const { searchTerm, ...filtersData } = filters
  const { page, limit, skip } = paginationHelpers.calculatePagination(options)
  const { role, id } = user
  const andConditions = []
  if (searchTerm) {
    andConditions.push({
      OR: bookingSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    })
  }

  const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {}

  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      AND: Object.keys(filtersData).map(key => ({
        [key]: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          equals: (filtersData as any)[key],
        },
      })),
    })
  }
  if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
    const result = await prisma.booking.findMany({
      include: {
        user: true,
        service: true,
      },
      where: whereConditions,
      skip,
      take: limit,
      orderBy:
        options.sortBy && options.sortOrder
          ? { [options.sortBy]: options.sortOrder }
          : {
              createdAt: 'desc',
            },
    })
    const total = await prisma.booking.count({
      where: whereConditions,
    })

    return {
      meta: {
        total,
        page,
        limit,
      },
      data: result,
    }
  } else if (role === 'CUSTOMER') {
    const result = await prisma.booking.findMany({
      where: {
        user: {
          id,
        },
      },
      include: {
        user: true,
        service: true,
      },
      skip,
      take: limit,
      orderBy:
        options.sortBy && options.sortOrder
          ? { [options.sortBy]: options.sortOrder }
          : {
              createdAt: 'desc',
            },
    })
    return {
      meta: {
        total: result.length,
        page,
        limit,
      },
      data: result,
    }
  }
}

const getSingleBooking = async (id: string) => {
  const result = await prisma.booking.findUnique({
    where: {
      id,
    },
    include: {
      user: true,
      service: true,
    },
  })
  return result
}

const updateBookingStatus = async (
  id: string,
  status: string,
  date: string,
) => {
  const findBooking = await prisma.booking.findFirst({
    where: {
      id,
    },
    include: {
      user: true,
      service: true,
    },
  })
  console.log(date)
  if (status || date.length > 0) {
    // if (
    //   findBooking?.bookingStatus === 'confirm' ||
    //   (findBooking?.bookingStatus === 'cancel' && status === 'pending')
    // ) {
    //   throw new ApiError(
    //     httpStatus.BAD_REQUEST,
    //     'only able to change the status from pending to confirm or cancel',
    //   )
    // }

    return await prisma.booking.update({
      where: { id },
      data: {
        bookingStatus: status ? (status as BookingStatus) : 'pending',
        date: date ? date : findBooking?.date,
      },
    })
  }
  //  else {
  //   throw new ApiError(
  //     httpStatus.BAD_REQUEST,
  //     'only able to change the status from pending to confirm or cancel',
  //   )
  // }
  // }
}

const deleteBooking = async (id: string) => {
  const result = await prisma.booking.delete({
    where: { id },
  })
  return
  result
}

export const BookingService = {
  createBooking,
  getAllBooking,
  getSingleBooking,
  updateBookingStatus,
  deleteBooking,
}
