import { User } from '@prisma/client'
import bcrypt from 'bcrypt'
import prisma from '../../../shared/prisma'
import config from '../../../config'
import ApiError from '../../../errors/ApiError'
import httpStatus from 'http-status'
import { IPaginationOptions } from '../../../interfaces/pagination'
import { paginationHelpers } from '../../../helpers/paginationHelper'
import { userSearchableFields } from './user.constant'
import { HandleSearchRole } from './user.utils'

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

const getAllUser = async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  filters: any,
  options: IPaginationOptions,
  role: string,
) => {
  const { limit, page, skip } = paginationHelpers.calculatePagination(options)
  const { searchTerm, ...filtersData } = filters

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

  if (role === 'ADMIN') {
    return await HandleSearchRole(
      'ADMIN',
      whereConditions,
      page,
      skip,
      limit,
      options,
    )
  } else if (role === 'SUPER_ADMIN') {
    return await HandleSearchRole(
      'SUPER_ADMIN',
      whereConditions,
      page,
      skip,
      limit,
      options,
    )
  }
  //   const result = await prisma.user.findMany({
  //     where: { ...whereConditions },
  //     skip,
  //     take: limit,
  //     orderBy:
  //       options.sortBy && options.sortOrder
  //         ? {
  //             [options.sortBy]: options.sortOrder,
  //           }
  //         : {
  //             createdAt: 'desc',
  //           },
  //   })

  //   const total = await prisma.user.count()

  //   return {
  //     meta: {
  //       total,
  //       page,
  //       limit,
  //     },
  //     data: result,
  //   }
  // }
}

export const getAllAdmin = async () => {
  const result = await prisma.user.findMany({
    where: {
      role: 'ADMIN',
    },
  })
  return result
}

const getSingleUser = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  })
  return result
}

const updateSingleUser = async (
  id: string,
  role: string,
  payload: Partial<User>,
) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { email, ...others } = payload

  if (others.password) {
    const hashPassword = await bcrypt.hash(
      others.password,
      Number(config.bcrypt_salt_rounds),
    )
    others['password'] = hashPassword
  }

  if (role !== 'SUPER_ADMIN') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please remove the role')
  }
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: others,
  })
  return result
}
const deleteUser = async (id: string) => {
  const result = await prisma.user.delete({
    where: {
      id,
    },
  })
  return result
}

const getMyProfile = async (id: string) => {
  const result = await prisma.user.findUnique({
    where: {
      id,
    },
  })
  return result
}

const updateMyProfile = async (id: string, data: Partial<User>) => {
  const isUserExist = await prisma.user.findUnique({
    where: {
      id,
    },
  })
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not exist')
  }
  if (data?.password) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      'Please remove the password field',
    )
  }
  if (data?.role) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please remove the role field')
  }
  if (data?.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Please remove the email field')
  }
  const updateProfile = await prisma.user.update({
    where: {
      id,
    },
    data,
  })
  return updateProfile
}

export const UserService = {
  createUser,
  getAllUser,
  getSingleUser,
  updateSingleUser,
  deleteUser,
  getMyProfile,
  updateMyProfile,
  getAllAdmin,
}
