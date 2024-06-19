import { FormProvider, useForm } from 'react-hook-form'
import SingleTransactionForm from './SingleTransactionForm'
import { useRef, useState } from 'react'
import { TransactionDTO } from '../../../types/APIResponseData'
import { objectCompare } from '../../../helpers/helpers'
import dayjs from 'dayjs'
import { useMutation } from '@tanstack/react-query'
import { apiCall } from '../../../api/client'
import { toast } from 'react-toastify'

const AddSplitTransaction = () => {
  const latestDateRef = useRef(dayjs().valueOf())

  const createNewTransaction = (): TransactionDTO => ({
    fromAccountID: null,
    fromName: '',
    toAccountID: null,
    toName: '',
    amount: 0,
    temporalStamp: dayjs(latestDateRef.current).valueOf(),
    description: '',
  })

  const [transactions, setTransactions] = useState([createNewTransaction()])
  const transactionMutation = useMutation({
    mutationFn: () =>
      apiCall({ url: '/transactions', method: 'POST', data: transactions }),
    onSuccess: () => {
      toast.success('Transaction Added Successfully')
    },
    onError: e => {
      toast.error(`Transaction Failed to Add due to ${e}`)
    },
  })

  const methods = useForm()

  const handleFormSubmission = () => {}

  return (
    <div>
      <h1 className='main-heading'>Add Split Transaction</h1>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(handleFormSubmission)}>
          {transactions.map((transaction, index) => (
            <SingleTransactionForm
              key={index}
              id={`transaction-${index}`}
              defaultValue={transaction}
              handleChange={t => {
                if (objectCompare(t, transaction)) return
                latestDateRef.current = t.temporalStamp
                const newTransactionData = [...transactions]
                newTransactionData[index] = t
                setTransactions(newTransactionData)
              }}
            />
          ))}
          <button
            type='button'
            onClick={() => {
              setTransactions([...transactions, createNewTransaction()])
            }}
          >
            Add Split
          </button>
          <button type='submit'>Submit</button>
        </form>
      </FormProvider>
    </div>
  )
}

export default AddSplitTransaction
