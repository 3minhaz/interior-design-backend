import { User } from '@prisma/client'
import bcrypt from 'bcrypt'
import prisma from '../../../shared/prisma'
import config from '../../../config'
import ApiError from '../../../errors/ApiError'
import httpStatus from 'http-status'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { paginationHelpers } from '../../../helpers/paginationHelper'
import { userSearchableFields } from './user.constant'

const createUser = async (data: User) => {
  if (data.role && (data.role === 'ADMIN' || data.role === 'SUPER_ADMIN')) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please remove the user role')
  }

  const isUserExist = await prisma.user.findFirst({
    where: {
      email: data.email,
    },
  })

  if (isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User already exist')
  }

  const hashPassword = await bcrypt.hash(
    data.password,
    Number(config.bcrypt_salt_rounds),
  )
  data['password'] = hashPassword

  const result = await prisma.user.create({
    data,
  })
  return result
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllUser = async (filters: any, options: IPaginationOptions) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options)
  const { searchTerm, ...filtersData } = filters
  console.log(filters)
  const andConditions = []

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map(field => ({
        [field]: {
          contains: searchTerm,
          mode: 'insensitive',
        },
      })),
    })
  }

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

  const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {}

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: 'desc',
          },
  })

  const total = await prisma.user.count()

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  }
}

const getSingleUser = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  })
  return result
}

const updateSingleUser = async (id: string, payload: Partial<User>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { email, ...others } = payload

  if (others.password) {
    const hashPassword = await bcrypt.hash(
      others.password,
      Number(config.bcrypt_salt_rounds),
    )
    others['password'] = hashPassword
  }

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: others,
  })
  return result
}

export const UserService = {
  createUser,
  getAllUser,
  getSingleUser,
  updateSingleUser,
}
