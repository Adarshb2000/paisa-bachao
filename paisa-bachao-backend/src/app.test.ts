import request from 'supertest'
import app from '.'
import prisma from './db'

describe('Basic', () => {
  it('should be able to get the basic ', async () => {
    await prisma.account.deleteMany()
    await prisma.accountGroup.deleteMany()
    await prisma.tag.deleteMany()
    await prisma.transaction.deleteMany()
    const response = await request(app).get('/')
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('message')
    expect(response.body.message).toBe('Hello World')
  })
})
