import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import './index.scss'
import { AxiosError } from 'axios'
import ClickableCard from '../../Components/ClickableCard'
import AccountsAddButton from './AddButton'
import { useNavigate } from 'react-router-dom'
import { apiCall } from '../../api/client'
import { Account as AccountType } from '../../types/APIResponseData'

const Accounts = () => {
  const navigate = useNavigate()

  const [searchString, setSearchString] = useState('')
  const {
    data: accounts,
    isError,
    isLoading,
    error,
  }: {
    data: AccountType[] | undefined
    isError: boolean
    isLoading: boolean
    error: AxiosError | null
  } = useQuery({
    queryKey: ['accounts', searchString],
    queryFn: () =>
      apiCall<{ data: AccountType[] }>({ url: '/accounts' }).then(
        res => res?.data ?? {},
      ),
  })

  if (isError) return <div>Error: {JSON.stringify(error)}</div>
  return (
    <div className='accounts'>
      <h1 className='main-heading'>Accounts</h1>
      <div className='input'>
        <label htmlFor='search'>Search</label>
        <input
          id='search'
          type='text'
          className='bg-secondary'
          value={searchString}
          onChange={e => setSearchString(e.target.value)}
        />
      </div>
      <div className='space-y-4'>
        {isLoading
          ? 'Loading...'
          : accounts?.map(account => (
              <ClickableCard
                key={account.id}
                onClick={() => {
                  navigate(`/accounts/${account.id}`)
                }}
              >
                {account.name}: {account.balance}
              </ClickableCard>
            ))}
      </div>
      <AccountsAddButton />
    </div>
  )
}
export default Accounts
