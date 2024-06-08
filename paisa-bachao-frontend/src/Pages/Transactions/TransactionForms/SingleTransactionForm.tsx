import { useCallback, useEffect, useState } from 'react'
import AccountInput from '../../Accounts/AccountInput'
import { Account, TransactionDTO } from '../../../types/APIResponseData'
import { GiMoneyStack, GiPayMoney, GiReceiveMoney } from 'react-icons/gi'

import CurrencyInput from '../../../Components/CurrencyInput'
import DatePicker from '../../../Components/DatePicker'
import { FiCalendar } from 'react-icons/fi'
import { BiCommentDetail } from 'react-icons/bi'
import Textarea from '../../../Components/Textarea'
import DataList from '../../../Components/DataList'
import TagInput from '../../Tags/TagInput'
import { FaTags } from 'react-icons/fa'

const defaultTransactionValue = {
  fromName: '',
  toName: '',
  amount: 0,
  temporalStamp: Date.now(),
  description: '',
}

const SingleTransactionForm = ({
  defaultValue = defaultTransactionValue,
  className = '',
  handleChange,
}: {
  defaultValue?: TransactionDTO
  className?: string
  handleChange: (transaction: TransactionDTO) => void
}) => {
  const [transaction, setTransaction] = useState<TransactionDTO>(defaultValue)

  useEffect(() => {
    handleChange(transaction)
  }, [transaction, handleChange])

  const onChangeFromAccount = useCallback(
    (account: Account) => {
      setTransaction(transaction => ({
        ...transaction,
        fromAccountID: account.id,
        fromName: account.name,
      }))
    },
    [setTransaction],
  )
  const onChangeToAccount = useCallback(
    (account: Account) => {
      setTransaction(transaction => ({
        ...transaction,
        toAccountID: account.id,
        toName: account.name,
      }))
    },
    [setTransaction],
  )

  return (
    <div className={`add-transactions ${className}`}>
      <label htmlFor='from-account' className='icon-input'>
        <span className='translate-y-3 text-danger'>
          <GiPayMoney />
        </span>
        <AccountInput
          validations='required'
          name='from-account'
          label=''
          id='from-account'
          onChange={onChangeFromAccount}
        />
      </label>
      <label htmlFor='to-account' className='icon-input'>
        <span className='text-primary'>
          <GiReceiveMoney />
        </span>
        <AccountInput
          name='to-account'
          label=''
          id='to-account'
          onChange={onChangeToAccount}
          validations='required'
        />
      </label>

      <label htmlFor='amount' className='icon-input'>
        <span className='text-primary'>
          <GiMoneyStack />
        </span>
        <CurrencyInput
          value={transaction.amount}
          onChange={(amount: number) => {
            setTransaction(transaction => ({
              ...transaction,
              amount,
            }))
          }}
          label=''
          id='amount'
          validations='nonzero'
        />
      </label>
      <label className='icon-input'>
        <span className='text-secondary'>
          <FiCalendar />
        </span>
        <DatePicker
          value={transaction.temporalStamp}
          onChange={(temporalStamp: number) => {
            setTransaction(transaction => ({
              ...transaction,
              temporalStamp,
            }))
          }}
          label=''
          id='temploral-stamp'
          validations='required'
        />
      </label>
      <label htmlFor='tag'>
        <span className='text-secondary'>
          <FaTags />
        </span>
        <TagInput />
      </label>
      <label className='icon-input'>
        <span className='text-secondary'>
          <BiCommentDetail />
        </span>
        <label className='input'>
          <Textarea
            value={transaction.description}
            onChange={value =>
              setTransaction({ ...transaction, description: value })
            }
          ></Textarea>
        </label>
      </label>
    </div>
  )
}

export default SingleTransactionForm
