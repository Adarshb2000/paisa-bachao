import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import App from './App.tsx'
import AddAccount from './Pages/Accounts/Forms/AddAccount.tsx'
import Accounts from './Pages/Accounts'
import PageLayout from './Components/PageLayout'

import './index.css'
import './styles/global.scss'
import Account from './Pages/Accounts/Account/index.tsx'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: <PageLayout />,
    children: [
      { path: '', element: <App /> },
      { path: 'add-account', element: <AddAccount /> },
      { path: 'accounts', element: <Accounts /> },
      { path: 'accounts/:id', element: <Account /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
