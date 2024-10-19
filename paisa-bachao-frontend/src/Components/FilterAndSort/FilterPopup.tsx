import './filter.scss'

import { FilterType, RangeFilterType } from './types'

import RangeFilter from './Filters/RangeFilter'

const FilterPopup = ({
  filterState,
  filterItems,
}: {
  filterState: [FilterType, (f: FilterType) => void]
  filterItems: (RangeFilterType | FilterType)[]
}) => {
  const [initialFilterState, updateFilterState] = filterState

  return (
    <section className='filterContainer'>
      <h4>Filter</h4>
      {filterItems.map((item, index) => {
        switch (item.filterType) {
          case 'range':
            return (
              <RangeFilter
                initialValues={initialFilterState[item.attribute] ?? {}}
                updateFilters={updateFilterState}
                filterItem={item as RangeFilterType}
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
