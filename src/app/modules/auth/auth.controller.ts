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

const addAdmin = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await AuthService.addAdmin(id)

  sendResponse(res, {
    success: true,
    message: 'User role to admin added successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies

  const result = await AuthService.refreshToken(refreshToken)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: result,
  })
})

const changePassword = catchAsync(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { id } = req.user as any
  console.log(req.body)
  const { previousPassword, newPassword } = req.body

  const result = await AuthService.changePassword(
    id,
    previousPassword,
    newPassword,
  )

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Change password successfully !',
    data: result,
  })
})

export const AuthController = {
  loginUser,
  addAdmin,
  refreshToken,
  changePassword,
}
