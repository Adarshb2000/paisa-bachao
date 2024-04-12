import prisma from './db'
import {
  generateDummyAccountGroups,
  generateDummyAccounts,
  generateDummyTransactions,
} from './db/dummyDataGenerator'

const devFn = async () => {
  await prisma.transaction
    .deleteMany()
    .then(() => prisma.account.deleteMany())
    .then(() => prisma.accountGroup.deleteMany())
    .then(() => prisma.transaction.deleteMany())
    .then(() => generateDummyAccounts())
    .then(() => generateDummyAccountGroups())
    .then(() => generateDummyTransactions())
}

export default devFn
