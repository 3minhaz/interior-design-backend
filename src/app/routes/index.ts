import express from 'express'
import { UserRoutes } from '../modules/user/user.route'
import { AuthRoutes } from '../modules/auth/auth.route'
import { ServiceRoutes } from '../modules/service/service.route'
import { BookingRoutes } from '../modules/booking/booking.route'
import { ReviewAndRatingRoutes } from '../modules/reviewAndRating/reviewRating.route'

const router = express.Router()

const moduleRoutes = [
  {
    path: '/user',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/service',
    route: ServiceRoutes,
  },
  {
    path: '/booking',
    route: BookingRoutes,
  },
  {
    path: '/reviews',
    route: ReviewAndRatingRoutes,
  },
]

moduleRoutes.forEach(route => router.use(route.path, route.route))
export default router
