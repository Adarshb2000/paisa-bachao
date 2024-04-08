import { Link, NavLink } from 'react-router-dom'
import './index.scss'
import { navLinkClass } from '../../helpers/helpers'
import { GiHamburgerMenu } from 'react-icons/gi'
import { useRef, useState } from 'react'
import { BiX } from 'react-icons/bi'

const Header = () => {
  const [navbar, showNavbar] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  return (
    <header className='header'>
      <Link to={'/'} className='main-heading'>
        Paisa Bachao
      </Link>
      <button onClick={() => showNavbar(!navbar)}>
        {!navbar ? <GiHamburgerMenu /> : <BiX className='text-3xl' />}
      </button>
      <nav
        className={navbar ? 'active' : ''}
        ref={navRef}
        onClick={() => {
          showNavbar(false)
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
        </ul>
      </nav>
    </header>
  )
}

export default Header
