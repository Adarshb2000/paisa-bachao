import { useCallback, useState } from 'react'
import './index.scss'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { DNA } from 'react-loader-spinner'
import DataList from '../../../Components/DataList'
import {
  Account,
  AccountGroup,
  CreateAccountDTO,
} from '../../../types/APIResponseData'
import { FormProvider, useForm } from 'react-hook-form'
import CurrencyInput from '../../../Components/CurrencyInput'
import { apiCall } from '../../../api/client'
import { toast } from 'react-toastify'

const OptionDispaly = ({
  option: account,
}: {
  option: AccountGroup | undefined
}) => <span>{account?.name ?? ''}</span>

const getDisplayValue = (accountGroup: AccountGroup | undefined) =>
  accountGroup?.name ?? ''

const AddAccount = () => {
  const [account, setAccount] = useState<CreateAccountDTO>({
    name: '',
    balance: 0,
    accountGroupID: '',
  })

  const methods = useForm<Account>()

  const { hash } = useLocation()
  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const createAccount = useMutation({
    mutationFn: (account: CreateAccountDTO) =>
      apiCall<Account>({
        url: '/accounts',
        method: 'POST',
        data: account,
      }),
    onSuccess: () => {
      toast('Account Added Successfully', {
        type: 'success',
        position: 'top-right',
      })
      queryClient.invalidateQueries()
      setTimeout(() => {
        if (hash === '#add-button') {
          navigate('')
        }
      }, 1000)
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
          ) : (
            <>
              <div className='form-control input'>
                <label htmlFor='name' className='form-label input'>
                  <span className='label'>Account Name</span>
                  <input
                    id='name'
                    type='text'
                    required
                    value={account.name}
                    placeholder=''
                    onChange={e =>
                      setAccount({ ...account, name: e.target.value.trim() })
                    }
                    onBlur={e =>
                      setAccount({ ...account, name: e.target.value.trim() })
                    }
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
                dataURL={'/accounts/groups'}
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
