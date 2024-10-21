import '../filter.scss'

import {
  FilterType,
  RangeFilterItemType,
  RangeFilterType,
  RangeFilterValueTypes,
} from '../types'

import { useState } from 'react'
import { formatCurrency } from '../../../helpers/helpers'
// import { BiX } from 'react-icons/bi'

interface RangeFilterProps {
  initialValues: RangeFilterType
  updateFilters: (f: FilterType<RangeFilterType>) => void
  filterItem: RangeFilterItemType
}

const getConvertedValue = (
  value: string,
  inputType: 'date' | 'number' | 'amount',
) => {
  switch (inputType) {
    case 'date':
      return new Date(value)
    case 'number':
      return parseFloat(value)
    case 'amount':
      return parseFloat(formatCurrency(value)) || undefined
    default:
      return value
  }
}

const RangeFilter = ({
  initialValues,
  updateFilters,
  filterItem: { label, attribute, inputType },
}: RangeFilterProps) => {
  const [filterValues, setFilterValues] = useState<{
    gte: RangeFilterValueTypes
    lte: RangeFilterValueTypes
  }>({
    gte: initialValues.gte,
    lte: initialValues.lte,
  })

  const changeHandler = (type: 'lte' | 'gte', value: string) => {
    setFilterValues({
      ...filterValues,
      [type]: getConvertedValue(value, inputType),
    })
  }

  return (
    <div className='range-filter'>
      <h4>{label}</h4>
      {/* <button className='clear-button'>
        <BiX />
      </button> */}
      <div>
        <label htmlFor={`min-${attribute}`}>
          <span>From</span>
          <input
            type={inputType}
            value={
              (filterValues.gte instanceof Date
                ? filterValues.gte?.toISOString().split('T')[0]
                : filterValues.gte) ?? ''
            }
            onChange={e => changeHandler('gte', e.target.value)}
            onBlur={() => updateFilters({ [attribute]: filterValues })}
            id={`min-${attribute}`}
          />
        </label>
        <label htmlFor='max'>
          <span>To</span>
          <input
            type={inputType}
            value={
              (filterValues.lte instanceof Date
                ? filterValues.lte?.toISOString().split('T')[0]
                : filterValues.lte) ?? ''
            }
            onChange={e => changeHandler('lte', e.target.value)}
            onBlur={() => updateFilters({ [attribute]: filterValues })}
          />
        </label>
      </div>
    </div>
  )
}

export default RangeFilter
