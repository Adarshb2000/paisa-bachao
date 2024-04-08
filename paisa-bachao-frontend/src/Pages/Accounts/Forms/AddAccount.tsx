import { useCallback, useState } from 'react'
import './index.scss'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addAccount } from '../action'
import { useLocation, useNavigate } from 'react-router-dom'
import { DNA } from 'react-loader-spinner'
import DataList from '../../../Components/DataList'
import { Account, AccountGroup } from '../../../types/APIResponseData'
import { FormProvider, useForm } from 'react-hook-form'
import CurrencyInput from '../../../Components/CurrencyInput'

const OptionDispaly = ({
  option: account,
}: {
  option: AccountGroup | undefined
}) => <span>{account?.name ?? ''}</span>

const getDisplayValue = (accountGroup: AccountGroup | undefined) =>
  accountGroup?.name ?? ''

const AddAccount = () => {
  const [account, setAccount] = useState({
    name: '',
    balance: 0,
    accountGroupID: '',
  })
  const [accountName, setAccountName] = useState('')

  const methods = useForm<Account>()

  const { hash } = useLocation()
  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const createAccount = useMutation({
    mutationFn: addAccount,
    onSuccess: () => {
      queryClient.invalidateQueries()
      setTimeout(() => {
        if (hash === '#add-button') {
          navigate('')
        }
      }, 1000)
    },
    onError: error => {
      console.error(error)
    },
  })

  const handleAccountGroupChange = useCallback(
    (value: string, options: AccountGroup[]) => {
      const accountGroup = options.find(option => option.id === value)
      setAccount(account => ({
        ...account,
        accountGroupID: accountGroup?.id || '',
      }))
    },
    [],
  )

  const handleBalanceChange = useCallback((value: number) => {
    setAccount(account => ({ ...account, balance: value }))
  }, [])

  return (
    <div className='add-account'>
      <FormProvider {...methods}>
        <form
          noValidate
          onSubmit={methods.handleSubmit(() => {
            createAccount.mutate(account)
          })}
        >
          <h1 className='text-center text-xl font-semibold text-accent'>
            Add Account
          </h1>
          {createAccount.isPending ? (
            <DNA width={80} height={80} />
          ) : createAccount.isError ? (
            <div>Error...</div>
          ) : createAccount.isSuccess ? (
            <div>Success...</div>
          ) : (
            <>
              <div className='form-control input'>
                <label htmlFor='name' className='form-label input'>
                  <span className='label'>Account Name</span>
                  <input
                    id='name'
                    type='text'
                    required
                    value={accountName}
                    placeholder=''
                    onChange={e => setAccountName(e.target.value.trim())}
                    onBlur={e => setAccountName(e.target.value.trim())}
                  />
                </label>
              </div>
              <CurrencyInput
                id='initialBalance'
                label='Initial Balance'
                value={account.balance}
                onChange={handleBalanceChange}
              />
              <DataList
                id='accountGroup'
                label='Account Group'
                OptionDispaly={OptionDispaly}
                getDisplayValue={getDisplayValue}
                onChange={handleAccountGroupChange}
                name='accountGroup'
                validations='exists'
                dataURL={`${import.meta.env.VITE_BACKEND_URL}/accounts/groups`}
                searchTag='name'
                pageSize={3}
                className='form-control input'
              />
              <button type='submit' className='btn-block'>
                Add Account
              </button>
            </>
          )}
        </form>
      </FormProvider>
    </div>
  )
}

export default AddAccount
