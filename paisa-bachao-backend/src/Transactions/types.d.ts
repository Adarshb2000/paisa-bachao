export interface FilterProps {
  startDate?: Date
  endDate?: Date
  toAccountID?: string
  fromAccountID?: string
  account?: string
  tags?: string[]
  category?: string
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
  category?: string
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
  category?: string
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
  category?: string
}

export type FilterType = {
  [key: string]: string | number | boolean | Date | undefined | Array
}
export type SortType = {
  [key: string]: 'asc' | 'desc' | ''
}

export type FilterAndSort = {
  sort: Sort
  filter: Filter
}
