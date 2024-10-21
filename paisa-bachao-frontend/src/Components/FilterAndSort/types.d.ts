export type SortItemType = {
  label: string
  attribute: string
  ascLabel?: string
  descLabel?: string
}

export type GenericFilterItemType = {
  label: string
  attribute: string
  filterType: 'range' | 'radio' | 'checkbox' | 'search'
  inputType?: 'number' | 'date'
}

export interface RangeFilterItemType extends GenericFilterItemType {
  filterType: 'range'
  inputType: 'number' | 'date'
}

export interface RangeFilterType {
  gte: RangeFilterValueTypes
  lte: RangeFilterValueTypes
}

export type RangeFilterValueTypes = number | 'amount' | Date | null | undefined

export type FilterItemType = RangeFilterItemType | GenericFilterItemType

export interface FilterType<T> {
  [attribute: string]: T
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
