import express from 'express'
import { UserRoutes } from '../modules/user/user.route'
import { AuthRoutes } from '../modules/auth/auth.route'
import { ServiceRoutes } from '../modules/service/service.route'
import { BookingRoutes } from '../modules/booking/booking.route'

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
]

moduleRoutes.forEach(route => router.use(route.path, route.route))
export default router
