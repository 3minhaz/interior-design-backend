import { Service } from '@prisma/client'
import { paginationHelpers } from '../../../helpers/paginationHelper'
import { IPaginationOptions } from '../../../interfaces/pagination'
import prisma from '../../../shared/prisma'
import { serviceSearchableFields } from './service.constant'
import ApiError from '../../../errors/ApiError'
import httpStatus from 'http-status'

const createService = async (data: Service) => {
  const result = await prisma.service.create({
    data,
  })
  return result
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllServices = async (filters: any, options: IPaginationOptions) => {
  const { page, limit, skip } = paginationHelpers.calculatePagination(options)
  const { searchTerm, ...filtersData } = filters
  const andConditions = []

  if (searchTerm) {
    andConditions.push({
      OR: serviceSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    })
  }

  if (Object.keys(filtersData).length > 0) {
    andConditions.push({
      AND: Object.keys(filtersData).map(field => {
        if (field === 'minPrice' && filtersData.minPrice) {
          return {
            price: {
              gte: parseFloat(filtersData.minPrice),
            },
          }
        } else if (field === 'maxPrice' && filtersData.maxPrice) {
          return {
            price: {
              lte: parseFloat(filtersData.maxPrice),
            },
          }
        } else {
          return {
            [field]: {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              equals: (filtersData as any)[field],
            },
          }
        }
      }),
    })
  }

  const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {}

  const result = await prisma.service.findMany({
    where: whereConditions,
    skip,
    take: limit,
    include: { reviewsRatings: true },
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: 'desc',
          },
  })

  const total = await prisma.service.count({ where: whereConditions })

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  }
}

const getSingleService = async (id: string) => {
  const result = await prisma.service.findUnique({
    where: {
      id,
    },
    include: { reviewsRatings: true },
  })
  return result
}

const getByCategory = async () => {
  const uniqueCategories = await prisma.service.findMany({
    distinct: ['category'],
    select: {
      category: true,
    },
  })

  const uniqueCategoryData = []

  for (const categoryInfo of uniqueCategories) {
    const result = await prisma.service.findFirst({
      where: {
        category: categoryInfo.category,
      },
    })

    if (result) {
      uniqueCategoryData.push(result)
    }
  }

  return uniqueCategoryData
}

const updateSingleService = async (id: string, payload: Partial<Service>) => {
  const result = await prisma.service.update({
    where: {
      id,
    },
    include: { reviewsRatings: true },
    data: payload,
  })
  return result
}

const deleteSingleService = async (id: string) => {
  const bookingOrNot = await prisma.booking.findFirst({
    where: {
      serviceId: id,
    },
  })
  if (bookingOrNot) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "You can't delete this service, as this service already booking information",
    )
  }
  const result = await prisma.service.delete({
    where: {
      id,
    },
  })
  return result
}

export const InteriorService = {
  createService,
  getAllServices,
  getSingleService,
  updateSingleService,
  deleteSingleService,
  getByCategory,
}
