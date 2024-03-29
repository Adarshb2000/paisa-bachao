import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import AddAccount from './Pages/Accounts/Forms/AddAccount.tsx'
import Accounts from './Pages/Accounts'
import PageLayout from './Components/PageLayout'
import Home from './Pages/Transactions/index.tsx'
import Account from './Pages/Accounts/account/index.tsx'

import './index.css'
import './styles/global.scss'
import Test from './test.tsx'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: <PageLayout />,
    children: [
      { path: '', element: <Home /> },
      { path: 'add-account', element: <AddAccount /> },
      { path: 'accounts', element: <Accounts /> },
      { path: 'accounts/:id', element: <Account /> },
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
