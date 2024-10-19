import accountRouter from './Accounts/routes'
import authHandler from './Auth/handler'
import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import prisma from './db'
import sessionInjector from './db/sessionInjector'
import tagRouter from './Tags/routes'
import transactionRouter from './Transactions/routes'

const app = express()
app.use(
  cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    origin: process.env.origins?.split(' ') ?? 'http://localhost:5173',
    credentials: true,
  })
)
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  req.prisma = prisma
  next()
})

// app.use(authHandler)
app.use((req, res, next) => {
  req.user = { id: '123456', name: 'Test User', email: 'test@user.in' }
  next()
})
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
