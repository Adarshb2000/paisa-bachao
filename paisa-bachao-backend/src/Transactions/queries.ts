import { PrismaClient } from '@prisma/client'
import { updateMultipleAccountsBalances } from '../Accounts/queries'
import { HTTPError } from '../Error/HTTPError'
import {
  amountFilter,
  amountRangeFilter,
  dateFilter,
  getBalanceUpdatesFromTransactions,
  getEditBalanceUpdate,
  nestedAccountFilter,
} from './queryHelpers'
import {
  CreateTransactionProps,
  EditTransactionProps,
  FiterProps,
} from './types'

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

    return createdTransaction
  })

  return createdTransaction
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
      temporalStamp: 'asc',
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
    })
    if (!oldTransaction)
      throw new HTTPError(`No transaction with id: ${id} found!`, 400)

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

    const updatedTransaction = await prisma.transaction.update({
      where: {
        id,
      },
      data: {
        ...transaction,
      },
    })

    await updateMultipleAccountsBalances(balanceUpdates, prisma as PrismaClient)

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
        transactionFragments: true,
      },
    })

    if (transaction) {
      await updateMultipleAccountsBalances(
        getBalanceUpdatesFromTransactions(transaction.transactionFragments),
        prisma as PrismaClient
      )

      return await prisma.transaction.delete({
        where: {
          id,
        },
        include: {
          transactionFragments: true,
        },
      })
    }
  })

  return deletedTransaction
}
