import { Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { AuthService } from './auth.service'
import httpStatus from 'http-status'
import config from '../../../config'

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const data = req.body
  const result = await AuthService.loginUser(data)
  const { refreshToken, ...others } = result

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  }

  res.cookie('refreshToken', refreshToken, cookieOptions)
  sendResponse(res, {
    success: true,
    message: 'User Logged in successfully',
    statusCode: httpStatus.OK,
    data: others,
  })
})

export const AuthController = { loginUser }
