import { useState } from 'react'
import './index.scss'
import { formatCurrency } from '../../helpers/helpers'
import { useFormContext, useFormState } from 'react-hook-form'

const CurrencyInput = ({
  value,
  onChange,
  id = 'amount',
  label = 'Amount',
  validations = 'none',
  ...rest
}: {
  value: number
  onChange: (value: number) => void
  id?: string
  label?: string
  validations?: 'none' | 'required' | 'nonzero'
  rest?: { [key: string]: number | string | boolean | undefined }
}) => {
  const [input, setInput] = useState(value.toString())
  const { register } = useFormContext()
  const { errors } = useFormState({
    name: id,
    exact: true,
  })

  const props = register(id, {
    value: value,
    setValueAs: (value: string) =>
      parseFloat(value.toString().replace(/,/g, '') || '0'),
    validate: value => {
      switch (validations) {
        case 'required':
          return value !== '' || 'Required!'
        case 'nonzero':
          return value !== 0 || 'A non-zero amount is required.'
        default:
          return true
      }
    },
    onChange: e => {
      setInput(formatCurrency(e.target.value || '0'))
      onChange(parseFloat(e.target.value.replace(/,/g, '')) || 0)
    },
  })

  return (
    <label
      className={`input currency-input ${errors[id]?.message ? 'invalid' : ''}`}
    >
      {label ? <span className='label'>{label}</span> : null}
      <input
        type='text'
        id={id}
        placeholder=''
        inputMode='decimal'
        value={input}
        {...props}
        {...rest}
      />
      {errors[id]?.message ? (
        <span className='error'>{errors[id]?.message?.toString()}</span>
      ) : null}
    </label>
  )
}

export default CurrencyInput
