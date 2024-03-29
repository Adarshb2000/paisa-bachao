import { useState } from 'react'
import DataList from '../../../Components/DataList'
import { Account } from '../../../types/APIResponseData'

const AccountListElement = ({ option }: { option: Account }) => {
  return (
    <>
      <span>{option.name}</span>
      <span>{option.accountGroup?.name}</span>
    </>
  )
}

const getDisplayValue = (option: Account | undefined) => option?.name ?? ''

const AccountInput = () => {
  const [account, setAccount] = useState<Account | undefined>({} as Account)

  return (
    <div>
      <DataList
        dataURL={`${import.meta.env.VITE_BACKEND_URL}/accounts`}
        OptionDispaly={AccountListElement}
        searchTag='name'
        id='account-search'
        label='Account'
        getDisplayValue={getDisplayValue}
        setValue={setAccount}
        className='input'
      />
      {account?.accountGroup?.name ? (
        <label className='input'>
          <span>Account Group</span>
          <input
            type='text'
            name='accountGroup'
            id='account-group'
            value={account?.accountGroup?.name ?? ''}
            readOnly
          />
        </label>
      ) : null}
    </div>
  )
}

export default AccountInput
