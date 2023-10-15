import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createService = async (data: any) => {
  const result = await prisma.service.create({
    data,
  })
  return result
}

export const InteriorService = {
  createService,
}
