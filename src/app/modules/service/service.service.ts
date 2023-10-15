import { paginationHelpers } from '../../../helpers/paginationHelper'
import { IPaginationOptions } from '../../../interfaces/pagination'
import prisma from '../../../shared/prisma'
import { serviceSearchableFields } from './service.constant'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createService = async (data: any) => {
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

export const InteriorService = {
  createService,
  getAllServices,
}
