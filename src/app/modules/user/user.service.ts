import { User } from '@prisma/client'
import bcrypt from 'bcrypt'
import prisma from '../../../shared/prisma'
import config from '../../../config'

const createUser = async (data: User) => {
  //   console.log(data, 'checking data')
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

export const UserService = { createUser }
