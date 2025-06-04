import * as z from 'zod';

export const signInSchema = z.object({
  email: z.string().min(1, { message: 'Please enter your email.' }),
  password: z.string().min(1, { message: 'Please enter your password.' }),
  twoFactorCode: z
    .string()
    .length(6, { message: 'Code must be exactly 6 digits.' })
    .regex(/^\d{6}$/, {
      message: 'Code must contain only numbers.',
    })
    .optional(),
});
