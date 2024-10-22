import { PrismaClient } from '@prisma/client'

export const getAllCategories = async (
  {
    name = '',
  }: {
    name?: string
  },
  prisma: PrismaClient
) => {
  return await prisma.category.findMany({
    where: {
      name: name
        ? {
            contains: name,
          }
        : undefined,
    },
    orderBy: {
      usage: 'desc',
    },
    take: 5,
  })
}

export const getCategory = async (
  { id }: { id: string },
  prisma: PrismaClient
) => {
  return await prisma.category.findUnique({
    where: {
      id,
    },
  })
}

export const createCategory = async (
  { name, icon }: { name: string; icon?: string },
  prisma: PrismaClient
) => {
  return await prisma.category.create({
    data: {
      name,
      icon,
    },
  })
}

export const editCategory = async (
  id: string,
  { name, icon }: { name?: string; icon?: string },
  prisma: PrismaClient
) => {
  return await prisma.category.update({
    where: {
      id,
    },
    data: {
      name,
      icon,
    },
  })
}

export const updateCategory = async (
  id: string,
  prisma: PrismaClient,
  increment: number = 1
) => {
  return await prisma.category.update({
    where: {
      id,
    },
    data: {
      usage: {
        increment: increment,
      },
    },
  })
}

export const updateManyCategories = async (
  incrementData: {
    id: string
    increment: number
  }[],
  prisma: PrismaClient
) => {
  const ids = incrementData.map(cat => cat.id)
  const existingIds = await prisma.category.findMany({
    where: {
      id: { in: ids },
    },
    select: { id: true },
  })

  const foundIds = existingIds.map(cat => cat.id)

  const { query, params } = generateQueryAndParamsForCategoryUsageUpdate(
    incrementData.filter(cat => foundIds.includes(cat.id))
  )
  return await prisma.$executeRawUnsafe(query, ...params.flat())
}

export const deleteCategory = async (
  { id }: { id: string },
  prisma: PrismaClient
) => {
  return await prisma.category.delete({
    where: {
      id,
    },
  })
}

export const generateQueryAndParamsForCategoryUsageUpdate = (
  incrementData: {
    id: string
    increment: number
  }[]
) => {
  let query = 'UPDATE "Category" SET "usage" = "usage" + CASE '
  incrementData.forEach(({ id, increment }, index) => {
    query += `WHEN "id" = $${2 * index + 2} THEN $${2 * index + 1} `
  })
  query += 'ELSE 0 END WHERE "id" IN ('
  query += incrementData.map((_, index) => `$${2 * index + 2}`).join(', ')
  query += ');'

  let params = incrementData.map(data => [data.increment, data.id])
  return { query, params }
}
