import { Outlet } from 'react-router-dom'
import Header from '../Header'
import './index.scss'

const PageLayout = () => (
  <div className='page-layout'>
    <Header />
    <main className='relative px-8 py-4'>
      <Outlet />
    </main>
  </div>
)

export default PageLayout
