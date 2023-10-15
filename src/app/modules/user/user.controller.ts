import { Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import { UserService } from './user.service'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import pick from '../../../shared/pick'
import { userFilterableFields } from './user.constant'
import { paginationFields } from '../../../constants'

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

export const getAllUser = catchAsync(async (req: Request, res: Response) => {
  const filters = pick(req.query, userFilterableFields)
  const options = pick(req.query, paginationFields)
  const result = await UserService.getAllUser(filters, options)
  sendResponse(res, {
    success: true,
    message: 'Fetched users successfully',
    statusCode: httpStatus.OK,
    meta: result.meta,
    data: result.data,
  })
})

export const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await UserService.getSingleUser(id)
  sendResponse(res, {
    success: true,
    message: 'Fetched single user successfully',
    statusCode: httpStatus.OK,

    data: result,
  })
})

export const UserController = { createUser, getAllUser, getSingleUser }
