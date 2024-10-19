import {
  CreateTransaction,
  DeleteTransaction,
  EditTransaction,
  GetRefinedTransactions,
  GetTransaction,
  GetTransactions,
} from './handler'

import { Router } from 'express'

const transactionRouter = Router()

transactionRouter.route('/').get(GetTransactions).post(CreateTransaction)
transactionRouter.post('/search', GetRefinedTransactions)

transactionRouter
  .route('/:id')
  .get(GetTransaction)
  .patch(EditTransaction)
  .delete(DeleteTransaction)

export default transactionRouter
