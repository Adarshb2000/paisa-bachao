import { useState } from 'react'
import './index.scss'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addAccountGroup } from '../action'
import { useLocation, useNavigate } from 'react-router-dom'
import { DNA } from 'react-loader-spinner'

const AddAccountGroup = () => {
  const [accountGroupName, setAccountGroupName] = useState('')
  const { hash } = useLocation()
  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const createAccountGroup = useMutation({
    mutationFn: addAccountGroup,
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
          createAccountGroup.mutate(accountGroupName)
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
