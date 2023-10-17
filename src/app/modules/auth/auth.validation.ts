import { z } from 'zod'

const changePasswordZodSchema = z.object({
  body: z.object({
    newPassword: z.string({
      required_error: 'New password is required',
    }),
    previousPassword: z.string({
      required_error: 'Previous password is required',
    }),
  }),
})

export const AuthValidation = { changePasswordZodSchema }
