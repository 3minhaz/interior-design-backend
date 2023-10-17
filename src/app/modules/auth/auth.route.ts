import express from 'express'
import { AuthController } from './auth.controller'
import { ENUM_USER_ROLE } from '../../../enums/user'
import auth from '../../middlewares/auth'
import validateRequest from '../../middlewares/validateRequest'
import { AuthValidation } from './auth.validation'

const router = express.Router()

router.post('/login', AuthController.loginUser)

router.post('/refresh-token', AuthController.refreshToken)

router.post(
  '/:id/addAdmin',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  AuthController.addAdmin,
)

router.post(
  '/change-password',
  validateRequest(AuthValidation.changePasswordZodSchema),
  auth(
    ENUM_USER_ROLE.SUPER_ADMIN,
    ENUM_USER_ROLE.ADMIN,
    ENUM_USER_ROLE.CUSTOMER,
  ),
  AuthController.changePassword,
)

export const AuthRoutes = router
