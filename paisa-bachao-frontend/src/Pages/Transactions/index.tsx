import './index.scss'

import { useEffect, useState } from 'react'

import AddButton from '../../Components/AddButton'
import ClickableCard from '../../Components/ClickableCard'
import { DNA } from 'react-loader-spinner'
import FilterAndSort from '../../Components/FilterAndSort'
import { FilterAndSortType } from '../../Components/FilterAndSort/types'
import { Link } from 'react-router-dom'
import { Transaction } from '../../types/APIResponseData'
import { apiCall } from '../../api/client'
import { useQuery } from '@tanstack/react-query'

const Home = () => {
  const [filterAndSort, setFilterAndSort] = useState<FilterAndSortType>({
    filter: {
      amount: {},
      temporalStamp: {},
    },
    sort: {
      temporalStamp: 'desc',
    },
  })

  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ['transactions', filterAndSort],
    queryFn: async () => {
      console.log('fetching transactions with', filterAndSort)
      return apiCall<{ data: Transaction[] }>({
        url: '/transactions/search',
        method: 'POST',
        data: {
          params: {
            filter: filterAndSort.filter,
            sort: Object.entries(filterAndSort.sort).map(
              ([attribute, order]) => ({ [attribute]: order }),
            ),
          },
        },
      }).then(res => res?.data ?? [])
    },
  })

  useEffect(() => {
    console.log(filterAndSort.filter)
  }, [filterAndSort.filter])

  return (
    <div>
      <h1 className='main-heading'>Transactions</h1>
      <FilterAndSort
        filterAndSortState={[filterAndSort, setFilterAndSort]}
        sortItems={[
          {
            label: 'Date',
            attribute: 'temporalStamp',
            ascLabel: 'Newest',
            descLabel: 'Oldest',
          },
          {
            label: 'Amount',
            attribute: 'amount',
            ascLabel: 'Lowest',
            descLabel: 'Highest',
          },
        ]}
        filterItems={[
          {
            attribute: 'amount',
            filterType: 'range',
            inputType: 'amount',
            label: 'Amount',
          },
          {
            attribute: 'temporalStamp',
            filterType: 'range',
            inputType: 'date',
            label: 'Date',
          },
        ]}
      />
      {isLoading ? <DNA width={80} height={80} /> : null}
      {!isLoading && transactions?.length === 0 ? (
        <p>No transactions yet</p>
      ) : (
        <div className='space-y-4'>
          {transactions?.map(transaction => (
            <ClickableCard
              key={transaction.id}
              className='transaction'
              onClick={() => {}}
            >
              <div className='glance'>
                <span className='from'>{transaction.fromName}</span>
                <span className='amount'>{transaction.amount}</span>
                <span className='to'>{transaction.toName}</span>
              </div>
              <div className='details'></div>
            </ClickableCard>
          ))}
        </div>
      )}
      <AddButton>
        <div>
          <div className='content'>
            <Link to={'/transactions/add'}> Add Transaction </Link>
          </div>
        </div>
      </AddButton>
    </div>
  )
}

export default Home
