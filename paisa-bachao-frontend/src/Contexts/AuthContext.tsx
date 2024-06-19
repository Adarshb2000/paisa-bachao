import { createContext, useEffect, useRef, useState } from 'react'

import { Auth } from '../types'
import keycloak from '../api/keycloak'

export const AuthContext = createContext<Auth>({
  authenticated: false,
  token: undefined,
  tokenParsed: undefined,
  loading: true,
  name: '',
  id: '',
  logout: async () => {},
})

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const run = useRef(false)
  const [auth, setAuth] = useState<Auth>({
    loading: true,
  } as Auth)

  useEffect(() => {
    if (run.current) return
    run.current = true
    keycloak
      .init({ onLoad: 'login-required', checkLoginIframe: false })
      .then(authenticated => {
        if (authenticated) {
          setAuth({
            authenticated: true,
            token: keycloak.token,
            tokenParsed: keycloak.tokenParsed,
            loading: false,
            name: keycloak.tokenParsed?.name,
            id: keycloak.tokenParsed?.sub ?? '',
            logout: async () => {
              await keycloak.logout()
              setAuth({
                authenticated: false,
                token: undefined,
                tokenParsed: undefined,
                loading: false,
                name: '',
                id: '',
                logout: async () => {},
              })
            },
          })
        } else {
          setAuth({
            authenticated: false,
            token: undefined,
            tokenParsed: undefined,
            loading: false,
            name: '',
            id: '',
            logout: async () => {},
          })
        }
      })
  }, [])

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export default AuthProvider
