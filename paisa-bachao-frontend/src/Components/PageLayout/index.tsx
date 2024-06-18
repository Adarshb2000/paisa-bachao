import { Outlet } from 'react-router-dom'
import Header from '../Header'
import './index.scss'
import useAuth from '../../hooks/useAuth'
import { ThreeDots } from 'react-loader-spinner'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const PageLayout = () => {
  // const auth = useAuth()
  // if (auth.loading) {
  //   return (
  //     <div className='grid h-screen w-screen place-items-center'>
  //       <ThreeDots width={80} height={80} />
  //     </div>
  //   )
  // }
  // if (!auth.authenticated) {
  //   return <div>Login Unsuccessful. Redirecting to Login Page.</div>
  // }
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
