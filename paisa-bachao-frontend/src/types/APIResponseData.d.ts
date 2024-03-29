export interface Account {
  id?: string
  createdAt?: Date
  updatedAt?: Date

  name: string
  balance: number

  accountGroup?: AccountGroup
  accountGroupID?: string

  toTransactions?: Transactions[]
  fromTransactions?: Transactions[]
}

export interface AccountGroup {
  id: string
  createdAt: Date
  updatedAt: Date

  name: string
  accounts: Account[]
}

export interface Transactions {
  id: number
  createdAt: string
  updatedAt: string

  fromName: string
  from?: Account

  toName: string
  to?: Account

  amount: number

  temporalStamp: string
  description: string
  type: string
}
