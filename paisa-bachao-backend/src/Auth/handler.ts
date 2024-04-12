import { Handler } from 'express'
import jwt from 'jsonwebtoken'

const authHandler: Handler = (req, res, next) => {
  const authorization = req.header('Authorization')
  if (!authorization) {
    return res.status(401).send('Bad request. Authorization header not found.')
  }
  const token = authorization.split(' ')[1]
  if (!token) {
    return res.status(401).send('Bad request. Token not found.')
  }
  try {
    const PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----\n${process.env.PUBLIC_KEY}\n-----END PUBLIC KEY-----`
    const decoded = jwt.verify(token, PUBLIC_KEY, {
      algorithms: ['RS256'],
    }) as { email: string; sub: string; name: string }
    req.user = {
      email: decoded.email,
      id: decoded.sub,
      name: decoded.name,
    }
    next()
  } catch (error) {
    return res.status(401).send('Unauthorized')
  }
}

export default authHandler
