import { useState } from 'react'
import './index.scss'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useLocation, useNavigate } from 'react-router-dom'
import { DNA } from 'react-loader-spinner'
import { apiCall } from '../../../api/client'
import { AccountGroup } from '../../../types/APIResponseData'

const AddAccountGroup = () => {
  const [accountGroupName, setAccountGroupName] = useState('')
  const { hash } = useLocation()
  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const createAccountGroup = useMutation({
    mutationFn: (data: { name: string }) =>
      apiCall<{ data: AccountGroup }>({
        url: '/accounts/groups',
        method: 'POST',
        data,
      }),
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
          if (!accountGroupName) return
          createAccountGroup.mutate({ name: accountGroupName })
        }}
      >
        <h1 className='text-center text-xl font-semibold text-accent'>
          Add Account Group
        </h1>
        {createAccountGroup.isPending ? (
          <DNA width={80} height={80} />
        ) : createAccountGroup.isError ? (
          <div>Error...</div>
        ) : createAccountGroup.isSuccess ? (
          <div>Success...</div>
        ) : (
          <>
            <div className='form-control input'>
              <label htmlFor='name' className='form-label input'>
                Account Group Name *
              </label>
              <input
                id='name'
                type='text'
                value={accountGroupName}
                onChange={e => setAccountGroupName(e.target.value)}
              />
            </div>
            <button type='submit' className='btn-block'>
              Create
            </button>
          </>
        )}
      </form>
    </div>
  )
}

export default AddAccountGroup
