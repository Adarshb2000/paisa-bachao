import './sort.scss'

import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa'
import { SortItemType, SortType } from './types'

import { motion } from 'framer-motion'

const Sort = ({
  sortState,
  sortItems,
}: {
  sortState: [SortType, (s: SortType) => void]
  sortItems: SortItemType[]
}) => {
  const [initialSortState, updateSortState] = sortState

  return (
    <section className='sort-container'>
      <h4 className='flex items-center justify-center'>
        <span>Organize</span>
      </h4>
      {sortItems?.map((item, index) => (
        <SortElement
          item={item}
          initialValue={initialSortState[item.attribute] ?? ''}
          updateSort={updateSortState}
          key={index}
        />
      ))}
    </section>
  )
}

const DispalyElem = ({
  sortOrder,
  item,
}: {
  sortOrder: string
  item: SortItemType
}) => {
  switch (sortOrder) {
    case 'asc':
      return (
        <>
          {item.ascLabel ?? item.label}
          <motion.span
            className='text-2xl'
            key={'asc'}
            initial={{ y: 100 }}
            animate={{ y: 5 }}
          >
            <FaSortUp />
          </motion.span>
        </>
      )
    case 'desc':
      return (
        <>
          {item.descLabel ?? item.label}
          <motion.span
            className='text-2xl'
            key={'desc'}
            initial={{ y: -100 }}
            animate={{ y: -5 }}
          >
            <FaSortDown />
          </motion.span>
        </>
      )
    default:
      return (
        <>
          {item.label}
          <motion.span
            key={'none'}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            <FaSort />
          </motion.span>
        </>
      )
  }
}

const SortElement = ({
  item,
  initialValue,
  updateSort,
}: {
  item: SortItemType
  initialValue: 'asc' | 'desc' | ''
  updateSort: (s: SortType) => void
}) => {
  const updateState = () => {
    const order =
      initialValue === '' ? 'asc' : initialValue === 'asc' ? 'desc' : ''

    updateSort({ [item.attribute]: order || undefined })
  }

  return (
    <motion.button
      className={`asc ${initialValue ? 'active' : ''}`}
      whileTap={{ scale: 0.9 }}
      onClick={() => updateState()}
    >
      <DispalyElem sortOrder={initialValue || ''} item={item} />
    </motion.button>
  )
}

export default Sort
