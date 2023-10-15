import express from 'express'
import auth from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../../enums/user'
import { BookingController } from './booking.controller'

const router = express.Router()

router.post('/', auth(ENUM_USER_ROLE.CUSTOMER), BookingController.createBooking)
router.get(
  '/',
  auth(
    ENUM_USER_ROLE.CUSTOMER,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.SUPER_ADMIN,
  ),
  BookingController.getAllBooking,
)

export const BookingRoutes = router
