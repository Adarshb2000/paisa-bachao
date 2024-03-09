import { useEffect, useState } from 'react'
import AddButton from '../../../Components/AddButton'
import AddAccount from '../Forms/AddAccount'
import { useLocation } from 'react-router-dom'
import AddAccountGroup from '../Forms/AddAccountGroup'

const AccountsAddButton = () => {
  const [addAccountForm, showAddAccountForm] = useState(false)
  const [addAccountGroupForm, showAddAccountGroupForm] = useState(false)
  const { hash } = useLocation()
  const visible = hash === '#add-button'

  useEffect(() => {
    showAddAccountForm(false)
    showAddAccountGroupForm(false)
  }, [visible])

  return (
    <AddButton>
      <div className='add-button'>
        {addAccountForm ? (
          <AddAccount />
        ) : addAccountGroupForm ? (
          <AddAccountGroup />
        ) : (
          <>
            <button onClick={() => showAddAccountForm(true)}>
              Add Account
            </button>
            <p>
              <span>or</span>
            </p>
            <button onClick={() => showAddAccountGroupForm(true)}>
              Create Account Group
            </button>
          </>
        )}
      </div>
    </AddButton>
  )
}

export default AccountsAddButton
