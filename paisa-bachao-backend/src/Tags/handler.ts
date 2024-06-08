import { Handler } from 'express'
import * as queries from './queries'

export const GetAllTags: Handler = async (req, res) => {
  const { name = '', color = '' } = req.query as { name: string; color: string }
  try {
    const tags = await queries.getAllTags({ name, color }, req.prisma)
    res.json({
      data: tags,
    })
  } catch (e) {
    res.status(500).send({ message: 'Internal server error' })
    console.error(e)
  }
}

export const GetTag: Handler = async (req, res) => {
  const id = req.params.id
  try {
    const tag = await queries.getTag({ id }, req.prisma)
    res.json({
      data: tag,
    })
  } catch (e) {
    res.status(500).send({ message: 'Internal server error' })
    console.error(e)
  }
}

export const CreateTag: Handler = async (req, res) => {
  const { name, color } = req.body
  try {
    const tag = await queries.createTag({ name, color }, req.prisma)
    res.status(201).json({
      data: tag,
    })
  } catch (e) {
    res.status(500).send({ message: 'Internal server error' })
    console.error(e)
  }
}

export const EditTag: Handler = async (req, res) => {
  const id = req.params.id
  const { name, color } = req.body
  try {
    const tag = await queries.editTag(id, { name, color }, req.prisma)
    res.json({
      data: tag,
    })
  } catch (e) {
    res.status(500).send({ message: 'Internal server error' })
    console.error(e)
  }
}

export const UpdateTag: Handler = async (req, res) => {
  const id = req.params.id
  try {
    const tag = await queries.updateTag(id, req.prisma)
    res.json({
      data: tag,
    })
  } catch (e) {
    res.status(500).send({ message: 'Internal server error' })
    console.error(e)
  }
}

export const UpdateManyTags: Handler = async (req, res) => {
  const {
    incrementData,
  }: {
    incrementData: {
      id: string
      increment: number
    }[]
  } = req.body
  try {
    await queries.updateManyTags(incrementData, req.prisma)
    res.json({
      message: 'done',
    })
  } catch (e) {
    res.status(500).send({ message: 'Internal server error' })
    console.error(e)
  }
}

export const DeleteTag: Handler = async (req, res) => {
  const id = req.params.id
  try {
    const tag = await queries.deleteTag({ id }, req.prisma)
    res.json({
      data: tag,
    })
  } catch (e) {
    res.status(500).send({ message: 'Internal server error' })
    console.error(e)
  }
}
