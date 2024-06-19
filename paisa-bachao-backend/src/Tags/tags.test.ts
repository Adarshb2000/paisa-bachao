import { randomNumber, randomWord } from '../Helpers/random'

import { Handler } from 'express'
import app from '../index'
import request from 'supertest'

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

describe('Tags', () => {
  it('should create a tag', async () => {
    const tagName = randomWord(5)
    const res = await request(app)
      .post('/tags')
      .send({ name: tagName, color: '#000000' })
    expect(res.status).toBe(201)
    const response = await request(app).get(`/tags?name=${tagName}`)
    expect(response.body.data).toBeInstanceOf(Array)
    expect(response.body.data.length).toBe(1)
  })
  it('should be able to edit a tag', async () => {
    const tagName = randomWord(5)
    const res = await request(app)
      .post('/tags')
      .send({ name: tagName, color: '#000000' })
    expect(res.status).toBe(201)
    const response = await request(app).get(`/tags?name=${tagName}`)
    expect(response.body.data).toBeInstanceOf(Array)
    expect(response.body.data.length).toBe(1)
    const tag = response.body.data[0]
    const newName = randomWord(5)
    const editResponse = await request(app)
      .patch(`/tags/${tag.id}`)
      .send({ name: newName })
    expect(editResponse.status).toBe(200)
    const updatedTag = await request(app).get(`/tags/${tag.id}`)
    expect(updatedTag.body.data.name).toBe(newName)
    expect(updatedTag.body.data.color).toBe(tag.color)
  })
  it('should be able to handle usage increment on transaction creation', async () => {
    const tagName = randomWord(5)
    const res = await request(app)
      .post('/tags')
      .send({ name: tagName, color: '#000000' })
    expect(res.status).toBe(201)
    const response = await request(app).get(`/tags?name=${tagName}`)
    expect(response.body.data).toBeInstanceOf(Array)
    expect(response.body.data.length).toBe(1)
    const tag = response.body.data[0]
    const transactionResponse = await request(app)
      .post('/transactions')
      .send({
        amount: randomNumber(1000),
        fromName: 'Bleh',
        toName: 'Bleh2',
        tags: [tag.id],
      })
    expect(transactionResponse.status).toBe(201)
    const updatedTag = await request(app).get(`/tags/${tag.id}`)
    expect(updatedTag.body.data.usage).toBe(1)
  })
  it('should be able to handle usage decrement on transaction deletion', async () => {
    const tagName = randomWord(5)
    const res = await request(app)
      .post('/tags')
      .send({ name: tagName, color: '#000000' })
    expect(res.status).toBe(201)
    const response = await request(app).get(`/tags?name=${tagName}`)
    expect(response.body.data).toBeInstanceOf(Array)
    expect(response.body.data.length).toBe(1)
    const tag = response.body.data[0]
    const transactionResponse = await request(app)
      .post('/transactions')
      .send({
        amount: randomNumber(1000),
        fromName: 'Bleh',
        toName: 'Bleh2',
        tags: [tag.id],
      })
    expect(transactionResponse.status).toBe(201)
    const transaction = transactionResponse.body.data
    const updatedTag = await request(app).get(`/tags/${tag.id}`)
    expect(updatedTag.body.data.usage).toBe(1)
    await request(app).delete(`/transactions/${transaction.id}`)
    const updatedTagAfterDelete = await request(app).get(`/tags/${tag.id}`)
    expect(updatedTagAfterDelete.body.data.usage).toBe(0)
  })
  it('should be able to handle multiple tags on transaction with fragments creation', async () => {
    const tagNames = [
      randomWord(5),
      randomWord(5),
      randomWord(5),
      randomWord(5),
    ]
    const tagsResponse = await Promise.all(
      tagNames.map(tagName =>
        request(app).post('/tags').send({ name: tagName, color: '#000000' })
      )
    )
    const tags = tagsResponse.map(tag => tag.body.data.id)
    const transaction = {
      amount: randomNumber(1000),
      transactionFragments: {
        data: [
          {
            amount: randomNumber(1000),
            fromName: 'Bleh',
            toName: 'Bleh2',
            tags: [tags[0], tags[1]],
          },
          {
            amount: randomNumber(1000),
            fromName: 'Bleh',
            toName: 'Bleh2',
            tags: [tags[0], tags[2], tags[3]],
          },
        ],
      },
    }
    const transactionResponse = await request(app)
      .post('/transactions')
      .send(transaction)
    expect(transactionResponse.status).toBe(201)
    const updatedTags = await Promise.all(
      tags.map(tagId => request(app).get(`/tags/${tagId}`))
    )
    expect(updatedTags[0].body.data.usage).toBe(2)
    expect(updatedTags[1].body.data.usage).toBe(1)
    expect(updatedTags[2].body.data.usage).toBe(1)
    expect(updatedTags[3].body.data.usage).toBe(1)

    await request(app).delete(
      `/transactions/${transactionResponse.body.data.id}`
    )
    const updatedTagsAfterDelete = await Promise.all(
      tags.map(tagId => request(app).get(`/tags/${tagId}`))
    )
    updatedTagsAfterDelete.forEach((tag, index) => {
      expect(tag.body.data.usage).toBe(0)
    })
  })

  it('should be able to handle patching multiple tags on transaction with fragments', async () => {
    const tagNames = [
      randomWord(5),
      randomWord(5),
      randomWord(5),
      randomWord(5),
    ]
    const tagsResponse = await Promise.all(
      tagNames.map(tagName =>
        request(app).post('/tags').send({ name: tagName, color: '#000000' })
      )
    )
    const tags = tagsResponse.map(tag => tag.body.data.id)
    const transaction = {
      amount: randomNumber(1000),
      transactionFragments: {
        data: [
          {
            amount: randomNumber(1000),
            fromName: 'Bleh',
            toName: 'Bleh2',
            tags: [tags[0], tags[1]],
          },
          {
            amount: randomNumber(1000),
            fromName: 'Bleh',
            toName: 'Bleh2',
            tags: [tags[0], tags[2], tags[3]],
          },
        ],
      },
    }
    const transactionResponse = await request(app)
      .post('/transactions')
      .send(transaction)

    expect(transactionResponse.status).toBe(201)
    const responseTransaction = transactionResponse.body.data
    const updatedTags = await Promise.all(
      tags.map(tagId => request(app).get(`/tags/${tagId}`))
    )
    expect(updatedTags[0].body.data.usage).toBe(2)
    expect(updatedTags[1].body.data.usage).toBe(1)
    expect(updatedTags[2].body.data.usage).toBe(1)
    expect(updatedTags[3].body.data.usage).toBe(1)

    const patchTransactionResponse = await request(app)
      .patch(`/transactions/${responseTransaction.transactionFragments[0].id}`)
      .send({
        ...transaction.transactionFragments.data[0],
        tags: [tags[1], tags[2]],
      })
    expect(patchTransactionResponse.status).toBe(200)
    const updatedTagsAfterPatch = await Promise.all(
      tags.map(tagId => request(app).get(`/tags/${tagId}`))
    )
    expect(updatedTagsAfterPatch[0].body.data.usage).toBe(1)
    expect(updatedTagsAfterPatch[1].body.data.usage).toBe(1)
    expect(updatedTagsAfterPatch[2].body.data.usage).toBe(2)
    expect(updatedTagsAfterPatch[3].body.data.usage).toBe(1)
  })
  it('should be able to handle deletion of a transaction fragment', async () => {
    const tagNames = [
      randomWord(5),
      randomWord(5),
      randomWord(5),
      randomWord(5),
    ]
    const tagsResponse = await Promise.all(
      tagNames.map(tagName =>
        request(app).post('/tags').send({ name: tagName, color: '#000000' })
      )
    )
    const tags = tagsResponse.map(tag => tag.body.data.id)
    const transaction = {
      amount: randomNumber(1000),
      transactionFragments: {
        data: [
          {
            amount: randomNumber(1000),
            fromName: 'Bleh',
            toName: 'Bleh2',
            tags: [tags[0], tags[1]],
          },
          {
            amount: randomNumber(1000),
            fromName: 'Bleh',
            toName: 'Bleh2',
            tags: [tags[0], tags[2], tags[3]],
          },
        ],
      },
    }
    const transactionResponse = await request(app)
      .post('/transactions')
      .send(transaction)

    expect(transactionResponse.status).toBe(201)
    const responseTransaction = transactionResponse.body.data
    const updatedTags = await Promise.all(
      tags.map(tagId => request(app).get(`/tags/${tagId}`))
    )
    expect(updatedTags[0].body.data.usage).toBe(2)
    expect(updatedTags[1].body.data.usage).toBe(1)
    expect(updatedTags[2].body.data.usage).toBe(1)
    expect(updatedTags[3].body.data.usage).toBe(1)

    const deleteTransactionFragmentResponse = await request(app).delete(
      `/transactions/${responseTransaction.transactionFragments[0].id}`
    )
    expect(deleteTransactionFragmentResponse.status).toBe(200)
    const updatedTagsAfterDelete = await Promise.all(
      tags.map(tagId => request(app).get(`/tags/${tagId}`))
    )
    expect(updatedTagsAfterDelete[0].body.data.usage).toBe(1)
    expect(updatedTagsAfterDelete[1].body.data.usage).toBe(0)
    expect(updatedTagsAfterDelete[2].body.data.usage).toBe(1)
    expect(updatedTagsAfterDelete[3].body.data.usage).toBe(1)
  })
})
