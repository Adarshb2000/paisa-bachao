import { useQuery } from '@tanstack/react-query'
import { getTransactions } from './action'
import { DNA } from 'react-loader-spinner'
import { Transactions } from '../../types/APIResponseData'
import ClickableCard from '../../Components/ClickableCard'
import './index.scss'

const Home = () => {
  const { data: transactions, isLoading } = useQuery<Transactions[]>({
    queryKey: ['transactions'],
    queryFn: getTransactions,
  })

  return (
    <div>
      <h1>Transactions</h1>
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
    </div>
  )
}

export default Home
