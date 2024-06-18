import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

import AddAccount from './Pages/Accounts/Forms/AddAccount.tsx'
import Accounts from './Pages/Accounts'
import PageLayout from './Components/PageLayout'
import Home from './Pages/Transactions/index.tsx'
import Account from './Pages/Accounts/Account/index.tsx'

import './index.css'
import './styles/global.scss'
import Test from './test.tsx'
import AddTransaction from './Pages/Transactions/TransactionForms/AddSingleTransaction.tsx'
import { toast } from 'react-toastify'
import Tags from './Pages/Tags/index.tsx'
import AddSplitTransaction from './Pages/Transactions/TransactionForms/AddSplitTransaction.tsx'

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: error => {
      toast(error.message, {
        type: 'error',
        position: 'top-right',
      })
    },
  }),
  mutationCache: new MutationCache({
    onError: error => {
      toast(error.message, {
        type: 'error',
        autoClose: 5000,
        position: 'top-right',
      })
    },
  }),
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <PageLayout />,
    children: [
      { path: '', element: <Home /> },
      { path: 'add-account', element: <AddAccount /> },
      { path: 'accounts', element: <Accounts /> },
      { path: 'accounts/:id', element: <Account /> },
      {
        path: 'transactions',
        children: [
          { path: '', element: <Home /> },
          { path: 'add/single', element: <AddTransaction /> },
          { path: 'add/split', element: <AddSplitTransaction /> },
        ],
      },
      {
        path: 'tags',
        children: [
          {
            path: '',
            element: <Tags />,
          },
        ],
      },
      {
        path: 'tags',
        children: [
          {
            path: '',
            element: <Tags />,
          },
        ],
      },
    ],
  },
  {
    path: '/test',
    element: <Test />,
  },
  {
    path: '/*',
    element: <div>Not Found</div>,
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
