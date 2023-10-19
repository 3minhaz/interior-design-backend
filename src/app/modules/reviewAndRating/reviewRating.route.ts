import express from 'express'
import auth from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../../enums/user'
import { ReviewRatingController } from './reviewRating.controller'

const router = express.Router()

router.get(
  '/get/:id',
  auth(ENUM_USER_ROLE.CUSTOMER),
  ReviewRatingController.findReview,
)

router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.CUSTOMER),
  ReviewRatingController.insertReview,
)

export const ReviewAndRatingRoutes = router
