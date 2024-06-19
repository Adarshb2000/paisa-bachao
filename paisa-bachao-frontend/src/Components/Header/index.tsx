import { Link, NavLink } from 'react-router-dom'
import './index.scss'
import { navLinkClass } from '../../helpers/helpers'
import { GiHamburgerMenu } from 'react-icons/gi'
import { useContext, useRef, useState } from 'react'
import { BiX } from 'react-icons/bi'
import { IoLogOutOutline } from 'react-icons/io5'
import { AuthContext } from '../../Contexts/AuthContext'
// import useAuth from '../../hooks/useAuth'

const Header = () => {
  const [navbar, setNavbar] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const auth = useContext(AuthContext)

  return (
    <header className='header'>
      <Link to={'/'} className='main-heading'>
        Paisa Bachao
      </Link>
      <button onClick={() => setNavbar(!navbar)}>
        {!navbar ? <GiHamburgerMenu /> : <BiX className='text-3xl' />}
      </button>
      <nav
        className={navbar ? 'active' : ''}
        ref={navRef}
        onClick={() => {
          setNavbar(false)
        }}
      >
        <ul>
          <li>
            <NavLink to={'/'} className={navLinkClass}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to={'/accounts'} className={navLinkClass}>
              Accounts
            </NavLink>
          </li>
          <li>
            <button className='text-2xl' onClick={() => auth.logout()}>
              <IoLogOutOutline />
            </button>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
