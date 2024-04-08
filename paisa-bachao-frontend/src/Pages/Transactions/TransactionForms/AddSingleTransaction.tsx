import { useCallback, useState } from 'react'
import { TransactionDTO } from '../../../types/APIResponseData'
import { FormProvider, useForm } from 'react-hook-form'
import { DevTool } from '@hookform/devtools'
import SingleTransactionForm from './SingleTransactionForm'
import { useMutation } from '@tanstack/react-query'
import { addTransaction } from '../action'

const AddSingleTransaction = () => {
  const methods = useForm<TransactionDTO>({
    reValidateMode: 'onChange',
  })
  const { control, handleSubmit: handleFormSubmission } = methods

  const transactionMutation = useMutation({
    mutationFn: addTransaction,
    onSuccess: () => {
      alert('Transaction added successfully')
    },
    onError: error => {
      alert('Failed to add transaction')
      console.error(error)
    },
  })

  const [transaction, setTransaction] = useState<TransactionDTO>({
    fromAccountID: null,
    fromName: '',
    toAccountID: null,
    toName: '',
    amount: 0,
    temporalStamp: Date.now(),
    description: '',
  })

  const handleDataChange = useCallback((transaction: TransactionDTO) => {
    setTransaction(transaction)
  }, [])

  const handleSubmit = () => {
    console.log(transaction)
    transactionMutation.mutate(transaction)
  }

  return (
    <div>
      <h1 className='main-heading mb-5'>Add Transaction</h1>
      <FormProvider {...methods}>
        <form onSubmit={handleFormSubmission(handleSubmit)}>
          <SingleTransactionForm handleChange={handleDataChange} />
          <div>
            <button type='submit'>Add Transaction</button>
          </div>
          <DevTool control={control} />
        </form>
      </FormProvider>
    </div>
  )
}

export default AddSingleTransaction
