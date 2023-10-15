import { Request, Response } from 'express'
import catchAsync from '../../../shared/catchAsync'
import { BookingService } from './booking.service'
import sendResponse from '../../../shared/sendResponse'
import httpStatus from 'http-status'
import pick from '../../../shared/pick'
import { bookingFilterableFields } from './booking.constant'
import { paginationFields } from '../../../constants'

const createBooking = catchAsync(async (req: Request, res: Response) => {
  //   const id = req.params.id
  const payload = req.body
  const result = await BookingService.createBooking(payload)
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Booking created successfully',

    data: result,
  })
})

const getAllBooking = catchAsync(async (req: Request, res: Response) => {
  const userInfo = req.user
  const filters = pick(req.query, bookingFilterableFields)
  const options = pick(req.query, paginationFields)

  const result = await BookingService.getAllBooking(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    userInfo as any,
    filters,
    options,
  )
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Fetched user successfully',
    meta: result?.meta,
    data: result?.data,
  })
})

export const BookingController = { createBooking, getAllBooking }
