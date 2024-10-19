import '../filter.scss'

import { FilterType, RangeFilterType, RangeFilterValueTypes } from '../types'

import useDebounce from '../../../hooks/useDebounce'
import { useEffect } from 'react'

const getConvertedValue = (value: string, inputType: 'date' | 'number') => {
  switch (inputType) {
    case 'date':
      return new Date(value)
    case 'number':
      return parseFloat(value)
    default:
      return value
  }
}

const RangeFilter = ({
  initialValues,
  updateFilters,
  filterItem: { label, attribute, inputType },
}: {
  initialValues: { gte: RangeFilterValueTypes; lte: RangeFilterValueTypes }
  updateFilters: (f: FilterType) => void
  filterItem: RangeFilterType
}) => {
  const [filterValues, setFilterValues, debouncedFilterValues] = useDebounce<{
    gte: RangeFilterValueTypes
    lte: RangeFilterValueTypes
  }>({
    gte: initialValues.gte,
    lte: initialValues.lte,
  })

  useEffect(() => {
    updateFilters({
      [attribute]: {
        gte: debouncedFilterValues.gte || undefined,
        lte: debouncedFilterValues.lte || undefined,
      },
    })
  }, [
    updateFilters,
    attribute,
    debouncedFilterValues.gte,
    debouncedFilterValues.lte,
  ])

  const changeHandler = (type: 'lte' | 'gte', value: string) => {
    setFilterValues({
      ...filterValues,
      [type]: getConvertedValue(value, inputType),
    })
  }

  return (
    <div className='range-filter'>
      <label>{label}</label>
      <input
        type={inputType}
        value={filterValues.gte?.toString() ?? ''}
        onChange={e => changeHandler('gte', e.target.value)}
      />
      <input
        type={inputType}
        value={filterValues.lte?.toString() ?? ''}
        onChange={e => changeHandler('lte', e.target.value)}
      />
    </div>
  )
}

export default RangeFilter
