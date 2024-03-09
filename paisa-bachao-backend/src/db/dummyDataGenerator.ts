import prisma from '.'
import { choice, randomNumber, randomWord } from '../Helpers/random'

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
  console.log(accountGroups)
  return await prisma.accountGroup.createMany({
    data: accountGroups,
  })
}

export const generateDummyTransactions = async (count: number = 10) => {
  const transactions = []
  const accounts = await prisma.account.findMany()

  for (let i = 0; i < count; i++) {
    const fromAccountID = choice(accounts).id
    let toAccountID = choice(accounts).id
    while (toAccountID === fromAccountID) {
      toAccountID = choice(accounts).id
    }
    transactions.push({
      fromAccountID,
      toAccountID,
      amount: randomNumber(100),
      description: randomWord(),
      place: randomWord(),
      temporalStamp: new Date(),
    })
  }
  return await prisma.transaction.createMany({
    data: transactions,
  })
}
