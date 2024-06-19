export interface FiterProps {
  startDate?: Date
  endDate?: Date
  toAccountID?: string
  fromAccountID?: string
  account?: string
  tags?: string[]
  amount?: number
  amountRange?: [number, number]
  page?: number
  pageSize?: number
}

export interface CreateTransactionProps {
  fromAccountID?: string
  fromName?: string
  toAccountID?: string
  toName?: string
  amount: number
  description?: string
  place?: string
  temporalStamp?: Date

  transactionFragments?: {
    data: CreateTransactionProps[]
  }
  tags?: string[]
}

export interface EditTransactionProps {
  fromAccountID?: string
  fromName: string
  toAccountID?: string
  toName: string
  amount: number
  description: string
  place: string
  temporalStamp: Date
  tags: string[]
}

export interface BalanceUpdate {
  account: string
  balance: number
}

export interface createTransactionsBody {
  fromAccountID?: string
  toAccountID?: string
  fromName?: string
  toName?: string
  amount?: string
  description?: string
  place?: string
  temporalStamp?: Date
  transactionFragments?: {
    data: createTransactionsBody[]
  }
  tags?: string[]
}
