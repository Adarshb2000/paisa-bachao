import { useState } from 'react'
import './index.scss'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addAccount } from '../action'
import { useLocation, useNavigate } from 'react-router-dom'
import { DNA } from 'react-loader-spinner'
import DataList from '../../../Components/DataList'
import { AccountGroup } from '../../../types/APIResponseData'

const OptionDispaly = ({
  option: account,
}: {
  option: AccountGroup | undefined
}) => <span>{account?.name ?? ''}</span>

const getDisplayValue = (accountGroup: AccountGroup | undefined) =>
  accountGroup?.name ?? ''

const AddAccount = () => {
  const [accountName, setAccountName] = useState('')
  const [initialBalance, setInitialBalance] = useState('')
  const [accountGroup, setAccountGroup] = useState<AccountGroup | undefined>()

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
  return (
    <div className='add-account'>
      <form
        onSubmit={e => {
          e.preventDefault()
          if (!accountName) return
          createAccount.mutate({
            name: accountName,
            balance: initialBalance ? parseInt(initialBalance) : 0,
            accountGroupID: accountGroup?.id || undefined,
          })
        }}
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
                <span>Account Name</span>
                <input
                  id='name'
                  type='text'
                  value={accountName}
                  placeholder=''
                  onChange={e => setAccountName(e.target.value)}
                />
              </label>
            </div>
            <div className='form-control input'>
              <label htmlFor='balance' className='form-label input'>
                <span>Balance</span>
                <input
                  id='balance'
                  type='number'
                  value={initialBalance}
                  placeholder=''
                  onChange={e => setInitialBalance(e.target.value)}
                />
              </label>
            </div>
            <DataList
              id='accountGroup'
              label='Account Group'
              OptionDispaly={OptionDispaly}
              getDisplayValue={getDisplayValue}
              setValue={setAccountGroup}
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
    </div>
  )
}

export default AddAccount
