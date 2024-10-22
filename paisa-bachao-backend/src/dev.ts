import {
  generateDummyAccountGroups,
  generateDummyAccounts,
  generateDummyBudgets,
  generateDummyTags,
  generateDummyTransactions,
} from './db/dummyDataGenerator'

import prisma from './db'

const devFn = async () => {
  await prisma.transaction
    .deleteMany()
    .then(() => prisma.account.deleteMany())
    .then(() => prisma.accountGroup.deleteMany())
    .then(() => prisma.transaction.deleteMany())
    .then(() => generateDummyTags())
    .then(() => generateDummyBudgets())
    .then(() => generateDummyAccounts())
    .then(() => generateDummyAccountGroups())
    .then(() => generateDummyTransactions())
}

export default devFn
