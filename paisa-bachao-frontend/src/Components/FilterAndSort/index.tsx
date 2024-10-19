import './index.scss'

import {
  FilterAndSortStateType,
  FilterAndSortType,
  FilterType,
  SortItemType,
  SortType,
} from './types'
import { useCallback, useState } from 'react'

import { FaSortAlphaDown } from 'react-icons/fa'
import FilterPopup from './FilterPopup'
import { IoFilterCircleOutline } from 'react-icons/io5'
import Modal from '../Modal'
import Sort from './Sort'

const FilterAndSort = ({
  filterAndSortState,
  sortItems = [],
  filterItems = [],
}: {
  filterAndSortState: FilterAndSortStateType
  sortItems?: SortItemType[]
  filterItems?: FilterType[]
}) => {
  const [modal, setModal] = useState('')

  const [filterAndSort, setFilterAndSort] = filterAndSortState

  const updateSort = useCallback(
    (sort: SortType) => {
      setFilterAndSort((filterAndSort: FilterAndSortType) => ({
        filter: filterAndSort.filter,
        sort: { ...filterAndSort.sort, ...sort },
      }))
    },
    [setFilterAndSort],
  )

  const updateFilter = useCallback(
    (filter: FilterType) => {
      setFilterAndSort((filterAndSort: FilterAndSortType) => ({
        ...filterAndSort,
        filter,
      }))
    },
    [setFilterAndSort],
  )

  return (
    <div className='filter-and-sort'>
      <search>
        <input type='search' placeholder='Search' />
      </search>
      <button className='sort' onClick={() => setModal('sort')}>
        <FaSortAlphaDown />
      </button>
      <button className='filter' onClick={() => setModal('filter')}>
        <IoFilterCircleOutline />
      </button>
      {modal ? (
        <Modal handleRequestClose={() => setModal('')}>
          <>
            {modal === 'sort' ? (
              <Sort
                sortState={[filterAndSort.sort, updateSort]}
                sortItems={sortItems}
              />
            ) : null}
            {modal === 'filter' ? (
              <FilterPopup
                filterState={[filterAndSort.filter, updateFilter]}
                filterItems={filterItems}
              />
            ) : null}
          </>
        </Modal>
      ) : null}
    </div>
  )
}

export default FilterAndSort