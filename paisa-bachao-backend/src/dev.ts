import prisma from './db'
import {
  generateDummyAccountGroups,
  generateDummyAccounts,
  generateDummyTransactions,
} from './db/dummyDataGenerator'

const devFn = async () => {
  await prisma.transaction.deleteMany()
  await prisma.account.deleteMany()
  await prisma.accountGroup.deleteMany()
  await generateDummyAccounts()
  await generateDummyTransactions()
}

export default devFn
