import { useQuery } from '@tanstack/react-query'
import { getDataListOptions } from './action'
import { useEffect, useState } from 'react'

const DataList = ({
  id,
  label,
  dataURL,
  optionLabel,
  setValue,
  className = '',
  // hideOnNoData = false,
}: DataListProps) => {
  const [input, setInput] = useState('')
  const {
    data: options,
  }: {
    data: any[] | undefined
  } = useQuery({
    queryKey: [id, dataURL, { search: input || undefined }],
    queryFn: getDataListOptions,
  })

  useEffect(() => {
    const x =
      options?.findIndex(option => option[optionLabel.value] === input) ?? -1
    if (x !== -1) {
      console.log(options?.[x])
      setValue(options?.[x])
    }
  }, [input, options, setValue, optionLabel])

  return (
    <div className={className}>
      <label htmlFor={id}>{label}</label>
      <input
        type='text'
        id={id}
        list={id + '_list'}
        value={input}
        onChange={e => {
          setInput(e.target.value)
        }}
        autoComplete={'off'}
      />
      <datalist id={id + '_list'}>
        {options?.map(option => (
          <option key={option.id} value={option[optionLabel.value]}>
            {optionLabel.label ?? null}
          </option>
        ))}
      </datalist>
    </div>
  )
}

export default DataList

interface DataListProps {
  id: string
  label: string
  dataURL: string
  setValue: ReturnType<typeof useState<any>>[1]
  optionLabel: {
    value: string
    label?: string
  }
  className?: string
  hideOnNoData?: boolean
}
