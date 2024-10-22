import { Handler } from 'express'
import * as queries from './queries'

export const GetAllCategories: Handler = async (req, res) => {
  const { name = '' } = req.query as { name: string }
  try {
    const categories = await queries.getAllCategories({ name }, req.prisma)
    res.json({
      data: categories,
    })
  } catch (e) {
    res.status(500).send({ message: 'Internal server error' })
    console.error(e)
  }
}

export const GetCategory: Handler = async (req, res) => {
  const id = req.params.id
  try {
    const category = await queries.getCategory({ id }, req.prisma)
    res.json({
      data: category,
    })
    if (!category) {
      res.status(404).send({ message: 'Category not found' })
    }
  } catch (e: any) {
    res.status(500).send({ message: 'Internal server error' })
    console.error(e)
  }
}

export const CreateCategory: Handler = async (req, res) => {
  const { name, icon } = req.body
  if (name === '') {
    res.status(400).send({ message: 'Name is required' })
    return
  }
  try {
    const category = await queries.createCategory({ name, icon }, req.prisma)
    res.json({
      data: category,
    })
  } catch (e: any) {
    if (e.code === 'P2002') {
      res.status(409).send({ message: 'Category already exists' })
    } else {
      res.status(500).send({ message: 'Internal server error' })
      console.error(e)
    }
  }
}

export const EditCategory: Handler = async (req, res) => {
  const id = req.params.id
  const { name, icon } = req.body
  if (name === '') {
    res.status(400).send({ message: 'Name is required' })
    return
  }
  if (id === '') {
    res.status(400).send({ message: 'Invalid ID' })
    return
  }
  try {
    const category = await queries.editCategory(id, { name, icon }, req.prisma)
    res.json({
      data: category,
    })
  } catch (e: any) {
    if (e.code === 'P2025') {
      res.status(404).send({ message: 'Category not found' })
    } else {
      res.status(500).send({ message: 'Internal server error' })
      console.error(e)
    }
  }
}

export const UpdateCategory: Handler = async (req, res) => {
  const id = req.params.id
  if (id === '') {
    res.status(400).send({ message: 'Invalid ID' })
    return
  }
  try {
    const category = await queries.updateCategory(id, req.prisma)
    res.json({
      data: category,
    })
  } catch (e: any) {
    if (e.code === 'P2025') {
      res.status(404).send({ message: 'Category not found' })
    } else {
      res.status(500).send({ message: 'Internal server error' })
      console.error(e)
    }
  }
}

export const UpdateManyCategories: Handler = async (req, res) => {
  const {
    incrementData,
  }: {
    incrementData: {
      id: string
      increment: number
    }[]
  } = req.body
  try {
    await queries.updateManyCategories(incrementData, req.prisma)
    res.json({
      message: 'done',
    })
  } catch (e) {
    res.status(500).send({ message: 'Internal server error' })
    console.error(e)
  }
}

export const DeleteCategory: Handler = async (req, res) => {
  const id = req.params.id
  if (id === '') {
    res.status(400).send({ message: 'Invalid ID' })
    return
  }
  try {
    const category = await queries.deleteCategory({ id }, req.prisma)
    res.json({
      data: category,
    })
  } catch (e: any) {
    if (e.code === 'P2025') {
      res.status(404).send({ message: 'Category not found' })
    } else {
      res.status(500).send({ message: 'Internal server error' })
      console.error(e)
    }
  }
}
