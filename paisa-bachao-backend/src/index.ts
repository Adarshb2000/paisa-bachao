import express from 'express'
import morgan from 'morgan'
import accountRouter from './Accounts/routes'
import cors from 'cors'
import transactionRouter from './Transactions/routes'

const app = express()
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send({ message: 'Hello World' })
})

app.use('/accounts', accountRouter)
app.use('/transactions', transactionRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Ye kaha aa gaye aap?' })
})

export default app
