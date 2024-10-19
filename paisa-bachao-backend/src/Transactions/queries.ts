import {
  CreateTransactionProps,
  EditTransactionProps,
  FilterAndSort,
  FiterProps,
} from './types'
import { PrismaClient, Transaction } from '@prisma/client'
import {
  amountFilter,
  amountRangeFilter,
  dateFilter,
  getBalanceUpdatesFromTransactions,
  getEditBalanceUpdate,
  nestedAccountFilter,
} from './queryHelpers'

import { HTTPError } from '../Error/HTTPError'
import { updateManyTags } from '../Tags/queries'
import { updateMultipleAccountsBalances } from '../Accounts/queries'

export const createTransaction = async (
  transaction: CreateTransactionProps,
  prisma: PrismaClient
) => {
  const createdTransaction = await prisma.$transaction(async prisma => {
    const createdTransaction = await prisma.transaction.create({
      data: {
        fromAccountID: transaction.fromAccountID,
        fromName: transaction.fromName,

        toAccountID: transaction.toAccountID,
        toName: transaction.toName,

        amount: transaction.amount,

        description: transaction.description,
        place: transaction.place,
        temporalStamp: transaction.temporalStamp,
        tags: {
          connect: transaction.tags?.map(tag => ({ id: tag })),
        },

        transactionFragments: transaction.transactionFragments
          ? {
              createMany: {
                data: transaction.transactionFragments?.data.map(fragment => ({
                  fromAccountID: fragment.fromAccountID,
                  fromName: fragment.fromName,

                  toAccountID: fragment.toAccountID,
                  toName: fragment.toName,

                  amount: fragment.amount,

                  description: fragment.description,
                  place: fragment.place,
                  temporalStamp: fragment.temporalStamp,
                })),
              },
            }
          : undefined,
      },
      include: {
        transactionFragments: true,
      },
    })

    await updateMultipleAccountsBalances(
      getBalanceUpdatesFromTransactions(
        createdTransaction.transactionFragments.length
          ? createdTransaction.transactionFragments
          : [createdTransaction]
      ),
      prisma as PrismaClient
    )

    // Adding tags to transaction fragments
    for (const fragment of createdTransaction.transactionFragments) {
      await prisma.transaction.update({
        where: {
          id: fragment.id,
        },
        data: {
          tags: {
            connect: transaction.transactionFragments?.data
              .find(transactionFragment =>
                equateTransactions(transactionFragment, fragment)
              )
              ?.tags?.map(tag => ({ id: tag })),
          },
        },
      })
    }

    const tags = new Map<string, number>()
    transaction.tags?.forEach(tag => {
      tags.set(tag, (tags.get(tag) ?? 0) + 1)
    })
    transaction.transactionFragments?.data.forEach(fragment => {
      fragment.tags?.forEach(tag => {
        tags.set(tag, (tags.get(tag) ?? 0) + 1)
      })
    })
    const tagIncrementData = Array.from(tags.entries()).map(
      ([tag, increment]) => ({
        id: tag,
        increment,
      })
    )
    if (tagIncrementData.length > 0) {
      await updateManyTags(tagIncrementData, prisma as PrismaClient)
    }

    return createdTransaction
  })

  return createdTransaction
}

export const getRefinedTransactions = async (
  {
    params,
    page,
    pageSize,
  }: { params: FilterAndSort; page: number; pageSize: number },
  prisma: PrismaClient
) => {
  const { filter = {}, sort = {} } = params ?? { filter: {}, sort: {} }
  console.log(filter, sort)
  const transactions = await prisma.transaction.findMany({
    where: {
      motherTransactionId: null,
      ...filter,
    },
    include: {
      transactionFragments: true,
    },
    orderBy: sort,
    take: pageSize,
    skip: (page - 1) * pageSize,
  })
  return transactions
}

export const getTransactions = async (
  {
    startDate,
    endDate,
    toAccountID,
    fromAccountID,
    account,
    amount,
    amountRange,
    page = 1,
    pageSize = 10,
  }: FiterProps,
  prisma: PrismaClient
) => {
  const transactions = await prisma.transaction.findMany({
    where: {
      motherTransactionId: null,
      AND: [
        dateFilter(startDate, 'start'),
        dateFilter(endDate, 'end'),
        nestedAccountFilter(account, 'to'),
        nestedAccountFilter(account, 'from'),
        nestedAccountFilter(toAccountID, 'to'),
        nestedAccountFilter(fromAccountID, 'from'),
        amountFilter(amount),
        amountRangeFilter(amountRange),
      ],
    },
    include: {
      transactionFragments: true,
    },
    orderBy: {
      temporalStamp: 'desc',
    },
    take: pageSize,
    skip: (page - 1) * pageSize,
  })
  return transactions
}

