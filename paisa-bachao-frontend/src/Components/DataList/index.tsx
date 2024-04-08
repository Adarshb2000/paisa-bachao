import { useQuery } from '@tanstack/react-query'
import { getDataListOptions } from './action'
import {
  FunctionComponent as FC,
  KeyboardEventHandler,
  useEffect,
  useRef,
  useState,
} from 'react'

import '../../styles/global.scss'
import './index.scss'
import { useFormContext, useFormState } from 'react-hook-form'

export default function DataList<
  T extends {
    id: string | undefined
  },
>({
  name,
  id,
  label,
  dataURL,
  defaultValue = undefined,
  OptionDispaly,
  getDisplayValue = (option: T | undefined) => option?.toString() ?? '',
  searchTag = 'search',
  onChange,
  className = '',
  pageSize = 5,
  validations = 'none',
}: DataListProps<T>) {
  const [input, setInput] = useState('')

  const [currentHighlightedOptionIndex, setCurrentHighlightedOptionIndex] =
    useState<number>(-1)

  const { register } = useFormContext()

  const props = register(name, {
    value: getDisplayValue(defaultValue),
    onChange: e => {
      setCurrentHighlightedOptionIndex(-1)
      setInput(e.target.value)
    },
    validate: value => {
      switch (validations) {
        case 'exists':
          return (options?.[0] && getDisplayValue(options[0]) !== '') || 'Nah!'
        case 'required':
          return value !== '' || 'Required!'
        default:
          return true
      }
    },
  })

  const { errors } = useFormState({
    name: name,
  })

  const datalistRef = useRef<HTMLUListElement>(null)

  const {
    data: options,
  }: {
    data: T[] | undefined
  } = useQuery({
    queryKey: [
      id,
      dataURL,
      { [searchTag]: input || undefined, pageSize: pageSize },
    ],
    queryFn: getDataListOptions,
  })

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = e => {
    if (
      options?.length === 0 ||
      (options?.length === 1 && getDisplayValue(options[0]) === input)
    )
      return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setCurrentHighlightedOptionIndex(
        (currentHighlightedOptionIndex + 1) % (options?.length ?? 0),
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setCurrentHighlightedOptionIndex(
        ((options?.length || 0) + currentHighlightedOptionIndex - 1) %
          (options?.length ?? 0),
      )
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (currentHighlightedOptionIndex !== -1) {
        setInput(getDisplayValue(options?.[currentHighlightedOptionIndex]))
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setInput('')
      setCurrentHighlightedOptionIndex(-1)
      if (input === '') {
        e.currentTarget?.blur()
      }
    }
  }

  useEffect(() => {
    onChange(input, options ?? [])
  }, [input, options, onChange])

  return (
    <label
      className={`${className} ${errors[name]?.message ? 'invalid' : ''} input datalist`}
    >
      {label ? <span className='label'>{label}</span> : null}
      <input
        type='text'
        {...props}
        id={id}
        value={input}
        list={id + '_list'}
        placeholder=''
        autoComplete={'off'}
        aria-haspopup='listbox'
        aria-expanded={!!options?.length}
        aria-autocomplete='list'
        role='combobox'
        onKeyDown={onKeyDown}
      />
      {errors[name]?.message ? (
        <p className='error'>{errors[name]?.message?.toString()}</p>
      ) : null}
      {options?.length !== 0 &&
      !(options?.length === 1 && getDisplayValue(options[0]) === input) ? (
        <ul
          id={id + '_list'}
          className='datalist_list'
          role='listbox'
          ref={datalistRef}
        >
          {options?.map((option, index) => (
            <li
              role='option'
              tabIndex={-1}
              onClick={() => {
                setInput(getDisplayValue(option))
              }}
              className={`
                flex flex-col ${index === currentHighlightedOptionIndex ? 'highlighted' : ''}
              `}
              key={option.id ?? index}
              onMouseOver={() => setCurrentHighlightedOptionIndex(index)}
            >
              <OptionDispaly option={option} />
            </li>
          ))}
        </ul>
      ) : null}
    </label>
  )
}

interface DataListProps<T> {
  name: string
  id: string
  label: string
  dataURL: string
  OptionDispaly: FC<{ option: T | undefined }>
  getDisplayValue?: (option: T | undefined) => string
  searchTag?: string
  onChange: (value: string, options: T[]) => void
  className?: string
  hideOnNoData?: boolean
  pageSize?: number
  defaultValue?: T
  validations?: 'none' | 'exists' | 'required'
}
