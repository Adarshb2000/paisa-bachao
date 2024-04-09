import { useQuery } from '@tanstack/react-query'
import { DNA } from 'react-loader-spinner'
import { Transaction } from '../../types/APIResponseData'
import ClickableCard from '../../Components/ClickableCard'
import './index.scss'
import AddButton from '../../Components/AddButton'
import { Link } from 'react-router-dom'
import { client } from '../../hooks/useAuth'
import { apiCall } from '../../api/client'

const Home = () => {
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: () =>
      apiCall<{ data: Transaction[] }>({ url: '/transactions' }).then(
        res => res?.data ?? [],
      ),
  })

  return (
    <div>
      <h1 className='main-heading'>
        <span className='text-3xl text-white'>Welcome Back, </span>
        <span>{client.tokenParsed?.given_name}</span>
      </h1>

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
