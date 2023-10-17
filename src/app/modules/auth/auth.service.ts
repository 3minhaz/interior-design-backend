import httpStatus from 'http-status'
import ApiError from '../../../errors/ApiError'
import prisma from '../../../shared/prisma'
import bcrypt from 'bcrypt'
import { ILoginUser } from './auth.interface'
import { jwtHelpers } from '../../../helpers/jwtHelpers'
import config from '../../../config'
import { Secret } from 'jsonwebtoken'

const loginUser = async (data: ILoginUser) => {
  const user = await prisma.user.findFirst({
    where: {
      email: data.email,
    },
  })
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }
  const userPassword = user.password
  const givenPassword = data.password
  const isPasswordMatched = await bcrypt.compare(givenPassword, userPassword)
  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password does not matched')
  }
  const JwtPayloadData = {
    id: user.id,
    role: user.role,
  }
  const accessToken = jwtHelpers.createToken(
    JwtPayloadData,
    config.jwt.secret!,
    config.jwt.expires_in!,
  )
  const refreshToken = jwtHelpers.createToken(
    JwtPayloadData,
    config.jwt.refresh_secret!,
    config.jwt.refresh_expires_in!,
  )
  return {
    accessToken,
    refreshToken,
  }
}

const addAdmin = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  })
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }
  const updateUserRole = await prisma.user.update({
    where: {
      email: user?.email,
    },
    data: {
      role: 'ADMIN',
    },
  })
  return updateUserRole
}

const refreshToken = async (token: string) => {
  let verifiedToken = null
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret,
    )
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token')
  }

  const { id } = verifiedToken

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  })
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist')
  }

  //generate new token

  const newAccessToken = jwtHelpers.createToken(
    {
      id: user.id,
      role: user.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string,
  )

  return {
    accessToken: newAccessToken,
  }
}

const changePassword = async (
  id: string,
  previousPassword: string,
  newPassword: string,
) => {
  const isExist = await prisma.user.findUnique({
    where: {
      id,
    },
  })
  if (!isExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found!')
  }
  const userPassword = isExist.password
  // const givenPassword = data.password
  const isPasswordMatched = await bcrypt.compare(previousPassword, userPassword)
  if (!isPasswordMatched) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password not matched')
  }

  const bcryptPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds) as number,
  )
  const result = await prisma.user.update({
    where: {
      id,
    },
    data: {
      password: bcryptPassword,
    },
  })
  return result
}

export const AuthService = { loginUser, addAdmin, refreshToken, changePassword }
