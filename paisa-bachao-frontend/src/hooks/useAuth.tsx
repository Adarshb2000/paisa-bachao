import Keycloak from 'keycloak-js'
import { useEffect, useRef, useState } from 'react'

interface Auth {
  authenticated: boolean
  token: string | undefined
  tokenParsed: any
  loading: boolean
  logout: () => void
}

export const client = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
})

const useAuth = () => {
  const run = useRef(false)
  const [auth, setAuth] = useState<Auth>({
    authenticated: false,
    token: undefined,
    tokenParsed: null,
    loading: true,
    logout: () => {},
  })

  useEffect(() => {
    if (run.current) return
    run.current = true
    client
      .init({ onLoad: 'login-required' })
      .then(authenticated => {
        setAuth({
          authenticated: authenticated,
          token: client.token,
          tokenParsed: client.tokenParsed,
          logout: client.logout,
          loading: false,
        })
      })
      .catch(err => {
        console.error(err)
      })
  }, [])

  return auth
}

export default useAuth
