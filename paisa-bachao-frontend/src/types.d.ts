export interface Auth {
  authenticated: boolean
  token: string | undefined
  tokenParsed:
    | {
        [key: string]: any
      }
    | undefined
  loading: boolean
  name: string
  id: string
  logout: () => Promise<void>
}
