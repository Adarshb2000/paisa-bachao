import { QueryFunction } from '@tanstack/react-query'
import axios from 'axios'
import { TransactionDTO, Transactions } from '../../types/APIResponseData'

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

export const addTransaction = async (transaction: TransactionDTO) => {
  try {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/transactions`,
      transaction,
    )
    if (response.status !== 201) throw new Error('Failed to add transaction')
    return response.data.data
  } catch (error) {
    console.error(error)
    throw error
  }
}
