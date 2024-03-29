import { QueryFunction } from '@tanstack/react-query'
import axios from 'axios'
import { Transactions } from '../../types/APIResponseData'

export const getTransactions: QueryFunction<Transactions[]> = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/transactions`,
    )
    if (response.status !== 200) throw new Error('Failed to fetch transactions')
    return response.data.data
  } catch (error) {
    console.error(error)
    throw error
  }
}
