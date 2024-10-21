import { BiX } from 'react-icons/bi'
import { FilterAndSortStateType, FilterItemType, SortItemType } from './types'
import { getDateString } from '../../helpers/helpers'
import './chips.scss'
import { FaArrowDown, FaArrowUp } from 'react-icons/fa'

const Chip = ({
  children,
  onClickHandler,
}: {
  children: React.ReactNode
  onClickHandler: () => void
}) => {
  return (
    <div className='chip'>
      <div>{children}</div>
      <button onClick={onClickHandler}>
        <BiX />
      </button>
    </div>
  )
}

const labelMap = new Map([
  ['date', '📅'],
  ['amount', '💵'],
])

const getContent = (
  value: string | number | Date | undefined,
  inputType: 'date' | 'number' | undefined,
  minima = false,
) => {
  switch (inputType) {
    case 'date':
      return value
        ? getDateString(new Date(value))
        : minima
          ? 'Big Bang'
          : 'Today'
    case 'number':
      return value ? '₹ ' + value.toString() : minima ? '₹ 0' : 'ထ'
    default:
      return value?.toString()
  }
}

const Chips = ({
  filterAndSortState,
  filterItems,
  sortItems,
}: {
  filterAndSortState: FilterAndSortStateType
  filterItems: FilterItemType[]
  sortItems: SortItemType[]
}) => {
  const [filterAndSort, setFilterAndSort] = filterAndSortState
  return (
    <div className='chips'>
      <div className='sort'>
        {sortItems.map(
          ({ attribute, label }) =>
            filterAndSort.sort[attribute] && (
              <Chip
                key={attribute + 'sort'}
                onClickHandler={() =>
                  setFilterAndSort({
                    ...filterAndSort,
                    sort: {
                      ...filterAndSort.sort,
                      [attribute]: undefined,
                    },
                  })
                }
              >
                <span className='label'>
                  {labelMap.get(label.toLowerCase()) ?? label}
                </span>
                <span>
                  {filterAndSort.sort[attribute] === 'asc' ? (
                    <FaArrowUp />
                  ) : (
                    <FaArrowDown />
                  )}
                </span>
              </Chip>
            ),
        )}
      </div>
      <div className='filter'>
        {filterItems.map(({ attribute, filterType, label, inputType }) => {
          const value = filterAndSort.filter[attribute]

          switch (filterType) {
            case 'range':
              if (!value || Object.keys(value).length === 0) return null

              return (
                <Chip
                  key={attribute + 'filter'}
                  onClickHandler={() =>
                    setFilterAndSort({
                      ...filterAndSort,
                      filter: {
                        ...filterAndSort.filter,
                        [attribute]: undefined,
                      },
                    })
                  }
                >
                  <span className='label'>
                    {labelMap.get(label.toLowerCase()) ?? label}
                  </span>
                  <span>{getContent(value.gte, inputType, true)}</span>
                  <span className='divider'>...</span>
                  <span>{getContent(value.lte, inputType)}</span>
                </Chip>
              )
            default:
              return (
                <Chip
                  key={attribute + 'filter'}
                  onClickHandler={() =>
                    setFilterAndSort({
                      ...filterAndSort,
                      filter: {
                        ...filterAndSort.filter,
                        [attribute]: undefined,
                      },
                    })
                  }
                >
                  {label}
                </Chip>
              )
          }
        })}
      </div>
    </div>
  )
}

export default Chips
