import * as queries from './queries'

import { Handler } from 'express'
import { createTransactionsBody } from './types'
import errorHandler from '../Error/errorHandler'
import { isValidAmount } from './queryHelpers'

export const GetTransactions: Handler = async (req, res) => {
  const {
    startDate,
    endDate,
    toAccountID,
    fromAccountID,
    account,
    tags,
    amount,
    amountRange,
    page = 1,
    pageSize = 10,
  }: {
    startDate?: string
    endDate?: string
    toAccountID?: string
    fromAccountID?: string
    account?: string
    tags?: string[]
    amount?: number
    amountRange?: [number, number]
    page?: number
    pageSize?: number
  } = req.query
  const transactions = await queries.getTransactions({
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
    toAccountID,
    fromAccountID,
    account,
    tags,
    amount,
    amountRange,
    page,
    pageSize,
  })
  res.json({
    data: transactions,
  })
}

export const GetTransaction: Handler = async (req, res) => {
  const { id } = req.params
  try {
    const transaction = await queries.getTransaction({ id })
    if (!transaction) {
      res.status(404).json({ message: 'Transaction not found' })
    } else {
      res.status(200).json({ data: transaction })
    }
  } catch (e) {
    errorHandler(e, res)
  }
}

export const CreateTransaction: Handler = async (req, res) => {
  const {
    fromAccountID,
    toAccountID,
    fromName,
    toName,
    amount,
    description,
    place,
    temporalStamp,
    transactionFragments,
  }: createTransactionsBody = req.body

  if (
    transactionFragments?.data.length
      ? transactionFragments.data?.some(
          fragment => !fragment.fromName || !fragment.toName
        )
      : !fromName || !toName
  ) {
    res.status(400).json({ error: 'fromName and toName is required' })
    return
  }

  if (
    !isValidAmount(amount) ||
    transactionFragments?.data?.some(
      fragment => !isValidAmount(fragment.amount)
    )
  ) {
    res.status(400).json({ error: 'amount is required' })
    return
  }

  try {
    const transaction = await queries.createTransaction({
      fromAccountID,
      toAccountID,
      fromName,
      toName,
      amount: +amount!,
      description,
      place,
      temporalStamp,
      transactionFragments: transactionFragments
        ? {
            data: transactionFragments.data.map(fragment => ({
              fromAccountID: fragment.fromAccountID,
              toAccountID: fragment.toAccountID,
              fromName: fragment.fromName,
              toName: fragment.toName,
              amount: +fragment.amount!,
              description: fragment.description,
              place: fragment.place,
              temporalStamp: fragment.temporalStamp,
            })),
          }
        : undefined,
    })
    res.status(201).json({ data: transaction })
  } catch (e) {
    errorHandler(e, res)
  }
}

export const EditTransaction: Handler = async (req, res) => {
  const { id } = req.params
  const {
    fromAccountID,
    toAccountID,
    fromName,
    toName,
    amount,
    description,
    place,
    temporalStamp,
  }: createTransactionsBody = req.body

  if ((fromAccountID && !fromName) || (toAccountID && !toName)) {
    res.status(400).json({ error: 'fromName and toName is required' })
    return
  }

  try {
    const transaction = await queries.editTransaction(id, {
      fromAccountID,
      toAccountID,
      fromName,
      toName,
      amount: amount ? +amount : undefined,
      description,
      place,
      temporalStamp: temporalStamp ? new Date(temporalStamp) : undefined,
    })

    res.status(200).json({ data: transaction })
  } catch (e) {
    errorHandler(e, res)
  }
}

export const DeleteTransaction: Handler = async (req, res) => {
  try {
    const { id } = req.params
    await queries.deleteTransaction(id)
    res.status(204).send()
  } catch (e) {
    errorHandler(e, res)
  }
}
