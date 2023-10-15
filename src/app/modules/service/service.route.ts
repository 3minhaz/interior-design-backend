import express from 'express'
import auth from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../../enums/user'
import { ServiceController } from './service.controller'

const router = express.Router()

router.post(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  ServiceController.createService,
)

router.get('/', ServiceController.getAllServices)

export const ServiceRoutes = router
