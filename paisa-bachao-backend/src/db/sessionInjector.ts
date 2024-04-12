import { Handler } from 'express'
import prisma from '.'

const sessionInjector: Handler = (req, res, next) => {
  req.prisma = prisma.$extends({
    query: {
      $allModels: {
        $allOperations: async ({ query, args, operation, model }) => {
          if (operation === 'create') {
            args.data.userID = req.user?.id
            if (model === 'Transaction') {
              if (
                args.data.transactionFragments?.createMany?.data instanceof
                Array
              ) {
                args.data.transactionFragments?.createMany?.data.forEach(
                  d => (d.userID = req.user?.id)
                )
              }
            }
            return query(args)
          } else if (operation === 'createMany') {
            if (args.data instanceof Array)
              args.data.forEach(d => (d.userID = req.user?.id))
            return query(args)
          }
          if (!args.where) args.where = {}
          args.where.userID = req.user?.id
          return query(args)
        },
      },
    },
  })
  next()
}

export default sessionInjector
