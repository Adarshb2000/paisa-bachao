import { Router } from 'express'
import {
  CreateTransaction,
  DeleteTransaction,
  EditTransaction,
  GetTransaction,
  GetTransactions,
} from './handler'

const transactionRouter = Router()

transactionRouter.route('/').get(GetTransactions).post(CreateTransaction)

transactionRouter
  .route('/:id')
  .get(GetTransaction)
  .patch(EditTransaction)
  .delete(DeleteTransaction)

export default transactionRouter
