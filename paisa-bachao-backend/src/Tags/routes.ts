import express from 'express'
import {
  CreateTag,
  DeleteTag,
  EditTag,
  GetAllTags,
  GetTag,
  UpdateTag,
} from './handler'

const tagRouter = express.Router()

tagRouter.route('/').get(GetAllTags).post(CreateTag)
tagRouter.route('/update-many').put(UpdateTag)
tagRouter
  .route('/:id')
  .get(GetTag)
  .put(UpdateTag)
  .patch(EditTag)
  .delete(DeleteTag)

export default tagRouter
