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
router.get('/category', ServiceController.getByCategory)

router.get('/:id', ServiceController.getSingleService)
router.patch(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  ServiceController.updateSingleService,
)

router.delete(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  ServiceController.deleteSingleService,
)

export const ServiceRoutes = router
