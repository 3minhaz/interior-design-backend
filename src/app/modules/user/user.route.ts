import { ENUM_USER_ROLE } from './../../../enums/user'
import express from 'express'
import { UserController } from './user.controller'
import validateRequest from '../../middlewares/validateRequest'
import { UserValidation } from './user.validation'
import auth from '../../middlewares/auth'

const router = express.Router()

router.post(
  '/',
  validateRequest(UserValidation.validateCreateUser),
  UserController.createUser,
)

router.get(
  '/',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserController.getAllUser,
)

router.get(
  '/:id',
  auth(ENUM_USER_ROLE.SUPER_ADMIN, ENUM_USER_ROLE.ADMIN),
  UserController.getSingleUser,
)

export const UserRoutes = router
