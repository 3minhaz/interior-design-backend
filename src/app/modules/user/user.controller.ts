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

const getAllUser = catchAsync(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { role } = req.user as any
  const filters = pick(req.query, userFilterableFields)
  const options = pick(req.query, paginationFields)
  const result = await UserService.getAllUser(filters, options, role)
  sendResponse(res, {
    success: true,
    message: 'Fetched users successfully',
    statusCode: httpStatus.OK,
    meta: result!.meta,
    data: result!.data,
  })
})

const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id
  const result = await UserService.getSingleUser(id)
  sendResponse(res, {
    success: true,
    message: 'Fetched single user successfully',
    statusCode: httpStatus.OK,

    data: result,
  })
})

const getAllAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.getAllAdmin()
  sendResponse(res, {
    success: true,
    message: 'Fetched all admin  successfully',
    statusCode: httpStatus.OK,

    data: result,
  })
})

const updateSingleUser = catchAsync(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { role } = req.user as any
  const id = req.params.id
  const payload = req.body
  const result = await UserService.updateSingleUser(id, role, payload)
  sendResponse(res, {
    success: true,
    message: 'Updated single user successfully',
    statusCode: httpStatus.OK,

    data: result,
  })
})

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id

  const result = await UserService.deleteUser(id)
  sendResponse(res, {
    success: true,
    message: 'User deleted successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { id } = req.user as any

  const result = await UserService.getMyProfile(id)
  sendResponse(res, {
    success: true,
    message: 'My profile fetched successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { id } = req.user as any
  const data = req.body

  const result = await UserService.updateMyProfile(id, data)
  sendResponse(res, {
    success: true,
    message: 'My profile updated successfully',
    statusCode: httpStatus.OK,
    data: result,
  })
})

export const UserController = {
  createUser,
  getAllUser,
  getSingleUser,
  updateSingleUser,
  deleteUser,
  getMyProfile,
  updateMyProfile,
  getAllAdmin,
}
