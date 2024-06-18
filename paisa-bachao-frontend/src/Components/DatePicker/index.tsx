import dayjs from 'dayjs'
import { useFormContext, useFormState } from 'react-hook-form'

const DatePicker = ({
  value,
  onChange,
  id = 'date',
  label = 'Date',
  validations = 'none',
  ...rest
}: {
  value: number
  onChange: (date: number) => void
  id?: string
  label?: string
  validations?: 'none' | 'required'
  rest?: { [key: string]: string | number | boolean | undefined }
}) => {
  const { register } = useFormContext()
  const props = register(id, {
    value: dayjs(value).format('YYYY-MM-DDTHH:mm'),
    onChange: e => {
      onChange(dayjs(e.target.value).valueOf())
    },
    onBlur: e => {
      onChange(dayjs(e.target.value).valueOf())
    },
    validate: value => {
      switch (validations) {
        case 'required':
          return value !== '' || 'Required!'
        default:
          return true
      }
    },
  })

  const { errors } = useFormState({
    name: id,
  })

  return (
    <label
      className={`input date-picker ${errors[id]?.message ? 'invalid' : ''}`}
    >
      {label ? <span>{label}</span> : null}
      <input type='datetime-local' id={id} {...props} {...rest} />
      {errors[id]?.message ? (
        <span className='error'>{errors[id]?.message.toString()}</span>
      ) : null}
    </label>
  )
}

export default DatePicker
