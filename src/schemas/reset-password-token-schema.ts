import { z } from 'zod';

export const resetPasswordTokenSchema = z.object({
  token: z
    .string()
    .uuid({ message: 'Invalid or missing reset link. Please try again.' }),
});
