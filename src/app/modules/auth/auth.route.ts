import express from 'express'
import { AuthController } from './auth.controller'
import { ENUM_USER_ROLE } from '../../../enums/user'
import auth from '../../middlewares/auth'

const router = express.Router()

router.post('/login', AuthController.loginUser)

router.post(
  '/:id/addAdmin',
  auth(ENUM_USER_ROLE.SUPER_ADMIN),
  AuthController.addAdmin,
)

export const AuthRoutes = router
