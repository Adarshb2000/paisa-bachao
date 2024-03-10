import { Transaction } from '@prisma/client'
import prisma from '.'
import { choice, randomNumber, randomWord } from '../Helpers/random'
import { createTransaction } from '../Transactions/queries'

export const generateDummyAccounts = async (count: number = 10) => {
  const accounts = []
  for (let i = 0; i < count; i++) {
    accounts.push({
      name: randomWord(5),
      balance: 0,
    })
  }
  return await prisma.account.createMany({
    data: accounts,
  })
}

export const generateDummyAccountGroups = async (count: number = 10) => {
  const accountGroups = []
  for (let i = 0; i < count; i++) {
    accountGroups.push({
      name: randomWord(),
    })
  }
  return await prisma.accountGroup.createMany({
    data: accountGroups,
  })
}

export const generateDummyTransactions = async (count: number = 10) => {
  const transactions: Transaction[] = []
  const accounts = await prisma.account.findMany()

  for (let i = 0; i < count; i++) {
    const fromAccout = choice(accounts)
    let toAccount = choice(accounts)
    if (toAccount.id === fromAccout.id) {
      toAccount = { name: randomWord(5) }
    }

    transactions.push(
      await createTransaction({
        fromAccountID: fromAccout.id,
        toAccountID: toAccount.id,
        fromName: fromAccout.name,
        toName: toAccount.name,
        amount: randomNumber(100),
        description: randomWord(),
        place: randomWord(),
        temporalStamp: new Date(),
      })
    )
  }
  return transactions
}
