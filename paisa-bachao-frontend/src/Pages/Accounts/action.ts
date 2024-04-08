import { QueryFunction } from '@tanstack/react-query'
import axios from 'axios'
import { Account, AccountGroup } from '../../types/APIResponseData'

export const getAccounts: QueryFunction = async ({
  queryKey: [, search],
}): Promise<Account[]> => {
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/accounts`,
    {
      params: {
        search: search || undefined,
      },
    },
  )
  return response.data.data
}

export const addAccount = async (account: Account): Promise<Account> => {
  return (
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/accounts`, account)
  ).data.data
}

export const addAccountGroup = async (name: string): Promise<AccountGroup> => {
  return (
    await axios.post(`${import.meta.env.VITE_BACKEND_URL}/accounts/groups`, {
      name,
    })
  ).data.data
}

export const getAccount = async ({
  queryKey: [, id],
}: {
  queryKey: [string, string]
}) => {
  return (await axios.get(`${import.meta.env.VITE_BACKEND_URL}/accounts/${id}`))
    .data.data
}
