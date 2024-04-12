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

describe('Accounts', () => {
  it('should return 200 status code for GET /accounts', async () => {
    const response = await request(app).get('/accounts')
    expect(response.status).toBe(200)
  })

  it('should return 404 status code for GET /accounts/:id', async () => {
    const response = await request(app).get('/accounts/123')
    expect(response.status).toBe(404)
  })

  it('should return 201 status code for POST /accounts and 409 for same name error', async () => {
    const name = randomWord()
    const response = await request(app).post('/accounts').send({ name })
    expect(response.status).toBe(201)
    const account = response.body.data
    expect(account).toHaveProperty('id')
    expect(account).toHaveProperty('name')
    expect(account).toHaveProperty('balance')
    expect(account.name).toBe(name)
    expect(account.balance).toBe('0')
    const errorResponse = await request(app).post('/accounts').send({ name })
    expect(errorResponse.status).toBe(409)
  })

  it('should return valid account for GET /accounts/:id', async () => {
    const name = randomWord()
    const balance = randomNumber()
    const response = await request(app)
      .post('/accounts')
      .send({ name, balance })
    const account = response.body.data
    const getResponse = await request(app).get(`/accounts/${account.id}`)
    const accountResponse = getResponse.body.data
    expect(getResponse.status).toBe(200)
    expect(accountResponse).toHaveProperty('id')
    expect(accountResponse).toHaveProperty('name')
    expect(accountResponse).toHaveProperty('balance')
    expect(accountResponse.name).toBe(name)
    expect(accountResponse.balance).toBe(balance.toString())
  })

  it('should update balance correctly for PUT /accounts/:id', async () => {
    const name = randomWord()
    const balance = randomNumber(1000)
    const response = await request(app)
      .post('/accounts')
      .send({ name, balance })
    const account = response.body.data
    const newBalance = randomNumber(1000) - 500
    const updateResponse = await request(app)
      .put(`/accounts/${account.id}`)
      .send({ balance: newBalance, initialBalance: balance })
    const updatedAccount = updateResponse.body.data
    expect(updateResponse.status).toBe(200)
    expect(updatedAccount).toHaveProperty('id')
    expect(updatedAccount).toHaveProperty('name')
    expect(updatedAccount).toHaveProperty('balance')
    expect(updatedAccount.name).toBe(name)
    expect(updatedAccount.balance).toBe(newBalance.toString())
  })
})

describe('Account Groups', () => {
  it('should return 200 status code for GET /accounts/groups', async () => {
    const response = await request(app).get('/accounts/groups')
    expect(response.status).toBe(200)
  })

  it('should return 404 status code for GET /accounts/groups/:id', async () => {
    const response = await request(app).get('/accounts/groups/123456789')
    expect(response.status).toBe(404)
  })

  it('should return 201 status code for POST /accounts/groups and 409 for same name error', async () => {
    const name = randomWord()
    const response = await request(app).post('/accounts/groups').send({ name })
    expect(response.status).toBe(201)
    const accountGroup = response.body.data
    expect(accountGroup).toHaveProperty('id')
    expect(accountGroup).toHaveProperty('name')
    expect(accountGroup.name).toBe(name)
    const errorResponse = await request(app)
      .post('/accounts/groups')
      .send({ name })
    expect(errorResponse.status).toBe(409)
  })

  it('should return valid account group for GET /accounts/groups/:id', async () => {
    const name = randomWord()
    const response = await request(app).post('/accounts/groups').send({ name })
    const accountGroup = response.body.data
    const accountGroupResponse = await request(app).get(
      `/accounts/groups/${accountGroup.id}`
    )
    expect(accountGroupResponse.status).toBe(200)
    expect(accountGroupResponse.body.data).toHaveProperty('id')
    expect(accountGroupResponse.body.data).toHaveProperty('name')
    expect(accountGroupResponse.body.data.name).toBe(name)
  })
})

describe('Account Groups & Accounts', () => {
  it('should be able to create account and link to account group', async () => {
    // Creating account group
    const accountGroupResponse = await request(app)
      .post('/accounts/groups')
      .send({
        name: randomWord(),
      })
    const accountGroup = accountGroupResponse.body.data

    // Creating account
    const name = randomWord()
    const balance = randomNumber(1000)
    const accountResponse = await request(app)
      .post('/accounts')
      .send({ name, balance, accountGroupID: accountGroup.id })
    const account = accountResponse.body.data
    expect(accountResponse.status).toBe(201)
    expect(account.balance).toBe(balance.toString())

    // Getting account group
    const accountGroupResponse2 = await request(app).get(
      `/accounts/groups/${accountGroup.id}`
    )
    const accountGroup2 = accountGroupResponse2.body.data
    expect(accountGroup2).toHaveProperty('accounts')
    expect(accountGroup2.accounts.length).toBe(1)
    expect(accountGroup2.accounts[0].id).toBe(account.id)
  })

  it('should be able to link and unlink accounts from account groups', async () => {
    // Creating account group
    const accountGroupResponse = await request(app)
      .post('/accounts/groups')
      .send({
        name: randomWord(),
      })
    const accountGroup = accountGroupResponse.body.data

    // Creating account
    const name = randomWord()
    const balance = randomNumber(1000)
    const accountResponse = await request(app)
      .post('/accounts')
      .send({ name, balance })

    const account = accountResponse.body.data
    expect(accountResponse.status).toBe(201)
    expect(account.balance).toBe(balance.toString())

    // Linking account to account group
    const linkResponse = await request(app)
      .put(`/accounts/groups/${accountGroup.id}`)
      .send({ accountID: account.id })
    expect(linkResponse.status).toBe(204)

    // Getting account group
    const accountGroupResponse2 = await request(app).get(
      `/accounts/groups/${accountGroup.id}`
    )
    const accountGroup2 = accountGroupResponse2.body.data
    expect(accountGroup2).toHaveProperty('accounts')
    expect(accountGroup2.accounts.length).toBe(1)
    expect(accountGroup2.accounts[0].id).toBe(account.id)

    // Unlinking account from account group
    const unlinkResponse = await request(app)
      .put(`/accounts/groups/${accountGroup.id}`)
      .send({ accountID: account.id, link: false })
    expect(unlinkResponse.status).toBe(204)

    // Getting account group
    const accountGroupResponse3 = await request(app).get(
      `/accounts/groups/${accountGroup.id}`
    )
    const accountGroup3 = accountGroupResponse3.body.data
    expect(accountGroup3).toHaveProperty('accounts')
    expect(accountGroup3.accounts.length).toBe(0)
  })

  it('should return 404 for invalid account group id', async () => {
    const accountGroupID = '123456789'
    const accountID = '123456789'
    const linkResponse = await request(app)
      .put(`/accounts/groups/${accountGroupID}`)
      .send({ accountID })
    expect(linkResponse.status).toBe(404)
    const unlinkResponse = await request(app)
      .put(`/accounts/groups/${accountGroupID}`)
      .send({ accountID })
    expect(unlinkResponse.status).toBe(404)
  })
})
