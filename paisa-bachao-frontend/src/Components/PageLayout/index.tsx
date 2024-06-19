import './index.scss'
import 'react-toastify/dist/ReactToastify.css'

import { AuthContext } from '../../Contexts/AuthContext'
import Header from '../Header'
import { Outlet } from 'react-router-dom'
import { ThreeDots } from 'react-loader-spinner'
import { ToastContainer } from 'react-toastify'
import { useContext } from 'react'

const PageLayout = () => {
  const auth = useContext(AuthContext)
  if (auth.loading) {
    return (
      <div className='grid h-screen w-screen place-items-center'>
        <ThreeDots width={80} height={80} />
      </div>
    )
  }
  if (!auth.authenticated) {
    return <div>Login Unsuccessful. Redirecting to Login Page.</div>
  }
  return (
    <div className='page-layout'>
      <Header />
      <main className='relative px-8 py-4'>
        <Outlet />
      </main>
      <ToastContainer
        autoClose={4000}
        position='top-right'
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        draggable
      />
    </div>
  )
}

export default PageLayout
