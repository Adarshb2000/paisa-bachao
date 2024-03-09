import express from 'express'
import {
  CreateAccount,
  GetAccount,
  EditAccount,
  UpdateAccountBalance,
  DeleteAccount,
  DeleteAccountGroup,
  CreateAccountGroup,
  GetAccounts,
  GetAccountGroups,
  EditAccountGroup,
  UpdateAccountMembers,
  GetAccountGroup,
} from './handler'

const accountRouter = express.Router()

accountRouter.route('/').get(GetAccounts).post(CreateAccount)

accountRouter.route('/groups').get(GetAccountGroups).post(CreateAccountGroup)

accountRouter
  .route('/:id')
  .get(GetAccount)
  .patch(EditAccount)
  .put(UpdateAccountBalance)
  .delete(DeleteAccount)

accountRouter
  .route('/groups/:id')
  .get(GetAccountGroup)
  .put(UpdateAccountMembers)
  .patch(EditAccountGroup)
  .delete(DeleteAccountGroup)

export default accountRouter
