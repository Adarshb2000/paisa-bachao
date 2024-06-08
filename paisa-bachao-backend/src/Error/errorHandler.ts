import { Response } from 'express'

const errorHandler = (error: any, res: Response) => {
  console.error(error)
  switch (error.code) {
    case typeof error.code === 'number' ? error.code : null:
      res.status(error.code).json({ message: error.message })
      break
    case 'P2002':
      res.status(409).json({ message: error.message.split('\n').at(-1) })
      break
    default:
      res.status(500).json({ message: 'Internal Server Error' })
  }
}

export default errorHandler
