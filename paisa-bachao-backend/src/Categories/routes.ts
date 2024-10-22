import express from 'express'
import {
  CreateCategory,
  DeleteCategory,
  EditCategory,
  GetAllCategories,
  GetCategory,
  UpdateCategory,
} from './handler'

const categoryRouter = express.Router()

categoryRouter.route('/').get(GetAllCategories).post(CreateCategory)
categoryRouter.route('/update-many').put(UpdateCategory)
categoryRouter
  .route('/:id')
  .get(GetCategory)
  .put(EditCategory)
  .patch(EditCategory)
  .delete(DeleteCategory)

export default categoryRouter
