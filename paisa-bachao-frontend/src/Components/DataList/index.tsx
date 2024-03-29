import { useQuery } from '@tanstack/react-query'
import { getDataListOptions } from './action'
import {
  FunctionComponent as FC,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from 'react'
import '../../styles/global.scss'
import './index.scss'

const DataList = <T extends OptionExpectedProps>({
  id,
  label,
  dataURL,
  OptionDispaly,
  getDisplayValue = option => option?.value ?? '',
  searchTag = 'search',
  setValue,
  className = '',
  pageSize = 5,
  forwardRef,
}: DataListProps<T>) => {
  const [input, setInput] = useState('')
  const [currentHighlightedOptionIndex, setCurrentHighlightedOptionIndex] =
    useState<number>(-1)
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

  useEffect(() => {
    const option = options?.find(option => getDisplayValue(option) === input)
    if (!option) {
      setValue({} as T)
      return
    }
    setValue(option)
  }, [input, options, setValue, getDisplayValue])

  return (
    <label className={`${className} input datalist`}>
      <span>{label}</span>
      <input
        type='text'
        id={id}
        list={id + '_list'}
        value={input}
        placeholder=''
        onChange={e => {
          setInput(e.target.value)
          setCurrentHighlightedOptionIndex(-1)
        }}
        onBlur={() => {
          if (currentHighlightedOptionIndex !== -1) {
            setInput(getDisplayValue(options?.[currentHighlightedOptionIndex]))
          }
        }}
        autoComplete={'off'}
        ref={forwardRef}
        aria-haspopup='listbox'
        aria-expanded={!!options?.length}
        aria-autocomplete='list'
        role='combobox'
        onKeyDown={e => {
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
              setInput(
                getDisplayValue(options?.[currentHighlightedOptionIndex]),
              )
            }
          } else if (e.key === 'Escape') {
            e.preventDefault()
            setInput('')
            setCurrentHighlightedOptionIndex(-1)
            if (input === '') {
              setValue({} as T)
              e.currentTarget.blur()
            }
          }
        }}
      />
      {options?.length !== 0 &&
      !(options?.length === 1 && getDisplayValue(options[0]) === input) ? (
        <ul
          id={id + '_list'}
          className='datalist'
          role='listbox'
          ref={datalistRef}
        >
          {options?.map((option, index) => (
            <li
              role='option'
              tabIndex={-1}
              className={`
                flex flex-col ${index === currentHighlightedOptionIndex ? 'highlighted' : ''}
              `}
              key={option.id ?? index}
              onMouseOver={() => setCurrentHighlightedOptionIndex(index)}
            >
              <span>
                <OptionDispaly option={option} />
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </label>
  )
}

export default DataList

interface OptionExpectedProps {
  value?: string
  id?: string
}
interface DataListProps<T> {
  id: string
  label: string
  dataURL: string
  OptionDispaly: FC<{ option: T | undefined }>
  getDisplayValue?: (option: T | undefined) => string
  searchTag?: string
  setValue: ReturnType<typeof useState<T>>[1]
  className?: string
  hideOnNoData?: boolean
  forwardRef?: MutableRefObject<HTMLInputElement>
  pageSize?: number
}
