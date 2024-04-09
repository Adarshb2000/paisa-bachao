import { Outlet } from 'react-router-dom'
import Header from '../Header'
import './index.scss'
import useAuth from '../../hooks/useAuth'
import { ThreeDots } from 'react-loader-spinner'

const PageLayout = () => {
  const auth = useAuth()
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
    </div>
  )
}

export default PageLayout