export const getTransaction = async (
  { id }: { id: string },
  prisma: PrismaClient
) => {
  const transaction = await prisma.transaction.findUnique({
    where: {
      id,
    },
    include: {
      transactionFragments: true,
    },
  })
  return transaction
}

export const editTransaction = async (
  id: string,
  transaction: EditTransactionProps,
  prisma: PrismaClient
) => {
  const updatedTransaction = await prisma.$transaction(async prisma => {
    const oldTransaction = await prisma.transaction.findUnique({
      where: {
        id,
      },
      include: {
        tags: true,
      },
    })
    if (!oldTransaction)
      throw new HTTPError(`No transaction with id: ${id} found!`, 400)

    const { tags: newTags, ...rest } = transaction

    const updatedTransaction = await prisma.transaction.update({
      where: {
        id,
      },
      data: {
        ...rest,
        tags: {
          connect: newTags?.map(tag => ({ id: tag })),
        },
      },
    })

    const balanceUpdates = [
      ...getEditBalanceUpdate({
        oldTransaction,
        amount: transaction.amount,
        accountID: transaction.fromAccountID,
        name: transaction.fromName,
        type: 'from',
      }),
      ...getEditBalanceUpdate({
        oldTransaction,
        amount: transaction.amount,
        accountID: transaction.toAccountID,
        name: transaction.toName,
        type: 'to',
      }),
    ]

    await updateMultipleAccountsBalances(balanceUpdates, prisma as PrismaClient)

    const tags = new Map<string, number>()
    transaction.tags?.forEach(tag => {
      tags.set(tag, (tags.get(tag) ?? 0) + 1)
    })
    oldTransaction.tags?.forEach(tag => {
      tags.set(tag.id, (tags.get(tag.id) ?? 0) - 1)
      if (tags.get(tag.id) === 0) tags.delete(tag.id)
    })
    const tagIncrementData = Array.from(tags.entries()).map(
      ([tag, increment]) => ({
        id: tag,
        increment,
      })
    )
    if (tagIncrementData.length > 0) {
      await updateManyTags(tagIncrementData, prisma as PrismaClient)
    }

    return updatedTransaction
  })

  return updatedTransaction
}

export const deleteTransaction = async (id: string, prisma: PrismaClient) => {
  const deletedTransaction = await prisma.$transaction(async prisma => {
    const transaction = await prisma.transaction.findUnique({
      where: {
        id,
      },
      include: {
        transactionFragments: {
          include: {
            tags: {
              select: {
                id: true,
              },
            },
          },
        },
        tags: {
          select: {
            id: true,
          },
        },
      },
    })

    if (!transaction) throw new HTTPError('Something went wrong', 400)

    await updateMultipleAccountsBalances(
      getBalanceUpdatesFromTransactions(
        transaction.transactionFragments.length
          ? transaction.transactionFragments
          : [transaction]
      ).map(({ account, balance }) => ({ account, balance: -balance })),
      prisma as PrismaClient
    )

    const tags = new Map<string, number>()
    transaction.tags?.forEach(tag => {
      tags.set(tag.id, (tags.get(tag.id) ?? 0) - 1)
    })
    transaction.transactionFragments?.forEach(fragment => {
      fragment.tags?.forEach(tag => {
        tags.set(tag.id, (tags.get(tag.id) ?? 0) - 1)
      })
    })
    const tagDecrementData = Array.from(tags.entries()).map(
      ([id, increment]) => ({
        id,
        increment,
      })
    )
    if (tagDecrementData.length > 0) {
      await updateManyTags(tagDecrementData, prisma as PrismaClient)
    }

    return await prisma.transaction.delete({
      where: {
        id,
      },
      include: {
        transactionFragments: true,
      },
    })
  })

  return deletedTransaction
}

const equateTransactions = (
  a: Transaction | CreateTransactionProps,
  b: Transaction | CreateTransactionProps
) =>
  a.fromName === b.fromName && a.toName === b.toName && +a.amount === +b.amount
