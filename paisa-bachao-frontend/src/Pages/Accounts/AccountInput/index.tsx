import { FC, useCallback, useEffect, useState } from 'react'
import DataList from '../../../Components/DataList'
import { Account } from '../../../types/APIResponseData'

const AccountListElement = ({ option }: { option: Account | undefined }) => {
  return (
    <>
      <span>{option?.name}</span>
      <span>{option?.accountGroup?.name}</span>
    </>
  )
}

const getDisplayValue = (option: Account | undefined) => option?.name || ''

const AccountInput: FC<AccountInputProps> = ({
  defaultAccount = {} as Account,
  onChange,
  validations = 'none',
  name,
  id = 'account-search',
  label = 'Account',
}) => {
  const [account, setAccount] = useState<Account | undefined>(defaultAccount)

  useEffect(() => {
    onChange(account ?? ({} as Account))
  }, [account, onChange])

  const handleInputChange = useCallback((value: string, options: Account[]) => {
    const account = options.find(option => option.name === value)
    if (account) {
      setAccount(account)
    } else {
      setAccount({
        name: value,
      } as Account)
    }
  }, [])

  return (
    <div className='relative'>
      <DataList
        defaultValue={defaultAccount}
        name={name}
        dataURL={`${import.meta.env.VITE_BACKEND_URL}/accounts`}
        OptionDispaly={AccountListElement}
        searchTag='name'
        id={id}
        label={label}
        getDisplayValue={getDisplayValue}
        onChange={handleInputChange}
        validations={validations}
      />
      {account?.accountGroup ? (
        <span className='absolute right-3 top-3 text-xs'>
          {account?.accountGroup?.name}
        </span>
      ) : null}
    </div>
  )
}

export default AccountInput

interface AccountInputProps {
  defaultAccount?: Account
  onChange: (account: Account) => void
  id?: string
  name: string
  label?: string
  validations?: 'none' | 'exists' | 'required'
}
