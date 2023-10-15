import { z } from 'zod'

const validateCreateUser = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email(),
    password: z.string({
      required_error: 'Password is required',
    }),
    name: z.string({
      required_error: 'Name is required',
    }),
    contactNo: z.string({
      required_error: 'ContactNo. is required',
    }),
    address: z.string({
      required_error: 'Address is required',
    }),
    ProfileImage: z
      .string({
        required_error: 'ContactNo. is required',
      })
      .optional(),
  }),
})

export const UserValidation = { validateCreateUser }
