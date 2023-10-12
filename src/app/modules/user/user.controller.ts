import { Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import { UserService } from './user.service'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'

const createUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body
  const result = await UserService.createUser(payload)
  sendResponse(res, {
    success: true,
    message: 'User Created successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

export const UserController = { createUser }
