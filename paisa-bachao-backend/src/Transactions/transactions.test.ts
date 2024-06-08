import request from 'supertest'
import app from '../index'
import { randomNumber, randomWord } from '../Helpers/random'
import { Handler } from 'express'

jest.mock(
  '../Auth/handler',
  (): Handler => (req, res, next) => {
    req.user = {
      email: 'test@test.com',
      id: '123',
      name: 'Test User',
    }
    next()
  }
)

describe('Transactions', () => {
  it('should be able to create a transaction given two newly created accounts', async () => {
    const fromAccountBalance = randomNumber(1000) - 500
    const fromAccount = (
      await request(app)
        .post('/accounts')
        .send({ name: randomWord(), balance: fromAccountBalance })
    ).body.data

    const toAccountBalance = randomNumber(1000) - 500
    const toAccount = (
      await request(app)
        .post('/accounts')
        .send({ name: randomWord(), balance: toAccountBalance })
    ).body.data

    const amount = randomNumber(1000)

    const response = await request(app).post('/transactions').send({
      fromAccountID: fromAccount.id,
      toAccountID: toAccount.id,
      fromName: fromAccount.name,
      toName: toAccount.name,
      amount: amount,
    })
    expect(response.status).toBe(201)
    const transaction = response.body.data
    expect(transaction).toHaveProperty('id')
    expect(transaction).toHaveProperty('fromAccountID')
    expect(transaction).toHaveProperty('toAccountID')
    expect(transaction).toHaveProperty('fromName')
    expect(transaction).toHaveProperty('toName')
    expect(transaction).toHaveProperty('amount')
    expect(transaction.fromAccountID).toBe(fromAccount.id)
    expect(transaction.toAccountID).toBe(toAccount.id)
    expect(transaction.amount).toBe(amount.toString())

    // Testing account balance update
    const updatedFromAccount = (
      await request(app).get(`/accounts/${fromAccount.id}`)
    ).body.data
    const updatedToAccount = (
      await request(app).get(`/accounts/${toAccount.id}`)
    ).body.data
    expect(updatedFromAccount.balance).toBe(
      (fromAccountBalance - amount).toString()
    )
    expect(updatedToAccount.balance).toBe(
      (toAccountBalance + amount).toString()
    )
  })

  it('should be able to handle transactions with no accountID', async () => {
    const response = await request(app)
      .post('/transactions')
      .send({
        fromName: randomWord(),
        toName: randomWord(),
        amount: randomNumber(1000),
      })
    expect(response.status).toBe(201)
    const transaction = response.body.data
    expect(transaction).toHaveProperty('id')
    expect(transaction).toHaveProperty('fromAccountID')
    expect(transaction).toHaveProperty('toAccountID')
    expect(transaction).toHaveProperty('fromName')
    expect(transaction).toHaveProperty('toName')
    expect(transaction).toHaveProperty('amount')
    expect(transaction.fromAccountID).toBe(null)
    expect(transaction.toAccountID).toBe(null)
  })

  it('should return 200 status code for GET /transactions', async () => {
    const response = await request(app).get('/transactions')
    expect(response.status).toBe(200)
  })

  it('should return 404 status code for GET /transactions/:id', async () => {
    const response = await request(app).get('/transactions/123')
    expect(response.status).toBe(404)
  })

  it('should return valid transaction for GET /transactions/:id', async () => {
    const fromAccountBalance = randomNumber(1000) - 500
    const fromAccount = (
      await request(app)
        .post('/accounts')
        .send({ name: randomWord(), balance: fromAccountBalance })
    ).body.data

    const toAccountBalance = randomNumber(1000) - 500
    const toAccount = (
      await request(app)
        .post('/accounts')
        .send({ name: randomWord(), balance: toAccountBalance })
    ).body.data

    const amount = randomNumber(1000)

    const response = await request(app).post('/transactions').send({
      fromAccountID: fromAccount.id,
      toAccountID: toAccount.id,
      fromName: fromAccount.name,
      toName: toAccount.name,
      amount: amount,
    })
    const transaction = response.body.data
    const getResponse = await request(app).get(
      `/transactions/${transaction.id}`
    )
    const transactionResponse = getResponse.body.data
    expect(getResponse.status).toBe(200)
    expect(transactionResponse).toHaveProperty('id')
    expect(transactionResponse).toHaveProperty('fromAccountID')
    expect(transactionResponse).toHaveProperty('toAccountID')
    expect(transactionResponse).toHaveProperty('fromName')
    expect(transactionResponse).toHaveProperty('toName')
    expect(transactionResponse).toHaveProperty('amount')
    expect(transactionResponse.fromAccountID).toBe(fromAccount.id)
    expect(transactionResponse.toAccountID).toBe(toAccount.id)
    expect(transactionResponse.amount).toBe(amount.toString())
  })

  it('should update transaction and account balance if amount is updated using PATCH /transactions/:id', async () => {
    const fromAccountBalance = randomNumber(1000) - 500
    const fromAccount = (
      await request(app)
        .post('/accounts')
        .send({ name: randomWord(), balance: fromAccountBalance })
    ).body.data

    const toAccountBalance = randomNumber(1000) - 500
    const toAccount = (
      await request(app)
        .post('/accounts')
        .send({ name: randomWord(), balance: toAccountBalance })
    ).body.data

    const amount = randomNumber(1000)

    const response = await request(app).post('/transactions').send({
      fromAccountID: fromAccount.id,
      toAccountID: toAccount.id,
      fromName: fromAccount.name,
      toName: toAccount.name,
      amount: amount,
    })
    const transaction = response.body.data
    const newAmount = randomNumber(1000)
    const updateResponse = await request(app)
      .patch(`/transactions/${transaction.id}`)
      .send({ amount: newAmount })
    const updatedTransaction = updateResponse.body.data
    expect(updateResponse.status).toBe(200)
    expect(updatedTransaction).toHaveProperty('id')
    expect(updatedTransaction).toHaveProperty('fromAccountID')
    expect(updatedTransaction).toHaveProperty('toAccountID')
    expect(updatedTransaction).toHaveProperty('fromName')
    expect(updatedTransaction).toHaveProperty('toName')
    expect(updatedTransaction).toHaveProperty('amount')
    expect(updatedTransaction.fromAccountID).toBe(fromAccount.id)
    expect(updatedTransaction.toAccountID).toBe(toAccount.id)
    expect(updatedTransaction.amount).toBe(newAmount.toString())

    const updatedFromAccount = (
      await request(app).get(`/accounts/${fromAccount.id}`)
    ).body.data
    const updatedToAccount = (
      await request(app).get(`/accounts/${toAccount.id}`)
    ).body.data
    expect(updatedFromAccount.balance).toBe(
      (fromAccountBalance - newAmount).toString()
    )
    expect(updatedToAccount.balance).toBe(
      (toAccountBalance + newAmount).toString()
    )
  })

  it('should update transaction and account balance if account is changed using PATCH /transactions/:id', async () => {
    const fromAccountBalance = randomNumber(1000) - 500
    const fromAccount = (
      await request(app)
        .post('/accounts')
        .send({ name: randomWord(), balance: fromAccountBalance })
    ).body.data

    const toAccountBalance = randomNumber(1000) - 500
    const toAccount = (
      await request(app)
        .post('/accounts')
        .send({ name: randomWord(), balance: toAccountBalance })
    ).body.data

    const amount = randomNumber(1000)

    const response = await request(app).post('/transactions').send({
      fromAccountID: fromAccount.id,
      toAccountID: toAccount.id,
      fromName: fromAccount.name,
      toName: toAccount.name,
      amount: amount,
    })
    const transaction = response.body.data
    const newAccountBalance = randomNumber(1000) - 500
    const newFromAccount = (
      await request(app)
        .post('/accounts')
        .send({ name: randomWord(), balance: newAccountBalance })
    ).body.data
    const updateResponse = await request(app)
      .patch(`/transactions/${transaction.id}`)
      .send({ fromAccountID: newFromAccount.id, fromName: newFromAccount.name })
    const updatedTransaction = updateResponse.body.data
    expect(updateResponse.status).toBe(200)
    expect(updatedTransaction).toHaveProperty('id')
    expect(updatedTransaction).toHaveProperty('fromAccountID')
    expect(updatedTransaction).toHaveProperty('toAccountID')
    expect(updatedTransaction).toHaveProperty('fromName')
    expect(updatedTransaction).toHaveProperty('toName')
    expect(updatedTransaction).toHaveProperty('amount')
    expect(updatedTransaction.fromAccountID).toBe(newFromAccount.id)
    expect(updatedTransaction.toAccountID).toBe(toAccount.id)
    expect(updatedTransaction.amount).toBe(amount.toString())

    const updatedFromAccount = (
      await request(app).get(`/accounts/${newFromAccount.id}`)
    ).body.data
    const updatedToAccount = (
      await request(app).get(`/accounts/${toAccount.id}`)
    ).body.data
    const oldFromAccount = (
      await request(app).get(`/accounts/${fromAccount.id}`)
    ).body.data
    expect(updatedFromAccount.balance).toBe(
      (newAccountBalance - amount).toString()
    )
    expect(updatedToAccount.balance).toBe(
      (toAccountBalance + amount).toString()
    )
    expect(oldFromAccount.balance).toBe(fromAccountBalance.toString())
  })

  it('should be able to handle editing amount and account at the same time for non existing account', async () => {
    const fromAccountBalance = randomNumber(1000) - 500
    const fromAccount = (
      await request(app)
        .post('/accounts')
        .send({ name: randomWord(), balance: fromAccountBalance })
    ).body.data

    const toAccountBalance = randomNumber(1000) - 500
    const toAccount = (
      await request(app)
        .post('/accounts')
        .send({ name: randomWord(), balance: toAccountBalance })
    ).body.data

    const amount = randomNumber(1000)

    const response = await request(app).post('/transactions').send({
      fromAccountID: fromAccount.id,
      toAccountID: toAccount.id,
      fromName: fromAccount.name,
      toName: toAccount.name,
      amount: amount,
    })
    const transaction = response.body.data
    const newAmount = randomNumber(1000)
    const newFromAccount = randomWord()
    const updateResponse = await request(app)
      .patch(`/transactions/${transaction.id}`)
      .send({ amount: newAmount, toName: newFromAccount })
    const updatedTransaction = updateResponse.body.data
    expect(updateResponse.status).toBe(200)
    expect(updatedTransaction).toHaveProperty('id')
    expect(updatedTransaction).toHaveProperty('fromAccountID')
    expect(updatedTransaction).toHaveProperty('toAccountID')
    expect(updatedTransaction).toHaveProperty('fromName')
    expect(updatedTransaction).toHaveProperty('toName')
    expect(updatedTransaction).toHaveProperty('amount')
    expect(updatedTransaction.toName).toBe(newFromAccount)
    expect(updatedTransaction.amount).toBe(newAmount.toString())

    const updatedFromAccount = (
      await request(app).get(`/accounts/${fromAccount.id}`)
    ).body.data
    const updatedToAccount = (
      await request(app).get(`/accounts/${toAccount.id}`)
    ).body.data
    expect(updatedFromAccount.balance).toBe(
      (fromAccountBalance - newAmount).toString()
    )
    expect(updatedToAccount.balance).toBe(toAccountBalance.toString())
  })

  it('should be able to handle balance updates on deleted transactions', async () => {
    const fromAccountBalance = randomNumber(1000) - 500
    const fromAccount = (
      await request(app)
        .post('/accounts')
        .send({ name: randomWord(), balance: fromAccountBalance })
    ).body.data

    const toAccountBalance = randomNumber(1000) - 500
    const toAccount = (
      await request(app)
        .post('/accounts')
        .send({ name: randomWord(), balance: toAccountBalance })
    ).body.data

    const amount = randomNumber(1000)

    const response = await request(app).post('/transactions').send({
      fromAccountID: fromAccount.id,
      toAccountID: toAccount.id,
      fromName: fromAccount.name,
      toName: toAccount.name,
      amount: amount,
    })
    const transaction = response.body.data
    console.log(response.body)
    const deleteResponse = await request(app).delete(
      `/transactions/${transaction.id}`
    )
    expect(deleteResponse.status).toBe(204)

    const updatedFromAccount = (
      await request(app).get(`/accounts/${fromAccount.id}`)
    ).body.data
    const updatedToAccount = (
      await request(app).get(`/accounts/${toAccount.id}`)
    ).body.data
    expect(updatedFromAccount.balance).toBe(fromAccountBalance.toString())
    expect(updatedToAccount.balance).toBe(toAccountBalance.toString())
  })
})

