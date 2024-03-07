import validation from '@/text/validation.json'
import { z } from 'zod'

export type AccountUpdateValidation = z.infer<typeof AccountUpdateValidationSchema>

export const AccountUpdateValidationSchema = z
  .object({
    newEmail: z.string().min(1, validation.emailMin).max(255, validation.emailMax).email(validation.emailIncorect),
    newPassword: z.string().min(0).max(72, validation.passwordMax),
    newPasswordConfirm: z.string().min(0).max(72, validation.passwordMax),
  })
  .refine(data => data.newPassword === data.newPasswordConfirm, {
    message: validation.passwordNoMatch,
    path: ['newPasswordConfirm'],
  })