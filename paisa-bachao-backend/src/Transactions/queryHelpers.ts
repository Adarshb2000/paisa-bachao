import { Account, Transaction } from '@prisma/client'
import { BalanceUpdate, CreateTransactionProps } from './types'
import { Decimal } from '@prisma/client/runtime/library'

export const dateFilter = (
  date: Date | null | undefined,
  type: 'start' | 'end'
) =>
  date
    ? {
        temporalStamp: {
          [type === 'start' ? 'gte' : 'lte']: date,
        },
      }
    : {}

export const accountFilter = (
  search: string | null | undefined,
  type: 'to' | 'from'
) =>
  search
    ? {
        [type]: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      }
    : {}

export const nestedAccountFilter = (
  search: string | null | undefined,
  type: 'to' | 'from'
) =>
  search
    ? {
        OR: [
          accountFilter(search, type),
          {
            transactionFragments: {
              some: accountFilter(search, type),
            },
          },
        ],
      }
    : {}

export const amountFilter = (amount: number | undefined) =>
  amount !== undefined
    ? {
        amount,
      }
    : {}

export const amountRangeFilter = (amountRange: [number, number] | undefined) =>
  amountRange
    ? {
        amount: {
          gte: amountRange[0],
          lte: amountRange[1],
        },
      }
    : {}

export const getBalanceUpdatesFromTransactions = (
  transactions: {
    fromAccountID?: string | null
    toAccountID?: string | null
    amount: Decimal
  }[]
) => {
  const balanceUpdates: {
    [account: string]: number
  } = {}
  transactions.forEach(({ fromAccountID, toAccountID, amount }) => {
    if (fromAccountID)
      balanceUpdates[fromAccountID] =
        (balanceUpdates[fromAccountID] || 0) - +amount

    if (toAccountID)
      balanceUpdates[toAccountID] = (balanceUpdates[toAccountID] || 0) + +amount
  })
  return Object.entries(balanceUpdates).map(([account, balance]) => ({
    account,
    balance,
  }))
}

export const isValidAmount = (amount: string | undefined) =>
  amount && !isNaN(+amount) && +amount > 0

export const getEditBalanceUpdate = ({
  oldTransaction,
  amount,
  name,
  accountID,
  type,
}: {
  oldTransaction: Transaction
  amount: number | undefined
  name: string | undefined
  accountID: string | undefined
  type: 'to' | 'from'
}) => {
  const balanceUpdates: BalanceUpdate[] = []
  const multiplier = type === 'from' ? -1 : 1
  if (!amount && !name) return balanceUpdates
  if (!amount || +oldTransaction.amount === +amount) {
    if (!name || oldTransaction[`${type}Name`] === name) return []
    oldTransaction[`${type}AccountID`] &&
      balanceUpdates.push({
        account: oldTransaction[`${type}AccountID`]!,
        balance: +oldTransaction.amount * -multiplier,
      })
    accountID &&
      balanceUpdates.push({
        account: accountID!,
        balance: +oldTransaction.amount * multiplier,
      })
  } else {
    if (!name || oldTransaction[`${type}Name`] === name)
      oldTransaction[`${type}AccountID`] &&
        balanceUpdates.push({
          account: oldTransaction[`${type}AccountID`]!,
          balance: (+amount - +oldTransaction.amount) * multiplier,
        })
    else {
      oldTransaction[`${type}AccountID`] &&
        balanceUpdates.push({
          account: oldTransaction[`${type}AccountID`]!,
          balance: +oldTransaction.amount * -multiplier,
        })
      accountID &&
        balanceUpdates.push({
          account: accountID!,
          balance: +amount * multiplier,
        })
    }
  }
  return balanceUpdates
}

// Secondary query
// prisma.$queryRaw`
//   WITH
//     -- Gathering all the transactions that are part of the mother transaction
//     Transactions AS (
//         SELECT "from", "to", amount
//         FROM "Transaction"
//         WHERE "motherTransactionId" = ${createdTransaction.id}
//     ),

//     -- Calculating the balance change for each account
//     UpdatedBalances AS (
//         SELECT account_id, SUM(
//                 CASE
//                     WHEN type = 'from' THEN - amount
//                     ELSE amount
//                 END
//             ) AS balance_change
//         FROM (
//                 SELECT
//                     "from" AS account_id, 'from' AS type, amount
//                 FROM Transactions
//                 UNION ALL
//                 SELECT "to" AS account_id, 'to' AS type, amount
//                 FROM Transactions
//             ) t
//         GROUP BY
//             account_id
//     )
//     UPDATE "Account" a
//     SET
//         "balance" = "balance" + ub.balance_change
//     FROM UpdatedBalances ub
//     WHERE
//     a."id" = ub."account_id";
// `
