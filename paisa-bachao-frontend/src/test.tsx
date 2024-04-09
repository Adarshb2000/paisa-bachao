import { useState } from 'react'
import './styles/formElements.scss'
import Input from './Components/Input'
import AccountInput from './Pages/Accounts/AccountInput'

const Test = () => {
  const [value, setValue] = useState('')
  return (
    <main className='mx-auto h-full max-w-[1024px] bg-dark p-5 text-light'>
      <h1>Test</h1>
      <AccountInput />
    </main>
  )
}

export default Test
