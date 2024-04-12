import { Transaction } from '@prisma/client'
import prisma from '.'
import { choice, randomNumber, randomWord } from '../Helpers/random'
import { faker } from '@faker-js/faker'

const users = [
  '87659171-2796-44ab-80cd-3b7bcc2c21ce',
  '3f6535d8-aea7-4045-a56c-2899e2b0396b',
]

export const generateDummyAccounts = async (count: number = 10) => {
  const accounts = []
  for (let i = 0; i < count; i++) {
    accounts.push({
      name: faker.person.firstName(),
      balance: 0,
      userID: choice(users),
    })
  }
  return await prisma.account.createMany({
    data: accounts,
  })
}

export const generateDummyAccountGroups = async (count: number = 3) => {
  const accountGroups = []
  for (let i = 0; i < count; i++) {
    accountGroups.push({
      name: faker.finance.accountName(),
      userID: choice(users),
    })
  }
  await prisma.accountGroup.createMany({
    data: accountGroups,
    skipDuplicates: true,
  })
  const createdAccountGroups = await prisma.accountGroup.findMany()
  const accounts = await prisma.account.findMany()
  for (let i = 0; i < randomNumber(accounts.length); i += 1) {
    const account = choice(accounts)
    if (account.accountGroupID) continue
    const accountGroup = choice(createdAccountGroups)
    if (account.userID !== accountGroup?.userID) continue

    await prisma.account.update({
      where: {
        id: account.id,
      },
      data: {
        accountGroupID: accountGroup.id,
      },
    })
  }
}

export const generateDummyTransactions = async (count: number = 50) => {
  const transactions: Transaction[] = []
  const accounts = await prisma.account.findMany()

  for (let i = 0; i < count; i++) {
    const fromAccout = choice(accounts)
    let toAccount = choice(accounts)
    if (
      toAccount.id === fromAccout.id ||
      toAccount.userID !== fromAccout.userID
    ) {
      toAccount = { name: randomWord(5) } as typeof toAccount
    }

    const transaction = await prisma.transaction.create({
      data: {
        fromAccountID: fromAccout.id,
        toAccountID: toAccount.id,
        fromName: fromAccout.name,
        toName: toAccount.name,
        amount: randomNumber(100),
        description: randomWord(),
        place: randomWord(),
        temporalStamp: new Date(),
        userID: fromAccout.userID || undefined,
      },
    })

    transactions.push(transaction)
  }
  return transactions
}