describe('Transaction with fragments', () => {
  it('should be able to create a transaction with fragments', async () => {
    const fromAccount = (
      await request(app)
        .post('/accounts')
        .send({
          name: randomWord(),
          balance: randomNumber(1000),
        })
    ).body.data
    const toAccount = (
      await request(app)
        .post('/accounts')
        .send({
          name: randomWord(),
          balance: randomNumber(1000),
        })
    ).body.data
    const middleAccount = (
      await request(app)
        .post('/accounts')
        .send({
          name: randomWord(),
          balance: randomNumber(1000),
        })
    ).body.data
    const amount = randomNumber(1000)
    const fragments = [
      {
        fromAccountID: fromAccount.id,
        toAccountID: middleAccount.id,
        fromName: fromAccount.name,
        toName: middleAccount.name,
        amount: amount,
      },
      {
        fromAccountID: middleAccount.id,
        fromName: middleAccount.name,
        toName: toAccount.name,
        toAccountID: toAccount.id,
        amount: amount,
      },
    ]

    const transactionResponse = await request(app)
      .post('/transactions')
      .send({
        toAccountID: toAccount.id,
        toName: toAccount.name,
        amount: amount,
        transactionFragments: {
          data: fragments,
        },
      })

    if (transactionResponse.status !== 201)
      console.log(transactionResponse.body)

    expect(transactionResponse.status).toBe(201)
    const transaction = transactionResponse.body.data
    expect(transaction).toHaveProperty('id')
    expect(transaction).toHaveProperty('toAccountID')
    expect(transaction).toHaveProperty('toName')
    expect(transaction).toHaveProperty('amount')
    expect(transaction).toHaveProperty('transactionFragments')
    expect(transaction.toAccountID).toBe(toAccount.id)
    expect(transaction.amount).toBe(amount.toString())
    expect(transaction.transactionFragments).toHaveLength(2)
    transaction.transactionFragments.forEach(
      ({ amount: fragmentAmount }: { amount: string }) =>
        expect(fragmentAmount).toBe(amount.toString())
    )

    const updatedAccounts = await Promise.all(
      [fromAccount, toAccount, middleAccount].map(
        async account =>
          (
            await request(app).get(`/accounts/${account.id}`)
          ).body.data
      )
    )
    expect(updatedAccounts[0].balance).toBe(
      (+fromAccount.balance - amount).toString()
    )
    expect(updatedAccounts[1].balance).toBe(
      (+toAccount.balance + amount).toString()
    )
    expect(updatedAccounts[2].balance).toBe(middleAccount.balance)
  })

  it('should be able to handle updates on transaction fragments', async () => {
    const accounts = await Promise.all(
      Array.from(
        { length: 4 },
        async () =>
          (
            await request(app)
              .post('/accounts')
              .send({
                name: randomWord(),
                balance: randomNumber(1000) - 500,
              })
          ).body.data
      )
    )

    const fragments = [
      {
        fromAccountID: accounts[0].id,
        toAccountID: accounts[2].id,
        fromName: accounts[0].name,
        toName: accounts[2].name,
        amount: randomNumber(1000),
      },
      {
        fromAccountID: accounts[1].id,
        toAccountID: accounts[2].id,
        fromName: accounts[1].name,
        toName: accounts[2].name,
        amount: randomNumber(1000),
      },
    ]

    const totalAmount = fragments.reduce(
      (total, { amount }) => total + +amount,
      0
    )

    const transactionResponse = await request(app)
      .post('/transactions')
      .send({
        amount: totalAmount,
        transactionFragments: {
          data: fragments,
        },
      })

    expect(transactionResponse.status).toBe(201)
    const transaction = transactionResponse.body.data
    expect(transaction).toHaveProperty('id')
    expect(transaction).toHaveProperty('amount')
    expect(transaction).toHaveProperty('transactionFragments')
    expect(transaction.amount).toBe(totalAmount.toString())
    expect(transaction.transactionFragments).toHaveLength(2)

    const editableTransactionFragment = transaction.transactionFragments.find(
      ({ fromAccountID }: { fromAccountID: string }) =>
        fromAccountID === accounts[0].id
    )

    const updatedTransactionFragmentResponse = await request(app)
      .patch(`/transactions/${editableTransactionFragment.id}`)
      .send({
        fromName: randomWord(),
      })

    expect(updatedTransactionFragmentResponse.status).toBe(200)

    const updatedTransaction = (
      await request(app).get(`/transactions/${transaction.id}`)
    ).body.data
    expect(updatedTransaction.transactionFragments).toHaveLength(2)
    const updatedTransactionFragment =
      updatedTransaction.transactionFragments.find(
        ({ id }: { id: string }) => id === editableTransactionFragment.id
      )
    expect(updatedTransactionFragment).toHaveProperty('fromName')
    expect(updatedTransactionFragment.fromName).not.toBe(
      editableTransactionFragment.fromName
    )

    const updatedAccounts = await Promise.all(
      accounts.map(
        async account =>
          (
            await request(app).get(`/accounts/${account.id}`)
          ).body.data
      )
    )
    expect(updatedAccounts[0].balance).toBe(accounts[0].balance)
    expect(updatedAccounts[1].balance).toBe(
      (+accounts[1].balance - fragments[1].amount).toString()
    )
    expect(updatedAccounts[2].balance).toBe(
      (
        +accounts[2].balance +
        fragments[0].amount +
        fragments[1].amount
      ).toString()
    )
  })
})
