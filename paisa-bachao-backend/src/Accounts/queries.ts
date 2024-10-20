import { Decimal } from '@prisma/client/runtime/library'
import { HTTPError } from '../Error/HTTPError'
import { BalanceUpdate } from '../Transactions/types'
import { PrismaClient } from '@prisma/client'

export const createAccount = async (
  {
    name,
    balance,
    accountGroupID,
  }: {
    name: string
    balance?: number
    accountGroupID?: string
  },
  prisma: PrismaClient
) => {
  if (!name) throw new HTTPError('Invalid input: Name is required.', 400)

  const account = await prisma.account.create({
    data: {
      name,
      balance: new Decimal(balance || 0),
      accountGroup: accountGroupID
        ? {
            connect: {
              id: accountGroupID,
            },
          }
        : undefined,
    },
    include: {
      accountGroup: true,
    },
  })
  return account
}

export const getAccountByID = async (
  {
    id,
  }: {
    id: string
  },
  prisma: PrismaClient
) => {
  if (!id) throw new HTTPError('Invalid input: ID is required.', 400)

  const account = await prisma.account.findUnique({
    where: {
      id,
    },
    include: {
      accountGroup: true,
    },
  })
  if (!account)
    throw new HTTPError(`Invalid input: Account with ID ${id} not found!`, 404)

  return account
}

export const getAccounts = async (
  {
    name = '',
    page = 1,
    pageSize,
    singles = true,
  }: {
    name?: string
    page?: number
    pageSize?: number
    singles?: boolean
  },
  prisma: PrismaClient
) => {
  const accounts = await prisma.account.findMany({
    where: {
      name: name
        ? {
            contains: name,
            mode: 'insensitive',
          }
        : undefined,
      accountGroupID: singles ? undefined : { not: null },
    },
    skip: (page - 1) * (pageSize || 0),
    take: pageSize ? pageSize : undefined,
    include: {
      accountGroup: true,
      _count: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })
  return accounts
}

export const getAccountsWithGroups = async (
  {
    name = '',
    accounts = false,
    page = 1,
    pageSize = 10,
  }: {
    name?: string
    accounts?: boolean
    page?: number
    pageSize?: number
  },
  prisma: PrismaClient
) => {
  const accountGroups = await prisma.accountGroup.findMany({
    where: {
      OR: name
        ? [
            {
              name: {
                contains: name,
                mode: 'insensitive',
              },
            },
            {
              accounts: accounts
                ? {
                    some: {
                      name: {
                        contains: name,
                        mode: 'insensitive',
                      },
                    },
                  }
                : undefined,
            },
          ]
        : undefined,
    },
    include: {
      accounts: {
        orderBy: {
          updatedAt: 'desc',
        },
      },
      _count: true,
    },
    take: pageSize,
    skip: (page - 1) * pageSize,
  })
  return accountGroups
}

export const getAccountsByGroup = async (
  {
    accountGroupID,
    name = '',
    page = 1,
    pageSize,
  }: {
    accountGroupID: string
    name?: string
    page?: number
    pageSize?: number
  },
  prisma: PrismaClient
) => {
  if (!accountGroupID)
    throw new HTTPError('Invalid input: Account Group ID is required.', 400)

  const accountGroup = await prisma.accountGroup.findUnique({
    where: {
      id: accountGroupID,
    },
    include: {
      accounts: {
        where: {
          name: {
            contains: name,
            mode: 'insensitive',
          },
        },
        include: {
          accountGroup: true,
          _count: true,
        },
        skip: (page - 1) * (pageSize || 0),
        take: pageSize,
      },
    },
  })
  return accountGroup?.accounts || []
}

export const getAccountGroupByID = async (
  {
    id,
  }: {
    id: string
  },
  prisma: PrismaClient
) => {
  if (!id) throw new HTTPError('Invalid input: ID is required.', 400)

  const accountGroup = await prisma.accountGroup.findUnique({
    where: {
      id,
    },
    include: {
      accounts: true,
    },
  })
  if (!accountGroup)
    throw new HTTPError(
      `Invalid input: Account Group with ID ${id} not found!`,
      404
    )

  return accountGroup
}

export const updateAccountBalance = async (
  {
    id,
    balance,
    initialBalance,
  }: {
    id: string
    balance: number
    initialBalance: number
  },
  prisma: PrismaClient
) => {
  if (!id) throw new HTTPError('Invalid input: ID is required.', 400)
  if (isNaN(balance) || isNaN(initialBalance))
    throw new HTTPError(
      'Invalid input: Balance and Initial balance are required.',
      400
    )

  const account = await prisma.account.update({
    where: {
      id,
    },
    data: {
      balance: new Decimal(balance),
    },
  })
  if (!account)
    throw new HTTPError(`Invalid input: Account with ID ${id} not found!`, 404)

  return account
}

export const updateMultipleAccountsBalances = async (
  balanceUpdates: BalanceUpdate[],
  prisma: PrismaClient
) => {
  if (!balanceUpdates.length) return
  const { query, params } =
    generateQueryAndParamsForBalanceUpdate(balanceUpdates)
  await prisma.$executeRawUnsafe(query, ...params)
}

export const updateAccountGroupMembers = async (
  {
    accountID,
    accountGroupID,
    link = true,
  }: {
    accountID: string
    accountGroupID: string
    link?: boolean
  },
  prisma: PrismaClient
) => {
  if (!accountID)
    throw new HTTPError('Invalid input: Account ID is required.', 400)
  if (!accountGroupID)
    throw new HTTPError('Invalid input: Account Group ID is required.', 400)

  const account = await getAccountByID({ id: accountID }, prisma)
  if (!account)
    throw new HTTPError(
      `Invalid input: Account with id ${accountID} not found`,
      404
    )

  const accountGroup = await prisma.accountGroup.update({
    where: {
      id: accountGroupID,
    },
    data: {
      accounts: {
        [link ? 'connect' : 'disconnect']: {
          id: accountID,
        },
      },
    },
  })
  if (!accountGroup)
    throw new HTTPError(
      `Invalid input: Account Group with id ${accountGroupID} not found!`,
      404
    )
  return accountGroup
}

// HELPERS
export const generateQueryAndParamsForBalanceUpdate = (
  balanceUpdates: BalanceUpdate[]
) => {
  const query =
    balanceUpdates.reduce(
      (currentQuery, _, index) =>
        currentQuery +
        `WHEN a."id" = $${2 * index + 1} THEN $${2 * index + 2} `,
      'UPDATE "Account" a SET "balance" = "balance" + CASE '
    ) +
    `ELSE "balance" END WHERE a."id" IN (${balanceUpdates
      .map((_, index) => `$${2 * index + 1}`)
      .join(', ')});`

  return {
    query,
    params: balanceUpdates.flatMap(({ account, balance }) => [
      account,
      balance,
    ]),
  }
}
