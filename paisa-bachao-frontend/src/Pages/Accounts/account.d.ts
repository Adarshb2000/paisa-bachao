export interface Account {
  id?: string
  createdAt?: Date
  updatedAt?: Date

  name: string
  balance: number

  accountGroup?: AccountGroup
  accountGroupID?: string
}

export interface AccountGroup {
  id: string
  createdAt: Date
  updatedAt: Date

  name: string
  accounts: Account[]
}
