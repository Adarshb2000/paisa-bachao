declare namespace Express {
  export interface Request {
    user?: {
      email: string
      id: string
      name: string
    }
    prisma?: any
  }
}
