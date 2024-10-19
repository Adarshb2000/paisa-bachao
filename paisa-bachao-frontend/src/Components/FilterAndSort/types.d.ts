export type SortItemType = {
  label: string
  attribute: string
  ascLabel?: string
  descLabel?: string
}

export type GenericFilterType = {
  label: string
  attribute: string
  filterType: 'range' | 'radio' | 'checkbox' | 'search'
}

export interface RangeFilterType extends GenericFilterType {
  filterType: 'range'
  inputType: 'number' | 'date'
}

export type RangeFilterValueTypes = number | Date | null

export type FilterType = {
  [key: string]: any
}

export type SortType = {
  [key: string]: 'asc' | 'desc' | undefined
}

export type FilterAndSortType = {
  filter: FilterType
  sort: SortType
}

export type FilterAndSortStateType = [
  FilterAndSortType,
  React.Dispatch<React.SetStateAction<FilterAndSortType>>,
]
