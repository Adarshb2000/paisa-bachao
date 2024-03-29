import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getAccount } from '../action'
import { Account as AccountType } from '../../../types/APIResponseData'

import './index.scss'
import { DNA } from 'react-loader-spinner'

const Account = () => {
  const { id } = useParams()

  const {
    data: account,
    isLoading: isLoadingAccount,
    isError: isErrorAccount,
    error: accountError,
  }: {
    data: AccountType | undefined
    isLoading: boolean
    isError: boolean
    error: Error | null
  } = useQuery({
    queryKey: ['account', id!],
    queryFn: getAccount,
  })

  return (
    <div className='account'>
      {isLoadingAccount ? (
        <div>
          <DNA height={400} width={400} />
        </div>
      ) : isErrorAccount ? (
        <div>Error: {accountError?.message}</div>
      ) : (
        <div>
          <h1 className='text-center text-4xl text-primary first-letter:capitalize'>
            {account?.name}
          </h1>
          <p>
            Balance:{' '}
            <span className='rounded-lg bg-secondary px-2 text-3xl text-charcol'>
              {account?.balance}
            </span>
          </p>
          {account?.accountGroup && <p>Group: {account?.accountGroup?.name}</p>}
          <div>
            <button>Edit</button>
            <button>Delete</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Account
