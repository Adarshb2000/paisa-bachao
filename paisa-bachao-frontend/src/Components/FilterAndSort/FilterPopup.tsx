import './filter.scss'

import {
  FilterItemType,
  FilterType,
  RangeFilterItemType,
  RangeFilterType,
} from './types'

import RangeFilter from './Filters/RangeFilter'

const FilterPopup = ({
  filterState,
  filterItems,
}: {
  filterState: [
    FilterType<RangeFilterType>,
    (f: FilterType<RangeFilterType>) => void,
  ]
  filterItems: FilterItemType[]
}) => {
  const [initialFilterState, updateFilterState] = filterState

  return (
    <section className='filterContainer'>
      <h3>Filter</h3>
      {filterItems.map((item, index) => {
        switch (item.filterType) {
          case 'range':
            return (
              <RangeFilter
                initialValues={initialFilterState[item.attribute] ?? {}}
                updateFilters={value => {
                  updateFilterState({
                    ...initialFilterState,
                    ...value,
                  })
                }}
                filterItem={item as RangeFilterItemType}
                key={index}
              />
            )
          case 'radio':
            return <>TODO</>
          case 'checkbox':
            return <>TODO</>
          default:
            return <>TODO</>
        }
      })}
    </section>
  )
}
export default FilterPopup
