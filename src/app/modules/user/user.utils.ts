import prisma from '../../../shared/prisma'

export const HandleSearchRole = async (
  role: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  whereConditions: any,
  page: number,
  skip: number,
  limit: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any,
) => {
  //   if (role === 'ADMIN') {
  const result = await prisma.user.findMany({
    where:
      role === 'ADMIN'
        ? { ...whereConditions, role: 'CUSTOMER' }
        : whereConditions,
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
  //   }
}
