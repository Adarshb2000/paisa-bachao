import './index.scss'

import { Link, NavLink } from 'react-router-dom'
import { useContext, useRef, useState } from 'react'

import { AuthContext } from '../../Contexts/AuthContext'
import { BiX } from 'react-icons/bi'
import { GiHamburgerMenu } from 'react-icons/gi'
import { IoLogOutOutline } from 'react-icons/io5'
import { navLinkClass } from '../../helpers/helpers'

const Header = () => {
  const [navbar, setNavbar] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const auth = useContext(AuthContext)

  return (
    <header className='header'>
      <Link to={'/'}>Paisa Bachao</Link>
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
