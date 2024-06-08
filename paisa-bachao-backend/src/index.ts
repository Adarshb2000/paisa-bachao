import express from 'express'
import morgan from 'morgan'
import accountRouter from './Accounts/routes'
import cors from 'cors'
import transactionRouter from './Transactions/routes'
import authHandler from './Auth/handler'
import sessionInjector from './db/sessionInjector'
import prisma from './db'
import tagRouter from './Tags/routes'

const app = express()
app.use(
  cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: process.env.origins?.split(' ') ?? 'http://localhost:3000',
    credentials: true,
  })
)
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(authHandler)
app.use(sessionInjector)

app.get('/', (req, res) => {
  res.send({ message: 'Hello World' })
})

app.use('/accounts', accountRouter)
app.use('/transactions', transactionRouter)
app.use('/tags', tagRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Ye kaha aa gaye aap?' })
})

export default app
