import app from '.'
import devFn from './dev'

const PORT = process.env.PORT ?? 3000
devFn().then(() => {
  app.listen(PORT, () => {
    console.log('Server is running on port 3000')
  })
})
