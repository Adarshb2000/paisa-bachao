import { choice, randomNumber, randomWord } from '../Helpers/random'

import { Frequency, Transaction } from '@prisma/client'
import { faker } from '@faker-js/faker'
import prisma from '.'

const users = ['123456', '5a360096-82f2-49c1-a30d-fb2447fb6069']

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

export const generateDummyBudgets = async () => {
  const tags = await prisma.tag.findMany()
  const frequencyList = [
    'DAILY',
    'WEEKLY',
    'MONTHLY',
    'YEARLY',
    'HALFYEARLY',
    'BIWEEKLY',
  ] as const
  const budgets = []
  for (const tag of tags) {
    const budgetCount = randomNumber(3)
    for (let i = 0; i < budgetCount; i++) {
      try {
        await prisma.budget.create({
          data: {
            amount: randomNumber(1000),
            frequency: frequencyList[randomNumber(frequencyList.length - 1)],
            tagId: tag.id,
            userID: tag.userID,
          },
        })
      } catch {}
    }
  }
}

export const generateDummyTags = () => {
  const tags = [
    'Food',
    'Groceries',
    'Vacation',
    'Transportation',
    'Bills',
    'Body care',
    'Shopping',
    'Rent',
    'Utilities',
    'Health',
    'Entertainment',
    'Education',
    'Miscellaneous',
    'Salary',
    'Refund',
  ]
  return prisma.tag.createMany({
    data: tags.map(name => ({
      name,
      color: faker.color.rgb(),
      userID: '123456',
    })),
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
    const fromAccount = choice(accounts)
    let toAccount = choice(accounts)
    if (
      toAccount.id === fromAccount.id ||
      toAccount.userID !== fromAccount.userID
    ) {
      toAccount = { name: randomWord(5) } as typeof toAccount
    }

    const transaction = await prisma.transaction.create({
      data: {
        fromAccountID: fromAccount.id,
        toAccountID: toAccount.id,
        fromName: fromAccount.name,
        toName: toAccount.name,
        amount: randomNumber(100),
        description: randomWord(),
        place: randomWord(),
        temporalStamp: faker.date.anytime(),
        userID: fromAccount.userID || undefined,
      },
    })

    transactions.push(transaction)
  }
  return transactions
}
