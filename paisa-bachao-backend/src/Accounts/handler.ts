import * as queries from './queries'
import prisma from '../db'
import errorHandler from '../Error/errorHandler'

import { Handler } from 'express'
import { HTTPError } from '../Error/HTTPError'

export const CreateAccount: Handler = async (req, res) => {
  const { name, balance = '0', accountGroupID } = req.body
  try {
    const account = await queries.createAccount(
      {
        name,
        balance: +balance,
        accountGroupID,
      },
      req.prisma
    )
    res.status(201).json({ data: account })
  } catch (error: any) {
    errorHandler(error, res)
  }
}

export const CreateAccountGroup: Handler = async (req, res) => {
  const { name } = req.body
  if (!name) {
    res
      .status(400)
      .json({ message: 'Invalid input: Account group name is required!' })
    return
  }

  try {
    const accountGroup = await req.prisma.accountGroup.create({
      data: {
        name,
      },
    })
    res.status(201).json({ data: accountGroup })
  } catch (error: any) {
    errorHandler(error, res)
  }
}

export const GetAccounts: Handler = async (req, res) => {
  const {
    groupID = false,
    name = '',
    grouped = false,
    page = 1,
    pageSize,
  } = req.query
  try {
    let accounts

    if (groupID) {
      // Search by group
      accounts = queries.getAccountsByGroup(
        {
          accountGroupID: groupID.toString(),
          name: name.toString(),
          page: +page,
          pageSize: pageSize ? +pageSize : undefined,
        },
        req.prisma
      )
    } else if (grouped) {
      // Return accounts clustered by group
      const singles = {
        name: 'Single',
        accounts: await queries.getAccounts(
          {
            name: name.toString(),
            singles: true,
          },
          req.prisma
        ),
      }
      const groups = await queries.getAccountsWithGroups(
        {
          name: name.toString(),
        },
        req.prisma
      )
      accounts = [singles, ...groups]
    } else {
      // Return all accounts
      accounts = await queries.getAccounts(
        {
          name: name.toString(),
          page: +page,
          pageSize: pageSize ? +pageSize : undefined,
        },
        req.prisma
      )
    }
    res.status(200).json({ data: accounts || [] })
  } catch (error: any) {
    errorHandler(error, res)
  }
}

export const GetAccount: Handler = async (req, res) => {
  const id = req.params.id
  try {
    res
      .status(200)
      .json({ data: await queries.getAccountByID({ id }, req.prisma) })
  } catch (error: any) {
    errorHandler(error, res)
  }
}

export const GetAccountGroups: Handler = async (req, res) => {
  const { name = '', accounts = false, pageSize = 10, page = 1 } = req.query
  try {
    const accountGroups = await queries.getAccountsWithGroups(
      {
        name: name.toString(),
        accounts: accounts === 'true',
        page: +page,
        pageSize: +pageSize,
      },
      req.prisma
    )
    res.status(200).json({ data: accountGroups })
  } catch (error: any) {
    errorHandler(error, res)
  }
}

export const GetAccountGroup: Handler = async (req, res) => {
  const id = req.params.id
  try {
    res.status(200).json({
      data: await queries.getAccountGroupByID({ id }, req.prisma),
    })
  } catch (error: any) {
    errorHandler(error, res)
  }
}

export const UpdateAccountBalance: Handler = async (req, res) => {
  const id = req.params.id
  const { balance, initialBalance } = req.body

  try {
    const account = await queries.updateAccountBalance(
      {
        balance: +balance,
        id,
        initialBalance: +initialBalance,
      },
      req.prisma
    )
    res.status(200).json({ data: account })
  } catch (error: any) {
    errorHandler(error, res)
  }
}

export const EditAccount: Handler = async (req, res) => {
  const id = req.params.id
  const { name } = req.body
  try {
    const account = await req.prisma.account.update({
      where: {
        id: id,
      },
      data: {
        name,
      },
    })
    res.status(200).json({ data: account })
  } catch (error: any) {
    errorHandler(error, res)
  }
}

export const EditAccountGroup: Handler = async (req, res) => {
  const id = req.params.id
  const { name } = req.body
  try {
    if (!name) throw new HTTPError('Invalid input: Name is required!', 422)
    const accountGroup = await req.prisma.accountGroup.update({
      where: {
        id: id,
      },
      data: {
        name,
      },
    })
    res.status(200).json({ data: accountGroup })
  } catch (error: any) {
    errorHandler(error, res)
  }
}

export const UpdateAccountMembers: Handler = async (req, res) => {
  const accountGroupID = req.params.id
  const { link, accountID } = req.body
  try {
    await queries.updateAccountGroupMembers(
      {
        accountID,
        accountGroupID,
        link,
      },
      req.prisma
    )
    res.status(204).end()
  } catch (error: any) {
    errorHandler(error, res)
  }
}

export const DeleteAccount: Handler = async (req, res) => {
  const id = req.params.id
  try {
    await req.prisma.account.delete({
      where: {
        id,
      },
    })
    res.status(204).end()
  } catch (error: any) {
    errorHandler(error, res)
  }
}

export const DeleteAccountGroup: Handler = async (req, res) => {
  const id = req.params.id
  try {
    await req.prisma.accountGroup.delete({
      where: {
        id,
      },
    })
    res.status(204).end()
  } catch (error: any) {
    errorHandler(error, res)
  }
}
