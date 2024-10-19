import * as queries from './queries'

import { FilterAndSort, createTransactionsBody } from './types'

import { Handler } from 'express'
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

  const transactions = await queries.getTransactions(
    {
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
    },
    req.prisma
  )
  res.json({
    data: transactions,
  })
}

export const GetRefinedTransactions: Handler = async (req, res) => {
  const {
    params,
    page = 1,
    pageSize = 10,
  }: { params: FilterAndSort; page: number; pageSize: number } = req.body
  try {
    const transactions = await queries.getRefinedTransactions(
      { params, page: +page, pageSize: +pageSize },
      req.prisma
    )
    res.json({
      data: transactions,
    })
  } catch (err) {
    errorHandler(err, res)
  }
}

export const GetTransaction: Handler = async (req, res) => {
  const { id } = req.params
  try {
    const transaction = await queries.getTransaction({ id }, req.prisma)
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
    tags,
  }: createTransactionsBody = req.body

  if (
    transactionFragments?.data?.length
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
    const transaction = await queries.createTransaction(
      {
        fromAccountID,
        toAccountID,
        fromName,
        toName,
        amount: +amount!,
        description,
        place,
        temporalStamp: temporalStamp ? new Date(temporalStamp) : undefined,
        tags: tags || [],
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
                temporalStamp: fragment.temporalStamp
                  ? new Date(fragment.temporalStamp)
                  : undefined,
                tags: fragment.tags || [],
              })),
            }
          : undefined,
      },
      req.prisma
    )
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
    description = '',
    place = '',
    temporalStamp = new Date(),
    tags = [],
  }: createTransactionsBody = req.body

  if (!fromName || !toName) {
    res.status(400).json({ error: 'fromName and toName is required' })
    return
  }
  if (!isValidAmount(amount)) {
    res.status(400).json({ error: 'amount is required' })
    return
  }

  try {
    const transaction = await queries.editTransaction(
      id,
      {
        fromAccountID,
        toAccountID,
        fromName,
        toName,
        amount: +amount!,
        description,
        place,
        temporalStamp,
        tags,
      },
      req.prisma
    )

    res.status(200).json({ data: transaction })
  } catch (e) {
    errorHandler(e, res)
  }
}

export const DeleteTransaction: Handler = async (req, res) => {
  try {
    const { id } = req.params
    await queries.deleteTransaction(id, req.prisma)
    res.status(204).send()
  } catch (e) {
    errorHandler(e, res)
  }
}
