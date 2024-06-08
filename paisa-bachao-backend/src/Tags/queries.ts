import { PrismaClient } from '@prisma/client'

export const getAllTags = async (
  {
    name = '',
    color = '',
  }: {
    name?: string
    color?: string
  },
  prisma: PrismaClient
) => {
  return await prisma.tag.findMany({
    where: {
      OR: [
        {
          name: name
            ? {
                contains: name,
              }
            : undefined,
        },
        {
          color: color
            ? {
                contains: color,
              }
            : undefined,
        },
      ],
    },
    orderBy: {
      usage: 'desc',
    },
  })
}

export const getTag = async ({ id }: { id: string }, prisma: PrismaClient) => {
  return await prisma.tag.findUnique({
    where: {
      id,
    },
  })
}

export const createTag = async (
  { name, color, icon }: { name: string; color: string; icon?: string },
  prisma: PrismaClient
) => {
  return await prisma.tag.create({
    data: {
      name,
      color,
      icon,
    },
  })
}

export const editTag = async (
  id: string,
  { name, color, icon }: { name?: string; color?: string; icon?: string },
  prisma: PrismaClient
) => {
  return await prisma.tag.update({
    where: {
      id,
    },
    data: {
      name,
      color,
      icon,
    },
  })
}

export const updateTag = async (
  id: string,
  prisma: PrismaClient,
  increment: number = 1
) => {
  return await prisma.tag.update({
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

export const updateManyTags = async (
  incrementData: {
    id: string
    increment: number
  }[],
  prisma: PrismaClient
) => {
  const { query, params } =
    generateQueryAndParamsForTagUsageUpdate(incrementData)
  return await prisma.$executeRawUnsafe(query, ...params.flat())
}

export const deleteTag = async (
  { id }: { id: string },
  prisma: PrismaClient
) => {
  return await prisma.tag.delete({
    where: {
      id,
    },
  })
}

const generateQueryAndParamsForTagUsageUpdate = (
  incrementData: {
    id: string
    increment: number
  }[]
) => {
  let query = 'UPDATE "Tag" SET "usage" = "usage" + CASE '
  incrementData.forEach(({ id, increment }, index) => {
    query += `WHEN "id" = $${2 * index + 2} THEN $${2 * index + 1} `
  })
  query += 'ELSE 0 END WHERE "id" IN ('
  query += incrementData.map((_, index) => `$${2 * index + 2}`).join(', ')
  query += ');'

  let params = incrementData.map(data => [data.increment, data.id])
  return { query, params }
}
